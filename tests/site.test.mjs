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

test('the default route is current state and all 21 routes have renderers', () => {
  assert.ok(/location\.hash\|\|"#\/current"/.test(application), 'empty URLs open current state');
  const routes = application.match(/const routes = \{([^\n]+)\};/);
  assert.ok(routes, 'route table is present');
  const entries = [...routes[1].matchAll(/(?:"([^"]+)"|(\w+)):(\w+)/g)];
  assert.equal(entries.length, 21);
  for (const [, quoted, bare, renderer] of entries) {
    assert.ok(new RegExp(`function ${renderer}\\(`).test(application), `${quoted || bare} has a renderer`);
  }
});

test('8141 and 8130 are separate drafts with distinct evidence and specification dates', () => {
  const current = currentData();
  assert.equal(current.evidenceCutoff, '2026-08-27');
  assert.equal(current.specChecked, '2026-08-28');
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
  assert.match(sidebar, /href="\.\/aa_mafia_chronicle\.html"/);
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

test('the original deployed chronicle is preserved without content changes', () => {
  const archive = readFileSync(new URL('../aa_mafia_chronicle.html', import.meta.url), 'utf8');
  const hash = createHash('sha256').update(archive.replace(/\r\n/g, '\n')).digest('hex');
  // index.html from the original main commit, 493e4e1, with normalized line endings.
  assert.equal(hash, '263f6d9ab55aa485d2b8e847ae0a0e9a1d2eae096b8f10d18ac5d0771275012b');
});
