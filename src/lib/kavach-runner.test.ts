import { describe, expect, it } from "vitest";

import {
  isKavachScenarioId,
  KAVACH_SCENARIO_IDS,
  runSyntheticVerification,
} from "@/lib/kavach-runner";

describe("Kavach synthetic verification runner", () => {
  it("only accepts the three seeded scenario IDs", () => {
    expect(KAVACH_SCENARIO_IDS).toEqual(["BFLA-001", "BOLA-001", "MISCONFIG-001"]);
    expect(isKavachScenarioId("BFLA-001")).toBe(true);
    expect(isKavachScenarioId("https://example.com")).toBe(false);
    expect(isKavachScenarioId({})).toBe(false);
  });

  it.each([...KAVACH_SCENARIO_IDS])("proves %s with baseline and regression checks", (scenarioId) => {
    const result = runSyntheticVerification(scenarioId);

    expect(result.mode).toBe("synthetic-executable");
    expect(result.status).toBe("passed");
    expect(result.scenario.id).toBe(scenarioId);
    expect(result.baseline.findingDetected).toBe(true);
    expect(result.metrics.proofPassed).toBe(true);
    expect(result.metrics.passed).toBe(result.metrics.checks);
    expect(result.checks.every((item) => item.passed)).toBe(true);
    expect(result.trace.map((item) => item.stage)).toEqual([
      "discover",
      "baseline",
      "patch",
      "prove",
      "complete",
    ]);
  });
});
