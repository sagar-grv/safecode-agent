## Cover

# Kavach Sentinel

### Lightweight autonomous vulnerability discovery, patching, and proof of fix

AI Kavach · Terrier Cyber Quest 2026 · Sagar Hemant Gurav

## Slide 1

### A security fix is only valuable when it can be proven

**Problem**  
API authorization and configuration weaknesses can survive conventional reviews. Static analysis finds suspicious code, while dynamic testing shows behaviour; neither alone proves that an automated fix is safe.

**Idea**  
Kavach Sentinel closes the loop in a sandbox-only pipeline: **discover → reason → patch → prove**.

**Scope**  
The first release targets BOLA, BFLA, and security misconfiguration in Python REST APIs using synthetic identities and canary data.

## Slide 2

### Evidence becomes a constrained, auditable security decision

1. **Discover** — parse OpenAPI routes and run bounded identity-aware probes.
2. **Correlate** — join request/response differences with source-level evidence.
3. **Reason** — ask an LLM for a strict JSON root-cause, patch, and test plan; the model cannot execute tools.
4. **Prove** — apply a minimal patch in an ephemeral worktree, replay the exploit, preserve legitimate behaviour, and run regression tests.

**Safety gate:** deny-by-default egress, allowlisted operations, request/time budgets, synthetic data, and human review on uncertainty.

## Slide 3

### Lightweight architecture keeps autonomy safe and measurable

**Inputs**  
Repository or OpenAPI specification · synthetic roles and objects · declared sandbox scope

**Analysis layer**  
AST/static rules · bounded API explorer · hypothesis-driven fuzzer · evidence correlator

**Reasoning and remediation**  
Structured LLM output · approved patch transformations · ephemeral worktree · deterministic regression verifier

**Outputs**  
Finding report · patch diff · exploit replay · legitimate-access proof · hashes · timing and resource metrics

## Slide 4

### Our advantage is reliable closure, not just vulnerability alerts

**Novelty**  
LLM reasoning is combined with deterministic policy gates and proof-oriented regression testing.

**Lightweight design**  
A narrow API scope, bounded probes, replaceable model, explicit resource budget, and no arbitrary shell execution.

**Operational value**  
Each accepted result explains the root cause, identifies the patch, and demonstrates that the vulnerability is blocked without breaking authorised behaviour.

**Safety by design**  
Local-only simulated targets, synthetic data, egress denial, immutable evidence, safe stop, and human review.

## Slide 5

### From working local prototype to simulated defence-stack evaluation

**Current proof**  
MVP detects three seeded vulnerability classes and validates approved simulated patches with zero secure-case false positives in the smoke benchmark.

**Final deliverables**  
OpenAPI adapter · 12-service benchmark · hidden holdout · container isolation · model-backed reasoner · evidence dashboard · reproducible demo package.

**Success measures**  
Recall · precision · validated-patch rate · false-fix rate · time-to-fix · resource use · zero safety violations.

**Final demonstration**  
Show a real exploit before the patch, the constrained reasoning plan, the minimal diff, the blocked exploit after the patch, preserved admin access, and the complete audit trail.
