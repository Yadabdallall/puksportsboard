/* ئەندازیارنامە — دروستکردنی ڕووکار، ڕێڕەو، ئەنیمەیشن و وێنەکان */
(function () {
  'use strict';

  var D = window.DEPTS, E = window.ENG;
  var byId = {};
  D.forEach(function (d, i) { d.idx = i; byId[d.id] = d; });

  var DEFAULT_ACCENT = '#FFB81C';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ───────────── یارمەتیدەرەکان ───────────── */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  var KD = '٠١٢٣٤٥٦٧٨٩';
  function kd(s) { return String(s).replace(/[0-9]/g, function (d) { return KD[d]; }); }
  function pad(n) { return kd(n < 10 ? '0' + n : String(n)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function pair(s) { var i = s.indexOf('|'); return i < 0 ? { ku: s, en: '' } : { ku: s.slice(0, i), en: s.slice(i + 1) }; }
  function rgb(hex) {
    var h = hex.replace('#', ''); var n = parseInt(h, 16);
    return ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255);
  }
  function lum(hex) {
    var p = rgb(hex).split(',').map(function (v) {
      v = v / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2];
  }
  function ink(hex) { return lum(hex) > 0.36 ? '#0a1220' : '#ffffff'; }
  function icon(name, cls) {
    return '<svg class="ic' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (E.icons[name] || '') + '</svg>';
  }
  function styleVars(color) { return '--c:' + color + ';--c-rgb:' + rgb(color) + ';--c-ink:' + ink(color); }
  function wikiUrl(t) { return 'https://en.wikipedia.org/wiki/' + encodeURIComponent(t.replace(/ /g, '_')); }
  function googleUrl(q) { return 'https://www.google.com/search?tbm=isch&q=' + encodeURIComponent(q); }
  function initials(en) {
    return en.replace(/[^A-Za-z .]/g, '').split(/[ .]+/).filter(Boolean).map(function (w) { return w[0]; }).slice(0, 2).join('').toUpperCase();
  }

  /* ───────────── کڵاو (SVG) ───────────── */
  function helmetEmblem(name, color) {
    if (!name) return '';
    return '<g class="h-emblem" transform="translate(137 55) scale(1.15)" fill="none" stroke="' + ink(color) + '" stroke-opacity=".78" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + (E.icons[name] || '') + '</g>';
  }
  function helmet(color, o) {
    o = o || {};
    return '<svg class="helmet' + (o.cls ? ' ' + o.cls : '') + '" viewBox="0 0 220 150" style="--hc:' + color + '" aria-hidden="true">' +
      '<ellipse class="h-shadow" cx="110" cy="140" rx="86" ry="7"/>' +
      '<path class="h-fill" d="M12 114C12 104 30 100 56 100H164C190 100 208 104 208 114S190 128 164 128H56C30 128 12 124 12 114Z"/>' +
      '<path class="h-dk2" d="M12 114C12 124 30 128 56 128H164C190 128 208 124 208 114C200 119 186 121 164 121H56C34 121 20 119 12 114Z"/>' +
      '<path class="h-fill" d="M32 108C32 56 66 16 110 16S188 56 188 108Z"/>' +
      '<path class="h-dk" d="M110 16C154 16 188 56 188 108H158C158 62 140 26 110 16Z"/>' +
      '<path class="h-fill" d="M98 17.5C93 40 92 76 94 108H126C128 76 127 40 122 17.5C114 15.6 106 15.6 98 17.5Z"/>' +
      '<path class="h-dk3" d="M110 16.4C116 16.4 119 17 122 17.5C127 40 128 76 126 108H112C113 76 113 40 110 16.4Z"/>' +
      '<path class="h-gl2" d="M99.5 24C96 44 95.3 76 96.5 104"/>' +
      '<path class="h-dk2" d="M32 102C60 97 160 97 188 102V110C160 105 60 105 32 110Z"/>' +
      '<path class="h-gl" d="M48 94C48 62 66 36 92 25C76 40 66 62 64 94Z"/>' +
      '<ellipse class="h-gl3" cx="78" cy="42" rx="9" ry="3.6" transform="rotate(-38 78 42)"/>' +
      helmetEmblem(o.icon, color) +
      '</svg>';
  }

  /* ───────────── وێنەکان لە ویکیپیدیا / ویکیمیدیا ───────────── */
  var IMG = (function () {
    var API = 'https://en.wikipedia.org/w/api.php';
    var KEY = 'eng-img-v2', TTL = 1000 * 60 * 60 * 24 * 14;
    var store = {};
    try { store = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { store = {}; }
    var pending = {};
    var saveTimer = null;
    function save() {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(function () { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {} }, 400);
    }
    function cached(k) { var v = store[k]; return v && Date.now() - v.t < TTL ? v : null; }
    function put(k, url) { store[k] = { u: url || '', t: Date.now() }; save(); }

    function params(o) {
      o.format = 'json'; o.formatversion = '2'; o.origin = '*';
      return Object.keys(o).map(function (k) { return k + '=' + encodeURIComponent(o[k]); }).join('&');
    }
    function batch(titles) {
      var url = API + '?' + params({ action: 'query', prop: 'pageimages', piprop: 'thumbnail', pithumbsize: '500', pilimit: '50', redirects: '1', titles: titles.join('|') });
      return fetch(url).then(function (r) { return r.json(); }).then(function (j) {
        var q = j.query || {}, map = {}, out = {};
        titles.forEach(function (t) { map[t] = t; });
        (q.normalized || []).forEach(function (n) { titles.forEach(function (t) { if (map[t] === n.from) map[t] = n.to; }); });
        (q.redirects || []).forEach(function (n) { titles.forEach(function (t) { if (map[t] === n.from) map[t] = n.to; }); });
        var pages = {};
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
      var chunks = [];
      for (var i = 0; i < titles.length; i += 45) chunks.push(titles.slice(i, i + 45));
      chunks.forEach(function (ch) {
        var p = batch(ch).then(function (res) {
          var misses = ch.filter(function (t) { return !res[t]; });
          return Promise.all(misses.map(function (t) {
            return search(need[t]).then(function (u) { res[t] = u; });
          })).then(function () { return res; });
        }).catch(function () { return null; });
        ch.forEach(function (t) { pending[t] = p; });
      });
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

  function imgTag(wiki, q, alt) {
    return '<img class="wimg" alt="' + esc(alt) + '" data-wiki="' + esc(wiki) + '"' + (q ? ' data-q="' + esc(q) + '"' : '') + ' loading="lazy" decoding="async" referrerpolicy="no-referrer">';
  }

  /* ───────────── ئەنیمەیشنی سکرۆڵ ───────────── */
  function splitWords(root) {
    $$('.split:not([data-split])', root).forEach(function (el) {
      el.setAttribute('data-split', '1');
      var words = el.textContent.trim().split(/\s+/);
      el.innerHTML = words.map(function (w, i) {
        return '<span class="w"><span style="--i:' + i + '">' + esc(w) + '</span></span>';
      }).join(' ');
    });
  }

  var revealIO = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        revealIO.unobserve(en.target);
        if (en.target.hasAttribute('data-count')) countUp(en.target);
        $$('[data-count]', en.target).forEach(countUp);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' }) : null;

  function observe(root) {
    splitWords(root);
    $$('.rv, .split', root).forEach(function (el) {
      if (revealIO) revealIO.observe(el); else el.classList.add('in');
    });
    collectParallax();
  }

  function countUp(el) {
    if (el.getAttribute('data-done')) return;
    el.setAttribute('data-done', '1');
    var to = +el.getAttribute('data-count'), suffix = el.getAttribute('data-suffix') || '';
    if (reduce) { el.textContent = kd(to) + suffix; return; }
    var t0 = performance.now(), dur = 1400;
    (function step(now) {
      var k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = kd(Math.round(to * e)) + suffix;
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }

  var pxEls = [];
  function collectParallax() {
    pxEls = $$('[data-px], [data-py]').filter(function (el) { return !el.closest('[hidden]'); });
  }
  var lastY = -1, tickerX = 0, tickerHalf = 0;
  function frame() {
    var y = window.scrollY, vh = window.innerHeight;
    if (y !== lastY) {
      lastY = y;
      document.documentElement.style.setProperty('--sy', y.toFixed(1));
      var max = document.documentElement.scrollHeight - vh;
      var bar = $('#progress'); if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
      $('#topbar').classList.toggle('scrolled', y > 30);
      if (!reduce) {
        pxEls.forEach(function (el) {
          var host = el.parentNode.getBoundingClientRect();
          if (host.bottom < -300 || host.top > vh + 300) return;
          var c = host.top + host.height / 2 - vh / 2;
          var px = +(el.getAttribute('data-px') || 0), py = +(el.getAttribute('data-py') || 0);
          var ty = el.hasAttribute('data-abs') ? y * py : c * py;
          el.style.transform = 'translate3d(' + (c * px).toFixed(1) + 'px,' + ty.toFixed(1) + 'px,0)';
        });
      }
    }
    // ڕیزی ناوی بەشەکان — خێرایی بەپێی سکرۆڵ
    var tk = $('#ticker');
    if (tk && !reduce && !tk.closest('[hidden]')) {
      var v = window.BG ? Math.abs(BG.velocity()) : 0;
      tickerX -= 0.45 + Math.min(v, 60) * 0.12;
      if (!tickerHalf) tickerHalf = tk.scrollWidth / 2;
      if (tickerHalf > 0 && -tickerX > tickerHalf) tickerX += tickerHalf;
      tk.style.transform = 'translate3d(' + (-tickerX).toFixed(1) + 'px,0,0)';
    }
    requestAnimationFrame(frame);
  }

  /* ───────────── ڕەنگی سەرەکی (Accent) ───────────── */
  function setAccent(color) {
    var r = document.documentElement.style;
    r.setProperty('--accent', color);
    r.setProperty('--accent-rgb', rgb(color));
    r.setProperty('--accent-ink', ink(color));
    if (window.BG) BG.setColor(color);
    var m = $('meta[name="theme-color"]'); if (m) m.setAttribute('content', '#050b16');
  }

  /* ───────────── پەڕەی سەرەکی ───────────── */
  var heroIdx = 0, heroTimer = null;
  function heroSet(i) {
    heroIdx = (i + D.length) % D.length;
    var d = D[heroIdx];
    var svg = $('#heroHelmet svg');
    if (!svg) return;
    svg.style.setProperty('--hc', d.color);
    var em = $('.h-emblem', svg);
    if (em) em.outerHTML = helmetEmblem(d.icon, d.color);
    var lab = $('#heroLabel');
    lab.classList.remove('swap'); void lab.offsetWidth; lab.classList.add('swap');
    $('#heroDept').textContent = d.n;
    $('#heroColor').textContent = 'کڵاوی ' + d.cname;
    $('#heroNum').textContent = pad(heroIdx + 1) + ' / ' + kd(D.length);
    $('#heroStage').style.cssText = styleVars(d.color);
    if (!$('#home').hidden && window.BG) BG.setColor(d.color);
  }
  function heroStart() {
    if (heroTimer || reduce) return;
    heroTimer = setInterval(function () { heroSet(heroIdx + 1); }, 2600);
  }
  function heroStop() { clearInterval(heroTimer); heroTimer = null; }

  function renderHome() {
    // کڵاوی سەرەکی
    $('#heroHelmet').innerHTML = helmet(D[0].color, { cls: 'big', icon: D[0].icon });
    $('#brandHelmet').innerHTML = helmet(DEFAULT_ACCENT);
    heroSet(0);
    var stage = $('#heroStage');
    stage.addEventListener('click', function () { go(D[heroIdx].id); });
    stage.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(D[heroIdx].id); } });
    stage.addEventListener('pointermove', function (e) {
      if (reduce) return;
      var r = stage.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      stage.style.setProperty('--rx', (y * -14).toFixed(2) + 'deg');
      stage.style.setProperty('--ry', (x * 18).toFixed(2) + 'deg');
    });
    stage.addEventListener('pointerleave', function () { stage.style.setProperty('--rx', '0deg'); stage.style.setProperty('--ry', '0deg'); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { en[0].isIntersecting && !$('#home').hidden ? heroStart() : heroStop(); }).observe(stage);
    } else heroStart();

    // ڕیزی ناوەکان
    var tk = D.map(function (d) {
      return '<span class="tk-item" style="' + styleVars(d.color) + '"><i></i>' + esc(d.n) + '<em dir="ltr">' + esc(d.en) + '</em></span>';
    }).join('');
    $('#ticker').innerHTML = tk + tk;

    // ژمارەکان
    var engCount = 0, projCount = 0, brCount = 0, swCount = 0;
    D.forEach(function (d) {
      engCount += d.eng.length; brCount += d.br.length; swCount += d.sw.length;
      d.eng.forEach(function (e) { projCount += e.p.length; });
    });
    $('#stats').innerHTML = [
      [D.length, 'بەشی ئەندازیاری', 'civil'],
      [brCount, 'لق و پسپۆڕی', 'branch'],
      [engCount, 'ئەندازیاری زیرەک', 'star'],
      [projCount, 'پڕۆژەی جیهانی', 'pin'],
      [swCount, 'نەرمەکاڵای سەرەکی', 'code']
    ].map(function (s, i) {
      return '<div class="stat rv" style="--d:' + i * 90 + 'ms">' + icon(s[2]) + '<b data-count="' + s[0] + '">' + kd(0) + '</b><span>' + s[1] + '</span></div>';
    }).join('');

    // ڕەنگی کڵاوی هەر بەش
    $('#helmetRail').innerHTML = D.map(function (d, i) {
      return '<a class="hchip rv" href="#/dept/' + d.id + '" style="' + styleVars(d.color) + ';--d:' + (i % 7) * 60 + 'ms">' +
        '<span class="hchip-helmet">' + helmet(d.color, { icon: d.icon }) + '</span>' +
        '<b>' + esc(d.cname) + '</b><small>' + esc(d.n) + '</small></a>';
    }).join('');

    renderGrid('');
    $('#deptSearch').addEventListener('input', function (e) { renderGrid(e.target.value); });

    renderSafety();
    renderLegends();
    renderQuiz();

    $('#others').querySelector('.others-grid').innerHTML = E.others.map(function (o, i) {
      return '<div class="other rv" style="--d:' + (i % 5) * 70 + 'ms"><span class="other-n mono">' + pad(i + 1) + '</span><b>' + esc(o.n) + '</b><em dir="ltr">' + esc(o.en) + '</em><p>' + esc(o.d) + '</p></div>';
    }).join('');

    observe($('#home'));
  }

  function renderGrid(q) {
    q = (q || '').trim().toLowerCase();
    var list = D.filter(function (d) {
      if (!q) return true;
      var hay = (d.n + ' ' + d.en + ' ' + d.cname + ' ' + d.br.map(function (b) { return b[0] + ' ' + b[1]; }).join(' ') + ' ' + d.sw.map(function (s) { return s[0]; }).join(' ')).toLowerCase();
      return hay.indexOf(q) > -1;
    });
    var grid = $('#deptGrid');
    grid.innerHTML = list.length ? list.map(function (d) {
      return '<a class="dcard spot" href="#/dept/' + d.id + '" style="' + styleVars(d.color) + '">' +
        '<span class="dcard-glow"></span>' +
        '<span class="dcard-top"><span class="dnum mono">' + pad(d.idx + 1) + '</span><span class="dicon">' + icon(d.icon) + '</span></span>' +
        '<span class="dcard-helmet">' + helmet(d.color, { icon: d.icon }) + '</span>' +
        '<h3>' + esc(d.n) + '</h3><em class="den" dir="ltr">' + esc(d.en) + '</em>' +
        '<p class="dtag">' + esc(d.tag) + '</p>' +
        '<span class="dmeta"><span>' + kd(d.br.length) + ' لق</span><span>' + kd(d.years) + ' ساڵ</span><span><i></i>کڵاوی ' + esc(d.cname) + '</span></span>' +
        '<span class="dgo">بچۆ ژوورەوە ' + icon('arrowL') + '</span>' +
        '</a>';
    }).join('') : '<p class="empty">هیچ بەشێک نەدۆزرایەوە. وشەیەکی تر تاقی بکەرەوە.</p>';
    $$('.dcard', grid).forEach(function (c, i) {
      c.classList.add('rv'); c.style.setProperty('--d', (i % 4) * 70 + 'ms');
      if (revealIO && !q) revealIO.observe(c); else c.classList.add('in');
    });
  }

  function typeDiagram(dirs) {
    var arrows = '';
    arrows += '<g class="arr"><path d="M110 -18V8"/><path d="M103 1l7 8 7-8"/></g>';
    if (dirs.indexOf('side') > -1) {
      arrows += '<g class="arr"><path d="M-6 70H22"/><path d="M15 63l8 7-8 7"/></g><g class="arr"><path d="M226 70H198"/><path d="M205 63l-8 7 8 7"/></g>';
    }
    return '<svg class="type-svg" viewBox="-12 -24 244 170" aria-hidden="true">' + arrows + '</svg>';
  }

  function renderSafety() {
    $('#codeGrid').innerHTML = E.helmetCodes.map(function (h, i) {
      return '<div class="code rv" style="' + styleVars(h.c) + ';--d:' + (i % 5) * 60 + 'ms"><span class="code-h">' + helmet(h.c) + '</span><b>' + esc(h.n) + '</b><p>' + esc(h.r) + '</p></div>';
    }).join('');

    $('#typeGrid').innerHTML = E.helmetTypes.map(function (t) {
      return '<div class="type rv"><div class="type-vis">' + helmet(DEFAULT_ACCENT) + typeDiagram(t.dirs) + '</div><span class="mono tkey" dir="ltr">' + t.k + '</span><b>' + esc(t.n) + '</b><p>' + esc(t.d) + '</p></div>';
    }).join('');

    var volts = { 'Class G': 11, 'Class E': 100, 'Class C': 0 };
    $('#classGrid').innerHTML = E.helmetClasses.map(function (c, i) {
      return '<div class="klass rv" style="--d:' + i * 80 + 'ms;--v:' + volts[c.k] + '%"><div class="klass-top">' + icon('elec') + '<span class="mono" dir="ltr">' + c.k + '</span></div><b>' + esc(c.n) + '</b><div class="volt"><i></i></div><span class="vtx">' + esc(c.v) + '</span><p>' + esc(c.d) + '</p></div>';
    }).join('');

    $('#styleGrid').innerHTML = E.helmetStyles.map(function (s, i) {
      return '<div class="hstyle rv" style="--d:' + (i % 4) * 60 + 'ms"><span class="mono hs-n">' + pad(i + 1) + '</span><b>' + esc(s.n) + '</b><em dir="ltr">' + esc(s.en) + '</em><p>' + esc(s.d) + '</p></div>';
    }).join('');

    $('#stdList').innerHTML = E.standards.map(function (s) {
      return '<li><span class="mono" dir="ltr">' + esc(s.k) + '</span>' + esc(s.d) + '</li>';
    }).join('');
    $('#careList').innerHTML = E.helmetCare.map(function (c) { return '<li>' + icon('check') + '<span>' + esc(c) + '</span></li>'; }).join('');

    $('#ppeGrid').innerHTML = Object.keys(E.ppe).map(function (k, i) {
      var p = E.ppe[k];
      var used = D.filter(function (d) { return d.ppe.indexOf(k) > -1; });
      var dots = used.map(function (d) { return '<i title="' + esc(d.n) + '" style="background:' + d.color + '"></i>'; }).join('');
      return '<div class="ppe rv spot" style="--d:' + (i % 6) * 50 + 'ms"><span class="ppe-ic">' + icon(k) + '</span><b>' + esc(p.n) + '</b><em dir="ltr">' + esc(p.en) + '</em><p>' + esc(p.d) + '</p>' + (dots ? '<span class="ppe-dots">' + dots + '</span>' : '') + '</div>';
    }).join('');
  }

  function renderLegends() {
    var all = [];
    D.forEach(function (d) { d.eng.forEach(function (e) { all.push({ e: e, d: d }); }); });
    var half = Math.ceil(all.length / 2);
    function row(items) {
      var html = items.map(function (x) {
        return '<a class="leg" href="#/dept/' + x.d.id + '" style="' + styleVars(x.d.color) + '">' +
          '<span class="leg-ph ph">' + imgTag(x.e.w, x.e.en + ' engineer', x.e.en) + '<span class="ph-fb mono">' + esc(initials(x.e.en)) + '</span></span>' +
          '<span class="leg-tx"><b>' + esc(x.e.n) + '</b><small>' + esc(x.d.n) + '</small></span></a>';
      }).join('');
      return html + html;
    }
    $('#legRow1').innerHTML = row(all.slice(0, half));
    $('#legRow2').innerHTML = row(all.slice(half));
    var sec = $('#legends');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { IMG.fill(sec); io.disconnect(); }
      }, { rootMargin: '600px 0px' });
      io.observe(sec);
    } else IMG.fill(sec);
  }

  /* ───────────── تاقیکردنەوەی هەڵبژاردنی بەش ───────────── */
  var quiz = { i: 0, s: {}, max: {} };
  (function () {
    E.quiz.forEach(function (q) {
      var best = {};
      q.a.forEach(function (a) { Object.keys(a.s).forEach(function (k) { best[k] = Math.max(best[k] || 0, a.s[k]); }); });
      Object.keys(best).forEach(function (k) { quiz.max[k] = (quiz.max[k] || 0) + best[k]; });
    });
  })();

  function renderQuiz() {
    var box = $('#quizBox');
    if (quiz.i >= E.quiz.length) return renderQuizResult(box);
    var q = E.quiz[quiz.i];
    box.innerHTML =
      '<div class="qz-top"><span class="mono">' + pad(quiz.i + 1) + ' / ' + pad(E.quiz.length) + '</span><div class="qz-bar"><i style="width:' + (quiz.i / E.quiz.length * 100) + '%"></i></div></div>' +
      '<h3 class="qz-q">' + esc(q.q) + '</h3>' +
      '<div class="qz-opts">' + q.a.map(function (a, i) {
        return '<button class="qz-opt" data-i="' + i + '"><span class="mono">' + kd(i + 1) + '</span>' + esc(a.t) + '</button>';
      }).join('') + '</div>' +
      (quiz.i > 0 ? '<button class="qz-reset">' + icon('refresh') + ' دەستپێکردنەوە</button>' : '');
    box.classList.remove('qz-anim'); void box.offsetWidth; box.classList.add('qz-anim');
  }
  function renderQuizResult(box) {
    var ranked = D.map(function (d) {
      var sc = quiz.s[d.id] || 0, mx = quiz.max[d.id] || 1;
      return { d: d, sc: sc, pct: Math.round(sc / mx * 100) };
    }).sort(function (a, b) { return b.pct - a.pct || b.sc - a.sc; }).slice(0, 3);
    box.innerHTML =
      '<div class="qz-top"><span class="mono">✓</span><div class="qz-bar"><i style="width:100%"></i></div></div>' +
      '<h3 class="qz-q">ئەمانە گونجاوترین بەشەکانن بۆ تۆ</h3>' +
      '<div class="qz-res">' + ranked.map(function (r, i) {
        return '<a class="qz-card" href="#/dept/' + r.d.id + '" style="' + styleVars(r.d.color) + '"><span class="qz-rank mono">' + kd(i + 1) + '</span>' +
          '<span class="qz-helmet">' + helmet(r.d.color, { icon: r.d.icon }) + '</span><b>' + esc(r.d.n) + '</b>' +
          '<span class="qz-pct"><i style="width:' + r.pct + '%"></i></span><small>' + kd(r.pct) + '٪ گونجان</small></a>';
      }).join('') + '</div>' +
      '<p class="qz-note">ئەم ئەنجامە تەنها ڕێنماییە؛ پێش بڕیاردان قسە لەگەڵ ئەندازیار و قوتابیانی ئەو بەشانە بکە.</p>' +
      '<button class="qz-reset">' + icon('refresh') + ' دووبارە تاقیکردنەوە</button>';
    box.classList.remove('qz-anim'); void box.offsetWidth; box.classList.add('qz-anim');
  }
  document.addEventListener('click', function (e) {
    var opt = e.target.closest('.qz-opt');
    if (opt) {
      var a = E.quiz[quiz.i].a[+opt.getAttribute('data-i')];
      Object.keys(a.s).forEach(function (k) { quiz.s[k] = (quiz.s[k] || 0) + a.s[k]; });
      quiz.i++;
      renderQuiz();
      return;
    }
    if (e.target.closest('.qz-reset')) { quiz.i = 0; quiz.s = {}; renderQuiz(); }
  });

  /* ───────────── پەڕەی بەش ───────────── */
  function secHead(num, en, title, lead) {
    return '<header class="sec-head"><span class="sec-num mono" dir="ltr">' + num + ' / ' + en + '</span>' +
      '<h2 class="split">' + esc(title) + '</h2>' + (lead ? '<p class="lead rv">' + esc(lead) + '</p>' : '') + '</header>';
  }

  function renderDept(d) {
    var prev = D[(d.idx - 1 + D.length) % D.length], next = D[(d.idx + 1) % D.length];
    var tabs = [['d-about', 'دەربارە'], ['d-study', 'چی دەخوێنن'], ['d-branches', 'لقەکان'], ['d-grad', 'ماستەر و دکتۆرا'], ['d-software', 'نەرمەکاڵا'], ['d-jobs', 'کار'], ['d-safety', 'سەلامەتی'], ['d-engineers', 'ئەندازیاران']];
    var h = '';

    // سەرەوە
    h += '<section class="d-hero">' +
      '<div class="d-hero-tx">' +
      '<a class="back" href="#/">' + icon('arrowR') + ' هەموو بەشەکان</a>' +
      '<span class="kicker mono" dir="ltr">DEPARTMENT ' + (d.idx + 1 < 10 ? '0' : '') + (d.idx + 1) + ' / ' + D.length + '</span>' +
      '<h1 class="split">' + esc(d.n) + '</h1>' +
      '<p class="d-en" dir="ltr" data-px="0.18">' + esc(d.en) + '</p>' +
      '<p class="d-tag rv">' + esc(d.tag) + '</p>' +
      '<div class="d-chips rv">' +
      '<span>' + icon('cap') + kd(d.years) + ' ساڵ خوێندن</span>' +
      '<span>' + icon('branch') + kd(d.br.length) + ' لق</span>' +
      '<span>' + icon('star') + kd(d.eng.length) + ' ئەندازیاری ناودار</span>' +
      '<span class="chip-helmet"><i></i>کڵاوی ' + esc(d.cname) + '</span>' +
      '</div></div>' +
      '<div class="d-hero-vis rv">' +
      '<div class="d-rings"><span></span><span></span><span></span></div>' +
      '<div class="d-helmet">' + helmet(d.color, { cls: 'big', icon: d.icon }) + '</div>' +
      '<div class="d-hlabel"><b>کڵاوی ' + esc(d.cname) + '</b><span class="mono" dir="ltr">' + esc(d.color.toUpperCase()) + '</span></div>' +
      '</div></section>';

    h += '<nav class="d-tabs" id="dTabs"><div class="d-tabs-in">' + tabs.map(function (t) {
      return '<button data-target="' + t[0] + '">' + t[1] + '</button>';
    }).join('') + '</div></nav>';

    // دەربارە
    h += '<section class="sec d-sec" id="d-about">' + secHead('01', 'ABOUT', 'بەشەکە چۆنە؟', null) +
      '<div class="about-grid"><p class="about-tx rv">' + esc(d.about) + '</p>' +
      '<div class="fact rv">' + icon('bulb') + '<div><b>ئایا دەزانی؟</b><p>' + esc(d.fact) + '</p></div></div></div>' +
      '<h3 class="sub rv">سروشتی کارکردن</h3>' +
      '<div class="nature">' + d.nature.map(function (n, i) {
        return '<div class="nat rv spot" style="--d:' + i * 80 + 'ms"><span class="mono">' + pad(i + 1) + '</span><p>' + esc(n) + '</p></div>';
      }).join('') + '</div>' +
      '<div class="bigword" dir="ltr" data-px="-0.35" aria-hidden="true">' + esc(d.en.toUpperCase()) + '</div></section>';

    // خوێندن
    h += '<section class="sec d-sec" id="d-study">' + secHead('02', 'CURRICULUM', 'چی دەخوێنن؟', 'خوێندنی ئەم بەشە بە گشتی ' + kd(d.years) + ' ساڵە. ئەمانە وانە سەرەکییەکانی هەر قۆناغێکن (وانەکان لە زانکۆیەکەوە بۆ زانکۆیەکی تر کەمێک جیاوازن).') +
      '<div class="stages s' + d.study.length + '">' + d.study.map(function (st, i) {
        return '<div class="stage rv" style="--d:' + i * 110 + 'ms"><div class="stage-h"><span class="stage-n">' + kd(i + 1) + '</span><b>' + esc(st[0]) + '</b></div><ul>' +
          st[1].map(function (s) { var p = pair(s); return '<li><span>' + esc(p.ku) + '</span><em dir="ltr">' + esc(p.en) + '</em></li>'; }).join('') + '</ul></div>';
      }).join('') + '</div></section>';

    // لقەکان
    h += '<section class="sec d-sec" id="d-branches">' + secHead('03', 'BRANCHES', 'چەند لقی لێ دەبێتەوە؟', null) +
      '<div class="br-wrap"><div class="br-count rv"><b data-count="' + d.br.length + '">' + kd(0) + '</b><span>لق و پسپۆڕی سەرەکی</span></div>' +
      '<div class="br-grid">' + d.br.map(function (b, i) {
        return '<div class="br rv spot" style="--d:' + (i % 4) * 70 + 'ms"><span class="br-n mono">' + pad(i + 1) + '</span><b>' + esc(b[0]) + '</b><em dir="ltr">' + esc(b[1]) + '</em><p>' + esc(b[2]) + '</p></div>';
      }).join('') + '</div></div></section>';

    // ماستەر و دکتۆرا
    function gradList(arr) {
      return arr.map(function (s, i) { var p = pair(s); return '<li class="rv" style="--d:' + i * 50 + 'ms"><span>' + esc(p.ku) + '</span><em dir="ltr">' + esc(p.en) + '</em></li>'; }).join('');
    }
    h += '<section class="sec d-sec" id="d-grad">' + secHead('04', 'POSTGRADUATE', 'ماستەر و دکتۆرا', 'دوای بەکالۆریۆس دەتوانیت لەم پسپۆڕییانەدا بەردەوام بیت. ماستەر بە گشتی ٢ ساڵ و دکتۆرا ٣ تا ٥ ساڵ دەخایەنێت.') +
      '<div class="grad"><div class="grad-col rv"><div class="grad-h">' + icon('cap') + '<b>ماستەر</b><span class="mono" dir="ltr">M.Sc.</span></div><ul>' + gradList(d.msc) + '</ul></div>' +
      '<div class="grad-col phd rv"><div class="grad-h">' + icon('book') + '<b>دکتۆرا — بوارەکانی توێژینەوە</b><span class="mono" dir="ltr">Ph.D.</span></div><ul>' + gradList(d.phd) + '</ul></div></div></section>';

    // نەرمەکاڵا
    h += '<section class="sec d-sec" id="d-software">' + secHead('05', 'SOFTWARE', 'نەرمەکاڵا سەرەکییەکان', 'ئەم بەرنامانە لە زانکۆ و بازاڕی کاردا زۆرترین بەکارهێنانیان هەیە؛ فێربوونیان دەرفەتی کارت زیاد دەکات.') +
      '<div class="sw-grid">' + d.sw.map(function (s, i) {
        var mono = s[0].replace(/[^A-Za-z0-9]/g, '').slice(0, 2);
        return '<div class="sw rv spot" style="--d:' + (i % 5) * 50 + 'ms"><span class="sw-logo mono" dir="ltr">' + esc(mono) + '</span><div><b dir="ltr">' + esc(s[0]) + '</b><p>' + esc(s[1]) + '</p></div></div>';
      }).join('') + '</div></section>';

    // کار
    h += '<section class="sec d-sec" id="d-jobs">' + secHead('06', 'CAREERS', 'کارەکانیان چییە؟', 'دوای دەرچوون ئەمانە بوارە سەرەکییەکانی کارن — لە کوردستان و لە جیهاندا.') +
      '<div class="jobs">' + d.jobs.map(function (j, i) {
        return '<div class="job rv" style="--d:' + (i % 2) * 80 + 'ms">' + icon('briefcase') + '<span>' + esc(j) + '</span></div>';
      }).join('') + '</div></section>';

    // سەلامەتی
    h += '<section class="sec d-sec" id="d-safety">' + secHead('07', 'SAFETY', 'کڵاو و کەرەستەی سەلامەتی', null) +
      '<div class="safe">' +
      '<div class="safe-helmet rv"><div class="safe-vis">' + helmet(d.color, { cls: 'big', icon: d.icon }) + '</div>' +
      '<dl><dt>ڕەنگی کڵاو</dt><dd><i style="background:' + d.color + '"></i>' + esc(d.cname) + '</dd>' +
      '<dt>جۆر و پۆل</dt><dd>' + esc(d.spec) + '</dd>' +
      '<dt>شێوە</dt><dd>' + esc(d.style) + '</dd></dl>' +
      '<p class="why">' + esc(d.why) + '</p></div>' +
      '<div class="safe-ppe"><h3 class="sub rv">کەرەستەی پاراستنی پێویست</h3><div class="ppe-list">' + d.ppe.map(function (k, i) {
        var p = E.ppe[k];
        return '<div class="ppe-item rv" style="--d:' + i * 60 + 'ms"><span class="ppe-ic">' + icon(k) + '</span><div><b>' + esc(p.n) + '</b><p>' + esc(p.d) + '</p></div></div>';
      }).join('') + '</div>' +
      '<div class="tip rv">' + icon('shield') + '<div><b>ئامۆژگاری سەلامەتی</b><p>' + esc(d.tip) + '</p></div></div></div></div></section>';

    // ئەندازیاران
    h += '<section class="sec d-sec" id="d-engineers">' + secHead('08', 'LEGENDS', 'زیرەکترین ئەندازیارانی ئەم بەشە', '٥ ئەندازیاری ناودار و ٣ پڕۆژەی بەهێزی هەر یەکێکیان. وێنەکان لە ویکیپیدیا / ویکیمیدیا کۆمنزەوە دێن.') +
      '<div class="engs">' + d.eng.map(function (e, i) {
        return '<article class="eng rv">' +
          '<div class="eng-head">' +
          '<figure class="eng-ph ph">' + imgTag(e.w, e.en + ' engineer', e.en) + '<span class="ph-fb mono">' + esc(initials(e.en)) + '</span><span class="eng-rank mono">' + pad(i + 1) + '</span></figure>' +
          '<div class="eng-info"><h3>' + esc(e.n) + '</h3><em dir="ltr">' + esc(e.en) + '</em>' +
          '<div class="eng-meta"><span>' + icon('info') + kd(e.life) + '</span><span>' + icon('pin') + esc(e.from) + '</span></div>' +
          '<p>' + esc(e.bio) + '</p>' +
          '<div class="links"><a href="' + wikiUrl(e.w) + '" target="_blank" rel="noopener">' + icon('ext') + 'ویکیپیدیا</a>' +
          '<a href="' + googleUrl(e.en) + '" target="_blank" rel="noopener">' + icon('image') + 'وێنەکان لە گووگڵ</a></div></div></div>' +
          '<div class="projs">' + e.p.map(function (p, j) {
            return '<div class="proj spot" style="--d:' + j * 90 + 'ms">' +
              '<figure class="proj-ph ph">' + imgTag(p.w, p.q || p.en, p.en) + '<span class="ph-fb">' + icon(d.icon) + '</span><span class="proj-y mono">' + kd(p.y) + '</span></figure>' +
              '<div class="proj-b"><b>' + esc(p.n) + '</b><em dir="ltr">' + esc(p.en) + '</em><p>' + esc(p.d) + '</p>' +
              '<div class="proj-f"><span>' + icon('pin') + esc(p.at) + '</span>' +
              '<a href="' + googleUrl(p.en + ' ' + e.en) + '" target="_blank" rel="noopener" aria-label="وێنەکانی ' + esc(p.n) + ' لە گووگڵ">' + icon('image') + '</a>' +
              '<a href="' + wikiUrl(p.w) + '" target="_blank" rel="noopener" aria-label="' + esc(p.n) + ' لە ویکیپیدیا">' + icon('ext') + '</a></div></div></div>';
          }).join('') + '</div></article>';
      }).join('') + '</div></section>';

    // بەشی پێشوو / دواتر
    h += '<nav class="pn">' +
      '<a class="pn-card" href="#/dept/' + prev.id + '" style="' + styleVars(prev.color) + '"><span class="pn-dir">' + icon('arrowR') + ' بەشی پێشوو</span><span class="pn-h">' + helmet(prev.color, { icon: prev.icon }) + '</span><b>' + esc(prev.n) + '</b></a>' +
      '<a class="pn-card nx" href="#/dept/' + next.id + '" style="' + styleVars(next.color) + '"><span class="pn-dir">بەشی دواتر ' + icon('arrowL') + '</span><span class="pn-h">' + helmet(next.color, { icon: next.icon }) + '</span><b>' + esc(next.n) + '</b></a>' +
      '</nav>';
    return h;
  }

  var tabIO = null;
  function mountDept(d) {
    var view = $('#dept');
    view.innerHTML = renderDept(d);
    view.style.cssText = styleVars(d.color);
    observe(view);
    // وێنەکان دوای ئامادەبوونی پەڕەکە
    setTimeout(function () { IMG.fill(view); }, 60);
    // تابەکان
    $$('#dTabs button').forEach(function (b) {
      b.addEventListener('click', function () {
        var t = document.getElementById(b.getAttribute('data-target'));
        if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 130, behavior: reduce ? 'auto' : 'smooth' });
      });
    });
    if (tabIO) tabIO.disconnect();
    if ('IntersectionObserver' in window) {
      tabIO = new IntersectionObserver(function (en) {
        en.forEach(function (x) {
          if (x.isIntersecting) {
            $$('#dTabs button').forEach(function (b) {
              var on = b.getAttribute('data-target') === x.target.id;
              b.classList.toggle('on', on);
              if (on && b.scrollIntoView && window.innerWidth < 900) {
                var bar = $('#dTabs .d-tabs-in');
                bar.scrollTo({ left: b.offsetLeft - bar.clientWidth / 2 + b.clientWidth / 2, behavior: 'smooth' });
              }
            });
          }
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      $$('.d-sec', view).forEach(function (s) { tabIO.observe(s); });
    }
    document.title = d.n + ' — ئەندازیارنامە';
  }

  /* ───────────── کڵاو لەسەرکردن (ئەنیمەیشنی چوونە ژوورەوە) ───────────── */
  var dropBusy = false;
  function playDrop(d, mid, done) {
    var drop = $('#drop');
    if (reduce) { mid(); done && done(); return; }
    dropBusy = true;
    drop.style.cssText = styleVars(d.color);
    $('.drop-helmet', drop).innerHTML = helmet(d.color, { cls: 'big', icon: d.icon });
    $('.drop-title', drop).textContent = 'کڵاوی ' + d.cname + ' لەسەر بکە';
    $('.drop-sub', drop).textContent = 'بەخێربێیت بۆ ' + d.n;
    drop.hidden = false;
    drop.classList.remove('run', 'out'); void drop.offsetWidth; drop.classList.add('run');
    setAccent(d.color);
    var finished = false;
    function finish() {
      if (finished) return; finished = true;
      mid();
      drop.classList.add('out');
      setTimeout(function () { drop.hidden = true; drop.classList.remove('run', 'out'); dropBusy = false; done && done(); }, 520);
    }
    var t = setTimeout(finish, 1500);
    drop.onclick = function () { clearTimeout(t); finish(); };
  }

  /* ───────────── ڕێڕەو (Router) ───────────── */
  var homeScroll = 0, inDept = false;
  function go(id) { location.hash = '#/dept/' + id; }

  function showDept(d) {
    var home = $('#home'), view = $('#dept');
    if (!inDept) homeScroll = window.scrollY;
    heroStop();
    playDrop(d, function () {
      mountDept(d);
      home.hidden = true; view.hidden = false; inDept = true;
      $('.ticker').hidden = true;
      window.scrollTo(0, 0);
      collectParallax();
      setAccent(d.color);
    });
  }

  function showHome(anchor) {
    var home = $('#home'), view = $('#dept');
    var wasDept = inDept;
    if (inDept) {
      view.hidden = true; view.innerHTML = ''; home.hidden = false; inDept = false;
      $('.ticker').hidden = false;
      document.title = 'ئەندازیارنامە — ئینسایکلۆپیدیای بەشە ئەندازیارییەکان';
      collectParallax();
    }
    setAccent(DEFAULT_ACCENT);
    if (window.BG) BG.setColor(D[heroIdx].color);
    heroStart();
    var el = anchor && anchor.length > 1 && anchor.charAt(1) !== '/' ? document.getElementById(anchor.slice(1)) : null;
    if (el) {
      requestAnimationFrame(function () { el.scrollIntoView({ behavior: wasDept || reduce ? 'auto' : 'smooth', block: 'start' }); });
    } else if (wasDept) {
      window.scrollTo(0, homeScroll);
    }
  }

  function route() {
    var h = location.hash || '';
    var m = h.match(/^#\/dept\/([\w-]+)/);
    closeMenu();
    if (m && byId[m[1]]) showDept(byId[m[1]]);
    else showHome(h);
  }

  /* ───────────── لیستی مۆبایل ───────────── */
  function closeMenu() { document.body.classList.remove('menu-open'); var b = $('#menuBtn'); if (b) b.setAttribute('aria-expanded', 'false'); }

  /* ───────────── کاریگەری ماوس لە سەر کارتەکان ───────────── */
  document.addEventListener('pointermove', function (e) {
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
  }, { passive: true });
  document.addEventListener('pointerout', function (e) {
    var c = e.target.closest && e.target.closest('.dcard');
    if (c && !c.contains(e.relatedTarget)) { c.style.setProperty('--tx', '0deg'); c.style.setProperty('--ty', '0deg'); }
  });

  /* ───────────── دەستپێکردن ───────────── */
  function init() {
    $('#menuBtn').innerHTML = icon('menu') + icon('close');
    $('#menuBtn').addEventListener('click', function () {
      var open = document.body.classList.toggle('menu-open');
      this.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    $('#toTop').addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });
    $$('[data-icon]').forEach(function (el) { el.insertAdjacentHTML('afterbegin', icon(el.getAttribute('data-icon'))); });
    renderHome();
    window.addEventListener('hashchange', route);
    window.addEventListener('resize', function () { collectParallax(); tickerHalf = 0; });
    $('#nav').addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
    route();
    requestAnimationFrame(frame);
    document.body.classList.add('ready');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
