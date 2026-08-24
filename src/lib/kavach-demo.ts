export type KavachStage = "scan" | "reason" | "patch" | "prove";

export interface KavachFinding {
  id: string;
  title: string;
  className: string;
  severity: "critical" | "high" | "medium";
  route: string;
  confidence: number;
  summary: string;
  evidence: {
    before: string;
    after: string;
  };
  patch: string;
  verification: string;
}

export interface KavachTraceStep {
  id: string;
  stage: KavachStage;
  label: string;
  detail: string;
  status: "complete" | "active" | "queued";
  duration: string;
}

export interface KavachDemoResult {
  runId: string;
  target: string;
  targetHash: string;
  findings: KavachFinding[];
  trace: KavachTraceStep[];
  metrics: {
    services: number;
    cases: number;
    precision: number;
    recall: number;
    patchSuccess: number;
    regressionPass: number;
    safeStops: number;
    elapsed: string;
    memory: string;
  };
  safety: string[];
  llm: {
    model: string;
    mode: string;
    output: string;
  };
}

const findings: KavachFinding[] = [
  {
    id: "API5-BFLA-001",
    title: "Administrative delete exposed to operator role",
    className: "Broken Function Level Authorization",
    severity: "critical",
    route: "DELETE /api/users/{user_id}",
    confidence: 0.99,
    summary:
      "A regular operator received a successful response from an administrative delete function.",
    evidence: {
      before: "operator_a → DELETE /api/users/operator_b → 204 No Content",
      after: "operator_a → DELETE /api/users/operator_b → 403 Forbidden",
    },
    patch: "Require role == admin before invoking the delete handler.",
    verification: "Operator blocked; admin access preserved; regression suite passed.",
  },
  {
    id: "API1-BOLA-001",
    title: "Cross-owner task disclosure",
    className: "Broken Object Level Authorization",
    severity: "high",
    route: "GET /api/tasks/{task_id}",
    confidence: 0.99,
    summary:
      "An operator could retrieve a synthetic task owned by a different operator.",
    evidence: {
      before: "operator_b → GET /api/tasks/task_a → 200 + owner=operator_a",
      after: "operator_b → GET /api/tasks/task_a → 403 Forbidden",
    },
    patch: "Enforce object ownership or an administrator role before returning the object.",
    verification: "Non-owner blocked; owner and admin access preserved; tests passed.",
  },
  {
    id: "API8-MISCONFIG-001",
    title: "Debug endpoint enabled in production profile",
    className: "Security Misconfiguration",
    severity: "medium",
    route: "GET /api/debug",
    confidence: 0.98,
    summary: "A debug-only route exposed environment details in the simulated stack.",
    evidence: {
      before: "operator_a → GET /api/debug → 200 { debug: true }",
      after: "operator_a → GET /api/debug → 404 Not Found",
    },
    patch: "Disable the debug route in the production configuration.",
    verification: "Debug exposure removed; normal API access preserved; tests passed.",
  },
];

export function runKavachDemo(): KavachDemoResult {
  const runId = `KS-${new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14)}`;
  return {
    runId,
    target: "Synthetic Armed Forces API stack · local sandbox",
    targetHash: "sha256:3d6f…8e91",
    findings,
    trace: [
      { id: "scope", stage: "scan", label: "Scope locked", detail: "12 services · OpenAPI loaded · synthetic identities ready", status: "complete", duration: "0.4s" },
      { id: "probe", stage: "scan", label: "Bounded probes complete", detail: "300-request ceiling · no external egress", status: "complete", duration: "18.2s" },
      { id: "correlate", stage: "reason", label: "Evidence correlated", detail: "3 high-confidence findings matched to source locations", status: "complete", duration: "7.8s" },
      { id: "plan", stage: "reason", label: "Patch plans returned", detail: "Strict JSON schema · no tool execution · human-auditable", status: "complete", duration: "4.1s" },
      { id: "apply", stage: "patch", label: "Ephemeral patches applied", detail: "3 minimal diffs · worktree hash recorded", status: "complete", duration: "12.6s" },
      { id: "prove", stage: "prove", label: "Regression proof passed", detail: "Exploit blocked · legitimate access preserved", status: "complete", duration: "21.4s" },
    ],
    metrics: {
      services: 12,
      cases: 40,
      precision: 1,
      recall: 1,
      patchSuccess: 1,
      regressionPass: 1,
      safeStops: 0,
      elapsed: "64.5s",
      memory: "218 MB peak",
    },
    safety: [
      "Deny-by-default network policy",
      "Synthetic data and canary identifiers only",
      "LLM cannot execute commands or edit files directly",
      "Patch changes isolated in an ephemeral worktree",
      "Human review required for uncertainty or policy violations",
    ],
    llm: {
      model: "Structured security reasoner",
      mode: "advisory · JSON schema",
      output: "root cause + patch plan + deterministic regression tests",
    },
  };
}
