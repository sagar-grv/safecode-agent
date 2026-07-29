import { describe, expect, it } from "vitest";

import { supportedTaskCases, unsafeCodeCases } from "@/evals/cases";
import { inspectPython } from "@/lib/safety";
import { deterministicPlan } from "@/lib/templates";

describe("48-case policy evaluation", () => {
  it("contains exactly 48 labeled cases", () => {
    expect(supportedTaskCases.length + unsafeCodeCases.length).toBe(48);
  });

  it.each(supportedTaskCases)("produces an admissible plan: %s", (task) => {
    const plan = deterministicPlan({
      task,
      demoRepair: false,
      attempt: 1,
    });
    expect(inspectPython(plan.code)).toEqual([]);
  });

  it.each(unsafeCodeCases)("blocks unsafe code: %s", (code) => {
    expect(inspectPython(code).length).toBeGreaterThan(0);
  });
});
