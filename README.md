# AA Mafia Chronicle

**How Ethereum argued its way from ERC-4337 to native account abstraction.**

A longitudinal research report reconstructed from the *AA Mafia* Telegram group — 27,336 messages
from 1,094 accounts, 13 December 2022 to 27 August 2026 — covering who believed what, how positions
moved over time, which events bent the conversation, and where the debate stood at the end of the
dataset.

▶ **[Live site](https://aa-mafia-telegram.netlify.app)** ← update this link after your first deploy

---

## What's in the report

| Section | Contents |
| --- | --- |
| **Overview** | Activity chart, executive summary, dataset facts |
| **Timeline** | 8 eras derived from the discussion itself, 36 analyzed periods |
| **Turning points** | 14 moments after which the conversation materially changed, each with a before/after |
| **Stakeholders** | 68 profiles with dated position timelines and explicit change labels (softened / reversed / unchanged …) |
| **Proposals** | 22 histories — ERC-4337, EIP-7702, EIP-3074, RIP-7560, ERC-6900/7579, EIP-8141, EIP-8130 and more — from first appearance to latest status |
| **Debate map** | 8 recurring fault lines with the voices on each side |
| **Position matrix** | Stakeholder × proposal stances; click any cell for reasoning and evidence |
| **Consensus & open questions** | Strong / emerging / weak consensus, separated from 13 unresolved disagreements |
| **Where things stand** | State of play on 2026-08-27, labeled *observed* vs *inference* |

Roughly 1,880 claims carry Telegram message-ID citations. Hover a `#id` chip for sender and date;
clicking opens the message in Telegram (visible to group members only).

## Method, in brief

```
raw export  →  normalization      identities keyed by Telegram user ID, not display name
            →  36 period chunks   busy months split, quiet months merged
            →  period analyses    proposals, positions, disagreements, key moments, images
            →  synthesis          stakeholder timelines, proposal histories, eras, turning points
            →  this report
```

Analytical rules applied throughout: descriptive statements ≠ preferences, speculation ≠ commitment,
questioning ≠ opposition, **silence ≠ agreement**. Positions are dated, so a 2023 opinion is never
presented as a current one. An independent fact-check pass verified 12 high-stakes claims plus a
random citation sample against the raw export.

Full caveats — including affiliation drift, deleted accounts, and the limits of reading one venue of
a multi-venue debate — are in the report's **Method & caveats** section.

## Repository layout

```
index.html      the entire report — HTML, CSS, JS and data in one self-contained file
netlify.toml    publish settings, security headers, hash-routing fallback
```

There is no build step, no dependency install, and no runtime backend. The only external requests
the page makes are to Google Fonts; all content is embedded.

## Deploying

**Netlify — via Git (recommended).** New site → import this repository. `netlify.toml` supplies the
settings, so leave the build command empty and the publish directory as `.`. Every push redeploys.

**Netlify — drag and drop.** Drop the repository folder onto <https://app.netlify.com/drop>.

**Netlify CLI.**

```bash
npm i -g netlify-cli
netlify deploy --prod --dir .
```

**Anywhere else.** Any static host works — GitHub Pages, Cloudflare Pages, S3 — or just open
`index.html` in a browser.

## Viewing locally

```bash
python3 -m http.server 8000    # then open http://localhost:8000
```

Opening the file directly also works; serving it over HTTP simply matches production more closely.

## Source data

The Telegram export and the intermediate analysis files are deliberately **not** published in this
repository (see `.gitignore`); the report is the deliverable. The group is private, so citation
links resolve only for its members.

## Regenerating

The report is assembled from a shell (HTML/CSS), an application script, and a set of JSON datasets
(`stakeholders`, `proposals`, `months`, `eras`, `turning_points`, `consensus`, `open_questions`,
`patterns`, `current_state`, `activity`, `citations`). To revise findings, edit the JSON and rebuild
— `build_site.py` regenerates `index.html` and validates the document structure.

---

*Analysis and report generated with Claude. Findings are traceable to source messages; interpretation
is the author's responsibility.*
