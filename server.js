/* ============================================================
   سێرڤەری وێبسایتی بۆردی وەرزشیی یەکێتیی نیشتمانیی کوردستان
   ------------------------------------------------------------
   بەبێ هیچ پاکێجێکی دەرەکی — تەنها Node.js (وەشانی ١٨ یان نوێتر).
   دەستپێکردن:   node server.js
   گۆڕاوەکان:
     PORT        ژمارەی پۆرت (بنەڕەت 3000)
     DATA_DIR    شوێنی پاشەکەوتکردنی بابەت و وێنەکان (بنەڕەت ./data)
     ADMIN_CODE  کۆدی چوونەژوورەوەی کۆنترۆڵ پانێڵ (ئەگەر دانەنرێت، لە پانێڵەکەوە دەگۆڕدرێت)
     SITE_URL    ناونیشانی تەواوی سایتەکە، بۆ نموونە https://puksport.krd (بۆ بڵاوکردنەوە لە فەیسبووک)
   ============================================================ */
'use strict';

const http = require('http');
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const crypto = require('crypto');

const PORT = Number(process.env.PORT) || 3000;
const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, 'public');
const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(ROOT, 'data'));
const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const AUTH_FILE = path.join(DATA_DIR, 'auth.json');

const PER_PAGE = 12;
const MAX_BODY = 60 * 1024 * 1024;          // سنووری داواکاری (وێنەکانیش تێیدان)
const MAX_IMAGE = 12 * 1024 * 1024;         // سنووری هەر وێنەیەک
const MAX_IMAGES_PER_POST = 30;
const SESSION_DAYS = 14;

const DEFAULT_SETTINGS = {
  siteTitle: 'بۆردی وەرزشیی یەکێتیی نیشتمانیی کوردستان',
  shortTitle: 'بۆردی وەرزش',
  orgLatin: 'PUK SPORTS BOARD',
  tagline: 'شوێنێک بۆ پەرەپێدانی وەرزش و پشتگیریی وەرزشوانانی کوردستان',
  about: 'بۆردی وەرزشیی یەکێتیی نیشتمانیی کوردستان کار دەکات بۆ پەرەپێدانی وەرزش لە هەموو بوارەکاندا، پشتگیریی یانە و وەرزشوانان، و ڕێکخستنی چالاکی و پاڵەوانێتی بۆ گەنجان.\n\nلێرەدا ڕۆژانە دوایین هەواڵ و چالاکییەکانی بۆرد دەخەینە بەردەستتان.',
  categories: ['هەواڵ', 'چالاکی', 'یاری و پاڵەوانێتی', 'ڕاگەیاندن'],
  phone: '',
  email: '',
  address: '',
  facebook: '',
  instagram: '',
  youtube: '',
  tiktok: '',
  devName: 'SOLIN OTHMAN',
  devMotto: 'وەرزش ژیانمە',
  logo: '',
  banner: ''
};

/* ================= هاوکارە گشتییەکان ================= */

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function newId() {
  return Date.now().toString(36) + crypto.randomBytes(3).toString('hex');
}

async function readJson(file, fallback) {
  try { return JSON.parse(await fsp.readFile(file, 'utf8')); }
  catch (e) { if (e.code === 'ENOENT') return fallback; throw e; }
}

// نووسینی سەلامەت: سەرەتا فایلێکی کاتی، پاشان ناوگۆڕین — بۆ ئەوەی فایلەکە هەرگیز نیوە-نووسراو نەبێت
let writeChain = Promise.resolve();
function writeJson(file, data) {
  const job = writeChain.then(async () => {
    const tmp = file + '.' + process.pid + '.tmp';
    await fsp.writeFile(tmp, JSON.stringify(data, null, 2));
    await fsp.rename(tmp, file);
  });
  writeChain = job.catch(() => {});
  return job;
}

/* ================= داتا ================= */

let posts = [];
let settings = { ...DEFAULT_SETTINGS };
let auth = null;

function sortPosts() {
  posts.sort((a, b) => (b.date || '').localeCompare(a.date || '') || b.createdAt - a.createdAt);
}

function publicPosts() { return posts.filter(p => p.published !== false); }

const savePosts = () => writeJson(POSTS_FILE, posts);
const saveSettings = () => writeJson(SETTINGS_FILE, settings);
const saveAuth = () => writeJson(AUTH_FILE, auth);

function hashCode(code, salt) {
  return crypto.scryptSync(String(code), salt, 32).toString('hex');
}

