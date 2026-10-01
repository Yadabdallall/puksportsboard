// Renders course.html to an A4 PDF, or to a high-resolution PNG.
// Usage: node build.js [out.pdf]
//        node build.js out.png [scale]   (scale 5 ≈ 480 DPI, default)
const path = require('path');
const { chromium } = require('/opt/node-tools/node_modules/playwright');

(async () => {
  const out = path.resolve(process.argv[2] || path.join(__dirname, '..', 'sports-cadre-course.pdf'));
  const asPng = out.endsWith('.png');
  const scale = Number(process.argv[3] || 5);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await browser.newPage({
    viewport: { width: 794, height: 1123 },
    deviceScaleFactor: asPng ? scale : 1,
  });
  await page.goto('file://' + path.join(__dirname, 'course.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  if (asPng) {
    await page.locator('.page').screenshot({ path: out, animations: 'disabled' });
  } else {
    await page.pdf({ path: out, printBackground: true, preferCSSPageSize: true });
  }
  await browser.close();
  console.log('wrote', out);
})();
