import { z } from "zod";

export const executeRequestSchema = z.object({
  task: z
    .string()
    .trim()
    .min(8, "Describe the data task in at least 8 characters.")
    .max(600, "Keep the task under 600 characters."),
  datasetName: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .regex(/^[a-zA-Z0-9._-]+$/, "Use a simple CSV filename."),
  datasetCsv: z
    .string()
    .min(1, "The dataset is empty.")
    .max(500_000, "Datasets are limited to 500 KB in this demo."),
  demoRepair: z.boolean().optional().default(false),
});

export type ExecuteRequest = z.infer<typeof executeRequestSchema>;

export type AttemptStatus = "blocked" | "failed" | "passed" | "not-needed";

export interface ExecutionAttempt {
  attempt: number;
  status: AttemptStatus;
  planner: "ai-gateway" | "deterministic";
  code: string;
  stdout: string;
  stderr: string;
  durationMs: number;
  safetyFindings: string[];
  repairNote?: string;
}

export interface ExecutionArtifact {
  name: string;
  mimeType: string;
  size: number;
  base64: string;
}

export interface SafeCodeResult {
  ok: boolean;
  summary: string;
  facts: Array<{ label: string; value: string }>;
  attempts: ExecutionAttempt[];
  artifacts: ExecutionArtifact[];
  runtime: {
    provider: "vercel-sandbox";
    runtime: "python3.13";
    network: "deny-all";
    processMemoryMb: 512;
    timeoutSeconds: 30;
    maxAttempts: 3;
  };
  trace: Array<{
    label: string;
    detail: string;
    status: "complete" | "blocked" | "failed";
  }>;
}

export interface PythonPlan {
  code: string;
  summary: string;
  repairNote?: string;
  planner: "ai-gateway" | "deterministic";
}
