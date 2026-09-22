/* پاشەکەوتکردن لە فایل — بۆ کارپێکردن لەسەر کۆمپیوتەر یان VPS بە Node.js */
import fs from 'node:fs';
import path from 'node:path';

const fsp = fs.promises;
const MIME = { jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif' };

export async function fileStore(dir) {
  const uploads = path.join(dir, 'uploads');
  await fsp.mkdir(uploads, { recursive: true });
  const postsFile = path.join(dir, 'posts.json');
  const kvFile = path.join(dir, 'kv.json');

  const read = async (f, d) => { try { return JSON.parse(await fsp.readFile(f, 'utf8')); } catch (e) { if (e.code === 'ENOENT') return d; throw e; } };
  let posts = await read(postsFile, []);
  let kv = await read(kvFile, {});

  // نووسینی سەلامەت: فایلی کاتی و پاشان ناوگۆڕین، یەک لە دوای یەک
  let chain = Promise.resolve();
  const write = (file, data) => {
    const job = chain.then(async () => {
      const tmp = file + '.' + process.pid + '.tmp';
      await fsp.writeFile(tmp, JSON.stringify(data, null, 2));
      await fsp.rename(tmp, file);
    });
    chain = job.catch(() => {});
    return job;
  };
  const sort = () => posts.sort((a, b) => (b.date || '').localeCompare(a.date || '') || b.createdAt - a.createdAt);
  sort();

  return {
    async kvGet(key) { return key in kv ? kv[key] : null; },
    async kvSet(key, value) { kv[key] = value; await write(kvFile, kv); },
    async kvDel(key) { delete kv[key]; await write(kvFile, kv); },

    async listPosts({ published, category, q, excludeId, limit = 12, offset = 0 }) {
      const needle = (q || '').toLowerCase();
      const list = posts.filter(p => (!published || p.published !== false) && (!category || p.category === category) &&
        (!excludeId || p.id !== excludeId) && (!needle || (p.title + ' ' + p.body).toLowerCase().includes(needle)));
      return { total: list.length, items: limit ? list.slice(offset, offset + limit) : [] };
    },
    async featuredPost() {
      const pub = posts.filter(p => p.published !== false);
      return pub.find(p => p.featured) || pub[0] || null;
    },
    async adminList() { return posts.map(p => ({ ...p, body: '' })); },
    async getPost(id) { return posts.find(p => p.id === id) || null; },
    async putPost(post) {
      const i = posts.findIndex(p => p.id === post.id);
      if (i >= 0) posts[i] = post; else posts.push(post);
      sort();
      await write(postsFile, posts);
    },
    async deletePost(id) { posts = posts.filter(p => p.id !== id); await write(postsFile, posts); },
    async clearFeatured() { posts.forEach(p => { p.featured = false; }); await write(postsFile, posts); },

    async putImage(name, type, bytes) { await fsp.writeFile(path.join(uploads, name), bytes); },
    async getImage(name) {
      try { return { type: MIME[name.split('.').pop()], bytes: await fsp.readFile(path.join(uploads, name)) }; }
      catch (e) { return null; }
    },
    async hasImage(name) { return fs.existsSync(path.join(uploads, name)); },
    async imageUsedByPost(name) { return posts.some(p => (p.images || []).includes(name)); },
    async deleteImage(name) { await fsp.unlink(path.join(uploads, name)).catch(() => {}); }
  };
}
