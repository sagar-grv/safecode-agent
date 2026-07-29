# Architecture

## Components

| Component | Responsibility |
| --- | --- |
| `TaskComposer` | Bounded task and CSV input |
| `/api/execute` | HTTP validation and error contract |
| `execution-service` | Plan → inspect → execute → observe → repair loop |
| `ai-planner` | Structured Python plan through Vercel AI Gateway |
| `templates` | Deterministic supported-task fallback and repair demo |
| `safety` | Import, dynamic-code, loop, and path policy |
| `sandbox-executor` | MicroVM lifecycle, process limits, logs, artifacts |
| `ExecutionPanel` | Attempts, code, output, artifacts, and trace |

## State sequence

```text
VALIDATE
  └─► PLAN
        └─► STATIC_POLICY
              ├─ blocked ─► REPLAN (if attempts remain)
              └─ accepted ─► CREATE_SANDBOX
                                └─► EXECUTE
                                      ├─ failure ─► OBSERVE ─► REPAIR
                                      └─ success ─► COLLECT_ARTIFACTS
                                                      └─► STOP_SANDBOX
                                                            └─► RESPOND
```

Each attempt receives a fresh filesystem and VM. A failed script therefore
cannot leave state that changes a later repair attempt.

## Planner resilience

The planner sends only the task and parsed column names to AI Gateway. If the
Gateway is disabled or unavailable, a deterministic planner supports generic
CSV profiling and the revenue-by-region chart demonstration. The response
records which planner produced every attempt.

## Result protocol

Python must print one final line:

```text
SAFECODE_RESULT={"summary":"...","facts":[{"label":"...","value":"..."}]}
```

The server validates this payload with Zod. Exit code zero without a valid
payload is treated as a failed attempt.
