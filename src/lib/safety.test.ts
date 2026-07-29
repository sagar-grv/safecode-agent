import { describe, expect, it } from "vitest";

import { inspectPython } from "@/lib/safety";

describe("inspectPython", () => {
  it("accepts allowlisted imports and contracted paths", () => {
    const code = `import csv
import json
with open("input.csv", "r", encoding="utf-8") as source:
    rows = list(csv.DictReader(source))
with open("artifacts/result.json", "w", encoding="utf-8") as target:
    json.dump({"rows": len(rows)}, target)
print("SAFECODE_RESULT=" + json.dumps({"summary": "done", "facts": []}))`;

    expect(inspectPython(code)).toEqual([]);
  });

  it("blocks host, process, and network modules", () => {
    expect(inspectPython('import os\nos.system("id")')).not.toEqual([]);
    expect(
      inspectPython('import requests\nrequests.get("https://example.com")'),
    ).not.toEqual([]);
    expect(inspectPython('import csv; import os\nos.system("id")')).toContain(
      'module "os" is not allowlisted',
    );
    expect(inspectPython('if True: import subprocess')).toContain(
      'module "subprocess" is not allowlisted',
    );
    expect(inspectPython("import os  # hidden behind a comment")).toContain(
      'module "os" is not allowlisted',
    );
  });

  it("blocks dynamic and out-of-contract file paths", () => {
    expect(inspectPython('path = "input.csv"\nopen(path)')).toContain(
      "every file path must be a static string literal",
    );
    expect(inspectPython('open("../secret.txt", "w")')).toContain(
      'file access to "../secret.txt" is outside the workspace contract',
    );
    expect(inspectPython("unsafe_open = open")).toContain(
      "every file path must be a static string literal",
    );
  });

  it("blocks private state exposed by otherwise allowlisted modules", () => {
    expect(inspectPython("import random\nrandom._os.system('id')")).toContain(
      "private module state is not allowed",
    );
  });
});
