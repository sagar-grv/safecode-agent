# Judge demo verification

Date: 24 August 2026

Route verified: `http://localhost:3000/kavach`

The dashboard renders successfully with the following judge-visible elements:

- AI KAVACH · TRACK 02 branding and Kavach Sentinel title.
- One-click Run validation control.
- Target-locked synthetic Armed Forces API stack with local sandbox, Python REST API, and egress denied status.
- Four-stage pipeline: Scan, Reason, Patch, Prove.
- Three validated findings: critical BFLA, high BOLA, and medium security misconfiguration.
- Finding-detail tabs for patch plan, before/after evidence, and safety proof.
- Metrics: recall, precision, patch success, safe stops, runtime, and peak memory.
- Execution trace showing scope lock, bounded probes, evidence correlation, patch plans, ephemeral patches, and regression proof.
- Safety contract emphasizing synthetic data, deny-by-default egress, advisory LLM use, ephemeral patches, and human review.

The Run validation button was clicked successfully and updated the run identifier, confirming the API route and client-side refresh flow work. The visible “1 2 Issues” indicator belongs to the Next.js development overlay, not the application UI; production build verification is required before recording the final demo.
