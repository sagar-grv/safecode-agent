import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Play, ShieldCheck } from "lucide-react";

import { KavachSiteShell } from "@/components/kavach-site-shell";
import { kavachScenarios } from "@/lib/kavach-runner";
import styles from "@/components/kavach-story-pages.module.css";

export const metadata = {
  title: "Kavach Sentinel · Synthetic Security Verification",
  description: "Run an executable synthetic before-and-after security verification with Kavach Sentinel.",
};

export default function Home() {
  return (
    <KavachSiteShell chapter="00 / OVERVIEW">
      <div className={styles.page}>
        <section className={styles.landingHero} aria-labelledby="home-title">
          <div className={styles.landingHeroCopy}>
            <span className={styles.sectionTag}>AI KAVACH / TRACK 02</span>
            <h1 className={styles.heroTitle} id="home-title">A security fix you can <em>run and verify.</em></h1>
            <p className={styles.heroStatement}>Kavach Sentinel runs a seeded API flaw through a bounded before-and-after harness. You see the request, the policy rule, and the regression result.</p>
            <div className={styles.actionRow}><Link className={styles.accentButton} href="/kavach"><Play size={14} aria-hidden="true" /> Start the demo <ArrowRight size={14} aria-hidden="true" /></Link><Link className={styles.outlineButton} href="/evidence">See a case first <ArrowRight size={14} aria-hidden="true" /></Link></div>
            <div className={styles.heroMeta}><i /> Synthetic only · No external target · No uploaded code</div>
          </div>
          <div className={styles.heroFigure} aria-label="Illustration of the verification core"><Image className={styles.heroCoreImage} src="/kavach-proof-core-orange.png" alt="Abstract verification core for Kavach Sentinel" fill priority sizes="(max-width: 760px) 280px, 420px" /><div className={styles.heroFigureLabel}><ShieldCheck size={16} aria-hidden="true" /><span>Proof core<br /><small>before → after</small></span></div></div>
        </section>

        <section className={styles.explainStrip} aria-label="How the demo works"><div><span>1</span><strong>Choose</strong><small>One seeded API case</small></div><div><span>2</span><strong>Run</strong><small>Baseline, policy, regression</small></div><div><span>3</span><strong>Inspect</strong><small>Evidence returned by the harness</small></div></section>

        <section className={styles.homeSection} aria-labelledby="cases-title"><div className={styles.homeSectionHeading}><span className={styles.sectionTag}>START HERE</span><h2 id="cases-title">Pick the case you want to challenge.</h2><p>Every case is allowlisted, deterministic, and executable. There is no real system behind these routes.</p></div><div className={styles.caseIndexGrid}>{kavachScenarios.map((scenario) => <article className={styles.caseIndexCard} key={scenario.id}><div className={styles.caseIndexTop}><span>{scenario.id}</span><span className={styles[`severity${scenario.severity}`]}>{scenario.severity}</span></div><h3>{scenario.title}</h3><p>{scenario.shortDescription}</p><code>{scenario.route}</code><Link href={`/kavach?case=${encodeURIComponent(scenario.id)}`}>Run this case <ArrowRight size={14} aria-hidden="true" /></Link></article>)}</div></section>

        <section className={styles.proofStatement} aria-labelledby="proof-statement-title"><div><span className={styles.sectionTag}>THE STANDARD</span><h2 id="proof-statement-title">A finding is not a fix.</h2></div><div><p>To accept the result, the harness must observe both sides of the contract:</p><ul><li><Check size={15} aria-hidden="true" /> The unauthorised path is blocked.</li><li><Check size={15} aria-hidden="true" /> The authorised path still works.</li><li><Check size={15} aria-hidden="true" /> A failed check rejects the proof.</li></ul></div></section>

        <section className={styles.finalCallout}><div><span className={styles.sectionTag}>READY WHEN YOU ARE</span><h2>Start with one route.</h2><p>The control room is the working part of the concept. The other pages explain the case, the boundary, and the five-slide story.</p></div><Link className={styles.accentButton} href="/kavach">Open control room <ArrowRight size={14} aria-hidden="true" /></Link></section>
      </div>
    </KavachSiteShell>
  );
}
