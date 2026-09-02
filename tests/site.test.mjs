import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext, Script } from 'node:vm';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)];
const application = scripts.filter(([, attrs]) => !attrs.includes('application/json')).map(([, , body]) => body).join('\n');
const datasets = Object.fromEntries(scripts.flatMap(([, attrs, body]) => {
  const id = attrs.match(/id="data-([^"]+)"/);
  return id ? [[id[1], JSON.parse(body)]] : [];
}));

function currentData() {
  const match = application.match(/const CURRENT = (\{[\s\S]*?\n\});/);
  assert.ok(match, 'the homepage must include the current analytical layer');
  return runInNewContext(`(${match[1]})`, Object.create(null), { timeout: 1000 });
}

test('homepage JavaScript compiles and all eleven embedded datasets parse', () => {
  assert.doesNotThrow(() => new Script(application));
  assert.deepEqual(Object.keys(datasets).sort(), [
    'activity', 'citations', 'consensus', 'current_state', 'eras', 'months',
    'open_questions', 'patterns', 'proposals', 'stakeholders', 'turning_points',
  ]);
});

test('the default route is current state and all 22 routes have renderers', () => {
  assert.ok(/location\.hash\|\|"#\/current"/.test(application), 'empty URLs open current state');
  const routes = application.match(/const routes = \{([^\n]+)\};/);
  assert.ok(routes, 'route table is present');
  const entries = [...routes[1].matchAll(/(?:"([^"]+)"|(\w+)):(\w+)/g)];
  assert.equal(entries.length, 22);
  for (const [, quoted, bare, renderer] of entries) {
    assert.ok(new RegExp(`function ${renderer}\\(`).test(application), `${quoted || bare} has a renderer`);
  }
});

test('8141 and 8130 are separate drafts with distinct evidence and specification dates', () => {
  const current = currentData();
  assert.equal(current.evidenceCutoff, '2026-08-27');
  assert.equal(current.specChecked, '2026-09-02');
  for (const number of [8141, 8130]) {
    const proposal = current.proposals[`eip-${number}`];
    assert.equal(proposal.url, `https://eips.ethereum.org/EIPS/eip-${number}`);
    assert.match(proposal.status, /Draft/);
    assert.ok(proposal.mechanism.length && proposal.tradeoffs.length && proposal.unresolved.length);
  }
});

test('current analytical citations and the 7702 explainer have dated source metadata', () => {
  const current = currentData();
  const supplement = application.match(/Object\.assign\(D\.citations,(\{[\s\S]*?\n\})\);/);
  assert.ok(supplement, 'verified supplementary citation metadata is present');
  const citations = { ...datasets.citations, ...runInNewContext(`(${supplement[1]})`, Object.create(null), { timeout: 1000 }) };
  const ids = new Set();
  function collect(value, key = '') {
    if (Array.isArray(value)) {
      if (/ids$/i.test(key)) value.forEach(id => ids.add(id));
      else value.forEach(item => collect(item));
    } else if (value && typeof value === 'object') {
      Object.entries(value).forEach(([name, child]) => collect(child, name));
    }
  }
  collect(current);
  const explainer = application.slice(application.indexOf('function v7702Explainer()'), application.indexOf('function vComparison()'));
  assert.ok(explainer.includes('Why EIP-7702 was not full Account Abstraction'), 'the 7702 explanation is included');
  for (const [, list] of application.matchAll(/cite\(\[([\d,\s]+)\]\)/g)) {
    list.split(',').forEach(id => ids.add(Number(id.trim())));
  }
  assert.ok(ids.size > 30, 'meaningful current evidence coverage');
  for (const id of ids) {
    assert.ok(citations[id]?.[1], `message ${id} has a sender`);
    assert.match(citations[id][0], /^\d{4}-\d{2}-\d{2}$/, `message ${id} has a date`);
    assert.ok(citations[id][0] <= current.evidenceCutoff, `message ${id} is within the discussion cutoff`);
  }
  for (const person of current.positions) {
    for (const key of ['p8141', 'p8130']) {
      const position = person[key];
      assert.ok(position.label && position.note && position.basis, `${person.name} has an explained classification`);
      if (position.basis === 'unknown') assert.equal(position.ids.length, 0);
      else assert.ok(position.ids.length, `${person.name}'s ${key} position requires evidence`);
    }
  }
});

test('7702 and every historical archive have direct sidebar destinations', () => {
  const sidebar = html.match(/<nav\b[^>]*id="sidebar"[\s\S]*?<\/nav>/)?.[0];
  assert.ok(sidebar);
  for (const route of [
    '7702', 'overview', 'history-timeline', 'history-turning-points',
    'history-stakeholders', 'history-proposals', 'history-debates',
    'history-matrix', 'history-consensus', 'history-questions',
  ]) assert.ok(sidebar.includes(`href="#/${route}"`), `${route} is directly discoverable`);
});

test('dark-mode links use the accessible accent with at least 4.5:1 panel contrast', () => {
  assert.ok(/a,\s*a:visited\s*\{\s*color:var\(--accent-ink\)/.test(html), 'links use the readable theme color');
  const dark = html.match(/:root\[data-theme="dark"\]\{([\s\S]*?)\n\}/)?.[1];
  assert.ok(dark);
  function luminance(name) {
    const hex = dark.match(new RegExp(`--${name}:#([a-f0-9]{6})`))?.[1];
    assert.ok(hex);
    const rgb = hex.match(/../g).map(part => parseInt(part, 16) / 255)
      .map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
  }
  const values = [luminance('accent-ink'), luminance('panel')].sort((a, b) => b - a);
  assert.ok((values[0] + 0.05) / (values[1] + 0.05) >= 4.5);
});

test('publication metadata and a JavaScript-disabled explanation are retained', () => {
  assert.ok(/<meta property="og:title" content="AA Coordination Map/.test(html), 'sharing metadata names the new edition');
  assert.ok(/<noscript>[\s\S]*?JavaScript[\s\S]*?<\/noscript>/.test(html), 'a no-JavaScript explanation is present');
  assert.ok(!html.includes('It was not deployed, published or pushed'), 'publication wording is accurate');
  const config = readFileSync(new URL('../netlify.toml', import.meta.url), 'utf8');
  assert.match(config, /connect-src 'none'/);
  assert.match(config, /publish = "\."/);
});

test('the analytical data and citation metadata match the reviewed baseline', () => {
  const current = currentData();
  const supplement = application.match(/Object\.assign\(D\.citations,(\{[\s\S]*?\n\})\);/);
  const citations = runInNewContext(`(${supplement[1]})`, Object.create(null), { timeout: 1000 });
  const hash = createHash('sha256').update(JSON.stringify({ datasets, current, citations })).digest('hex');
  // Baseline: the verification edition of 2026-09-02 (corrected archive entries, a 25-row matrix,
  // dated protocol updates and complete citation metadata). Update it only together with a source review.
  assert.equal(hash, '455a73ed7ebb7764c03aa4155398cd56a55a1229f31ea13172d4c968b2acc63a');
});

function standaloneFunction(name, context = {}) {
  const source = application.match(new RegExp(`function ${name}\\([^]*?\\n\\}`))?.[0];
  assert.ok(source, `${name} exists`);
  return runInNewContext(`(${source})`, context, { timeout: 1000 });
}

test('directory search is case-insensitive, trims whitespace and handles an empty query', () => {
  const matches = standaloneFunction('matchesQuery');
  assert.equal(matches('EIP-7702 — EOA upgrade', '  eip-7702  '), true);
  assert.equal(matches('Vitalik Buterin', 'BUTERIN'), true);
  assert.equal(matches('EIP-8130', '8141'), false);
  assert.equal(matches('Any stakeholder', '   '), true);
});

test('positions keep stance, latest date and confidence visible, with evidence on demand', () => {
  const render = standaloneFunction('currentPositionCell', {
    esc: value => String(value),
    positionPill: p => `<span>${p.label}</span>`,
    sourceKind: p => `<span>${p.basis}</span>`,
    cite: ids => `<span>source ${ids.join(',')}</span>`,
  });
  for (const person of currentData().positions) {
    for (const key of ['p8141', 'p8130']) {
      const position = person[key];
      const output = render(position);
      assert.ok(/<details\b[^>]*class="position-cell"/.test(output));
      assert.ok(!/<details\b[^>]*\bopen\b/.test(output), 'closed by default');
      const summary = output.match(/<summary>([^]*?)<\/summary>/)?.[1] || '';
      assert.ok(summary.includes(position.label));
      assert.ok(summary.includes(position.basis), 'confidence is not hidden');
      if (position.date !== '—') assert.ok(summary.includes(position.date));
      assert.ok(output.includes(position.note), 'reasoning is preserved');
      for (const id of position.ids) assert.ok(output.includes(String(id)));
    }
  }
});

test('small screens have a collapsed navigation menu with an accessible control', () => {
  const button = html.match(/<button\b[^>]*id="menu-toggle"[^>]*>/)?.[0] || '';
  assert.ok(button.includes('aria-expanded="false"'));
  assert.ok(button.includes('aria-controls="sidebar"'));
  assert.ok(application.includes('function setMenuOpen('));
  assert.ok(application.includes('"Escape"'), 'keyboard users can dismiss the menu');
  assert.ok(/\.sidebar:not\(\.is-open\)\s*\{\s*display:none/.test(html), 'navigation is initially collapsed on small screens');
});

test('native reading disclosures and local search remain dependency-free', () => {
  assert.ok(application.includes('function foldSection('));
  assert.ok(application.includes('function bindDirectorySearch('));
  assert.ok(application.includes('data-directory-item'));
  assert.ok(html.includes('prefers-reduced-motion:reduce'));
  assert.ok(!/transition:\s*all\b/.test(html), 'no indiscriminate layout animation');
  assert.ok(html.includes('aria-current'), 'current page is exposed to assistive technology');
});

test('small-screen stakeholder columns can shrink below long stance labels', () => {
  assert.ok(/\.stakeholder-list\{[^}]*grid-template-columns:minmax\(0,1fr\)/.test(html));
  assert.ok(/\.stakeholder-row\{[^}]*grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/.test(html));
});

test('compact archive records retain descriptions, dated status and full-history links', () => {
  const render = standaloneFunction('proposalArchiveRow', { esc: value => String(value), MOM: {} });
  const proposals = datasets.proposals.filter(p => !currentData().proposals[p.id]);
  assert.equal(proposals.length, 20);
  for (const proposal of proposals) {
    const output = render(proposal);
    assert.ok(output.includes('<details class="directory-row"'));
    assert.ok(output.includes(proposal.name));
    assert.ok(output.includes(proposal.what));
    assert.ok(output.includes(proposal.first.date));
    assert.ok(output.includes(proposal.status.as_of));
    assert.ok(output.includes(`href="#/proposals/${proposal.id}"`));
  }
});

test('every cited message resolves to a sender and date, except three membership events', () => {
  const supplement = application.match(/Object\.assign\(D\.citations,(\{[\s\S]*?\n\})\);/);
  const citations = { ...datasets.citations, ...runInNewContext(`(${supplement[1]})`, Object.create(null), { timeout: 1000 }) };
  const ids = new Set();
  const collect = (value, key = '') => {
    if (Array.isArray(value)) {
      if (/ids$/i.test(key)) value.forEach(id => { if (Number.isInteger(id)) ids.add(id); });
      else value.forEach(item => collect(item));
    } else if (value && typeof value === 'object') {
      Object.entries(value).forEach(([name, child]) => collect(child, name));
    } else if (typeof value === 'string') {
      for (const [, group] of value.matchAll(/\[(\d{2,6}(?:\s*[,;–-]\s*\d{2,6})*)\]/g)) {
        group.split(/[,;–-]/).map(x => Number(x.trim())).filter(x => x > 1 && x < 40000).forEach(x => ids.add(x));
      }
    }
  };
  for (const [name, data] of Object.entries(datasets)) if (name !== 'citations' && name !== 'activity') collect(data);
  collect(currentData());
  for (const [, list] of application.matchAll(/cite\(\[([\d,\s]+)\]\)/g)) list.split(',').forEach(id => ids.add(Number(id.trim())));
  assert.ok(ids.size > 2000, 'the archive and the current layer cite thousands of messages');
  const unresolved = [...ids].filter(id => !citations[id]).sort((a, b) => a - b);
  // These three IDs are Telegram membership events without text; they stay cited but carry no sender.
  assert.deepEqual(unresolved, [12045, 18919, 32020]);
});

test('the current matrix has 25 profiled participants and dated, sourced protocol updates', () => {
  const current = currentData();
  assert.equal(current.positions.length, 25);
  for (const person of current.positions) {
    assert.ok(datasets.stakeholders.some(s => s.id === person.id), `${person.name} has a longitudinal profile`);
  }
  assert.ok(current.protocolUpdates.length >= 2, 'facts checked after the chat cutoff are recorded separately');
  for (const update of current.protocolUpdates) {
    assert.match(update.date, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(update.date >= current.evidenceCutoff, 'protocol updates never predate the chat cutoff');
    assert.ok(update.kind && update.text.length > 40);
    assert.ok(update.sources.length >= 1);
    for (const [label, href] of update.sources) assert.ok(label && /^https:\/\//.test(href), 'every update names a public source');
  }
  assert.ok(/function protocolUpdatesHtml\(/.test(application), 'protocol updates are rendered apart from chat evidence');
  for (const key of ['eip-8141', 'eip-8130']) assert.ok(current.proposals[key].authors.length > 10, `${key} lists its official authors`);
});

test('search normalizes accents and case, ranks titles first and highlights safely', () => {
  const searchNorm = standaloneFunction('searchNorm');
  assert.equal(searchNorm('Łukasz Rozmej — EIP-8141'), 'lukasz rozmej — eip-8141');
  const searchTerms = standaloneFunction('searchTerms', { searchNorm });
  assert.deepEqual([...searchTerms('  Frame   TX ')], ['frame', 'tx']);
  const rankSearch = standaloneFunction('rankSearch', { searchNorm, searchTerms, SEARCH_TYPE_WEIGHT: { Page: 10, Stakeholder: 8, 'Key moment': 0 } });
  const mk = (type, title, text) => { const hay = searchNorm(`${title} ${text}`); return { type, title, text, href: '#', meta: '', hay, hay2: hay.replace(/-/g, '') }; };
  const items = [
    mk('Key moment', 'A moment about mempool rules', 'mempool mempool'),
    mk('Page', 'Position matrix', 'positions on 8141'),
    mk('Stakeholder', 'Vitalik Buterin', 'author of EIP-8141'),
  ];
  assert.deepEqual([...rankSearch(items, 'matrix')].map(i => i.title), ['Position matrix']);
  assert.deepEqual([...rankSearch(items, 'MEMPOOL')].map(i => i.title), ['A moment about mempool rules']);
  assert.deepEqual([...rankSearch(items, '8141')].map(i => i.title), ['Position matrix', 'Vitalik Buterin'], 'pages outrank profiles at equal relevance');
  assert.deepEqual([...rankSearch(items, 'eip8141')].map(i => i.title), ['Vitalik Buterin'], 'dashes in EIP numbers are optional');
  assert.equal(rankSearch(items, 'vitalik matrix').length, 0, 'every term must match');
  assert.equal(rankSearch(items, '   ').length, 0);
  const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const highlight = standaloneFunction('highlight', { searchNorm, esc: escape });
  assert.equal(highlight('Frames <b>and</b> keystores', ['frame'], 170), '<mark>Frame</mark>s &lt;b&gt;and&lt;/b&gt; keystores');
  const long = 'x '.repeat(200) + 'needle in the haystack ' + 'y '.repeat(200);
  const windowed = highlight(long, ['needle'], 120);
  assert.ok(windowed.startsWith('…') && windowed.endsWith('…'), 'long text is windowed around the first hit');
  assert.ok(windowed.includes('<mark>needle</mark>') && windowed.length < 200);
});

test('the shell has a search field, a small-screen search control and a search route with anchored targets', () => {
  const sidebar = html.match(/<nav\b[^>]*id="sidebar"[\s\S]*?<\/nav>/)[0];
  assert.match(sidebar, /<input id="site-search" type="search"/);
  assert.match(sidebar, /<label class="visually-hidden" for="site-search">/);
  assert.match(html, /<a class="btn" id="search-toggle" href="#\/search">/);
  assert.ok(/function vSearch\(/.test(application) && /function searchIndex\(/.test(application));
  for (const marker of ["id='hq-${i}'", 'id="tp-${', 'id="era-${esc(e.id)}"', 'id="month-${esc(m.key)}"', 'id="axis-${i}"', 'id="haxis-${i}"', "id='hc-${cls}-${i}'", "id='pattern-${i}'", 'id="protocol-updates"', 'id="question-${q.id}"']) {
    assert.ok(application.includes(marker), `search results can target ${marker}`);
  }
  assert.match(application, /const ANCHOR_ROUTES=new Set\(/);
  assert.match(html, /\.route-kicker\{/);
});
