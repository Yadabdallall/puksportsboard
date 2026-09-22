/* ============================================================
   کارپێکردنی سایتەکە بە Node.js (کۆمپیوتەر یان VPS) — بەبێ هیچ پاکێجێکی دەرەکی.
     node server.js
   گۆڕاوەکان: PORT ، DATA_DIR ، ADMIN_CODE ، SITE_URL  (بڕوانە README)
   بۆ Cloudflare ئەم فایلە بەکارنایەت — src/worker.js بەکاردێت.
   ============================================================ */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Readable } from 'node:stream';
import { handle, ensureAuth, randomHex, SECURITY_HEADERS } from './src/app.js';
import { fileStore } from './src/store-file.js';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(ROOT, 'public');
const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(ROOT, 'data'));
const PORT = Number(process.env.PORT) || 3000;
const MAX_BODY = 4 * 1024 * 1024;

const MIME = {
  '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.html': 'text/html; charset=utf-8',
  '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.gif': 'image/gif', '.ico': 'image/x-icon'
};

const store = await fileStore(DATA_DIR);

// یەکەمجار: ئەگەر ADMIN_CODE دانەنرابێت، کۆدێک دروست دەکرێت و نیشان دەدرێت
if (!(await store.kvGet('auth'))) {
  let code = process.env.ADMIN_CODE;
  if (!code) {
    code = 'puk-' + randomHex(4);
    fs.writeFileSync(path.join(DATA_DIR, 'FIRST-ADMIN-CODE.txt'),
      'کۆدی یەکەمجاری کۆنترۆڵ پانێڵ: ' + code + '\nدوای چوونەژوورەوە لە «ڕێکخستنەکان»ەوە بیگۆڕە، پاشان ئەم فایلە بسڕەوە.\n');
    console.log('\n  کۆدی کۆنترۆڵ پانێڵ (یەکەمجار): ' + code + '\n');
  }
  await ensureAuth(store, code);
}

function serveStatic(req, res, rel) {
  const file = path.normalize(path.join(PUBLIC_DIR, rel));
  if (!file.startsWith(PUBLIC_DIR + path.sep)) return false;
  let stat;
  try { stat = fs.statSync(file); } catch (e) { return false; }
  if (!stat.isFile()) return false;
  res.writeHead(200, {
    'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
    'Content-Length': stat.size,
    'Cache-Control': rel.startsWith('fonts/') ? 'public, max-age=31536000' : 'no-cache',
    ...SECURITY_HEADERS
  });
  if (req.method === 'HEAD') res.end(); else fs.createReadStream(file).pipe(res);
  return true;
}

const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (/^\/(css|js|fonts|img)\//.test(pathname) && serveStatic(req, res, pathname.slice(1))) return;
    if ((pathname === '/admin' || pathname === '/admin/') && serveStatic(req, res, 'admin.html')) return;

    // گۆڕینی داواکاریی Node بۆ Request ـی ستاندارد
    const headers = new Headers();
    for (const [k, v] of Object.entries(req.headers)) headers.set(k, Array.isArray(v) ? v.join(', ') : v);
    headers.set('x-client-ip', req.socket.remoteAddress || '');
    let body;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const chunks = []; let size = 0;
      for await (const c of req) {
        size += c.length;
        if (size > MAX_BODY) { res.writeHead(413); res.end(); return; }
        chunks.push(c);
      }
      body = Buffer.concat(chunks);
    }
    const proto = req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const request = new Request(proto + '://' + (req.headers.host || 'localhost') + req.url, { method: req.method, headers, body });
    const response = await handle(request, process.env, store);

    const out = {};
    response.headers.forEach((v, k) => { out[k] = v; });
    res.writeHead(response.status, out);
    if (!response.body || req.method === 'HEAD') return res.end();
    Readable.fromWeb(response.body).pipe(res);
  } catch (err) {
    console.error(err);
    if (!res.headersSent) res.writeHead(500);
    res.end();
  }
});

server.listen(PORT, () => {
  console.log('سایتەکە کار دەکات: http://localhost:' + PORT);
  console.log('کۆنترۆڵ پانێڵ:      http://localhost:' + PORT + '/admin');
});
