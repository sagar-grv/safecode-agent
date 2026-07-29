import {
  Clock3,
  Copy,
  Cpu,
  Folder,
  Globe2,
  MemoryStick,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import styles from "@/components/workspace.module.css";

const POLICIES = [
  { icon: Globe2, label: "Network", value: "Deny all" },
  { icon: Folder, label: "Filesystem", value: "Temporary workspace" },
  { icon: Clock3, label: "Timeout", value: "30 seconds" },
  { icon: MemoryStick, label: "Process memory", value: "512 MB" },
  { icon: Cpu, label: "Compute", value: "1 vCPU microVM" },
  { icon: RefreshCw, label: "Attempts", value: "3 max" },
];

export function PolicyPanel({
  onCopyTrace,
}: {
  onCopyTrace: () => void;
}) {
  return (
    <aside className={styles.policy} aria-labelledby="policy-heading">
      <div className={styles.policyTitle}>
        <ShieldCheck aria-hidden="true" size={21} />
        <h2 id="policy-heading">Sandbox policy</h2>
      </div>

      <div className={styles.policyRows}>
        {POLICIES.map(({ icon: Icon, label, value }) => (
          <div className={styles.policyRow} key={label}>
            <Icon aria-hidden="true" size={21} strokeWidth={1.6} />
            <div>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          </div>
        ))}
      </div>

      <button className={styles.copyTraceButton} type="button" onClick={onCopyTrace}>
        <Copy aria-hidden="true" size={16} />
        Copy trace
      </button>
    </aside>
  );
}
