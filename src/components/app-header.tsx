import {
  ExternalLink,
  Menu,
  ShieldCheck,
  SquareTerminal,
} from "lucide-react";
import Link from "next/link";

import styles from "@/components/workspace.module.css";

function GithubMark() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 1.75A10.25 10.25 0 0 0 8.76 21.72c.51.09.7-.22.7-.5v-1.96c-2.85.62-3.45-1.21-3.45-1.21-.47-1.18-1.14-1.5-1.14-1.5-.93-.64.07-.62.07-.62 1.03.07 1.57 1.05 1.57 1.05.91 1.56 2.39 1.11 2.98.85.09-.66.36-1.11.65-1.37-2.28-.26-4.67-1.14-4.67-5.06 0-1.12.4-2.03 1.05-2.75-.1-.26-.45-1.3.1-2.71 0 0 .86-.28 2.82 1.05A9.8 9.8 0 0 1 12 6.65a9.8 9.8 0 0 1 2.57.35c1.96-1.33 2.82-1.05 2.82-1.05.55 1.41.2 2.45.1 2.71.65.72 1.05 1.63 1.05 2.75 0 3.93-2.4 4.8-4.68 5.06.37.32.69.94.69 1.89v2.87c0 .28.18.6.7.5A10.25 10.25 0 0 0 12 1.75Z" />
    </svg>
  );
}

export function AppHeader() {
  return (
    <header className={styles.header}>
      <Link className={styles.brand} href="/" aria-label="SafeCode Agent home">
        <span className={styles.brandMark}>
          <ShieldCheck aria-hidden="true" size={22} strokeWidth={1.8} />
        </span>
        <span>SafeCode Agent</span>
      </Link>

      <nav className={styles.desktopNav} aria-label="Primary navigation">
        <Link className={styles.navItemActive} href="/">
          <SquareTerminal aria-hidden="true" size={17} />
          Workspace
        </Link>
        <Link className={styles.navItem} href="/evaluation">
          Evaluation
        </Link>
      </nav>

      <a
        className={styles.githubLink}
        href="https://github.com/sagar-grv/safecode-agent"
        target="_blank"
        rel="noreferrer"
      >
        <GithubMark />
        <span>GitHub</span>
        <ExternalLink aria-hidden="true" size={14} />
      </a>

      <details className={styles.mobileMenu}>
        <summary aria-label="Open navigation">
          <Menu aria-hidden="true" size={25} />
        </summary>
        <div className={styles.mobileMenuPanel}>
          <Link href="/">Workspace</Link>
          <Link href="/evaluation">Evaluation</Link>
          <a
            href="https://github.com/sagar-grv/safecode-agent"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
            <ExternalLink aria-hidden="true" size={14} />
          </a>
        </div>
      </details>
    </header>
  );
}
