# Native AA Guide

**An [EthCoordinate](https://ethcoordinate.org) initiative.**

An educational guide to native account abstraction on Ethereum, built on top of an evidence-linked research record. The guide explains what **frame transactions (EIP-8141)** and **keystore accounts (EIP-8130)** are, what they add beyond ERC-4337 and EIP-7702, where to deploy and test them, and what is being built on top. The research record preserves what is being decided, who has said what, where agreement ends, and which work could unlock progress.

[Production site](https://aabstraction.netlify.app/)

## Inside the site

| Group | Pages | Purpose |
| --- | --- | --- |
| Learn | Start here · What are frames? · Beyond 7702 and 4337 · Keystore accounts · Trade-offs · Where to test · What is being built | Plain-language answers first, mechanics one level deeper, every post-cutoff fact linked to a public source |
| Discussion | Shared goals · Open questions · Proposals · Debate map | Shared goals and constraints, unresolved questions with the competing arguments, every tracked proposal, and the fault lines beneath the choice |
| Research record | Decision map · Position matrix · Stakeholders | The decision boundary at the discussion cutoff, the latest observed position of 25 participants on both proposals with dates, reasoning, confidence and citations, and 68 longitudinal profiles |
| Background | How we got here · Turning points · Historical overview · the full archives | How the community argued its way from ERC-4337 to native AA |
| About | Sources & method | The evidence clocks, how to read the research record, classification rules, corrections and known limits |
| Search | One search across guide pages and sections, resources, milestones, people, proposals, questions, findings, turning points and timeline periods; every hit links to the section where it lives |

## Three evidence clocks

The site keeps three kinds of fact apart, each with its own date:

- **Protocol mechanics** come from the official EIP pages (EIP-7702, EIP-8141, EIP-8130, EIP-7906 and the withdrawn EIP-7701) and were checked on 2 September 2026. They live in the `CURRENT` object.
- **Fork status, deployments and tooling** come from public sources: All Core Developers call notes, the EIP pages for the companion drafts (EIP-8250, EIP-8272, EIP-8369, EIP-7805, EIP-7851, EIP-8202), client and reference repositories, Base's documentation and announcement, and public RPC endpoints queried directly. They live in the `PROTOCOL` object with a link per claim and were checked on 8 September 2026. They never feed the research record.
- **Discussion evidence ends 27 August 2026.** Source: the AA Mafia Telegram export, 30,847 records including 27,336 user messages from 1,094 accounts. Every stakeholder position, consensus finding and open question cites messages from this export.

Both 8141 and 8130 are Draft Core EIPs. The research record is a dated snapshot of one discussion venue; the guide pages report fork status as public sources record it after the cutoff. Neither implies a winner of the design debate.

## Evidence and corrections

Every current position separates explicit statements, strong inference, tentative interpretation and insufficient evidence. Discussing a proposal, sharing a link, building a tool or appearing on an author list does not by itself count as support for the whole proposal. Silence is not agreement. Positions are the latest explicit statement before the cutoff; views can change afterwards, and a later public statement always supersedes what is recorded here.

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

**Limits:** this chat is one coordination venue, not the whole Ethereum community. Unknown stances remain unknown. Plans are not adoption evidence, common goals are not implementation agreement, and draft specifications can change after the review date. Endpoints and repositories listed on the testing page can move or disappear; listing is not an endorsement and says nothing about audit status.

## Reading-first interface

The presentation follows [Emil Kowalski's Design Engineering](https://github.com/emilkowalski/skills/blob/d23d7f88a2e21c9e4b1418c7abe420f5c1052ba7/skills/emil-design-eng/SKILL.md) and [Apple Design](https://github.com/emilkowalski/skills/blob/d23d7f88a2e21c9e4b1418c7abe420f5c1052ba7/skills/apple-design/SKILL.md) guidance: restraint, a clear type hierarchy, the common path first, and detail one level deeper. The site is a single standalone file with no build step and no dependency other than Google Fonts.

Each guide page opens with a short answer, then the mechanics, then onward links. A site-wide search sits at the top of the navigation; press `/` to focus it, and on phones the header has a Search button. The proposal archive and the matrix keep their local filters. Profiles, the 7702 explainer, the guide pages and the comparison deep dives keep their full detail in expandable sections.

The header carries the guide's mark, two A's on one crossbar, drawn once as an inline SVG symbol and reused as the favicon, and names the guide as an EthCoordinate initiative. Every page ends with a footer that repeats the mark and links EthCoordinate, so the attribution also survives printing, which drops the navigation.

Each list page names its navigation group above the title. The matrix has striped rows; above 1100px its header stays visible while the page scrolls, and at narrower widths the stakeholder column stays pinned while the table scrolls sideways. Appearance can follow the system or use the light or dark theme; a print stylesheet drops the navigation. Navigation has no decorative animation, and reduced-motion preferences disable press effects.

## Repository layout

```text
index.html                  the guide and the research record: HTML, CSS, JavaScript and embedded data
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

The tests check JavaScript syntax, all eleven embedded datasets, the 27 route renderers, source metadata for every cited message, the sourcing of every protocol milestone and resource, the guide pages' key content and deep links, the sidebar destinations, dark-mode link contrast, publication metadata, search normalization and ranking, disclosure metadata, mobile menu markup and narrow-screen column sizing. A data fingerprint guards the datasets, the `CURRENT` and `PROTOCOL` objects and the citation metadata against accidental edits; update it deliberately, and only together with a source review. Tests do not prove an analytical claim on their own.

Also run the [browser checklist](tests/BROWSER_CHECKS.md) at desktop and mobile widths. Static assertions alone do not prove layout or interaction behavior.

## Updating the site

There is no generator in this repository. Edit `index.html` directly.

- Protocol mechanics live in `CURRENT.proposals`; advance `CURRENT.specChecked` only after re-reading the drafts.
- Fork status, milestones, companion drafts and testing resources live in `PROTOCOL`; every entry needs a public `https` source, and `PROTOCOL.checked` should move with each verification pass. Re-query the RPC endpoints listed on the testing page when you update it.
- The research record lives in the JSON data blocks and in `CURRENT.positions`, `CURRENT.consensus`, `CURRENT.questions` and `CURRENT.signals`. Add verified sender and date metadata whenever you introduce a citation, keep current and historical classifications separate, advance the evidence date only after a corresponding source review, and keep facts that postdate the chat cutoff in `PROTOCOL`, not in the record.

## Delivery

Submit changes through a pull request against `main`. The existing Netlify configuration publishes the root directory with no build command; the production site is [aabstraction.netlify.app](https://aabstraction.netlify.app/). Merging and deployment are separate from preparing a PR.

---

The original report was generated with Claude; this edition re-verifies the analysis against the export and the official specifications and adds the educational layer. Interpretations are a coordination aid, not a protocol recommendation.
