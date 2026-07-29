# Resume and interview story

## Project title

**SafeCode Agent — Sandboxed Self-Correcting Python Execution**

## Resume tagline

Policy-check generated Python, execute it in an ephemeral microVM, observe the
failure, and repair it without exposing the application host.

## Resume bullets without unverified metrics

- Built a Next.js/TypeScript execution agent that converts natural-language CSV
  tasks into Python, applies an import/path/dynamic-code policy, and runs
  accepted scripts in deny-all-network Vercel Sandbox microVMs.
- Implemented a bounded observe-and-repair loop with structured stdout/stderr,
  per-attempt provenance, typed artifact collection, and a hard three-attempt
  ceiling.
- Added 48 labeled safety/planning cases, a repeatable 12-case live benchmark,
  strict TypeScript/lint/build gates, and GitHub Actions CI.

## Verified metrics bullet

> Validated the agent across 48 policy/planning cases and 12 production
> sandbox tasks, blocking 24/24 labeled unsafe snippets and achieving 83.3%
> Pass@1, 100% Pass@3, 100% artifact success, and 12.6-second p95 end-to-end
> latency.

Source: `reports/live-evaluation.json`, generated 2026-07-29 against the public
Vercel deployment.

## 30-second interview answer

“I wanted to solve the unsafe part of coding agents: models can generate useful
Python, but that code should not inherit the web app’s credentials or
filesystem. I built a two-stage trust boundary. First, a conservative policy
checks imports, paths, and dynamic execution. Second, the script runs in a
fresh Firecracker microVM with no network and strict process limits. If it
fails, the stderr becomes evidence for a bounded repair attempt. The UI exposes
the code, each attempt, artifacts, and the full trace, so the demo is
inspectable rather than magical.”

## Deep-dive prompts

- Why a microVM rather than `child_process` or a serverless function?
- Which controls prevent resource exhaustion?
- Why send only CSV headers, not rows, to the planner?
- How does a valid exit code differ from a valid result?
- How would shared rate limiting and authentication change the public version?
