# Kavach Sentinel motion-led redesign direction

## Design read

Reading this as: a redesign of a defence-security proof product for technical judges, with an Awwwards-inspired editorial and industrial-film language, leaning toward high-contrast graphite, warm white, and one safety-orange accent rather than generic neon AI styling.

The previous green-on-black interface looked like a decorative AI dashboard because it relied on the same repeated ingredients: glowing accent, dense labels, cards, and an abstract proof orb without enough visible cause-and-effect. The corrective direction uses a **field-inspection / incident-review** visual language: quiet graphite surfaces, hard editorial typography, orange used only for active risk or the current step, and real interface transitions tied to the executable run.

## Visual system

| Element | Direction |
|---|---|
| Base | Graphite `#111312`, not pure black; warm-white text `#F1EEE7` |
| Accent | Safety orange `#FF6B35`; no green or purple accent competing with it |
| Secondary | Muted steel `#7E8785` and hairline `#303432` |
| Geometry | Mostly squared 6px corners, thin borders, no glassmorphism, no random pills |
| Typography | Geist display and Geist Mono already in the project; one sans family with mono only for routes, IDs, and evidence |
| Layout | Split editorial hero, pinned execution story, evidence-first panels, fewer decorative cards |
| Image | A single orange-lit proof-core visual used as a physical inspection object, not an AI mascot |

## Motion contract

Motion must answer one of four questions: what should the judge read first, what changed after the click, where is the run now, and why was the proof accepted or rejected. The site will use an 800–1000ms controlled run with a visible stage handoff, not a fake loop that completes before the server response.

| Motion | Purpose | Implementation |
|---|---|---|
| Hero proof core slow rotation or light sweep | Establish the verification object | CSS keyframe, subtle, paused under reduced motion |
| Run button press | Confirm input was received | `:active` scale 0.98 and 180ms ease-out |
| Stage handoff | Show the real state transition | State-driven class per stage; 220ms ease-out opacity/translate |
| Proof-panel swap | Show server result changed the page | `key`-based reveal with 240ms ease-out, no infinite loop |
| Accepted/rejected indicator | Make the decision legible | Single focal pulse once, then rest |
| Scroll reveal | Guide the judge from premise to proof | IntersectionObserver leaf with one-shot reveal; no scroll hijack |

## Website story

The first viewport must answer three questions without scrolling: what Kavach does, what the judge can run, and why it is safe. The control room then uses one large action and one selected scenario. After execution, the same screen reveals the returned evidence record, bounded rule, and two regression outcomes. The case-file and architecture pages explain the selected record without pretending they are executable themselves.

## Deck story

The five-slide deck retains the official order, but each slide gets one visual action and one judge question:

1. **Cover:** What is Kavach? The proof core enters once; the title resolves; no body copy.
2. **Problem:** Why are alerts insufficient? A baseline request arrives first; the missing proof gap appears as the orange unresolved segment.
3. **Method:** How does the loop work? Discover, reason, patch, and prove are revealed left to right, with the verifier gate arriving last.
4. **Architecture:** Where is autonomy bounded? The system map builds from allowed input to isolated change to verifier, while denied paths remain visibly outside the frame.
5. **Differentiation:** What can a judge verify today? The live demo, evidence bundle, and honest synthetic boundary resolve into a concise checklist.

Native object transitions cannot be embedded by the current slide format. Presenter notes will specify exact manual Fade/Morph order and timings, without claiming that PowerPoint animations are already present.

## Real-world claim discipline

The visual redesign must not imply that the current app scans real infrastructure or autonomously patches production. Every route will retain an explicit synthetic-only boundary. Claims about critical cases, real deployment, and competition readiness will be presented as **current proof**, **required adapter work**, and **unverified until organiser holdout testing**, respectively.
