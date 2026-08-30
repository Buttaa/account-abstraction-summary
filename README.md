# AA Coordination Map

An evidence-linked map of Ethereum's current Account Abstraction design space, centered on **EIP-8141** and **EIP-8130**. It explains what is being decided, who has said what, where agreement ends, and which research or implementation work could unlock progress.

[Production site](https://aabstraction.netlify.app/) · [Original chronicle](https://aabstraction.netlify.app/aa_mafia_chronicle.html)

## What “current” means

- **Discussion cutoff:** 27 August 2026, from the AA Mafia Telegram export: 30,847 records, including 27,336 user messages from 1,094 accounts.
- **Specification review:** 28 August 2026, against the official [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702), [EIP-8141](https://eips.ethereum.org/EIPS/eip-8141), and [EIP-8130](https://eips.ethereum.org/EIPS/eip-8130) pages.
- This is a dated snapshot, not a live feed. Both 8141 and 8130 are presented as Draft Core EIPs at the review date. No winner or Ethereum-wide implementation consensus is implied.

These two dates are deliberately separate: a later specification is not evidence of what someone supported earlier.

## Inside the site

| Section | Purpose |
| --- | --- |
| Current state | The decision boundary, active proposals, recent changes and possible next steps |
| 8141 vs 8130 | Mechanisms, protocol assumptions, benefits, tradeoffs, ERC-4337 relationships and convergence hypotheses |
| Why 7702 was not full AA | A plain-language explanation of what delegation solved, what the original root key still controls, and what the new drafts add |
| Position matrix | Latest observed positions on both current proposals, with dates, reasoning, confidence and citations |
| Consensus | Shared goals and constraints, emerging implementation agreement and proposal-specific motion |
| Open questions | Ten evidence-linked questions, opposing arguments and work that could resolve them |
| Stakeholders, proposals and debate map | Current-first summaries with the longitudinal record still available |
| Historical context | Direct sidebar pages for the overview, timeline, turning points, profiles, proposals, debate, matrix, consensus and earlier questions |
| Method & caveats | Evidence clocks, classification rules, corrections and known limits |

The original chronicle is also retained as a separate, **unrevised historical reference**. Its earlier classifications and summaries should not override the current edition.

## Evidence and corrections

Every current position separates explicit statements, interpretation and insufficient evidence. Discussing a proposal, sharing a link, building a tool or appearing on an author list is not automatically classified as whole-proposal support. Silence is not agreement.

Telegram citation chips link to the source message and show its sender and date on hover. The group is private, so those links require membership. The raw export and intermediate analysis are deliberately not included in this repository.

Notable corrections in this edition:

- EIP-8130 is analyzed separately from Tempo and EIPs 8202/8221/8223/8224.
- Post-transaction assertions are not presented as part of the current EIP-8141 core draft; EIP-7906 is identified as a companion.
- frangio is not identified as EIP-8141's author.
- Pedro's latest explicit preference remains EIP-8130; later link sharing is not treated as a reversal.
- Base's September rollout is an announced target, not a completed deployment at the cutoff.
- EIP-7702 is described as an AA enabler and deployed bridge, not as a failed or worthless upgrade.
- Dark-mode links use a readable accent; historical material has direct navigation rather than only bottom-of-page expanders.
- Missing sender/date metadata for 25 additional analytical citations was checked against the local export and restored during PR preparation.

**Limits:** this chat is one coordination venue, not the whole Ethereum community. Unknown stances remain unknown. Plans are not adoption evidence, common goals are not implementation agreement, and draft specifications can change after the review date.

## Repository layout

```text
index.html                  current coordination map: HTML, CSS, JavaScript and embedded data
aa_mafia_chronicle.html      unchanged original deployed chronicle
netlify.toml                existing static publishing settings and security headers
tests/site.test.mjs         dependency-free regression checks
```

The site retains its original standalone architecture: no build step, dependency install or runtime backend. Google Fonts is the only external content dependency; the report itself is embedded. The homepage metadata and JavaScript-disabled explanation are retained.

## View locally

Run from this repository:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Open [the local homepage](http://127.0.0.1:8000/). Opening `index.html` directly also works.

## Verify changes

With Node.js 18 or later:

```sh
node --test tests/site.test.mjs
git diff --check
```

The tests check JavaScript syntax, all eleven embedded datasets, 21 route renderers, source metadata, the 7702 and historical sidebar destinations, dark-mode link contrast, publication metadata and preservation of the original chronicle. They do not independently prove an analytical claim: claims still require source review.

Also check the changed pages in a real browser, including the current matrix, a citation tooltip, the 7702 explanation and historical navigation at desktop and mobile widths.

## Updating the report

There is no generator included in this repository. Edit `index.html` directly. The original JSON data blocks hold the longitudinal record; the `CURRENT` object and current-view renderers contain the new analytical layer. Add verified sender/date metadata whenever introducing a new citation. Keep current and historical classifications separate, and advance either evidence date only after a corresponding source review.

Do not edit the preserved chronicle to reflect new conclusions. Update the current edition instead.

## Delivery

Submit changes through a pull request against `main`. This repository's existing Netlify configuration publishes the root directory with no build command; the intended production site is [aabstraction.netlify.app](https://aabstraction.netlify.app/). Merging and production deployment are separate from preparing a PR. No new hosting service or deployment pipeline is required.

---

The original report was generated with Claude; this edition refocuses and re-verifies the current design-space analysis. Interpretations are a coordination aid, not a protocol recommendation.
