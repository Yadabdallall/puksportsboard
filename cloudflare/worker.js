/*
 * PUK Sports Board — Cloudflare Worker
 * ─────────────────────────────────────────────────────────────────────────
 * Everything the admin panel saves lives in Cloudflare (no GitHub):
 *   • news + site settings  → D1 database (binding name: DB)
 *   • photos / videos       → the same D1 database, stored in 1 MB pieces
 * The website pages themselves are served from your Cloudflare Pages site
 * (SITE_ORIGIN) through this Worker, so the site and /api/ share one address.
 *
 * Settings → Variables and Secrets:
 *   ADMIN_CODE   (Secret)  the admin lock code, e.g. sport2026
 *   SITE_ORIGIN  (Text)    your Pages address, e.g. https://oukils.pages.dev
 * Settings → Bindings:
 *   D1 database, variable name  DB
 *
 * Routes
 *   GET  /api/ping                     is the Worker configured?
 *   GET  /api/news   GET /api/site     { data, rev }
 *   PUT  /api/news   PUT /api/site     { data, rev }        (admin)
 *   POST /api/login                    { code } → { token }
 *   POST /api/code                     { code } → { token } (admin, change code)
 *   POST /api/media?path=news/x.jpg    body = file bytes     (admin)
 *   DELETE /api/media?path=news/x.jpg                        (admin)
 *   GET  /media/<path>                 the stored file
 *   everything else                    proxied from SITE_ORIGIN
 */

const PART = 1000000;                 // D1 rows are limited to 2 MB → store files in 1 MB pieces
const MAX_FILE = 25 * 1024 * 1024;    // 25 MB per photo / video
const MAX_DOC = 1024 * 1024;          // 1 MB of JSON for news or settings
const SESSION_HOURS = 12;
const MAX_FAILS = 8, LOCK_MINUTES = 15;
const DOCS = ['news', 'site'];
const MEDIA_TYPES = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif',
  mp4: 'video/mp4', m4v: 'video/mp4', mov: 'video/quicktime', webm: 'video/webm' };

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    try {
      if (url.pathname.startsWith('/api/')) return await api(request, env, url);
      if (url.pathname.startsWith('/media/')) return await media(request, env, url, ctx);
      return await proxy(request, env, url);
    } catch (e) {
      return json({ error: 'server', detail: String((e && e.message) || e) }, 500);
    }
  }
};

/* ─── helpers ─── */
function json(obj, status = 200, extra = {}) {
  return new Response(JSON.stringify(obj), {
    status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...extra }
  });
}
const enc = new TextEncoder();
function b64url(bytes) {
  let s = ''; bytes = new Uint8Array(bytes);
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function sameText(a, b) {                       // constant-time comparison
  a = enc.encode(String(a)); b = enc.encode(String(b));
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a[i] || 0) ^ (b[i] || 0);
  return diff === 0;
}

let ready = null;
function db(env) {
  if (!env.DB) { const e = new Error('The D1 binding "DB" is missing (Settings → Bindings → D1 database → DB).'); e.status = 503; throw e; }
  if (!ready) {
    ready = env.DB.batch([
      env.DB.prepare('CREATE TABLE IF NOT EXISTS docs (key TEXT PRIMARY KEY, value TEXT NOT NULL, rev INTEGER NOT NULL DEFAULT 0, updated INTEGER)'),
      env.DB.prepare('CREATE TABLE IF NOT EXISTS media (path TEXT NOT NULL, part INTEGER NOT NULL, type TEXT, total INTEGER, data BLOB, PRIMARY KEY (path, part))'),
      env.DB.prepare('CREATE TABLE IF NOT EXISTS fails (ip TEXT PRIMARY KEY, n INTEGER NOT NULL, until INTEGER NOT NULL)')
    ]).catch(e => { ready = null; throw e; });
  }
  return ready.then(() => env.DB);
}
async function getDoc(env, key) {
  const d = await db(env);
  return d.prepare('SELECT value, rev FROM docs WHERE key = ?').bind(key).first();
}

/* ─── sessions: HMAC-signed expiry, invalidated when the code changes ─── */
async function sessionKey(env) {
  const auth = await getDoc(env, 'auth');
  const material = [env.ADMIN_CODE || '', auth ? auth.value : '', env.SESSION_SECRET || ''].join('|');
  return crypto.subtle.importKey('raw', enc.encode(material), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}
async function makeToken(env) {
  const exp = String(Date.now() + SESSION_HOURS * 3600e3);
  const sig = await crypto.subtle.sign('HMAC', await sessionKey(env), enc.encode(exp));
  return exp + '.' + b64url(sig);
}
async function isAdmin(request, env) {
  const m = /^Bearer (\d+)\.([\w-]+)$/.exec(request.headers.get('authorization') || '');
  if (!m || +m[1] < Date.now()) return false;
  const sig = await crypto.subtle.sign('HMAC', await sessionKey(env), enc.encode(m[1]));
  return sameText(b64url(sig), m[2]);
}
async function pbkdf2(code, salt) {
  const base = await crypto.subtle.importKey('raw', enc.encode(code), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: enc.encode(salt), iterations: 100000, hash: 'SHA-256' }, base, 256);
  return b64url(bits);
}
async function codeIsRight(env, code) {
  const auth = await getDoc(env, 'auth');           // a code changed from the admin panel
  if (auth) { const a = JSON.parse(auth.value); return sameText(await pbkdf2(code, a.salt), a.hash); }
  return !!env.ADMIN_CODE && sameText(code, env.ADMIN_CODE);
}

