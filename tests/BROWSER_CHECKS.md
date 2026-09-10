# Reading-first UI verification

Serve the repository locally and open `index.html`. These browser checks complement `node --test tests/site.test.mjs`; they are not an assistive-technology conformance audit.

## Repeatable checks

1. Open every top-level route: current, frames, 7702, keystore, comparison, build, ecosystem, consensus, questions, proposals, debate-map, decision, matrix, stakeholders, timeline, turning-points, overview, history-timeline, history-turning-points, history-stakeholders, history-proposals, history-debates, history-matrix, history-consensus, history-questions, about and search. Confirm content renders with no script errors.
2. At 320px, confirm the page itself does not scroll sideways. Comparison tables and the code blocks on the testing page may scroll inside their own containers. Repeat the guide pages and the matrix at 768, 1024 and 1440px.
3. On mobile, content appears below the compact header, with navigation initially closed. Open Menu, select a Background page and confirm the menu closes. Reopen it and press Escape. Desktop historical destinations remain directly listed in the sidebar.
4. Activate “Skip to page content” while on a non-default route. It must not change the route. Confirm the current navigation link has `aria-current="page"`.
5. Start page: the six question cards each open the page they name. The milestones list shows a date, a sentence and a source link per row; every source link opens in a new tab. The "Open the decision map" button opens the research record's decision page.
6. Frames page: the three walkthroughs and the mode table are visible without expanding anything; the instruction, gas, mempool and companion sections expand. Each companion card links to its EIP.
7. Beyond 7702 and 4337: the six native-only capabilities and the four-way table appear before the 7702 explanation; every earlier 7702 section and its citations remain available further down, and the "See stakeholder positions" button still opens the matrix.
8. Keystore accounts: the model table and the Base measurement table render; the transaction and lifecycle sections expand.
9. Where to test: both curl blocks are copyable and scroll horizontally on narrow screens; every resource card has a working external link. Optionally run one of the curl commands and compare the chain ID.
10. What is being built: every item carries exactly one maturity label; the footer explains the labels.
11. Trade-offs: the Hegotá decision cards and their source line render between the deep dives and the convergence hypotheses; the buttons open the debate map and the matrix. Both deep dives expand.
12. In the proposal archive, search for `  EIP-7702  `: one of twenty records should remain. Expand it and follow the full-history link. A nonsense query should show a clear empty state; clearing search restores all records.
13. In the matrix, search for `  Vitalik `: one of twenty-five stakeholders should remain. Latest stance, date and evidence confidence remain visible before expansion. Expand a cell to read the reasoning and source links. Unknown is not relabeled as neutral.
14. Matrix scrolling: at a window wider than 1100px, scroll the page and confirm the table header stays at the top of the viewport. Below that width the wrapper scrolls sideways instead, and the stakeholder column must stay pinned to its left edge. Rows are striped at every width.
15. Search current and historical stakeholder directories; exercise archive scope, tier and sort controls. Follow a profile and expand its timeline, evolution, stances and quotations. Confirm current EIP labels remain distinct from the historical record.
16. Filter open questions by each proposal and restore Both proposals. Expand a question and confirm both arguments, status, participants, sources and next evidence are present. Open a consensus finding and a comparison deep dive.
17. Site search: type `paymaster` in the sidebar field. The search page opens while focus stays in the field, results update as you type, hits are grouped by type (Page, Guide section, Stakeholder, Proposal, Resource, Milestone and the archive types) and every hit link opens the section it names, including guide deep links such as `#/frames/mempool-title` and `#/build/ks-tools-title` and record deep links such as `#/consensus/cons-goals-1`. Press `/` on any page to focus the field; on a phone the header Search button opens the search page with its own field focused.
18. Search edge cases: `Łukasz`, `lukasz` and `LUKASZ` return the same results; `eip8141` and `8141` both match EIP-8141 content; a nonsense query shows a clear empty state; an empty field shows the hint list. Groups with more than eight hits offer a "Show all" control.
19. Each list page names its navigation group above the title, and stakeholder directory rows show a one-line affiliation without citation brackets.
20. Test both Appearance themes. Badges, code blocks, stance labels and primary links must remain readable. Inspect native summary semantics, focus styles, accessible source-link labels and the reduced-motion stylesheet.
21. Enter harmless markup-like search text, navigate away and return. It must remain plain search text, not create elements. Search makes no network requests and stores no data.
22. Attribution: on desktop the sidebar shows the AA mark, “Native AA Guide” and “An EthCoordinate initiative”, and the latter opens ethcoordinate.org in a new tab. On phones the compact header shows the same lockup, on one line at 360px and wider. Every page ends with a footer that repeats the mark and links EthCoordinate, and the footer stays in place after filtering the matrix or either stakeholder list. In print preview the navigation is gone but the footer attribution remains. The browser tab shows the AA mark as the favicon.

