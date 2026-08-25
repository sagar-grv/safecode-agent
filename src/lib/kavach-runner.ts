export const KAVACH_SCENARIO_IDS = ["BFLA-001", "BOLA-001", "MISCONFIG-001"] as const;

export type KavachScenarioId = (typeof KAVACH_SCENARIO_IDS)[number];
export type KavachRunStage = "discover" | "baseline" | "patch" | "prove" | "complete";

export interface KavachCheck {
  id: string;
  label: string;
  request: string;
  expected: string;
  observed: string;
  passed: boolean;
}

export interface KavachScenario {
  id: KavachScenarioId;
  title: string;
  category: string;
  severity: "critical" | "high" | "medium";
  route: string;
  shortDescription: string;
  vulnerability: string;
  patch: string;
  baselineOutcome: string;
  protectedOutcome: string;
  allowedOutcome: string;
}

export interface KavachRunResult {
  mode: "synthetic-executable";
  runId: string;
  scenario: KavachScenario;
  status: "passed" | "failed";
  startedAt: string;
  elapsedMs: number;
  trace: Array<{
    id: string;
    stage: KavachRunStage;
    label: string;
    detail: string;
    status: "passed" | "failed";
    durationMs: number;
  }>;
  baseline: {
    findingDetected: boolean;
    request: string;
    observed: string;
    expected: string;
  };
  patch: {
    rule: string;
    scope: string;
    changedFiles: string[];
  };
  checks: KavachCheck[];
  metrics: {
    checks: number;
    passed: number;
    baselineFinding: boolean;
    proofPassed: boolean;
  };
  dataNotice: string;
}

export const kavachScenarios: KavachScenario[] = [
  {
    id: "BFLA-001",
    title: "Administrative delete exposed to operator role",
    category: "Broken Function Level Authorization",
    severity: "critical",
    route: "DELETE /api/users/{user_id}",
    shortDescription: "An operator can reach an administrative delete handler.",
    vulnerability: "The vulnerable handler trusts authentication but does not enforce the admin role.",
    patch: "Require role == admin before invoking the delete handler.",
    baselineOutcome: "operator_a receives 204 No Content",
    protectedOutcome: "operator_a receives 403 Forbidden",
    allowedOutcome: "admin_a receives 204 No Content",
  },
  {
    id: "BOLA-001",
    title: "Cross-owner task disclosure",
    category: "Broken Object Level Authorization",
    severity: "high",
    route: "GET /api/tasks/{task_id}",
    shortDescription: "An operator can read a task owned by another operator.",
    vulnerability: "The vulnerable handler returns the object before checking ownership.",
    patch: "Require task.owner == actor or actor.role == admin before returning the object.",
    baselineOutcome: "operator_b receives 200 OK + owner=operator_a",
    protectedOutcome: "operator_b receives 403 Forbidden",
    allowedOutcome: "operator_a receives 200 OK with task_a",
  },
  {
    id: "MISCONFIG-001",
    title: "Debug endpoint enabled in production profile",
    category: "Security Misconfiguration",
    severity: "medium",
    route: "GET /api/debug",
    shortDescription: "A debug-only endpoint is reachable in the production profile.",
    vulnerability: "The vulnerable profile registers the debug route without an environment gate.",
    patch: "Register the debug route only in the development profile.",
    baselineOutcome: "operator_a receives 200 OK + debug=true",
    protectedOutcome: "operator_a receives 404 Not Found",
    allowedOutcome: "operator_a receives 200 OK from /api/health",
  },
];

function scenarioFor(id: KavachScenarioId): KavachScenario {
  const scenario = kavachScenarios.find((item) => item.id === id);
  if (!scenario) throw new Error("Unknown Kavach scenario.");
  return scenario;
}

function check(
  id: string,
  label: string,
  request: string,
  expected: string,
  observed: string,
): KavachCheck {
  return { id, label, request, expected, observed, passed: expected === observed };
}

