# Live review

The production route https://kavach-sentinel.vercel.app/kavach loaded successfully on 24 August 2026. The live page rendered the redesigned control-room UI with the product mark, target lock, four-stage pipeline, threat summary, finding cards, metrics, execution trace, and safety contract.

The Run control loop button was clicked successfully. The production UI changed to `Validating control loop`, disabled the button during execution, and marked the active stage as `Running now`, confirming the client-side motion and server route are working in the deployed environment.

The live system is not currently a real-data security scanner. The Vercel route runs a deterministic synthetic demonstration and returns seeded findings and illustrative metrics. It does not yet ingest arbitrary real repositories or organiser-provided OpenAPI targets, run a real fuzzer/static-analysis engine against them, persist evidence, or prove performance on a hidden holdout. This is appropriate for a safe demo but is not sufficient to claim complete competition readiness.
