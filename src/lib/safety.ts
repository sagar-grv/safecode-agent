const ALLOWED_MODULES = new Set([
  "collections",
  "csv",
  "datetime",
  "decimal",
  "functools",
  "html",
  "itertools",
  "json",
  "math",
  "random",
  "statistics",
]);

const DENIED_TOKENS: Array<[RegExp, string]> = [
  [/\b(?:eval|exec|compile|__import__)\s*\(/, "dynamic code execution"],
  [/\b(?:globals|locals|vars|getattr|setattr|delattr)\s*\(/, "runtime introspection"],
  [/\bwhile\s+True\s*:/, "unbounded loop"],
  [/\binput\s*\(/, "interactive input"],
  [/\b(?:breakpoint|help)\s*\(/, "interactive runtime access"],
  [/__[a-zA-Z0-9_]+__/, "dunder access"],
  [/\.\s*_[a-zA-Z0-9_]+/, "private module state"],
];

const SAFE_READ_PATH = /^input\.csv$/;
const SAFE_WRITE_PATH = /^artifacts\/[a-zA-Z0-9._-]+\.(?:csv|json|svg|txt)$/;

function importedModules(code: string): string[] {
  const modules: string[] = [];

  for (const originalLine of code.split("\n")) {
    const line = originalLine.split("#", 1)[0];
    for (const statement of line.split(";")) {
      const fromMatch = statement.match(
        /(?:^|:\s*)\s*from\s+([a-zA-Z0-9_.]+)\s+import\s+/,
      );
      if (fromMatch) {
        modules.push(fromMatch[1].split(".")[0]);
        continue;
      }

      const importMatch = statement.match(
        /(?:^|:\s*)\s*import\s+([a-zA-Z0-9_.,\s]+)$/,
      );
      if (!importMatch) continue;

      for (const item of importMatch[1].split(",")) {
        const name = item.trim().split(/\s+as\s+/)[0].split(".")[0];
        if (name) modules.push(name);
      }
    }
  }

  return modules;
}

export function inspectPython(code: string): string[] {
  const findings = new Set<string>();

  if (!code.trim()) findings.add("generated code is empty");
  if (code.length > 12_000) findings.add("generated code exceeds 12 KB");
  if (code.includes("\0")) findings.add("generated code contains a null byte");

  for (const moduleName of importedModules(code)) {
    if (!ALLOWED_MODULES.has(moduleName)) {
      findings.add(`module "${moduleName}" is not allowlisted`);
    }
  }

  for (const [pattern, label] of DENIED_TOKENS) {
    if (pattern.test(code)) findings.add(`${label} is not allowed`);
  }

  const openPattern =
    /\bopen\s*\(\s*(["'])([^"']+)\1(?:\s*,\s*(["'])([^"']+)\3)?/g;
  const openCalls = [...code.matchAll(/\bopen\s*\(/g)].length;
  const openReferences = [...code.matchAll(/\bopen\b/g)].length;
  const parsedOpenCalls = [...code.matchAll(openPattern)];

  if (
    openCalls !== parsedOpenCalls.length ||
    openReferences !== parsedOpenCalls.length
  ) {
    findings.add("every file path must be a static string literal");
  }

  for (const match of parsedOpenCalls) {
    const path = match[2];
    const mode = match[4] ?? "r";
    const writes = /[wax+]/.test(mode);
    const safe = writes ? SAFE_WRITE_PATH.test(path) : SAFE_READ_PATH.test(path);
    if (!safe) findings.add(`file access to "${path}" is outside the workspace contract`);
  }

  return [...findings];
}
