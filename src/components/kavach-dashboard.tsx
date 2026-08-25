"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, ChevronDown, CircleAlert, CircleCheck, Clock3, Code2, FileCheck2, LockKeyhole, Play, RotateCcw, ShieldCheck, TerminalSquare, X } from "lucide-react";

import {
  isKavachScenarioId,
  kavachScenarios,
  type KavachCheck,
  type KavachRunResult,
  type KavachRunStage,
  type KavachScenarioId,
} from "@/lib/kavach-runner";
import { KavachBackButton } from "@/components/kavach-back-button";
import styles from "@/components/kavach-dashboard.module.css";

type ResultTab = "evidence" | "patch" | "regression";

type ViewStage = {
  id: KavachRunStage;
  label: string;
  detail: string;
  icon: typeof TerminalSquare;
};

const viewStages: ViewStage[] = [
  { id: "discover", label: "Load scenario", detail: "Select one seeded route", icon: TerminalSquare },
  { id: "baseline", label: "Reproduce flaw", detail: "Run the vulnerable path", icon: X },
  { id: "patch", label: "Apply bounded rule", detail: "Change one policy boundary", icon: Code2 },
  { id: "prove", label: "Run regression", detail: "Check blocked and allowed paths", icon: FileCheck2 },
  { id: "complete", label: "Accept proof", detail: "Record the result", icon: ShieldCheck },
];

