"use client";

import { ChevronDown, FileText, FolderOpen, Play } from "lucide-react";
import { useRef } from "react";

import styles from "@/components/workspace.module.css";

interface TaskComposerProps {
  task: string;
  datasetName: string;
  loading: boolean;
  onTaskChange: (task: string) => void;
  onFile: (file: File) => void;
  onLoadDemo: () => void;
  onRun: () => void;
}

export function TaskComposer({
  task,
  datasetName,
  loading,
  onTaskChange,
  onFile,
  onLoadDemo,
  onRun,
}: TaskComposerProps) {
  const fileInput = useRef<HTMLInputElement>(null);

  return (
    <section className={styles.composer} aria-labelledby="task-heading">
      <div>
        <h1 id="task-heading">Run a data task safely</h1>
        <p>
          Generate, isolate, observe, and repair Python without touching the
          host.
        </p>
      </div>

      <label className={styles.srOnly} htmlFor="task">
        Data task
      </label>
      <textarea
        id="task"
        className={styles.taskInput}
        value={task}
        maxLength={600}
        onChange={(event) => onTaskChange(event.target.value)}
        placeholder="Describe what Python should calculate from the CSV."
      />

      <div className={styles.datasetGroup}>
        <span className={styles.fieldLabel}>Dataset</span>
        <button
          className={styles.datasetButton}
          type="button"
          onClick={() => fileInput.current?.click()}
        >
          <span>
            <FileText aria-hidden="true" size={18} />
            {datasetName}
          </span>
          <ChevronDown aria-hidden="true" size={17} />
        </button>
        <input
          ref={fileInput}
          className={styles.srOnly}
          type="file"
          accept=".csv,text/csv"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onFile(file);
          }}
        />
      </div>

      <div className={styles.composerActions}>
        <button
          className={styles.primaryButton}
          type="button"
          disabled={loading || !task.trim()}
          onClick={onRun}
        >
          <Play aria-hidden="true" fill="currentColor" size={16} />
          {loading ? "Starting sandbox…" : "Run securely"}
        </button>
        <button
          className={styles.secondaryButton}
          type="button"
          disabled={loading}
          onClick={onLoadDemo}
        >
          <FolderOpen aria-hidden="true" size={18} />
          Load demo
        </button>
      </div>

      <p className={styles.composerFootnote}>
        CSV only · 500 KB max · execution artifacts are discarded with the
        microVM
      </p>
    </section>
  );
}
