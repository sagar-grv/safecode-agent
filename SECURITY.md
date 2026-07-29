# Security policy

## Execution trust boundary

Every generated script is untrusted. It never runs in the Next.js process.
Accepted scripts execute inside a fresh Vercel Sandbox Firecracker microVM with
no application secrets and a deny-all outbound network policy.

Defense-in-depth controls:

- Zod validation and 500 KB request cap
- 12 KB generated-code cap
- standard-library import allowlist
- static literal-path contract (`input.csv` and `artifacts/*`)
- blocks dynamic execution, runtime introspection, interactive input, dunder
  access, and obvious unbounded loops
- one vCPU microVM
- 30 seconds of CPU/wall time for the Python command
- 512 MB virtual-memory limit for the Python process
- 32-process and 10 MB output-file limits
- 20,000-character stdout/stderr capture limit
- eight artifacts, 2 MB each, from four allowlisted MIME types
- three execution attempts maximum
- unconditional sandbox shutdown in a `finally` block

## Untrusted model and dataset content

Only the task and CSV column names are sent to the planner. Dataset rows are not
sent to the model, which limits both data exposure and indirect prompt
injection. The generated code still has to pass the static policy and microVM
boundary.

## Reporting a vulnerability

Open a private GitHub security advisory for this repository. Do not include
live credentials, personal data, or third-party private datasets in a public
issue.

## Known limitations

- Regex/static inspection is conservative and is not a complete Python parser.
- The demo has no user authentication or distributed rate limiting.
- Artifact SVGs are downloaded rather than injected into the application DOM.
- AI planning depends on the configured Gateway model; the deterministic
  planner covers the documented demo tasks when it is unavailable.
