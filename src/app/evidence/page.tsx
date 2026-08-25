import Link from "next/link";
import { ArrowRight, Check, ChevronRight, ShieldCheck, X } from "lucide-react";

import { KavachSiteShell } from "@/components/kavach-site-shell";
import { isKavachScenarioId, kavachScenarios } from "@/lib/kavach-runner";
import styles from "@/components/kavach-story-pages.module.css";

type EvidencePageProps = {
  searchParams: Promise<{ case?: string }>;
};

export default async function EvidencePage({ searchParams }: EvidencePageProps) {
  const params = await searchParams;
  const item = isKavachScenarioId(params.case) ? kavachScenarios.find((entry) => entry.id === params.case) ?? kavachScenarios[0] : kavachScenarios[0];

  return (
    <KavachSiteShell chapter="02 / THE CASE FILE">
      <div className={styles.page}>
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <div>
              <span className={styles.sectionTag}>CASE FILE / {item.id}</span>
              <div className={styles.heroMeta}><i /> SEE THIS CASE RUN IN THE CONTROL ROOM</div>
            </div>
            <div>
              <h1 className={styles.sectionTitle}>Start with a case<br /><em>you can verify.</em></h1>
              <p className={styles.sectionLead}>Each seeded case has one concrete route, one bounded policy rule, and two regression checks. This page explains the case; the control room executes it.</p>
            </div>
          </div>
          <div className={styles.caseLayout}>
            <aside className={styles.caseNav} aria-label="Seeded case files">
              {kavachScenarios.map((entry, index) => (
                <Link href={`/evidence?case=${encodeURIComponent(entry.id)}`} className={`${styles.caseNavItem} ${entry.id === item.id ? styles.caseNavSelected : ""}`} aria-current={entry.id === item.id ? "page" : undefined} key={entry.id}>
                  <span><b>{String(index + 1).padStart(2, "0")}</b> {entry.id}</span><ChevronRight size={14} aria-hidden="true" />
                </Link>
              ))}
            </aside>
            <article className={styles.casePanel}>
              <div className={styles.casePanelTop}><div><span className={styles.caseLabel}>{item.category}</span><h2>{item.title}</h2></div><span className={styles.casePanelMeta}>{item.severity} / SEE LIVE RESULT</span></div>
              <p className={styles.caseSummary}>{item.vulnerability}</p>
              <div className={styles.caseEvidence}>
                <div className={styles.caseEvidenceCard}><span className={styles.caseLabel}><X size={13} aria-hidden="true" /> BASELINE / VULNERABLE</span><p>{item.route}<br />{item.baselineOutcome ?? item.protectedOutcome.replace("403 Forbidden", "200 OK")}</p></div>
                <div className={`${styles.caseEvidenceCard} ${styles.caseEvidenceAfter}`}><span className={styles.caseLabel}><Check size={13} aria-hidden="true" /> AFTER RULE / EXPECTED</span><p>{item.route}<br />{item.protectedOutcome}</p></div>
              </div>
              <div className={styles.patchCallout}><ShieldCheck size={18} aria-hidden="true" /><span><span className={styles.caseLabel}>BOUNDED POLICY RULE</span><br />{item.patch}</span></div>
              <div className={styles.stats}><div className={styles.stat}><span>CASE ID</span><strong>{item.id}</strong><small>allowlisted scenario</small></div><div className={styles.stat}><span>SEVERITY</span><strong>{item.severity.toUpperCase()}</strong><small>seed classification</small></div><div className={styles.stat}><span>PROOF</span><strong>2 CHECKS</strong><small>blocked + allowed path</small></div><div className={styles.stat}><span>STATUS</span><strong>READY</strong><small>execute in control room</small></div></div>
            </article>
          </div>
        </section>
        <section className={styles.manifesto}><div className={styles.manifestoNumber}>THE TEST</div><p className={styles.manifestoCopy}>A security fix is useful only when the <em>bad path is blocked</em> and the allowed path still works.</p></section>
        <div className={styles.actionRow}><Link className={styles.accentButton} href={`/kavach?case=${encodeURIComponent(item.id)}`}>Run this case <ArrowRight size={14} aria-hidden="true" /></Link><Link className={styles.outlineButton} href="/architecture">How the boundary works <ArrowRight size={14} aria-hidden="true" /></Link></div>
      </div>
    </KavachSiteShell>
  );
}
