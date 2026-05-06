import { chromium } from '@playwright/test';

const baseUrl = 'http://127.0.0.1:8080/';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

async function gotoHome() {
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('a[href*="/produto/"]', { timeout: 10000 });
}

await gotoHome();
const total = await page.locator('a[href*="/produto/"]').count();
const results = [];

for (let i = 0; i < total; i += 1) {
  await gotoHome();
  const links = page.locator('a[href*="/produto/"]');
  const link = links.nth(i);
  const href = await link.getAttribute('href');
  const text = ((await link.innerText()).replace(/\s+/g, ' ').trim()).slice(0, 180);
  const expectedPath = new URL(href, baseUrl).pathname;

  try {
    await link.scrollIntoViewIfNeeded();
    await Promise.all([
      page.waitForURL((url) => new URL(url.toString()).pathname === expectedPath, { timeout: 5000 }),
      link.click({ timeout: 5000 }),
    ]);

    results.push({
      index: i + 1,
      text,
      expectedPath,
      currentPath: new URL(page.url()).pathname,
      ok: new URL(page.url()).pathname === expectedPath,
    });
  } catch (error) {
    results.push({
      index: i + 1,
      text,
      expectedPath,
      currentPath: new URL(page.url()).pathname,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

console.log(JSON.stringify({
  total,
  passed: results.filter((r) => r.ok).length,
  failed: results.filter((r) => !r.ok).length,
  failures: results.filter((r) => !r.ok),
}, null, 2));

await browser.close();
