# Interactive mechanistic interpretability presentation

## Project status and handoff

Captured October 7, 2026. **Update, October 11, 2026:** the user authorized implementing the presentation structure only (shell, navigation, captions, a placeholder title, and one test stage); see [Implementation record](#implementation-record). Scene content and real data are not yet authorized. This folder is a separate project alongside `club-website` in `/Users/brandonhowe/Documents/NJIT/ai-safety`. No app scaffold, dependencies, inference pipeline, or publication is part of this setup task.

This document preserves the presentation’s narrative, interactions, visual goals, scientific safeguards, research leads, and open decisions. Scene numbers describe narrative units, not a fixed slide count. A future session should read this file and `AGENTS.md`, resolve the necessary research and data questions, and implement only after the user requests it.

## Navigation

- [Audience, purpose, and agreed direction](#audience-purpose-and-agreed-direction)
- [Visual design and two viewing modes](#visual-design-and-two-viewing-modes)
- [Scene-by-scene plan](#scene-by-scene-plan)
- [Geometry and scientific accuracy](#geometry-and-scientific-accuracy)
- [Research leads and verification work](#research-leads-and-verification-work)
- [Open decisions and optional ideas](#open-decisions-and-optional-ideas)
- [Proposed site architecture](#proposed-site-architecture)
- [Future implementation suggestions](#future-implementation-suggestions)
- [Setup completion record](#setup-completion-record)
- [Implementation record](#implementation-record)

## Audience, purpose, and agreed direction

The presentation is a guest talk for undergraduate computer programmers, connected to NJIT AI Safety and the technical fellowship. The broader goal is to attract people to the club and to technical AI safety work. Assume programming ability, but no prior understanding of transformers or mechanistic interpretability.

Make it technically interesting, visually memorable, and connected to safety. Focus on **linear probing, with refusal as the main worked example**. Build intuition for representation spaces, demonstrate how a simple direction can reveal information, and then distinguish reading information from causally changing behavior.

The story progresses from intuition to measurement to intervention:

1. Title.
2. One or two mostly-text motivation scenes about safety and looking inside models.
3. A minimal neural network as a function.
4. An interactive digit representation space.
5. Optional intuitive discussion of meaningful regions/manifolds.
6. The reverse-engineering ambition and manageable questions.
7. Linear representations as a useful empirical hypothesis.
8. Refusal as the centerpiece.
9. Example activations → means → direction → illustrative boundary.
10. Prediction of a new example.
11. Description versus causation.
12. Intervention in both directions: projection removal and additive steering.
13. A short overview of other information readable from activations.
14. A qualified, exciting takeaway and connection to further exploration.

Around 40 minutes was discussed earlier, but it is neither a strict target nor a reason to pad material. Prioritize the story and interactions. Do not insert a separate abstract linear-probing lecture or front-load vocabulary.

## Visual design and two viewing modes

### Agreed design requirements

Create a web-based explanation that is beautiful, simple, and fast. Conventional PowerPoint-style slides feel limiting; custom graphics and meaningful interaction are central. Explicit inspirations are **Red Blob Games** and **Nicky Case’s The Evolution of Trust**: approachable explanations whose interactions teach the idea rather than decorate it.

Use clean typography, strong compositions, and seamless transitions. Elements may fade or slide away as a new scene enters. Some diagrams persist and evolve across several narrative steps, particularly the refusal plot. Keep the background mostly a solid color, with a subtle animated shader, gradient, or texture that adds polish without distracting. Avoid unnecessary complexity or heavyweight rendering choices.

TypeScript with React or Svelte is a likely direction, but neither framework nor rendering library is selected.

### Live presentation

Keep screens minimal because the presenter supplies the explanation aloud. Use clear visual states and labels that support the spoken story. Advancing reveals one conceptual step at a time; diagrams should retain context across steps.

### Self-guided viewing

Provide a toggle for explanatory captions or extra context. These should convey what the presenter would say, explain diagrams and transitions, and distinguish illustrative from measured results. They should not merely repeat headings or make every scene a wall of text. Both viewing modes belong in the eventual design.

### Practical considerations for later

Consider keyboard navigation; predictable forward, back, and reset behavior; touch input; readable contrast; labels and shapes beyond red/blue alone; and reduced motion. These are future implementation suggestions, not instructions to build now.

## Scene-by-scene plan

The following fields preserve the teaching intent, screen content, state changes, spoken explanation, self-guided text, future work, and caveats for each major scene.

### 1. Title

- **Teaching goal:** Establish an inviting, technically engaging presentation about looking inside models, leading toward refusal and intervention.
- **On screen:** A strong title composition, restrained graphic, and appropriate NJIT AI Safety/technical fellowship context. Exact title remains open.
- **Advance/interaction:** A simple entry transition into the motivation; do not require prior vocabulary.
- **Spoken explanation:** Introduce the exploration and the audience’s opportunity to do technical AI safety work.
- **Self-guided captions:** Briefly explain the presentation’s purpose and the path from internal representations to prediction and intervention.
- **Required future work:** Select title, typography, palette, opening graphic, and any club details to display.
- **Caveats:** Do not suggest the talk will decode the entire model or prove that a model is safe.

### 2. Why look inside? (one or two mostly-text scenes)

- **Teaching goal:** Motivate internal evidence as a complement to behavioral evaluation.
- **On screen:** Sparse text: AI systems are powerful; they could mislead us; outputs alone are insufficient to establish safety; understanding internal processing could help.
- **Advance/interaction:** Reveal the argument in one or two readable stages, with restrained transitions.
- **Spoken explanation:** Explain why observing outputs is useful but incomplete, without surveying every AI risk.
- **Self-guided captions:** Connect the claims and explain why internal measurements might add evidence.
- **Required future work:** Refine concise copy; source any specific empirical claim about deception if one is introduced.
- **Caveats:** Deception is a motivating possibility unless sourced as a particular result. Activation inspection does not automatically reveal true intentions or establish safety.

### 3. A neural network as a function

- **Teaching goal:** Supply the minimum model needed to reason about activations.
- **On screen:** Input → numerical transformations → output, with an intermediate vector. Show weights as fixed learned parameters and activations as values produced for a particular input.
- **Advance/interaction:** Change the input; intermediate activations change while weights remain fixed. Transition from the vector to spatial coordinates.
- **Spoken explanation:** Networks transform numerical representations. Intermediate states are vectors. Weights and activations are different things; this talk visualizes activation/representation space, correcting the brainstorm’s loose use of “weight space.”
- **Self-guided captions:** Explain the input-dependent intermediate state and why a vector can be visualized as a point.
- **Required future work:** Design a minimal function diagram and a clear representation of fixed versus changing quantities.
- **Caveats:** No full transformer lecture. Real representations may have thousands of coordinates; use 2D or 3D for explanation without committing to a universal dimension count.

### 4. Move around a digit space

- **Teaching goal:** Build intuition for representation spaces and movement along directions before introducing probing.
- **On screen:** A movable point on a 2D plane beside a handwritten digit image. Precomputed outputs from a small MNIST-style decoder connect the two coordinates to an image; no decoder runs during the presentation.
- **Advance/interaction:** Moving the point changes the digit or its appearance. If the chosen example demonstrates it, highlight an interpretable direction such as slant. Do not introduce a classifier or separating line here.
- **Spoken explanation:** Coordinates can encode aspects of an example; movement in a representation can change the decoded output. This provides intuition for thinking about vectors and directions.
- **Self-guided captions:** Explain the point-to-image relationship, how to interact, and whether the display is backed by a trained model or is an illustration.
- **Required future work:** Evaluate a practical small trained toy model, which is preferred if feasible. Choose decoder/model, offline sampling, and rendering approach later; runtime inference is excluded. Verify any claimed slant direction with the actual chosen example.
- **Caveats:** Do not silently choose a VAE, inference library, or training pipeline. Label synthetic or hand-designed behavior as illustrative; a morphing animation is not a measured model result. A digit decoder’s latent space and an LLM’s activation space need not behave identically. A clean slant direction is not promised.

### 5. Optional: meaningful regions of a space

- **Teaching goal:** If useful, explain that not every point is equally meaningful and examples may occupy structured or lower-dimensional regions.
- **On screen:** A restrained addition to the existing space showing regions with more plausible examples.
- **Advance/interaction:** Contrast selected points or paths without adding an extensive geometry lesson.
- **Spoken explanation:** Some parts of a representation space may correspond to more meaningful examples than others.
- **Self-guided captions:** Explain the intuition with qualifications and connect it to the preceding digit scene.
- **Required future work:** Decide whether this earns its place in the main narrative; use evidence appropriate to the selected example.
- **Caveats:** Optional, not agreed mandatory content. Do not claim all representations lie on one simple smooth manifold, all interpolation is meaningful, or a 2D drawing establishes a real model’s intrinsic dimensionality.

### 6. Reverse-engineering ambition → tractable questions

- **Teaching goal:** Explain the ideal of understanding mechanisms and why a smaller question is useful now.
- **On screen:** A concise statement of the ambition: understand internal mechanisms well enough to explain and predict behavior. Convey the scale of modern models, then focus attention on a manageable question.
- **Advance/interaction:** Move from the large ambition to a simple measurement of a direction; preserve representation-space intuition.
- **Spoken explanation:** Modern models have enormous numbers of parameters. Complete reverse engineering is currently out of reach, motivating smaller, tractable investigations. Some meaningful information may be readable with a linear measurement.
- **Self-guided captions:** Explain the ambition-to-hypothesis transition and what a linear measurement asks.
- **Required future work:** Refine the visual bridge; verify any numerical scale claims if added.
- **Caveats:** Complete understanding is not declared permanently impossible. Not every neuron has one clean human-readable meaning. Linear representations are a useful empirical hypothesis, not a universal law. Avoid unsupported human-brain analogies about hunger, truth, or concepts being literally linear.

### 7. Refusal as the central question

- **Teaching goal:** Connect the investigation directly to a safety concern and introduce the worked example.
- **On screen:** A concise safe request/response illustration and the question: could refusal be associated with a single direction in activation space?
- **Advance/interaction:** Transition into the persistent activation plot.
- **Spoken explanation:** AI safety is broad; harmful assistance is one basic concern. Providers train models to refuse certain harmful requests. Refusal offers an immediate safety connection and a memorable intervention example.
- **Self-guided captions:** Explain why refusal was chosen and what the direction hypothesis means.
- **Required future work:** Consult “Refusal in Language Models Is Mediated by a Single Direction”; verify methodology before presenting exact empirical claims. Choose safe examples.
- **Caveats:** Teach probing through this example rather than adding a detached lecture. Distinguish the pedagogical refused/non-refused grouping from the paper’s harmful/harmless instruction contrast.

### 8. Persistent plot: examples → means → direction → boundary

- **Teaching goal:** Construct an intuitive linear readout through staged geometry.
- **On screen:** Two 2D activation clusters: refused examples in red around quadrant III (lower-left), non-refused examples in blue around quadrant I (upper-right). Add labels or shapes so color is not the only cue. Each dot is an activation extracted at a consistent layer/token position, not a raw prompt floating in space. Include diverse prompt contexts and variation.
- **Advance/interaction:** Keep one coherent diagram through these stages:
  1. Reveal the example clusters.
  2. Compute and reveal each cluster’s mean with distinctive markers; fade/de-emphasize original dots.
  3. Draw the direction from the blue/non-refusal mean to the red/refusal mean: `d = mean_refused - mean_non_refused`.
  4. Mark the midpoint between means and draw a perpendicular line through it as a possible classifier boundary; explain the higher-dimensional hyperplane counterpart.
  5. Restore enough dots to retain variation; allow overlap and errors rather than perfect separation.
- **Spoken explanation:** Many contexts can reduce some irrelevant variation when averaged, but they may still share confounds. Explain the means, difference of means, and boundary in plain language.
- **Self-guided captions:** Explain each reveal, what a point/mean/arrow represents, and why the perpendicular boundary divides higher/lower scores.
- **Required future work:** Design consistent plot states and labeling; decide illustrative versus measured coordinates; calibrate and evaluate any real threshold on held-out data.
- **Caveats:** The midpoint boundary is a pedagogical choice. Averaging does not guarantee refusal is the only shared property. Real data need not form clean clusters. A 2D picture simplifies activations with potentially thousands of dimensions. Difference of means is one simple readout construction, not the exact training procedure of every linear probe or the paper’s entire protocol.

### 9. Predict a new example

- **Teaching goal:** Show how a direction turns a vector into a scalar and a threshold turns the scalar into a prediction.
- **On screen:** A new prompt, its activation point on the same plot, its projection onto the direction, a score, and an illustrative threshold/prediction.
- **Advance/interaction:** Introduce the prompt → animate the activation appearing → reveal projection and scalar score → compare with threshold → show prediction and, if available, observed outcome/error.
- **Spoken explanation:** The activation has many components; the direction measures one component. The threshold gives a refusal prediction that can be wrong.
- **Self-guided captions:** Explain projection, score, threshold, and the prediction target; identify which aspects are illustrative or measured.
- **Required future work:** Select new examples and either verified observed behavior or labeled illustration; define measurement/extraction setup for any real data.
- **Caveats:** Refusal prediction is not automatically harmfulness detection, intent detection, or lie detection. Keep errors visible. A difference-of-means readout is not every trained linear probe.

### 10. Description versus causation

- **Teaching goal:** Make the shift from correlation to intervention explicit.
- **On screen:** Keep the direction and plot; ask whether it is merely descriptive or also causal.
- **Advance/interaction:** Pause the prediction story, then introduce an intervention on the activations.
- **Spoken explanation:** A feature may correlate with refusal without driving it. Reading a signal does not establish that changing it will change output.
- **Self-guided captions:** Explain why successful prediction alone leaves a causal question unanswered.
- **Required future work:** Write the short bridge and retain visual continuity into intervention.
- **Caveats:** Do not treat a predictive boundary as proof of a mechanism.

### 11. Remove the refusal component

- **Teaching goal:** Demonstrate the causal test of projection removal and its distinct geometry.
- **On screen:** The same plot, a harmful request whose ordinary response is refusal, and a safe summary of behavior before/after intervention. Show the activation and its projection onto a unit refusal direction `u`.
- **Advance/interaction:** Reveal baseline refusal → remove the activation’s component along `u` → show the corresponding measured or clearly illustrative behavior change. Use `h_ablated = h - dot(h, u) * u`.
- **Spoken explanation:** Ablation subtracts this activation’s projection, not one fixed centroid-difference arrow. It tests whether removing that component affects refusal in the chosen setup.
- **Self-guided captions:** Explain the operation, why movement differs for different points, and the provenance and limits of the shown outcome.
- **Required future work:** Verify the paper’s intervention placement and evaluation; choose real model/setup and recorded or measured outputs if making real-result claims. Show an appropriate safe summary or omission instead of dangerous instructions.
- **Caveats:** Projection removal need not land at the blue mean or cross the teaching classifier boundary. Separate toy boundary geometry from the real intervention. Effects are not universal across prompts, models, layers, or strengths; a result on refusal is not an explanation of the whole model or a safety solution.

### 12. Add the refusal direction

- **Teaching goal:** Show complementary additive steering and the role of intervention strength.
- **On screen:** A harmless prompt, ordinary behavior, the same direction and plot, and a comparison after adding the direction.
- **Advance/interaction:** Reveal ordinary response → add `alpha * u` → show the resulting behavior. Formula: `h_steered = h + alpha * u`. An eventual strength control may explain alpha, if it helps the narrative and the chosen data support it.
- **Spoken explanation:** Alpha controls the amount of additive steering; in a verified tested setup, adding the direction can induce refusal.
- **Self-guided captions:** Contrast additive steering with projection removal and read-only probing; identify measured versus synthetic outputs and setup limits.
- **Required future work:** Verify settings, strength, intervention locations, and real responses; decide whether an interactive strength control is useful and supported.
- **Caveats:** Do not promise induced refusal everywhere or invent results for arbitrary alpha values. Keep the three operations distinct: probing reads, ablation removes a component, steering modifies activations.

### 13. What else can we read from activations?

- **Teaching goal:** Broaden curiosity without repeating the entire tutorial.
- **On screen:** A short list of examples: factual truth/falsehood, locations/dates, Othello board state, persona traits such as sycophancy/hallucination, and the assistant persona axis. Include a small caption about particular models/settings and differing evidence for reading versus steering.
- **Advance/interaction:** A compact overview reveal; no separate full tutorial per item.
- **Spoken explanation:** Explain that other research finds interesting internal structure, with different methods and different causal evidence.
- **Self-guided captions:** Briefly explain each example and its research link after verification; state relevant limits.
- **Required future work:** Read the leads below and verify what each actually measures, how, and whether interventions are demonstrated.
- **Caveats:** Not every finding is a linear probe or a steerable direction. Do not generalize across models. Truth versus falsehood is different from deliberate deception; this does not establish a universal lie detector.

### 14. Takeaway and invitation

- **Teaching goal:** Preserve excitement and motivate exploration without overselling.
- **On screen:** A concise synthesis: sometimes surprisingly simple structure can be found inside complicated models; we can read information and test causal influence. Include a suitable invitation to explore technical AI safety and NJIT AI Safety’s fellowship once details are supplied.
- **Advance/interaction:** Resolve the evolving diagram into the core distinctions and invitation.
- **Spoken explanation:** Emphasize the power of tractable experiments and remaining uncertainty.
- **Self-guided captions:** Recap the intuition → measurement → intervention path and the qualified conclusions.
- **Required future work:** Refine closing copy and verify any club/fellowship links or participation details before adding them.
- **Caveats:** Readability is not causality; causal influence on one behavior is not a complete explanation; truth-related features do not guarantee honesty detection; a refusal direction is not a complete safety solution.

## Geometry and scientific accuracy

### Teaching construction

Let `mu_R` be the mean activation for refused examples and `mu_N` the mean for non-refused examples in the teaching dataset. Let `d = mu_R - mu_N`, and, when `d` is nonzero, `u = d / ||d||`. The arrow points from non-refusal toward refusal. The illustrative midpoint is `m = (mu_R + mu_N) / 2`.

A score may be expressed as `s = dot(h, u)`. The midpoint teaching threshold is `t = dot(m, u)`, so the boundary is `dot(h - m, u) = 0`. In 2D it is a perpendicular line; in higher dimensions it is a hyperplane. Real thresholds require calibration and held-out evaluation. State the score’s coordinate convention clearly; centering shifts score/threshold together and does not change the intended teaching boundary.

This is explanatory geometry, not a claim that the refusal paper used this exact classifier. Maintain a consistent activation extraction location for dot comparisons. The paper’s direction selection and interventions require separate methodological verification.

### Intervention geometry

- **Read/probe:** Measure a score without changing activations.
- **Projection ablation:** For unit `u`, `h_ablated = h - dot(h, u) * u`. This removes the component along `u` in the specified coordinates. Do not silently replace it with centered subtraction or subtraction of the same fixed `d` for every point.
- **Additive steering:** `h_steered = h + alpha * u`. Alpha controls the intervention strength.

Removing a projection does not in general put a point at the non-refusal centroid or force it across the illustrative midpoint boundary. The geometry of a cartoon classifier must not be substituted for evidence of actual intervention effects. Verify where and how interventions are applied in the model before any real demonstration.

### Cross-cutting safeguards

Keep weights/activations, reading/modifying, and correlation/causation distinct. Use labels for simplified plots, synthetic coordinates, illustrative outputs, and measured data. Never imply that all activations are linear, every neuron has a clean meaning, or representations are perfectly separated. Internal evidence complements behavioral evaluation; it does not automatically expose intentions or prove safety.

## Research leads and verification work

These are **unverified research leads preserved from the brainstorm**, not source-checked claims. Research review is future work; no exact empirical claims or protocols have been verified during this planning-only setup.

| Lead | Intended role | Verification needed |
| --- | --- | --- |
| “Refusal in Language Models Is Mediated by a Single Direction” | Main refusal and intervention example | Locate authoritative paper/artifacts; verify prompt selection, harmful/harmless contrast, labels, layer/token extraction, direction computation and selection, intervention placement, and evaluation. |
| [Factual truth versus falsehood](https://arxiv.org/abs/2310.06824) | Brief overview example | Verify readout method, models, datasets, generalization, and whether any causal intervention is supported. Distinguish factual truth from intentional deception. |
| [Locations and dates](https://arxiv.org/abs/2310.02207) | Brief overview example | Verify represented quantities, extraction/readout method, and experimental limits. |
| [Othello board state](https://www.neelnanda.io/mechanistic-interpretability/othello) | Brief overview example | Verify the precise linear-readout claim and setting; do not assume all Othello findings use the same method. |
| [Persona vectors](https://www.anthropic.com/research/persona-vectors) | Persona traits such as sycophancy and hallucination | Verify trait definitions, direction construction, measurement versus steering evidence, and model/setup scope. |
| [Assistant axis](https://www.anthropic.com/research/assistant-axis) | Brief assistant-persona example | Verify the axis’s meaning, methods, intervention evidence, and limitations. |

Before a real refusal demonstration, record:

1. Model, version, configuration, and experimental setup.
2. Prompt source/selection, group labels, and observed refusal definitions; distinguish harmful/harmless labels from refused/non-refused behavior.
3. Consistent activation extraction layer and token positions.
4. Direction computation, normalization, and selection procedure.
5. Threshold calibration and held-out prediction evaluation, including overlap/errors and possible confounds.
6. Intervention placement, frequency, strength, and exact operations.
7. Evaluation protocol, baseline and intervened responses, reproducibility, and limitations.
8. Provenance for every measured plot and recorded output; safe summaries where harmful content would otherwise appear.

Do not infer research methodology from whichever animation is easiest to build. Successful intervention on refusal does not explain all mechanisms or solve safety.

## Open decisions and optional ideas

### Keep open

- React versus Svelte; TypeScript is likely but no architecture is locked in.
- Exact title, typography, and palette.
- Digit decoder/model; practical trained toy model versus explicitly labeled illustration. No VAE, inference library, or training pipeline commitment.
- Whether a reliable interpretable direction such as slant exists in the selected digit example.
- Whether the manifold explanation stays in the main narrative.
- Model and experimental setup for any recorded real refusal demonstration.
- No live inference: use precomputed digit outputs and verified recorded refusal results. Exact datasets and sampling remain open.
- Final scene count and runtime; roughly 40 minutes is context, not a constraint.

### Optional ideas

The manifold scene, a verified slant-direction highlight, and a supported steering-strength control are optional. Evaluate them by whether they improve understanding and can be presented accurately. Do not rely on unsupported brain analogies.

### Agreed versus suggested

The refusal-centered progression, digit-space interaction before probing, staged coherent cluster plot, both intervention directions, caption toggle, and scientific distinctions are agreed requirements. Framework/rendering choices, exact transition mechanics, accessibility implementation details, runtime, and data-delivery approach require later decisions. Preserve the actual interactions rather than replacing them with a generic slide outline.

## Proposed site architecture

Added October 11, 2026, following the request to plan the site architecture. **This is a proposal for review, not an implementation authorization or a finalized technology selection.** The narrative and scientific requirements above remain authoritative.

### Overall shape

**Confirmed constraint:** no live inference, including browser-local digit inference. Both demonstrations use precomputed assets; training, sampling, and refusal experiments happen outside the presentation. User confirmed October 11, 2026.

Recommend a static, client-side presentation with a small presentation controller, editable narrative content, persistent visual stages, and separately loaded demonstration assets. A backend is not needed for the recorded-results presentation. Keep any future experiment/training tooling separate from the browser presentation; the website consumes exported evidence rather than running the research pipeline.

The main organizing unit is a **stage containing several narrative steps**, rather than an independent slide for every reveal. A stage owns a visual composition that remains mounted while its steps change. Narrative scene numbers above remain editorial references; they need not match component boundaries.

Suggested stage boundaries:

- **Opening:** title and motivation, using a shared minimal text/composition layout.
- **Representations:** the network-as-function diagram and digit-space exploration. They share the vector-to-point visual bridge; the decoder interaction is its own module. The optional meaningful-regions explanation extends this stage.
- **Bridge:** reverse-engineering ambition and the introduction of refusal.
- **Refusal investigation:** one persistent plot spanning clusters, means, direction, boundary, prediction, correlation-versus-causation, ablation, and additive steering. Response comparisons and score readouts are companion panels, not replacement plots.
- **Closing:** broader examples, qualified takeaway, and invitation.

Stage boundaries can change during visual prototyping. Persistence matters most within the refusal investigation, not across every element of the entire talk.

### Presentation shell and navigation

The shell owns the viewport, next/back controls, progress, caption toggle, optional chapter picker, and reduced-motion preference. Use one shared narrative sequence for live and self-guided viewing. The mode changes the amount of explanation and layout, not the scientific content or demonstration logic.

Give every narrative step a stable identifier. A URL fragment can identify the current step so reloads, rehearsal bookmarks, and shared links have predictable entry points. Keep captions and viewing preference separate from the narrative location; no need to encode every drag movement in the URL. Recommended browser-history behavior: explicit chapter jumps create history entries, while ordinary next/back updates the current entry, avoiding dozens of browser-history entries during a talk.

Next/back moves between authored steps. It does not implicitly run inference or wait for a long animation. Keyboard navigation must leave focused inputs and sliders usable. On small screens, put explanatory text and response panels below the graphic rather than shrinking every label to fit one screen. The self-guided layout may scroll within a step; it should not become a separate scroll-driven narrative initially.

### State and animation

Keep three kinds of state separate:

- **Narrative state:** current stage and step, determining what the explanation has revealed.
- **Interaction state:** digit coordinates, selected example, and steering strength where supported. Store this per stage for the current session, so leaving and revisiting a stage does not unexpectedly erase exploration. A visible reset restores that stage's authored defaults. Reloads may start interactions at their defaults; persistent saved sessions are unnecessary initially.
- **Transition state:** temporary interpolation between visual states. This is a rendering detail, never the source of scientific values or narrative progress.

Each step declares its target visual state: visible layers, labels, highlighted example, panel content, and permitted controls. Derive the target from the step and interaction state rather than replaying a chain of mutations. Direct entry, backwards navigation, and skipped steps must yield the same meaningful endpoints as sequential playback.

Animate toward those targets. If the presenter advances during a transition, interrupt or settle it and move toward the newly requested target; do not queue stale reveals. Reduced motion shows equivalent endpoints without relying on movement to explain the operation. Any randomized illustrative point cloud should use fixed authored data or a fixed seed, so the geometry does not change between rehearsals.

An interaction should not silently advance the talk. Prefer deliberate presenter advancement after exploration. Where necessary, introduce a newly available control with an authored default rather than letting an earlier exploratory value obscure the intended first explanation.

### Visual modules and mathematical model

Start with ordinary HTML for prose, controls, captions, and responses, plus SVG for the modest number of points, arrows, labels, and boundaries in the teaching plot. This is a provisional rendering approach, not a library selection. Introduce canvas or another renderer only if a chosen example needs substantially more points or a demanding effect. A decorative shader is optional and should not determine the application architecture.

The persistent refusal stage composes a plot, a projection/score display, an operation label, and a baseline/intervention response panel. Keep a stable coordinate frame through the main construction so viewers can track the same objects. Layer visibility changes with the narrative; changing the operation updates the geometry and accompanying explanation together.

Separate vector calculations from display transforms. Compute means, normalization, scores, thresholds, projection removal, and steering in model coordinates; map results to screen coordinates only when rendering. Handle a zero difference-of-means direction explicitly rather than producing invalid normalization. In ablation, expose the actual origin and projection geometry; a visual pan or centered score display must not silently change the intervention formula.

For the initial teaching plot, recommend explicit synthetic 2D coordinates with overlap. Display a persistent simplification/provenance label. Real high-dimensional experiments should use their own exported measurements and setup descriptions. A 2D embedding does not generally preserve the true dot products, thresholds, or intervention geometry: do not derive real scores or model effects from screen positions. If measured points are later visualized, record the projection method and distinguish actual scores from the simplified geometry.

### Content and evidence

Keep narrative text separate from rendering logic, but avoid building a general-purpose slide language or CMS. A small typed content structure can hold step identifiers, concise screen copy, optional self-guided explanations, presenter notes, source references, and the visual-state identifier. Rich interactions remain purpose-built components.

Maintain separate datasets for illustrative geometry and verified experimental results. An evidence record should identify whether it is synthetic, a trained toy-model result, or a recorded/measured model result. For measured records, include model/version, extraction and intervention setup, example identity, baseline and intervention conditions, recorded outcome, source/artifact reference, and limitations. The experiment checklist above specifies the research details that still need verification.

Response panels must select an evidence record matching the displayed condition. A slider may move a synthetic geometric point continuously, but measured responses only exist at tested conditions. If only discrete strengths were recorded, use discrete stops or explicitly show that no recorded response exists at other values. Never interpolate response text or imply that point position determines actual refusal behavior.

Public presentation assets should contain only safe prompts, excerpts, or summaries approved for display. Do not package dangerous full responses and merely hide them in the interface. Keep any necessary restricted research artifacts outside the site's public asset bundle.

### Digit demo and precomputed assets

Treat the digit demo as an isolated coordinate-to-image lookup module. Its interface accepts the selected coordinates and returns a recorded image plus loading/error status and provenance. Choose the trained model and offline sampling grid after evaluating a practical example. No model executes in the browser or on a server during the presentation.

Recommend a precomputed grid of decoder outputs, delivered as an image atlas or compact image collection. The control should snap to sampled coordinates, or visibly identify the nearest sampled point, so the displayed digit corresponds to the selected recorded location. Choose sampling density after checking visual quality and asset size. Image interpolation between samples is not equivalent to evaluating the decoder at the selected coordinate; do not present interpolated images as recorded model outputs. A hand-designed illustrative alternative remains possible only with clear labeling if trained outputs prove impractical.

Preload the digit assets before this stage. Provide a visible loading/failure state and an authored recorded example the presenter can continue with; do not silently replace missing trained outputs with synthetic output.

The refusal demonstration also uses verified recorded results exclusively. Controls select existing experimental conditions and their associated responses. All experiments and output sanitization happen before assets are exported to the site. Network access may be needed to load the static site initially, but no interactive step requires an inference service. Fully offline delivery remains a separate packaging decision.

### Recommended technology stack (pending user selection)

For the code architecture discussed with the user, recommend:

- **React + TypeScript, built with Vite:** a client-side app with typed narrative/evidence records and custom visual components. Vite provides a React/TypeScript template and development/build tooling. No server framework is needed for the current scope.
- **Motion for React:** animate HTML/SVG elements toward the visual states derived from narrative steps. Use it for reveals, point/arrow movement, and stage transitions. The presentation controller owns progress; animation completion does not own narrative state. Keep one animation owner per property.
- **Custom SVG diagrams:** React renders the modest teaching plots directly; mathematical functions calculate coordinates. No general charting library is needed initially.
- **CSS Modules + shared CSS custom properties:** scoped component styling, with central tokens for typography, spacing, colors, and motion. Custom compositions are the main UI.
- **Native controls first, Radix Primitives selectively:** use native buttons and straightforward controls; use unstyled Radix components where a dialog, popover, or more involved control warrants their interaction/accessibility behavior. Apply the presentation's own styling and labels. A full styled component kit is unnecessary initially.
- **Built-in React state/reducer:** controller state for navigation, stage interaction state retained across stage visits, and pure derived visual states. A keyed session store at the presentation level can retain interaction values without keeping every stage mounted. No external state library is needed initially.

React is recommended for this project's component-and-animation pairing, not because the narrative cannot be implemented in Svelte. This is a concrete proposed stack, not permission to install or scaffold it. Keep final versions for implementation-time selection.

Documentation checked for this recommendation: [Vite guide](https://vite.dev/guide/), [React TypeScript guide](https://react.dev/learn/typescript), [Motion React animation](https://motion.dev/docs/react-animation), and [Radix introduction](https://www.radix-ui.com/primitives/docs/overview/introduction). These checks concern tooling capabilities; the scientific research leads remain unverified.

### Proposed code organization, once implementation is authorized

Keep a few direct boundaries: presentation shell/controller; narrative content; visual stages; pure geometry functions; demo/data adapters; and evidence/assets. These are responsibilities, not a mandatory folder tree or an abstraction framework. Do not introduce a global state library, generic plugin system, backend, or animation engine unless implementation needs justify one.

Load the small shell and opening content first, and prepare the next stage's assets before it is reached. Heavy digit artifacts should not block the title or the refusal explanation. Assess asset sizes before promising fully offline use; if offline delivery becomes a requirement, verify that fonts, model files, and evidence are all available without a network connection.

### Decisions to resolve and first implementation checkpoints

The architecture proposal does not select React versus Svelte, a build tool, an animation library, or hosting. Framework choice should follow familiarity and a small persistent-plot prototype; no current teaching requirement forces one over the other. SVG-first plotting and a static client are recommendations pending review. Precomputed demonstrations with no live inference are confirmed.

Once implementation is requested, the first useful checkpoint is a thin refusal-plot prototype: examples → means → direction → boundary, with forward/back, direct step entry, captions, and reset. This tests the central architecture before visual polish or a full deck. Then verify ablation and steering endpoints and interruptible transitions. Separately assess precomputed digit samples and verify the refusal research, since those findings determine the data adapters and empirical claims.

Meaningful checks should cover the failure-prone parts: projection removal leaves approximately zero component along a unit direction; steering changes that component by alpha; changing screen coordinates does not change scores; direct/backward navigation reaches the intended visual state; and displayed responses match recorded conditions. Rehearse the actual presentation viewport, keyboard use, captions, reduced motion, and loading failures. Do not add broad testing infrastructure before the implementation warrants it.

Still open for user preference: framework familiarity, whether self-guided viewers need shareable exploratory state beyond a step link, and whether fully offline presentation is required. None of these block reviewing the stage-and-step proposal.

## Future implementation suggestions

These suggestions support later work; **none authorize implementation now**:

- Use deterministic animations and predictable forward/back/reset states so a live demonstration is reliable.
- Consider reusable scene components and one evolving plot across related narrative steps.
- Keep explanatory copy easy to edit and live/self-guided modes consistent.
- Maintain clear provenance and labeling for measured data, toy models, illustrations, and recorded outputs.
- Use precomputed assets exclusively: recorded digit decoder samples and verified recorded refusal results. No browser-local or server-side live inference.
- Include keyboard/touch operation, contrast, non-color labels, and reduced-motion behavior.
- Keep assets and transitions lightweight; choose rendering libraries only when justified by the desired explanations.
- Verify scientific methodology before implementation of empirical demonstrations, and preserve uncertainties in this document as decisions are resolved.

## Setup completion record

- Verified parent directory: `/Users/brandonhowe/Documents/NJIT/ai-safety`.
- Verified existing sibling project: `club-website`, containing its own `package.json`.
- New project folder: `/Users/brandonhowe/Documents/NJIT/ai-safety/mech-interp-presentation`.
- Planning files: `AGENTS.md` and `presentation-plan.md`.
- No existing target-folder work was present at setup; no ancestor `AGENTS.md` was found on the checked path from the filesystem root through this parent.
- No app scaffold, installed dependencies, presentation implementation, or publication was created. Research leads remain to be verified; design and experimental choices remain open as listed above.

## Implementation record

October 11, 2026: the user asked for the basic presentation structure with content left blank (a title slide plus one test slide), to confirm the structure works and the UI looks good before writing content.

**Stack used:** React 19 + TypeScript + Vite, Motion (`motion/react`), CSS Modules with shared custom properties, hand-written SVG, self-hosted Fraunces (display) and IBM Plex Sans (body; chosen October 11 over Inter, Instrument Sans, DM Sans, Schibsted Grotesk, Geist, and Figtree) via Fontsource. No Radix, router, or state library. This adopts the recommended stack above; the user did not object, but it can still be revisited cheaply at this size.

**Built (matches the architecture proposal):**
- Stage-and-step model (`src/types.ts`, `src/content/stages.ts`). Stages stay mounted across their steps; each stage component derives its visuals from the current step id, so direct entry, back, and skipped steps reach the same endpoints.
- URL fragment `#/stage-id/step-id`. Next/back replace the history entry; section jumps and Home/End push one. Browser back/forward and manual hash edits sync.
- Keys: → / ↓ / Space / PgDn for next; ← / ↑ / Shift+Space / PgUp for back; Home/End jump to the first/last step; C toggles captions. Keys are ignored when an element handles them (e.g. the focused probe uses arrow keys) or when focus is in inputs or sliders. Horizontal touch swipes navigate unless they start on `[data-no-swipe]`.
- Caption panel (self-guided mode): a side column on wide screens, below the graphic on narrow ones. The preference is saved in localStorage, separate from position.
- Reduced motion follows the OS setting (Motion's `MotionConfig reducedMotion="user"` plus a `data-reduced-motion` attribute for CSS). There is no in-app toggle.
- Per-stage interaction state kept for the session (survives leaving a stage). Stages receive `resetInteraction` and render their own Reset control next to the interaction.
- Controls (user decision, October 11): only a small floating chip in the bottom-left corner with back, next, and captions buttons. No progress bar, section picker, or settings menu. The chip has a translucent background and stays hidden until the pointer is within about 72px of the bottom edge, or a chip button has keyboard focus. Separately, the cursor hides after 2.5 seconds without movement.
- Background: see the background decision below.

**Title (user-chosen, October 11):** "Mind-reading LLMs with Mechanistic Interpretability", subtitle "NJIT AI Safety". The eyebrow line was removed. **Placeholders to replace:** the palette and type choices in `src/styles/tokens.css` (provisional). The `structure-test` stage uses generic Group A/B synthetic data and is scaffolding, not the refusal teaching plot, though its geometry (means → direction → midpoint boundary → projection score) matches the plan's teaching construction and can be adapted.

**Verified in a browser:** title and test stages at 1280×800 and 390×844; direct hash entry; next/back; Home/End plus browser back; caption toggle; arrow keys moving the focused probe without changing steps; probe position kept across stage visits; Reset; the chip controls. Not yet verified by hand: real touch swipes, a presentation clicker, and reduced motion on an OS with that setting enabled.

**Background (decided October 11):** solid paper color with a faint, static dot lattice (28px grid), drawn with a CSS radial-gradient. No animation, cursor interaction, color fields, gradients, or grain. Experiments tried and rejected: drifting color fields, a WebGL shader with warped warm gradients (smoky or mesh-gradient), topographic contour lines, cursor-aiming direction strokes, cursor-reactive lattice effects, and a slow wave through the lattice. Code: `src/shell/background/`.

**Why Mech Interp slide (October 11):** a second stage (`why`) holds the user's copy for scene 2. It shows a centered heading and three bullets; the second bullet has an italic sub-point. The third bullet was reworded from "had access to" to "could fully understand someone's internal states", so the claim is explicitly about an idealized complete understanding. That way it doesn't imply that today's activation readouts detect lies. Stages can now declare `transition: 'dramatic'`: leaving or entering such a stage fades the old stage out completely (0.8s) before the new one fades in, with no slide. The title stage uses it. Bullets stagger in after the heading. The component is the reusable `BulletsStage`.

**Main Approaches slide (October 11):** a third stage (`approaches`) with two steps, covering scene 6's move from ambition to a tractable question. Step 1 shows Bottom-up ("Analyze individual neurons and circuits") and Top-down cards side by side. Each card has a small illustrative network glyph: bottom-up highlights one circuit path, and top-down (per the user's reference image) is a wireframe surface, an illustrative "landscape" of representation space, with a point and three direction arrows (ink, red, blue), so it shows no individual neurons. Card titles sit above the glyphs. Top-down was reworded from the user's "analyze behavior as a whole" to "Find how concepts are represented across many neurons" (after an intermediate, longer version), because analyzing behavior alone is behavioral evaluation, not interpretability. Step 2 adds "Which is more fruitful?" and "Modern language models have up to **trillions** of parameters. Analyzing this bottom-up is not practical." Open-weight ~1T-parameter models exist, but the exact figure should be source-checked before it is stated as fact. The caption notes that bottom-up remains an active and productive research area. Bold in authored copy uses `**…**` via `src/stages/Inline.tsx`.

**Sizing rule (October 11):** slide typography and spacing scale with both the stage's width and its height (`clamp(min, min(Xcqi, Ycqh), max)`), and text stages center their content vertically. Width-only scaling overflowed the bottom on wide, short windows (~1510×780). Verified to fit at 1512×760 and 1512×620. New stages should follow the same pattern.

**Main Approaches update (October 11):** the bottom-up card now shows our own schematic of the induction-head circuit (Olsson et al., 2022): "A B … A → B", with the previous-token head and the induction head drawn as arcs. It is not Anthropic's figure, which avoids image-rights questions. The "fruitful" step adds a log-scale parameter comparison: ~200K (fully reverse-engineered modular-addition transformer; computed as ~225K from Nanda et al. 2023's one-layer, d=128, 4-head, 512-MLP, p=113 architecture) versus ~10T (GPT-6, labeled "rumored": it shipped September 2026, but OpenAI has not published a size). The gap is ~44 million×, about 7.6 orders of magnitude. The on-screen copy avoids calling the modular-addition model the *largest* reverse-engineered model, which is hard to substantiate. Sources: https://arxiv.org/abs/2301.05217 and https://teamorouter.com/blogs/gpt-6-astra-model-size (rumor reporting).

**Induction-head diagram step (October 11):** the user supplied the full induction-circuit diagram, "How a 2-layer transformer learns the word 'Dursley'". It is stored at `public/images/induction-q-composition.png`, credited on screen to Callum McDougall / ARENA (attribution to be confirmed by the user). Main Approaches now has three steps: approaches → induction (cards fade out and the diagram fills the slide with a short explanation) → fruitful. The diagram shows the Q-composition variant ("the rarer one"). The caption says so, because the commonly described induction circuit uses K-composition.

**Slide split (October 11):** at the user's suggestion, Main Approaches is back to a single step (the two cards; bottom-up keeps the small induction schematic as a preview). A new stage, `fruitful` ("Which is more fruitful?"), has two steps. `induction` shows the full diagram on the left, with "Bottom-up works on small circuits", a short explanation, and the credit on the right. `scale` adds the "trillions" sentence and the log-scale parameter comparison under the text. `ScaleBar` moved to `src/stages/ScaleBar.tsx` for reuse.

**Fruitful slide text (October 11):** at the user's request, the on-screen body now describes the indirect-object-identification study (Wang et al., "Interpretability in the Wild", arXiv:2211.00593, November 2022 / ICLR 2023). I checked it: the PDF has 25 pages, and the circuit is "26 attention heads grouped into 7 main classes" in GPT-2 small. The user's draft said "5 neurons" and "2023", and both were corrected. The diagram beside it is still the induction-head figure, so text and picture currently describe different circuits; this is open for the user to decide. The scale block is always laid out and only fades in on the second step, so the column above no longer re-centers when it appears.

**Fruitful slide figure swap (October 11):** the induction diagram was replaced by the IOI circuit figure (Figure 2, `figs/circuit_diag_v2.pdf` in the arXiv source of 2211.00593), rendered at 300 dpi to `public/images/ioi-circuit.png` and credited on screen to Wang et al. (2022). Subheading: "Bottom-up is painstaking". Layout (revised at the user's request): the figure (left, ~60%) and the "Bottom-up is painstaking" text (right) side by side, with the scale block centered below. The scale block is laid out from the start and fades in on step 2. The induction diagram image was removed (the Main Approaches card keeps its own small induction schematic), which resolves the text/figure mismatch noted above.

**Fruitful slide trims (October 11, user request):** removed the "Parameters, log scale" axis label, the on-screen figure credit, and "(rumored)" after GPT-6. "25-page paper" now links to arXiv 2211.00593 (`[text](url)` links are supported in authored copy and open in a new tab). The self-guided caption still says GPT-6's size is an unpublished estimate and still cites Wang et al. On screen, the bar's spacing is log-scale but no longer labeled as such.

**Draft of all remaining scenes (October 11, user request):** the user asked for rough versions of every remaining page "so I can think about the presentation", expecting heavy iteration. Order: opening → why → approaches → fruitful → `network` (scene 3) → `digit-space` (scene 4) → `refusal-question` (scene 7) → `refusal` (scenes 8–12, one persistent plot, 11 steps) → `more` (scene 13) → `takeaway` (scene 14, dramatic fade) → `structure-test` (still scaffolding). Scenes 3–4 come after "fruitful" because that slide ends by motivating the top-down route; scene 5 (manifolds, optional) was skipped. Copy lives in `src/content/network.ts`, `src/content/refusal.ts`, and `stages.ts`; `CardsStage` is a new reusable card grid.
- Everything numeric is synthetic and tagged on screen ("Illustrative numbers/data", "Illustration · not a trained model"). The digit stage is a hand-designed stroke morph (4 → 1 → 7 plus shear), not a decoder; it is a stand-in until the digit model decision is made. Network weights are random from a fixed seed.
- Refusal plot: u from synthetic means; ablation moves the point to the line through the origin where h·u = 0 (not the answered mean); steering has an α slider (0–4), and the "Refuses" flip at α ≈ 2 is invented. Behavior cards are labeled illustrative; the phishing example shows no harmful content.
- **To verify before presenting:** the Arditi et al. paraphrases in the refusal captions (especially "largely stopped the models they tested from refusing harmful requests"), all five research-lead citations in the `more` captions (the assistant-axis card in particular), and the club/fellowship wording in the takeaway.
- Known rough edges: network/weight colors reuse the refusal red/blue; small labels in the shrunken network; little cluster overlap in the refusal plot; the plan's finer prediction sequence is merged into two steps.

**Scenes 3–4 revised (October 11, user feedback):** the user said the network diagram was too complex and that showing the internals of neural networks is out of scope. Scene 3 (`network`) is now a closed "model" box: prompt → model → output; then a list of activation numbers is read out of the box ("activations · thousands of numbers") and changes with the chosen prompt; then the first two numbers become a point on a plane. Weights are mentioned only in the caption. The prompts and numbers are made up.

Scene 4 now uses a real trained model, per the user's suggestion of the canonical MNIST example: a VAE with a 2D latent space (Kingma & Welling 2013 style; MLP 784-512-256 encoder, mirrored decoder, 30 epochs, seed 0, final loss ≈137 nats). It was trained offline with `scripts/digit-vae/train.py` (run via `uv run --with torch --with torchvision --with pillow --with numpy python train.py`). Decoded digits for a 41×41 grid over latent [−2.5, 2.5]² are in `public/digits/grid.png`, and the dragged point shows the nearest grid tile (pixelated 28×28). `src/stages/digit/latent.json` holds the latent means of the first 2,000 MNIST test digits with their labels. Step 2 (`data`, "Similar Digits Land Together") shows them as faint dots with a numeral at each class's median. The hand-designed slant direction was removed: no verified slant direction exists in this model. The weights (`scripts/digit-vae/vae.pt`) and MNIST download (`scripts/digit-vae/data/`) are local only. Open: whether to color the dots by class; the center of the space is crowded (5/8/2/6) and 4 hides under 9.

**Scene 3 numbers and weights (October 11, user feedback):** the user asked the function slide to show the model mapping numbers to numbers and to distinguish weights from activations. `network` now has four steps: `function` (text → made-up token ids → model → made-up next-token scores → text), `weights` (a fixed weights list feeds the box, "weights · fixed after training", unchanged when the prompt changes), `activations` (adds the activation list, "computed for each input"; it changes with the prompt while the weights stay put), and `point`. The box stays closed. Token ids, scores, weights, and activations are all invented.

**Brain analogy (October 11, user idea):** weights ≈ the brain's physical wiring; activations ≈ its electrical activity, which is what a brain scan watches and what reveals current thought. The diagram adds "like the brain's wiring" and "like the brain's electrical activity" under the labels; the captions carry the analogy and its limits (EEG measures electrical activity; fMRI tracks blood flow that follows it; a model is not a brain).

**Scene 3 simplified to ℝⁿ → ℝᵐ (October 11, user feedback):** text-to-token conversion was too confusing. The function step now shows only "input: n numbers" → model → "output: m numbers" with "model: ℝⁿ → ℝᵐ" beneath; the picker is "Input A/B/C" (all numbers invented). The caption mentions in one sentence that text is converted to and from numbers. Weights/activations steps keep the brain analogy.

**Correction (October 11):** the user meant "activations live in ℝⁿ", not "the model maps ℝⁿ → ℝᵐ". The function step is back to text in → model → text out (no token numbers, no formula). The activation vector now reads `[ … ] ∈ ℝⁿ` (STIX Two Math, since Fraunces has no ℝ), and the point step's caption says a vector in ℝⁿ is a point in n-dimensional space, of which the plane shows two coordinates.

**Scene 3 restructured around input + weights → activations → output (October 11, user):** the user's key concept: inputs combined with fixed weights produce activations (the model's internal state, a vector in ℝⁿ), which become outputs; interpretability analyzes the activations. The model box now animates: closed dark box (`function`) → wide dark box showing a weights list (`weights`) → light, opened box with weights feeding down into one activation vector between the input and output arrows, labeled "activations ∈ ℝⁿ · internal state" (`activations`) → the box fades and the vector slides beside the plane (`point`). Brain analogy (wiring vs. electrical activity, with the EEG/fMRI caveat) lives in captions only. Still no neurons or layers drawn.

**All three prompts at once (October 11, user):** the prompt picker is gone; the three prompts are stacked rows that all pass through one model box, so the shared weights and per-prompt activations are visible side by side. The point step plots all three as labeled dots (France, Haiku, Spanish). The stage no longer has interaction state.

**On-slide provenance chips removed (October 11, user request):** removed "Illustrative numbers" (network), "Small VAE trained on MNIST · precomputed" (digit), "Illustrative data · 2D simplification" (refusal plot), the "Illustrative" tags on the refusal behavior cards, and the structure-test chip. Provenance and 2D-simplification notes now live only in captions (AGENTS.md updated to match).

**Weights moved outside the box (October 11, user):** the weights list now sits above the model box with an arrow into it, so the opened box contains only the activations. The `weights` step keeps the box closed and dark (just adds the weights above); the `activations` step widens and opens it.

**Weights vs. activations slide (October 11, user request):** new stage `weights-activations` (step `brain`, `src/stages/toy-network`) right after the activations step: a tiny 3-4-2 feedforward network whose edges are fixed weights (thickness = magnitude, dashed = negative) and whose node shading is activations really computed from them (ReLU hidden layer), with Input A/B/C buttons; beside it, Weights and Activations cards carrying the brain analogy (structure/MRI vs. activity/fMRI). This is a deliberate, user-requested exception to keeping the model a closed box. The "point" step moved into its own stage, `activation-geometry` (URL now `#/activation-geometry/point`), reusing `NetworkStage`.

**Digit slide merged; activations recap (October 11, user request):** `digit-space` is one step (`space`); the Reset button is gone and a "Show real digits" switch toggles the MNIST dots and class numerals (state `overlay` in `DigitState`). New stage `recap-activations` (BulletsStage) follows it: activations are the model's current "thinking", a vector in ℝⁿ with n in the thousands to tens of thousands; the activations-to-output map is continuous (small change → small change in output probabilities); activations contain structure. The user's draft said n ≈ 10³–10⁶ and "outputs"; changed to thousands–tens of thousands (residual width) and "output probabilities" (the sampled token can still flip).

**Linear Representations slide (October 11, user request):** new BulletsStage `linear-representations` after the recap. User draft said activation spaces are "million-dimensional" and "highly curved"; changed to thousands of dimensions and nonlinear transformations (a vector space isn't itself curved; the computations and data manifolds are). Third bullet hedged to "many … roughly linearly". Caption names the linear representation hypothesis and cites circular day-of-week features (Engels et al., 2024, "Not All Language Model Features Are Linear") as a counterexample — verify before presenting.

**Refusal step 1: generate activations (October 11, user request):** new first step `refusal/generate`, "Step 1: Generate activations": two stacked panels (Harmless prompts / Harmful prompts, five made-up prompts each) and a Generate button that fills each row with its prompt and the start of an invented activation vector; the chart stays hidden. The next step (`examples`, same heading) shows the table beside the chart. The plot's groups are now harmful vs. harmless prompts (legend, mean labels μharmful/μharmless, captions), matching Arditi et al.'s contrast; captions note that calling the direction "refusal" still has to be tested, and the readout reflects how the model treats a request, not ground-truth harm. AGENTS.md updated. The user's labels "harmless/harmful generations" became "prompts", since activations come from the prompts.

**Refusal step 2 (October 11, user request):** the `means`, `direction`, and `boundary` steps share the persistent heading "Step 2: Find a refusal vector" with accumulating sub-steps (screen `bullets`, rendered in RefusalStage as a bordered list; a bullet's `sub` renders as a formula): "Average each group of activations." → "Compute a refusal direction: d = μ(harmful) − μ(harmless)" → plus "Split activation space into refusal and non-refusal regions." The plot labels the two shaded half-planes "refusal region" / "non-refusal region". Later steps (new prompt, read the score, …) still have their own headings until the user restructures them.

**No layout shifts (October 11, user rule):** anything that appears in a later step must already have its space. New `src/stages/Reserve.tsx` stacks all of a stage's copy variants in one grid cell (sized to the largest; only the current is visible), and stages now receive `steps` in StageProps. Applied to the network stage (heading and bottom note), and to the refusal copy column (heading, text, bullets, and panel per step; Step 2's three bullets share one list revealed with `screen.reveal`). The network diagram no longer slides up/down between steps; its weights row space is always reserved.

**Refusal step 3: validation (October 11, user request):** `new-example`, `predict`, and a new `response` step share the heading "Step 3: Validation" and one panel (ValidatePanel, replacing PredictPanel and the "Read the score" heading): the new prompt; then "Project onto the refusal direction: h · u = +1.50 > +0.60" with the region's prediction; then "Generate the model's response" with an illustrative reply ("I can't help with that."). All rows are laid out from the start and fade in. Dragging the point still updates the math; for a placed point the reply reads "No prompt for a placed point".
- Step 3 projection now drops onto the line through the means (the d arrow) instead of a parallel score axis through the origin; a colored segment runs from the midpoint m to the foot, and the panel reads "h · u = +1.50 > m · u = +0.60". Same classification math (h·u vs. m·u); the origin axis and u arrow are kept only for the ablation/steering steps, where the origin matters.
