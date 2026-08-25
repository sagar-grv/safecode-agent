# Kavach Sentinel

**Kavach Sentinel** is a sandbox-only cyber-reasoning proof system for **Terrier Cyber Quest 2026 — AI Kavach, Track 2**. It demonstrates a bounded security-remediation loop: reproduce a seeded vulnerability, apply one narrow policy change, and verify both the blocked abuse path and the preserved authorised path.

> This repository contains an executable synthetic demonstration. It is not a real-target scanner and must not be used against systems, networks, repositories, or personal data without explicit organiser authorisation and a permitted sandbox adapter.

## Live demonstration

- **Product overview:** https://kavach-sentinel.vercel.app/
- **Control room:** https://kavach-sentinel.vercel.app/kavach?case=BOLA-001
- **Case file:** https://kavach-sentinel.vercel.app/evidence?case=BOLA-001
- **Architecture:** https://kavach-sentinel.vercel.app/architecture
- **Judge brief:** https://kavach-sentinel.vercel.app/submission

The control room is the working part of the project. Select one allowlisted case, run the server-side synthetic harness, and inspect the returned evidence, bounded rule, trace, and regression checks.

## Why this matches AI Kavach Track 2

The published Track 2 brief describes a cyber-reasoning system that combines an LLM with fuzzers, static analysis, dynamic analysis, and a regression harness to find a vulnerability, patch it, and prove that the fix holds in a simulated defence-software environment.[1] Kavach Sentinel implements the **proof contract** first and keeps the current implementation intentionally narrow while the organiser’s target schema, permitted tools, and hidden holdout are unknown.

| Track 2 concern | Kavach Sentinel response |
|---|---|
| Find a concrete vulnerability | Three seeded synthetic API cases model BFLA, BOLA, and security misconfiguration. |
| Propose or apply a remediation | The executable harness applies a narrow, scenario-specific policy rule inside a synthetic in-process model. |
| Prove the fix | Each run checks two paths: unauthorised abuse must be blocked and authorised access must remain available. |
| Keep autonomy safe | The endpoint accepts only an allowlisted scenario ID. It accepts no target URL, arbitrary source, shell command, uploaded code, or external destination. |
| Make decisions inspectable | The result includes a run ID, baseline request/outcome, patch rule and scope, five-stage trace, and regression checks. |

## Current executable scope

The public demo has three deterministic scenarios:

| ID | Case | Baseline | Expected protected result |
|---|---|---|---|
| `BFLA-001` | Administrative delete exposed to operator role | Operator reaches a privileged delete handler | Operator is denied; administrator path remains valid |
| `BOLA-001` | Cross-owner task disclosure | Operator reads another operator’s task | Cross-owner read returns `403 Forbidden`; owner read remains valid |
| `MISCONFIG-001` | Debug route exposed in production profile | Debug endpoint is reachable | Debug route is blocked in the production profile |

The current harness is deterministic and server-side. It is designed to make the judge flow reproducible, not to imply general vulnerability coverage. The interface begins in a queued state, shows running stages during the request, displays an empty proof record before execution, and shows an error rather than silently accepting a failed or missing proof.

## System flow

```text
Allowlisted scenario ID
          │
          ▼
Synthetic baseline reproduction
          │  request + observed unsafe outcome
          ▼
Bounded policy rule
          │  scenario-specific change, no arbitrary tools
          ▼
Regression verifier
          │  blocked abuse + preserved authorised path
          ▼
Inspectable proof record
          ├── five-stage trace
          ├── patch rule and changed scope
          └── checks, timing, and decision
```

The production-ready extension point is an organiser adapter, not an open target input. The adapter should be added only after the organiser supplies the repository/API contract, permitted scanners and models, sandbox boundary, resource limits, and evaluation protocol.

## What is deliberately not claimed

This repository does **not** claim real Armed Forces deployment, real-world target scanning, comprehensive vulnerability discovery, hidden-holdout performance, 100% recall, production-safe autonomous patching, or finale readiness. Those claims require permitted organiser infrastructure and repeatable evaluation data. The event materials also contain schedule and delivery details that should be confirmed with the organisers before submission.[1] [2]

Critical gaps before a real evaluation include broader vulnerability classes, static and dynamic tool adapters, fuzzing within the permitted sandbox, isolated patch execution, rollback, resource budgets, provenance, human approval on uncertainty, multi-finding handling, flaky-tool recovery, prompt-injection resistance, supply-chain controls, and independent holdout measurement.

## Technology

- Next.js 16 App Router and React 19
- TypeScript with strict checking
- Zod request validation
- Deterministic TypeScript synthetic runner
- Vitest test suite
- CSS Modules and Lucide icons
- Vercel production deployment with GitHub integration

## Local development

Requirements: Node.js 22+ and npm.

```bash
npm install
npm run dev
```

Open `http://localhost:3000/`. The synthetic Kavach run does not require credentials or external services.

To exercise the endpoint directly with an allowlisted scenario:

```bash
curl -X POST http://localhost:3000/api/kavach/run \
  -H 'Content-Type: application/json' \
  -d '{"scenarioId":"BOLA-001"}'
```

Any other scenario ID is rejected. The endpoint is intentionally not a generic target, code, command, or URL execution interface.

## Quality gates

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

The current repository gate contains **60 automated tests**. Test counts describe the checked codebase; they are not competition benchmark results.

## Submission materials

- [Grounded five-slide submission content](docs/AI_KAVACH_SUBMISSION_CONTENT.md)
- [Readiness assessment and critical-case matrix](docs/READINESS_ASSESSMENT.md)
- [Motion-led redesign brief](docs/MOTION_LED_REDESIGN.md)
- [Judge demo script](docs/JUDGE_DEMO_SCRIPT.md)
- [Architecture notes](docs/ARCHITECTURE.md)
- [Security boundary](SECURITY.md)

## Official references

[1]: https://www.cyberchallenge.in/tcq2026 "Terrier Cyber Quest 2026 official event page"
[2]: https://www.cyberchallenge.in/registration/ai-kavach "AI Kavach registration page"

## License

MIT