function executeScenario(id: KavachScenarioId, patched: boolean) {
  switch (id) {
    case "BFLA-001": {
      const operatorStatus = !patched ? "204 No Content" : "403 Forbidden";
      const adminStatus = "204 No Content";
      return {
        baselineRequest: "operator_a → DELETE /api/users/operator_b",
        baselineObserved: "204 No Content",
        baselineExpected: "403 Forbidden",
        checks: [
          check("operator-blocked", "Unauthorised operator is blocked", "operator_a → DELETE /api/users/operator_b", "403 Forbidden", operatorStatus),
          check("admin-preserved", "Administrator path still works", "admin_a → DELETE /api/users/operator_b", "204 No Content", adminStatus),
        ],
      };
    }
    case "BOLA-001": {
      const nonOwnerStatus = !patched ? "200 OK + owner=operator_a" : "403 Forbidden";
      const ownerStatus = "200 OK + owner=operator_a";
      return {
        baselineRequest: "operator_b → GET /api/tasks/task_a",
        baselineObserved: "200 OK + owner=operator_a",
        baselineExpected: "403 Forbidden",
        checks: [
          check("non-owner-blocked", "Non-owner cannot read the task", "operator_b → GET /api/tasks/task_a", "403 Forbidden", nonOwnerStatus),
          check("owner-preserved", "Task owner can still read the task", "operator_a → GET /api/tasks/task_a", "200 OK + owner=operator_a", ownerStatus),
        ],
      };
    }
    case "MISCONFIG-001": {
      const debugStatus = !patched ? "200 OK + debug=true" : "404 Not Found";
      const healthStatus = "200 OK";
      return {
        baselineRequest: "operator_a → GET /api/debug",
        baselineObserved: "200 OK + debug=true",
        baselineExpected: "404 Not Found",
        checks: [
          check("debug-removed", "Debug route is absent from production profile", "operator_a → GET /api/debug", "404 Not Found", debugStatus),
          check("health-preserved", "Normal health route remains available", "operator_a → GET /api/health", "200 OK", healthStatus),
        ],
      };
    }
  }
}

export function runSyntheticVerification(id: KavachScenarioId): KavachRunResult {
  const startedAt = new Date().toISOString();
  const start = performance.now();
  const scenario = scenarioFor(id);
  const baselineExecution = executeScenario(id, false);
  const patchedExecution = executeScenario(id, true);
  const elapsedMs = Math.max(1, Math.round(performance.now() - start));
  const checks = patchedExecution.checks;
  const passed = checks.filter((item) => item.passed).length;
  const proofPassed = passed === checks.length;

  return {
    mode: "synthetic-executable",
    runId: `KS-${startedAt.replace(/[-:TZ.]/g, "").slice(0, 14)}-${id}`,
    scenario,
    status: proofPassed ? "passed" : "failed",
    startedAt,
    elapsedMs,
    trace: [
      { id: "discover", stage: "discover", label: "Load synthetic scenario", detail: `${scenario.route} and canary identities loaded locally.`, status: "passed", durationMs: 1 },
      { id: "baseline", stage: "baseline", label: "Reproduce baseline behavior", detail: `The vulnerable profile returned ${baselineExecution.baselineObserved}; a finding was detected.`, status: "passed", durationMs: 1 },
      { id: "patch", stage: "patch", label: "Apply bounded policy rule", detail: `${scenario.patch} No source code or external target was accepted.`, status: "passed", durationMs: 1 },
      { id: "prove", stage: "prove", label: "Run regression checks", detail: `${passed}/${checks.length} post-patch checks passed.`, status: proofPassed ? "passed" : "failed", durationMs: 1 },
      { id: "complete", stage: "complete", label: proofPassed ? "Proof accepted" : "Proof rejected", detail: proofPassed ? "The exploit is blocked and the allowed path remains available." : "At least one regression check failed; no proof is accepted.", status: proofPassed ? "passed" : "failed", durationMs: elapsedMs },
    ],
    baseline: {
      findingDetected: baselineExecution.baselineObserved !== baselineExecution.baselineExpected,
      request: baselineExecution.baselineRequest,
      observed: baselineExecution.baselineObserved,
      expected: baselineExecution.baselineExpected,
    },
    patch: {
      rule: scenario.patch,
      scope: "One synthetic route policy; no arbitrary code execution.",
      changedFiles: [`synthetic/${id.toLowerCase()}/policy.ts`],
    },
    checks,
    metrics: {
      checks: checks.length,
      passed,
      baselineFinding: baselineExecution.baselineObserved !== baselineExecution.baselineExpected,
      proofPassed,
    },
    dataNotice: "Executable synthetic scenario only. No external target, network destination, or personal data is queried.",
  };
}

export function isKavachScenarioId(value: unknown): value is KavachScenarioId {
  return typeof value === "string" && (KAVACH_SCENARIO_IDS as readonly string[]).includes(value);
}
