"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import styles from "@/components/kavach-back-button.module.css";

export function KavachBackButton() {
  const router = useRouter();

  function goBack() {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/");
  }

  return <button className={styles.button} type="button" onClick={goBack}><ArrowLeft size={14} /> Back</button>;
}
