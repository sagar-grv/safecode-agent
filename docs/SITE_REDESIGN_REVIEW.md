# Multi-page redesign review

The new site was inspected locally across `/`, `/evidence`, `/architecture`, and `/submission`.

The root page now leads with the product promise “Nothing ships on a guess,” a proof-lab visual, and six chapter cards. It links judges into the control room, case file, architecture, and judge brief instead of forcing everything into a single dashboard.

The Case File page isolates one vulnerability narrative: baseline exploit, post-patch proof, approved patch strategy, and evidence metrics. The Architecture page presents four connected nodes—bounded input, structured advice, isolated change, and verifier gate—against a dark proof surface. The Judge Brief page maps the competition story into five moments and shows readiness facts alongside the synthetic-data limitation.

The new pages share one shell and one visual language: warm paper background, dark proof field, emerald signal color, oversized editorial headings, thin grid lines, chapter numbering, restrained badges, and a persistent sandbox-only footer.


## Production verification

The production root at https://kavach-sentinel.vercel.app/ now shows the new Proof Lab landing page with the statement “Nothing ships on a guess,” proof-lab visual, chapter navigation, and links to the four deeper pages. The production `/evidence` route shows the focused case-file narrative with BFLA-001, baseline exploit, post-patch proof, approved patch strategy, and evidence metrics. Both routes share the persistent synthetic-demo and sandbox-only framing.


The production `/architecture` route now exposes the dark four-node system map and safety contract. The production `/submission` route now exposes the five-moment judge story, readiness caveat, and links back to the live control room and case file. These routes were verified after the multi-page deployment commit `129f362`.
