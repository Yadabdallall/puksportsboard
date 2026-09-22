/* دەروازەی Cloudflare Workers — فایلە جێگیرەکان (css/js/fonts/img/admin) لە public/ ـەوە
   ڕاستەوخۆ لەلایەن Cloudflare ـەوە دەنێردرێن، هەموو شتێکی تر دێتە ئێرە. */
import { handle } from './app.js';
import { d1Store } from './store-d1.js';

export default {
  async fetch(request, env, ctx) {
    if (!env.DB) {
      return new Response('داتابەیسی D1 نەبەستراوەتەوە (binding: DB). بڕوانە README.', {
        status: 500, headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }
    const url = new URL(request.url);

    // وێنەکان هەرگیز ناگۆڕدرێن، بۆیە لە کاشی Cloudflare هەڵدەگیرێن تا داتابەیس کەمتر بخوێندرێتەوە
    if (request.method === 'GET' && url.pathname.startsWith('/uploads/')) {
      const cache = caches.default;
      const hit = await cache.match(request);
      if (hit) return hit;
      const res = await handle(request, env, d1Store(env.DB));
      if (res.ok) ctx.waitUntil(cache.put(request, res.clone()));
      return res;
    }

    return handle(request, env, d1Store(env.DB));
  }
};
