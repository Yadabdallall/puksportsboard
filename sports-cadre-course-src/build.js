// Usage: node build.js <out.pdf> [logo-file]
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node-tools/node_modules/playwright');

(async () => {
  const dir = __dirname;
  const out = path.resolve(process.argv[2] || path.join(dir, 'out.pdf'));
  const logo = process.argv[3];

  let html = fs.readFileSync(path.join(dir, 'course.html'), 'utf8');
  const slot = logo
    ? `<img src="${path.relative(dir, path.resolve(logo))}" alt="">`
    : `<div class="ph">لۆگۆ</div>`;
  html = html.replace('<!--LOGO-->', slot);
  const tmp = path.join(dir, '_render.html');
  fs.writeFileSync(tmp, html);

  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await browser.newPage();
  await page.goto('file://' + tmp, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: out, printBackground: true, preferCSSPageSize: true });
  await page.setViewportSize({ width: 794, height: 1123 });
  await page.screenshot({ path: out.replace(/\.pdf$/, '.png'), fullPage: false });
  await browser.close();
  console.log('wrote', out);
})();
