"""
Offline: train a small VAE with a 2D latent space on MNIST, then precompute
decoded digits on a grid for the "digit space" stage. Nothing runs in the browser.

Outputs:
  public/digits/grid.png            GRID x GRID tiles of 28x28 decoded digits (row 0 = top = max z2)
  src/stages/digit/latent.json      latent range, grid size, and encoded test-set points

Run: uv run --with torch --with torchvision --with pillow python train.py
"""
import json
import os

import torch
import torch.nn as nn
import torch.nn.functional as F
from PIL import Image
from torchvision import datasets, transforms

torch.manual_seed(0)
ROOT = os.path.join(os.path.dirname(__file__), '..', '..')
OUT = os.path.join(ROOT, 'public', 'digits')
GRID = 41
RANGE = 2.5  # latent coordinates shown: [-RANGE, RANGE] on both axes
EPOCHS = 30


class VAE(nn.Module):
    def __init__(self):
        super().__init__()
        self.enc = nn.Sequential(nn.Linear(784, 512), nn.ReLU(), nn.Linear(512, 256), nn.ReLU())
        self.mu = nn.Linear(256, 2)
        self.logvar = nn.Linear(256, 2)
        self.dec = nn.Sequential(
            nn.Linear(2, 256), nn.ReLU(), nn.Linear(256, 512), nn.ReLU(), nn.Linear(512, 784)
        )

    def encode(self, x):
        h = self.enc(x)
        return self.mu(h), self.logvar(h)

    def forward(self, x):
        mu, logvar = self.encode(x)
        z = mu + torch.randn_like(mu) * torch.exp(0.5 * logvar)
        return self.dec(z), mu, logvar


def main():
    os.makedirs(OUT, exist_ok=True)
    tf = transforms.ToTensor()
    root = os.path.join(os.path.dirname(__file__), 'data')
    train = datasets.MNIST(root, train=True, download=True, transform=tf)
    test = datasets.MNIST(root, train=False, download=True, transform=tf)
    loader = torch.utils.data.DataLoader(train, batch_size=128, shuffle=True)

    model = VAE()
    opt = torch.optim.Adam(model.parameters(), lr=1e-3)
    for epoch in range(EPOCHS):
        total = 0.0
        for x, _ in loader:
            x = x.view(-1, 784)
            logits, mu, logvar = model(x)
            rec = F.binary_cross_entropy_with_logits(logits, x, reduction='sum')
            kl = -0.5 * torch.sum(1 + logvar - mu.pow(2) - logvar.exp())
            loss = rec + kl
            opt.zero_grad()
            loss.backward()
            opt.step()
            total += loss.item()
        print(f'epoch {epoch + 1}: loss {total / len(train):.1f}', flush=True)

    model.eval()
    torch.save(model.state_dict(), os.path.join(os.path.dirname(__file__), 'vae.pt'))
    with torch.no_grad():
        # Decoded grid. Row 0 is the top of the plane (largest z2).
        coords = torch.linspace(-RANGE, RANGE, GRID)
        sheet = Image.new('L', (GRID * 28, GRID * 28))
        for row in range(GRID):
            z2 = coords[GRID - 1 - row]
            z = torch.stack([coords, torch.full((GRID,), z2)], dim=1)
            imgs = torch.sigmoid(model.dec(z)).view(-1, 28, 28)
            for col in range(GRID):
                # Ink is dark on light paper.
                tile = ((1 - imgs[col]) * 255).byte().numpy()
                sheet.paste(Image.fromarray(tile, 'L'), (col * 28, row * 28))
        sheet.save(os.path.join(OUT, 'grid.png'), optimize=True)

        # A sample of encoded test digits (latent means), for showing where real digits land.
        xs = test.data[:2000].float().div(255).view(-1, 784)
        mu, _ = model.encode(xs)
        points = [
            [round(float(a), 3), round(float(b), 3), int(label)]
            for (a, b), label in zip(mu.tolist(), test.targets[:2000].tolist())
        ]

    meta = {
        'grid': GRID,
        'range': RANGE,
        'tile': 28,
        'model': 'VAE, 2D latent, MLP 784-512-256 encoder / mirrored decoder, '
        f'{EPOCHS} epochs on MNIST train (seed 0)',
        'points': points,
    }
    with open(os.path.join(ROOT, 'src', 'stages', 'digit', 'latent.json'), 'w') as f:
        json.dump(meta, f)
    print('done')


if __name__ == '__main__':
    main()
