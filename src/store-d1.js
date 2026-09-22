/* پاشەکەوتکردن لە Cloudflare D1 — بابەت، وێنە و ڕێکخستنەکان هەموویان لە یەک داتابەیسدان.
   خشتەکان یەکەمجار خۆکار دروست دەبن، پێویست بە هیچ فەرمانێک نییە. */

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS posts (id TEXT PRIMARY KEY, title TEXT NOT NULL, body TEXT, category TEXT, date TEXT,
     images TEXT, featured INTEGER DEFAULT 0, published INTEGER DEFAULT 1, created_at INTEGER, updated_at INTEGER)`,
  `CREATE INDEX IF NOT EXISTS posts_order ON posts (published, date DESC, created_at DESC)`,
  `CREATE TABLE IF NOT EXISTS images (name TEXT PRIMARY KEY, type TEXT NOT NULL, data BLOB NOT NULL, created_at INTEGER)`,
  `CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY, value TEXT)`
];

const ORDER = ' ORDER BY date DESC, created_at DESC';

function rowToPost(r) {
  return {
    id: r.id, title: r.title, body: r.body || '', category: r.category || '', date: r.date,
    images: JSON.parse(r.images || '[]'), featured: !!r.featured, published: !!r.published,
    createdAt: r.created_at, updatedAt: r.updated_at
  };
}

let ready = null;

export function d1Store(db) {
  const init = () => ready || (ready = db.batch(SCHEMA.map(s => db.prepare(s))).catch(e => { ready = null; throw e; }));
  const q = (sql, ...args) => db.prepare(sql).bind(...args);

  const store = {
    async kvGet(key) {
      await init();
      const r = await q('SELECT value FROM kv WHERE key = ?', key).first();
      return r ? JSON.parse(r.value) : null;
    },
    async kvSet(key, value) {
      await init();
      await q('INSERT INTO kv (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value', key, JSON.stringify(value)).run();
    },
    async kvDel(key) { await q('DELETE FROM kv WHERE key = ?', key).run(); },

    async listPosts({ published, category, q: search, excludeId, limit = 12, offset = 0 }) {
      await init();
      const where = [], args = [];
      if (published) where.push('published = 1');
      if (category) { where.push('category = ?'); args.push(category); }
      if (excludeId) { where.push('id != ?'); args.push(excludeId); }
      if (search) {
        const like = '%' + search.replace(/[\\%_]/g, c => '\\' + c) + '%';
        where.push("(title LIKE ? ESCAPE '\\' OR body LIKE ? ESCAPE '\\')");
        args.push(like, like);
      }
      const w = where.length ? ' WHERE ' + where.join(' AND ') : '';
      const total = (await q('SELECT COUNT(*) AS n FROM posts' + w, ...args).first()).n;
      if (!limit) return { total, items: [] };
      const { results } = await q('SELECT id, title, substr(body, 1, 600) AS body, category, date, images, featured, published, created_at, updated_at FROM posts' +
        w + ORDER + ' LIMIT ? OFFSET ?', ...args, limit, offset).all();
      return { total, items: results.map(rowToPost) };
    },

    async featuredPost() {
      await init();
      const r = await q('SELECT * FROM posts WHERE published = 1 ORDER BY featured DESC, date DESC, created_at DESC LIMIT 1').first();
      return r ? rowToPost(r) : null;
    },

    async adminList() {
      await init();
      const { results } = await q('SELECT id, title, \'\' AS body, category, date, images, featured, published, created_at, updated_at FROM posts' + ORDER).all();
      return results.map(rowToPost);
    },

    async getPost(id) {
      await init();
      const r = await q('SELECT * FROM posts WHERE id = ?', id).first();
      return r ? rowToPost(r) : null;
    },

    async putPost(p) {
      await init();
      await q(`INSERT INTO posts (id, title, body, category, date, images, featured, published, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
               ON CONFLICT(id) DO UPDATE SET title = excluded.title, body = excluded.body, category = excluded.category,
               date = excluded.date, images = excluded.images, featured = excluded.featured, published = excluded.published,
               updated_at = excluded.updated_at`,
        p.id, p.title, p.body, p.category, p.date, JSON.stringify(p.images), p.featured ? 1 : 0, p.published ? 1 : 0,
        p.createdAt, p.updatedAt).run();
    },

    async deletePost(id) { await init(); await q('DELETE FROM posts WHERE id = ?', id).run(); },
    async clearFeatured() { await init(); await q('UPDATE posts SET featured = 0 WHERE featured = 1').run(); },

    async putImage(name, type, bytes) {
      await init();
      await q('INSERT INTO images (name, type, data, created_at) VALUES (?, ?, ?, ?)', name, type, bytes, Date.now()).run();
    },
    async getImage(name) {
      await init();
      const r = await q('SELECT type, data FROM images WHERE name = ?', name).first();
      return r ? { type: r.type, bytes: new Uint8Array(r.data) } : null;
    },
    async hasImage(name) {
      await init();
      return !!(await q('SELECT 1 AS x FROM images WHERE name = ?', name).first());
    },
    async imageUsedByPost(name) {
      return !!(await q('SELECT 1 AS x FROM posts WHERE images LIKE ? LIMIT 1', '%"' + name + '"%').first());
    },
    async deleteImage(name) { await q('DELETE FROM images WHERE name = ?', name).run(); }
  };
  return store;
}
