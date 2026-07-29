import { ArrowLeft, CheckCircle2, FlaskConical, ShieldAlert } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import report from "../../../reports/live-evaluation.json";
import { AppHeader } from "@/components/app-header";
import styles from "./evaluation.module.css";

export const metadata: Metadata = {
  title: "Evaluation",
  description: "The measurable quality gates behind SafeCode Agent.",
};

export default function EvaluationPage() {
  return (
    <div className={styles.page}>
      <AppHeader />
      <main>
        <Link className={styles.back} href="/">
          <ArrowLeft aria-hidden="true" size={16} />
          Back to workspace
        </Link>

        <div className={styles.intro}>
          <div>
            <h1>Evaluation, before claims</h1>
            <p>
              SafeCode reports only measurements produced by a committed,
              repeatable suite. These results were recorded against the public
              Vercel deployment on{" "}
              {new Date(report.generatedAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
              .
            </p>
          </div>
          <div className={styles.status}>
            <FlaskConical aria-hidden="true" size={20} />
            <span>Evaluation suite</span>
            <strong>{report.cases}/{report.cases} live tasks passed</strong>
          </div>
        </div>

        <section className={styles.matrix} aria-label="Evaluation matrix">
          <article>
            <CheckCircle2 aria-hidden="true" size={20} />
            <h2>48 policy cases</h2>
            <p>
              Twenty-four supported data tasks and twenty-four unsafe Python
              snippets validate planning and static blocking.
            </p>
            <code>npm test</code>
          </article>
          <article>
            <ShieldAlert aria-hidden="true" size={20} />
            <h2>{report.cases}/{report.cases} live sandbox tasks</h2>
            <p>
              {Math.round(report.metrics.passAt1 * 1000) / 10}% Pass@1,{" "}
              {Math.round(report.metrics.passAt3 * 100)}% Pass@3, and{" "}
              {Math.round(report.metrics.artifactSuccess * 100)}% artifact
              success against the production Sandbox.
            </p>
            <code>p95 {(report.metrics.p95EndToEndMs / 1000).toFixed(1)}s</code>
          </article>
        </section>

        <section className={styles.criteria}>
          <h2>Release gates</h2>
          <div>
            <span>Unsafe snippets blocked in the labeled policy suite</span>
            <strong>24 / 24</strong>
          </div>
          <div>
            <span>Production tasks returning a validated artifact</span>
            <strong>
              {Math.round(report.metrics.artifactSuccess * 100)}%
            </strong>
          </div>
          <div>
            <span>Production tasks completing within three attempts</span>
            <strong>{Math.round(report.metrics.passAt3 * 100)}%</strong>
          </div>
          <div>
            <span>p95 end-to-end production latency</span>
            <strong>
              {(report.metrics.p95EndToEndMs / 1000).toFixed(1)} seconds
            </strong>
          </div>
        </section>
      </main>
    </div>
  );
}
