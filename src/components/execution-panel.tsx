"use client";

import {
  Check,
  ChevronDown,
  ChevronUp,
  Clipboard,
  Download,
  FileCode2,
  LoaderCircle,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { useMemo, useState } from "react";

import type {
  ExecutionArtifact,
  ExecutionAttempt,
  SafeCodeResult,
} from "@/lib/contracts";
import styles from "@/components/workspace.module.css";

type ResultTab = "output" | "artifacts" | "trace";

function attemptLabel(
  attempt: ExecutionAttempt | undefined,
  slot: number,
  hasResult: boolean,
  loading: boolean,
) {
  if (attempt) return attempt.status.replace("-", " ");
  if (loading && slot === 1) return "running";
  return hasResult ? "not needed" : "waiting";
}

function formatBytes(bytes: number) {
  if (bytes < 1_000) return `${bytes} B`;
  if (bytes < 1_000_000) return `${(bytes / 1_000).toFixed(1)} KB`;
  return `${(bytes / 1_000_000).toFixed(1)} MB`;
}

function saveArtifact(artifact: ExecutionArtifact) {
  const binary = window.atob(artifact.base64);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  const url = URL.createObjectURL(
    new Blob([bytes], { type: artifact.mimeType }),
  );
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = artifact.name;
  anchor.click();
  URL.revokeObjectURL(url);
}

function CodeViewer({ code }: { code: string }) {
  const lines = useMemo(
    () => (code || "# No script generated yet.").split("\n"),
    [code],
  );

  return (
    <pre className={styles.code}>
      <code>
        {lines.map((line, index) => (
          <span className={styles.codeLine} key={`${index}-${line}`}>
            <span className={styles.lineNumber}>{index + 1}</span>
            <span>{line || " "}</span>
          </span>
        ))}
      </code>
    </pre>
  );
}

export function ExecutionPanel({
  result,
  loading,
  onClear,
}: {
  result: SafeCodeResult | null;
  loading: boolean;
  onClear: () => void;
}) {
  const [tab, setTab] = useState<ResultTab>("output");
  const [selectedAttempt, setSelectedAttempt] = useState(0);

  const attempt =
    result?.attempts[selectedAttempt] ?? result?.attempts.at(-1) ?? undefined;
  const selectedIndex = attempt
    ? result?.attempts.findIndex((item) => item.attempt === attempt.attempt) ?? 0
    : 0;

  function selectAttempt(index: number) {
    if (!result?.attempts[index]) return;
    setSelectedAttempt(index);
  }

  return (
    <section className={styles.execution} aria-labelledby="execution-heading">
      <div className={styles.panelHeading}>
        <h2 id="execution-heading">Execution</h2>
        {loading ? (
          <span className={styles.runningLabel}>
            <LoaderCircle aria-hidden="true" size={15} />
            Isolating
          </span>
        ) : null}
      </div>

      <div className={styles.executionTop}>
        <div className={styles.attemptRail} aria-label="Execution attempts">
          {[1, 2, 3].map((slot, index) => {
            const item = result?.attempts[index];
            const label = attemptLabel(item, slot, Boolean(result), loading);
            const isSelected = Boolean(item) && selectedIndex === index;
            const statusClass =
              styles[
                `attempt_${item?.status ?? label.replaceAll("-", "_").replaceAll(" ", "_")}`
              ] ?? "";
            return (
              <button
                className={`${styles.attemptRow} ${statusClass} ${isSelected ? styles.attemptSelected : ""}`}
                type="button"
                disabled={!item}
                onClick={() => selectAttempt(index)}
                key={slot}
              >
                <span className={styles.attemptNumber}>{slot}</span>
                <span className={styles.attemptText}>
                  <strong>
                    Attempt {slot} · {label}
                  </strong>
                  <small>
                    {item
                      ? item.durationMs > 0
                        ? `${(item.durationMs / 1_000).toFixed(2)}s · ${item.planner}`
                        : item.planner
                      : "—"}
                  </small>
                </span>
                {isSelected ? (
                  <ChevronUp aria-hidden="true" size={17} />
                ) : (
                  <ChevronDown aria-hidden="true" size={17} />
                )}
              </button>
            );
          })}
        </div>

        <div className={styles.codePanel}>
          <div className={styles.codeToolbar}>
            <span>
              <FileCode2 aria-hidden="true" size={15} />
              Python {attempt ? `(attempt ${attempt.attempt})` : ""}
            </span>
            <button
              type="button"
              disabled={!attempt?.code}
              onClick={() => navigator.clipboard.writeText(attempt?.code ?? "")}
            >
              <Clipboard aria-hidden="true" size={15} />
              Copy code
            </button>
          </div>
          <CodeViewer code={attempt?.code ?? ""} />
        </div>
      </div>

      <div className={styles.resultsArea}>
        <div className={styles.resultTabs} role="tablist" aria-label="Result views">
          {(["output", "artifacts", "trace"] as const).map((item) => (
            <button
              className={tab === item ? styles.resultTabActive : styles.resultTab}
              type="button"
              role="tab"
              aria-selected={tab === item}
              onClick={() => setTab(item)}
              key={item}
            >
              {item[0].toUpperCase() + item.slice(1)}
            </button>
          ))}
          <button
            className={styles.clearButton}
            type="button"
            disabled={!result}
            onClick={() => {
              setTab("output");
              setSelectedAttempt(0);
              onClear();
            }}
          >
            <Trash2 aria-hidden="true" size={15} />
            Clear result
          </button>
        </div>

        <div className={styles.resultContent}>
          {tab === "output" ? (
            result ? (
              <div className={styles.outputPanel}>
                <div
                  className={
                    result.ok ? styles.outputStatusPassed : styles.outputStatusFailed
                  }
                >
                  {result.ok ? (
                    <Check aria-hidden="true" size={21} />
                  ) : (
                    <TriangleAlert aria-hidden="true" size={21} />
                  )}
                  <div>
                    <h3>{result.ok ? "Execution passed" : "Execution failed"}</h3>
                    <p>{result.summary}</p>
                  </div>
                </div>

                {result.facts.length ? (
                  <dl className={styles.factList}>
                    {result.facts.map((fact) => (
                      <div key={`${fact.label}-${fact.value}`}>
                        <dt>{fact.label}</dt>
                        <dd>{fact.value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}

                {attempt?.stderr ? (
                  <div className={styles.streamBlock}>
                    <span>STDERR</span>
                    <pre>{attempt.stderr}</pre>
                  </div>
                ) : null}
                {attempt?.stdout ? (
                  <div className={styles.streamBlock}>
                    <span>STDOUT</span>
                    <pre>{attempt.stdout}</pre>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className={styles.emptyResult}>
                <FileCode2 aria-hidden="true" size={24} />
                <h3>{loading ? "Starting an isolated microVM" : "Ready to execute"}</h3>
                <p>
                  {loading
                    ? "The request is being validated before any code runs."
                    : "Load the repair demo or upload a CSV, then run the task."}
                </p>
              </div>
            )
          ) : null}

          {tab === "artifacts" ? (
            <div className={styles.artifactsPanel}>
              <div className={styles.artifactHeader}>
                <span>Name</span>
                <span>Type</span>
                <span>Size</span>
                <span>Download</span>
              </div>
              {result?.artifacts.length ? (
                result.artifacts.map((artifact) => (
                  <div className={styles.artifactRow} key={artifact.name}>
                    <span>{artifact.name}</span>
                    <span>{artifact.mimeType}</span>
                    <span>{formatBytes(artifact.size)}</span>
                    <button
                      type="button"
                      aria-label={`Download ${artifact.name}`}
                      onClick={() => saveArtifact(artifact)}
                    >
                      <Download aria-hidden="true" size={17} />
                    </button>
                  </div>
                ))
              ) : (
                <p className={styles.emptyTable}>No artifacts collected yet.</p>
              )}
            </div>
          ) : null}

          {tab === "trace" ? (
            <ol className={styles.traceList}>
              {result?.trace.length ? (
                result.trace.map((step, index) => (
                  <li data-status={step.status} key={`${step.label}-${index}`}>
                    <span>{index + 1}</span>
                    <div>
                      <strong>{step.label}</strong>
                      <p>{step.detail}</p>
                    </div>
                  </li>
                ))
              ) : (
                <li>
                  <span>1</span>
                  <div>
                    <strong>Awaiting request</strong>
                    <p>The execution trace will appear here.</p>
                  </div>
                </li>
              )}
            </ol>
          ) : null}
        </div>
      </div>
    </section>
  );
}