## Verification, 10 September 2026 (attribution)

- `node --test tests/site.test.mjs`: 21 passed, including a new check that the sidebar, the compact header and the per-page footer name EthCoordinate, that the footer links ethcoordinate.org, that the router appends the footer to every route, and that the favicon carries the same mark.
- Headless Chrome walked 30 routes (every page plus a search query): each rendered exactly one footer with no script errors; the footer stayed after toggling the archive matrix filter, searching the current matrix and both stakeholder lists, filtering the proposal archive and the questions; under print media the sidebar and compact header were hidden and the footer visible.
- At 320px no route scrolled sideways; the compact header stayed at 66px with the name on one line (the caption wraps to two lines below 360px). The sidebar caption sits inside the brand column at 1440px.
- Screenshots of the sidebar (light and dark), the compact header at 320, 360, 390 and 768px, the footer at 1440 and 390px and the favicon at 16 to 180px were inspected.

## Verification, 8 September 2026 (educational edition)

- `node --test tests/site.test.mjs`: 20 passed, including new checks that every protocol milestone and resource carries an https source and that each guide page leads with its question, its key mechanics and onward links.
- A headless jsdom render exercised all 27 routes, six deep links and all 22 proposal pages: no script errors, no empty pages, no leaked placeholder text and no links to unknown routes.
- Headless Chrome screenshots of the start, frames, 7702, keystore, comparison, build, ecosystem and about pages at 1440px, and of the start and build pages at 500px, were inspected: hero, cards, tables, code blocks and folded sections render as intended. Headless Chrome enforces a minimum window width, so the 320px and 390px checks above still need a real browser.
- Both RPC endpoints on the testing page answered `eth_chainId` on the verification date (0x1fcd and 0x509f455).

## Verification, 2 September 2026 (content pass)

- `node --test tests/site.test.mjs`: 16 passed, including two new checks (every cited message resolves to a sender and date except three membership events; the matrix has 25 profiled rows).
- A headless jsdom render exercised all 21 routes, all 68 profile pages, all 22 proposal pages and the 25 current stakeholder views: no script errors, no empty pages, no `undefined` or `[object Object]` text, 25 matrix rows, and every matrix chip carrying sender metadata.

## Local verification, 30 August 2026

- All 21 routes rendered at 320px without page-level horizontal overflow after correcting long-label sizing in the stakeholder directory.
- The key current views, archive and profile layouts were also checked at 768, 1024 and 1440px; desktop and mobile screenshots were inspected.
- Native disclosures, archive and matrix search, empty states, question filtering, mobile-menu dismissal and route retention were exercised in the local browser.
- The rendered current-matrix stance colors measured at least 4.67:1 in light mode and 6.19:1 in dark mode. Link colors remain covered by the regression tests.
- Reduced-motion rules were inspected in source. OS-level motion emulation and a full screen-reader audit were not performed; do not treat this checklist as a WCAG certification.
