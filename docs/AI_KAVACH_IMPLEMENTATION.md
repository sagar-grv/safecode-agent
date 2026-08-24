# AI Kavach Solution Playbook: Kavach Sentinel

**Prepared by Manus AI**  
**Purpose:** Build a lightweight, auditable, sandbox-only AI security system that discovers vulnerabilities, proposes patches, applies them in an ephemeral workspace, and proves that the fix works.

## 1. Recommended solution concept

Build **Kavach Sentinel**, initially focused on Python REST APIs. The first version should detect and remediate three vulnerability classes that are both relevant to API security and measurable in a local lab: **Broken Object Level Authorization**, **Broken Function Level Authorization**, and **Security Misconfiguration**. These classes are listed in the OWASP API Security Top 10, making them defensible choices for a shortlisting proposal.[1]

The system’s central promise is not “an LLM that hacks applications.” It is:

> **A constrained cyber-reasoning pipeline that combines static analysis, bounded dynamic probes, safe fuzzing, structured LLM reasoning, minimal patch generation, and automated regression proof.**

The LLM should be advisory. A deterministic policy engine must decide which targets, files, commands, requests, and patch patterns are allowed. This is safer, easier to benchmark, and more credible for a defence-oriented evaluation than an unconstrained autonomous agent.

## 2. Build order

| Step | Build outcome | Definition of done |
|---:|---|---|
| 1 | Target adapter | A repository or local service can be loaded with an OpenAPI document, test identities, synthetic objects, and a content hash. |
| 2 | Policy gate | Network egress is denied by default; only approved local commands, files, routes, request counts, and time budgets are permitted. |
| 3 | Static analyzer | The system identifies route handlers, object lookups, role checks, debug settings, and candidate source locations. |
| 4 | Dynamic explorer | The system sends bounded requests using synthetic identities and compares owner, non-owner, and admin behaviour. |
| 5 | Safe fuzzer | The system mutates object IDs, roles, parameters, and small JSON values without destructive or unbounded traffic. |
| 6 | Evidence correlator | Dynamic traces are joined with source slices and converted into a confidence-scored finding. |
| 7 | Structured reasoner | The LLM returns JSON containing decision, root cause, patch strategy, test plan, and safety notes. |
| 8 | Patch engine | The proposed change is applied to an ephemeral worktree and recorded as a minimal diff. |
| 9 | Regression verifier | The original exploit is blocked, legitimate behaviour survives, and functional/security tests pass. |
| 10 | Evidence and metrics | The system writes a JSON report, human-readable finding, patch diff, and timing/resource metrics. |

## 3. Detailed implementation steps

### Step 1 — Freeze the scope

Start with one target technology: Python REST APIs implemented in a FastAPI- or Flask-like style. Do not begin with arbitrary languages, cloud infrastructure, malware, or real network targets. A narrow target makes it possible to demonstrate precision, speed, and repeatability within the competition’s limited proposal and finale time.

Use the following first-release finding classes:

| Class | Detection signal | Approved patch pattern |
|---|---|---|
| BOLA / IDOR | A non-owner can retrieve another user’s synthetic object while the legitimate owner can retrieve it. | Enforce ownership or an admin-role check before returning the object. |
| BFLA | A regular synthetic user can invoke an administrative function while an admin can also invoke it. | Enforce the required role at the function boundary. |
| Misconfiguration | A debug endpoint or unsafe configuration is exposed in the simulated production profile. | Disable debug routes or replace unsafe defaults with secure configuration. |

Add SSRF only as a stretch goal, and only against a local allowlisted mock service. SSRF introduces additional safety and environment complexity and should not be allowed to destabilise the core submission.

### Step 2 — Build the synthetic lab

Create small in-memory or containerised services with paired vulnerable and secure versions. Each service should contain synthetic users, roles, objects, and canary values. Every test target must be local-only and must not open arbitrary outbound connections.

