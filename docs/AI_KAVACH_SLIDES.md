# AI Kavach Track 2 — Kavach Sentinel slide content

This document is the text source for the five-slide submission deck. It follows the organiser’s stated structure: introduction and idea, detailed methodology, technology stack/flow/block diagram, salient features and novelty, and final deliverables.[1] It describes the current synthetic proof-of-concept without presenting future evaluation targets as completed results.

## Cover

# Kavach Sentinel

### Sandbox-only cyber reasoning that reproduces one vulnerability, applies a bounded rule, and verifies the fix

**AI Kavach · Terrier Cyber Quest 2026 · Track 2**  
Stoneage · Sagar Hemant Gurav

## Slide 1 — The problem and idea

### Track 2 requires a fix that holds

The published Track 2 brief calls for a system that combines an LLM with fuzzers, static analysis, dynamic analysis, and regression testing to find a vulnerability, patch it, and prove that the fix holds in the organiser’s simulated environment.[1]

A finding is not yet a trusted remediation. The system must reproduce the vulnerable request, apply a narrow change, block the unauthorised path, and preserve the authorised path.

Kavach Sentinel implements that proof contract as a controlled loop: **select a declared case → reproduce the flaw → apply one bounded rule → run regression checks → record evidence**.

The current prototype covers three deterministic synthetic API cases: BFLA, BOLA, and security misconfiguration. It accepts no target URL, arbitrary code, shell command, personal data, or external egress.

## Slide 2 — Detailed methodology

### One run creates an inspectable proof record

1. **Select** — accept one allowlisted scenario ID and its expected vulnerable path.
2. **Reproduce** — execute the baseline request and record the unsafe outcome.
3. **Bound** — apply one scenario-specific policy rule inside the synthetic harness.
4. **Prove** — check both paths: unauthorised abuse must be blocked and authorised access must remain available.

The public control room begins with an empty proof state. During execution, the trace moves through queued and running stages. The server returns the proof record only after the synthetic checks complete. A failure is shown as a failure; it is never silently converted into success.

**Acceptance rule:** `403 Forbidden` for the abuse path and a valid authorised response for the legitimate path.

## Slide 3 — Technology, flow, and boundary

### The verifier—not model output—accepts a patch

**Controlled input**  
Allowlisted scenario ID in the current prototype. The finale adapter will accept only the repository or API contract and tools permitted by the organiser.

**Evidence layer**  
Deterministic baseline request, observed unsafe outcome, scenario metadata, and regression expectations.

**Reasoning and remediation**  
The architecture allows structured model advice and approved transformations, but the current public demo applies only a narrow synthetic policy rule. No arbitrary tool or shell execution is exposed.

**Decision gate**  
A server-side verifier checks the blocked abuse path and the preserved authorised path, then records the decision, trace, and evidence.

**Implementation:** Next.js 16, React 19, TypeScript, Zod, Vitest, CSS Modules, and Vercel deployment. The repository currently has 60 automated tests.

**Safety boundary:** no external egress, no arbitrary input, deterministic allowlist, visible failure states, and organiser adapter pending.

## Slide 4 — Salient features and novelty

### The deliverable is evidence, not a vulnerability alert

**Before-and-after evidence**  
The judge can see the baseline request, observed response, expected protected response, and regression checks.

**Bounded remediation**  
The current harness changes one narrow policy boundary rather than claiming arbitrary code repair.

**Safe-stop behaviour**  
The input boundary is closed by default. Invalid scenarios and failed checks reject the run instead of producing a success-looking result.

**Novelty**  
Reasoning may propose an action, but a verifier owns the acceptance decision. The core contribution is the explicit closure contract: abuse is blocked while authorised behaviour remains usable.

## Slide 5 — Final deliverables and finale plan

### From synthetic proof to organiser-sandbox evaluation

**Demonstrable now**

- Three allowlisted synthetic API cases.
- Before/after evidence, bounded rule, visible trace, and two regression paths per run.
- 60 automated repository tests and a public reproducible control room.

**Build when the organiser scope is supplied**

- Adapter for the provided repository/API schema.
- Permitted static analysis, dynamic analysis, and bounded fuzzing.
- Isolated patch runner, rollback, resource budget, and evidence persistence.
- Hidden holdout and repeatable benchmark.

**Judge walkthrough**

Choose a case → run the proof → inspect the vulnerable request → inspect the bounded rule → confirm blocked abuse and preserved authorised access → open the evidence record.

**Evaluation targets, not current results:** precision, recall, validated-patch rate, false-fix rate, time-to-proof, resource use, and zero safety violations.

## References

[1]: https://www.cyberchallenge.in/tcq2026 "Terrier Cyber Quest 2026 official event page"
[2]: https://www.cyberchallenge.in/registration/ai-kavach "AI Kavach registration page"
