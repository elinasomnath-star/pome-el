// Puppeteer screenshot helper for StratSim tabs
// Usage: node scripts/take_screenshots.mjs
import puppeteer from 'puppeteer';
import { copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DOCS = join(ROOT, 'docs', 'screenshots');
const PUB  = join(ROOT, 'public', 'screenshots');

// Encode as #state=<b64> matching encodeStateToHash() in scenarioManager.js
function hashFor(tabId) {
  const b64 = Buffer.from(JSON.stringify({ t: tabId })).toString('base64');
  return `state=${b64}`;
}

const SHOTS = [
  { tabId: 'org',         file: '07_org_scalar_chain.png',    waitText: 'Organizational Architecture' },
  { tabId: 'validation',  file: '11_empirical_validation.png', waitText: 'Empirical Plausibility' },
  { tabId: 'methodology', file: '12_methodology_export.png',   waitText: 'Brand Logo Credits' },
];

async function capture(browser, shot) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const url = `http://localhost:5173/#${hashFor(shot.tabId)}`;
  console.log(`  → navigating to ${url}`);
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

  // Poll until the target heading text appears (React effect fires, hero dismissed)
  const found = await page.waitForFunction(
    (text) => document.body.innerText.includes(text),
    { timeout: 15000, polling: 300 },
    shot.waitText
  ).catch(() => null);

  if (!found) {
    console.warn(`  ⚠ "${shot.waitText}" not found — saving anyway`);
  } else {
    console.log(`  ✓ heading found`);
  }

  // Extra settle time for animations
  await new Promise(r => setTimeout(r, 800));

  const dest = join(DOCS, shot.file);
  await page.screenshot({ path: dest, fullPage: false });
  copyFileSync(dest, join(PUB, shot.file));
  console.log(`  ✓ Saved ${shot.file}`);
  await page.close();
}

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
    defaultViewport: { width: 1440, height: 900 },
  });

  for (const shot of SHOTS) {
    console.log(`\nCapturing: ${shot.file}`);
    await capture(browser, shot);
  }

  await browser.close();
  console.log('\nAll screenshots done.');
})();
