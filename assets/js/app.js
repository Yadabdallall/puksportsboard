/* Engineerpedia — rendering, i18n, router, motion and image loaders */
(function () {
  'use strict';

  var C = window.CORE, ICONS = window.ICONS;
  var D = C.depts, byId = {};
  D.forEach(function (d, i) { d.idx = i; byId[d.id] = d; });
  var SW_IDS = [];
  D.forEach(function (d) { d.sw.forEach(function (s) { if (SW_IDS.indexOf(s) < 0 && C.sw[s]) SW_IDS.push(s); }); });

  var ACCENT = '#FFB81C';
  var reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var LANG_KEY = 'eng-lang';
  var HTML_LANG = { ku: 'ckb', ar: 'ar', en: 'en', de: 'de' };
  var LOADER_TX = { ku: 'کڵاوەکەت ئامادە دەکەین…', ar: 'نُجهّز خوذتك…', en: 'Preparing your helmet…', de: 'Dein Helm wird vorbereitet…' };
  var STYLE_EN = ['Cap style', 'Full brim', 'Vented', 'Climbing helmet', 'Bump cap', 'Combo kit', 'Mining helmet', 'Firefighter helmet'];
  var STD_KEYS = ['ANSI/ISEA Z89.1', 'EN 397', 'EN 50365', 'EN 12492', 'EN 812'];
  var TYPE_KEYS = [['Type I', ['top']], ['Type II', ['top', 'side']]];
  var CLASS_KEYS = [['Class G', 11], ['Class E', 100], ['Class C', 0]];
  var SW_SHOW = 21;

  var lang = 'ku';

  /* ───────────── helpers ───────────── */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function pad(n) { return n < 10 ? '0' + n : String(n); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function fmt(s, o) { return String(s == null ? '' : s).replace(/\{(\w+)\}/g, function (m, k) { return o[k] != null ? o[k] : m; }); }
  function rgb(hex) { var n = parseInt(hex.replace('#', ''), 16); return ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255); }
  function lum(hex) {
    var p = rgb(hex).split(',').map(function (v) { v = v / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2];
  }
  function ink(hex) { return lum(hex) > 0.36 ? '#0a1220' : '#ffffff'; }
  function vars(color) { return '--c:' + color + ';--c-rgb:' + rgb(color) + ';--c-ink:' + ink(color); }
  function icon(name, cls) {
    return '<svg class="ic' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS.get(name) + '</svg>';
  }
  function wikiUrl(t) { return 'https://en.wikipedia.org/wiki/' + encodeURIComponent(t.replace(/ /g, '_')); }
  function googleUrl(q) { return 'https://www.google.com/search?tbm=isch&q=' + encodeURIComponent(q); }
  function initials(en) {
    return en.replace(/[^A-Za-z .]/g, '').split(/[ .]+/).filter(Boolean).map(function (w) { return w[0]; }).slice(0, 2).join('').toUpperCase();
  }
  function mono(name) {
    var w = name.replace(/[^A-Za-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean);
    return (w.length > 1 ? w[0][0] + w[1][0] : name.replace(/[^A-Za-z0-9]/g, '').slice(0, 2)).toUpperCase();
  }
  function firstSentence(s) {
    s = String(s || '');
    var m = s.match(/^[\s\S]*?[.!?؟](\s|$)/);
    return m ? m[0].trim() : s;
  }
  function get(o, path) {
    var p = path.split('.');
    for (var i = 0; i < p.length; i++) { if (o == null) return undefined; o = o[p[i]]; }
    return o;
  }

  /* ───────────── i18n ───────────── */
  window.I18N = window.I18N || {};
  function L() { return I18N[lang] || {}; }
  function K() { return I18N.ku || {}; }
  function ui(path) { var v = get(L().ui, path); return v != null ? v : (get(K().ui, path) != null ? get(K().ui, path) : ''); }
  function part(key) { return L()[key] || K()[key]; }
  function dt(id) { return (L().depts || {})[id] || (K().depts || {})[id] || {}; }
  function swt(id) { return (L().sw || {})[id] || (K().sw || {})[id] || null; }
  function isEn() { return lang === 'en'; }
  function dName(d) { return dt(d.id).n || d.en; }
  function cname(d) { return dt(d.id).cname || ''; }
  function helmetOf(d) { return fmt(ui('helmetOf'), { c: cname(d) }); }

  var loaded = {};
  function loadScript(src) {
    if (loaded[src]) return loaded[src];
    loaded[src] = new Promise(function (res) {
      var s = document.createElement('script');
      s.src = src; s.charset = 'utf-8';
      s.onload = function () { res(true); };
      s.onerror = function () { res(false); };
      document.head.appendChild(s);
    });
    return loaded[src];
  }
  function loadLang(l) {
    var files = ['ui'].concat(D.map(function (d) { return d.id; }), ['sw']);
    return Promise.all(files.map(function (f) {
      return loadScript('assets/data/' + l + '/' + f + '.js').then(function (ok) {
        return ok || l === 'ku' ? ok : loadScript('assets/data/ku/' + f + '.js');
      });
    }));
  }

  /* Two-tone headings: 'first|second' → words that rise one by one */
  var wordIdx = 0;
  function words(s) {
    return String(s).trim().split(/\s+/).map(function (w) {
      return '<span class="w"><span style="--i:' + (wordIdx++) + '">' + esc(w) + '</span></span>';
    }).join(' ');
  }
  function splitHTML(s) { wordIdx = 0; return words(s); }
  function longWord(s) { return Math.max.apply(null, String(s).split(/[\s\-–—/]+/).map(function (w) { return w.length; })); }
  function h2(s, tag) {
    var i = String(s).indexOf('|'); wordIdx = 0;
    var a = i < 0 ? s : s.slice(0, i), b = i < 0 ? '' : s.slice(i + 1);
    return '<' + (tag || 'h2') + ' class="h2 split">' + words(a) + (b ? ' <span class="t2">' + words(b) + '</span>' : '') + '</' + (tag || 'h2') + '>';
  }
  function scrub(s, cls) {
    return '<p class="scrub ' + (cls || '') + '">' + String(s).trim().split(/\s+/).map(function (w) { return '<span class="sw">' + esc(w) + '</span>'; }).join(' ') + '</p>';
  }
  function eyebrow(n, label, extra) {
    return '<span class="eyebrow">' + (n == null ? '' : '<span class="num">/' + pad(n) + '</span><span class="bar"></span>') + '<span>' + esc(label) + '</span>' + (extra ? '<bdi class="num" dir="ltr">' + esc(extra) + '</bdi>' : '') + '</span>';
  }
  function secHead(n, key, extra) {
    var s = ui('sec.' + key) || {};
    return '<header class="sec-head">' + eyebrow(n, s.eyebrow) + h2(s.title) + (s.lead ? scrub(s.lead, 'lead') : '') + (extra || '') + '</header>';
  }

  /* ───────────── realistic helmet (SVG) ───────────── */
  var DOME = 'M36 124C36 70 72 28 120 28C168 28 204 70 204 124C204 130.6 166 136 120 136C74 136 36 130.6 36 124Z';
  var BRIM = 'M16 126C16 112 60 104 120 104C180 104 224 112 224 126C224 140 176 152 120 152C64 152 16 140 16 126Z';
  var EDGE = 'M16 126C16 140 64 152 120 152C176 152 224 140 224 126L224 131C224 146 176 158 120 158C64 158 16 146 16 131Z';
  var RIB = 'M108.5 30.5C105.5 45 104.5 58 106 72Q120 78.5 134 72C135.5 58 134.5 45 131.5 30.5Q120 27.6 108.5 30.5Z';
  function helmet(color, o) {
    o = o || {};
    var badge = o.icon ? '<circle cx="120" cy="101" r="17.5" fill="#04101f" fill-opacity=".34" stroke="#fff" stroke-opacity=".5" stroke-width="1.4"/>' +
      '<g transform="translate(107.4 88.4) scale(1.05)" fill="none" stroke="#fff" stroke-opacity=".95" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + ICONS.get(o.icon) + '</g>' : '';
    return '<svg class="helmet' + (o.cls ? ' ' + o.cls : '') + '" viewBox="0 16 240 164" style="--hc:' + color + ';--hc-rgb:' + rgb(color) + '" aria-hidden="true">' +
      '<ellipse class="h-shadow" cx="120" cy="170" rx="98" ry="7"/>' +
      '<path class="hc" d="' + EDGE + '"/><path class="o-edge" d="' + EDGE + '"/>' +
      '<path class="hc" d="' + BRIM + '"/><path class="o-brim" d="' + BRIM + '"/>' +
      '<path class="s-rim" d="M16 126C16 140 64 152 120 152C176 152 224 140 224 126"/>' +
      '<path class="hc" d="' + DOME + '"/><path class="o-side" d="' + DOME + '"/><path class="o-sh" d="' + DOME + '"/><path class="o-hi" d="' + DOME + '"/>' +
      '<path class="o-band" d="M38 117C60 125 180 125 202 117L204 124C204 130.6 166 136 120 136C74 136 36 130.6 36 124Z"/>' +
      '<path class="s-lip" d="M40 121C66 129 174 129 200 121"/>' +
      '<path class="s-rib" d="M93 35C81 49 74 64 71 82M147 35C159 49 166 64 169 82"/>' +
      '<path class="s-ribhi" d="M90.6 34.6C78.6 48.6 71.6 63.6 68.6 81.6M149.4 35.4C161.4 49.4 168.4 64.4 171.4 82.4"/>' +
      '<path class="hc" d="' + RIB + '"/><path class="o-rib" d="' + RIB + '"/>' +
      '<path class="s-ribhi" d="M108.5 30.5C105.5 45 104.5 58 106 72"/><path class="s-rib" d="M131.5 30.5C134.5 45 135.5 58 134 72"/>' +
      badge +
      '<ellipse class="spec" cx="80" cy="60" rx="20" ry="8" transform="rotate(-42 80 60)"/>' +
      '<ellipse class="spec2" cx="69" cy="80" rx="5" ry="2.2" transform="rotate(-58 69 80)"/>' +
      '</svg>';
  }

  /* ───────────── images: Wikipedia / Wikimedia (engineers, projects, software) ───────────── */
  var IMG = (function () {
    var API = 'https://en.wikipedia.org/w/api.php';
    var KEY = 'eng-img-v2', TTL = 1000 * 60 * 60 * 24 * 14;
    var store = {};
    try { store = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { store = {}; }
    var pending = {}, saveTimer = null;
    function save() { clearTimeout(saveTimer); saveTimer = setTimeout(function () { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {} }, 400); }
    function cached(k) { var v = store[k]; return v && Date.now() - v.t < TTL ? v : null; }
    function put(k, url) { store[k] = { u: url || '', t: Date.now() }; save(); }
    function params(o) {
      o.format = 'json'; o.formatversion = '2'; o.origin = '*';
      return Object.keys(o).map(function (k) { return k + '=' + encodeURIComponent(o[k]); }).join('&');
    }
    function batch(titles) {
      var url = API + '?' + params({ action: 'query', prop: 'pageimages', piprop: 'thumbnail', pithumbsize: '500', pilimit: '50', redirects: '1', titles: titles.join('|') });
      return fetch(url).then(function (r) { return r.json(); }).then(function (j) {
        var q = j.query || {}, map = {}, out = {}, pages = {};
        titles.forEach(function (t) { map[t] = t; });
        (q.normalized || []).forEach(function (n) { titles.forEach(function (t) { if (map[t] === n.from) map[t] = n.to; }); });
        (q.redirects || []).forEach(function (n) { titles.forEach(function (t) { if (map[t] === n.from) map[t] = n.to; }); });
        (q.pages || []).forEach(function (p) { pages[p.title] = p; });
        titles.forEach(function (t) { var p = pages[map[t]]; out[t] = p && p.thumbnail ? p.thumbnail.source : null; });
        return out;
      });
    }
    function search(q) {
      var url = API + '?' + params({ action: 'query', generator: 'search', gsrsearch: q, gsrlimit: '3', gsrnamespace: '0', prop: 'pageimages', piprop: 'thumbnail', pithumbsize: '500' });
      return fetch(url).then(function (r) { return r.json(); }).then(function (j) {
        var pages = (j.query && j.query.pages) || [];
        pages.sort(function (a, b) { return (a.index || 0) - (b.index || 0); });
        for (var i = 0; i < pages.length; i++) if (pages[i].thumbnail) return pages[i].thumbnail.source;
        return null;
      }).catch(function () { return null; });
    }
    function apply(img, url) {
      var fig = img.closest('.ph');
      if (!url) { if (fig) fig.classList.add('noimg'); img.remove(); return; }
      img.onload = function () { img.classList.add('ok'); if (fig) fig.classList.add('loaded'); };
      img.onerror = function () { if (fig) fig.classList.add('noimg'); img.remove(); };
      img.src = url;
    }
    function fill(root) {
      var imgs = $$('img.wimg:not([data-state])', root);
      if (!imgs.length) return;
      var need = {}, groups = {};
      imgs.forEach(function (img) {
        img.setAttribute('data-state', '1');
        var w = img.getAttribute('data-wiki'), q = img.getAttribute('data-q') || w;
        var c = cached(w);
        if (c) { apply(img, c.u); return; }
        (groups[w] = groups[w] || []).push(img);
        need[w] = q;
      });
      var titles = Object.keys(need).filter(function (t) { return !pending[t]; });
      for (var i = 0; i < titles.length; i += 45) {
        (function (ch) {
          var p = batch(ch).then(function (res) {
            var misses = ch.filter(function (t) { return !res[t]; });
            return Promise.all(misses.map(function (t) { return search(need[t]).then(function (u) { res[t] = u; }); })).then(function () { return res; });
          }).catch(function () { return null; });
          ch.forEach(function (t) { pending[t] = p; });
        })(titles.slice(i, i + 45));
      }
      Object.keys(groups).forEach(function (t) {
        var p = pending[t];
        if (!p) return;
        p.then(function (res) {
          var url = res ? res[t] : null;
          if (res) put(t, url);
          groups[t].forEach(function (img) { apply(img, url); });
          if (res) delete pending[t];
        });
      });
    }
    return { fill: fill };
  })();
  function wimg(wiki, q, alt) {
    return '<img class="wimg" alt="' + esc(alt) + '" data-wiki="' + esc(wiki) + '"' + (q ? ' data-q="' + esc(q) + '"' : '') + ' loading="lazy" decoding="async" referrerpolicy="no-referrer">';
  }
  function lazyFill(root) {
    if (!('IntersectionObserver' in window)) { IMG.fill(root); return; }
    var io = new IntersectionObserver(function (en) {
      if (en.some(function (e) { return e.isIntersecting; })) { IMG.fill(root); io.disconnect(); }
    }, { rootMargin: '700px 0px' });
    io.observe(root);
  }

  /* Pexels photos: try each id until one loads */
  function pexImg(ids, w, cls) {
    return '<img class="pex' + (cls ? ' ' + cls : '') + '" alt="" data-pex="' + ids.join(',') + '" data-w="' + (w || 800) + '" loading="lazy" decoding="async" referrerpolicy="no-referrer">';
  }
  function hydratePex(root) {
    $$('img.pex:not([data-state])', root).forEach(function (img) {
      img.setAttribute('data-state', '1');
      var ids = img.getAttribute('data-pex').split(','), w = img.getAttribute('data-w'), i = 0;
      img.onload = function () { img.classList.add('ok'); };
      img.onerror = function () { i++; if (i < ids.length) img.src = C.pexels(ids[i], w); else img.remove(); };
      img.src = C.pexels(ids[0], w);
    });
  }
  function pexBg(ids, w, cb) {
    var i = 0;
    (function next() {
      if (i >= ids.length) return;
      var url = C.pexels(ids[i], w), im = new Image();
      im.referrerPolicy = 'no-referrer';
      im.onload = function () { cb(url); };
      im.onerror = function () { i++; next(); };
      im.src = url;
    })();
  }

  /* Software logos (Simple Icons) with a gradient monogram fallback */
  function logo(id, big) {
    var s = C.sw[id];
    return '<span class="logo' + (big ? ' lg' : '') + '"><span class="mono">' + esc(mono(s.name)) + '</span>' +
      (s.si ? '<img class="si" alt="" data-si="' + esc(s.si) + '" loading="lazy" decoding="async">' : '') + '</span>';
  }
  function hydrateLogos(root) {
    $$('img.si:not([data-state])', root).forEach(function (img) {
      img.setAttribute('data-state', '1');
      img.onload = function () { if (img.naturalWidth > 0) img.parentNode.classList.add('has-img'); };
      img.onerror = function () { img.remove(); };
      img.src = 'https://cdn.simpleicons.org/' + img.getAttribute('data-si') + '/white';
    });
  }
  function hydrate(root) { hydratePex(root); hydrateLogos(root); }

  /* ───────────── motion ───────────── */
  var revealIO = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      revealIO.unobserve(en.target);
      if (en.target.hasAttribute('data-count')) countUp(en.target);
      $$('[data-count]', en.target).forEach(countUp);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }) : null;

  function observe(root) {
    $$('.rv, .split', root).forEach(function (el) { if (revealIO) revealIO.observe(el); else el.classList.add('in'); });
    collect();
  }
  function countUp(el) {
    if (el.getAttribute('data-done')) return;
    el.setAttribute('data-done', '1');
    var to = +el.getAttribute('data-count'), suf = el.getAttribute('data-suffix') || '';
    if (reduce) { el.innerHTML = to + (suf ? '<em>' + suf + '</em>' : ''); return; }
    var t0 = performance.now(), dur = 1600;
    (function step(now) {
      var k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 4);
      el.innerHTML = Math.round(to * e) + (suf ? '<em>' + suf + '</em>' : '');
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }

  var pxEls = [], scrubEls = [], quoteBg = null;
  function collect() {
    pxEls = $$('[data-px], [data-py]').filter(function (el) { return !el.closest('[hidden]'); });
    scrubEls = $$('.scrub').filter(function (el) { return !el.closest('[hidden]'); }).map(function (el) { return { el: el, w: $$('.sw', el), last: -1 }; });
    quoteBg = $('#home:not([hidden]) .quote-bg');
  }
  var lastY = -1, lastH = -1, tickerX = 0, tickerHalf = 0;
  function frame() {
    var y = window.scrollY, vh = window.innerHeight;
    if (y !== lastY || vh !== lastH) {
      lastY = y; lastH = vh;
      document.documentElement.style.setProperty('--sy', y.toFixed(1));
      var max = document.documentElement.scrollHeight - vh;
      $('#progress').style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
      var tb = $('#topbar'); if (tb) tb.classList.toggle('scrolled', y > 30);
      if (!reduce) {
        pxEls.forEach(function (el) {
          var host = el.parentNode.getBoundingClientRect();
          if (host.bottom < -300 || host.top > vh + 300) return;
          var c = host.top + host.height / 2 - vh / 2;
          var px = +(el.getAttribute('data-px') || 0), py = +(el.getAttribute('data-py') || 0);
          var ty = el.hasAttribute('data-abs') ? y * py : c * py;
          el.style.transform = 'translate3d(' + (c * px).toFixed(1) + 'px,' + ty.toFixed(1) + 'px,0)';
        });
        if (quoteBg) {
          var qr = quoteBg.parentNode.getBoundingClientRect();
          if (qr.bottom > 0 && qr.top < vh) quoteBg.style.setProperty('--qy', ((qr.top + qr.height / 2 - vh / 2) * -0.12).toFixed(1));
        }
      }
      /* scroll-scrubbed paragraphs: words light up one by one */
      scrubEls.forEach(function (s) {
        var r = s.el.getBoundingClientRect();
        if (r.bottom < -50 || r.top > vh + 50) return;
        var p = Math.max(0, Math.min(1, (vh * 0.88 - r.top) / (r.height + vh * 0.38)));
        if (reduce) p = 1;
        if (Math.abs(p - s.last) < 0.002) return;
        s.last = p;
        var n = s.w.length, head = p * (n + 6);
        for (var i = 0; i < n; i++) {
          var o = Math.max(0.16, Math.min(1, (head - i) / 6));
          s.w[i].style.setProperty('--o', o.toFixed(2));
        }
      });
    }
    var tk = $('#ticker');
    if (tk && !reduce && !tk.closest('[hidden]')) {
      var v = window.BG ? Math.abs(BG.velocity()) : 0;
      tickerX -= 0.5 + Math.min(v, 60) * 0.14;
      if (!tickerHalf) tickerHalf = tk.scrollWidth / 2;
      if (tickerHalf > 0 && -tickerX > tickerHalf) tickerX += tickerHalf;
      tk.style.transform = 'translate3d(' + tickerX.toFixed(1) + 'px,0,0)';
    }
    requestAnimationFrame(frame);
  }

  function setAccent(color) {
    var r = document.documentElement.style;
    r.setProperty('--accent', color);
    r.setProperty('--accent-rgb', rgb(color));
    r.setProperty('--accent-ink', ink(color));
    if (window.BG) BG.setColor(color);
  }

  /* ───────────── chrome: top bar & footer ───────────── */
  function renderTopbar() {
    var cur = C.langs.filter(function (l) { return l.id === lang; })[0];
    $('#topbar').innerHTML =
      '<a class="brand" href="#/" aria-label="' + esc(ui('brand')) + '"><span class="brand-helmet">' + helmet(ACCENT, { cls: 'glow' }) + '</span>' +
      '<span class="brand-tx"><b>' + esc(ui('brand')) + '</b><small>' + esc(ui('brandSub')) + '</small></span></a>' +
      '<nav class="nav" id="nav">' +
      [['departments', 'depts'], ['colors', 'colors'], ['safety', 'safety'], ['software', 'software'], ['legends', 'legends']].map(function (n) {
        return '<a href="#' + n[0] + '">' + esc(ui('nav.' + n[1])) + '</a>';
      }).join('') + '<a class="nav-cta" href="#quiz">' + esc(ui('nav.quiz')) + '</a></nav>' +
      '<div class="lang" id="lang"><button class="lang-btn" id="langBtn" aria-haspopup="true" aria-expanded="false" aria-label="' + esc(ui('lang')) + '">' + icon('globe') + '<span>' + esc(cur.label) + '</span><b>' + cur.short + '</b></button>' +
      '<div class="lang-menu" role="menu">' + C.langs.map(function (l) {
        return '<button role="menuitem" data-lang="' + l.id + '" class="' + (l.id === lang ? 'on' : '') + '" lang="' + HTML_LANG[l.id] + '" dir="' + l.dir + '"><span>' + esc(l.label) + '</span><small>' + l.short + '</small></button>';
      }).join('') + '</div></div>' +
      '<button class="menu-btn" id="menuBtn" aria-label="Menu" aria-expanded="false" aria-controls="nav">' + icon('menu') + icon('close') + '</button>';
  }
  function renderFooter() {
    var f = ui('footer') || {};
    $('#footer').innerHTML =
      '<div class="foot-in"><div class="foot-brand"><b>' + esc(ui('brand')) + '</b><p>' + esc(f.about) + '</p></div>' +
      '<div class="foot-note"><p>' + esc(f.img) + '</p><p>' + esc(f.helmet) + '</p></div>' +
      '<button class="to-top" id="toTop">' + icon('up') + esc(f.top) + '</button></div>' +
      '<div class="credit"><span>' + esc(f.credit) + '<span class="dot"></span></span><span class="num">© 2026 · ' + esc(ui('brand')) + '</span></div>';
  }

  /* ───────────── home ───────────── */
  var heroIdx = 0, heroTimer = null;
  function heroSet(i) {
    heroIdx = (i + D.length) % D.length;
    var d = D[heroIdx], svg = $('#heroHelmet svg');
    if (!svg) return;
    svg.style.setProperty('--hc', d.color);
    svg.style.setProperty('--hc-rgb', rgb(d.color));
    var badge = $('g[transform]', svg);
    if (badge) badge.innerHTML = ICONS.get(d.icon);
    var lab = $('#heroLabel');
    lab.classList.remove('swap'); void lab.offsetWidth; lab.classList.add('swap');
    $('#heroDept').textContent = dName(d);
    $('#heroColor').textContent = helmetOf(d);
    $('#heroNum').textContent = pad(heroIdx + 1) + ' / ' + D.length;
    $('#heroStage').style.cssText = vars(d.color);
    if (!$('#home').hidden && window.BG) BG.setColor(d.color);
  }
  function heroStart() { if (heroTimer || reduce) return; heroTimer = setInterval(function () { heroSet(heroIdx + 1); }, 2800); }
  function heroStop() { clearInterval(heroTimer); heroTimer = null; }
  var heroIO = null;

  function typeDiagram(dirs) {
    var a = '<g class="arr"><path d="M120 -14V20"/><path d="M112 12l8 9 8-9"/></g>';
    if (dirs.indexOf('side') > -1) a += '<g class="arr"><path d="M-14 95H24"/><path d="M16 87l9 8-9 8"/></g><g class="arr"><path d="M254 95H216"/><path d="M224 87l-9 8 9 8"/></g>';
    return '<svg class="type-svg" viewBox="0 16 240 164" aria-hidden="true">' + a + '</svg>';
  }

  function renderHome() {
    var h = '', title = ui('heroTitle') || ['', '', ''];
    /* hero */
    h += '<section class="hero" id="top"><div class="hero-tx">' +
      '<p class="kicker"><span class="blink"></span>' + esc(ui('heroKicker')) + '</p>' +
      '<h1 class="hero-title">' +
      '<span class="line" data-py="-0.1" data-abs><span class="split">' + splitHTML(title[0]) + '</span></span>' +
      '<span class="line acc" data-py="-0.18" data-abs><span class="split">' + splitHTML(title[1]) + '</span></span>' +
      '<span class="line" data-py="-0.26" data-abs><span class="split">' + splitHTML(title[2]) + '</span></span></h1>' +
      '<p class="hero-lead rv" style="--d:300ms">' + esc(ui('heroLead')) + '</p>' +
      '<div class="hero-cta rv" style="--d:450ms"><a class="btn primary" href="#departments">' + esc(ui('ctaDepts')) + icon('arrow', 'flip') + '</a>' +
      '<a class="btn ghost" href="#quiz">' + icon('cap') + esc(ui('ctaQuiz')) + '</a></div></div>' +
      '<div class="hero-stage" id="heroStage" role="button" tabindex="0" aria-label="' + esc(ui('stageHint')) + '">' +
      '<div class="rings" aria-hidden="true"><span></span><span></span><span></span><span></span></div>' +
      '<div class="stage-dim top" aria-hidden="true">R 120</div><div class="stage-dim side" aria-hidden="true">H 164</div>' +
      '<div class="stage-helmet" id="heroHelmet">' + helmet(D[0].color, { cls: 'glow', icon: D[0].icon }) + '</div>' +
      '<div class="stage-label" id="heroLabel"><span class="num" id="heroNum"></span><b id="heroDept"></b><small id="heroColor"></small></div>' +
      '<span class="stage-hint">' + esc(ui('stageHint')) + '</span></div>' +
      '<a class="scroll-cue" href="#intro" aria-label="↓"><span></span></a></section>';

    /* ticker */
    var tk = D.map(function (d) {
      return '<span class="tk" style="' + vars(d.color) + '"><span class="o">' + esc(dName(d)) + '</span><i></i><span class="f">' + esc(helmetOf(d)) + '</span><i></i></span>';
    }).join('');
    h += '<div class="ticker" aria-hidden="true"><div class="ticker-track" id="ticker">' + tk + tk + '</div></div>';

    /* intro + stats */
    var brCount = 0, engCount = 0, projCount = 0;
    D.forEach(function (d) { brCount += d.br.length; engCount += d.eng.length; d.eng.forEach(function (e) { projCount += e.p.length; }); });
    var st = ui('stats') || {};
    h += '<section class="sec" id="intro">' + secHead(1, 'intro') +
      '<div class="stats">' + [[D.length, st.depts, 'civil', ''], [brCount, st.branches, 'branch', '+'], [engCount, st.engineers, 'star', ''], [projCount, st.projects, 'pin', '+'], [SW_IDS.length, st.software, 'code', '']].map(function (s, i) {
        return '<div class="stat glass rv" style="--d:' + i * 90 + 'ms">' + icon(s[2]) + '<b data-count="' + s[0] + '" data-suffix="' + s[3] + '">0</b><span>' + esc(s[1]) + '</span></div>';
      }).join('') + '</div>' +
      '<div class="bigword" data-px="-0.4" aria-hidden="true">ENGINEERING</div></section>';

    /* quote */
    var q = ui('quote') || {};
    h += '<section class="quote" id="quote"><div class="quote-in rv"><div class="quote-bg" id="quoteBg"></div><span class="quote-mark" aria-hidden="true">“</span>' +
      '<div class="quote-body"><span class="quote-label">' + icon('quote') + esc(q.label) + '</span>' +
      '<blockquote class="quote-text split">' + splitHTML(q.text) + '</blockquote>' +
      '<div class="quote-by"><span class="qh">' + helmet(D[0].color, { cls: 'glow', icon: 'civil' }) + '</span><div><b>' + esc(q.by) + '</b><span>' + esc(q.role) + '</span></div></div></div></div></section>';

    /* helmet colors */
    h += '<section class="sec" id="colors">' + secHead(2, 'colors') + '<div class="helmet-rail">' + D.map(function (d, i) {
      return '<a class="hchip rv" href="#/dept/' + d.id + '" style="' + vars(d.color) + ';--d:' + (i % 7) * 60 + 'ms"><span class="hchip-helmet">' + helmet(d.color, { cls: 'glow', icon: d.icon }) + '</span>' +
        '<b>' + esc(cname(d)) + '</b><small>' + esc(dName(d)) + '</small></a>';
    }).join('') + '</div></section>';

    /* departments */
    h += '<section class="sec" id="departments">' + secHead(3, 'depts') +
      '<label class="search rv">' + icon('search') + '<span class="sr-only">' + esc(ui('nav.depts')) + '</span><input id="deptSearch" type="search" placeholder="' + esc(ui('search')) + '" autocomplete="off"></label>' +
      '<div class="dept-grid" id="deptGrid"></div>' +
      '<div class="bigword" data-px="0.4" aria-hidden="true">DESIGN · BUILD · INNOVATE</div></section>';

    /* safety */
    var hm = part('helmet') || {}, sf = ui('safety') || {}, ppe = part('ppe') || {};
    h += '<section class="sec" id="safety">' + secHead(4, 'safety') +
      '<h3 class="sub rv">' + icon('helmet') + esc(sf.codes) + '</h3><p class="note rv">' + esc(sf.codesNote) + '</p>' +
      '<div class="code-grid">' + (hm.codes || []).map(function (c, i) {
        var col = C.helmetCodes[i];
        return '<div class="code rv" style="' + vars(col) + ';--d:' + (i % 5) * 60 + 'ms"><span class="code-h">' + helmet(col) + '</span><b>' + esc(c.n) + '</b><p>' + esc(c.r) + '</p></div>';
      }).join('') + '</div>' +
      '<div class="two"><div><h3 class="sub rv">' + icon('shield') + esc(sf.types) + '</h3><div class="type-grid">' + (hm.types || []).map(function (t, i) {
        return '<div class="type rv" style="--d:' + i * 90 + 'ms"><div class="type-vis">' + helmet(ACCENT) + typeDiagram(TYPE_KEYS[i][1]) + '</div><span class="tkey">' + TYPE_KEYS[i][0] + '</span><b>' + esc(t.n) + '</b><p>' + esc(t.d) + '</p></div>';
      }).join('') + '</div></div>' +
      '<div><h3 class="sub rv">' + icon('elec') + esc(sf.classes) + '</h3><div class="class-grid">' + (hm.classes || []).map(function (c, i) {
        return '<div class="klass rv" style="--d:' + i * 80 + 'ms;--v:' + CLASS_KEYS[i][1] + '%"><div class="klass-top">' + icon('elec') + '<span class="tkey">' + CLASS_KEYS[i][0] + '</span></div><b>' + esc(c.n) + '</b><div class="volt"><i></i></div><span class="vtx">' + esc(c.v) + '</span><p>' + esc(c.d) + '</p></div>';
      }).join('') + '</div></div></div>' +
      '<h3 class="sub rv">' + icon('layers') + esc(sf.styles) + '</h3><div class="style-grid">' + (hm.styles || []).map(function (s, i) {
        return '<div class="hstyle rv" style="--d:' + (i % 4) * 60 + 'ms"><span class="num">/' + pad(i + 1) + '</span><b>' + esc(s.n) + '</b>' + (isEn() ? '' : '<em>' + STYLE_EN[i] + '</em>') + '<p>' + esc(s.d) + '</p></div>';
      }).join('') + '</div>' +
      '<div class="two"><div class="panel glass rv"><h3 class="sub">' + icon('shield') + esc(sf.standards) + '</h3><ul class="std">' + (hm.standards || []).map(function (s, i) {
        return '<li><span class="k">' + STD_KEYS[i] + '</span>' + esc(s) + '</li>';
      }).join('') + '</ul></div>' +
      '<div class="panel glass rv"><h3 class="sub">' + icon('info') + esc(sf.care) + '</h3><ul class="care">' + (hm.care || []).map(function (c) {
        return '<li>' + icon('check') + '<span>' + esc(c) + '</span></li>';
      }).join('') + '</ul></div></div>' +
      '<h3 class="sub rv">' + icon('vest') + esc(sf.ppe) + '</h3><p class="note rv">' + esc(sf.ppeNote) + '</p>' +
      '<div class="ppe-grid">' + C.ppeKeys.map(function (k, i) {
        var p = ppe[k] || {}, used = D.filter(function (d) { return d.ppe.indexOf(k) > -1; });
        return '<div class="ppe rv spot" style="--d:' + (i % 6) * 50 + 'ms"><span class="ppe-ic">' + icon(k) + '</span><b>' + esc(p.n) + '</b><p>' + esc(p.d) + '</p>' +
          (used.length ? '<span class="ppe-dots">' + used.map(function (d) { return '<i title="' + esc(dName(d)) + '" style="background:' + d.color + '"></i>'; }).join('') + '</span>' : '') + '</div>';
      }).join('') + '</div>' +
      '<div class="bigword" data-px="-0.4" aria-hidden="true">SAFETY FIRST</div></section>';

    /* software gallery */
    h += '<section class="sec" id="software">' + secHead(5, 'software') +
      '<div class="sw-filter rv" id="swFilter"><button class="on" data-f="">' + esc(ui('swAll')) + ' <span class="num">' + SW_IDS.length + '</span></button>' +
      D.map(function (d) { return '<button data-f="' + d.id + '" style="' + vars(d.color) + '"><i></i>' + esc(dName(d)) + '</button>'; }).join('') + '</div>' +
      '<div class="sw-gallery collapsed" id="swGallery">' + SW_IDS.map(function (id, i) {
        var s = C.sw[id], d = D.filter(function (x) { return x.sw.indexOf(id) > -1; })[0];
        return '<button class="swt rv' + (i >= SW_SHOW ? ' x' : '') + '" data-sw="' + id + '" data-c="' + d.color + '" style="' + vars(d.color) + ';--d:' + (i % 6) * 40 + 'ms">' + logo(id) + '<b>' + esc(s.name) + '</b><small>' + esc(s.by) + '</small></button>';
      }).join('') + '</div><div class="sw-more-wrap"><button class="btn ghost" id="swMore">' + icon('layers') + esc(ui('swMore')) + ' <span class="num">+' + (SW_IDS.length - SW_SHOW) + '</span></button></div></section>';

    /* legends */
    var all = [];
    D.forEach(function (d) { d.eng.forEach(function (e, i) { all.push({ e: e, d: d, i: i }); }); });
    var half = Math.ceil(all.length / 2);
    function row(items) {
      var html = items.map(function (x) {
        var nm = isEn() ? x.e.en : ((dt(x.d.id).eng || [])[x.i] || {}).n || x.e.en;
        return '<a class="leg" href="#/dept/' + x.d.id + '/eng-' + x.i + '" style="' + vars(x.d.color) + '">' +
          '<span class="leg-ph ph">' + wimg(x.e.w, x.e.en + ' engineer', x.e.en) + '<span class="ph-fb">' + esc(initials(x.e.en)) + '</span></span>' +
          '<span class="leg-tx"><b>' + esc(nm) + '</b><small>' + esc(dName(x.d)) + '</small></span></a>';
      }).join('');
      return html + html;
    }
    h += '<section class="sec" id="legends">' + secHead(6, 'legends') +
      '<div class="legs"><div class="leg-row"><div class="leg-track">' + row(all.slice(0, half)) + '</div></div>' +
      '<div class="leg-row rev"><div class="leg-track">' + row(all.slice(half)) + '</div></div></div></section>';

    /* quiz */
    h += '<section class="sec" id="quiz">' + secHead(7, 'quiz') + '<div class="quiz glass rv" id="quizBox" aria-live="polite"></div></section>';

    /* other fields */
    h += '<section class="sec" id="others">' + secHead(8, 'others') + '<div class="others-grid">' + (part('others') || []).map(function (o, i) {
      return '<div class="other rv" style="--d:' + (i % 5) * 70 + 'ms"><span class="num">/' + pad(i + 1) + '</span><b>' + esc(o.n) + '</b><p>' + esc(o.d) + '</p></div>';
    }).join('') + '</div></section>';

    var home = $('#home');
    home.innerHTML = h;
    heroSet(heroIdx);
    renderGrid('');
    renderQuiz();
    hydrate(home);
    lazyFill($('#legends'));
    pexBg([C.quotePhoto, C.heroPhoto], 1600, function (url) {
      var bg = $('#quoteBg'); if (!bg) return;
      bg.style.backgroundImage = 'url("' + url + '")'; bg.classList.add('ok');
    });
    observe(home);
    if (heroIO) heroIO.disconnect();
    if ('IntersectionObserver' in window) {
      heroIO = new IntersectionObserver(function (en) { if (en[0].isIntersecting && !home.hidden) heroStart(); else heroStop(); });
      heroIO.observe($('#heroStage'));
    } else heroStart();
    tickerHalf = 0;
  }

  function renderGrid(q) {
    q = (q || '').trim().toLowerCase();
    var list = D.filter(function (d) {
      if (!q) return true;
      var t = dt(d.id);
      var hay = [dName(d), d.en, cname(d), t.tag, (t.br || []).map(function (b) { return b.join(' '); }).join(' '), d.br.join(' '),
        d.sw.map(function (s) { return C.sw[s] ? C.sw[s].name : s; }).join(' ')].join(' ').toLowerCase();
      return hay.indexOf(q) > -1;
    });
    var cd = ui('card') || {}, grid = $('#deptGrid');
    grid.innerHTML = list.length ? list.map(function (d, i) {
      var t = dt(d.id);
      return '<a class="dcard spot" href="#/dept/' + d.id + '" style="' + vars(d.color) + ';--d:' + (i % 4) * 70 + 'ms">' +
        '<span class="dcard-cover">' + pexImg(d.cover, 900) + '</span>' +
        '<span class="dcard-top"><span class="dnum num">/' + pad(d.idx + 1) + '</span><span class="dicon">' + icon(d.icon) + '</span></span>' +
        '<span class="dcard-helmet">' + helmet(d.color, { cls: 'glow', icon: d.icon }) + '</span>' +
        '<span class="dcard-body"><h3>' + esc(dName(d)) + '</h3>' + (isEn() ? '' : '<em class="den">' + esc(d.en) + '</em>') +
        '<span class="dtag">' + esc(t.tag) + '</span>' +
        '<span class="dmeta"><span>' + d.br.length + ' ' + esc(cd.branches) + '</span><span>' + d.years + ' ' + esc(cd.years) + '</span><span><i></i>' + esc(helmetOf(d)) + '</span></span>' +
        '<span class="dgo">' + esc(cd.enter) + icon('arrow', 'flip') + '</span></span></a>';
    }).join('') : '<p class="empty">' + esc(ui('empty')) + '</p>';
    $$('.dcard', grid).forEach(function (c) {
      c.classList.add('rv');
      if (revealIO && !q) revealIO.observe(c); else c.classList.add('in');
    });
    hydrate(grid);
  }

  /* ───────────── quiz ───────────── */
  var quiz = { i: 0, s: {}, max: {} };
  C.quiz.forEach(function (qs) {
    var best = {};
    qs.forEach(function (a) { Object.keys(a).forEach(function (k) { best[k] = Math.max(best[k] || 0, a[k]); }); });
    Object.keys(best).forEach(function (k) { quiz.max[k] = (quiz.max[k] || 0) + best[k]; });
  });
  function renderQuiz() {
    var box = $('#quizBox'); if (!box) return;
    var Q = part('quiz') || [], qz = ui('quiz') || {};
    if (quiz.i >= C.quiz.length) return renderQuizResult(box, qz);
    var q = Q[quiz.i] || { q: '', a: [] };
    box.innerHTML =
      '<div class="qz-top"><span class="num">' + pad(quiz.i + 1) + ' / ' + pad(C.quiz.length) + '</span><div class="qz-bar"><i style="width:' + (quiz.i / C.quiz.length * 100) + '%"></i></div></div>' +
      '<h3 class="qz-q">' + esc(q.q) + '</h3>' +
      '<div class="qz-opts">' + C.quiz[quiz.i].map(function (a, i) {
        return '<button class="qz-opt" data-i="' + i + '"><span class="num">' + (i + 1) + '</span>' + esc(q.a[i] || '') + '</button>';
      }).join('') + '</div>' +
      (quiz.i > 0 ? '<button class="qz-reset">' + icon('refresh') + esc(qz.restart) + '</button>' : '');
    box.classList.remove('qz-anim'); void box.offsetWidth; box.classList.add('qz-anim');
  }
  function renderQuizResult(box, qz) {
    var ranked = D.map(function (d) {
      var sc = quiz.s[d.id] || 0, mx = quiz.max[d.id] || 1;
      return { d: d, sc: sc, pct: Math.round(sc / mx * 100) };
    }).sort(function (a, b) { return b.pct - a.pct || b.sc - a.sc; }).slice(0, 3);
    box.innerHTML =
      '<div class="qz-top">' + icon('check') + '<div class="qz-bar"><i style="width:100%"></i></div></div>' +
      '<h3 class="qz-q">' + esc(qz.result) + '</h3>' +
      '<div class="qz-res">' + ranked.map(function (r, i) {
        return '<a class="qz-card" href="#/dept/' + r.d.id + '" style="' + vars(r.d.color) + '"><span class="qz-rank num">/' + pad(i + 1) + '</span>' +
          '<span class="qz-helmet">' + helmet(r.d.color, { cls: 'glow', icon: r.d.icon }) + '</span><b>' + esc(dName(r.d)) + '</b>' +
          '<span class="qz-pct"><i style="width:' + r.pct + '%"></i></span><small><span class="num">' + r.pct + '%</span> ' + esc(qz.match) + '</small></a>';
      }).join('') + '</div>' +
      '<p class="qz-note">' + esc(qz.note) + '</p>' +
      '<button class="qz-reset">' + icon('refresh') + esc(qz.again) + '</button>';
    box.classList.remove('qz-anim'); void box.offsetWidth; box.classList.add('qz-anim');
  }

  /* ───────────── software modal ───────────── */
  var modalReturn = null;
  function openSw(id) {
    var s = C.sw[id]; if (!s) return;
    var tx = swt(id) || {}, si = ui('sw') || {};
    var used = D.filter(function (d) { return d.sw.indexOf(id) > -1; });
    var color = (used[0] || {}).color || ACCENT;
    var m = $('#modal');
    modalReturn = document.activeElement;
    m.style.cssText = vars(color);
    m.innerHTML = '<div class="modal-veil" data-close></div><div class="modal-box" role="document">' +
      '<button class="modal-close" data-close aria-label="' + esc(si.close) + '">' + icon('close') + '</button>' +
      '<div class="mh">' + logo(id, true) + '<div><h3>' + esc(s.name) + '</h3><div class="meta"><span>' + icon('company') + esc(si.maker) + ': ' + esc(s.by) + '</span><span>' + icon('calendar') + esc(si.since) + ': <span class="num">' + s.y + '</span></span></div></div></div>' +
      '<figure class="mshot ph">' + wimg(s.w, s.name + ' software', s.name) + '<span class="ph-fb">' + icon('image') + '</span></figure>' +
      '<div class="mb">' +
      (tx.d ? '<div><h4>' + icon('info') + esc(si.about) + '</h4><p>' + esc(tx.d) + '</p></div>' : '') +
      (tx.who ? '<div><h4>' + icon('users') + esc(si.who) + '</h4><p>' + esc(tx.who) + '</p></div>' : '') +
      (tx.works && tx.works.length ? '<div><h4>' + icon('star') + esc(si.works) + '</h4><ul class="mworks">' + tx.works.map(function (w, i) {
        return '<li><span class="num">/' + pad(i + 1) + '</span><span>' + esc(w) + '</span></li>';
      }).join('') + '</ul></div>' : '') +
      '<div><h4>' + icon('layers') + esc(si.usedIn) + '</h4><div class="mdepts">' + used.map(function (d) {
        return '<a href="#/dept/' + d.id + '" style="--dc:' + d.color + ';--dc-rgb:' + rgb(d.color) + '"><i></i>' + esc(dName(d)) + '</a>';
      }).join('') + '</div></div>' +
      '<div class="links"><a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + icon('ext') + esc(si.site) + '</a>' +
      '<a href="' + wikiUrl(s.w) + '" target="_blank" rel="noopener">' + icon('book') + esc(si.wiki) + '</a>' +
      '<a href="' + googleUrl(s.name + ' ' + s.by) + '" target="_blank" rel="noopener">' + icon('image') + esc(si.google) + '</a></div>' +
      '</div></div>';
    m.hidden = false;
    document.body.style.overflow = 'hidden';
    hydrateLogos(m);
    IMG.fill(m);
    var cb = $('.modal-close', m); if (cb) cb.focus({ preventScroll: true });
  }
  function closeSw() {
    var m = $('#modal');
    if (m.hidden) return;
    m.hidden = true; m.innerHTML = '';
    document.body.style.overflow = '';
    if (modalReturn && modalReturn.focus) modalReturn.focus({ preventScroll: true });
  }

  /* ───────────── department page ───────────── */
  function renderDept(d) {
    var t = dt(d.id), U = ui('dept') || {}, sw = ui('sw') || {};
    var prev = D[(d.idx - 1 + D.length) % D.length], next = D[(d.idx + 1) % D.length];
    var ids = ['d-about', 'd-study', 'd-branches', 'd-grad', 'd-software', 'd-jobs', 'd-safety', 'd-engineers'];
    var h = '';

    h += '<section class="d-hero"><div class="d-cover" id="dCover"><div class="layer bp"></div><div class="layer col"></div><span class="scan"></span><div class="gridfx"></div></div>' +
      '<div class="d-hero-in"><div>' +
      '<a class="back" href="#/departments">' + icon('back', 'flip') + esc(U.back) + '</a>' +
      eyebrow(null, U.label, pad(d.idx + 1) + ' / ' + D.length) +
      '<h1 class="split" style="--lw:' + longWord(dName(d)) + '">' + splitHTML(dName(d)) + '</h1>' +
      (isEn() ? '' : '<p class="d-en" data-px="0.12">' + esc(d.en) + '</p>') +
      '<p class="d-tag rv">' + esc(t.tag) + '</p>' +
      '<div class="d-chips rv" style="--d:200ms">' +
      '<span>' + icon('cap') + esc(fmt(U.chips.years, { n: d.years })) + '</span>' +
      '<span>' + icon('branch') + esc(fmt(U.chips.branches, { n: d.br.length })) + '</span>' +
      '<span>' + icon('star') + esc(fmt(U.chips.engineers, { n: d.eng.length })) + '</span>' +
      '<span class="chip-helmet"><i></i>' + esc(helmetOf(d)) + '</span></div></div>' +
      '<div class="d-hero-vis rv"><div class="rings" aria-hidden="true"><span></span><span></span><span></span><span></span></div>' +
      '<div class="d-helmet">' + helmet(d.color, { cls: 'glow', icon: d.icon }) + '</div>' +
      '<div class="d-hlabel"><b>' + esc(helmetOf(d)) + '</b><span>' + d.color.toUpperCase() + '</span></div></div></div></section>';

    h += '<nav class="d-tabs" id="dTabs"><div class="d-tabs-in">' + (U.tabs || []).map(function (tb, i) {
      return '<button data-target="' + ids[i] + '">' + esc(tb) + '</button>';
    }).join('') + '</div></nav>';

    /* about */
    h += '<section class="sec d-sec" id="d-about"><header class="sec-head">' + eyebrow(1, U.tabs[0]) + h2(U.about) + '</header>' +
      '<div class="about-grid">' + scrub(t.about, 'about-tx') +
      '<div class="fact rv">' + icon('bulb') + '<div><b>' + esc(U.fact) + '</b><p>' + esc(t.fact) + '</p></div></div></div>' +
      '<h3 class="sub rv">' + icon('sparkle') + esc(U.nature) + '</h3><div class="nature">' + (t.nature || []).map(function (n, i) {
        return '<div class="nat rv spot" style="--d:' + i * 90 + 'ms"><span class="num">/' + pad(i + 1) + '</span><p>' + esc(n) + '</p></div>';
      }).join('') + '</div><div class="bigword" data-px="-0.35" aria-hidden="true">' + esc(d.en.toUpperCase()) + '</div></section>';

    /* study */
    h += '<section class="sec d-sec" id="d-study"><header class="sec-head">' + eyebrow(2, U.tabs[1]) + h2(U.study) + scrub(fmt(U.studyLead, { n: d.years }), 'lead') + '</header>' +
      '<div class="stages' + (d.study.length > 4 ? ' s5' : '') + '">' + d.study.map(function (st, i) {
        var loc = (t.study || [])[i] || [];
        return '<div class="stage glass rv" style="--d:' + i * 110 + 'ms"><div class="stage-h"><span class="stage-n">' + (i + 1) + '</span><b>' + esc(fmt(U.stage, { n: i + 1 })) + '</b></div><ul>' +
          st.map(function (en, j) {
            var nm = isEn() ? en : (loc[j] || en);
            return '<li><span>' + esc(nm) + '</span>' + (isEn() || nm === en ? '' : '<em>' + esc(en) + '</em>') + '</li>';
          }).join('') + '</ul></div>';
      }).join('') + '</div>' +
      '<p class="study-note rv">' + icon('info') + '<span>' + esc(U.studyNote) + '</span></p></section>';

    /* branches */
    h += '<section class="sec d-sec" id="d-branches"><header class="sec-head">' + eyebrow(3, U.tabs[2]) + h2(U.branches) + '</header>' +
      '<div class="br-wrap"><div class="br-count rv"><b data-count="' + d.br.length + '">0</b><span>' + esc(U.branchesCount) + '</span></div>' +
      '<div class="br-grid">' + d.br.map(function (en, i) {
        var b = (t.br || [])[i] || [en, ''];
        var nm = isEn() ? (b[0] || en) : b[0];
        return '<div class="br rv spot" style="--d:' + (i % 2) * 80 + 'ms"><span class="num">/' + pad(i + 1) + '</span><b>' + esc(nm) + '</b>' + (isEn() ? '' : '<em>' + esc(en) + '</em>') + '<p>' + esc(b[1]) + '</p></div>';
      }).join('') + '</div></div></section>';

    /* postgraduate */
    function gl(core, loc) {
      return core.map(function (en, i) {
        var nm = isEn() ? en : ((loc || [])[i] || en);
        return '<li class="rv" style="--d:' + i * 50 + 'ms"><span>' + esc(nm) + '</span>' + (isEn() || nm === en ? '' : '<em>' + esc(en) + '</em>') + '</li>';
      }).join('');
    }
    h += '<section class="sec d-sec" id="d-grad"><header class="sec-head">' + eyebrow(4, U.tabs[3]) + h2(U.grad) + scrub(U.gradLead, 'lead') + '</header>' +
      '<div class="grad"><div class="grad-col glass rv"><div class="grad-h">' + icon('cap') + '<b>' + esc(U.msc) + '</b><span class="tag">M.Sc.</span></div><ul>' + gl(d.msc, t.msc) + '</ul></div>' +
      '<div class="grad-col glass phd rv"><div class="grad-h">' + icon('book') + '<b>' + esc(U.phd) + '</b><span class="tag">Ph.D.</span></div><ul>' + gl(d.phd, t.phd) + '</ul></div></div></section>';

    /* software */
    h += '<section class="sec d-sec" id="d-software"><header class="sec-head">' + eyebrow(5, U.tabs[4]) + h2(U.software) + scrub(U.softwareLead, 'lead') + '</header>' +
      '<div class="swd-grid">' + d.sw.map(function (id, i) {
        var s = C.sw[id]; if (!s) return '';
        var tx = swt(id) || {}, short = firstSentence(tx.d || s.by);
        return '<button class="swd rv" data-sw="' + id + '" style="--d:' + (i % 4) * 60 + 'ms">' + logo(id) + '<div><b>' + esc(s.name) + '</b><p>' + esc(short) + '</p><span class="more">' + esc(ui('swOpen')) + icon('arrow', 'flip') + '</span></div></button>';
      }).join('') + '</div></section>';

    /* jobs */
    h += '<section class="sec d-sec" id="d-jobs"><header class="sec-head">' + eyebrow(6, U.tabs[5]) + h2(U.jobs) + scrub(U.jobsLead, 'lead') + '</header>' +
      '<div class="jobs">' + (t.jobs || []).map(function (j, i) {
        return '<div class="job rv" style="--d:' + (i % 2) * 80 + 'ms">' + icon('briefcase') + '<span>' + esc(j) + '</span></div>';
      }).join('') + '</div></section>';

    /* safety */
    var ppe = part('ppe') || {};
    h += '<section class="sec d-sec" id="d-safety"><header class="sec-head">' + eyebrow(7, U.tabs[6]) + h2(U.safety) + '</header><div class="safe">' +
      '<div class="safe-helmet rv"><div class="safe-vis">' + helmet(d.color, { cls: 'glow', icon: d.icon }) + '</div>' +
      '<dl><dt>' + esc(U.helmetColor) + '</dt><dd><i style="background:' + d.color + ';box-shadow:0 0 10px ' + d.color + '"></i>' + esc(cname(d)) + '</dd>' +
      '<dt>' + esc(U.spec) + '</dt><dd>' + esc(d.spec) + '</dd><dt>' + esc(U.style) + '</dt><dd>' + esc(t.style) + '</dd></dl>' +
      '<p class="why">' + esc(t.why) + '</p></div>' +
      '<div class="safe-ppe"><h3 class="sub rv">' + icon('shield') + esc(U.ppe) + '</h3><div class="ppe-list">' + d.ppe.map(function (k, i) {
        var p = ppe[k] || {};
        return '<div class="ppe-item rv" style="--d:' + i * 60 + 'ms"><span class="ppe-ic">' + icon(k) + '</span><div><b>' + esc(p.n) + '</b><p>' + esc(p.d) + '</p></div></div>';
      }).join('') + '</div>' +
      '<div class="tip rv">' + icon('shield') + '<div><b>' + esc(U.tip) + '</b><p>' + esc(t.tip) + '</p></div></div></div></div></section>';

    /* engineers */
    h += '<section class="sec d-sec" id="d-engineers"><header class="sec-head">' + eyebrow(8, U.tabs[7]) + h2(U.engineers) + scrub(U.engineersLead, 'lead') + '</header>' +
      '<div class="engs">' + d.eng.map(function (e, i) {
        var te = (t.eng || [])[i] || {}, nm = isEn() ? e.en : (te.n || e.en);
        return '<article class="eng rv" id="eng-' + i + '">' +
          '<div class="eng-head"><figure class="eng-ph ph">' + wimg(e.w, e.en + ' engineer', e.en) + '<span class="ph-fb">' + esc(initials(e.en)) + '</span><span class="eng-rank num">/' + pad(i + 1) + '</span></figure>' +
          '<div class="eng-info"><h3>' + esc(nm) + '</h3>' + (isEn() ? '' : '<em>' + esc(e.en) + '</em>') +
          '<div class="eng-meta"><span>' + icon('calendar') + '<bdi class="num" dir="ltr">' + esc(e.life) + '</bdi></span>' + (te.from ? '<span>' + icon('pin') + esc(te.from) + '</span>' : '') + '</div>' +
          '<p>' + esc(te.bio) + '</p>' +
          '<div class="links">' + (te.story ? '<button class="bio-btn" aria-expanded="false">' + icon('book') + esc(U.bio) + icon('down') + '</button>' : '') +
          '<a href="' + wikiUrl(e.w) + '" target="_blank" rel="noopener">' + icon('ext') + esc(U.wiki) + '</a>' +
          '<a href="' + googleUrl(e.en) + '" target="_blank" rel="noopener">' + icon('image') + esc(U.google) + '</a></div>' +
          (te.story ? '<div class="story"><div><p>' + esc(te.story) + '</p></div></div>' : '') +
          '</div></div>' +
          '<div class="projs">' + e.p.map(function (p, j) {
            var tp = (te.p || [])[j] || {}, pn = isEn() ? p.en : (tp.n || p.en);
            return '<div class="proj spot" style="--d:' + j * 110 + 'ms">' +
              '<figure class="proj-ph ph">' + wimg(p.w, p.q || p.en, p.en) + '<span class="ph-fb">' + icon(d.icon) + '</span><span class="proj-y num">' + esc(p.y) + '</span></figure>' +
              '<div class="proj-b"><b>' + esc(pn) + '</b>' + (isEn() || pn === p.en ? '' : '<em>' + esc(p.en) + '</em>') + '<p>' + esc(tp.d) + '</p>' +
              '<div class="proj-f"><span>' + icon('pin') + esc(tp.at) + '</span>' +
              '<a href="' + googleUrl(p.en + ' ' + e.en) + '" target="_blank" rel="noopener" aria-label="' + esc(U.google) + '">' + icon('image') + '</a>' +
              '<a href="' + wikiUrl(p.w) + '" target="_blank" rel="noopener" aria-label="' + esc(U.wiki) + '">' + icon('ext') + '</a></div></div></div>';
          }).join('') + '</div></article>';
      }).join('') + '</div></section>';

    h += '<nav class="pn">' +
      '<a class="pn-card" href="#/dept/' + prev.id + '" style="' + vars(prev.color) + '"><span class="pn-h">' + helmet(prev.color, { cls: 'glow', icon: prev.icon }) + '</span><span class="pn-tx"><span class="pn-dir">' + icon('back', 'flip') + esc(U.prev) + '</span><b>' + esc(dName(prev)) + '</b></span></a>' +
      '<a class="pn-card nx" href="#/dept/' + next.id + '" style="' + vars(next.color) + '"><span class="pn-h">' + helmet(next.color, { cls: 'glow', icon: next.icon }) + '</span><span class="pn-tx"><span class="pn-dir">' + esc(U.next) + icon('arrow', 'flip') + '</span><b>' + esc(dName(next)) + '</b></span></a></nav>';
    return h;
  }

  var tabIO = null, curDept = null;
  function mountDept(d) {
    var view = $('#dept');
    view.innerHTML = renderDept(d);
    view.style.cssText = vars(d.color);
    observe(view);
    hydrate(view);
    setTimeout(function () { IMG.fill(view); }, 80);
    pexBg(d.cover, 1800, function (url) {
      var cov = $('#dCover'); if (!cov) return;
      $$('.layer', cov).forEach(function (l) { l.style.backgroundImage = 'url("' + url + '")'; });
      cov.classList.add('ok');
    });
    if (tabIO) tabIO.disconnect();
    if ('IntersectionObserver' in window) {
      tabIO = new IntersectionObserver(function (en) {
        en.forEach(function (x) {
          if (!x.isIntersecting) return;
          $$('#dTabs button').forEach(function (b) {
            var on = b.getAttribute('data-target') === x.target.id;
            b.classList.toggle('on', on);
            if (on) {
              var bar = $('#dTabs .d-tabs-in');
              var br = bar.getBoundingClientRect(), bb = b.getBoundingClientRect();
              if (bb.left < br.left || bb.right > br.right) bar.scrollBy({ left: bb.left - br.left - br.width / 2 + bb.width / 2, behavior: 'smooth' });
            }
          });
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      $$('.d-sec', view).forEach(function (s) { tabIO.observe(s); });
    }
    document.title = dName(d) + ' — ' + ui('brand');
  }

  /* ───────────── helmet drop (enter a department) ───────────── */
  function playDrop(d, mid) {
    var drop = $('#drop'), dr = ui('drop') || {};
    if (reduce) { mid(); return; }
    drop.style.cssText = vars(d.color);
    $('.drop-helmet', drop).innerHTML = helmet(d.color, { cls: 'glow', icon: d.icon });
    $('.drop-title', drop).textContent = fmt(dr.wear, { c: cname(d) });
    $('.drop-sub', drop).textContent = fmt(dr.welcome, { d: dName(d) });
    $('.drop-sparks', drop).innerHTML = Array.apply(null, Array(14)).map(function (_, i) {
      var a = (i / 14) * Math.PI * 2 + Math.random() * 0.3, r = 70 + Math.random() * 90;
      return '<i class="spark" style="--dx:' + (Math.cos(a) * r).toFixed(0) + 'px;--dy:' + (Math.sin(a) * r * 0.7).toFixed(0) + 'px"></i>';
    }).join('');
    drop.hidden = false;
    drop.classList.remove('run', 'out'); void drop.offsetWidth; drop.classList.add('run');
    setAccent(d.color);
    if (window.BG) BG.setScene(d.scene);
    var finished = false;
    function finish() {
      if (finished) return; finished = true;
      mid();
      drop.classList.add('out');
      setTimeout(function () { drop.hidden = true; drop.classList.remove('run', 'out'); }, 520);
    }
    var tm = setTimeout(finish, 1650);
    drop.onclick = function () { clearTimeout(tm); finish(); };
  }

  /* ───────────── router ───────────── */
  var homeScroll = 0, inDept = false;
  function go(id) { location.hash = '#/dept/' + id; }
  function scrollToEl(el, smooth) {
    if (!el) return;
    var top = el.getBoundingClientRect().top + window.scrollY - (el.closest('.dept') ? 150 : 90);
    window.scrollTo({ top: top, behavior: smooth && !reduce ? 'smooth' : 'auto' });
  }
  function showDept(d, sub, instant) {
    var home = $('#home'), view = $('#dept');
    closeSw();
    if (curDept === d && inDept && !instant) { if (sub) scrollToEl(document.getElementById(sub), true); return; }
    if (!inDept) homeScroll = window.scrollY;
    heroStop();
    function mount() {
      mountDept(d); curDept = d;
      home.hidden = true; view.hidden = false; inDept = true;
      window.scrollTo(0, 0);
      setAccent(d.color);
      if (window.BG) BG.setScene(d.scene);
      collect();
      if (sub) setTimeout(function () { var el = document.getElementById(sub); scrollToEl(el, false); if (el) el.classList.add('in'); }, 120);
    }
    if (instant) mount(); else playDrop(d, mount);
  }
  function showHome(anchor) {
    var home = $('#home'), view = $('#dept'), was = inDept;
    closeSw();
    if (inDept) {
      view.hidden = true; view.innerHTML = ''; home.hidden = false; inDept = false; curDept = null;
      document.title = ui('brand') + ' — ' + ui('brandSub');
      collect();
    }
    setAccent(ACCENT);
    if (window.BG) { BG.setScene('home'); BG.setColor(D[heroIdx].color); }
    heroStart();
    var el = anchor ? document.getElementById(anchor) : null;
    if (el) requestAnimationFrame(function () { scrollToEl(el, !was); });
    else if (was) window.scrollTo(0, homeScroll);
  }
  function route(instant) {
    var h = decodeURIComponent(location.hash || '');
    var m = h.match(/^#\/dept\/([\w-]+)(?:\/([\w-]+))?/);
    closeMenu();
    if (m && byId[m[1]]) return showDept(byId[m[1]], m[2], instant === true);
    var a = h.replace(/^#\/?/, '');
    showHome(a && document.getElementById(a) && !/^dept/.test(a) ? a : null);
  }

  /* ───────────── menu / language ───────────── */
  function closeMenu() {
    document.body.classList.remove('menu-open');
    var b = $('#menuBtn'); if (b) b.setAttribute('aria-expanded', 'false');
    var l = $('#lang'); if (l) { l.classList.remove('open'); var lb = $('#langBtn'); if (lb) lb.setAttribute('aria-expanded', 'false'); }
  }
  function applyLang() {
    var meta = C.langs.filter(function (l) { return l.id === lang; })[0] || C.langs[0];
    document.documentElement.lang = HTML_LANG[lang];
    document.documentElement.dir = meta.dir;
    document.title = ui('brand') + ' — ' + ui('brandSub');
  }
  function renderAll() {
    applyLang();
    renderTopbar();
    renderFooter();
    renderHome();
  }
  function setLang(l) {
    if (l === lang || !C.langs.some(function (x) { return x.id === l; })) { closeMenu(); return; }
    try { localStorage.setItem(LANG_KEY, l); } catch (e) {}
    closeMenu();
    document.body.classList.add('switching');
    loadLang(l).then(function () {
      lang = l;
      var y = window.scrollY;
      renderAll();
      if (inDept && curDept) { mountDept(curDept); collect(); }
      else window.scrollTo(0, y);
      quiz.i = Math.min(quiz.i, C.quiz.length); renderQuiz();
      document.body.classList.remove('switching');
    });
  }

  /* ───────────── global events ───────────── */
  document.addEventListener('click', function (e) {
    var t = e.target;
    var lb = t.closest('#langBtn');
    if (lb) { var box = $('#lang'), open = box.classList.toggle('open'); lb.setAttribute('aria-expanded', open ? 'true' : 'false'); return; }
    var li = t.closest('[data-lang]');
    if (li) { setLang(li.getAttribute('data-lang')); return; }
    if (!t.closest('#lang')) { var lg = $('#lang'); if (lg) lg.classList.remove('open'); }
    if (t.closest('#menuBtn')) {
      var open2 = document.body.classList.toggle('menu-open');
      $('#menuBtn').setAttribute('aria-expanded', open2 ? 'true' : 'false');
      return;
    }
    if (t.closest('#nav a')) closeMenu();
    if (t.closest('#toTop')) { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); return; }
    if (t.closest('[data-close]')) { closeSw(); return; }
    var mlink = t.closest('.mdepts a');
    if (mlink) { closeSw(); return; }
    var sw = t.closest('[data-sw]');
    if (sw) { openSw(sw.getAttribute('data-sw')); return; }
    var stage = t.closest('#heroStage');
    if (stage) { go(D[heroIdx].id); return; }
    var f = t.closest('#swFilter button');
    if (f) {
      var id = f.getAttribute('data-f');
      $$('#swFilter button').forEach(function (b) { b.classList.toggle('on', b === f); });
      if (id) { $('#swGallery').classList.remove('collapsed'); $('#swMore').parentNode.hidden = true; }
      $$('#swGallery .swt').forEach(function (tile) {
        var show = !id || byId[id].sw.indexOf(tile.getAttribute('data-sw')) > -1;
        tile.hidden = !show;
        if (show) { tile.classList.add('in'); tile.style.cssText = vars(id ? byId[id].color : tile.getAttribute('data-c')); }
      });
      return;
    }
    if (t.closest('#swMore')) {
      $('#swGallery').classList.remove('collapsed');
      $$('#swGallery .swt.x').forEach(function (x) { x.classList.add('in'); });
      $('#swMore').parentNode.hidden = true; return;
    }
    var bio = t.closest('.bio-btn');
    if (bio) { var art = bio.closest('.eng'), op = art.classList.toggle('open'); bio.setAttribute('aria-expanded', op ? 'true' : 'false'); return; }
    var tab = t.closest('#dTabs button');
    if (tab) { scrollToEl(document.getElementById(tab.getAttribute('data-target')), true); return; }
    var opt = t.closest('.qz-opt');
    if (opt) {
      var a = C.quiz[quiz.i][+opt.getAttribute('data-i')];
      Object.keys(a).forEach(function (k) { quiz.s[k] = (quiz.s[k] || 0) + a[k]; });
      quiz.i++; renderQuiz(); return;
    }
    if (t.closest('.qz-reset')) { quiz.i = 0; quiz.s = {}; renderQuiz(); return; }
    /* same-page anchors on home: smooth scroll without breaking the router */
    var a2 = t.closest('a[href^="#"]');
    if (a2 && !inDept) {
      var href = a2.getAttribute('href');
      if (href.length > 1 && href.charAt(1) !== '/' && document.getElementById(href.slice(1))) {
        e.preventDefault();
        scrollToEl(document.getElementById(href.slice(1)), true);
        if (history.replaceState) history.replaceState(null, '', href);
      }
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeSw(); closeMenu(); }
    if ((e.key === 'Enter' || e.key === ' ') && e.target && e.target.id === 'heroStage') { e.preventDefault(); go(D[heroIdx].id); }
  });
  document.addEventListener('input', function (e) { if (e.target.id === 'deptSearch') renderGrid(e.target.value); });
  document.addEventListener('pointermove', function (e) {
    if (!reduce) {
      var g = $('#cursorGlow');
      if (g) { g.style.setProperty('--cx', e.clientX + 'px'); g.style.setProperty('--cy', e.clientY + 'px'); }
    }
    var s = e.target.closest && e.target.closest('.spot');
    if (s) {
      var r = s.getBoundingClientRect();
      s.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      s.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }
    if (reduce) return;
    var c = e.target.closest && e.target.closest('.dcard');
    if (c) {
      var rr = c.getBoundingClientRect();
      var x = (e.clientX - rr.left) / rr.width - 0.5, y = (e.clientY - rr.top) / rr.height - 0.5;
      c.style.setProperty('--tx', (y * -8).toFixed(2) + 'deg');
      c.style.setProperty('--ty', (x * 10).toFixed(2) + 'deg');
    }
    var st = e.target.closest && e.target.closest('#heroStage');
    if (st) {
      var sr = st.getBoundingClientRect();
      st.style.setProperty('--rx', (((e.clientY - sr.top) / sr.height - 0.5) * -14).toFixed(2) + 'deg');
      st.style.setProperty('--ry', (((e.clientX - sr.left) / sr.width - 0.5) * 18).toFixed(2) + 'deg');
    }
  }, { passive: true });
  document.addEventListener('pointerout', function (e) {
    var c = e.target.closest && e.target.closest('.dcard');
    if (c && !c.contains(e.relatedTarget)) { c.style.setProperty('--tx', '0deg'); c.style.setProperty('--ty', '0deg'); }
    var st = e.target.closest && e.target.closest('#heroStage');
    if (st && !st.contains(e.relatedTarget)) { st.style.setProperty('--rx', '0deg'); st.style.setProperty('--ry', '0deg'); }
  });

  /* ───────────── boot ───────────── */
  function init() {
    var q = (location.search.match(/[?&]lang=(ku|ar|en|de)/) || [])[1];
    var saved = null;
    try { saved = localStorage.getItem(LANG_KEY); } catch (e) {}
    lang = q || saved || 'ku';
    if (!C.langs.some(function (l) { return l.id === lang; })) lang = 'ku';
    var lt = $('#loaderText'); if (lt) lt.textContent = LOADER_TX[lang];
    var t0 = Date.now();
    loadLang(lang).then(function () {
      if (lang !== 'ku' && !I18N[lang]) lang = 'ku';
      renderAll();
      window.addEventListener('hashchange', function () { route(); });
      window.addEventListener('resize', function () { collect(); tickerHalf = 0; lastY = -1; });
      route(true);
      requestAnimationFrame(frame);
      setTimeout(function () { var ld = $('#loader'); if (ld) ld.classList.add('done'); document.body.classList.add('ready'); }, Math.max(0, 1300 - (Date.now() - t0)));
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
