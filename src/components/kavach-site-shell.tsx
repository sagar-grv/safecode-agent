import Link from "next/link";
import { ArrowUpRight, CircleDot, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

import { KavachBackButton } from "@/components/kavach-back-button";
import styles from "@/components/kavach-site-shell.module.css";

export function KavachSiteShell({ chapter, children }: { chapter: string; children: ReactNode }) {
  return (
    <main className={styles.site}>
      <a className={styles.skipLink} href="#main-content">Skip to content</a>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandMark}><ShieldCheck size={17} aria-hidden="true" /></span>
          <span><strong>KAVACH SENTINEL</strong><small>PROOF LAB / TRACK 02</small></span>
        </Link>
        <nav className={styles.nav} aria-label="Kavach pages">
          <Link href="/kavach">Control room</Link>
          <Link href="/evidence">Case file</Link>
          <Link href="/architecture">Architecture</Link>
          <Link href="/submission">Judge brief</Link>
        </nav>
        <span className={styles.synthetic}><CircleDot size={10} fill="currentColor" aria-hidden="true" /> SYNTHETIC ONLY</span>
      </header>
      <div className={styles.chapterBar}><KavachBackButton /><span>{chapter}</span><span>PROOF LAB / 2026</span></div>
      <div id="main-content">{children}</div>
      <footer className={styles.footer}><span>KAVACH SENTINEL / TERRIER CYBER QUEST 2026</span><span>Sandbox-only · Executable synthetic proof <ArrowUpRight size={12} aria-hidden="true" /></span></footer>
    </main>
  );
}