function updateUrl(scenarioId: KavachScenarioId, tab: ResultTab) {
  const params = new URLSearchParams(window.location.search);
  params.set("case", scenarioId);
  params.set("view", tab);
  window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}${window.location.hash}`);
}

function stageState(stage: ViewStage, activeStage: KavachRunStage | null, result: KavachRunResult | null, running: boolean) {
  if (running && activeStage === stage.id) return "running";
  if (result) {
    const trace = result.trace.find((item) => item.stage === stage.id);
    return trace?.status === "passed" ? "passed" : trace?.status === "failed" ? "failed" : "queued";
  }
  return "queued";
}

function statusLabel(status: ReturnType<typeof stageState>) {
  if (status === "running") return "RUNNING";
  if (status === "passed") return "PASSED";
  if (status === "failed") return "FAILED";
  return "QUEUED";
}

function CheckRow({ check }: { check: KavachCheck }) {
  return (
    <li className={styles.checkRow}>
      <span className={check.passed ? styles.checkIconPass : styles.checkIconFail} aria-hidden="true">{check.passed ? <Check size={15} /> : <X size={15} />}</span>
      <span className={styles.checkCopy}><strong>{check.label}</strong><code>{check.request}</code></span>
      <span className={check.passed ? styles.checkResultPass : styles.checkResultFail}>{check.observed}</span>
    </li>
  );
}

export function KavachDashboard() {
  const [scenarioId, setScenarioId] = useState<KavachScenarioId>(() => {
    if (typeof window === "undefined") return "BFLA-001";
    const value = new URLSearchParams(window.location.search).get("case");
    return isKavachScenarioId(value) ? value : "BFLA-001";
  });
  const [activeTab, setActiveTab] = useState<ResultTab>(() => {
    if (typeof window === "undefined") return "evidence";
    const value = new URLSearchParams(window.location.search).get("view");
    return value === "evidence" || value === "patch" || value === "regression" ? value : "evidence";
  });
  const [result, setResult] = useState<KavachRunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [activeStage, setActiveStage] = useState<KavachRunStage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scenario = useMemo(() => kavachScenarios.find((item) => item.id === scenarioId) ?? kavachScenarios[0], [scenarioId]);

  useEffect(() => {
    const onPopState = () => {
      const nextParams = new URLSearchParams(window.location.search);
      const nextCase = nextParams.get("case");
      const nextView = nextParams.get("view");
      if (isKavachScenarioId(nextCase)) setScenarioId(nextCase);
      if (nextView === "evidence" || nextView === "patch" || nextView === "regression") setActiveTab(nextView);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  function selectScenario(nextId: KavachScenarioId) {
    setScenarioId(nextId);
    setResult(null);
    setError(null);
    setActiveTab("evidence");
    updateUrl(nextId, "evidence");
  }

  function selectTab(nextTab: ResultTab) {
    setActiveTab(nextTab);
    updateUrl(scenarioId, nextTab);
  }

  async function runVerification() {
    if (running) return;
    setRunning(true);
    setResult(null);
    setError(null);
    setActiveTab("evidence");
    updateUrl(scenarioId, "evidence");

    const sequence: KavachRunStage[] = ["discover", "baseline", "patch", "prove", "complete"];
    let cursor = 0;
    setActiveStage(sequence[cursor]);
    const timer = window.setInterval(() => {
      cursor += 1;
      if (cursor < sequence.length) setActiveStage(sequence[cursor]);
    }, 240);

    try {
      const response = await fetch("/api/kavach/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarioId }),
      });
      const payload = (await response.json()) as KavachRunResult | { error?: string };
      if (!("scenario" in payload)) throw new Error(payload.error ?? "The synthetic harness returned no proof record.");
      setResult(payload);
      setActiveStage(payload.status === "passed" ? "complete" : "prove");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "The verification request failed. No proof result was accepted.");
      setActiveStage(null);
    } finally {
      window.clearInterval(timer);
      setRunning(false);
    }
  }

  function handleScenarioKeyDown(event: React.KeyboardEvent<HTMLSelectElement>) {
    if (event.key === "Escape") event.currentTarget.blur();
  }

  const currentStage = activeStage ? viewStages.find((item) => item.id === activeStage) : null;

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.topbarLeft}><KavachBackButton /><Link href="/" className={styles.brand}><span className={styles.brandMark}><ShieldCheck size={17} aria-hidden="true" /></span><span><strong>KAVACH SENTINEL</strong><small>AI KAVACH / TRACK 02</small></span></Link></div>
        <nav className={styles.topNav} aria-label="Control room sections"><a href="#run">Run</a><a href="#proof">Proof</a><a href="#boundary">Boundary</a></nav>
        <div className={styles.topbarRight}><span className={styles.demoPill}>SYNTHETIC ONLY</span><span className={styles.connectedStatus}><span className={styles.liveDot} aria-hidden="true" /> Local harness</span></div>
      </header>

      <section className={styles.hero} aria-labelledby="control-room-title">
        <div className={styles.heroCopy}>
          <span className={styles.kicker}>CONTROL ROOM / EXECUTABLE PROOF</span>
          <h1 id="control-room-title">Verify one security fix <em>end to end.</em></h1>
          <p className={styles.heroSub}>Choose a seeded API flaw. Kavach reproduces it, applies one bounded policy rule, and checks that the authorised path still works.</p>
          <div className={styles.heroCallout}><CircleCheck size={17} aria-hidden="true" /><span><strong>What you will see</strong> A real server response with the request, patch rule, and regression checks.</span></div>
        </div>
        <aside className={styles.boundaryCard} aria-label="Synthetic execution boundary">
          <div className={styles.boundaryCardTop}><LockKeyhole size={17} aria-hidden="true" /><span>SYNTHETIC EXECUTION</span></div>
          <strong>No target URL. No arbitrary code.</strong>
          <p>The endpoint accepts only 3 seeded scenario IDs and runs an in-process harness. Nothing leaves this demo.</p>
          <span className={styles.boundaryStatus}><span className={styles.liveDot} aria-hidden="true" /> {running ? "Verification in progress" : result ? result.status === "passed" ? "Proof accepted" : "Proof rejected" : "Ready to verify"}</span>
        </aside>
      </section>

      <section id="run" className={styles.runSection} aria-labelledby="run-title">
        <div className={styles.sectionHeading}><span className={styles.kicker}>01 / RUN A SCENARIO</span><h2 id="run-title">Start with a known case.</h2><p>Select one seeded vulnerability so the proof has a concrete request, policy change, and expected outcome.</p></div>
        <div className={styles.runGrid}>
          <div className={styles.scenarioCard}>
            <label htmlFor="scenario-select">Scenario</label>
            <div className={styles.selectWrap}><select id="scenario-select" name="scenario" value={scenarioId} onChange={(event) => selectScenario(event.target.value as KavachScenarioId)} onKeyDown={handleScenarioKeyDown}><option value="BFLA-001">BFLA-001 · Administrative delete</option><option value="BOLA-001">BOLA-001 · Cross-owner task disclosure</option><option value="MISCONFIG-001">MISCONFIG-001 · Debug route exposed</option></select><ChevronDown size={16} aria-hidden="true" /></div>
            <div className={styles.scenarioMeta}><span className={`${styles.severity} ${styles[`severity${scenario.severity}`]}`}>{scenario.severity}</span><span>{scenario.category}</span></div>
            <h3>{scenario.title}</h3>
            <p>{scenario.shortDescription}</p>
            <code className={styles.route}>{scenario.route}</code>
            <div className={styles.expectedGrid}><div><span>Baseline</span><strong>Vulnerable</strong></div><div><span>After rule</span><strong>Verified</strong></div></div>
            <button className={styles.primaryButton} type="button" onClick={runVerification} disabled={running}><span className={styles.buttonIcon}>{running ? <RotateCcw className={styles.spin} size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}</span>{running ? "Running verification…" : result ? "Run again" : "Run verification"}</button>
            <p className={styles.actionHint} aria-live="polite">{running ? currentStage ? `${currentStage.label}: ${currentStage.detail}.` : "Preparing the harness…" : error ? "No proof was accepted. Fix the request and retry." : result ? `${result.metrics.passed}/${result.metrics.checks} regression checks passed.` : "The run takes about one second and stays inside this page."}</p>
          </div>
          <div className={styles.stageCard} aria-label="Verification stages">
            <div className={styles.stageCardHeader}><div><span className={styles.kicker}>LIVE TRACE</span><h3>One scenario, five trace events.</h3></div><span className={running ? styles.statusRunning : result?.status === "passed" ? styles.statusPassed : result?.status === "failed" ? styles.statusFailed : styles.statusReady}>{running ? "RUNNING" : result?.status === "passed" ? "PROOF PASSED" : result?.status === "failed" ? "PROOF FAILED" : "READY"}</span></div>
            <ol className={styles.stageList}>{viewStages.map((stage, index) => { const Icon = stage.icon; const status = stageState(stage, activeStage, result, running); return <li key={stage.id} className={`${styles.stageItem} ${status === "running" ? styles.stageItemRunning : ""} ${status === "passed" ? styles.stageItemPassed : ""} ${status === "failed" ? styles.stageItemFailed : ""}`}><span className={styles.stageNumber}>{String(index + 1).padStart(2, "0")}</span><span className={styles.stageIcon}><Icon size={16} aria-hidden="true" /></span><span className={styles.stageCopy}><strong>{stage.label}</strong><small>{stage.detail}</small></span><span className={styles.stageStatus}>{statusLabel(status)}</span>{index < viewStages.length - 1 ? <ArrowRight className={styles.stageArrow} size={15} aria-hidden="true" /> : null}</li>; })}</ol>
          </div>
        </div>
      </section>

      {error ? <section className={styles.errorPanel} role="alert"><CircleAlert size={18} aria-hidden="true" /><div><strong>Verification did not complete.</strong><p>{error}</p></div><button type="button" onClick={runVerification}>Retry</button></section> : null}

      <section id="proof" className={styles.proofSection} aria-labelledby="proof-title">
        <div className={styles.sectionHeading}><span className={styles.kicker}>02 / PROOF RECORD</span><h2 id="proof-title">Read the result, not a promise.</h2><p>The proof panel stays empty until the server returns a record. Then each view shows a different part of the same run.</p></div>
        {!result ? <div className={styles.emptyProof}><div className={styles.emptyIcon}><FileCheck2 size={24} aria-hidden="true" /></div><div><strong>Proof record waiting</strong><p>Run a scenario above to see the baseline request, bounded patch, and regression checks.</p></div></div> : <div className={styles.resultCard}>
          <div className={styles.resultHeader}><div><div className={styles.resultEyebrow}><span className={result.status === "passed" ? styles.resultDotPass : styles.resultDotFail} aria-hidden="true" /> {result.status === "passed" ? "PROOF ACCEPTED" : "PROOF REJECTED"}</div><h3>{result.scenario.id} · {result.scenario.title}</h3><p>{result.runId}</p></div><div className={styles.resultMeta}><span><Clock3 size={14} aria-hidden="true" /> {result.elapsedMs} ms server run</span><span>{result.metrics.passed}/{result.metrics.checks} checks passed</span></div></div>
          <div className={styles.detailTabs} role="tablist" aria-label="Proof record views"><button id="tab-evidence" role="tab" aria-selected={activeTab === "evidence"} aria-controls="panel-evidence" className={activeTab === "evidence" ? styles.tabActive : ""} type="button" onClick={() => selectTab("evidence")}>Evidence</button><button id="tab-patch" role="tab" aria-selected={activeTab === "patch"} aria-controls="panel-patch" className={activeTab === "patch" ? styles.tabActive : ""} type="button" onClick={() => selectTab("patch")}>Patch</button><button id="tab-regression" role="tab" aria-selected={activeTab === "regression"} aria-controls="panel-regression" className={activeTab === "regression" ? styles.tabActive : ""} type="button" onClick={() => selectTab("regression")}>Regression</button></div>
          {activeTab === "evidence" ? <div id="panel-evidence" role="tabpanel" aria-labelledby="tab-evidence" className={styles.resultBody}><div className={styles.evidenceColumns}><div className={styles.evidenceBox}><span className={styles.evidenceLabel}><X size={14} aria-hidden="true" /> Baseline request</span><code>{result.baseline.request}</code><span className={styles.observed}><b>Observed</b>{result.baseline.observed}</span><span className={styles.explanation}>This is the vulnerable behavior the harness detected before the rule was applied.</span></div><div className={`${styles.evidenceBox} ${styles.evidenceAfter}`}><span className={styles.evidenceLabel}><Check size={14} aria-hidden="true" /> Expected after patch</span><code>{result.baseline.request}</code><span className={styles.observed}><b>Expected</b>{result.baseline.expected}</span><span className={styles.explanation}>The exploit is considered closed only when this protected outcome is observed.</span></div></div></div> : null}
          {activeTab === "patch" ? <div id="panel-patch" role="tabpanel" aria-labelledby="tab-patch" className={styles.resultBody}><div className={styles.patchLayout}><div><span className={styles.detailLabel}>BOUNDARDED RULE</span><h4>{result.patch.rule}</h4><p>{result.patch.scope}</p></div><div className={styles.changedFiles}><span className={styles.detailLabel}>CHANGED IN SYNTHETIC HARNESS</span>{result.patch.changedFiles.map((file) => <code key={file}>{file}</code>)}</div></div></div> : null}
          {activeTab === "regression" ? <div id="panel-regression" role="tabpanel" aria-labelledby="tab-regression" className={styles.resultBody}><ul className={styles.checkList}>{result.checks.map((check) => <CheckRow check={check} key={check.id} />)}</ul></div> : null}
        </div>}
      </section>

      <section id="boundary" className={styles.boundarySection} aria-labelledby="boundary-title"><div><span className={styles.kicker}>03 / SAFETY BOUNDARY</span><h2 id="boundary-title">Designed to stop at the sandbox.</h2><p>This concept is ready for an organiser adapter, not a real target. The adapter is intentionally absent until the official schema and scope are supplied.</p></div><div className={styles.boundaryList}><div><Check size={15} aria-hidden="true" /><span>Only an allowlisted scenario ID is accepted</span></div><div><Check size={15} aria-hidden="true" /><span>No target URL, shell command, or uploaded code</span></div><div><Check size={15} aria-hidden="true" /><span>Before and after behavior are checked separately</span></div><div><Check size={15} aria-hidden="true" /><span>Failures are shown; they never fall back to success</span></div></div></section>
      <footer className={styles.footer}><span>KAVACH SENTINEL / AI KAVACH TRACK 02</span><span>Sandbox-only · Executable synthetic proof</span></footer>
    </div>
  );
}