/* ─── API ─── */
async function api(request, env, url) {
  const route = url.pathname.replace(/^\/api\//, '').replace(/\/+$/, '');
  const method = request.method;

  if (route === 'ping') {
    let dbOk = true; try { await db(env); } catch (e) { dbOk = false; }
    return json({ ok: true, configured: dbOk && !!(env.ADMIN_CODE || (dbOk && await getDoc(env, 'auth'))), db: dbOk, origin: !!env.SITE_ORIGIN });
  }

  if (DOCS.includes(route) && method === 'GET') {
    const row = await getDoc(env, route);
    if (row) return json({ data: JSON.parse(row.value), rev: row.rev });
    /* nothing saved yet → start from the file shipped with the site */
    let data = route === 'news' ? { items: [] } : {};
    if (env.SITE_ORIGIN) {
      try {
        const r = await fetch(new URL('/data/' + route + '.json', env.SITE_ORIGIN), { cf: { cacheTtl: 0 } });
        if (r.ok) data = await r.json();
      } catch (e) {}
    }
    return json({ data, rev: 0 });
  }

  if (route === 'login' && method === 'POST') {
    const d = await db(env);
    if (!env.ADMIN_CODE && !(await getDoc(env, 'auth'))) return json({ error: 'not-configured', detail: 'ADMIN_CODE is not set' }, 503);
    const ip = request.headers.get('cf-connecting-ip') || 'unknown';
    const now = Date.now();
    const f = await d.prepare('SELECT n, until FROM fails WHERE ip = ?').bind(ip).first();
    if (f && f.n >= MAX_FAILS && f.until > now) return json({ error: 'too-many', retry: Math.ceil((f.until - now) / 1000) }, 429);
    let body = {}; try { body = await request.json(); } catch (e) {}
    if (await codeIsRight(env, String(body.code || ''))) {
      await d.prepare('DELETE FROM fails WHERE ip = ?').bind(ip).run();
      return json({ token: await makeToken(env), hours: SESSION_HOURS });
    }
    const n = f && f.until > now ? f.n + 1 : 1;
    await d.prepare('INSERT INTO fails (ip, n, until) VALUES (?, ?, ?) ON CONFLICT(ip) DO UPDATE SET n = excluded.n, until = excluded.until')
      .bind(ip, n, now + LOCK_MINUTES * 60e3).run();
    await new Promise(r => setTimeout(r, 600));        // slow down guessing
    return json({ error: 'wrong-code', left: Math.max(0, MAX_FAILS - n) }, 401);
  }

  /* everything below needs a valid admin session */
  if (!(await isAdmin(request, env))) return json({ error: 'unauthorized' }, 401);

  if (DOCS.includes(route) && method === 'PUT') {
    const text = await request.text();
    if (text.length > MAX_DOC) return json({ error: 'too-large' }, 413);
    let body; try { body = JSON.parse(text); } catch (e) { return json({ error: 'bad-json' }, 400); }
    const data = body && body.data;
    if (!data || typeof data !== 'object' || (route === 'news' && !Array.isArray(data.items))) return json({ error: 'bad-data' }, 400);
    const d = await db(env), value = JSON.stringify(data), rev = +body.rev || 0, now = Date.now();
    /* only save on top of the version the editor read — otherwise 409 and the panel re-reads */
    const res = rev === 0
      ? await d.prepare('INSERT INTO docs (key, value, rev, updated) VALUES (?, ?, 1, ?) ON CONFLICT(key) DO NOTHING').bind(route, value, now).run()
      : await d.prepare('UPDATE docs SET value = ?, rev = rev + 1, updated = ? WHERE key = ? AND rev = ?').bind(value, now, route, rev).run();
    if (!res.meta || !res.meta.changes) return json({ error: 'conflict' }, 409);
    return json({ ok: true, rev: rev + 1 });
  }

  if (route === 'code' && method === 'POST') {
    let body = {}; try { body = await request.json(); } catch (e) {}
    const code = String(body.code || '');
    if (code.length < 8) return json({ error: 'too-short' }, 400);
    const salt = b64url(crypto.getRandomValues(new Uint8Array(16)));
    const value = JSON.stringify({ salt, hash: await pbkdf2(code, salt) });
    await (await db(env)).prepare('INSERT INTO docs (key, value, rev, updated) VALUES (\'auth\', ?, 1, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, rev = docs.rev + 1, updated = excluded.updated')
      .bind(value, Date.now()).run();
    return json({ ok: true, token: await makeToken(env) });   // older sessions stop working
  }

  if (route === 'media') {
    const path = cleanPath(url.searchParams.get('path'));
    if (!path) return json({ error: 'bad-path' }, 400);
    const d = await db(env);
    const forget = () => caches.default.delete(new Request(url.origin + '/media/' + path)).catch(() => {});
    if (method === 'DELETE') {
      await d.prepare('DELETE FROM media WHERE path = ?').bind(path).run();
      await forget();
      return json({ ok: true });
    }
    if (method === 'POST') {
      const bytes = new Uint8Array(await request.arrayBuffer());
      if (!bytes.length) return json({ error: 'empty' }, 400);
      if (bytes.length > MAX_FILE) return json({ error: 'too-large' }, 413);
      const type = MEDIA_TYPES[path.split('.').pop().toLowerCase()];
      await d.prepare('DELETE FROM media WHERE path = ?').bind(path).run();
      for (let i = 0, part = 0; i < bytes.length; i += PART, part++) {
        await d.prepare('INSERT INTO media (path, part, type, total, data) VALUES (?, ?, ?, ?, ?)')
          .bind(path, part, type, bytes.length, bytes.slice(i, i + PART)).run();
      }
      await forget();
      return json({ ok: true, url: 'media/' + path });
    }
  }

  return json({ error: 'not-found' }, 404);
}
function cleanPath(p) {
  p = String(p || '').replace(/^\/+/, '');
  if (!/^[a-z0-9][a-z0-9._\/-]{0,160}$/i.test(p) || p.includes('..')) return '';
  return MEDIA_TYPES[p.split('.').pop().toLowerCase()] ? p : '';
}

/* ─── stored photos / videos (with Range support so iPhone Safari can play videos) ─── */
async function media(request, env, url, ctx) {
  const path = cleanPath(decodeURIComponent(url.pathname.replace(/^\/media\//, '')));
  if (!path) return new Response('Not found', { status: 404 });
  const cache = caches.default, key = new Request(url.origin + '/media/' + path);
  const range = request.headers.get('range');
  if (!range) { const hit = await cache.match(key); if (hit) return hit; }
  const d = await db(env);
  const rows = await d.prepare('SELECT type, total, data FROM media WHERE path = ? ORDER BY part').bind(path).all();
  if (!rows.results || !rows.results.length) return new Response('Not found', { status: 404 });
  const total = rows.results[0].total, type = rows.results[0].type || 'application/octet-stream';
  const all = new Uint8Array(total);
  let off = 0;
  for (const r of rows.results) { const chunk = new Uint8Array(r.data); all.set(chunk, off); off += chunk.length; }
  const headers = { 'content-type': type, 'accept-ranges': 'bytes', 'cache-control': 'public, max-age=31536000, immutable' };
  const m = range && /^bytes=(\d*)-(\d*)$/.exec(range);
  if (m) {
    let start = m[1] === '' ? Math.max(0, total - +m[2]) : +m[1];
    let end = m[1] !== '' && m[2] !== '' ? Math.min(+m[2], total - 1) : total - 1;
    if (start > end || start >= total) return new Response(null, { status: 416, headers: { 'content-range': 'bytes */' + total } });
    return new Response(all.slice(start, end + 1), { status: 206, headers: { ...headers, 'content-range': `bytes ${start}-${end}/${total}`, 'content-length': String(end - start + 1) } });
  }
  const res = new Response(all, { headers: { ...headers, 'content-length': String(total) } });
  ctx.waitUntil(cache.put(key, res.clone()).catch(() => {}));
  return res;
}

/* ─── the website itself, fetched from the Pages site ─── */
async function proxy(request, env, url) {
  if (!env.SITE_ORIGIN) return new Response('SITE_ORIGIN is not set (Settings → Variables and Secrets).', { status: 500 });
  if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('Method not allowed', { status: 405 });
  const origin = new URL(env.SITE_ORIGIN);
  const target = new URL(url.pathname + url.search, origin);
  const headers = new Headers(request.headers);
  headers.delete('host');
  const res = await fetch(target, { method: request.method, headers, redirect: 'manual' });
  const out = new Response(res.body, res);
  const loc = res.headers.get('location');
  if (loc) {
    const l = new URL(loc, target);
    if (l.host === origin.host) { l.protocol = url.protocol; l.host = url.host; out.headers.set('location', l.toString()); }
  }
  return out;
}
