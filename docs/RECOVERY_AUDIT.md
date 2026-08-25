# Kavach Sentinel Recovery Audit

## User-reported failure

The current deployment looks AI-generated, is not self-explanatory, presents shallow or broken controls, and does not feel like a real working demo.

## Verified findings

| Area | Verified problem | Required correction |
|---|---|---|
| Control-room run | The CTA waits through four client-side timers and then calls a deterministic fixture endpoint. It does not expose a real sandbox execution trace, input, request payload, or actual before/after verification. | Use one deterministic synthetic scenario that genuinely executes in the app runtime, returns structured stage events, and renders each event as it arrives. Label the scope as synthetic without pretending the run is a production scanner. |
| Run state | The page initially marks all pipeline stages as `DONE`, even before a new run. This makes the control loop visually dishonest. | Initial state must be `READY`; stages must be `QUEUED` until the run reaches them, then `RUNNING`, then `PASSED` or `BLOCKED`. |
| Error handling | The control loop catches API failure and silently replaces it with the same local fixture result. A judge cannot tell whether execution failed. | Show a contextual error state with the failure reason, retry action, and an explicit “no result accepted” state. Never silently fall back to success. |
| Findings | Finding selection works only as local state and is not reflected in the URL. Tabs lack proper tab semantics and are not deep-linkable. | Implement accessible tabs with `aria-selected`, `aria-controls`, keyboard navigation, and query-string state where appropriate. |
| Case file | The UI shows three case-file links, but every link points to `/evidence` and the page always renders `cases[0]`. Clicking BOLA-001 was verified to leave BFLA-001 displayed. | Implement real case selection with stable URLs such as `/evidence?case=BOLA-001` or route segments, and test every case. |
| Copy / explanation | The page leads with manifesto language and jargon before explaining what the judge should do or what the demo actually executes. | Put a plain-language “What this demo does” panel, a 3-step judge path, visible inputs/outputs, and a clear synthetic boundary before decorative storytelling. |
| Visual system | CSS contains legacy light/paper rules followed by appended dark overrides. The resulting page reads as layered styling rather than a deliberate product system. | Replace the cascade patchwork with one small token system and intentional component states. Use cards only where they communicate hierarchy. |
| Buttons / controls | Several controls look interactive but only switch static presentation. There is no visible disabled, failure, retry, or empty state in the main experience. | Every visible control must either navigate, run a real action, change URL-addressable state, or be removed. Add loading, error, empty, and success states. |
| Claims | Synthetic metrics are displayed as if they were run measurements, even though most values are fixed fixtures. | Return run-specific measurements from the executable synthetic scenario and label any benchmark/reference values separately. |

## Rebuild acceptance criteria

1. A first-time judge can understand the demo in under 30 seconds without reading a separate document.
2. The primary action has a clear input, a real output, and a visible execution timeline.
3. No successful state is shown before a run completes.
4. Failure is visible and recoverable; there is no silent success fallback.
5. Every visible button and case selector has a verifiable effect.
6. The case-file selector renders all three seeded cases correctly and preserves the selection in the URL.
7. The synthetic boundary is stated before and after execution: no real systems, no personal data, no external target scanning.
8. The demo proves the security concept through a concrete before/after request and a regression check, not only prose.
9. The UI uses one coherent visual system, with restrained motion tied to state changes.
10. The site passes lint, typecheck, tests, production build, and a browser smoke test for every route and primary interaction.
