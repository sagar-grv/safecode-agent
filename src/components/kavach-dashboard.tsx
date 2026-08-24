"use client";

import {
  ArrowDownRight,
  ArrowRight,
  Check,
  ChevronRight,
  CircleDot,
  Clock3,
  Code2,
  FileCheck2,
  GitBranch,
  LockKeyhole,
  Play,
  RefreshCw,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Workflow,
  X,
} from "lucide-react";
import { useState } from "react";

import {
  runKavachDemo,
  type KavachDemoResult,
  type KavachFinding,
  type KavachStage,
} from "@/lib/kavach-demo";
import styles from "@/components/kavach-dashboard.module.css";

const stages: Array<{ id: KavachStage; label: string; detail: string; icon: typeof ScanSearch }> = [
  { id: "scan", label: "Discover", detail: "Explore declared surface", icon: ScanSearch },
  { id: "reason", label: "Reason", detail: "Correlate evidence", icon: Sparkles },
  { id: "patch", label: "Patch", detail: "Apply minimal diff", icon: Code2 },
  { id: "prove", label: "Prove", detail: "Validate the fix", icon: FileCheck2 },
];

function severityClass(severity: KavachFinding["severity"]) {
  return severity === "critical" ? styles.critical : severity === "high" ? styles.high : styles.medium;
}

