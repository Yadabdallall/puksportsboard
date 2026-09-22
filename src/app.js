/* ============================================================
   ناوەڕۆکی سەرەکیی سایتەکە — هەمان کۆد لە Cloudflare و Node.js ـدا کار دەکات.
   handle(request, env, store) → Response
   store: شوێنی پاشەکەوتکردن (D1 لە Cloudflare، فایل لە Node) — بڕوانە store-d1.js و store-file.js
   ============================================================ */

const PER_PAGE = 12;
const MAX_IMAGE = 1900000;          // سنووری هەر وێنەیەک (سنووری D1 دوو ملیۆن بایتە)
const MAX_JSON = 1024 * 1024;
const MAX_IMAGES_PER_POST = 40;
const SESSION_DAYS = 14;
const PBKDF2_ITER = 20000;

export const DEFAULT_SETTINGS = {
  siteTitle: 'بۆردی وەرزشیی یەکێتیی نیشتمانیی کوردستان',
  shortTitle: 'بۆردی وەرزش',
  orgLatin: 'PUK SPORTS BOARD',
  tagline: 'شوێنێک بۆ پەرەپێدانی وەرزش و پشتگیریی وەرزشوانانی کوردستان',
  about: 'بۆردی وەرزشیی یەکێتیی نیشتمانیی کوردستان — مەکتەبی سکرتاریەتی سەرۆک مام جەلال — کار دەکات بۆ پەرەپێدانی وەرزش لە هەموو بوارەکاندا، پشتگیریی یانە و وەرزشوانان، و ڕێکخستنی چالاکی و پاڵەوانێتی بۆ گەنجان.\n\nلێرەدا ڕۆژانە دوایین هەواڵ و چالاکییەکانی بۆرد دەخەینە بەردەستتان.',
  categories: ['هەواڵ', 'چالاکی', 'یاری و پاڵەوانێتی', 'ڕاگەیاندن'],
  phone: '', email: '', address: '',
  facebook: '', instagram: '', youtube: '', tiktok: '', telegram: '',
  devName: 'SOLIN OTHMAN',
  devMotto: 'وەرزش ژیانمە',
  logo: '',
  banner: ''
};

const SOCIALS = [['facebook', 'فەیسبووک'], ['instagram', 'ئینستاگرام'], ['youtube', 'یوتیوب'], ['tiktok', 'تیکتۆک'], ['telegram', 'تێلێگرام']];

/* ================= هاوکارەکان ================= */

export function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

const enc = new TextEncoder();
const toHex = buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
const fromHex = hex => new Uint8Array(hex.match(/../g).map(h => parseInt(h, 16)));
export const randomHex = n => toHex(crypto.getRandomValues(new Uint8Array(n)));
const b64url = str => btoa(unescape(encodeURIComponent(str))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64url = s => decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/'))));

function safeEqual(a, b) {
  a = String(a); b = String(b);
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

async function hashCode(code, saltHex) {
  const key = await crypto.subtle.importKey('raw', enc.encode(String(code)), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: fromHex(saltHex), iterations: PBKDF2_ITER }, key, 256);
  return toHex(bits);
}

async function hmac(secretHex, msg) {
  const key = await crypto.subtle.importKey('raw', fromHex(secretHex), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return toHex(await crypto.subtle.sign('HMAC', key, enc.encode(msg)));
}

function httpError(status, message) {
  const e = new Error(message);
  e.status = status;
  return e;
}

const today = () => new Date().toISOString().slice(0, 10);
const str = (v, max) => String(v == null ? '' : v).slice(0, max);
export const newId = () => Date.now().toString(36) + randomHex(3);

/* ================= وەڵامەکان ================= */

const CSP = "default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self'; " +
  "font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'";

export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Content-Security-Policy': CSP
};

function respond(body, status, type, extra) {
  return new Response(body, { status, headers: { 'Content-Type': type, ...SECURITY_HEADERS, ...(extra || {}) } });
}
const html = (body, status = 200, extra) => respond(body, status, 'text/html; charset=utf-8', { 'Cache-Control': 'no-cache', ...(extra || {}) });
const json = (data, status = 200, extra) => respond(JSON.stringify(data), status, 'application/json; charset=utf-8', { 'Cache-Control': 'no-store', ...(extra || {}) });

/* ================= بەروار و دەق ================= */

let dateFmt = null;
try { dateFmt = new Intl.DateTimeFormat('ckb', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }); } catch (e) { /* بەبێ Intl */ }
const MONTHS = ['کانوونی دووەم', 'شوبات', 'ئازار', 'نیسان', 'ئایار', 'حوزەیران', 'تەممووز', 'ئاب', 'ئەیلوول', 'تشرینی یەکەم', 'تشرینی دووەم', 'کانوونی یەکەم'];

