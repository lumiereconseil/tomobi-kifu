// Pays a test donation on the live site with Stripe's test card and saves screenshots.
// Runs in CI (.github/workflows/test-donation.yml); no real money moves.
const { chromium } = require('playwright');
(async () => {
  require('fs').mkdirSync('shots', { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ locale: 'ja-JP' });
  global.page = p;
  await p.goto('https://lumiereconseil.github.io/tomobi-kifu/ja/test-donation/', { waitUntil: 'networkidle' });
  await p.screenshot({ path: 'shots/step1.png', fullPage: true });
  await p.locator('.donate-link-row').nth(1).locator('a', { hasText: '3,000' }).click();
  await p.waitForURL(/stripe\.com/, { timeout: 30000 });
  await p.waitForSelector('#email', { timeout: 30000 });
  await p.fill('#email', 'test-donor@example.com');
  const card = p.locator('#cardNumber');
  await card.fill('4242424242424242');
  await p.fill('#cardExpiry', '12 / 34');
  await p.fill('#cardCvc', '123');
  if (await p.locator('#billingName').count()) await p.fill('#billingName', 'Test Donor');
  await p.screenshot({ path: 'shots/step2.png', fullPage: true });
  await p.click('button[type=submit]');
  await p.waitForURL(/github\.io\/tomobi-kifu\/ja\/thanks/, { timeout: 60000 });
  await p.waitForLoadState('networkidle');
  await p.screenshot({ path: 'shots/step3.png', fullPage: true });
  console.log('OK', p.url(), await p.locator('h1').innerText());
  await b.close();
})().catch(async e => {
   console.error('FAIL', e.message);
  try { await global.page.screenshot({ path: 'shots/fail.png', fullPage: true }); } catch {} process.exit(1); });