async function init() {
  await fsp.mkdir(UPLOAD_DIR, { recursive: true });
  posts = await readJson(POSTS_FILE, []);
  settings = { ...DEFAULT_SETTINGS, ...(await readJson(SETTINGS_FILE, {})) };
  sortPosts();

  auth = await readJson(AUTH_FILE, null);
  if (!auth) {
    const salt = crypto.randomBytes(16).toString('hex');
    let firstCode = process.env.ADMIN_CODE;
    if (!firstCode) {
      firstCode = 'puk-' + crypto.randomBytes(4).toString('hex');
      await fsp.writeFile(path.join(DATA_DIR, 'FIRST-ADMIN-CODE.txt'),
        'کۆدی یەکەمجاری کۆنترۆڵ پانێڵ: ' + firstCode + '\n' +
        'دوای چوونەژوورەوە لە «ڕێکخستنەکان»ەوە بیگۆڕە، پاشان ئەم فایلە بسڕەوە.\n');
      console.log('\n  کۆدی کۆنترۆڵ پانێڵ (یەکەمجار): ' + firstCode + '\n');
    }
    auth = { salt, hash: hashCode(firstCode, salt), secret: crypto.randomBytes(32).toString('hex') };
    await saveAuth();
  }
  if (process.env.ADMIN_CODE) {
    // ئەگەر کۆد لە ژینگەدا دانرابێت، هەمیشە ئەو کۆدە کار دەکات
    auth.envHash = hashCode(process.env.ADMIN_CODE, auth.salt);
  }
}

/* ================= چوونەژوورەوە ================= */

function sign(payload) {
  return crypto.createHmac('sha256', auth.secret).update(payload).digest('base64url');
}

function makeToken() {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + SESSION_DAYS * 864e5 })).toString('base64url');
  return payload + '.' + sign(payload);
}

function safeEqual(a, b) {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

function parseCookies(req) {
  const out = {};
  (req.headers.cookie || '').split(';').forEach(part => {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  });
  return out;
}

function isAdmin(req) {
  const token = parseCookies(req).puk_admin;
  if (!token || token.indexOf('.') < 0) return false;
  const [payload, sig] = token.split('.');
  if (!safeEqual(sig, sign(payload))) return false;
  try { return JSON.parse(Buffer.from(payload, 'base64url').toString()).exp > Date.now(); }
  catch { return false; }
}

function checkCode(code) {
  if (typeof code !== 'string' || !code || code.length > 200) return false;
  const h = hashCode(code, auth.salt);
  return safeEqual(h, auth.hash) || (auth.envHash ? safeEqual(h, auth.envHash) : false);
}

// ڕێگری لە هەوڵدانی زۆر بۆ دۆزینەوەی کۆد
const attempts = new Map();
function clientIp(req) {
  return String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || '';
}
function tooManyAttempts(ip) {
  const a = attempts.get(ip);
  if (!a) return false;
  if (Date.now() - a.first > 15 * 60e3) { attempts.delete(ip); return false; }
  return a.count >= 8;
}
function recordFail(ip) {
  const a = attempts.get(ip);
  if (!a || Date.now() - a.first > 15 * 60e3) attempts.set(ip, { count: 1, first: Date.now() });
  else a.count++;
}

function isHttps(req) {
  return req.socket.encrypted || req.headers['x-forwarded-proto'] === 'https';
}

function sessionCookie(req, value, maxAge) {
  return 'puk_admin=' + value + '; Path=/; HttpOnly; SameSite=Strict; Max-Age=' + maxAge +
    (isHttps(req) ? '; Secure' : '');
}

/* ================= وێنەکان ================= */

const IMAGE_TYPES = {
  jpg: { mime: 'image/jpeg', magic: b => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  png: { mime: 'image/png', magic: b => b.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  webp: { mime: 'image/webp', magic: b => b.slice(0, 4).toString() === 'RIFF' && b.slice(8, 12).toString() === 'WEBP' },
  gif: { mime: 'image/gif', magic: b => b.slice(0, 4).toString() === 'GIF8' }
};
const UPLOAD_NAME = /^[a-z0-9]{8,40}\.(jpg|png|webp|gif)$/;

// وێنەیەک یان ناوی وێنەیەکی هەبوو، یان dataURLـێکی نوێ کە دەبێت پاشەکەوت بکرێت
async function storeImage(value) {
  if (!value) return '';
  if (typeof value !== 'string') throw httpError(400, 'وێنەکە دروست نییە');
  if (UPLOAD_NAME.test(value)) {
    if (!fs.existsSync(path.join(UPLOAD_DIR, value))) throw httpError(400, 'وێنەکە نەدۆزرایەوە');
    return value;
  }
  const m = /^data:image\/[a-z+.-]+;base64,([A-Za-z0-9+/=\s]+)$/.exec(value);
  if (!m) throw httpError(400, 'جۆری وێنەکە پشتگیری ناکرێت');
  const buf = Buffer.from(m[1], 'base64');
  if (buf.length > MAX_IMAGE) throw httpError(413, 'وێنەکە زۆر گەورەیە');
  const ext = Object.keys(IMAGE_TYPES).find(k => IMAGE_TYPES[k].magic(buf));
  if (!ext) throw httpError(400, 'تەنها JPG، PNG، WEBP و GIF وەردەگیرێن');
  const name = Date.now().toString(36) + crypto.randomBytes(8).toString('hex') + '.' + ext;
  await fsp.writeFile(path.join(UPLOAD_DIR, name), buf);
  return name;
}

// سڕینەوەی ئەو وێنانەی چیتر لە هیچ شوێنێک بەکارنایەن
async function removeUnused(names) {
  const used = new Set([settings.logo, settings.banner]);
  posts.forEach(p => (p.images || []).forEach(i => used.add(i)));
  for (const n of names) {
    if (n && !used.has(n) && UPLOAD_NAME.test(n)) await fsp.unlink(path.join(UPLOAD_DIR, n)).catch(() => {});
  }
}

/* ================= HTTP ================= */

function httpError(status, message) {
  const e = new Error(message);
  e.status = status;
  return e;
}

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Content-Security-Policy':
    "default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self'; " +
    "font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'"
};

function send(res, status, body, type, extra) {
  res.writeHead(status, { 'Content-Type': type, ...SECURITY_HEADERS, ...(extra || {}) });
  res.end(body);
}
const sendHtml = (res, status, html, extra) => send(res, status, html, 'text/html; charset=utf-8', { 'Cache-Control': 'no-cache', ...(extra || {}) });
const sendJson = (res, status, data, extra) => send(res, status, JSON.stringify(data), 'application/json; charset=utf-8', { 'Cache-Control': 'no-store', ...(extra || {}) });

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', c => {
      size += c.length;
      if (size > MAX_BODY) { reject(httpError(413, 'قەبارەی ناردراو زۆر گەورەیە')); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => {
      try { resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {}); }
      catch { reject(httpError(400, 'داتاکە دروست نییە')); }
    });
    req.on('error', reject);
  });
}

