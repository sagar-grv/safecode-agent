import type { PythonPlan } from "@/lib/contracts";

export const DEMO_DATASET = `month,region,revenue
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

function revenueCode(regionColumn: "region" | "region_name") {
  return `import csv
import html
import json

with open("input.csv", "r", encoding="utf-8") as source:
    rows = list(csv.DictReader(source))

totals = {}
months = set()
for row in rows:
    region = row["${regionColumn}"]
    months.add(row["month"])
    totals[region] = totals.get(region, 0.0) + float(row["revenue"])

ordered = sorted(totals.items(), key=lambda item: item[1], reverse=True)
max_value = max((value for _, value in ordered), default=1)
bar_width = 520
row_height = 58
svg_height = 86 + len(ordered) * row_height
bars = []
for index, (region, value) in enumerate(ordered):
    y = 58 + index * row_height
    width = round((value / max_value) * bar_width, 2)
    safe_region = html.escape(region)
    bars.append(
        f'<text x="24" y="{y + 18}" fill="#d8dde3" font-size="14">{safe_region}</text>'
        f'<rect x="126" y="{y}" width="{width}" height="24" rx="4" fill="#c7e84b"/>'
        f'<text x="{min(132 + width, 630)}" y="{y + 17}" fill="#f5f4ed" font-size="12">{value:,.0f}</text>'
    )

svg = (
    f'<svg xmlns="http://www.w3.org/2000/svg" width="700" height="{svg_height}" '
    f'viewBox="0 0 700 {svg_height}">'
    '<rect width="700" height="100%" fill="#101820"/>'
    '<text x="24" y="30" fill="#f5f4ed" font-size="20" font-weight="600">Revenue by region</text>'
    + "".join(bars)
    + '</svg>'
)

with open("artifacts/revenue_by_region.svg", "w", encoding="utf-8") as target:
    target.write(svg)

result = {
    "summary": "Grouped monthly revenue by region and generated a bar chart.",
    "facts": [
        {"label": "Rows read", "value": str(len(rows))},
        {"label": "Regions", "value": str(len(totals))},
        {"label": "Months", "value": str(len(months))},
        {"label": "Chart", "value": "revenue_by_region.svg"},
    ],
}
print("SAFECODE_RESULT=" + json.dumps(result))
`;
}

const summaryCode = `import csv
import json
import statistics

with open("input.csv", "r", encoding="utf-8") as source:
    reader = csv.DictReader(source)
    rows = list(reader)
    columns = reader.fieldnames or []

numeric = {}
for column in columns:
    values = []
    for row in rows:
        try:
            values.append(float(row[column]))
        except (TypeError, ValueError):
            pass
    if values:
        numeric[column] = {
            "count": len(values),
            "mean": round(statistics.fmean(values), 2),
            "min": min(values),
            "max": max(values),
        }

report = {"rows": len(rows), "columns": columns, "numeric": numeric}
with open("artifacts/dataset_summary.json", "w", encoding="utf-8") as target:
    json.dump(report, target, indent=2)

result = {
    "summary": "Profiled the CSV and saved a machine-readable summary.",
    "facts": [
        {"label": "Rows read", "value": str(len(rows))},
        {"label": "Columns", "value": str(len(columns))},
        {"label": "Numeric columns", "value": str(len(numeric))},
        {"label": "Artifact", "value": "dataset_summary.json"},
    ],
}
print("SAFECODE_RESULT=" + json.dumps(result))
`;

export function deterministicPlan({
  task,
  demoRepair,
  attempt,
}: {
  task: string;
  demoRepair: boolean;
  attempt: number;
}): PythonPlan {
  const wantsRevenue =
    /\brevenue\b/i.test(task) && /\b(?:region|chart|bar)\b/i.test(task);

  if (wantsRevenue) {
    const broken = demoRepair && attempt === 1;
    return {
      code: revenueCode(broken ? "region_name" : "region"),
      summary: broken
        ? "Demo plan with a controlled schema mismatch."
        : "Aggregate revenue by region and render an SVG chart.",
      repairNote:
        attempt > 1
          ? "Corrected the dataset field from region_name to region after observing the KeyError."
          : undefined,
      planner: "deterministic",
    };
  }

  return {
    code: summaryCode,
    summary: "Profile the uploaded CSV with Python standard-library statistics.",
    repairNote:
      attempt > 1
        ? "Fell back to the schema-agnostic profiler after the previous attempt failed."
        : undefined,
    planner: "deterministic",
  };
}
