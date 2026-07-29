"use client";

import { CircleDot, FlaskConical, LoaderCircle } from "lucide-react";
import { useState } from "react";

import report from "../../reports/live-evaluation.json";
import { AppHeader } from "@/components/app-header";
import { ExecutionPanel } from "@/components/execution-panel";
import { PolicyPanel } from "@/components/policy-panel";
import { TaskComposer } from "@/components/task-composer";
import styles from "@/components/workspace.module.css";
import type { SafeCodeResult } from "@/lib/contracts";
import { DEMO_DATASET } from "@/lib/templates";

type MobileView = "task" | "execution" | "policy";

const DEMO_TASK =
  "Analyze monthly revenue by region and save a bar chart.";

export function SafeCodeWorkspace() {
  const [task, setTask] = useState(DEMO_TASK);
  const [datasetName, setDatasetName] = useState("revenue.csv");
  const [datasetCsv, setDatasetCsv] = useState(DEMO_DATASET);
  const [demoRepair, setDemoRepair] = useState(true);
  const [result, setResult] = useState<SafeCodeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mobileView, setMobileView] = useState<MobileView>("execution");

  function loadDemo() {
    setTask(DEMO_TASK);
    setDatasetName("revenue.csv");
    setDatasetCsv(DEMO_DATASET);
    setDemoRepair(true);
    setResult(null);
    setError("");
  }

  async function readFile(file: File) {
    if (file.size > 500_000) {
      setError("Choose a CSV smaller than 500 KB.");
      return;
    }
    const contents = await file.text();
    setDatasetName(file.name);
    setDatasetCsv(contents);
    setDemoRepair(false);
    setResult(null);
    setError("");
  }

  async function runTask() {
    setLoading(true);
    setError("");
    setResult(null);
    setMobileView("execution");

    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task,
          datasetName,
          datasetCsv,
          demoRepair,
        }),
      });
      const data = (await response.json()) as
        | SafeCodeResult
        | { error?: string; detail?: string; issues?: string[] };

      if ("attempts" in data) {
        setResult(data);
        if (!data.ok) setError("All guarded attempts failed. Inspect the trace.");
      } else {
        setError(
          [data.error, data.detail, data.issues?.join(" ")].filter(Boolean).join(" "),
        );
      }
    } catch {
      setError("The request could not reach the isolated execution service.");
    } finally {
      setLoading(false);
    }
  }

  async function copyTrace() {
    const trace = result
      ? JSON.stringify(
          {
            summary: result.summary,
            runtime: result.runtime,
            attempts: result.attempts.map((attempt) => ({
              attempt: attempt.attempt,
              status: attempt.status,
              planner: attempt.planner,
              stdout: attempt.stdout,
              stderr: attempt.stderr,
              durationMs: attempt.durationMs,
              safetyFindings: attempt.safetyFindings,
              repairNote: attempt.repairNote,
            })),
            trace: result.trace,
          },
          null,
          2,
        )
      : "No execution trace has been recorded.";
    await navigator.clipboard.writeText(trace);
  }

  return (
    <div className={styles.app}>
      <AppHeader />

      {error ? (
        <div className={styles.errorBanner} role="alert">
          {error}
        </div>
      ) : null}

      <main className={styles.workspace}>
        <div
          className={styles.mobileRegion}
          data-mobile-active={mobileView === "task"}
        >
          <TaskComposer
            task={task}
            datasetName={datasetName}
            loading={loading}
            onTaskChange={(value) => {
              setTask(value);
              setDemoRepair(false);
            }}
            onFile={readFile}
            onLoadDemo={loadDemo}
            onRun={runTask}
          />
        </div>

        <div className={styles.mobileTabs} role="tablist" aria-label="Workspace views">
          {(["task", "execution", "policy"] as const).map((view) => (
            <button
              className={mobileView === view ? styles.mobileTabActive : ""}
              type="button"
              role="tab"
              aria-selected={mobileView === view}
              onClick={() => setMobileView(view)}
              key={view}
            >
              {view[0].toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>

        <div
          className={styles.mobileRegion}
          data-mobile-active={mobileView === "execution"}
        >
          <ExecutionPanel
            result={result}
            loading={loading}
            onClear={() => {
              setResult(null);
              setError("");
            }}
          />
        </div>

        <div
          className={styles.mobileRegion}
          data-mobile-active={mobileView === "policy"}
        >
          <PolicyPanel onCopyTrace={copyTrace} />
        </div>
      </main>

      <footer className={styles.statusBar}>
        <span>
          <CircleDot aria-hidden="true" fill="currentColor" size={13} />
          Sandbox <strong>{loading ? "Starting" : "Ready"}</strong>
        </span>
        <span>
          {loading ? (
            <LoaderCircle aria-hidden="true" className={styles.spin} size={14} />
          ) : (
            <CircleDot aria-hidden="true" size={13} />
          )}
          Execution <strong>{loading ? "Running" : result ? "Complete" : "Idle"}</strong>
        </span>
        <span>
          <FlaskConical aria-hidden="true" size={14} />
          Evaluation suite{" "}
          <strong>
            {Math.round(report.metrics.passAt3 * report.cases)}/{report.cases}{" "}
            passed
          </strong>
        </span>
      </footer>
    </div>
  );
}
