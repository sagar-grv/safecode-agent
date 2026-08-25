# Kavach Sentinel — AI Kavach Track 2 submission content

This content map replaces broad AI marketing language with the current prototype’s verified scope and the organiser’s published Track 2 intent. It preserves the required five-part submission story: introduction and idea, methodology, technology/flow, novelty, and final deliverables.[1]

## Cover

# Kavach Sentinel

### Sandbox-only cyber reasoning: reproduce, bound, and verify one fix

**AI Kavach · Terrier Cyber Quest 2026 · Track 2**  
Stoneage · Sagar Hemant Gurav

## Slide 1 — The problem and idea

### Track 2 requires a fix that holds

> The published brief describes an AI Kavach system combining an LLM, fuzzers, static and dynamic analysis, and a regression harness to find a vulnerability, patch it, and prove that the fix holds.[1]

| What a finding shows | What a trusted remediation must add |
|---|---|
| A route or policy looks unsafe | The vulnerable request is reproduced |
| An exploit path can be observed | One bounded change blocks it |
| A suggested patch exists | Authorised behaviour still passes |

**Kavach Sentinel idea:** a controlled proof loop for the organiser sandbox: **select a declared case → reproduce the flaw → apply one bounded rule → run regression checks → record evidence**.

**Current prototype scope:** three deterministic synthetic API cases: broken function-level authorisation, broken object-level authorisation, and exposed debug configuration. No target URL, uploaded code, shell command, personal data, or external egress is accepted.

## Slide 2 — Detailed methodology

### One run creates an inspectable proof record

| Stage | Current executable output |
|---|---|
| 01. Select | One allowlisted scenario ID and the expected vulnerable path |
| 02. Reproduce | Baseline request and observed unsafe outcome |
| 03. Bound | A narrow policy rule and synthetic changed scope |
| 04. Prove | A blocked abuse path and a preserved authorised path |

The public control room executes the synthetic harness server-side and returns the evidence, bounded rule, trace, and regression results. A successful run currently includes two regression paths: unauthorised access must be blocked and authorised access must still work.

**Acceptance rule:** no proof is accepted if a check fails or the request fails. The demo never silently substitutes a success state.

## Slide 3 — Technology stack and flow

### The verifier—not model output—accepts a patch

| Layer | Prototype now | Finale adapter target |
|---|---|---|
| Controlled input | Allowlisted scenario IDs | Organiser-provided repository or API contract |
| Evidence | Deterministic baseline outcomes | Static/dynamic signals inside the declared sandbox |
| Reason and patch | Bounded policy rule in an in-process harness | Structured proposal plus approved transformations |
| Decision gate | Server-side regression checks | Exploit replay, authorised-path checks, timing, resources, and audit record |

**Implementation:** Next.js 16, React 19, TypeScript, Zod validation, Vitest, CSS Modules, and a Vercel deployment. The codebase has 60 automated tests covering the synthetic runner and existing safety/evaluation logic.

**Safety boundary:** no external egress, no arbitrary code or tool execution, deterministic input allowlist, visible failure state, and organiser adapter pending.

## Slide 4 — Salient features and novelty

### The deliverable is evidence, not a vulnerability alert

| Feature | Why it matters |
|---|---|
| Before-and-after evidence | Judges can see the vulnerable request, expected protected response, and exact regression result. |
| Bounded remediation | The demo changes one narrow policy boundary instead of claiming arbitrary code repair. |
| Safe-stop design | The system accepts no open targets or arbitrary inputs; failures are shown rather than hidden. |

**Lightweight by design:** three deterministic cases, two regression paths per run, no heavy scanner dependency, and a small server-side harness. This makes the core story measurable while avoiding unsupported claims about real infrastructure.

**Novelty:** the acceptance decision belongs to a verifier. Reasoning may propose an action, but proof requires abuse to be blocked and authorised behaviour to remain available.

## Slide 5 — Final deliverables and 36-hour plan

### From synthetic proof to organiser-sandbox evaluation

| Already demonstrable | Build when organiser scope is supplied |
|---|---|
| Three executable synthetic cases | Adapter for the provided repository/API schema |
| Before/after evidence and bounded rule | Static/dynamic analysis plus allowed fuzzing inside the organiser sandbox |
| Two regression checks, visible trace, and failure states | Hidden holdout, resource budget, repeatable benchmark, and isolated runner |

**Judge walkthrough:** choose a case → run the harness → inspect the baseline request → inspect the bounded rule → confirm the blocked abuse path and preserved authorised path.

**Honest success measures for the finale:** precision and recall on organiser holdout, validated-patch rate, false-fix rate, time-to-proof, resource use, and safety violations. These are evaluation targets, not current claimed results.

## References

[1]: https://www.cyberchallenge.in/tcq2026 "Terrier Cyber Quest 2026 official event page"
[2]: https://www.cyberchallenge.in/registration/ai-kavach "AI Kavach registration page"