function formatDate(d) {
  if (!d) return '';
  const dt = new Date(d + 'T00:00:00Z');
  if (isNaN(dt)) return esc(d);
  // هەندێک ژینگە (وەک Cloudflare) ناوی مانگی کوردی نازانن
  const out = dateFmt ? dateFmt.format(dt) : '';
  return esc(/[؀-ۿ]/.test(out) ? out : dt.getUTCDate() + 'ی ' + MONTHS[dt.getUTCMonth()] + 'ی ' + dt.getUTCFullYear());
}

// دێڕی بەتاڵ = پەرەگرافی نوێ، **تۆخ**، بەستەرەکان خۆکار دەبنە لینک
function formatBody(text) {
  return String(text || '').split(/\n\s*\n/).map(p => p.trim()).filter(Boolean).map(p =>
    '<p>' + esc(p)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/(https?:\/\/[^\s<]+[^\s<.,;:!?)»"'])/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n/g, '<br>') + '</p>').join('\n');
}

function excerpt(text, n) {
  const t = String(text || '').replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
  return t.length > n ? t.slice(0, n).replace(/\s+\S*$/, '') + '…' : t;
}

const upl = name => '/uploads/' + encodeURIComponent(name);
const logoUrl = s => s.logo ? upl(s.logo) : '/img/logo.webp';
const bannerUrl = s => s.banner ? upl(s.banner) : '/img/banner.jpg';

function origin(request, env) {
  if (env.SITE_URL) return env.SITE_URL.replace(/\/+$/, '');
  const u = new URL(request.url);
  return u.protocol + '//' + u.host;
}

/* ================= ڕووکارەکان ================= */

function layout(ctx, { title, description, image, url, body, bodyClass, noindex }) {
  const s = ctx.settings;
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
${image ? `<meta property="og:image" content="${esc(image)}">\n<meta name="twitter:card" content="summary_large_image">` : ''}
<link rel="icon" href="${s.logo ? upl(s.logo) : '/img/icon.png'}">
<link rel="apple-touch-icon" href="${s.logo ? upl(s.logo) : '/img/icon.png'}">
<link rel="alternate" type="application/rss+xml" title="${esc(s.siteTitle)}" href="/feed.xml">
<link rel="preload" href="/fonts/zain-arabic-700.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/css/fonts.css">
<link rel="stylesheet" href="/css/tokens.css">
<link rel="stylesheet" href="/css/components.css">
<link rel="stylesheet" href="/css/motion.css">
<link rel="stylesheet" href="/css/site.css?v=3">
</head>
<body class="${bodyClass || ''}">
<header class="topbar" id="topbar">
  <a class="topbar-brand" href="/">
    <span class="topbar-logo"><img src="${logoUrl(s)}" alt=""></span>
    <span class="topbar-name">${esc(s.shortTitle)}</span>
  </a>
  <nav class="topbar-nav" aria-label="ڕێڕەو">
    <a href="/">سەرەکی</a>
    <a href="/#news">هەواڵەکان</a>
    <a href="/#about">دەربارە</a>
    <a href="/#contact">پەیوەندی</a>
  </nav>
</header>
${body}
${footer(s)}
<button type="button" class="to-top" id="toTop" aria-label="گەڕانەوە بۆ سەرەوە">↑</button>
<div class="lightbox" id="lightbox" hidden>
  <button type="button" class="lb-close" aria-label="داخستن">×</button>
  <button type="button" class="lb-prev" aria-label="پێشوو">›</button>
  <img alt="">
  <button type="button" class="lb-next" aria-label="دواتر">‹</button>
</div>
<div class="toast" id="toast"></div>
<script src="/js/motion.js"></script>
<script src="/js/site.js?v=3"></script>
</body>
</html>`;
}

function socialLinks(s) {
  const list = SOCIALS.filter(([k]) => /^https?:\/\//.test(s[k] || ''));
  if (!list.length) return '';
  return '<div class="socials">' + list.map(([k, label]) =>
    `<a class="social social-${k}" href="${esc(s[k])}" target="_blank" rel="noopener noreferrer">${label}</a>`).join('') + '</div>';
}

function footer(s) {
  return `<footer class="footer reveal">
  <div class="line"></div>
  <img class="footer-logo" src="${logoUrl(s)}" alt="" loading="lazy">
  <p class="footer-org">${esc(s.siteTitle)}</p>
  ${socialLinks(s)}
  <p class="footer-copy">© ${new Date().getFullYear()} — هەموو مافەکان پارێزراون</p>
  ${s.devName ? `<span class="dev-by">DEVELOPED BY</span>
  <button type="button" class="dev-name" id="devName" aria-expanded="false">${esc(s.devName)}</button>
  <p class="dev-motto" id="devMotto" aria-hidden="true">${esc(s.devMotto)}</p>` : ''}
  <div class="dev-dots"><b></b><i></i><b></b></div>
</footer>`;
}

function postCard(s, p, big) {
  const cover = p.images && p.images[0];
  return `<a class="post-card reveal${big ? ' is-big' : ''}" href="/post/${esc(p.id)}">
  <div class="post-media">${cover
    ? `<img src="${upl(cover)}" alt="" loading="${big ? 'eager' : 'lazy'}">`
    : `<div class="post-noimg"><img src="${logoUrl(s)}" alt=""></div>`}
    ${p.category ? `<span class="post-cat">${esc(p.category)}</span>` : ''}
    ${p.images && p.images.length > 1 ? `<span class="post-count">${p.images.length} وێنە</span>` : ''}
  </div>
  <div class="post-info">
    <time datetime="${esc(p.date)}">${formatDate(p.date)}</time>
    <h3>${esc(p.title)}</h3>
    <p>${esc(excerpt(p.body, big ? 260 : 130))}</p>
    ${big ? '<span class="read-more">زیاتر بخوێنەوە ←</span>' : ''}
  </div>
</a>`;
}

async function renderHome(ctx, url) {
  const { store, settings: s, request, env } = ctx;
  const cat = str(url.searchParams.get('cat'), 80);
  const q = str(url.searchParams.get('q'), 100).trim();
  let page = Math.max(1, parseInt(url.searchParams.get('page'), 10) || 1);
  const filtering = !!(cat || q);

  const featured = filtering ? null : await store.featuredPost();
  const opts = { published: true, category: cat, q, excludeId: featured && featured.id };
  const { total } = await store.listPosts({ ...opts, limit: 0 });
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  page = Math.min(page, pages);
  const { items } = await store.listPosts({ ...opts, limit: PER_PAGE, offset: (page - 1) * PER_PAGE });
  const latest = filtering ? [] : (await store.listPosts({ published: true, limit: 8 })).items;
  const showFeatured = featured && page === 1;

  const link = extra => {
    const u = new URLSearchParams();
    if (cat) u.set('cat', cat);
    if (q) u.set('q', q);
    Object.entries(extra).forEach(([k, v]) => v ? u.set(k, v) : u.delete(k));
    const qs = u.toString();
    return '/' + (qs ? '?' + qs : '') + '#news';
  };

  const chips = [`<a class="chip${!cat ? ' is-on' : ''}" href="${link({ cat: '', page: '' })}">هەمووی</a>`]
    .concat(s.categories.map(c => `<a class="chip${c === cat ? ' is-on' : ''}" href="${esc(link({ cat: c, page: '' }))}">${esc(c)}</a>`))
    .join('');

  const pager = pages > 1 ? `<nav class="pager" aria-label="لاپەڕەکان">
    ${page > 1 ? `<a class="btn-2 btn-sm" href="${esc(link({ page: page > 2 ? String(page - 1) : '' }))}">→ پێشوو</a>` : '<span></span>'}
    <span class="pager-num">لاپەڕەی ${page} لە ${pages}</span>
    ${page < pages ? `<a class="btn-2 btn-sm" href="${esc(link({ page: String(page + 1) }))}">دواتر ←</a>` : '<span></span>'}
  </nav>` : '';

  const ticker = latest.length ? `<div class="ticker reveal" aria-label="دوایین هەواڵەکان">
    <span class="ticker-label"><i></i>نوێترین</span>
    <div class="ticker-track"><div class="ticker-move">${[0, 1].map(n =>
      `<div class="ticker-set"${n ? ' aria-hidden="true"' : ''}>${latest.map(p =>
        `<a href="/post/${esc(p.id)}"${n ? ' tabindex="-1"' : ''}>${esc(p.title)}</a>`).join('<span class="ticker-dot">◆</span>')}<span class="ticker-dot">◆</span></div>`).join('')}
    </div></div>
  </div>` : '';

  const aboutParas = String(s.about || '').split(/\n\s*\n/).filter(x => x.trim())
    .map(p => `<p class="reveal lines">${esc(p.trim()).replace(/\n/g, '<br>')}</p>`).join('');

  const contactRows = [
    s.phone && `<a class="contact-item" href="tel:${esc(s.phone.replace(/[^\d+]/g, ''))}"><span>تەلەفۆن</span><b dir="ltr">${esc(s.phone)}</b></a>`,
    s.email && `<a class="contact-item" href="mailto:${esc(s.email)}"><span>ئیمەیڵ</span><b dir="ltr">${esc(s.email)}</b></a>`,
    s.address && `<div class="contact-item"><span>ناونیشان</span><b>${esc(s.address)}</b></div>`
  ].filter(Boolean).join('');

  const body = `
<div class="banner"><img src="${bannerUrl(s)}" alt="${esc(s.siteTitle)}" fetchpriority="high"></div>
<div class="neon-line"></div>
<div class="wrap wide">
  <header class="hero">
    <div class="board-logo" id="boardLogo" role="button" tabindex="0" aria-label="${esc(s.orgLatin)}">
      <span class="logo-ring"></span>
      <img src="${logoUrl(s)}" alt="لۆگۆی ${esc(s.shortTitle)}">
    </div>
    <p class="logo-note" id="logoNote" aria-hidden="true">${esc(s.orgLatin)}</p>
    <div class="hero-divider"><span></span><i></i><span></span></div>
    <h1 class="form-title reveal words">${esc(s.siteTitle)}</h1>
    <p class="tagline reveal lines">${esc(s.tagline)}</p>
    <div class="hero-actions reveal">
      <a class="btn" href="#news">دوایین هەواڵەکان</a>
      <a class="btn-2" href="#contact">پەیوەندیمان پێوە بکە</a>
    </div>
  </header>

  ${ticker}

  <section id="news" class="news">
    <div class="sec-head reveal">
      <div class="sec-num">١</div>
      <h2 class="sec-title">دوایین هەواڵ و چالاکییەکان<span>ڕۆژانە نوێ دەکرێتەوە</span></h2>
    </div>
    <div class="news-tools reveal">
      <div class="chips">${chips}</div>
      <form class="search" action="/" method="get" role="search">
        ${cat ? `<input type="hidden" name="cat" value="${esc(cat)}">` : ''}
        <input type="search" name="q" value="${esc(q)}" placeholder="گەڕان لە بابەتەکان..." aria-label="گەڕان">
      </form>
    </div>
    ${filtering ? `<p class="result-note">${total} بابەت دۆزرایەوە${q ? ' بۆ «' + esc(q) + '»' : ''}${cat ? ' لە بەشی «' + esc(cat) + '»' : ''} — <a href="/#news">پاککردنەوە</a></p>` : ''}
    ${showFeatured ? postCard(s, featured, true) : ''}
    ${items.length ? `<div class="post-grid">${items.map(p => postCard(s, p)).join('')}</div>` :
      (!showFeatured ? `<div class="empty reveal">${filtering ? 'هیچ بابەتێک نەدۆزرایەوە.' : 'هێشتا هیچ بابەتێک بڵاو نەکراوەتەوە.'}</div>` : '')}
    ${pager}
  </section>

  <section id="about" class="card reveal about">
    <div class="sec-head">
      <div class="sec-num">٢</div>
      <h2 class="sec-title">دەربارەی بۆرد</h2>
    </div>
    <div class="about-grid">
      <img class="about-logo" src="${logoUrl(s)}" alt="" loading="lazy">
      <div class="about-text">${aboutParas}</div>
    </div>
  </section>

  <section id="contact" class="card reveal">
    <div class="sec-head">
      <div class="sec-num">٣</div>
      <h2 class="sec-title">پەیوەندیمان پێوە بکە</h2>
    </div>
    ${contactRows ? `<div class="contact-grid">${contactRows}</div>` : '<p class="muted">زانیاریی پەیوەندی بەم زووانە زیاد دەکرێت.</p>'}
    ${socialLinks(s)}
  </section>
</div>`;

  const o = origin(request, env);
  return layout(ctx, {
    title: cat || (q ? 'گەڕان: ' + q : ''),
    body, bodyClass: 'page-home', url: o + '/',
    image: o + bannerUrl(s)
  });
}

async function renderPost(ctx, post) {
  const { store, settings: s, request, env } = ctx;
  const o = origin(request, env);
  const link = o + '/post/' + post.id;
  const imgs = post.images || [];
  const same = post.category ? (await store.listPosts({ published: true, category: post.category, excludeId: post.id, limit: 3 })).items : [];
  const other = same.length < 3 ? (await store.listPosts({ published: true, excludeId: post.id, limit: 6 })).items.filter(p => !same.some(x => x.id === p.id)) : [];
  const related = same.concat(other).slice(0, 3);

  const gallery = imgs.length ? `<figure class="post-cover reveal">
      <button type="button" class="gal-item" data-full="${upl(imgs[0])}"><img src="${upl(imgs[0])}" alt="${esc(post.title)}"></button>
    </figure>
    ${imgs.length > 1 ? `<div class="gallery">${imgs.slice(1).map(i =>
      `<button type="button" class="gal-item reveal" data-full="${upl(i)}"><img src="${upl(i)}" alt="" loading="lazy"></button>`).join('')}</div>` : ''}` : '';

  const body = `
<div class="post-hero"><img src="${imgs[0] ? upl(imgs[0]) : bannerUrl(s)}" alt=""></div>
<div class="wrap">
  <a class="back-link" href="/#news">→ گەڕانەوە بۆ هەواڵەکان</a>
  <article class="card article reveal">
    <div class="article-meta">
      ${post.category ? `<a class="post-cat static" href="/?cat=${encodeURIComponent(post.category)}#news">${esc(post.category)}</a>` : ''}
      <time datetime="${esc(post.date)}">${formatDate(post.date)}</time>
      ${post.published === false ? '<span class="draft-badge">ڕەشنووس — تەنها تۆ دەیبینیت</span>' : ''}
    </div>
    <h1 class="article-title reveal words">${esc(post.title)}</h1>
    ${gallery}
    <div class="article-body">${formatBody(post.body)}</div>
    <div class="share">
      <span>هاوبەشی بکە:</span>
      <a class="chip" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}" target="_blank" rel="noopener noreferrer">فەیسبووک</a>
      <a class="chip" href="https://wa.me/?text=${encodeURIComponent(post.title + '\n' + link)}" target="_blank" rel="noopener noreferrer">واتساپ</a>
      <a class="chip" href="https://t.me/share/url?url=${encodeURIComponent(link)}&amp;text=${encodeURIComponent(post.title)}" target="_blank" rel="noopener noreferrer">تێلێگرام</a>
      <button type="button" class="chip" data-copy="${esc(link)}">کۆپیکردنی بەستەر</button>
    </div>
  </article>
  ${related.length ? `<section class="related">
    <div class="sec-head reveal"><h2 class="sec-title">بابەتی تر</h2></div>
    <div class="post-grid">${related.map(p => postCard(s, p)).join('')}</div>
  </section>` : ''}
</div>`;

  return layout(ctx, {
    title: post.title, description: excerpt(post.body, 200), url: link,
    image: o + (imgs[0] ? upl(imgs[0]) : bannerUrl(s)), body, bodyClass: 'page-post'
  });
}

function render404(ctx) {
  return layout(ctx, {
    title: 'نەدۆزرایەوە', noindex: true, bodyClass: 'page-404',
    body: `<div class="wrap"><div class="card reveal notfound">
      <img class="about-logo" src="${logoUrl(ctx.settings)}" alt="">
      <h1 class="form-title">٤٠٤</h1>
      <p>ئەم لاپەڕەیە بوونی نییە یان سڕاوەتەوە.</p>
      <a class="btn" href="/">گەڕانەوە بۆ سەرەکی</a>
    </div></div>`
  });
}

async function renderFeed(ctx) {
  const o = origin(ctx.request, ctx.env);
  const { items } = await ctx.store.listPosts({ published: true, limit: 30 });
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>${esc(ctx.settings.siteTitle)}</title>
<link>${o}/</link>
<description>${esc(ctx.settings.tagline)}</description>
<language>ckb</language>
${items.map(p => `<item>
  <title>${esc(p.title)}</title>
  <link>${o}/post/${p.id}</link>
  <guid>${o}/post/${p.id}</guid>
  <pubDate>${new Date((p.date || '1970-01-01') + 'T12:00:00Z').toUTCString()}</pubDate>
  <description>${esc(excerpt(p.body, 400))}</description>
</item>`).join('\n')}
</channel></rss>`;
}

/* ================= چوونەژوورەوە ================= */

// ئەگەر هێشتا کۆدێک دانەنرابێت، بە ADMIN_CODE یان کۆدی دراو دروستی دەکات
export async function ensureAuth(store, code) {
  let auth = await store.kvGet('auth');
  if (!auth && code) {
    const salt = randomHex(16);
    auth = { salt, hash: await hashCode(code, salt), secret: randomHex(32) };
    await store.kvSet('auth', auth);
  }
  return auth;
}

function parseCookies(request) {
  const out = {};
  (request.headers.get('cookie') || '').split(';').forEach(part => {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = part.slice(i + 1).trim();
  });
  return out;
}

async function makeToken(auth) {
  const payload = b64url(JSON.stringify({ exp: Date.now() + SESSION_DAYS * 864e5 }));
  return payload + '.' + await hmac(auth.secret, payload);
}

async function isAdmin(ctx) {
  const auth = ctx.auth;
  const token = parseCookies(ctx.request).puk_admin;
  if (!auth || !token || token.indexOf('.') < 0) return false;
  const [payload, sig] = token.split('.');
  if (!safeEqual(sig, await hmac(auth.secret, payload))) return false;
  try { return JSON.parse(unb64url(payload)).exp > Date.now(); } catch (e) { return false; }
}

async function checkCode(ctx, code) {
  if (typeof code !== 'string' || !code || code.length > 200 || !ctx.auth) return false;
  const h = await hashCode(code, ctx.auth.salt);
  if (safeEqual(h, ctx.auth.hash)) return true;
  return !!ctx.env.ADMIN_CODE && safeEqual(code, ctx.env.ADMIN_CODE);
}

function sessionCookie(request, value, maxAge) {
  const secure = new URL(request.url).protocol === 'https:' || request.headers.get('x-forwarded-proto') === 'https';
  return 'puk_admin=' + value + '; Path=/; HttpOnly; SameSite=Strict; Max-Age=' + maxAge + (secure ? '; Secure' : '');
}

const clientIp = request => request.headers.get('cf-connecting-ip') ||
  (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || request.headers.get('x-client-ip') || 'unknown';

/* ================= وێنەکان ================= */

const IMAGE_TYPES = [
  ['jpg', 'image/jpeg', b => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff],
  ['png', 'image/png', b => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47],
  ['webp', 'image/webp', b => b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50],
  ['gif', 'image/gif', b => b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38]
];
export const UPLOAD_NAME = /^[a-z0-9]{8,40}\.(jpg|png|webp|gif)$/;

async function checkImageNames(store, list) {
  const out = [];
  for (const n of list) {
    if (typeof n !== 'string' || !UPLOAD_NAME.test(n)) throw httpError(400, 'وێنەکە دروست نییە');
    if (!(await store.hasImage(n))) throw httpError(400, 'وێنەیەک نەدۆزرایەوە، دووبارە داینێوە');
    out.push(n);
  }
  return out;
}

/* ================= API ================= */

async function readJson(request) {
  const len = Number(request.headers.get('content-length') || 0);
  if (len > MAX_JSON) throw httpError(413, 'قەبارەی ناردراو زۆر گەورەیە');
  try { return await request.json(); } catch (e) { throw httpError(400, 'داتاکە دروست نییە'); }
}

async function postFromInput(ctx, input, existing) {
  const title = str(input.title, 300).trim();
  if (!title) throw httpError(400, 'ناونیشان پێویستە');
  const images = await checkImageNames(ctx.store, (Array.isArray(input.images) ? input.images : []).slice(0, MAX_IMAGES_PER_POST));
  return {
    id: existing ? existing.id : newId(),
    title,
    body: str(input.body, 100000),
    category: str(input.category, 80).trim(),
    date: /^\d{4}-\d{2}-\d{2}$/.test(input.date || '') ? input.date : today(),
    images,
    featured: !!input.featured,
    published: input.published !== false,
    createdAt: existing ? existing.createdAt : Date.now(),
    updatedAt: Date.now()
  };
}

async function dropImages(ctx, names, keep) {
  const s = ctx.settings;
  for (const n of names) {
    if (n && !keep.includes(n) && n !== s.logo && n !== s.banner) await ctx.store.deleteImage(n);
  }
}

async function handleApi(ctx, url) {
  const { request, store } = ctx;
  const p = url.pathname;
  const method = request.method;

  // پاراستن لە CSRF: داواکارییە گۆڕەرەکان دەبێت لە هەمان سایتەوە بێن
  if (method !== 'GET' && method !== 'HEAD') {
    const o = request.headers.get('origin');
    if (o && o !== 'null' && new URL(o).host !== url.host) throw httpError(403, 'ڕێگەپێنەدراو');
    if (request.headers.get('sec-fetch-site') === 'cross-site') throw httpError(403, 'ڕێگەپێنەدراو');
  }

  if (p === '/api/session' && method === 'GET') return json({ admin: await isAdmin(ctx), configured: !!ctx.auth });

  if (p === '/api/login' && method === 'POST') {
    if (!ctx.auth) throw httpError(503, 'کۆدی چوونەژوورەوە هێشتا دانەنراوە. ADMIN_CODE لە ڕێکخستنی سێرڤەر دابنێ.');
    const key = 'fail:' + clientIp(request);
    const rec = await store.kvGet(key);
    const fresh = rec && Date.now() - rec.first < 15 * 60e3;
    if (fresh && rec.count >= 8) throw httpError(429, 'هەوڵی زۆرت دا. پاش ١٥ خولەک دووبارە هەوڵ بدەرەوە.');
    const { code } = await readJson(request);
    if (!(await checkCode(ctx, code))) {
      await store.kvSet(key, fresh ? { count: rec.count + 1, first: rec.first } : { count: 1, first: Date.now() });
      await new Promise(r => setTimeout(r, 600));
      throw httpError(401, 'کۆدەکە هەڵەیە');
    }
    if (rec) await store.kvDel(key);
    return json({ ok: true }, 200, { 'Set-Cookie': sessionCookie(request, await makeToken(ctx.auth), SESSION_DAYS * 86400) });
  }

  if (p === '/api/logout' && method === 'POST') {
    return json({ ok: true }, 200, { 'Set-Cookie': sessionCookie(request, '', 0) });
  }

  if (!p.startsWith('/api/admin/')) throw httpError(404, 'نەدۆزرایەوە');
  if (!(await isAdmin(ctx))) throw httpError(401, 'پێویستە سەرەتا بچیتە ژوورەوە');

  // وێنە یەک بە یەک دەنێردرێت (بایتی ڕاستەوخۆ، نەک JSON) — خێراتر و سووکتر
  if (p === '/api/admin/images' && method === 'POST') {
    const len = Number(request.headers.get('content-length') || 0);
    if (len > MAX_IMAGE) throw httpError(413, 'وێنەکە زۆر گەورەیە (زیاتر لە ١.٩ مێگابایت)');
    const bytes = new Uint8Array(await request.arrayBuffer());
    if (!bytes.length) throw httpError(400, 'وێنەکە بەتاڵە');
    if (bytes.length > MAX_IMAGE) throw httpError(413, 'وێنەکە زۆر گەورەیە (زیاتر لە ١.٩ مێگابایت)');
    const t = IMAGE_TYPES.find(([, , magic]) => magic(bytes));
    if (!t) throw httpError(400, 'تەنها JPG، PNG، WEBP و GIF وەردەگیرێن');
    const name = Date.now().toString(36) + randomHex(8) + '.' + t[0];
    await store.putImage(name, t[1], bytes);
    return json({ name }, 201);
  }

  if (p === '/api/admin/posts' && method === 'GET') return json({ posts: await store.adminList() });

  if (p === '/api/admin/posts' && method === 'POST') {
    const post = await postFromInput(ctx, await readJson(request));
    if (post.featured) await store.clearFeatured();
    await store.putPost(post);
    return json({ post }, 201);
  }

  const m = /^\/api\/admin\/posts\/([a-z0-9]+)$/.exec(p);
  if (m) {
    const old = await store.getPost(m[1]);
    if (!old) throw httpError(404, 'بابەتەکە نەدۆزرایەوە');
    if (method === 'GET') return json({ post: old });
    if (method === 'PUT') {
      const post = await postFromInput(ctx, await readJson(request), old);
      if (post.featured) await store.clearFeatured();
      await store.putPost(post);
      await dropImages(ctx, old.images || [], post.images);
      return json({ post });
    }
    if (method === 'DELETE') {
      await store.deletePost(old.id);
      await dropImages(ctx, old.images || [], []);
      return json({ ok: true });
    }
  }

  if (p === '/api/admin/settings' && method === 'GET') {
    return json({ settings: ctx.settings, envCode: !!ctx.env.ADMIN_CODE });
  }

  if (p === '/api/admin/settings' && method === 'PUT') {
    const input = await readJson(request);
    const next = { ...ctx.settings };
    for (const k of Object.keys(DEFAULT_SETTINGS)) {
      if (k === 'logo' || k === 'banner' || k === 'categories' || !(k in input)) continue;
      next[k] = str(input[k], k === 'about' ? 20000 : 500).trim();
    }
    for (const [k] of SOCIALS) {
      if (next[k] && !/^https?:\/\//.test(next[k])) next[k] = 'https://' + next[k];
    }
    if (Array.isArray(input.categories)) {
      next.categories = [...new Set(input.categories.map(c => str(c, 80).trim()).filter(Boolean))].slice(0, 30);
    }
    if (!next.siteTitle) next.siteTitle = DEFAULT_SETTINGS.siteTitle;
    if (!next.shortTitle) next.shortTitle = next.siteTitle;
    for (const k of ['logo', 'banner']) {
      if (k in input) next[k] = input[k] ? (await checkImageNames(store, [input[k]]))[0] : '';
    }
    const old = ctx.settings;
    await store.kvSet('settings', next);
    ctx.settings = next;
    for (const k of ['logo', 'banner']) {
      if (old[k] && old[k] !== next[k] && !(await store.imageUsedByPost(old[k]))) await store.deleteImage(old[k]);
    }
    return json({ settings: next });
  }

  if (p === '/api/admin/code' && method === 'PUT') {
    const { current, next } = await readJson(request);
    if (!(await checkCode(ctx, current))) throw httpError(401, 'کۆدی ئێستا هەڵەیە');
    if (typeof next !== 'string' || next.length < 6) throw httpError(400, 'کۆدی نوێ دەبێت لانیکەم ٦ پیت بێت');
    const auth = { salt: randomHex(16), secret: randomHex(32) }; // هەموو چوونەژوورەوەکانی تر دەچنە دەرەوە
    auth.hash = await hashCode(next, auth.salt);
    await store.kvSet('auth', auth);
    return json({ ok: true }, 200, { 'Set-Cookie': sessionCookie(request, await makeToken(auth), SESSION_DAYS * 86400) });
  }

  throw httpError(404, 'نەدۆزرایەوە');
}

/* ================= ڕێڕەوکردن ================= */

async function route(ctx) {
  const url = new URL(ctx.request.url);
  let p;
  try { p = decodeURIComponent(url.pathname); } catch (e) { p = '/'; }
  const method = ctx.request.method;

  if (p.startsWith('/api/')) return handleApi(ctx, url);
  if (method !== 'GET' && method !== 'HEAD') throw httpError(405, 'ڕێگەپێنەدراو');

  if (p.startsWith('/uploads/')) {
    const name = p.slice(9);
    const img = UPLOAD_NAME.test(name) && await ctx.store.getImage(name);
    if (!img) return respond('Not found', 404, 'text/plain; charset=utf-8');
    return new Response(img.bytes, { headers: {
      'Content-Type': img.type, 'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff'
    } });
  }

  if (p === '/') return html(await renderHome(ctx, url));

  const pm = /^\/post\/([a-z0-9]+)\/?$/.exec(p);
  if (pm) {
    const post = await ctx.store.getPost(pm[1]);
    if (post && (post.published !== false || await isAdmin(ctx))) return html(await renderPost(ctx, post));
    return html(render404(ctx), 404);
  }

  if (p === '/feed.xml') return respond(await renderFeed(ctx), 200, 'application/rss+xml; charset=utf-8', { 'Cache-Control': 'no-cache' });
  if (p === '/robots.txt') {
    return respond('User-agent: *\nDisallow: /admin\nDisallow: /api/\nSitemap: ' + origin(ctx.request, ctx.env) + '/sitemap.xml\n', 200, 'text/plain; charset=utf-8');
  }
  if (p === '/sitemap.xml') {
    const o = origin(ctx.request, ctx.env);
    const { items } = await ctx.store.listPosts({ published: true, limit: 1000 });
    return respond(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>${o}/</loc></url>
${items.map(x => `<url><loc>${o}/post/${x.id}</loc><lastmod>${esc(x.date)}</lastmod></url>`).join('\n')}
</urlset>`, 200, 'application/xml; charset=utf-8');
  }

  return html(render404(ctx), 404);
}

export async function handle(request, env, store) {
  const ctx = { request, env: env || {}, store, settings: { ...DEFAULT_SETTINGS }, auth: null };
  try {
    ctx.settings = { ...DEFAULT_SETTINGS, ...((await store.kvGet('settings')) || {}) };
    ctx.auth = await ensureAuth(store, ctx.env.ADMIN_CODE);
    return await route(ctx);
  } catch (err) {
    const status = err.status || 500;
    if (status === 500) console.error(err && err.stack || err);
    const message = status === 500 ? 'هەڵەیەک لە سێرڤەر ڕوویدا' : err.message;
    if (new URL(request.url).pathname.startsWith('/api/')) return json({ error: message }, status);
    return html('<!DOCTYPE html><meta charset="utf-8"><p dir="rtl" style="font-family:sans-serif;padding:20px">' + esc(message) + '</p>', status);
  }
}
