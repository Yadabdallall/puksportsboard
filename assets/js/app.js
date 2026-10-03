/* Engineerpedia — rendering, i18n, router, text motion and image loaders */
(function () {
  'use strict';

  var C = window.CORE, ICONS = window.ICONS;
  var D = C.depts, byId = {};
  D.forEach(function (d, i) { d.idx = i; byId[d.id] = d; });
  var SW_IDS = [];
  D.forEach(function (d) { d.sw.forEach(function (s) { if (SW_IDS.indexOf(s) < 0 && C.sw[s]) SW_IDS.push(s); }); });

  var V = '3';                 /* bump to refresh cached data files */
  var ACCENT = '#FFB81C';
  var reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var LANG_KEY = 'eng-lang';
  var HTML_LANG = { ku: 'ckb', ar: 'ar', en: 'en', de: 'de' };
  var STYLE_EN = ['Cap style', 'Full brim', 'Vented', 'Climbing helmet', 'Bump cap', 'Combo kit', 'Mining helmet', 'Firefighter helmet'];
  var STD_KEYS = ['ANSI/ISEA Z89.1', 'EN 397', 'EN 50365', 'EN 12492', 'EN 812'];
  var TYPE_KEYS = ['Type I', 'Type II'];
  var CLASS_KEYS = ['Class G', 'Class E', 'Class C'];
  var SW_SHOW = 18;
  var DPR = Math.min(2, window.devicePixelRatio || 1);

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
  function longWord(s) { return Math.max.apply(null, String(s).split(/[\s\-–—/]+/).map(function (w) { return w.length; })); }

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
      s.src = src + '?v=' + V; s.charset = 'utf-8';
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

  /* ───────────── text motion (from the text-motion kit) ─────────────
     .reveal        — rises softly into place, once
     .reveal.words  — headings appear word by word
     .reveal.lines  — paragraphs rise line by line from behind a mask   */
  var M = (function () {
    var on = !reduce && 'IntersectionObserver' in window;
    if (on) document.documentElement.classList.add('js-reveal');
    var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    var RTL_CH = /[֐-ࣿיִ-ﻼ]/;

    /* Split into word spans. In right-to-left text, neighbouring Latin words stay
       in one span so their order is not flipped. */
    function splitWords(el) {
      if (el.getAttribute('data-split')) return;
      el.setAttribute('data-split', '1');
      var rtl = document.documentElement.dir === 'rtl';
      var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), nodes = [], n;
      while ((n = walker.nextNode())) if (n.nodeValue.trim()) nodes.push(n);
      nodes.forEach(function (node) {
        var groups = [];
        node.nodeValue.trim().split(/\s+/).forEach(function (w) {
          var last = groups[groups.length - 1];
          if (rtl && last && !RTL_CH.test(w) && !RTL_CH.test(last)) groups[groups.length - 1] = last + ' ' + w;
          else groups.push(w);
        });
        var frag = document.createDocumentFragment();
        if (/^\s/.test(node.nodeValue)) frag.appendChild(document.createTextNode(' '));
        groups.forEach(function (g, i) {
          if (i) frag.appendChild(document.createTextNode(' '));
          var s = document.createElement('span');
          s.className = 'word'; s.textContent = g;
          frag.appendChild(s);
        });
        if (/\s$/.test(node.nodeValue)) frag.appendChild(document.createTextNode(' '));
        node.parentNode.replaceChild(frag, node);
      });
      $$('.word', el).forEach(function (w, i) { w.style.transitionDelay = Math.min(i * 0.032, 0.7) + 's'; });
    }

    /* Measure where each word sits after layout, then wrap every line in a mask */
    function splitLines(el) {
      var raw = el.getAttribute('data-raw');
      if (raw == null) { raw = el.innerHTML; el.setAttribute('data-raw', raw); } else el.innerHTML = raw;
      var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), texts = [], t;
      while ((t = walker.nextNode())) if (t.nodeValue.trim()) texts.push(t);
      texts.forEach(function (node) {
        var frag = document.createDocumentFragment();
        node.nodeValue.split(/(\s+)/).forEach(function (p) {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
          var w = document.createElement('span');
          w.className = 'lw'; w.style.display = 'inline-block'; w.textContent = p;
          frag.appendChild(w);
        });
        node.parentNode.replaceChild(frag, node);
      });
      var lines = [], top = null, bucket = null;
      Array.prototype.slice.call(el.childNodes).forEach(function (node) {
        if (node.nodeType === 1 && node.classList.contains('lw')) {
          var y = node.offsetTop;
          if (top === null || Math.abs(y - top) > 4) { top = y; bucket = []; lines.push(bucket); }
          bucket.push(node);
        } else if (bucket) bucket.push(node);
      });
      if (!lines.length) return;
      el.innerHTML = '';
      lines.forEach(function (group, i) {
        var line = document.createElement('span'), inner = document.createElement('span');
        line.className = 'tline'; inner.className = 'tline-in';
        inner.style.transitionDelay = Math.min(i * 0.055, 0.5) + 's';
        group.forEach(function (node) {
          if (node.nodeType === 1 && node.classList.contains('lw')) node.style.display = '';
          inner.appendChild(node);
        });
        line.appendChild(inner);
        el.appendChild(line);
      });
    }

    function show(el) {
      var counts = $$('[data-count]', el);
      if (el.hasAttribute('data-count')) counts.push(el);
      if (on && el.classList.contains('lines') && !el.getAttribute('data-lines')) {
        fontsReady.then(function () {
          splitLines(el);
          el.setAttribute('data-lines', '1');
          void el.offsetWidth;
          requestAnimationFrame(function () { el.classList.add('is-in'); });
        });
      } else el.classList.add('is-in');
      counts.forEach(countUp);
    }

    var io = on ? new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        show(en.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 }) : null;

    function scan(root) {
      if (on) $$('.reveal.words', root).forEach(splitWords);
      $$('.reveal', root).forEach(function (el) {
        if (el.getAttribute('data-obs')) return;
        el.setAttribute('data-obs', '1');
        if (!el.classList.contains('words') && !el.classList.contains('lines')) {
          var i = Array.prototype.indexOf.call(el.parentNode.children, el);
          el.style.transitionDelay = (Math.min(i % 6, 5) * 0.06) + 's';
        }
        if (io) io.observe(el); else show(el);
      });
    }

    /* Re-measure split paragraphs when the width changes (not on mobile toolbar height changes) */
    var lastW = window.innerWidth, timer = null;
    window.addEventListener('resize', function () {
      if (window.innerWidth === lastW) return;
      lastW = window.innerWidth;
      clearTimeout(timer);
      timer = setTimeout(function () {
        $$('.reveal.lines[data-lines]').forEach(function (el) {
          if (el.offsetParent === null) return;
          var open = el.classList.contains('is-in');
          splitLines(el);
          if (open) el.classList.add('is-in');
        });
      }, 250);
    });

    return { scan: scan, show: show, on: on };
  })();

  function countUp(el) {
    if (el.getAttribute('data-done')) return;
    el.setAttribute('data-done', '1');
    var to = +el.getAttribute('data-count'), suf = el.getAttribute('data-suffix') || '';
    function out(v) { el.innerHTML = v + (suf ? '<em>' + suf + '</em>' : ''); }
    if (reduce) { out(to); return; }
    var t0 = performance.now(), dur = 1400;
    (function step(now) {
      var k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      out(Math.round(to * e));
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }

  /* Text helpers: 'first|second' headings get a coloured second part */
  function h2(s, tag) {
    s = String(s || '');
    var i = s.indexOf('|'), a = i < 0 ? s : s.slice(0, i), b = i < 0 ? '' : s.slice(i + 1);
    return '<' + (tag || 'h2') + ' class="h2 reveal words">' + esc(a) + (b ? ' <span class="t2">' + esc(b) + '</span>' : '') + '</' + (tag || 'h2') + '>';
  }
  function lead(s, cls) { return s ? '<p class="lead reveal lines' + (cls ? ' ' + cls : '') + '">' + esc(s) + '</p>' : ''; }
  function label(s) { return '<p class="label">' + esc(s) + '</p>'; }
  function secHead(key) {
    var s = ui('sec.' + key) || {};
    return '<header class="sec-head">' + label(s.eyebrow) + h2(s.title) + lead(s.lead) + '</header>';
  }

  /* ───────────── helmet (SVG) — still, no motion ───────────── */
  var DOME = 'M36 124C36 70 72 28 120 28C168 28 204 70 204 124C204 130.6 166 136 120 136C74 136 36 130.6 36 124Z';
  var BRIM = 'M16 126C16 112 60 104 120 104C180 104 224 112 224 126C224 140 176 152 120 152C64 152 16 140 16 126Z';
  var EDGE = 'M16 126C16 140 64 152 120 152C176 152 224 140 224 126L224 131C224 146 176 158 120 158C64 158 16 146 16 131Z';
  var RIB = 'M108.5 30.5C105.5 45 104.5 58 106 72Q120 78.5 134 72C135.5 58 134.5 45 131.5 30.5Q120 27.6 108.5 30.5Z';
  function helmet(color, o) {
    o = o || {};
    var badge = o.icon ? '<circle cx="120" cy="101" r="17.5" fill="#04101f" fill-opacity=".34" stroke="#fff" stroke-opacity=".5" stroke-width="1.4"/>' +
      '<g transform="translate(107.4 88.4) scale(1.05)" fill="none" stroke="#fff" stroke-opacity=".95" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + ICONS.get(o.icon) + '</g>' : '';
    return '<svg class="helmet" viewBox="0 16 240 164" style="--hc:' + color + '" aria-hidden="true">' +
      '<ellipse class="h-shadow" cx="120" cy="166" rx="104" ry="11"/>' +
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
      '<ellipse class="spec" cx="80" cy="60" rx="24" ry="10" transform="rotate(-42 80 60)"/>' +
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
  /* Load Wikipedia images only when their section comes near the screen */
  function lazyFill(root) {
    if (!root) return;
    if (!('IntersectionObserver' in window)) { IMG.fill(root); return; }
    var io = new IntersectionObserver(function (en) {
      if (en.some(function (e) { return e.isIntersecting; })) { IMG.fill(root); io.disconnect(); }
    }, { rootMargin: '600px 0px' });
    io.observe(root);
  }

  /* Pexels photos sized to the screen: try each id until one loads */
  function pexW(css) { return Math.min(1600, Math.round(css * DPR / 100) * 100); }
  function pexImg(ids, cssW) {
    return '<img class="pex" alt="" data-pex="' + ids.join(',') + '" data-w="' + pexW(cssW) + '" loading="lazy" decoding="async" referrerpolicy="no-referrer">';
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

  /* Software logos (Simple Icons) with a monogram fallback */
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

  function setAccent(color) {
    var r = document.documentElement.style;
    r.setProperty('--accent', color);
    r.setProperty('--accent-rgb', rgb(color));
    r.setProperty('--accent-ink', ink(color));
    if (window.BG) BG.setColor(color);
  }

  /* ───────────── scroll: top bar state + the grid's gentle drift ───────────── */
  var ticking = false, wasScrolled = null;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var y = window.scrollY || 0, sc = y > 24, tb = $('#topbar');
      if (tb && sc !== wasScrolled) { tb.classList.toggle('scrolled', sc); wasScrolled = sc; }
      var g = $('#gridLayer');
      if (g && !reduce) g.style.setProperty('--gy', (-(y * 0.08) % 120).toFixed(1) + 'px');
    });
  }

  /* ───────────── chrome: top bar & footer ───────────── */
  function renderTopbar() {
    var cur = C.langs.filter(function (l) { return l.id === lang; })[0];
    $('#topbar').innerHTML = '<div class="topbar-in">' +
      '<a class="brand" href="#/" aria-label="' + esc(ui('brand')) + '"><span class="brand-helmet">' + helmet(ACCENT) + '</span><b>' + esc(ui('brand')) + '</b></a>' +
      '<nav class="nav" id="nav">' +
      [['departments', 'depts'], ['safety', 'safety'], ['software', 'software'], ['legends', 'legends']].map(function (n) {
        return '<a href="#' + n[0] + '">' + esc(ui('nav.' + n[1])) + '</a>';
      }).join('') + '<a class="nav-cta" href="#quiz">' + esc(ui('nav.quiz')) + '</a></nav>' +
      '<div class="lang" id="lang"><button class="lang-btn" id="langBtn" aria-haspopup="true" aria-expanded="false" aria-label="' + esc(ui('lang')) + '">' + icon('globe') + '<b>' + cur.short + '</b></button>' +
      '<div class="lang-menu" role="menu">' + C.langs.map(function (l) {
        return '<button role="menuitem" data-lang="' + l.id + '" class="' + (l.id === lang ? 'on' : '') + '" lang="' + HTML_LANG[l.id] + '" dir="' + l.dir + '"><span>' + esc(l.label) + '</span><small>' + l.short + '</small></button>';
      }).join('') + '</div></div>' +
      '<button class="menu-btn" id="menuBtn" aria-label="Menu" aria-expanded="false" aria-controls="nav">' + icon('menu') + icon('close') + '</button></div>';
    wasScrolled = null; onScroll();
  }
  function renderFooter() {
    var f = ui('footer') || {};
    $('#footer').innerHTML =
      '<div class="foot-in"><div class="foot-brand"><b>' + esc(ui('brand')) + '</b><p>' + esc(f.about) + '</p></div>' +
      '<div class="foot-note"><p>' + esc(f.img) + '</p><p>' + esc(f.helmet) + '</p></div></div>' +
      '<div class="credit"><span class="dev">' + esc(f.credit) + '</span>' +
      '<button class="to-top" id="toTop">' + icon('up') + esc(f.top) + '</button></div>';
  }

  /* ───────────── home ───────────── */
  function renderHome() {
    var h = '', title = ui('heroTitle') || ['', '', ''];

    /* hero */
    h += '<section class="hero" id="top">' +
      '<div class="hero-helmet">' + helmet(ACCENT) + '</div>' +
      '<p class="kicker reveal">' + esc(ui('heroKicker')) + '</p>' +
      '<h1 class="hero-title reveal words"><span class="ln">' + esc(title[0]) + '</span> <span class="ln acc">' + esc(title[1]) + '</span> <span class="ln">' + esc(title[2]) + '</span></h1>' +
      '<p class="hero-lead reveal lines">' + esc(ui('heroLead')) + '</p>' +
      '<div class="hero-cta reveal"><a class="btn primary" href="#departments">' + esc(ui('ctaDepts')) + icon('arrow', 'flip') + '</a>' +
      '<a class="btn ghost" href="#quiz">' + esc(ui('ctaQuiz')) + '</a></div></section>';

    /* ticker: department names gliding by */
    var tk = D.map(function (d) {
      return '<a class="tk" href="#/dept/' + d.id + '" tabindex="-1" style="' + vars(d.color) + '"><i></i>' + esc(dName(d)) + '</a>';
    }).join('');
    h += '<div class="ticker" aria-hidden="true"><div class="ticker-track">' + tk + tk + '</div></div>';

    /* intro + numbers */
    var brCount = 0, engCount = 0, projCount = 0;
    D.forEach(function (d) { brCount += d.br.length; engCount += d.eng.length; d.eng.forEach(function (e) { projCount += e.p.length; }); });
    var st = ui('stats') || {};
    h += '<section class="sec" id="intro">' + secHead('intro') +
      '<div class="stats">' + [[D.length, st.depts, 'helmet', ''], [brCount, st.branches, 'branch', '+'], [engCount, st.engineers, 'star', ''], [projCount, st.projects, 'pin', '+'], [SW_IDS.length, st.software, 'code', '']].map(function (s) {
        return '<div class="stat reveal">' + icon(s[2]) + '<b data-count="' + s[0] + '" data-suffix="' + s[3] + '">' + (M.on ? 0 : s[0] + s[3]) + '</b><span>' + esc(s[1]) + '</span></div>';
      }).join('') + '</div></section>';

    /* departments */
    h += '<section class="sec" id="departments">' + secHead('depts') +
      '<label class="search reveal">' + icon('search') + '<span class="sr-only">' + esc(ui('nav.depts')) + '</span><input id="deptSearch" type="search" placeholder="' + esc(ui('search')) + '" autocomplete="off"></label>' +
      '<div class="dept-grid" id="deptGrid"></div></section>';

    /* safety */
    var hm = part('helmet') || {}, sf = ui('safety') || {}, ppe = part('ppe') || {};
    h += '<section class="sec" id="safety">' + secHead('safety') +
      '<div class="block"><h3 class="sub reveal">' + icon('helmet') + esc(sf.codes) + '</h3><p class="note reveal">' + esc(sf.codesNote) + '</p>' +
      '<ul class="codes">' + (hm.codes || []).map(function (c, i) {
        return '<li class="reveal" style="--c:' + C.helmetCodes[i] + '"><span class="dot"></span><b>' + esc(c.n) + '</b><span>' + esc(c.r) + '</span></li>';
      }).join('') + '</ul></div>' +
      '<div class="two block"><div><h3 class="sub reveal">' + icon('shield') + esc(sf.types) + '</h3><div class="mini-grid">' + (hm.types || []).map(function (t, i) {
        return '<div class="mini reveal"><span class="key">' + TYPE_KEYS[i] + '</span><b>' + esc(t.n) + '</b><p>' + esc(t.d) + '</p></div>';
      }).join('') + '</div></div>' +
      '<div><h3 class="sub reveal">' + icon('elec') + esc(sf.classes) + '</h3><div class="mini-grid c3">' + (hm.classes || []).map(function (c, i) {
        return '<div class="mini reveal"><span class="key">' + CLASS_KEYS[i] + '</span><b>' + esc(c.n) + '</b><span class="volt" dir="ltr">' + esc(c.v) + '</span><p>' + esc(c.d) + '</p></div>';
      }).join('') + '</div></div></div>' +
      '<div class="block"><h3 class="sub reveal">' + icon('layers') + esc(sf.styles) + '</h3><div class="style-grid">' + (hm.styles || []).map(function (s, i) {
        return '<div class="mini reveal"><b>' + esc(s.n) + '</b>' + (isEn() ? '' : '<em>' + STYLE_EN[i] + '</em>') + '<p>' + esc(s.d) + '</p></div>';
      }).join('') + '</div></div>' +
      '<div class="two block"><div class="panel reveal"><h3 class="sub">' + icon('shield') + esc(sf.standards) + '</h3><ul class="std">' + (hm.standards || []).map(function (s, i) {
        return '<li><span class="key">' + STD_KEYS[i] + '</span><span>' + esc(s) + '</span></li>';
      }).join('') + '</ul></div>' +
      '<div class="panel reveal"><h3 class="sub">' + icon('info') + esc(sf.care) + '</h3><ul class="care">' + (hm.care || []).map(function (c) {
        return '<li>' + icon('check') + '<span>' + esc(c) + '</span></li>';
      }).join('') + '</ul></div></div>' +
      '<div class="block"><h3 class="sub reveal">' + icon('vest') + esc(sf.ppe) + '</h3><p class="note reveal">' + esc(sf.ppeNote) + '</p>' +
      '<div class="ppe-grid">' + C.ppeKeys.map(function (k) {
        var p = ppe[k] || {}, used = D.filter(function (d) { return d.ppe.indexOf(k) > -1; });
        return '<div class="ppe reveal"><span class="ppe-ic">' + icon(k) + '</span><div><b>' + esc(p.n) + '</b><p>' + esc(p.d) + '</p>' +
          (used.length ? '<span class="ppe-dots">' + used.map(function (d) { return '<i title="' + esc(dName(d)) + '" style="background:' + d.color + '"></i>'; }).join('') + '</span>' : '') + '</div></div>';
      }).join('') + '</div></div></section>';

    /* software */
    h += '<section class="sec" id="software">' + secHead('software') +
      '<div class="chips reveal" id="swFilter"><button class="on" data-f="">' + esc(ui('swAll')) + ' <span class="n">' + SW_IDS.length + '</span></button>' +
      D.map(function (d) { return '<button data-f="' + d.id + '" style="' + vars(d.color) + '"><i></i>' + esc(dName(d)) + '</button>'; }).join('') + '</div>' +
      '<div class="sw-grid collapsed" id="swGallery">' + SW_IDS.map(function (id, i) {
        var s = C.sw[id], d = D.filter(function (x) { return x.sw.indexOf(id) > -1; })[0];
        return '<button class="swt reveal' + (i >= SW_SHOW ? ' x' : '') + '" data-sw="' + id + '" data-c="' + d.color + '" style="' + vars(d.color) + '">' + logo(id) + '<b>' + esc(s.name) + '</b><small>' + esc(s.by) + '</small></button>';
      }).join('') + '</div><div class="more-wrap"><button class="btn ghost" id="swMore">' + esc(ui('swMore')) + ' <span class="n">+' + (SW_IDS.length - SW_SHOW) + '</span></button></div></section>';

    /* engineers: one from each department */
    h += '<section class="sec" id="legends">' + secHead('legends') + '<div class="legs">' + D.map(function (d) {
      var e = d.eng[0], nm = isEn() ? e.en : ((dt(d.id).eng || [])[0] || {}).n || e.en;
      return '<a class="leg reveal" href="#/dept/' + d.id + '/eng-0" style="' + vars(d.color) + '">' +
        '<span class="leg-ph ph">' + wimg(e.w, e.en + ' engineer', e.en) + '<span class="ph-fb">' + esc(initials(e.en)) + '</span></span>' +
        '<b>' + esc(nm) + '</b><small><i></i>' + esc(dName(d)) + '</small></a>';
    }).join('') + '</div></section>';

    /* quiz */
    h += '<section class="sec" id="quiz">' + secHead('quiz') + '<div class="quiz reveal" id="quizBox" aria-live="polite"></div></section>';

    /* other fields */
    h += '<section class="sec" id="others">' + secHead('others') + '<div class="others">' + (part('others') || []).map(function (o) {
      return '<div class="other reveal"><b>' + esc(o.n) + '</b><p>' + esc(o.d) + '</p></div>';
    }).join('') + '</div></section>';

    var home = $('#home');
    home.innerHTML = h;
    renderGrid('');
    renderQuiz();
    hydrate(home);
    lazyFill($('#legends'));
    M.scan(home);
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
    grid.innerHTML = list.length ? list.map(function (d) {
      var t = dt(d.id);
      return '<a class="dcard reveal' + (q ? ' is-in' : '') + '" href="#/dept/' + d.id + '" style="' + vars(d.color) + '">' +
        '<span class="dcard-cover">' + pexImg(d.cover, 420) + '</span>' +
        '<span class="dcard-helmet">' + helmet(d.color, { icon: d.icon }) + '</span>' +
        '<span class="dcard-body"><h3>' + esc(dName(d)) + '</h3>' + (isEn() ? '' : '<em class="den">' + esc(d.en) + '</em>') +
        '<span class="dtag">' + esc(t.tag) + '</span>' +
        '<span class="dmeta"><span class="hc"><i></i>' + esc(helmetOf(d)) + '</span><span>' + d.br.length + ' ' + esc(cd.branches) + '</span><span>' + d.years + ' ' + esc(cd.years) + '</span></span></span></a>';
    }).join('') : '<p class="empty">' + esc(ui('empty')) + '</p>';
    hydrate(grid);
    M.scan(grid);
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
      '<div class="qz-top"><span class="n" dir="ltr">' + (quiz.i + 1) + ' / ' + C.quiz.length + '</span><div class="qz-bar"><i style="width:' + (quiz.i / C.quiz.length * 100) + '%"></i></div></div>' +
      '<h3 class="qz-q">' + esc(q.q) + '</h3>' +
      '<div class="qz-opts">' + C.quiz[quiz.i].map(function (a, i) {
        return '<button class="qz-opt" data-i="' + i + '"><span class="k">' + (i + 1) + '</span>' + esc(q.a[i] || '') + '</button>';
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
      '<div class="qz-res">' + ranked.map(function (r) {
        return '<a class="qz-card" href="#/dept/' + r.d.id + '" style="' + vars(r.d.color) + '">' +
          '<span class="qz-helmet">' + helmet(r.d.color, { icon: r.d.icon }) + '</span><b>' + esc(dName(r.d)) + '</b>' +
          '<span class="qz-pct"><i style="width:' + r.pct + '%"></i></span><small><span dir="ltr">' + r.pct + '%</span> ' + esc(qz.match) + '</small></a>';
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
      '<div class="mh">' + logo(id, true) + '<div><h3>' + esc(s.name) + '</h3><div class="meta"><span>' + icon('company') + esc(si.maker) + ': ' + esc(s.by) + '</span><span>' + icon('calendar') + esc(si.since) + ': <span dir="ltr">' + s.y + '</span></span></div></div></div>' +
      '<figure class="mshot ph">' + wimg(s.w, s.name + ' software', s.name) + '<span class="ph-fb">' + icon('image') + '</span></figure>' +
      '<div class="mb">' +
      (tx.d ? '<div><h4>' + icon('info') + esc(si.about) + '</h4><p>' + esc(tx.d) + '</p></div>' : '') +
      (tx.who ? '<div><h4>' + icon('users') + esc(si.who) + '</h4><p>' + esc(tx.who) + '</p></div>' : '') +
      (tx.works && tx.works.length ? '<div><h4>' + icon('star') + esc(si.works) + '</h4><ul class="mworks">' + tx.works.map(function (w) {
        return '<li>' + esc(w) + '</li>';
      }).join('') + '</ul></div>' : '') +
      '<div><h4>' + icon('layers') + esc(si.usedIn) + '</h4><div class="mdepts">' + used.map(function (d) {
        return '<a href="#/dept/' + d.id + '" style="--dc:' + d.color + '"><i></i>' + esc(dName(d)) + '</a>';
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
  function dHead(n, title, sub) {
    var U = ui('dept') || {};
    return '<header class="sec-head">' + label((U.tabs || [])[n]) + h2(title) + (sub || '') + '</header>';
  }
  function renderDept(d) {
    var t = dt(d.id), U = ui('dept') || {};
    var prev = D[(d.idx - 1 + D.length) % D.length], next = D[(d.idx + 1) % D.length];
    var ids = ['d-about', 'd-study', 'd-branches', 'd-grad', 'd-software', 'd-jobs', 'd-safety', 'd-engineers'];
    var h = '';

    h += '<section class="d-hero"><div class="d-cover" id="dCover"></div>' +
      '<div class="d-hero-in"><div class="d-hero-tx">' +
      '<a class="back" href="#/departments">' + icon('back', 'flip') + esc(U.back) + '</a>' +
      '<p class="label">' + esc(U.label) + ' <bdi dir="ltr">' + pad(d.idx + 1) + ' / ' + D.length + '</bdi></p>' +
      '<h1 class="reveal words" style="--lw:' + longWord(dName(d)) + '">' + esc(dName(d)) + '</h1>' +
      (isEn() ? '' : '<p class="d-en">' + esc(d.en) + '</p>') +
      '<p class="d-tag reveal lines">' + esc(t.tag) + '</p>' +
      '<div class="d-chips reveal">' +
      '<span>' + icon('cap') + esc(fmt(U.chips.years, { n: d.years })) + '</span>' +
      '<span>' + icon('branch') + esc(fmt(U.chips.branches, { n: d.br.length })) + '</span>' +
      '<span>' + icon('star') + esc(fmt(U.chips.engineers, { n: d.eng.length })) + '</span></div></div>' +
      '<div class="d-hero-helmet reveal">' + helmet(d.color, { icon: d.icon }) +
      '<p class="d-hlabel"><i></i><b>' + esc(helmetOf(d)) + '</b><span dir="ltr">' + d.color.toUpperCase() + '</span></p></div></div></section>';

    h += '<nav class="d-tabs" id="dTabs"><div class="d-tabs-in">' + (U.tabs || []).map(function (tb, i) {
      return '<button data-target="' + ids[i] + '">' + esc(tb) + '</button>';
    }).join('') + '</div></nav>';

    /* about */
    h += '<section class="sec d-sec" id="d-about">' + dHead(0, U.about) +
      '<div class="about-grid"><p class="about-tx reveal lines">' + esc(t.about) + '</p>' +
      '<aside class="fact reveal">' + icon('bulb') + '<div><b>' + esc(U.fact) + '</b><p>' + esc(t.fact) + '</p></div></aside></div>' +
      '<h3 class="sub reveal">' + icon('sparkle') + esc(U.nature) + '</h3><ul class="nature">' + (t.nature || []).map(function (n) {
        return '<li class="reveal">' + esc(n) + '</li>';
      }).join('') + '</ul></section>';

    /* study */
    h += '<section class="sec d-sec" id="d-study">' + dHead(1, U.study, lead(fmt(U.studyLead, { n: d.years }))) +
      '<div class="stages' + (d.study.length > 4 ? ' s5' : '') + '">' + d.study.map(function (st, i) {
        var loc = (t.study || [])[i] || [];
        return '<div class="stage reveal"><div class="stage-h"><span class="stage-n">' + (i + 1) + '</span><b>' + esc(fmt(U.stage, { n: i + 1 })) + '</b></div><ul>' +
          st.map(function (en, j) {
            var nm = isEn() ? en : (loc[j] || en);
            return '<li>' + esc(nm) + (isEn() || nm === en ? '' : '<em>' + esc(en) + '</em>') + '</li>';
          }).join('') + '</ul></div>';
      }).join('') + '</div>' +
      '<p class="study-note reveal">' + icon('info') + '<span>' + esc(U.studyNote) + '</span></p></section>';

    /* branches */
    h += '<section class="sec d-sec" id="d-branches">' + dHead(2, U.branches, '<p class="count reveal"><b>' + d.br.length + '</b> ' + esc(U.branchesCount) + '</p>') +
      '<div class="br-grid">' + d.br.map(function (en, i) {
        var b = (t.br || [])[i] || [en, ''];
        var nm = isEn() ? (b[0] || en) : b[0];
        return '<div class="br reveal"><b>' + esc(nm) + '</b>' + (isEn() ? '' : '<em>' + esc(en) + '</em>') + '<p>' + esc(b[1]) + '</p></div>';
      }).join('') + '</div></section>';

    /* postgraduate */
    function gl(core, loc) {
      return core.map(function (en, i) {
        var nm = isEn() ? en : ((loc || [])[i] || en);
        return '<li>' + esc(nm) + (isEn() || nm === en ? '' : '<em>' + esc(en) + '</em>') + '</li>';
      }).join('');
    }
    h += '<section class="sec d-sec" id="d-grad">' + dHead(3, U.grad, lead(U.gradLead)) +
      '<div class="grad"><div class="panel reveal"><div class="grad-h">' + icon('cap') + '<b>' + esc(U.msc) + '</b><span class="tag" dir="ltr">M.Sc.</span></div><ul>' + gl(d.msc, t.msc) + '</ul></div>' +
      '<div class="panel reveal"><div class="grad-h">' + icon('book') + '<b>' + esc(U.phd) + '</b><span class="tag" dir="ltr">Ph.D.</span></div><ul>' + gl(d.phd, t.phd) + '</ul></div></div></section>';

    /* software */
    h += '<section class="sec d-sec" id="d-software">' + dHead(4, U.software, lead(U.softwareLead)) +
      '<div class="swd-grid">' + d.sw.map(function (id) {
        var s = C.sw[id]; if (!s) return '';
        var tx = swt(id) || {}, short = firstSentence(tx.d || s.by);
        return '<button class="swd reveal" data-sw="' + id + '">' + logo(id) + '<span class="swd-tx"><b>' + esc(s.name) + '</b><span class="p">' + esc(short) + '</span><span class="more">' + esc(ui('swOpen')) + icon('arrow', 'flip') + '</span></span></button>';
      }).join('') + '</div></section>';

    /* jobs */
    h += '<section class="sec d-sec" id="d-jobs">' + dHead(5, U.jobs, lead(U.jobsLead)) +
      '<ul class="jobs">' + (t.jobs || []).map(function (j) {
        return '<li class="job reveal">' + icon('briefcase') + '<span>' + esc(j) + '</span></li>';
      }).join('') + '</ul></section>';

    /* safety */
    var ppe = part('ppe') || {};
    h += '<section class="sec d-sec" id="d-safety">' + dHead(6, U.safety) + '<div class="safe">' +
      '<div class="safe-card reveal"><div class="safe-vis">' + helmet(d.color, { icon: d.icon }) + '</div>' +
      '<dl><dt>' + esc(U.helmetColor) + '</dt><dd><i style="background:' + d.color + '"></i>' + esc(cname(d)) + '</dd>' +
      '<dt>' + esc(U.spec) + '</dt><dd dir="ltr">' + esc(d.spec) + '</dd><dt>' + esc(U.style) + '</dt><dd>' + esc(t.style) + '</dd></dl>' +
      '<p class="why">' + esc(t.why) + '</p></div>' +
      '<div class="safe-ppe"><h3 class="sub reveal">' + icon('shield') + esc(U.ppe) + '</h3><div class="ppe-list">' + d.ppe.map(function (k) {
        var p = ppe[k] || {};
        return '<div class="ppe reveal"><span class="ppe-ic">' + icon(k) + '</span><div><b>' + esc(p.n) + '</b><p>' + esc(p.d) + '</p></div></div>';
      }).join('') + '</div>' +
      '<div class="tip reveal">' + icon('shield') + '<div><b>' + esc(U.tip) + '</b><p>' + esc(t.tip) + '</p></div></div></div></div></section>';

    /* engineers */
    h += '<section class="sec d-sec" id="d-engineers">' + dHead(7, U.engineers, lead(U.engineersLead)) +
      '<div class="engs">' + d.eng.map(function (e, i) {
        var te = (t.eng || [])[i] || {}, nm = isEn() ? e.en : (te.n || e.en);
        return '<article class="eng reveal" id="eng-' + i + '">' +
          '<div class="eng-head"><figure class="eng-ph ph">' + wimg(e.w, e.en + ' engineer', e.en) + '<span class="ph-fb">' + esc(initials(e.en)) + '</span></figure>' +
          '<div class="eng-info"><h3>' + esc(nm) + '</h3>' + (isEn() ? '' : '<em>' + esc(e.en) + '</em>') +
          '<div class="eng-meta"><span>' + icon('calendar') + '<bdi dir="ltr">' + esc(e.life) + '</bdi></span>' + (te.from ? '<span>' + icon('pin') + esc(te.from) + '</span>' : '') + '</div>' +
          '<p>' + esc(te.bio) + '</p>' +
          '<div class="links">' + (te.story ? '<button class="bio-btn" aria-expanded="false">' + icon('book') + esc(U.bio) + icon('down') + '</button>' : '') +
          '<a href="' + wikiUrl(e.w) + '" target="_blank" rel="noopener">' + icon('ext') + esc(U.wiki) + '</a>' +
          '<a href="' + googleUrl(e.en) + '" target="_blank" rel="noopener">' + icon('image') + esc(U.google) + '</a></div>' +
          (te.story ? '<div class="story"><div><p>' + esc(te.story) + '</p></div></div>' : '') +
          '</div></div>' +
          '<div class="projs">' + e.p.map(function (p, j) {
            var tp = (te.p || [])[j] || {}, pn = isEn() ? p.en : (tp.n || p.en);
            return '<div class="proj">' +
              '<figure class="proj-ph ph">' + wimg(p.w, p.q || p.en, p.en) + '<span class="ph-fb">' + icon(d.icon) + '</span><span class="proj-y" dir="ltr">' + esc(p.y) + '</span></figure>' +
              '<div class="proj-b"><b>' + esc(pn) + '</b>' + (isEn() || pn === p.en ? '' : '<em>' + esc(p.en) + '</em>') + '<p>' + esc(tp.d) + '</p>' +
              '<div class="proj-f"><span>' + icon('pin') + esc(tp.at) + '</span>' +
              '<a href="' + googleUrl(p.en + ' ' + e.en) + '" target="_blank" rel="noopener" aria-label="' + esc(U.google) + '">' + icon('image') + '</a>' +
              '<a href="' + wikiUrl(p.w) + '" target="_blank" rel="noopener" aria-label="' + esc(U.wiki) + '">' + icon('ext') + '</a></div></div></div>';
          }).join('') + '</div></article>';
      }).join('') + '</div></section>';

    h += '<nav class="pn">' +
      '<a class="pn-card" href="#/dept/' + prev.id + '" style="' + vars(prev.color) + '"><span class="pn-h">' + helmet(prev.color, { icon: prev.icon }) + '</span><span class="pn-tx"><span class="pn-dir">' + icon('back', 'flip') + esc(U.prev) + '</span><b>' + esc(dName(prev)) + '</b></span></a>' +
      '<a class="pn-card nx" href="#/dept/' + next.id + '" style="' + vars(next.color) + '"><span class="pn-h">' + helmet(next.color, { icon: next.icon }) + '</span><span class="pn-tx"><span class="pn-dir">' + esc(U.next) + icon('arrow', 'flip') + '</span><b>' + esc(dName(next)) + '</b></span></a></nav>';
    return h;
  }

  var tabIO = null, curDept = null;
  function mountDept(d) {
    var view = $('#dept');
    view.innerHTML = renderDept(d);
    view.style.cssText = vars(d.color);
    hydrate(view);
    pexBg(d.cover, pexW(window.innerWidth), function (url) {
      var cov = $('#dCover'); if (!cov) return;
      cov.style.backgroundImage = 'url("' + url + '")';
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

  /* ───────────── helmet put on when entering a department ───────────── */
  function playDrop(d, mid) {
    var drop = $('#drop'), dr = ui('drop') || {};
    if (reduce) { mid(); return; }
    drop.style.cssText = vars(d.color);
    $('.drop-helmet', drop).innerHTML = helmet(d.color, { icon: d.icon });
    $('.drop-title', drop).textContent = fmt(dr.wear, { c: cname(d) });
    $('.drop-sub', drop).textContent = fmt(dr.welcome, { d: dName(d) });
    drop.hidden = false;
    drop.classList.remove('run', 'out'); void drop.offsetWidth; drop.classList.add('run');
    setAccent(d.color);
    if (window.BG) BG.setScene(d.scene);
    var finished = false;
    function finish() {
      if (finished) return; finished = true;
      mid();
      drop.classList.add('out');
      setTimeout(function () { drop.hidden = true; drop.classList.remove('run', 'out'); }, 380);
    }
    var tm = setTimeout(finish, 1250);
    drop.onclick = function () { clearTimeout(tm); finish(); };
  }

  /* ───────────── router ───────────── */
  var homeScroll = 0, inDept = false;
  function scrollToEl(el, smooth) {
    if (!el) return;
    var top = el.getBoundingClientRect().top + window.scrollY - (el.closest('.dept') ? 130 : 84);
    window.scrollTo({ top: top, behavior: smooth && !reduce ? 'smooth' : 'auto' });
  }
  function enter(view) { view.classList.remove('page-in'); void view.offsetWidth; view.classList.add('page-in'); }
  function showDept(d, sub, instant) {
    var home = $('#home'), view = $('#dept');
    closeSw();
    if (curDept === d && inDept && !instant) { if (sub) scrollToEl(document.getElementById(sub), true); return; }
    if (!inDept) homeScroll = window.scrollY;
    function mount() {
      mountDept(d); curDept = d;
      home.hidden = true; view.hidden = false; inDept = true;
      window.scrollTo(0, 0);
      enter(view);
      M.scan(view);
      lazyFill($('#d-engineers'));
      setAccent(d.color);
      if (window.BG) BG.setScene(d.scene);
      if (sub) setTimeout(function () {
        var el = document.getElementById(sub);
        scrollToEl(el, false);
        if (el) M.show(el);
      }, 120);
    }
    if (instant) mount(); else playDrop(d, mount);
  }
  function showHome(anchor) {
    var home = $('#home'), view = $('#dept'), was = inDept;
    closeSw();
    if (inDept) {
      view.hidden = true; view.innerHTML = ''; home.hidden = false; inDept = false; curDept = null;
      document.title = ui('brand');
      enter(home);
    }
    setAccent(ACCENT);
    if (window.BG) BG.setScene('home');
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
    document.title = ui('brand');
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
      if (inDept && curDept) { mountDept(curDept); M.scan($('#dept')); lazyFill($('#d-engineers')); }
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
    if (t.closest('.mdepts a')) { closeSw(); return; }
    var sw = t.closest('[data-sw]');
    if (sw) { openSw(sw.getAttribute('data-sw')); return; }
    var f = t.closest('#swFilter button');
    if (f) {
      var id = f.getAttribute('data-f');
      $$('#swFilter button').forEach(function (b) { b.classList.toggle('on', b === f); });
      if (id) { $('#swGallery').classList.remove('collapsed'); $('#swMore').parentNode.hidden = true; }
      $$('#swGallery .swt').forEach(function (tile) {
        var show = !id || byId[id].sw.indexOf(tile.getAttribute('data-sw')) > -1;
        tile.hidden = !show;
        if (show) { tile.classList.add('is-in'); tile.style.cssText = vars(id ? byId[id].color : tile.getAttribute('data-c')); }
      });
      return;
    }
    if (t.closest('#swMore')) {
      $('#swGallery').classList.remove('collapsed');
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
  });
  document.addEventListener('input', function (e) { if (e.target.id === 'deptSearch') renderGrid(e.target.value); });
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ───────────── boot ───────────── */
  function init() {
    var q = (location.search.match(/[?&]lang=(ku|ar|en|de)/) || [])[1];
    var saved = null;
    try { saved = localStorage.getItem(LANG_KEY); } catch (e) {}
    lang = q || saved || 'ku';
    if (!C.langs.some(function (l) { return l.id === lang; })) lang = 'ku';
    loadLang(lang).then(function () {
      if (lang !== 'ku' && !I18N[lang]) lang = 'ku';
      renderAll();
      window.addEventListener('hashchange', function () { route(); });
      route(true);
      document.body.classList.add('ready');
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
