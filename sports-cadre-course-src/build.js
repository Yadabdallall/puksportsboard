// Renders course.html to an A4 PDF (plus a PNG preview next to it).
// Usage: node build.js [out.pdf]
const path = require('path');
const { chromium } = require('/opt/node-tools/node_modules/playwright');

(async () => {
  const out = path.resolve(process.argv[2] || path.join(__dirname, '..', 'sports-cadre-course.pdf'));
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
  await page.goto('file://' + path.join(__dirname, 'course.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: out, printBackground: true, preferCSSPageSize: true });
  if (process.env.PREVIEW) await page.screenshot({ path: process.env.PREVIEW });
  await browser.close();
  console.log('wrote', out);
})();