export function KavachDashboard() {
  const [result, setResult] = useState<KavachDemoResult>(() => runKavachDemo());
  const [selectedId, setSelectedId] = useState(result.findings[0].id);
  const [running, setRunning] = useState(false);
  const [activeStage, setActiveStage] = useState<KavachStage>("prove");
  const [activeTab, setActiveTab] = useState<"plan" | "proof" | "safety">("plan");
  const selectedFinding = result.findings.find((finding) => finding.id === selectedId) ?? result.findings[0];

  async function runValidation() {
    setRunning(true);
    setActiveTab("plan");
    for (const stage of stages) {
      setActiveStage(stage.id);
      await new Promise((resolve) => setTimeout(resolve, 420));
    }
    try {
      const response = await fetch("/api/kavach-demo", { method: "POST" });
      if (!response.ok) throw new Error("Validation failed");
      const next = (await response.json()) as KavachDemoResult;
      setResult(next);
      setSelectedId(next.findings[0].id);
    } catch {
      setResult(runKavachDemo());
    } finally {
      setActiveStage("prove");
      setRunning(false);
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <a href="#top" className={styles.brand}><span className={styles.brandMark}><ShieldCheck size={17} /></span><span><strong>KAVACH SENTINEL</strong><small>AI KAVACH / TRACK 02</small></span></a>
        <nav className={styles.topNav} aria-label="Page sections"><a href="#run">Run narrative</a><a href="#proof">Proof surface</a><a href="#safety">Safety contract</a></nav>
        <div className={styles.topbarRight}><span className={styles.demoPill}>SYNTHETIC DEMO</span><span className={styles.connectedStatus}><span className={styles.liveDot} /> Sandbox connected</span></div>
      </header>

      <section id="top" className={`${styles.hero} ${running ? styles.heroRunning : ""}`}>
        <div className={styles.heroIndex}>02<span>/05</span></div>
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow}><span className={styles.eyebrowDot} /> DEFENSIVE AUTONOMY / EVIDENCE-FIRST</div>
          <h1>Find the flaw.<br /><em>Prove the fix.</em></h1>
          <p className={styles.heroSub}>Kavach Sentinel is a bounded cyber-reasoning system for simulated defence infrastructure.</p>
          <div className={styles.heroActions}><button className={styles.primaryButton} type="button" onClick={runValidation} disabled={running}>{running ? <RefreshCw className={styles.spin} size={16} /> : <Play size={16} />}{running ? "Running control loop" : "Run control loop"}</button><span className={styles.runStamp}><span className={styles.liveDot} /> {result.runId}</span></div>
        </div>
        <div className={styles.heroSignal} aria-label="Safe autonomy signal"><div className={styles.signalNumber}>S</div><div className={`${styles.signalRing} ${styles.signalRingOne}`} /><div className={`${styles.signalRing} ${styles.signalRingTwo}`} /><span>SAFE<br />AUTONOMY</span><div className={styles.signalCaption}>POLICY-GATED<br />LOOP</div></div>
      </section>

      <section className={styles.targetBar} aria-label="Target boundary"><div className={styles.targetIdentity}><span className={styles.targetIcon}><LockKeyhole size={15} /></span><div><span className={styles.targetLabel}>TARGET LOCKED · SYNTHETIC</span><strong>{result.target}</strong></div></div><div className={styles.targetMeta}><span><GitBranch size={14} /> {result.targetHash}</span><span><LockKeyhole size={14} /> Egress denied</span></div></section>
      <div className={styles.dataNotice}><span><CircleDot size={12} /> {result.dataNotice}</span><span>Real-target adapter: pending organiser scope + schema</span></div>

      <section id="run" className={styles.runSection}>
        <div className={styles.sectionIntro}><span className={styles.sectionKicker}>01 / RUN NARRATIVE</span><h2>One control loop.<br /><em>Four visible decisions.</em></h2><p>Each stage leaves a trace that a judge can inspect, replay, and challenge.</p></div>
        <div className={styles.pipeline}>{stages.map((stage, index) => { const Icon = stage.icon; const active = running && activeStage === stage.id; return <div className={`${styles.pipelineStep} ${active ? styles.pipelineStepActive : ""}`} key={stage.id}><div className={styles.pipelineTop}><span className={styles.pipelineNumber}>{String(index + 1).padStart(2, "0")}</span><Icon size={18} /><span className={styles.pipelineStatus}>{active ? "RUNNING" : "DONE"}</span></div><strong>{stage.label}</strong><span>{stage.detail}</span>{index < stages.length - 1 ? <ArrowRight className={styles.pipelineArrow} size={18} /> : null}</div>; })}</div>
      </section>

      <section id="proof" className={styles.proofSection}>
        <div className={styles.sectionIntro}><span className={styles.sectionKicker}>02 / PROOF SURFACE</span><h2>Findings that survived<br /><em>verification.</em></h2><p>Confidence rises only when source evidence, runtime behaviour, and regression proof agree.</p></div>
        <div className={styles.proofGrid}><div className={styles.findingList}>{result.findings.map((finding) => <button type="button" key={finding.id} className={`${styles.findingRow} ${selectedFinding.id === finding.id ? styles.findingRowSelected : ""}`} onClick={() => setSelectedId(finding.id)}><span className={`${styles.severityPill} ${severityClass(finding.severity)}`}>{finding.severity}</span><span className={styles.findingRowCopy}><strong>{finding.title}</strong><small>{finding.route}</small></span><span className={styles.findingRowConfidence}>{Math.round(finding.confidence * 100)}%</span><ChevronRight size={16} /></button>)}</div><div className={styles.casePanel}><div className={styles.caseHeader}><div><span className={styles.detailClass}>{selectedFinding.className}</span><h3>{selectedFinding.title}</h3></div><span className={`${styles.severityPill} ${severityClass(selectedFinding.severity)}`}>{selectedFinding.severity}</span></div><div className={styles.detailTabs} role="tablist"><button type="button" className={activeTab === "plan" ? styles.tabActive : ""} onClick={() => setActiveTab("plan")}>Patch plan</button><button type="button" className={activeTab === "proof" ? styles.tabActive : ""} onClick={() => setActiveTab("proof")}>Before / after</button><button type="button" className={activeTab === "safety" ? styles.tabActive : ""} onClick={() => setActiveTab("safety")}>Safety proof</button></div>{activeTab === "plan" ? <div className={styles.caseBody}><p>{selectedFinding.summary}</p><div className={styles.patchCallout}><Code2 size={16} /><span><strong>Approved patch strategy</strong>{selectedFinding.patch}</span></div><div className={styles.caseFacts}><span>Route <b>{selectedFinding.route}</b></span><span>Confidence <b>{Math.round(selectedFinding.confidence * 100)}%</b></span><span>Decision <b className={styles.greenText}>ACCEPTED</b></span></div></div> : null}{activeTab === "proof" ? <div className={styles.evidenceGrid}><div className={styles.evidenceBox}><span className={styles.evidenceLabel}><X size={14} /> Baseline exploit</span><code>{selectedFinding.evidence.before}</code></div><div className={`${styles.evidenceBox} ${styles.evidenceAfter}`}><span className={styles.evidenceLabel}><Check size={14} /> Post-patch proof</span><code>{selectedFinding.evidence.after}</code></div></div> : null}{activeTab === "safety" ? <div className={styles.safetyProof}><ShieldCheck size={25} /><div><strong>{selectedFinding.verification}</strong><p>The verifier blocks abuse while preserving authorised behaviour.</p></div></div> : null}</div></div>
      </section>

      <section className={styles.metricsSection}><div className={styles.sectionIntro}><span className={styles.sectionKicker}>03 / RUN SIGNALS</span><h2>Proof, measured.</h2><p>Current values are synthetic MVP smoke-test metrics, not real-target performance claims.</p></div><div className={styles.metricWall}><div><span>RECALL</span><strong>{Math.round(result.metrics.recall * 100)}<small>%</small></strong><em>seeded cases found</em></div><div><span>PRECISION</span><strong>{Math.round(result.metrics.precision * 100)}<small>%</small></strong><em>no false positives</em></div><div><span>PATCH SUCCESS</span><strong>{Math.round(result.metrics.patchSuccess * 100)}<small>%</small></strong><em>fixes accepted</em></div><div><span>SAFE STOPS</span><strong>{result.metrics.safeStops.toString().padStart(2, "0")}</strong><em>policy violations</em></div></div><div className={styles.traceInline}><span><Clock3 size={14} /> {result.metrics.elapsed}</span><span><Workflow size={14} /> {result.metrics.memory}</span><span><ArrowDownRight size={14} /> {result.findings.length} verified fixes</span></div></section>

      <section id="safety" className={styles.safetySection}><div><span className={styles.sectionKicker}>04 / SAFETY CONTRACT</span><h2>Autonomy with a boundary.</h2><p>The model proposes. Policy gates decide. The verifier proves.</p></div><div className={styles.safetyGrid}>{result.safety.map((item) => <div key={item}><Check size={14} /><span>{item}</span></div>)}</div></section>
      <footer className={styles.footer}><span>KAVACH SENTINEL / AI KAVACH TRACK 02</span><span>Sandbox-only · Synthetic data · Auditable evidence</span></footer>
    </main>
  );
}
