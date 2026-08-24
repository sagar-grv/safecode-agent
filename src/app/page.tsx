import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

import { KavachSiteShell } from "@/components/kavach-site-shell";
import styles from "@/components/kavach-story-pages.module.css";

export const metadata = {
  title: "Kavach Sentinel · Proof Lab",
  description: "A bounded cyber-reasoning system for safe vulnerability remediation.",
};

export default function Home() {
  return (
    <KavachSiteShell chapter="00 / THE BRIEF">
      <div className={styles.page}>
        <section className={styles.landingHero}>
          <div>
            <div className={styles.heroLabel}>DEFENSIVE AUTONOMY / EVIDENCE-FIRST</div>
            <h1 className={styles.heroTitle}>Nothing ships<br /><span className={styles.heroTitleAccent}>on a guess.</span></h1>
            <p className={styles.heroStatement}>Kavach Sentinel turns a vulnerability hypothesis into a bounded patch—and then into evidence that the fix holds.</p>
            <div className={styles.heroMeta}><i /> <span>AI KAVACH / TERRIER CYBER QUEST 2026</span></div>
          </div>
          <div className={styles.heroFigure} aria-label="Kavach Sentinel three-dimensional verification core"><Image className={styles.heroCoreImage} src="/kavach-proof-core-refined.png" alt="Three-dimensional Kavach Sentinel proof core" fill priority sizes="(max-width: 820px) 275px, 350px" /><div className={styles.heroOrb}><div className={styles.heroOrbInner}><ShieldCheck size={28} /><span className={styles.heroOrbText}>PROOF<br />LAB</span></div></div><span className={styles.hero3dTag}>3D / PROOF CORE</span><span className={styles.heroScroll}>Scroll to inspect</span></div>
        </section>

        <section className={styles.chapterGrid} aria-label="Kavach Proof Lab pages">
          <article className={styles.chapterCard}><div className={styles.chapterNumber}><span>01 / CONTROL LOOP</span><span>LIVE</span></div><h2 className={styles.chapterTitle}>Find the flaw.<br />Prove the fix.</h2><p className={styles.chapterCopy}>Run the four-stage synthetic control loop and watch decisions become an evidence trail.</p><Link className={styles.chapterLink} href="/kavach">Enter control room <ArrowRight size={14} /></Link></article>
          <article className={styles.chapterCard}><div className={styles.chapterNumber}><span>02 / CASE FILE</span><span>BFLA-001</span></div><h2 className={styles.chapterTitle}>The exploit<br />before the story.</h2><p className={styles.chapterCopy}>Inspect a real finding narrative: baseline abuse, minimal patch, and verified post-patch behaviour.</p><Link className={styles.chapterLink} href="/evidence">Open case file <ArrowRight size={14} /></Link></article>
          <article className={styles.chapterCard}><div className={styles.chapterNumber}><span>03 / SYSTEM MAP</span><span>BOUNDED</span></div><h2 className={styles.chapterTitle}>Autonomy<br />with a boundary.</h2><p className={styles.chapterCopy}>See where the model advises, where policy gates act, and where the verifier decides.</p><Link className={styles.chapterLink} href="/architecture">Inspect architecture <ArrowRight size={14} /></Link></article>
        </section>

        <section className={styles.manifesto}><div className={styles.manifestoNumber}>THE QUESTION</div><p className={styles.manifestoCopy}>Can an autonomous system make a security change that <em>deserves trust?</em></p></section>

        <section className={styles.chapterGrid} aria-label="Submission pages">
          <article className={styles.chapterCard}><div className={styles.chapterNumber}><span>04 / JUDGE BRIEF</span><span>5 SLIDES</span></div><h2 className={styles.chapterTitle}>Make the<br />proof legible.</h2><p className={styles.chapterCopy}>A concise translation of the challenge into the five-slide story judges can follow.</p><Link className={styles.chapterLink} href="/submission">Read judge brief <ArrowRight size={14} /></Link></article>
          <article className={styles.chapterCard}><div className={styles.chapterNumber}><span>05 / PRINCIPLE</span><span>SAFE STOP</span></div><h2 className={styles.chapterTitle}>The model<br />proposes.</h2><p className={styles.chapterCopy}>Policy gates decide. The verifier proves. Human review owns uncertainty.</p><Link className={styles.chapterLink} href="/architecture">Read the boundary <ArrowRight size={14} /></Link></article>
          <article className={styles.chapterCard}><div className={styles.chapterNumber}><span>06 / STATUS</span><span>MVP</span></div><h2 className={styles.chapterTitle}>Synthetic by<br />design.</h2><p className={styles.chapterCopy}>This deployment is a safe MVP. The organiser adapter remains pending until the target schema is provided.</p><Link className={styles.chapterLink} href="/kavach">View current status <ArrowRight size={14} /></Link></article>
        </section>
      </div>
    </KavachSiteShell>
  );
}
