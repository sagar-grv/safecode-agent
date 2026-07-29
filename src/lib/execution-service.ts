import type {
  ExecuteRequest,
  ExecutionArtifact,
  ExecutionAttempt,
  PythonPlan,
  SafeCodeResult,
} from "@/lib/contracts";
import { planWithGateway } from "@/lib/ai-planner";
import { executePythonInSandbox } from "@/lib/sandbox-executor";
import { inspectPython } from "@/lib/safety";
import { deterministicPlan } from "@/lib/templates";

const MAX_ATTEMPTS = 3;

function parseHeader(csv: string): string[] {
  const firstLine = csv.split(/\r?\n/, 1)[0] ?? "";
  const columns: string[] = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < firstLine.length; index += 1) {
    const char = firstLine[index];
    if (char === '"') {
      if (quoted && firstLine[index + 1] === '"') {
        value += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      columns.push(value.trim());
      value = "";
    } else {
      value += char;
    }
  }
  columns.push(value.trim());

  return columns.filter(Boolean).slice(0, 80);
}

function gatewayAvailable(demoRepair: boolean) {
  if (demoRepair || process.env.SAFECODE_AI_MODE === "off") return false;
  return (
    process.env.SAFECODE_AI_MODE === "on" ||
    Boolean(process.env.VERCEL) ||
    Boolean(process.env.AI_GATEWAY_API_KEY)
  );
}

async function createPlan({
  request,
  columns,
  attempt,
  previous,
}: {
  request: ExecuteRequest;
  columns: string[];
  attempt: number;
  previous?: ExecutionAttempt;
}): Promise<{ plan: PythonPlan; gatewayFallback?: string }> {
  if (gatewayAvailable(request.demoRepair)) {
    try {
      return {
        plan: await planWithGateway({
          task: request.task,
          columns,
          previousCode: previous?.code,
          previousError: previous?.stderr,
        }),
      };
    } catch (error) {
      return {
        plan: deterministicPlan({
          task: request.task,
          demoRepair: request.demoRepair,
          attempt,
        }),
        gatewayFallback:
          error instanceof Error ? error.message : "AI Gateway was unavailable.",
      };
    }
  }

  return {
    plan: deterministicPlan({
      task: request.task,
      demoRepair: request.demoRepair,
      attempt,
    }),
  };
}

export async function executeTask(request: ExecuteRequest): Promise<SafeCodeResult> {
  const attempts: ExecutionAttempt[] = [];
  const columns = parseHeader(request.datasetCsv);
  const trace: SafeCodeResult["trace"] = [
    {
      label: "Validate request",
      detail: `${request.datasetName} accepted (${request.datasetCsv.length.toLocaleString()} characters).`,
      status: "complete",
    },
    {
      label: "Inspect schema",
      detail: `Detected ${columns.length} column${columns.length === 1 ? "" : "s"}: ${columns.join(", ") || "none"}.`,
      status: "complete",
    },
  ];

  let finalArtifacts: ExecutionArtifact[] = [];
  let finalSummary = "All execution attempts failed.";
  let finalFacts: SafeCodeResult["facts"] = [];

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const { plan, gatewayFallback } = await createPlan({
      request,
      columns,
      attempt,
      previous: attempts.at(-1),
    });

    if (gatewayFallback) {
      trace.push({
        label: `Plan attempt ${attempt}`,
        detail: "AI Gateway did not complete, so the constrained deterministic planner took over.",
        status: "complete",
      });
    } else {
      trace.push({
        label: `Plan attempt ${attempt}`,
        detail: `${plan.planner === "ai-gateway" ? "AI Gateway" : "Deterministic planner"} produced a standard-library Python script.`,
        status: "complete",
      });
    }

    const safetyFindings = inspectPython(plan.code);
    if (safetyFindings.length > 0) {
      attempts.push({
        attempt,
        status: "blocked",
        planner: plan.planner,
        code: plan.code,
        stdout: "",
        stderr: safetyFindings.join("\n"),
        durationMs: 0,
        safetyFindings,
        repairNote: plan.repairNote,
      });
      trace.push({
        label: `Safety gate ${attempt}`,
        detail: safetyFindings.join("; "),
        status: "blocked",
      });
      continue;
    }

    trace.push({
      label: `Safety gate ${attempt}`,
      detail: "Imports, file paths, dynamic execution, process access, and network APIs passed the static policy.",
      status: "complete",
    });

    const execution = await executePythonInSandbox({
      code: plan.code,
      datasetCsv: request.datasetCsv,
    });
    const passed = execution.exitCode === 0 && Boolean(execution.structured);

    attempts.push({
      attempt,
      status: passed ? "passed" : "failed",
      planner: plan.planner,
      code: plan.code,
      stdout: execution.stdout,
      stderr:
        execution.exitCode === 0 && !execution.structured
          ? "Script exited successfully but did not return a valid SAFECODE_RESULT payload."
          : execution.stderr,
      durationMs: execution.durationMs,
      safetyFindings: [],
      repairNote: plan.repairNote,
    });

    trace.push({
      label: `Sandbox attempt ${attempt}`,
      detail: passed
        ? `Python completed inside a deny-all-network microVM in ${execution.durationMs} ms.`
        : `Python exited with code ${execution.exitCode}; stderr was returned to the repair loop.`,
      status: passed ? "complete" : "failed",
    });

    if (passed && execution.structured) {
      finalSummary = execution.structured.summary;
      finalFacts = execution.structured.facts;
      finalArtifacts = execution.artifacts;
      break;
    }
  }

  const ok = attempts.some((attempt) => attempt.status === "passed");

  trace.push({
    label: "Finalize trace",
    detail: ok
      ? `${attempts.length} attempt${attempts.length === 1 ? "" : "s"} recorded; ${finalArtifacts.length} artifact${finalArtifacts.length === 1 ? "" : "s"} collected.`
      : `${attempts.length} attempts exhausted without a valid result.`,
    status: ok ? "complete" : "failed",
  });

  return {
    ok,
    summary: finalSummary,
    facts: finalFacts,
    attempts,
    artifacts: finalArtifacts,
    runtime: {
      provider: "vercel-sandbox",
      runtime: "python3.13",
      network: "deny-all",
      processMemoryMb: 512,
      timeoutSeconds: 30,
      maxAttempts: MAX_ATTEMPTS,
    },
    trace,
  };
}
