import { Sandbox } from "@vercel/sandbox";
import { z } from "zod";

import type { ExecutionArtifact } from "@/lib/contracts";

const pythonResultSchema = z.object({
  summary: z.string().min(1).max(500),
  facts: z
    .array(
      z.object({
        label: z.string().min(1).max(80),
        value: z.string().min(1).max(160),
      }),
    )
    .max(12),
});

const MIME_TYPES: Record<string, string> = {
  csv: "text/csv",
  json: "application/json",
  svg: "image/svg+xml",
  txt: "text/plain",
};

const MAX_CAPTURE_CHARS = 20_000;
const MAX_ARTIFACT_BYTES = 2_000_000;

function truncate(value: string) {
  if (value.length <= MAX_CAPTURE_CHARS) return value;
  return `${value.slice(0, MAX_CAPTURE_CHARS)}\n… output truncated`;
}

function parseStructuredResult(stdout: string) {
  const line = stdout
    .split("\n")
    .reverse()
    .find((candidate) => candidate.startsWith("SAFECODE_RESULT="));

  if (!line) return null;

  try {
    return pythonResultSchema.parse(
      JSON.parse(line.slice("SAFECODE_RESULT=".length)),
    );
  } catch {
    return null;
  }
}

async function collectArtifacts(sandbox: Sandbox): Promise<ExecutionArtifact[]> {
  const listing = await sandbox.runCommand("find", [
    "artifacts",
    "-maxdepth",
    "1",
    "-type",
    "f",
    "-printf",
    "%f\t%s\n",
  ]);

  if (listing.exitCode !== 0) return [];

  const rows = (await listing.stdout()).trim().split("\n").filter(Boolean);
  const artifacts: ExecutionArtifact[] = [];

  for (const row of rows.slice(0, 8)) {
    const [name, rawSize] = row.split("\t");
    const extension = name?.split(".").pop()?.toLowerCase() ?? "";
    const size = Number(rawSize);
    const mimeType = MIME_TYPES[extension];

    if (
      !name ||
      !/^[a-zA-Z0-9._-]+$/.test(name) ||
      !mimeType ||
      !Number.isFinite(size) ||
      size < 0 ||
      size > MAX_ARTIFACT_BYTES
    ) {
      continue;
    }

    const content = await sandbox.readFileToBuffer({
      path: `artifacts/${name}`,
    });
    if (!content || content.byteLength !== size) continue;

    artifacts.push({
      name,
      mimeType,
      size,
      base64: content.toString("base64"),
    });
  }

  return artifacts;
}

export async function executePythonInSandbox({
  code,
  datasetCsv,
}: {
  code: string;
  datasetCsv: string;
}) {
  const sandbox = await Sandbox.create({
    runtime: "python3.13",
    networkPolicy: "deny-all",
    resources: { vcpus: 1 },
    timeout: 60_000,
    tags: { product: "safecode-agent" },
  });

  try {
    await sandbox.mkDir("artifacts");
    await sandbox.writeFiles([
      { path: "input.csv", content: datasetCsv },
      { path: "script.py", content: code },
    ]);

    const command = await sandbox.runCommand(
      "bash",
      [
        "-lc",
        "ulimit -t 30; ulimit -v 524288; ulimit -u 32; ulimit -f 20480; exec python3 script.py",
      ],
      { timeoutMs: 30_000 },
    );

    const [stdout, stderr] = await Promise.all([
      command.stdout(),
      command.stderr(),
    ]);
    const structured = parseStructuredResult(stdout);
    const artifacts =
      command.exitCode === 0 ? await collectArtifacts(sandbox) : [];

    return {
      exitCode: command.exitCode,
      durationMs: command.durationMs ?? 0,
      stdout: truncate(stdout),
      stderr: truncate(stderr),
      structured,
      artifacts,
    };
  } finally {
    await sandbox.stop().catch(() => undefined);
  }
}
