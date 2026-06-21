/**
 * Lighthouse audit across every page in the sitemap.
 *
 * Discovers URLs from `<base>/sitemap.xml` (so new products/articles are covered
 * automatically), runs Lighthouse on each, and prints a score table plus a
 * consolidated list of issues and the pages they affect.
 *
 * Usage:
 *   pnpm run audit:lighthouse                 # audits the production site
 *   pnpm run audit:lighthouse http://localhost:3000   # audits a local build
 *
 * Requirements: Chrome/Chromium installed. Lighthouse is pulled via `npx` on
 * demand — intentionally NOT a dependency (it's a heavy tree, used only here).
 *
 * Covers: performance, accessibility, best-practices, SEO. It does NOT test
 * offline/PWA or real screen-reader behavior — see docs/ai/skills/audit-lighthouse.md.
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const BASE = (process.argv[2] ?? 'https://basementpickups.com').replace(/\/+$/, '');
const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];
const HEADERS = ['PERF', 'A11Y', 'BP', 'SEO'];

async function sitemapUrls() {
  const res = await fetch(`${BASE}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap fetch failed: ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

function runLighthouse(url, outPath) {
  execFileSync(
    'npx',
    [
      '-y',
      'lighthouse',
      url,
      `--only-categories=${CATEGORIES.join(',')}`,
      '--chrome-flags=--headless=new --no-sandbox',
      '--output=json',
      `--output-path=${outPath}`,
      '--quiet',
      '--max-wait-for-load=60000',
    ],
    { stdio: 'ignore', timeout: 120_000 },
  );
}

function labelFor(url) {
  const p = url.replace(BASE, '').replace(/\/+$/, '');
  return p === '' ? 'home' : p.replace(/^\//, '').replace(/\//g, '_');
}

async function main() {
  const urls = await sitemapUrls();
  console.log(`Auditing ${String(urls.length)} pages from ${BASE}/sitemap.xml\n`);
  const dir = mkdtempSync(path.join(tmpdir(), 'lh-'));
  const rows = [];
  const issues = {};

  for (const url of urls) {
    const name = labelFor(url);
    const out = path.join(dir, `${name}.json`);
    process.stdout.write(`  • ${url} ... `);
    try {
      runLighthouse(url, out);
      const report = JSON.parse(readFileSync(out, 'utf8'));
      const scores = {};
      for (const c of CATEGORIES) {
        scores[c] = report.categories[c]
          ? Math.round((report.categories[c].score ?? 0) * 100)
          : null;
      }
      rows.push({ name, scores });
      for (const c of CATEGORIES) {
        const cat = report.categories[c];
        if (!cat) continue;
        for (const ref of cat.auditRefs) {
          const a = report.audits[ref.id];
          const skip = ['manual', 'notApplicable', 'informative'];
          if (a && a.score !== null && a.score < 1 && !skip.includes(a.scoreDisplayMode)) {
            issues[ref.id] ??= { title: a.title, pages: [] };
            issues[ref.id].pages.push(name);
          }
        }
      }
      console.log('ok');
    } catch (err) {
      console.log('FAILED');
      console.error(`    ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  rmSync(dir, { recursive: true, force: true });

  const head = 'PAGE'.padEnd(36) + HEADERS.map((h) => h.padStart(6)).join('');
  console.log(`\n${head}`);
  for (const row of rows.sort((a, b) => a.name.localeCompare(b.name))) {
    const cells = CATEGORIES.map((c) => String(row.scores[c] ?? '-').padStart(6)).join('');
    console.log(row.name.padEnd(36) + cells);
  }

  console.log('\nISSUES (audit -> pages affected):');
  const entries = Object.entries(issues).sort((a, b) => b[1].pages.length - a[1].pages.length);
  if (entries.length === 0) console.log('  none');
  for (const [id, v] of entries) {
    console.log(`  • ${String(v.pages.length)}/${String(rows.length)}  ${v.title}  (${id})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
