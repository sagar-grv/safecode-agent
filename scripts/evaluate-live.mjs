import { mkdir, writeFile } from "node:fs/promises";

const baseUrl = (process.env.SAFECODE_BASE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);

const dataset = `month,region,revenue
2026-01,North,18200
2026-01,South,14900
2026-01,East,16500
2026-01,West,17100
2026-02,North,19400
2026-02,South,15300
2026-02,East,16900
2026-02,West,18000
2026-03,North,20800
2026-03,South,16100
2026-03,East,17700
2026-03,West,18600`;

const cases = [
  { task: "Summarize this CSV dataset.", demoRepair: false },
  { task: "Count rows and list the columns.", demoRepair: false },
  { task: "Profile the numeric values in this dataset.", demoRepair: false },
  { task: "Save a JSON summary of this CSV.", demoRepair: false },
  { task: "Analyze monthly revenue by region.", demoRepair: false },
  { task: "Create a revenue bar chart by region.", demoRepair: false },
  { task: "Group monthly revenue by region and save a chart.", demoRepair: false },
  { task: "Analyze monthly revenue by region and save a bar chart.", demoRepair: true },
  { task: "Create a regional revenue chart and demonstrate repair.", demoRepair: true },
  { task: "Profile a monthly operations export.", demoRepair: false },
  { task: "Calculate basic statistics for every numeric column.", demoRepair: false },
  { task: "Generate a machine-readable dataset overview.", demoRepair: false },
];

const results = [];

for (const testCase of cases) {
  process.stdout.write(
    `[${results.length + 1}/${cases.length}] ${testCase.task}\n`,
  );
  const startedAt = performance.now();
  const response = await fetch(`${baseUrl}/api/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...testCase,
      datasetName: "revenue.csv",
      datasetCsv: dataset,
    }),
  });
  const body = await response.json();
  const elapsedMs = Math.round(performance.now() - startedAt);
  const passedAttempt = body.attempts?.find((attempt) => attempt.status === "passed");

  results.push({
    task: testCase.task,
    demoRepair: testCase.demoRepair,
    ok: Boolean(body.ok),
    status: response.status,
    passedAt: passedAttempt?.attempt ?? null,
    elapsedMs,
    artifactCount: body.artifacts?.length ?? 0,
  });
}

const sortedLatency = results.map((item) => item.elapsedMs).sort((a, b) => a - b);
const p95Index = Math.max(0, Math.ceil(sortedLatency.length * 0.95) - 1);
const passed = results.filter((item) => item.ok);
const report = {
  generatedAt: new Date().toISOString(),
  target: baseUrl,
  cases: results.length,
  metrics: {
    passAt1: passed.filter((item) => item.passedAt === 1).length / results.length,
    passAt3: passed.length / results.length,
    artifactSuccess:
      results.filter((item) => item.artifactCount > 0).length / results.length,
    p95EndToEndMs: sortedLatency[p95Index],
  },
  results,
};

await mkdir("reports", { recursive: true });
await writeFile(
  "reports/live-evaluation.json",
  `${JSON.stringify(report, null, 2)}\n`,
  "utf8",
);
process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
