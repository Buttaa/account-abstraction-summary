# Reading-first UI verification

Serve the repository locally and open `index.html`. These browser checks complement `node --test tests/site.test.mjs`; they are not an assistive-technology conformance audit.

## Repeatable checks

1. Open every top-level route: current, comparison, 7702, matrix, consensus, questions, stakeholders, proposals, debate-map, about, overview, history-timeline, history-turning-points, history-stakeholders, history-proposals, history-debates, history-matrix, history-consensus, history-questions, timeline and turning-points. Confirm content renders with no script errors.
2. At 320px, confirm the page itself does not scroll sideways. Comparison tables may scroll inside their labeled, focusable regions. Repeat key current pages at 768, 1024 and 1440px.
3. On mobile, content appears below the compact header, with navigation initially closed. Open Menu, select a historical page and confirm the menu closes. Reopen it and press Escape. Desktop historical destinations remain directly listed in the sidebar.
4. Activate “Skip to page content” while on a non-default route. It must not change the route. Confirm the current navigation link has `aria-current="page"`.
5. In the proposal archive, search for `  EIP-7702  `: one of twenty records should remain. Expand it and follow the full-history link. A nonsense query should show a clear empty state; clearing search restores all records.
6. In the matrix, search for `  Vitalik `: one of twenty-five stakeholders should remain. Latest stance, date and evidence confidence remain visible before expansion. Expand a cell to read the reasoning and source links. Unknown is not relabeled as neutral.
7. Search current and historical stakeholder directories; exercise archive scope, tier and sort controls. Follow a profile and expand its timeline, evolution, stances and quotations. Confirm current EIP labels remain distinct from the historical record.
8. Filter open questions by each proposal and restore Both proposals. Expand a question and confirm both arguments, status, participants, sources and next evidence are present. Open a consensus finding and a comparison deep dive.
9. Expand the 7702 mental model, expectations, current-proposal comparison, advantages and continuing-relevance sections. All original text and citations must remain available. Its solved/unsolved distinction stays visible on the main reading path.
10. Test both Appearance themes. Current stance labels and primary links must remain readable. Inspect native summary semantics, focus styles, accessible source-link labels and the reduced-motion stylesheet.
11. Enter harmless markup-like search text, navigate away and return. It must remain plain search text, not create elements. Search makes no network requests and stores no data.

## Verification, 2 September 2026 (content pass)

- `node --test tests/site.test.mjs`: 16 passed, including two new checks (every cited message resolves to a sender and date except three membership events; the matrix has 25 profiled rows).
- A headless jsdom render exercised all 21 routes, all 68 profile pages, all 22 proposal pages and the 25 current stakeholder views: no script errors, no empty pages, no `undefined` or `[object Object]` text, 25 matrix rows, and every matrix chip carrying sender metadata.
- The real-browser checks above were not rerun in this pass because no browser was available to the agent. Layout, disclosures, search and both themes should be spot-checked in a browser before merge, with attention to the three added matrix rows.

## Local verification, 30 August 2026

- All 21 routes rendered at 320px without page-level horizontal overflow after correcting long-label sizing in the stakeholder directory.
- The key current views, archive and profile layouts were also checked at 768, 1024 and 1440px; desktop and mobile screenshots were inspected.
- Native disclosures, archive and matrix search, empty states, question filtering, mobile-menu dismissal and route retention were exercised in the local browser.
- The analytical fingerprint matches content revision `019c270`.
- The rendered current-matrix stance colors measured at least 4.67:1 in light mode and 6.19:1 in dark mode. Link colors remain covered by the regression tests.
- No application warnings or errors were observed in the browser console.
- Reduced-motion rules were inspected in source. OS-level motion emulation and a full screen-reader audit were not performed; do not treat this checklist as a WCAG certification.