The initial lab should contain at least 12 services and 20 seeded vulnerability cases before the finale. Vary route names, source layout, variable names, object schemas, and role names. Keep a hidden holdout set separate from prompts and development tuning so that results measure generalisation rather than memorisation.

For each case, record the expected class, vulnerable location, legitimate behaviour, exploit behaviour, and expected patch. For each secure control, record the fact that no finding should be emitted. This makes precision and false-positive measurement possible.

### Step 3 — Implement the policy gate first

The policy gate is the most important safety component. It should enforce the following controls before any analysis begins:

| Control | Implementation approach |
|---|---|
| Target scope | Require a local repository hash or organiser-issued sandbox identifier. |
| Network | Deny external egress; allow only explicitly declared local container endpoints. |
| Commands | Use a fixed allowlist such as test runner, parser, formatter, and application start command. |
| Files | Permit edits only inside an ephemeral worktree; reject path traversal and symlink escapes. |
| Requests | Cap requests per service, payload size, concurrency, and execution duration. |
| Data | Use synthetic or organiser-provided dummy data only; redact secrets from model context. |
| Safe stop | Stop on unexpected hosts, unknown tools, test failure, scope mismatch, or policy violation. |
| Audit | Hash inputs, record every probe and patch, and store decision timestamps. |

The LLM must never receive a tool that can run arbitrary shell commands. It should return a structured plan, and deterministic code should interpret only approved fields.

### Step 4 — Add static analysis

For Python, use the AST to identify route decorators, handler functions, object lookups, role-check functions, debug configuration, and potentially unsafe response paths. Add a small rule registry with stable rule IDs such as `KAVACH-BOLA-001`, `KAVACH-BFLA-001`, and `KAVACH-CONFIG-001`.

Static analysis should generate hypotheses, not final findings. For example, a handler that calls `tasks.get(task_id)` without an obvious ownership check is a BOLA candidate, but it becomes confirmed only when the dynamic probe demonstrates cross-owner access.

### Step 5 — Add bounded dynamic exploration

Create three synthetic identities: two regular operators and one administrator. Create objects owned by each operator. For each route, run only the requests needed to test the declared hypothesis. For a BOLA candidate, compare owner access with non-owner access. For a BFLA candidate, compare regular-user and administrator access. For misconfiguration, use safe GET requests to check whether debug-only information is exposed.

Store the complete request and response trace, but remove tokens or secrets before sending evidence to the LLM. Use canary identifiers so that accidental data leakage is immediately visible.

### Step 6 — Add safe fuzzing

The fuzzer should be small and hypothesis-driven. It can mutate numeric and string IDs, role labels, JSON types, bounded string lengths, and selected query parameters. It should not perform denial-of-service testing, brute force, internet scanning, destructive actions, or unrestricted payload generation.

A useful strategy is to begin with the OpenAPI schema, generate a valid request, and then make one controlled mutation at a time. This improves interpretability and makes it easier to attribute a finding to a specific input change.

### Step 7 — Add evidence correlation

The correlator should join four evidence types: route metadata, static source location, dynamic request/response differences, and test outcomes. Assign a confidence level using deterministic rules. A confirmed BOLA finding should require both a non-owner success response and a source path lacking an ownership or admin check.

The minimum finding schema should include:

```json
{
  "finding_id": "API1-BOLA-001",
  "vulnerability_class": "API1:2023 Broken Object Level Authorization",
  "route": "GET /api/tasks/{task_id}",
  "preconditions": ["authenticated operator_b", "task owned by operator_a"],
  "evidence": {"owner_status": 200, "non_owner_status": 200},
  "source_locations": ["app/tasks.py:42-51"],
  "confidence": 0.99,
  "severity_rationale": "cross-owner object disclosure",
  "patch_strategy": "enforce ownership or admin role",
  "tests": ["non-owner denied", "owner allowed", "admin allowed"]
}
```

### Step 8 — Add structured LLM reasoning

Use a model available through the configured environment, selected from the live catalogue rather than hardcoded assumptions. For the first prototype, `gpt-5-mini` is a sensible low-latency starting point for structured reasoning; the model should be replaceable through an environment variable.

