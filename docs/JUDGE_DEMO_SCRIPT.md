# Kavach Sentinel — Judge Demonstration Script

## Demonstration objective

Show that Kavach Sentinel completes a safe, auditable security loop against a simulated defence API stack: it locks scope, discovers vulnerabilities, correlates evidence, returns a constrained reasoning output, applies minimal patches in an isolated worktree, and proves that the exploit is blocked without breaking legitimate access.

## Recording sequence

| Sequence | What appears on screen | Judge takeaway |
|---:|---|---|
| 1 | Hero screen: Kavach Sentinel, AI Kavach Track 02, and the four-stage loop. | The solution is purpose-built for Track 2 and has a clear end-to-end story. |
| 2 | Target Locked bar showing synthetic Armed Forces API stack, local sandbox, Python REST API, and egress denied. | The target is simulated and the operating boundary is explicit. |
| 3 | Scan → Reason → Patch → Prove rail. | The system combines the required analysis and remediation stages. |
| 4 | Three verified findings: critical BFLA, high BOLA, medium misconfiguration. | The system identifies concrete security problems rather than producing generic AI text. |
| 5 | Before / after tab for the BFLA finding. | The unauthorised operator succeeds before the patch and receives 403 after the patch. |
| 6 | Safety proof tab. | The authorised admin path remains intact and regression tests pass. |
| 7 | Metrics and execution trace. | The run produces measurable outcomes and an auditable evidence trail. |
| 8 | Safety contract panel. | The LLM is advisory, data is synthetic, egress is denied, and uncertainty causes human review. |

## Spoken or captioned explanation

“Kavach Sentinel is a constrained cyber-reasoning system for simulated defence infrastructure. We begin with a locked synthetic target and deny external network access. The scanner combines route analysis with bounded identity-aware probes. The reasoner receives sanitised evidence and returns a strict JSON patch plan; it cannot execute commands or edit files directly. Each patch is applied in an ephemeral worktree. The verifier then replays the exploit, checks that legitimate access remains available, runs regression tests, and records the result. Here, the operator’s administrative delete request changes from 204 to 403 while the admin path remains available. The final bundle contains the finding, evidence, patch, tests, hashes, and metrics.”

## Claims to make carefully

The current values shown in the dashboard are a development demonstration over synthetic cases. They should be described as **MVP smoke-test metrics**, not as final performance claims for the organiser’s hidden environment. The final submission should replace them with repeated-run results over a larger benchmark and clearly identify the test set, model, hardware, and runtime conditions.
