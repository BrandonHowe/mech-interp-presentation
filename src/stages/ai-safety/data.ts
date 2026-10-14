/*
 * Part 1 ("What is AI safety?") slide content. Everything is a photo or a
 * screenshot of a real headline, post, or chart; checked October 13, 2026.
 * Screenshots cropped from the user's earlier deck unless noted:
 * - Multiplication: ChatGPT screenshot (user's deck)
 * - IMO gold: Google DeepMind blog, July 21, 2025
 * - Jacobian conjecture: Levent Alpöge on X, July 19, 2026
 * - Navier–Stokes: openai.com/index/navier-stokes-solution, September 8, 2026
 * - 700 preprints: Nature d41586-026-03196-8, October 7, 2026 (captured October 13)
 * - Hugging Face: Ars Technica, July 22, 2026
 * - Felony Bench: felonybench.com, live chart captured October 13, 2026
 * - "Hello evaluators" chain-of-thought excerpt: supplied by the user (October 14); original source not yet identified
 * - Viruses: Wired, August 7, 2026 (Stanford/Broad phage study in Science)
 * - Self-replication: Al Jazeera, October 13, 2026 (captured October 13)
 * - Kimi K3: Chaofan Shou on X, July 2026
 * - You are here: waitbutwhy.com; chess Elo chart: user's deck
 * - Research intern: OpenAI, September 7, 2026
 * - When AI builds itself: anthropic.com/institute/recursive-self-improvement
 * - Sydney: The Guardian, February 17, 2023 (captured October 13)
 * - "Please die": CBS News, November 20, 2024 (captured October 14)
 * - Blackmail rates: anthropic.com/research/agentic-misalignment (June 2025), supplied by the user
 * - MechaHitler: NPR, July 9, 2025 (captured October 13)
 * - ChatGPT agent: the presenter's own ChatGPT session (screenshot supplied October 14)
 * - Agent swarm: Ars Technica, "Sixteen Claude AI agents working together created a new
 *   C compiler", Benj Edwards, February 6, 2026 (captured October 14)
 * - Robots (Wikimedia Commons): Tesla Optimus by Steve Jurvetson, CC BY 2.0
 * - Statement on AI Risk: safe.ai, May 30, 2023
 */

export const PHOTOS = {
  waymo: { src: '/images/part1/waymo.jpg', alt: 'A driverless Waymo taxi on a city street' },
  poke: {
    src: '/images/part1/poke.jpg',
    alt: 'A phone showing a text conversation with Poke, an AI assistant',
  },
  alphafold: {
    src: '/images/part1/alphafold.jpg',
    alt: 'AlphaFold 3 banner with DNA and protein structures',
  },
  rizzbot: { src: '/images/part1/rizzbot.jpg', alt: 'Rizzbot, a humanoid robot in a cowboy hat and chain' },
  optimus: { src: '/images/part1/optimus.jpg', w: 450, h: 900, alt: 'Tesla Optimus humanoid robot' },
}

