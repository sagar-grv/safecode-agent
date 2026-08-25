# Kavach Sentinel Rebuild Interaction Contract

## Product promise

Kavach Sentinel is a **synthetic security verification lab**. A judge chooses one seeded API scenario, runs an actual in-process before/after regression harness, and receives an evidence record showing the unauthorized request, the bounded patch rule, and the legitimate-access regression result.

The site will not present a simulated target scanner, invented production metrics, or a generic “AI agent” animation. The model role is described as advisory; the executable proof is performed by a deterministic synthetic harness that is safe to run on Vercel.

## First-time judge path

1. The landing page explains in plain language: “Choose a seeded API flaw. Kavach runs the same request before and after a policy patch, then reports whether the exploit is blocked and the authorised path still works.”
2. The control room shows the synthetic boundary, a scenario selector, and a short “What will happen” checklist before the primary action.
3. The judge selects a scenario and clicks **Run verification**.
4. The UI changes from `READY` to `RUNNING`, shows one active stage at a time, disables duplicate submission, and exposes a live status sentence.
5. The server executes the selected synthetic scenario, applies the bounded rule, runs the exploit regression and legitimate-access regression, and returns structured evidence.
6. The UI renders `PASSED`, `BLOCKED`, or `FAILED` based on returned checks. It never shows a successful proof record before a server result exists.
7. The judge can switch between **Evidence**, **Patch**, and **Regression** views. The selected scenario and view are reflected in the URL query string.
8. A clear **Run another scenario** action resets the state without silently preserving stale evidence.

## Control contract

| Control | Required behavior |
|---|---|
| Scenario selector | Native labelled select. It changes the selected scenario and updates the URL query string. No hidden fake options. |
| Run verification | POSTs the selected scenario to `/api/kavach/run`; shows loading and stage progression; prevents duplicate calls; renders inline error with retry if the request fails. |
| Stage rail | Starts with all stages `QUEUED`; changes to `RUNNING` and then `PASSED`/`BLOCKED` from the real returned trace. |
| Finding / scenario summary | Uses returned case data; no hardcoded “99%” unless derived from actual checks. |
| Evidence / Patch / Regression tabs | Proper `tablist` semantics with `aria-selected`, `aria-controls`, keyboard arrow navigation, and query-string synchronization. |
| Case-file links | Each seeded case has a real URL and renders its own title, route, before state, patch, after state, and regression checks. |
| Back | Uses browser history when available and falls back to the site home. |
| Copy links | Use semantic anchors so middle-click and Cmd/Ctrl-click work. |

## Server proof contract

The server runner accepts only a fixed scenario enum and never accepts target URLs, arbitrary source code, shell commands, file paths, or network destinations. Each scenario contains executable synthetic request handlers:

- `BFLA-001`: operator attempts an administrative delete; the patched policy blocks the operator and preserves admin access.
- `BOLA-001`: non-owner attempts to read another operator’s task; the patched policy blocks the non-owner and preserves owner access.
- `MISCONFIG-001`: debug route is available in the vulnerable profile; the patched production profile removes the route while preserving a normal route.

The response includes a generated run ID, selected scenario, stage trace, before/after evidence, patch rule, regression checks, elapsed runtime measured by the server, and a derived confidence value based on passed checks. Any failed check makes the overall proof fail; there is no fallback to a canned success response.

## Visual and content contract

The new control room will be a calm, high-contrast technical workspace rather than a decorative sci-fi dashboard. The first viewport will contain the explanation, selector, primary action, and synthetic boundary. Decorative 3D imagery is secondary and will not compete with the proof interaction. Every section has one job: explain, run, inspect, or verify.

The copy must favor direct language over manifesto phrases. “Run verification” is preferred to “Run control loop.” “This is a synthetic scenario; no external target is contacted” is preferred to vague “sandbox connected” language. Fixed benchmark-looking values such as `100% recall`, `64.5s`, and `218 MB` are removed unless they are measured by the current run and labeled accordingly.

## Definition of done

A rebuild is accepted only when the following are true:

- A fresh browser session can understand the product and run a scenario without external instructions.
- All 3 scenario URLs render distinct case data.
- The run uses the selected scenario and returns actual server-generated proof checks.
- A forced API failure produces a visible recovery state instead of a success fallback.
- The initial state is not falsely marked as complete.
- Every visible button and selector has an observable, testable effect.
- The site passes lint, typecheck, unit tests, production build, and browser smoke tests on every primary route.