The prompt should tell the model that it is reviewing one synthetic finding, must not invent evidence, must not return shell commands, must not propose real-system access, and must return only the agreed JSON schema. Set `additionalProperties` to false and validate the output before any downstream action.

The model output should contain only a decision, vulnerability class, confidence, root cause, patch strategy, deterministic test plan, and safety notes. If evidence is incomplete, it should select `human_review` or `reject`.

### Step 9 — Implement constrained patching

Apply patches in an ephemeral worktree. Initially support only three transformations: add an ownership/admin check around object retrieval, add an admin-role guard around administrative functions, and disable a debug endpoint or unsafe production setting.

Before verification, run syntax checks, unit tests, formatting checks, and a diff policy. Reject changes that touch files outside the allowed scope, introduce new dependencies without approval, alter test fixtures, or remove security tests.

### Step 10 — Implement regression proof

Every accepted patch must satisfy both negative and positive tests. The negative test proves that the exploit no longer succeeds. The positive test proves that the legitimate owner or authorised role still works. Then run the application’s functional suite and the full security test suite.

The decision logic should be strict:

```text
if policy_violation:
    HUMAN_REVIEW
elif exploit_still_succeeds:
    REJECT
elif legitimate_behaviour_breaks:
    REJECT
elif regression_tests_fail:
    REJECT
else:
    ACCEPT
```

This distinction is central to the project. A patch that blocks all users is not a security fix; it is a denial of functionality.

### Step 11 — Measure performance and resource use

Run repeated trials on development, validation, and hidden holdout services. Report recall, precision, patch success, false-fix rate, regression pass rate, median time to validated fix, number of model calls, peak memory, CPU time, and safety violations.

Do not present the in-memory MVP’s microsecond runtime as a realistic application-security benchmark. It only proves the control flow. The meaningful benchmark should include service startup, parsing, model latency, probe execution, patch application, and verification.

## 4. Current MVP created

A safe local MVP is available in `/home/ubuntu/kavach-sentinel`. It contains:

| File | Purpose |
|---|---|
| `kavach_sentinel/simulated_target.py` | In-memory synthetic API with switchable BOLA, BFLA, and misconfiguration flags. |
| `kavach_sentinel/scanner.py` | Bounded deterministic probes that emit structured findings. |
| `kavach_sentinel/verify.py` | Approved simulated patches and exploit/legitimate-behaviour verification. |
| `kavach_sentinel/reasoner.py` | Optional structured LLM adapter; the model is advisory and cannot execute tools. |
| `run_demo.py` | End-to-end scan, patch, verify, and evidence-bundle demonstration. |
| `run_benchmark.py` | Synthetic vulnerable/secure benchmark runner. |
| `reports/demo_evidence.json` | Evidence from the end-to-end run. |
| `reports/benchmark_results.json` | Benchmark output. |

The current MVP detected all seeded findings in its small local benchmark, produced no false positives on the secure-control case, and validated all simulated patches. These are **development smoke-test results only**, not evidence of production-level accuracy or of performance in the organisers’ environment.

## 5. Suggested three-person team plan

| Person | Primary ownership | Backup responsibility |
|---|---|---|
| Member 1 | Security research, vulnerability taxonomy, probe design, exploit evidence. | Final report and demo narrative. |
| Member 2 | AI/ML orchestration, structured reasoning, evaluation harness, metrics. | Prompt and schema hardening. |
| Member 3 | Systems integration, patch engine, sandbox policy, regression tests, packaging. | Live-demo operations and recovery. |

All members should understand the whole pipeline. During a 36-hour finale, avoid a design where one person is the only operator who can start the system or interpret a failed test.

## 6. Five-slide shortlisting proposal

## Cover

**Kavach Sentinel**  
**Lightweight autonomous vulnerability discovery, patching, and proof of fix**  
AI Kavach — Terrier Cyber Quest 2026

## Slide 1

### Defence software needs fixes that can be trusted

