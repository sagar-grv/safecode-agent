# Kavach Sentinel readiness assessment

## Purpose

This document distinguishes what the current Kavach Sentinel prototype proves, what Terrier Cyber Quest 2026 AI Kavach Track 2 appears to require, and what remains before a claim of real-world readiness.

## Official event findings reviewed 26 August 2026

The official TCQ 2026 event page describes a 36-hour live finale in a secure simulated national-infrastructure environment using realistic dummy data. The AI Kavach track is listed alongside Bug Hunting and Creators Challenge, but the public page does not publish a complete target schema, allowed tool list, hidden-holdout protocol, or detailed AI Kavach scoring rubric. The official registration form says the exact task scope and datasets will be confirmed by organisers before the qualifier closes.

The registration form asks for a team or entry name, team size of one to three, member details, category, prior experience, project title, approach summary, planned technology stack, GitHub or portfolio link, and a PPT/PDF abstract link. It contains declarations that the team can build and demonstrate a working solution in the 36-hour finale and that tools will be tested only in the organiser sandbox or simulated environment, never against real systems or real personal data.

The terms page states that participants must be at least 18, Indian citizens, and from relevant technical backgrounds; teams may have up to three members and each participant may belong to only one team. It also states that submissions may require a proof-of-concept video and PowerPoint, judging includes innovation, feasibility, scalability, impact, and presentation, and non-compliance, plagiarism, false information, confidentiality breaches, or unauthorised external assistance can lead to disqualification.

The public pages contain inconsistencies: the event page currently describes an in-person New Delhi finale, while the registration declaration uses fully online wording, and the terms page contains dates that appear to be from an earlier edition. These items require organiser confirmation and must not be presented as resolved facts.

## Current prototype boundary

The deployed app is an executable synthetic harness. It accepts only three allowlisted scenario IDs: BFLA-001, BOLA-001, and MISCONFIG-001. It runs a deterministic before-state reproduction, a bounded policy rule, and two after-state regression checks. The UI now displays empty, running, passed, failed, and retry states and does not accept target URLs, arbitrary code, shell commands, or uploaded source.

This is meaningful proof of the control-loop shape and of the safety boundary, but it is not yet an autonomous scanner or patcher for arbitrary organiser infrastructure. It does not yet connect the deployed demo to a repository adapter, OpenAPI discovery, a production fuzzer, a static-analysis engine, a dynamic-analysis engine, isolated worktrees or containers, model provenance, persistent evidence storage, hidden holdouts, resource budgets, or organizer-specific telemetry.

## Initial conclusion

Kavach Sentinel is competition-aligned as a **bounded proof-of-concept direction**, not as a complete Track 2 finale implementation. It can work on real situations only after the organiser adapter, sandbox permissions, target schema, tool adapters, isolation model, patch policy, and holdout evaluation are supplied and tested. A production deployment alone does not establish real-world security efficacy.

## References

[1]: https://www.cyberchallenge.in/tcq2026 "Terrier Cyber Quest 2026 — official event page"
[2]: https://www.cyberchallenge.in/registration/ai-kavach "AI Kavach — official registration page"
[3]: https://www.cyberchallenge.in/terms-conditions "Terrier Cyber Quest 2026 — official terms and conditions"

## Security engineering references

NIST describes SSDF as outcome-based secure development practices organized around preparing the organization, protecting the software, producing well-secured software, and responding to vulnerabilities. NIST specifically notes the importance of secure development environments, provenance, security requirements and design decisions, and repeatable vulnerability response; the framework is a basis for a risk-based approach rather than a checklist. This supports treating Kavach’s policy gate, isolated execution, evidence provenance, and regression checks as necessary controls, not decorative UI.

OWASP API1:2023 states that object-level authorization failures can permit unauthorized information disclosure, modification, or destruction when attackers manipulate object IDs in paths, query strings, headers, or payloads. OWASP recommends checking the logged-in user’s permissions on every function that uses client-supplied object references and writing tests that prevent deployment when those tests fail. The current BOLA case is therefore directionally representative, but it covers only one access path and must be expanded to include read, update, delete, nested-resource, query-parameter, role-hierarchy, and cross-tenant variants.

