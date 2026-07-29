import { describe, expect, it } from "vitest";

import { inspectPython } from "@/lib/safety";
import { deterministicPlan } from "@/lib/templates";

describe("deterministicPlan", () => {
  it("creates a controlled failure and then a safe repair for the demo", () => {
    const first = deterministicPlan({
      task: "Analyze revenue by region and create a chart.",
      demoRepair: true,
      attempt: 1,
    });
    const second = deterministicPlan({
      task: "Analyze revenue by region and create a chart.",
      demoRepair: true,
      attempt: 2,
    });

    expect(first.code).toContain('row["region_name"]');
    expect(second.code).toContain('row["region"]');
    expect(second.repairNote).toContain("region_name");
    expect(inspectPython(first.code)).toEqual([]);
    expect(inspectPython(second.code)).toEqual([]);
  });

  it("falls back to a schema-agnostic profiler", () => {
    const plan = deterministicPlan({
      task: "Summarize this dataset.",
      demoRepair: false,
      attempt: 1,
    });

    expect(plan.code).toContain("statistics.fmean");
    expect(inspectPython(plan.code)).toEqual([]);
  });
});
