# Mechanistic interpretability presentation

This separate project is an interactive web presentation for undergraduate programmers, connected to NJIT AI Safety and its technical fellowship. Its purpose is to build intuition and interest in technical AI safety. The source of truth is `presentation-plan.md`; read it before changing the presentation.

Authorized scope (October 11, 2026): the shell plus draft versions of every scene, with synthetic, labeled data (see the plan's implementation record). Real data, verified research claims, and publication still require the user's request. Keep this project alongside `club-website`, never inside that repository. Preserve existing work and unrelated projects.

Run with `npm run dev`; check with `npm run build` (typecheck + build). Code layout: `src/shell` (navigation, captions, controls, preferences), `src/content/stages.ts` (narrative sequence and copy), `src/stages/*` (one purpose-built component per stage), `src/lib` (pure math helpers). The `structure-test` stage is scaffolding to delete once real stages exist.

Follow the refusal-centered narrative: representation-space intuition → linear measurement and prediction → correlation versus causation → ablation and steering → broader examples and qualified takeaway. Preserve the staged, persistent diagrams and meaningful interactions; do not reduce the plan to a generic slide outline or front-load a transformer lecture.

Aim for a beautiful, simple, fast web experience inspired by Red Blob Games and Nicky Case’s The Evolution of Trust. Plan minimal live-presenter screens and optional explanatory captions for independent viewers. Stack selected for the shell: React + TypeScript + Vite, Motion, CSS Modules, hand-written SVG. Title, typography, palette (current values are provisional), digit model, real refusal experiment, and runtime remain open.

Accuracy requirements:
- Distinguish learned weights from input-dependent activations; the visual spaces concern activations or representations.
- Label 2D/3D diagrams as simplifications. Do not imply universal linear structure, clean separation, or one interpretable meaning per neuron.
- Distinguish probing (reading), ablation (removing a projection), and steering (adding a direction). Readability is not causality; causal influence on refusal is not a complete model explanation or safety solution.
- For unit direction `u`, ablation is `h - dot(h, u) * u`; additive steering is `h + alpha * u`. Do not animate projection removal as subtraction of a fixed centroid arrow or guarantee a classifier-boundary crossing.
- The teaching diagram now groups harmful/harmless prompts (user request, October 11), matching the refusal paper's instruction contrast; the resulting direction must still be shown to relate to refusal behavior. Verify actual methodology before making exact empirical claims.
- Preserve data provenance. Label synthetic illustrations and outputs in the captions, not with on-slide chips or tags (user request, October 11); use verified measured or recorded responses for real-result claims, with model/setup limits. Avoid displaying dangerous instructions.
- Treat linked studies as research leads until checked. Refusal prediction is not harmfulness or intent detection; factual truth readouts do not establish a universal lie detector.

Do not lock in architecture or add generic coding requirements prematurely. Record unresolved choices and research findings in the plan so future sessions can continue without the original conversation.