NIST AI RMF describes trustworthy AI in terms including validity and reliability, safety, security and resilience, accountability and transparency, explainability and interpretability, privacy enhancement, and fairness. It emphasizes risk management, monitoring, and human oversight. For Kavach, a production claim therefore requires confidence thresholds, abstention, reviewer escalation, auditability, rollback, monitoring, and holdout evaluation—not merely a successful synthetic run.

## References added

[4]: https://csrc.nist.gov/projects/ssdf "NIST Secure Software Development Framework"
[5]: https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/ "OWASP API1:2023 Broken Object Level Authorization"
[6]: https://www.nist.gov/itl/ai-risk-management-framework "NIST AI Risk Management Framework"

## Critical and edge-case coverage matrix

| Situation | Can the current MVP handle it? | What must exist for competition or real deployment |
|---|---|---|
| Seeded BOLA/BFLA or misconfiguration with a deterministic expected outcome | Yes, for the three allowlisted cases | Map the same contract to the organiser’s target schema and prove repeatability on hidden cases |
| Patch blocks the exploit but breaks an authorised flow | Partially: the synthetic regression checks model this condition | Expand the authorised-role and business-invariant test matrix; reject and roll back the patch |
| Unknown vulnerability class | No | Add static, dynamic, and fuzzing adapters plus a safe abstention path when evidence is insufficient |
| Multiple vulnerabilities in one service | No | Isolate findings, order patches by dependency and risk, and rerun the complete regression suite after every change |
| Conflicting static, dynamic, and model evidence | No explicit policy | Define confidence thresholds, evidence precedence, human escalation, and a no-patch decision |
| LLM hallucinated patch, malformed output, or prompt injection in source/spec data | Not in the deployed synthetic path | Schema validation, tool-less structured output, provenance, prompt/data isolation, patch allowlists, and mandatory verifier rejection |
| Timeout, crash, flaky test, unavailable dependency, or partial tool failure | UI can show a request error, but the synthetic runner is deterministic | Per-stage timeouts, retries with caps, circuit breakers, explicit UNKNOWN state, artifact preservation, and rollback |
| SSRF, command injection, data exfiltration, or escape from the analysis environment | The current route accepts no target URL, code, or command, so it avoids the risk rather than solving it | Container or VM isolation, deny-by-default egress, seccomp or equivalent controls, resource quotas, secret scrubbing, and sandbox monitoring |
| Tenant or role boundary edge cases, nested resources, query/header/payload identifiers | Only one seeded object-level path is covered | Differential tests across roles, tenants, verbs, nesting, identifiers, pagination, and alternate parameter locations |
| Race conditions, stateful workflows, eventual consistency, and replay safety | No | Stateful scenario generation, synchronization controls, idempotence checks, and transaction-aware regression tests |
| Supply-chain or dependency compromise | No | Dependency provenance, signed build artifacts, SBOM, pinned versions, isolated runners, and release attestation |
| Real production incident or safety-critical change | No | Human approval for high-impact changes, canary or staged rollout, observability, rollback, incident response, and independent validation |

### Answer to the three central questions

**Critical and edge cases:** Not comprehensively today. The MVP proves the control-loop skeleton and safe-stop intent on three deterministic cases. It should not be marketed as covering unknown, conflicting, stateful, multi-finding, or infrastructure-escape conditions until those controls are implemented and tested.

**Competition rules:** Directionally aligned and suitable as a transparent proof-of-concept submission. It demonstrates the requested find/fix/prove story, provides a lightweight runnable demo, and preserves the sandbox-only declaration. It is not yet sufficient evidence that the system will meet finale performance, speed, precision, functionality, or scalability on organiser-provided infrastructure; those claims depend on the unpublished target schema and evaluation harness.

**Real situations:** The architecture can become useful in real environments, but the current hosted demo cannot safely or credibly operate on real systems. The correct deployment path is adapter-based and gated: ingest a declared organiser scope, run isolated read-only discovery, generate constrained advice, apply only allowlisted transformations in an ephemeral worktree, execute complete regression and exploit-replay checks, require human review for uncertainty or high-impact changes, and retain a tamper-evident evidence bundle.
