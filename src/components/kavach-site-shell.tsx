import Link from "next/link";
import { ArrowUpRight, CircleDot, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

import styles from "@/components/kavach-site-shell.module.css";

export function KavachSiteShell({ chapter, children }: { chapter: string; children: ReactNode }) {
  return (
    <main className={styles.site}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandMark}><ShieldCheck size={17} /></span>
          <span><strong>KAVACH SENTINEL</strong><small>PROOF LAB / TRACK 02</small></span>
        </Link>
        <nav className={styles.nav} aria-label="Kavach pages">
          <Link href="/kavach">Control room</Link>
          <Link href="/evidence">Case file</Link>
          <Link href="/architecture">Architecture</Link>
          <Link href="/submission">Judge brief</Link>
        </nav>
        <span className={styles.synthetic}><CircleDot size={10} fill="currentColor" /> SYNTHETIC DEMO</span>
      </header>
      <div className={styles.chapterBar}><span>{chapter}</span><span>01—05 / KAVACH PROOF LAB</span></div>
      {children}
      <footer className={styles.footer}><span>KAVACH SENTINEL / TERRIER CYBER QUEST 2026</span><span>Sandbox-only · Synthetic data · Auditable evidence <ArrowUpRight size={12} /></span></footer>
    </main>
  );
}