const MIME = {
  '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.html': 'text/html; charset=utf-8',
  '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.gif': 'image/gif', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8'
};

async function serveFile(res, baseDir, rel, cache) {
  const file = path.normalize(path.join(baseDir, rel));
  if (!file.startsWith(baseDir + path.sep)) return false;
  let stat;
  try { stat = await fsp.stat(file); } catch { return false; }
  if (!stat.isFile()) return false;
  res.writeHead(200, {
    'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
    'Content-Length': stat.size,
    'Cache-Control': cache,
    ...SECURITY_HEADERS
  });
  fs.createReadStream(file).pipe(res);
  return true;
}

function siteOrigin(req) {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/+$/, '');
  return (isHttps(req) ? 'https' : 'http') + '://' + (req.headers.host || 'localhost');
}

/* ================= دەق و بەروار ================= */

let dateFmt;
try { dateFmt = new Intl.DateTimeFormat('ckb', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }); }
catch { dateFmt = null; }

function formatDate(d) {
  if (!d) return '';
  const dt = new Date(d + 'T00:00:00Z');
  if (isNaN(dt)) return esc(d);
  return esc(dateFmt ? dateFmt.format(dt) : d);
}

// دەقی بابەت: دێڕی بەتاڵ = پەرەگرافی نوێ، **تۆخ**، و بەستەرەکان خۆکار دەبنە لینک
function formatBody(text) {
  return String(text || '').split(/\n\s*\n/).map(p => p.trim()).filter(Boolean).map(p => {
    let h = esc(p)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/(https?:\/\/[^\s<]+[^\s<.,;:!?)»"'])/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n/g, '<br>');
    return '<p>' + h + '</p>';
  }).join('\n');
}

function excerpt(text, n) {
  const t = String(text || '').replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
  return t.length > n ? t.slice(0, n).replace(/\s+\S*$/, '') + '…' : t;
}

const upl = name => '/uploads/' + encodeURIComponent(name);

/* ================= ڕووکارەکان (HTML) ================= */

function logoMarkup() {
  return settings.logo
    ? '<img src="' + upl(settings.logo) + '" alt="لۆگۆی ' + esc(settings.shortTitle) + '">'
    : '<img src="/img/logo.svg" alt="لۆگۆی ' + esc(settings.shortTitle) + '">';
}

function layout({ title, description, image, url, body, bodyClass, noindex }) {
  const s = settings;
  const fullTitle = title ? title + ' | ' + s.shortTitle : s.siteTitle;
  return `<!DOCTYPE html>
<html lang="ckb" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description || s.tagline)}">
<meta name="theme-color" content="#01100a">
${noindex ? '<meta name="robots" content="noindex">' : ''}
<meta property="og:type" content="${title ? 'article' : 'website'}">
<meta property="og:site_name" content="${esc(s.siteTitle)}">
<meta property="og:title" content="${esc(title || s.siteTitle)}">
<meta property="og:description" content="${esc(description || s.tagline)}">
${url ? `<meta property="og:url" content="${esc(url)}">` : ''}
${image ? `<meta property="og:image" content="${esc(image)}"><meta name="twitter:card" content="summary_large_image">` : ''}
<link rel="icon" href="${s.logo ? upl(s.logo) : '/img/logo.svg'}">
<link rel="alternate" type="application/rss+xml" title="${esc(s.siteTitle)}" href="/feed.xml">
<link rel="stylesheet" href="/css/fonts.css">
<link rel="stylesheet" href="/css/tokens.css">
<link rel="stylesheet" href="/css/components.css">
<link rel="stylesheet" href="/css/motion.css">
<link rel="stylesheet" href="/css/site.css">
</head>
<body class="${bodyClass || ''}">
<header class="topbar">
  <a class="topbar-brand" href="/">
    <span class="topbar-logo">${logoMarkup()}</span>
    <span>${esc(s.shortTitle)}</span>
  </a>
  <nav class="topbar-nav" aria-label="ڕێڕەو">
    <a href="/">سەرەکی</a>
    <a href="/#news">هەواڵەکان</a>
    <a href="/#about">دەربارە</a>
    <a href="/#contact">پەیوەندی</a>
  </nav>
</header>
${body}
${footer()}
<div class="lightbox" id="lightbox" hidden>
  <button type="button" class="lb-close" aria-label="داخستن">×</button>
  <button type="button" class="lb-prev" aria-label="پێشوو">›</button>
  <img alt="">
  <button type="button" class="lb-next" aria-label="دواتر">‹</button>
</div>
<script src="/js/motion.js"></script>
<script src="/js/site.js"></script>
</body>
</html>`;
}

function socialLinks() {
  const s = settings;
  const list = [
    ['facebook', 'فەیسبووک'], ['instagram', 'ئینستاگرام'], ['youtube', 'یوتیوب'], ['tiktok', 'تیکتۆک']
  ].filter(([k]) => /^https?:\/\//.test(s[k] || ''));
  if (!list.length) return '';
  return '<div class="socials">' + list.map(([k, label]) =>
    `<a class="social" href="${esc(s[k])}" target="_blank" rel="noopener noreferrer">${label}</a>`).join('') + '</div>';
}

function footer() {
  const s = settings;
  return `<footer class="footer reveal">
  <div class="line"></div>
  <p class="footer-org">${esc(s.siteTitle)}</p>
  ${socialLinks()}
  <p class="footer-copy">© ${new Date().getFullYear()} — هەموو مافەکان پارێزراون</p>
  ${s.devName ? `<span class="dev-by">DEVELOPED BY</span>
  <button type="button" class="dev-name" id="devName" aria-expanded="false">${esc(s.devName)}</button>
  <p class="dev-motto" id="devMotto" aria-hidden="true">${esc(s.devMotto)}</p>` : ''}
  <div class="dev-dots"><b></b><i></i><b></b></div>
</footer>`;
}

function postCard(p, big) {
  const cover = p.images && p.images[0];
  return `<a class="post-card reveal${big ? ' is-big' : ''}" href="/post/${esc(p.id)}">
  <div class="post-media">${cover
    ? `<img src="${upl(cover)}" alt="" loading="lazy">`
    : `<div class="post-noimg"><img src="${settings.logo ? upl(settings.logo) : '/img/logo.svg'}" alt=""></div>`}
    ${p.category ? `<span class="post-cat">${esc(p.category)}</span>` : ''}
    ${p.images && p.images.length > 1 ? `<span class="post-count">${p.images.length} وێنە</span>` : ''}
  </div>
  <div class="post-info">
    <time datetime="${esc(p.date)}">${formatDate(p.date)}</time>
    <h3>${esc(p.title)}</h3>
    <p>${esc(excerpt(p.body, big ? 260 : 130))}</p>
  </div>
</a>`;
}

function renderHome(req, url) {
  const s = settings;
  const cat = url.searchParams.get('cat') || '';
  const q = (url.searchParams.get('q') || '').trim().slice(0, 100);
  let page = Math.max(1, parseInt(url.searchParams.get('page'), 10) || 1);

  let list = publicPosts();
  if (cat) list = list.filter(p => p.category === cat);
  if (q) {
    const needle = q.toLowerCase();
    list = list.filter(p => (p.title + ' ' + p.body).toLowerCase().includes(needle));
  }
  const filtering = !!(cat || q);
  // بابەتی دیاریکراو (یان نوێترین) لە سەرەوە بە گەورەیی
  let featured = null;
  if (!filtering && page === 1 && list.length) {
    featured = list.find(p => p.featured) || list[0];
    list = list.filter(p => p !== featured);
  }
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  page = Math.min(page, pages);
  const shown = list.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const qs = (extra) => {
    const u = new URLSearchParams();
    if (cat) u.set('cat', cat);
    if (q) u.set('q', q);
    Object.entries(extra).forEach(([k, v]) => v ? u.set(k, v) : u.delete(k));
    const str = u.toString();
    return '/' + (str ? '?' + str : '') + '#news';
  };

  const chips = ['<a class="chip' + (!cat ? ' is-on' : '') + '" href="' + (q ? '/?q=' + encodeURIComponent(q) + '#news' : '/#news') + '">هەمووی</a>']
    .concat(s.categories.map(c =>
      `<a class="chip${c === cat ? ' is-on' : ''}" href="/?${new URLSearchParams(q ? { cat: c, q } : { cat: c })}#news">${esc(c)}</a>`))
    .join('');

  const pager = pages > 1 ? `<nav class="pager" aria-label="لاپەڕەکان">
    ${page > 1 ? `<a class="btn btn-2 btn-sm" href="${qs({ page: page - 1 > 1 ? String(page - 1) : '' })}">→ پێشوو</a>` : '<span></span>'}
    <span class="pager-num">لاپەڕەی ${page} لە ${pages}</span>
    ${page < pages ? `<a class="btn btn-2 btn-sm" href="${qs({ page: String(page + 1) })}">دواتر ←</a>` : '<span></span>'}
  </nav>` : '';

  const aboutParas = String(s.about || '').split(/\n\s*\n/).filter(x => x.trim())
    .map(p => `<p class="reveal lines">${esc(p.trim()).replace(/\n/g, '<br>')}</p>`).join('');

  const contactRows = [
    s.phone && `<div class="contact-row"><span>تەلەفۆن</span><a href="tel:${esc(s.phone.replace(/[^\d+]/g, ''))}" dir="ltr">${esc(s.phone)}</a></div>`,
    s.email && `<div class="contact-row"><span>ئیمەیڵ</span><a href="mailto:${esc(s.email)}" dir="ltr">${esc(s.email)}</a></div>`,
    s.address && `<div class="contact-row"><span>ناونیشان</span><b>${esc(s.address)}</b></div>`
  ].filter(Boolean).join('');

  const body = `
${s.banner ? `<div class="banner"><img src="${upl(s.banner)}" alt=""></div><div class="neon-line"></div>` : '<div class="banner-space"></div>'}
<div class="wrap wide">
  <header class="hero">
    <div class="board-logo${s.banner ? '' : ' no-banner'}" id="boardLogo" role="button" tabindex="0" aria-label="${esc(s.orgLatin)}">${logoMarkup()}</div>
    <p class="logo-note" id="logoNote" aria-hidden="true">${esc(s.orgLatin)}</p>
    <div class="hero-divider"><span></span><i></i><span></span></div>
    <h1 class="form-title reveal words">${esc(s.siteTitle)}</h1>
    <p class="tagline reveal lines">${esc(s.tagline)}</p>
  </header>

  <section id="news" class="news">
    <div class="sec-head reveal">
      <div class="sec-num">١</div>
      <h2 class="sec-title">دوایین هەواڵ و چالاکییەکان<span>ڕۆژانە نوێ دەکرێتەوە</span></h2>
    </div>
    <div class="news-tools reveal">
      <div class="chips">${chips}</div>
      <form class="search" action="/#news" method="get" role="search">
        ${cat ? `<input type="hidden" name="cat" value="${esc(cat)}">` : ''}
        <input type="search" name="q" value="${esc(q)}" placeholder="گەڕان لە بابەتەکان..." aria-label="گەڕان">
      </form>
    </div>
    ${featured ? postCard(featured, true) : ''}
    ${shown.length ? `<div class="post-grid">${shown.map(p => postCard(p)).join('')}</div>` :
      (!featured ? `<div class="empty reveal">${filtering ? 'هیچ بابەتێک نەدۆزرایەوە.' : 'هێشتا هیچ بابەتێک بڵاو نەکراوەتەوە.'}</div>` : '')}
    ${pager}
  </section>

  <section id="about" class="card reveal">
    <div class="sec-head">
      <div class="sec-num">٢</div>
      <h2 class="sec-title">دەربارەی بۆرد</h2>
    </div>
    <div class="about-text">${aboutParas}</div>
  </section>

  <section id="contact" class="card reveal">
    <div class="sec-head">
      <div class="sec-num">٣</div>
      <h2 class="sec-title">پەیوەندیمان پێوە بکە</h2>
    </div>
    ${contactRows || '<p class="muted">زانیاریی پەیوەندی بەم زووانە زیاد دەکرێت.</p>'}
    ${socialLinks()}
  </section>
</div>`;

  return layout({
    title: cat || (q ? 'گەڕان: ' + q : ''),
    body, bodyClass: 'page-home', url: siteOrigin(req) + '/',
    image: s.banner ? siteOrigin(req) + upl(s.banner) : (s.logo ? siteOrigin(req) + upl(s.logo) : '')
  });
}

function renderPost(req, post) {
  const origin = siteOrigin(req);
  const link = origin + '/post/' + post.id;
  const imgs = post.images || [];
  const others = publicPosts().filter(p => p.id !== post.id);
  const related = others.filter(p => p.category === post.category).concat(others.filter(p => p.category !== post.category)).slice(0, 3);

  const gallery = imgs.length ? `<figure class="post-cover reveal">
      <button type="button" class="gal-item" data-full="${upl(imgs[0])}"><img src="${upl(imgs[0])}" alt="${esc(post.title)}"></button>
    </figure>
    ${imgs.length > 1 ? `<div class="gallery">${imgs.slice(1).map(i =>
      `<button type="button" class="gal-item reveal" data-full="${upl(i)}"><img src="${upl(i)}" alt="" loading="lazy"></button>`).join('')}</div>` : ''}` : '';

  const shareText = encodeURIComponent(post.title + '\n' + link);
  const body = `
<div class="wrap">
  <a class="back-link" href="/#news">→ گەڕانەوە بۆ هەواڵەکان</a>
  <article class="card article reveal">
    <div class="article-meta">
      ${post.category ? `<a class="post-cat static" href="/?cat=${encodeURIComponent(post.category)}#news">${esc(post.category)}</a>` : ''}
      <time datetime="${esc(post.date)}">${formatDate(post.date)}</time>
    </div>
    <h1 class="article-title reveal words">${esc(post.title)}</h1>
    ${gallery}
    <div class="article-body">${formatBody(post.body)}</div>
    <div class="share">
      <span>هاوبەشی بکە:</span>
      <a class="chip" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}" target="_blank" rel="noopener noreferrer">فەیسبووک</a>
      <a class="chip" href="https://wa.me/?text=${shareText}" target="_blank" rel="noopener noreferrer">واتساپ</a>
      <a class="chip" href="https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(post.title)}" target="_blank" rel="noopener noreferrer">تێلێگرام</a>
      <button type="button" class="chip" data-copy="${esc(link)}">کۆپیکردنی بەستەر</button>
    </div>
  </article>
  ${related.length ? `<section class="related">
    <div class="sec-head reveal"><h2 class="sec-title">بابەتی تر</h2></div>
    <div class="post-grid">${related.map(p => postCard(p)).join('')}</div>
  </section>` : ''}
</div>
<div class="toast" id="toast"></div>`;

  return layout({
    title: post.title, description: excerpt(post.body, 200), url: link,
    image: imgs[0] ? origin + upl(imgs[0]) : '', body, bodyClass: 'page-post'
  });
}

function render404(req) {
  return layout({
    title: 'نەدۆزرایەوە', noindex: true, bodyClass: 'page-404',
    body: `<div class="wrap"><div class="card reveal notfound">
      <h1 class="form-title">٤٠٤</h1>
      <p>ئەم لاپەڕەیە بوونی نییە یان سڕاوەتەوە.</p>
      <a class="btn" href="/">گەڕانەوە بۆ سەرەکی</a>
    </div></div>`
  });
}

function renderFeed(req) {
  const origin = siteOrigin(req);
  const x = s => esc(s);
  const items = publicPosts().slice(0, 30).map(p => `<item>
  <title>${x(p.title)}</title>
  <link>${origin}/post/${p.id}</link>
  <guid>${origin}/post/${p.id}</guid>
  <pubDate>${new Date((p.date || '1970-01-01') + 'T12:00:00Z').toUTCString()}</pubDate>
  <description>${x(excerpt(p.body, 400))}</description>
</item>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>${x(settings.siteTitle)}</title>
<link>${origin}/</link>
<description>${x(settings.tagline)}</description>
<language>ckb</language>
${items}
</channel></rss>`;
}

/* ================= API ی کۆنترۆڵ پانێڵ ================= */

const str = (v, max) => String(v == null ? '' : v).slice(0, max);
const today = () => new Date().toISOString().slice(0, 10);

async function postFromInput(input, existing) {
  const title = str(input.title, 300).trim();
  if (!title) throw httpError(400, 'ناونیشان پێویستە');
  const images = Array.isArray(input.images) ? input.images.slice(0, MAX_IMAGES_PER_POST) : [];
  const stored = [];
  for (const img of images) { const n = await storeImage(img); if (n) stored.push(n); }
  const date = /^\d{4}-\d{2}-\d{2}$/.test(input.date || '') ? input.date : today();
  return {
    id: existing ? existing.id : newId(),
    title,
    body: str(input.body, 100000),
    category: str(input.category, 80).trim(),
    date,
    images: stored,
    featured: !!input.featured,
    published: input.published !== false,
    createdAt: existing ? existing.createdAt : Date.now(),
    updatedAt: Date.now()
  };
}

async function handleApi(req, res, url) {
  const p = url.pathname;
  const method = req.method;

  // پاراستن لە CSRF: داواکارییە گۆڕەرەکان دەبێت JSON بن و لە هەمان سایتەوە بێن
  if (method !== 'GET') {
    const origin = req.headers.origin;
    if (origin && new URL(origin).host !== req.headers.host) throw httpError(403, 'ڕێگەپێنەدراو');
    if (!/^application\/json/.test(req.headers['content-type'] || '')) throw httpError(415, 'JSON پێویستە');
  }

  if (p === '/api/session' && method === 'GET') return sendJson(res, 200, { admin: isAdmin(req) });

  if (p === '/api/login' && method === 'POST') {
    const ip = clientIp(req);
    if (tooManyAttempts(ip)) throw httpError(429, 'هەوڵی زۆرت دا. پاش ١٥ خولەک دووبارە هەوڵ بدەرەوە.');
    const { code } = await readBody(req);
    if (!checkCode(code)) {
      recordFail(ip);
      await new Promise(r => setTimeout(r, 700));
      throw httpError(401, 'کۆدەکە هەڵەیە');
    }
    attempts.delete(ip);
    return sendJson(res, 200, { ok: true }, { 'Set-Cookie': sessionCookie(req, makeToken(), SESSION_DAYS * 86400) });
  }

  if (p === '/api/logout' && method === 'POST') {
    return sendJson(res, 200, { ok: true }, { 'Set-Cookie': sessionCookie(req, '', 0) });
  }

  if (!p.startsWith('/api/admin/')) throw httpError(404, 'نەدۆزرایەوە');
  if (!isAdmin(req)) throw httpError(401, 'پێویستە سەرەتا بچیتە ژوورەوە');

  if (p === '/api/admin/posts' && method === 'GET') return sendJson(res, 200, { posts });

  if (p === '/api/admin/posts' && method === 'POST') {
    const post = await postFromInput(await readBody(req));
    if (post.featured) posts.forEach(x => { x.featured = false; });
    posts.push(post);
    sortPosts();
    await savePosts();
    return sendJson(res, 201, { post });
  }

  const m = /^\/api\/admin\/posts\/([a-z0-9]+)$/.exec(p);
  if (m) {
    const idx = posts.findIndex(x => x.id === m[1]);
    if (idx < 0) throw httpError(404, 'بابەتەکە نەدۆزرایەوە');
    const old = posts[idx];
    if (method === 'PUT') {
      const post = await postFromInput(await readBody(req), old);
      if (post.featured) posts.forEach(x => { x.featured = false; });
      posts[idx] = post;
      sortPosts();
      await savePosts();
      await removeUnused(old.images || []);
      return sendJson(res, 200, { post });
    }
    if (method === 'DELETE') {
      posts.splice(idx, 1);
      await savePosts();
      await removeUnused(old.images || []);
      return sendJson(res, 200, { ok: true });
    }
  }

  if (p === '/api/admin/settings' && method === 'GET') {
    return sendJson(res, 200, { settings, envCode: !!process.env.ADMIN_CODE });
  }

  if (p === '/api/admin/settings' && method === 'PUT') {
    const input = await readBody(req);
    const next = { ...settings };
    for (const k of Object.keys(DEFAULT_SETTINGS)) {
      if (k === 'logo' || k === 'banner' || k === 'categories' || !(k in input)) continue;
      next[k] = str(input[k], k === 'about' ? 20000 : 500).trim();
    }
    for (const k of ['facebook', 'instagram', 'youtube', 'tiktok']) {
      if (next[k] && !/^https?:\/\//.test(next[k])) next[k] = 'https://' + next[k];
    }
    if (Array.isArray(input.categories)) {
      next.categories = [...new Set(input.categories.map(c => str(c, 80).trim()).filter(Boolean))].slice(0, 30);
    }
    if (!next.siteTitle) next.siteTitle = DEFAULT_SETTINGS.siteTitle;
    if (!next.shortTitle) next.shortTitle = next.siteTitle;
    const oldImages = [settings.logo, settings.banner];
    if ('logo' in input) next.logo = await storeImage(input.logo);
    if ('banner' in input) next.banner = await storeImage(input.banner);
    settings = next;
    await saveSettings();
    await removeUnused(oldImages);
    return sendJson(res, 200, { settings });
  }

  if (p === '/api/admin/code' && method === 'PUT') {
    const { current, next } = await readBody(req);
    if (!checkCode(current)) throw httpError(401, 'کۆدی ئێستا هەڵەیە');
    if (typeof next !== 'string' || next.length < 6) throw httpError(400, 'کۆدی نوێ دەبێت لانیکەم ٦ پیت بێت');
    auth.hash = hashCode(next, auth.salt);
    auth.secret = crypto.randomBytes(32).toString('hex'); // هەموو چوونەژوورەوەکانی تر دەچنە دەرەوە
    await saveAuth();
    await fsp.unlink(path.join(DATA_DIR, 'FIRST-ADMIN-CODE.txt')).catch(() => {});
    return sendJson(res, 200, { ok: true }, { 'Set-Cookie': sessionCookie(req, makeToken(), SESSION_DAYS * 86400) });
  }

  throw httpError(404, 'نەدۆزرایەوە');
}

/* ================= ڕێڕەوکردن ================= */

async function handle(req, res) {
  const url = new URL(req.url, 'http://localhost');
  let p;
  try { p = decodeURIComponent(url.pathname); } catch { p = '/'; }

  if (p.startsWith('/api/')) return handleApi(req, res, url);
  if (req.method !== 'GET' && req.method !== 'HEAD') throw httpError(405, 'ڕێگەپێنەدراو');

  if (p === '/') return sendHtml(res, 200, renderHome(req, url));

  const pm = /^\/post\/([a-z0-9]+)\/?$/.exec(p);
  if (pm) {
    const post = posts.find(x => x.id === pm[1]);
    if (post && (post.published !== false || isAdmin(req))) return sendHtml(res, 200, renderPost(req, post));
    return sendHtml(res, 404, render404(req));
  }

  if (p === '/admin' || p === '/admin/') {
    return serveFile(res, PUBLIC_DIR, 'admin.html', 'no-cache');
  }

  if (p === '/feed.xml') return send(res, 200, renderFeed(req), 'application/rss+xml; charset=utf-8', { 'Cache-Control': 'no-cache' });
  if (p === '/robots.txt') return send(res, 200, 'User-agent: *\nDisallow: /admin\nDisallow: /api/\n', 'text/plain; charset=utf-8');

  if (p.startsWith('/uploads/')) {
    const name = p.slice(9);
    if (UPLOAD_NAME.test(name) && await serveFile(res, UPLOAD_DIR, name, 'public, max-age=31536000, immutable')) return;
  } else if (/^\/(css|js|fonts|img)\//.test(p)) {
    if (await serveFile(res, PUBLIC_DIR, p.slice(1), /^\/fonts\//.test(p) ? 'public, max-age=31536000' : 'public, max-age=3600')) return;
  }

  return sendHtml(res, 404, render404(req));
}

const server = http.createServer((req, res) => {
  handle(req, res).catch(err => {
    const status = err.status || 500;
    if (status === 500) console.error(err);
    if (res.headersSent) return res.end();
    const message = status === 500 ? 'هەڵەیەک لە سێرڤەر ڕوویدا' : err.message;
    if (req.url.startsWith('/api/')) sendJson(res, status, { error: message });
    else sendHtml(res, status, '<!DOCTYPE html><meta charset="utf-8"><p dir="rtl">' + esc(message) + '</p>');
  });
});

init().then(() => {
  server.listen(PORT, () => {
    console.log('سایتەکە کار دەکات: http://localhost:' + PORT);
    console.log('کۆنترۆڵ پانێڵ:      http://localhost:' + PORT + '/admin');
  });
}).catch(err => { console.error(err); process.exit(1); });
