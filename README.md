# AA Coordination Map

An evidence-linked map of Ethereum's account abstraction debate, centered on **EIP-8141** and **EIP-8130**. It explains what is being decided, who has said what, where agreement ends, and which research or implementation work could unlock progress.

[Production site](https://aabstraction.netlify.app/)

## What "current" means

The site keeps two evidence clocks apart:

- **Chat evidence ends 27 August 2026.** Source: the AA Mafia Telegram export, 30,847 records including 27,336 user messages from 1,094 accounts. Every stakeholder position, consensus finding and open question cites messages from this export.
- **Protocol facts were checked on 2 September 2026** against the official [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702), [EIP-8141](https://eips.ethereum.org/EIPS/eip-8141), [EIP-8130](https://eips.ethereum.org/EIPS/eip-8130), [EIP-7906](https://eips.ethereum.org/EIPS/eip-7906) and [EIP-7701](https://eips.ethereum.org/EIPS/eip-7701) pages, the revision history of the EIP repository, and public reports of the All Core Devs Execution call of 27 August 2026.

Both 8141 and 8130 are Draft Core EIPs. Hours after the chat export ends, the core-dev call moved EIP-8141 from Considered for Inclusion to Scheduled for Inclusion for the Hegotá upgrade. The site records that as a dated protocol update, separate from the chat evidence, because no participant had discussed it yet. No winner of the design debate is implied.

## Inside the site

| Section | Purpose |
| --- | --- |
| Current state | The decision boundary, the two proposals, protocol updates since the cutoff, recent changes and possible next steps |
| 8141 vs 8130 | Mechanisms, assumptions, benefits, tradeoffs, ERC-4337 relationships and convergence hypotheses |
| Why 7702 was not full AA | A plain-language explanation of what delegation solved, what the original key still controls, and what the new drafts add |
| Position matrix | The latest observed position of 25 participants on both proposals, with dates, reasoning, confidence and citations |
| Consensus | Shared goals and constraints, emerging convergence and proposal-specific motion |
| Open questions | Ten evidence-linked questions, the opposing arguments and the work that could settle them |
| Stakeholders, proposals and debate map | Current-first summaries with the longitudinal record still available |
| Historical context | Direct pages for the overview, timeline, turning points, profiles, proposals, debates, matrix, consensus and earlier questions |
| Method & caveats | Evidence clocks, classification rules, corrections and known limits |
| Search | One search across pages, people, proposals, questions, findings, turning points and timeline periods; every hit links to the section where it lives |

## Evidence and corrections

Every current position separates explicit statements, strong inference, tentative interpretation and insufficient evidence. Discussing a proposal, sharing a link, building a tool or appearing on an author list does not by itself count as support for the whole proposal. Silence is not agreement.

Telegram citation chips link to the source message and show its sender and date on hover or keyboard focus. The group is private, so the links require membership. The raw export and the intermediate analysis are deliberately not included in this repository.

Corrections made in the September 2026 verification pass:

- Pedro (WalletConnect) led EIP-8141 advocacy in spring 2026 and called EIP-8130 the most mature option on 20 August. The archive had described the opposite trajectory and attributed his quote to Chris.
- frangio shared the EIP-8141 draft in the group; he is not an author. The draft's authors are listed on each proposal page.
- Chris (Base) is identified as Chris Hunter, the sole listed author of EIP-8130.
- Nethermind's August implementation and headliner support reached the chat as a screenshot of Ben Adams's post. The archive now says so wherever it cites that message.
- Ben Adams, Norswap and Filip were added to the position matrix. Their 2026 statements were explicit but had been left out.
- Several matrix cells were relabeled to match the cited messages more closely (Pedro, Joe Pegler, Georgios Konstantopoulos, tdubb, accountless), and Toni Wahrstätter is noted as an EIP-8141 co-author.
- Sender and date metadata was added for 189 cited messages that previously rendered without it. Three cited IDs are Telegram membership events without text and stay unlabeled.
- The historical matrix note that matt's anti-enshrinement case "went unrebutted" was corrected; Joe Pegler answered it without resolution.
- Fragmentary or unclear sentences across the current pages and the archive summaries were rewritten for clarity. No dates, message IDs, names or numbers were changed except where a correction above required it.

Earlier corrections stand: EIP-8130 is analyzed apart from Tempo and EIPs 8202, 8221, 8223 and 8224; post-transaction assertions belong to the companion EIP-7906, not to the EIP-8141 core draft; Base's September rollout is an announced target, not an observed deployment; EIP-7702 is described as an AA enabler and deployed bridge, not as a failed upgrade.

**Limits:** this chat is one coordination venue, not the whole Ethereum community. Unknown stances remain unknown. Plans are not adoption evidence, common goals are not implementation agreement, and draft specifications can change after the review date.

## Reading-first interface

The presentation follows [Emil Kowalski's Design Engineering](https://github.com/emilkowalski/skills/blob/d23d7f88a2e21c9e4b1418c7abe420f5c1052ba7/skills/emil-design-eng/SKILL.md) and [Apple Design](https://github.com/emilkowalski/skills/blob/d23d7f88a2e21c9e4b1418c7abe420f5c1052ba7/skills/apple-design/SKILL.md) guidance: restraint, a clear type hierarchy, the common path first, and detail one level deeper. The site is a single standalone file with no build step and no dependency other than Google Fonts.

A site-wide search sits at the top of the navigation; press `/` to focus it, and on phones the header has a Search button. It indexes every page, profile, proposal, question, finding, turning point and timeline period, updates as you type, and links each hit to the section where it lives. The proposal archive and the matrix keep their local filters. Profiles, the 7702 explainer and the comparison deep dives keep their full detail in expandable sections.

Each list page names its navigation group above the title. The matrix has striped rows; above 1100px its header stays visible while the page scrolls, and at narrower widths the stakeholder column stays pinned while the table scrolls sideways. Facts checked after the chat cutoff sit in one labeled block on the pages that use them. Appearance can follow the system or use the light or dark theme; a print stylesheet drops the navigation. Navigation has no decorative animation, and reduced-motion preferences disable press effects.

## Repository layout

```text
index.html                  the coordination map: HTML, CSS, JavaScript and embedded data
netlify.toml                static publishing settings and security headers
tests/site.test.mjs         dependency-free regression checks
tests/BROWSER_CHECKS.md     repeatable UI verification checklist and local results
```

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

The tests check JavaScript syntax, all eleven embedded datasets, the 22 route renderers, source metadata for every cited message, the 7702 and historical sidebar destinations, dark-mode link contrast, publication metadata and the dated protocol updates. Presentation checks cover the search field and route, search normalization, ranking and highlighting, disclosure metadata, mobile menu markup and narrow-screen column sizing. A data fingerprint guards the analysis against accidental edits; update it deliberately, and only together with a source review. Tests do not prove an analytical claim on their own.

Also run the [browser checklist](tests/BROWSER_CHECKS.md) at desktop and mobile widths. Static assertions alone do not prove layout or interaction behavior.

## Updating the report

There is no generator in this repository. Edit `index.html` directly. The JSON data blocks hold the longitudinal record; the `CURRENT` object and the current-view renderers hold the analytical layer. Add verified sender and date metadata whenever you introduce a citation. Keep current and historical classifications separate, and advance either evidence date only after a corresponding source review. Record facts that postdate the chat cutoff in `CURRENT.protocolUpdates` with a date and sources, never inside the chat-evidence layer.

## Delivery

Submit changes through a pull request against `main`. The existing Netlify configuration publishes the root directory with no build command; the production site is [aabstraction.netlify.app](https://aabstraction.netlify.app/). Merging and deployment are separate from preparing a PR.

---

The original report was generated with Claude; this edition re-verifies the analysis against the export and the official specifications. Interpretations are a coordination aid, not a protocol recommendation.
