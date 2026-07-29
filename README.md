# SafeCode Agent

SafeCode Agent converts a plain-English CSV task into Python, rejects unsafe
code before execution, runs the accepted script in an ephemeral
[Vercel Sandbox](https://vercel.com/docs/sandbox), observes failures, and
repairs the script for at most three attempts.

It is built as an engineering demonstration, not as a screenshot-only AI demo:
the repository contains the execution boundary, policy scanner, repair loop,
downloadable artifacts, traces, tests, and repeatable evaluations.

## The real-world story

Developer tools increasingly generate code, but running model output in the
application process gives that code access to the same files, network, secrets,
and compute as the product itself. SafeCode separates generation from
execution:

1. Validate a bounded task and CSV payload.
2. Generate a standard-library Python plan through Vercel AI Gateway when
   available; use a constrained deterministic planner as a resilient fallback.
3. Reject disallowed modules, dynamic execution, unbounded loops, and file paths
   outside the workspace contract.
4. Start a fresh Firecracker microVM with `networkPolicy: "deny-all"`.
5. Apply CPU, memory, process, file-size, duration, and output limits.
6. Capture stdout, stderr, typed result data, artifacts, and timing.
7. Feed the observed error into the next plan, with a hard three-attempt ceiling.
8. Stop the microVM and return an auditable trace.

## What works

- CSV upload up to 500 KB
- Natural-language profiling and regional-revenue chart tasks
- Optional AI planning through Vercel AI Gateway
- No-key deterministic fallback for the supported demo scope
- Static code policy before any execution
- Python 3.13 inside an isolated Vercel Sandbox
- Deny-all outbound network policy
- 30-second and 512 MB per-process limits
- Maximum three attempts
- SVG, JSON, CSV, and text artifact collection with size limits
- Downloadable artifacts and copyable execution traces
- 48-case policy evaluation plus a 12-case live sandbox benchmark

## Tech stack

- Next.js 16 App Router, React 19, TypeScript
- Vercel AI SDK 7 and AI Gateway (`openai/gpt-5.4-mini` by default)
- `@vercel/sandbox` with Python 3.13 Firecracker microVMs
- Zod request/result validation
- Vitest and V8 coverage
- CSS Modules and Lucide utility icons
- Vercel production deployment and GitHub Actions CI

## Architecture

```text
Browser
  │ POST /api/execute (task + CSV)
  ▼
Request validation ──► schema-only context
  │
  ▼
AI Gateway planner ──► deterministic fallback
  │
  ▼
Static safety policy
  │ accepted code only
  ▼
Vercel Sandbox (Python 3.13, deny-all network)
  │ stdout / stderr / artifacts
  ├── failure ──► repair plan (max 3)
  └── success ──► typed result + trace
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and
[SECURITY.md](SECURITY.md) for the trust boundaries and limitations.

## Local development

Requirements: Node.js 22+ and npm.

```bash
npm install
npm run dev
```

The interface and policy tests work without credentials. Live Sandbox
execution needs Vercel OIDC locally:

```bash
vercel link
vercel env pull .env.local
```

On a Vercel deployment, both Sandbox and AI Gateway can authenticate through
project OIDC automatically. Set `SAFECODE_AI_MODE=off` to force the
deterministic planner, or `SAFECODE_AI_MODE=on` to always attempt AI planning.

## Quality gates

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

The committed policy suite contains 48 labeled cases. Run the live 12-case
end-to-end benchmark against a deployed instance:

```bash
SAFECODE_BASE_URL=https://your-deployment.example npm run eval:live
```

The command writes `reports/live-evaluation.json`. The production run dated
2026-07-29 completed all 12 tasks with 83.3% Pass@1, 100% Pass@3, 100%
artifact success, and 12.6-second p95 end-to-end latency. The 48-case policy
suite also blocked all 24 labeled unsafe snippets.

## Resume positioning

**Tagline:** Sandboxed self-correcting Python execution with bounded repair and
auditable evidence.

**One-line description:** Built a Next.js agent that converts CSV analysis
requests into policy-checked Python, executes them in deny-all-network
Firecracker microVMs, and repairs failures across a bounded three-attempt loop.

More interview storylines and bullet variants are in
[docs/RESUME.md](docs/RESUME.md).

## Scope and limitations

This project intentionally supports bounded CSV analysis rather than arbitrary
general-purpose computing. Static inspection is defense in depth, not a
substitute for microVM isolation. The portfolio deployment does not include a
distributed request limiter or user authentication; a public high-traffic
deployment should add both before supporting broader workloads.

## License

MIT