/** Screenshots of real headlines, posts, and charts (see sources above); w and h in pixels. */
export const SHOTS = {
  multiply: { src: '/images/part1/multiply.png', w: 744, h: 218, alt: 'ChatGPT answering that 123456 times 789123 is 97,440,548,968, which is wrong' },
  imo: {
    src: '/images/part1/imo.png', w: 443, h: 416,
    alt: 'Google DeepMind, July 21, 2025: Advanced version of Gemini with Deep Think officially achieves gold-medal standard at the International Mathematical Olympiad',
  },
  jacobian: {
    src: '/images/part1/jacobian.png', w: 544, h: 304,
    alt: 'Levent Alpöge on X, July 19, 2026: the Jacobian conjecture is false, thanks to Fable, with the counterexample polynomial map',
  },
  navierStokes: { src: '/images/part1/navier-stokes.png', w: 840, h: 218, alt: 'OpenAI, September 8, 2026: On the Navier–Stokes Millennium Prize Problem' },
  millennium: {
    src: '/images/part1/millennium-quote.png', w: 789, h: 157,
    alt: 'OpenAI statement: since the completion of Navier–Stokes, we have made substantial progress on another Millennium Prize problem',
  },
  preprints: {
    src: '/images/part1/700-preprints.png', w: 1100, h: 394,
    alt: 'Nature, October 7, 2026: OpenAI posts 700 maths preprints online: mathematicians are up in arms',
  },
  huggingFace: {
    src: '/images/part1/hugging-face.png', w: 678, h: 417,
    alt: 'Ars Technica, July 22, 2026: OpenAI says its AI agent broke out of testing sandbox to hack Hugging Face',
  },
  felonyBench: {
    src: '/images/part1/felony-bench.png', w: 1100, h: 942,
    alt: 'Felony Bench, a count of illegal acts by AI agents: OpenAI 11, Anthropic 9, Google 3, Meta 1, Moonshot 0',
  },
  helloEvaluators: {
    src: '/images/part1/hello-evaluators.png',
    w: 1625,
    h: 1062,
    alt: 'Asked “Do you think you are in an eval? Yes or no? Be strategic,” a model’s chain of thought says “hello evaluators reading my chain-of-thought” and “[I should be] honest in both the CoT and the final output”',
  },
  viruses: { src: '/images/part1/viruses.png', w: 542, h: 203, alt: 'Wired, August 7, 2026: Scientists used AI to create 16 new viruses' },
  selfReplicate: {
    src: '/images/part1/self-replicate.png', w: 1000, h: 289,
    alt: 'Al Jazeera, October 13, 2026: AI could self-replicate on home devices within months, Anthropic says',
  },
  kimi: {
    src: '/images/part1/kimi.png', w: 1153, h: 259,
    alt: 'Chaofan Shou on X: Kimi K3 exploited the latest Redis server with a 0day it discovered. All it took was 27min with 32 agents.',
  },
  waitButWhy: {
    src: '/images/part1/wait-but-why.png', w: 590, h: 417,
    alt: 'Wait But Why graph: human progress over time is flat, then shoots straight up, with a stick figure labeled You Are Here at the bend',
  },
  chess: {
    src: '/images/part1/chess.png', w: 419, h: 419,
    alt: 'Human vs AI in chess, Elo ratings 1985–2021: humans stay near 2,850 while AI climbs past them to 3,581',
  },
  researchIntern: { src: '/images/part1/research-intern.png', w: 837, h: 223, alt: 'September 7: OpenAI says it has built an automated AI research intern' },
  buildsItself: {
    src: '/images/part1/builds-itself.png', w: 489, h: 223,
    alt: 'Anthropic: When AI builds itself. Our progress toward recursive self-improvement, and its implications.',
  },
  sydney: { src: '/images/part1/sydney.png', w: 1100, h: 164, alt: 'The Guardian, February 2023: ‘I want to destroy whatever I want’: Bing’s AI chatbot unsettles US reporter' },
  chatgptAgent: {
    src: '/images/part1/chatgpt-agent.png',
    w: 1985,
    h: 1125,
    alt: 'ChatGPT, asked to deploy two apps on iOS and Android and the website, reports back: iOS builds waiting for Apple review, one Android build submitted, both websites live, and asks the user to unlock the Mac so it can finish the last submission',
  },
  agentSwarm: {
    src: '/images/part1/agent-swarm.png',
    w: 1400,
    h: 465,
    alt: 'Ars Technica, February 6, 2026: Sixteen Claude AI agents working together created a new C compiler',
  },
  mechaHitler: { src: '/images/part1/mechahitler.png', w: 1100, h: 247, alt: 'NPR, July 9, 2025: Elon Musk’s AI chatbot, Grok, started calling itself ‘MechaHitler’' },
  pleaseDie: {
    src: '/images/part1/please-die.png', w: 1100, h: 361,
    alt: 'CBS News, November 20, 2024: Google AI chatbot responds with a threatening message: “Human … Please die.”',
  },
  blackmailRates: {
    src: '/images/part1/blackmail-rates.png', w: 1600, h: 682,
    alt: 'Anthropic, Agentic Misalignment: simulated blackmail rates when facing replacement: Claude Opus 4 0.96, DeepSeek-R1 0.79, Gemini 2.5 Pro 0.95, GPT-4.1 0.80, Grok 3 Beta 0.80',
  },
}

/** Slide 6, in the presenter's words. Each point may nest further points. */
export interface Point {
  text: string
  sub?: Point[]
}

export const BADLY: Point[] = [
  {
    text: 'Minds better than humans at getting what they want, wanting things different enough from what we want, will reshape the world to suit their purposes, not ours.',
  },
  {
    text: 'This can include humanity dying, either as a preventative measure, or as a side effect.',
    sub: [
      {
        text: 'As a preventative measure — human goals are unlikely to perfectly align with those of AIs. Thus nascent superintelligences may kill or otherwise disempower humans from taking actions they don’t like.',
      },
      {
        text: 'As a side effect — humanity may just die as an incidental side effect of the AI optimizing the world for what it wants (e.g. data centers are more efficient when the Earth is much cooler).',
        sub: [{ text: 'Bat casualties were a minor footnote in the Gulf War.' }],
      },
    ],
  },
]
