import { beforeEach, describe, expect, it, vi } from "vitest";

import { DEMO_DATASET } from "@/lib/templates";

const executePythonInSandbox = vi.fn();

vi.mock("@/lib/sandbox-executor", () => ({
  executePythonInSandbox,
}));

describe("executeTask", () => {
  beforeEach(() => {
    vi.resetModules();
    executePythonInSandbox.mockReset();
    process.env.SAFECODE_AI_MODE = "off";
  });

  it("observes a failure, repairs it, and stops after a pass", async () => {
    executePythonInSandbox
      .mockResolvedValueOnce({
        exitCode: 1,
        durationMs: 14,
        stdout: "",
        stderr: "KeyError: 'region_name'",
        structured: null,
        artifacts: [],
      })
      .mockResolvedValueOnce({
        exitCode: 0,
        durationMs: 12,
        stdout: 'SAFECODE_RESULT={"summary":"done","facts":[]}',
        stderr: "",
        structured: { summary: "done", facts: [] },
        artifacts: [],
      });

    const { executeTask } = await import("@/lib/execution-service");
    const result = await executeTask({
      task: "Analyze monthly revenue by region and save a bar chart.",
      datasetName: "revenue.csv",
      datasetCsv: DEMO_DATASET,
      demoRepair: true,
    });

    expect(result.ok).toBe(true);
    expect(result.attempts.map((attempt) => attempt.status)).toEqual([
      "failed",
      "passed",
    ]);
    expect(executePythonInSandbox).toHaveBeenCalledTimes(2);
    expect(result.runtime.network).toBe("deny-all");
  });
});
