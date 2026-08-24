# Live review

The production route https://kavach-sentinel.vercel.app/kavach loaded successfully on 24 August 2026. The live page rendered the redesigned control-room UI with the product mark, target lock, four-stage pipeline, threat summary, finding cards, metrics, execution trace, and safety contract.

The Run control loop button was clicked successfully. The production UI changed to `Validating control loop`, disabled the button during execution, and marked the active stage as `Running now`, confirming the client-side motion and server route are working in the deployed environment.

The live system is not currently a real-data security scanner. The Vercel route runs a deterministic synthetic demonstration and returns seeded findings and illustrative metrics. It does not yet ingest arbitrary real repositories or organiser-provided OpenAPI targets, run a real fuzzer/static-analysis engine against them, persist evidence, or prove performance on a hidden holdout. This is appropriate for a safe demo but is not sufficient to claim complete competition readiness.


## Post-fix production verification

After the latest main-branch deployment, the live route shows a `SYNTHETIC DEMO` badge, a `TARGET LOCKED · SYNTHETIC` label, and a clear notice that no real systems or personal data are queried. The Run control loop interaction again entered `Validating control loop` and marked the active stage as `Running now` without an error.


## Awwwards-inspired production verification

The final production page at https://kavach-sentinel.vercel.app/kavach now uses an editorial one-story layout: oversized hero typography, a restrained black-and-lime hero signal, target boundary, a four-stage narrative rail, a proof surface with progressive detail tabs, a measured metrics wall, and a separate safety-contract section. The page is substantially less dense than the earlier control-room version and the synthetic-only disclosure remains visible near the target boundary.

The Run control loop was triggered in production. The interface changed to `Running control loop`, marked the current stage `RUNNING`, and preserved the evidence sections without navigation or error. The final Vercel deployment corresponding to the latest repository push is `READY`.
