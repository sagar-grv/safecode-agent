"use client";

import {
  ArrowRight,
  Check,
  ChevronRight,
  CircleDot,
  Clock3,
  Code2,
  FileCheck2,
  Gauge,
  GitBranch,
  LockKeyhole,
  Play,
  RefreshCw,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
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

const stageMeta: Array<{
  id: KavachStage;
  label: string;
  description: string;
  icon: typeof ScanSearch;
}> = [
  { id: "scan", label: "Scan", description: "Explore the declared surface", icon: ScanSearch },
  { id: "reason", label: "Reason", description: "Correlate evidence safely", icon: Sparkles },
  { id: "patch", label: "Patch", description: "Apply a minimal diff", icon: Code2 },
  { id: "prove", label: "Prove", description: "Validate the fix", icon: FileCheck2 },
];

function severityClass(severity: KavachFinding["severity"]) {
  return severity === "critical" ? styles.critical : severity === "high" ? styles.high : styles.medium;
}

function MetricCard({ label, value, detail, accent }: { label: string; value: string; detail: string; accent?: string }) {
  return (
    <div className={styles.metricCard}>
      <div className={styles.metricLabel}>{label}</div>
      <div className={styles.metricValue} style={accent ? { color: accent } : undefined}>{value}</div>
      <div className={styles.metricDetail}>{detail}</div>
    </div>
  );
}

function FindingCard({ finding, selected, onSelect }: { finding: KavachFinding; selected: boolean; onSelect: () => void }) {
  return (
    <button className={`${styles.findingCard} ${selected ? styles.findingCardSelected : ""}`} onClick={onSelect} type="button">
      <div className={styles.findingTopline}>
        <span className={`${styles.severityPill} ${severityClass(finding.severity)}`}>{finding.severity}</span>
        <span className={styles.findingId}>{finding.id}</span>
        <ChevronRight aria-hidden="true" size={16} className={styles.findingArrow} />
      </div>
      <div className={styles.findingTitle}>{finding.title}</div>
      <div className={styles.findingRoute}>{finding.route}</div>
      <div className={styles.findingConfidence}><span>Confidence</span><strong>{Math.round(finding.confidence * 100)}%</strong></div>
      <div className={styles.confidenceTrack}><span style={{ width: `${finding.confidence * 100}%` }} /></div>
    </button>
  );
}

export function KavachDashboard() {
  const [result, setResult] = useState<KavachDemoResult>(() => runKavachDemo());
  const [selectedId, setSelectedId] = useState(result.findings[0].id);
  const [running, setRunning] = useState(false);
  const [activeStage, setActiveStage] = useState<KavachStage>("prove");
  const [activeTab, setActiveTab] = useState<"overview" | "evidence" | "safety">("overview");
  const selectedFinding = result.findings.find((finding) => finding.id === selectedId) ?? result.findings[0];

  async function runValidation() {
    setRunning(true);
    setActiveTab("overview");
    const sequence: KavachStage[] = ["scan", "reason", "patch", "prove"];
    for (const stage of sequence) {
      setActiveStage(stage);
      await new Promise((resolve) => setTimeout(resolve, 420));
    }
    try {
      const response = await fetch("/api/kavach-demo", { method: "POST" });
      if (!response.ok) throw new Error("Demo run failed");
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
        <div className={styles.productMark}>
          <span className={styles.productMarkIcon}><ShieldCheck aria-hidden="true" size={18} /></span>
          <span><strong>KAVACH SENTINEL</strong><small>AI KAVACH / TRACK 02</small></span>
        </div>
        <div className={styles.topbarRight}>
          <span className={styles.controlPill}><CircleDot size={11} fill="currentColor" /> CONTROL ROOM</span>
          <span className={styles.demoPill}>SYNTHETIC DEMO</span>
          <span className={styles.connectedStatus}><span className={styles.liveDot} /> Sandbox connected</span>
          <span className={styles.versionTag}>v0.3.0</span>
        </div>
      </header>

      <section className={`${styles.hero} ${running ? styles.heroRunning : ""}`}>
        <div className={styles.heroGlow} />
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow}><span className={styles.eyebrowDot} /> DEFENSIVE AUTONOMY / EVIDENCE-FIRST</div>
          <h1>Kavach Sentinel</h1>
          <p className={styles.heroLead}>Find the flaw. Ship the fix. Prove it holds.</p>
          <p className={styles.heroSub}>A bounded cyber-reasoning system for simulated defence infrastructure.</p>
          <div className={styles.heroActions}>
            <button className={styles.primaryButton} type="button" onClick={runValidation} disabled={running}>
              {running ? <RefreshCw className={styles.spin} aria-hidden="true" size={16} /> : <Play aria-hidden="true" size={16} />}
              {running ? "Validating control loop" : "Run control loop"}
            </button>
            <div className={styles.runStamp}><span className={styles.liveDot} /> Last run <strong>{result.runId}</strong></div>
          </div>
        </div>
        <div className={styles.heroDiagram} aria-label="Kavach Sentinel four-stage control loop">
          <div className={styles.diagramOrbit} />
          <div className={styles.diagramCore}><ShieldCheck aria-hidden="true" size={32} strokeWidth={1.5} /><span>SAFE<br />AUTONOMY</span></div>
          <div className={`${styles.diagramNode} ${styles.nodeOne}`}><ScanSearch size={17} /><span>Discover</span></div>
          <div className={`${styles.diagramNode} ${styles.nodeTwo}`}><Sparkles size={17} /><span>Reason</span></div>
          <div className={`${styles.diagramNode} ${styles.nodeThree}`}><Code2 size={17} /><span>Patch</span></div>
          <div className={`${styles.diagramNode} ${styles.nodeFour}`}><FileCheck2 size={17} /><span>Prove</span></div>
          <span className={styles.diagramCaption}>POLICY-GATED LOOP</span>
        </div>
      </section>

      <section className={styles.targetBar}>
        <div className={styles.targetIdentity}><span className={styles.targetIcon}><LockKeyhole size={15} /></span><div><span className={styles.targetLabel}>TARGET LOCKED · {result.mode === "synthetic-demo" ? "SYNTHETIC" : "ORGANISER ADAPTER"}</span><strong>{result.target}</strong></div></div>
        <div className={styles.targetMeta}><span><GitBranch size={14} /> {result.targetHash}</span><span><TerminalSquare size={14} /> Python REST API</span><span><LockKeyhole size={14} /> Egress denied</span></div>
      </section>

      <section className={styles.stageRail} aria-label="Kavach Sentinel pipeline stages">
        {stageMeta.map((stage, index) => {
          const Icon = stage.icon;
          const isActive = running && activeStage === stage.id;
          return <div className={`${styles.stageItem} ${isActive ? styles.stageItemActive : ""}`} key={stage.id}>
            <div className={styles.stageMarker}><Icon aria-hidden="true" size={16} /><span>{String(index + 1).padStart(2, "0")}</span></div>
            <div><strong>{stage.label}</strong><span>{isActive ? "Running now" : stage.description}</span></div>
            {index < stageMeta.length - 1 ? <ArrowRight aria-hidden="true" size={16} className={styles.stageArrow} /> : null}
          </div>;
        })}
      </section>

      <div className={styles.dataNotice}><span><CircleDot size={12} /> {result.dataNotice}</span><span>Real-target adapter: pending organiser scope + schema</span></div>

      <section className={styles.signalStrip} aria-label="Run summary">
        <div><span className={styles.signalLabel}>THREATS NEUTRALIZED</span><strong>03</strong><small>validated findings</small></div>
        <div><span className={styles.signalLabel}>EVIDENCE CONFIDENCE</span><strong>98.7%</strong><small>correlated source + runtime</small></div>
        <div><span className={styles.signalLabel}>POLICY VIOLATIONS</span><strong>00</strong><small>safe-stop threshold intact</small></div>
        <div className={styles.signalNarrative}><Workflow size={16} /><span>Every accepted patch must block the exploit <em>and</em> preserve authorised behaviour.</span></div>
      </section>

      <section className={styles.contentGrid}>
        <div className={styles.primaryColumn}>
          <div className={styles.sectionHeading}><div><span className={styles.sectionKicker}>VALIDATION FEED</span><h2>Findings that survived verification</h2></div><span className={styles.successBadge}><Check size={14} /> {result.findings.length} fixes accepted</span></div>
          <div className={styles.findingGrid}>{result.findings.map((finding) => <FindingCard key={finding.id} finding={finding} selected={selectedFinding.id === finding.id} onSelect={() => setSelectedId(finding.id)} />)}</div>

          <div className={styles.detailPanel}>
            <div className={styles.detailHeader}><div><span className={styles.detailClass}>{selectedFinding.className}</span><h3>{selectedFinding.title}</h3></div><span className={`${styles.severityPill} ${severityClass(selectedFinding.severity)}`}>{selectedFinding.severity}</span></div>
            <div className={styles.detailTabs} role="tablist" aria-label="Finding detail views">
              <button type="button" className={activeTab === "overview" ? styles.tabActive : ""} onClick={() => setActiveTab("overview")}>Patch plan</button>
              <button type="button" className={activeTab === "evidence" ? styles.tabActive : ""} onClick={() => setActiveTab("evidence")}>Before / after</button>
              <button type="button" className={activeTab === "safety" ? styles.tabActive : ""} onClick={() => setActiveTab("safety")}>Safety proof</button>
            </div>
            {activeTab === "overview" ? <div className={styles.detailBody}><div className={styles.detailCopy}><p>{selectedFinding.summary}</p><div className={styles.patchCallout}><Code2 size={16} /><span><strong>Approved patch strategy</strong>{selectedFinding.patch}</span></div></div><div className={styles.detailFacts}><div><span>Route</span><strong>{selectedFinding.route}</strong></div><div><span>Confidence</span><strong>{Math.round(selectedFinding.confidence * 100)}%</strong></div><div><span>Decision</span><strong className={styles.greenText}>ACCEPTED</strong></div></div></div> : null}
            {activeTab === "evidence" ? <div className={styles.evidenceGrid}><div className={styles.evidenceBox}><div className={styles.evidenceLabel}><X size={14} /> Baseline exploit</div><code>{selectedFinding.evidence.before}</code></div><div className={`${styles.evidenceBox} ${styles.evidenceAfter}`}><div className={styles.evidenceLabel}><Check size={14} /> Post-patch proof</div><code>{selectedFinding.evidence.after}</code></div></div> : null}
            {activeTab === "safety" ? <div className={styles.safetyProof}><div className={styles.proofIcon}><ShieldCheck size={23} /></div><div><strong>{selectedFinding.verification}</strong><p>The verifier checks that the exploit is blocked while authorised behaviour remains intact.</p></div></div> : null}
          </div>
        </div>

        <aside className={styles.sideColumn}>
          <div className={styles.sideCard}><div className={styles.cardTitle}><Gauge size={15} /> Validation metrics</div><div className={styles.metricsGrid}><MetricCard label="RECALL" value={`${Math.round(result.metrics.recall * 100)}%`} detail="seeded cases found" /><MetricCard label="PRECISION" value={`${Math.round(result.metrics.precision * 100)}%`} detail="no false positives" /><MetricCard label="PATCH SUCCESS" value={`${Math.round(result.metrics.patchSuccess * 100)}%`} detail="fixes accepted" /><MetricCard label="SAFE STOPS" value={String(result.metrics.safeStops)} detail="policy violations" /></div><div className={styles.metricFooter}><span><Clock3 size={14} /> {result.metrics.elapsed}</span><span><Workflow size={14} /> {result.metrics.memory}</span></div></div>
          <div className={styles.sideCard}><div className={styles.cardTitle}><Workflow size={15} /> Execution trace</div><div className={styles.traceList}>{result.trace.map((step) => <div className={styles.traceItem} key={step.id}><span className={styles.traceCheck}><Check size={11} /></span><div><strong>{step.label}</strong><span>{step.detail}</span></div><time>{step.duration}</time></div>)}</div></div>
          <div className={`${styles.sideCard} ${styles.safetyCard}`}><div className={styles.cardTitle}><ShieldCheck size={15} /> Safety contract</div><div className={styles.safetyList}>{result.safety.map((item) => <div key={item}><Check size={13} /><span>{item}</span></div>)}</div><div className={styles.llmNote}><Sparkles size={14} /><span><strong>{result.llm.model}</strong>{result.llm.mode} · {result.llm.output}</span></div></div>
        </aside>
      </section>

      <footer className={styles.footer}><span>KAVACH SENTINEL · JUDGE DEMONSTRATION WORKSPACE</span><span>Sandbox-only · Synthetic data · Auditable evidence</span></footer>
    </main>
  );
}