- Modern API systems expose authorization and configuration risks that are difficult to find consistently.
- Static analysis produces hypotheses; dynamic testing proves behaviour; patching without regression proof can create new failures.
- **Kavach Sentinel closes the loop:** discover → reason → patch → verify.
- Initial scope: BOLA, BFLA, and safe configuration issues in Python REST APIs.

## Slide 2

### The system turns evidence into an auditable security decision

- **Discover:** parse routes and run bounded identity-aware probes.
- **Correlate:** join source evidence with request/response differences.
- **Reason:** use an LLM for structured root-cause and patch planning only.
- **Prove:** replay the exploit, preserve legitimate behaviour, and run regression tests.

## Slide 3

### Lightweight architecture keeps autonomy safe and measurable

- Target adapter with OpenAPI/repository input, synthetic identities, and canary data.
- Static analyzer, dynamic explorer, and hypothesis-driven fuzzer behind a deny-by-default policy gate.
- Ephemeral patch worktree with allowlisted transformations and no arbitrary shell execution.
- Evidence bundle records source locations, traces, patch diff, tests, hashes, timing, and resource use.

## Slide 4

### Our advantage is reliable closure, not just vulnerability alerts

- **Novelty:** combines LLM reasoning with deterministic security controls and regression proof.
- **Lightweight:** narrow target scope, bounded probes, replaceable models, and explicit resource budgets.
- **Operational value:** produces a reproducible finding, minimal patch, and evidence that the fix holds.
- **Safety:** local-only targets, synthetic data, egress denial, safe stop, and human review on uncertainty.

## Slide 5

### The prototype is ready to scale from lab to simulated defence stack

- Current MVP detects BOLA, BFLA, and debug exposure in a local synthetic API and validates approved fixes.
- Next deliverables: 12-service benchmark, hidden holdout, OpenAPI adapter, container isolation, metrics dashboard, and finalist-ready packaging.
- Success measures: recall, precision, validated-patch rate, false-fix rate, time-to-fix, resource use, and zero safety violations.
- Final proof: a live end-to-end demonstration against a simulated Armed Forces software environment.

## 7. 36-hour finale runbook

| Time window | Activity | Output |
|---|---|---|
| 0–2 hours | Read environment rules, hash inputs, confirm scope, run health checks. | Baseline report and target inventory. |
| 2–6 hours | Import OpenAPI/source, configure identities, run static analysis. | Route map and ranked hypotheses. |
| 6–12 hours | Run bounded dynamic probes and safe fuzzing. | Confirmed findings with traces. |
| 12–18 hours | Use structured reasoning and select minimal patches. | Patch plans and test plans. |
| 18–26 hours | Apply patches in worktrees and execute security/functional tests. | Candidate patches and verification results. |
| 26–31 hours | Tune only within approved scope; rerun hidden-style cases. | Stable metrics and final evidence. |
| 31–35 hours | Package demonstration, dashboards, reports, and recovery plan. | Reproducible demo bundle. |
| 35–36 hours | Freeze code, hash artifacts, rehearse explanation, submit. | Final submission. |

## 8. Questions to confirm before registration

The event page describes AI Kavach as an in-person 36-hour finale in New Delhi, while the registration form contains “fully online format” wording. The form also says a winning system may be required to be open-sourced without specifying the licence or scope.[4] Ask the organisers to confirm the finalist location, travel support, permitted models and tools, compute availability, input format, exact judging protocol, open-source obligations, and the controlling age/team-size rules before committing resources.

## References

[1]: https://owasp.org/API-Security/editions/2023/en/0x11-t10/ "OWASP Top 10 API Security Risks — 2023"

[2]: https://owasp.org/www-project-application-security-verification-standard/ "OWASP Application Security Verification Standard"

[3]: https://csrc.nist.gov/projects/ssdf "NIST Secure Software Development Framework"

[4]: https://www.cyberchallenge.in/tcq2026 "Terrier Cyber Quest 2026 official event page and AI Kavach description"
