/* Animated engineering background — one scene per department, cross-faded.
   BG.setScene(name) · BG.setColor(hex) · BG.velocity() */
window.BG = (function () {
  'use strict';
  var cv = document.getElementById('bg');
  var noop = { setColor: function () {}, setScene: function () {}, velocity: function () { return 0; } };
  if (!cv || !cv.getContext) return noop;
  var ctx = cv.getContext('2d');
  var reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var TAU = Math.PI * 2;
  var FONT = 'Zain, system-ui, sans-serif';
  var W = 0, H = 0, S = 0, DPR = 1, small = false;
  var t = 0, flow = 0, sy = 0, lastSy = 0, vel = 0, running = true, k = 1, lastT = 0;
  var col = [255, 184, 28], tgt = col.slice();
  var BLUE = [150, 190, 255], WHITE = [235, 242, 255];
  var mouse = { x: -9999, y: -9999 };
  var pts = [];
  var cur = 'home', prev = null, mix = 1;

  /* ───────── helpers ───────── */
  function hexToRgb(h) {
    h = String(h).replace('#', '');
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    var n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function rgba(c, a) { return 'rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + (a < 0 ? 0 : a) + ')'; }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function wrap(v, m) { return ((v % m) + m) % m; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, k) { return a + (b - a) * k; }
  function stroke(c, a, w) { ctx.strokeStyle = rgba(c, a); if (w) ctx.lineWidth = w; }
  function fill(c, a) { ctx.fillStyle = rgba(c, a); }
  function line(x1, y1, x2, y2) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
  function circle(x, y, r, doFill) { ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, TAU); if (doFill) ctx.fill(); else ctx.stroke(); }
  function glowDot(x, y, r, c, a) {
    ctx.save();
    ctx.shadowColor = rgba(c, 1); ctx.shadowBlur = 14;
    fill(c, a); circle(x, y, r, true);
    ctx.restore();
  }
  function label(s, x, y, size, c, a, align) {
    ctx.font = (size || 13) + 'px ' + FONT;
    ctx.textAlign = align || 'center';
    ctx.textBaseline = 'middle';
    fill(c, a); ctx.fillText(s, x, y);
  }
  function dash(on) { ctx.setLineDash(on || []); }
  /* horizontal dimension line with arrow heads */
  function dim(x1, y, x2, txt, a) {
    a = a == null ? 1 : a;
    stroke(BLUE, 0.22 * a, 1);
    line(x1, y - 8, x1, y + 8); line(x2, y - 8, x2, y + 8); line(x1, y, x2, y);
    fill(BLUE, 0.35 * a);
    ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x1 + 8, y - 3); ctx.lineTo(x1 + 8, y + 3); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x2, y); ctx.lineTo(x2 - 8, y - 3); ctx.lineTo(x2 - 8, y + 3); ctx.closePath(); ctx.fill();
    if (txt) label(txt, (x1 + x2) / 2, y - 10, 12, [170, 205, 255], 0.42 * a);
  }
  function gear(x, y, R, n, rot, a) {
    var ri = R * 0.84, step = TAU / n;
    ctx.save(); ctx.translate(x, y);
    ctx.beginPath();
    for (var i = 0; i < n; i++) {
      var b = rot + i * step;
      var p = [[ri, b], [R, b + step * 0.14], [R, b + step * 0.38], [ri, b + step * 0.52]];
      for (var j = 0; j < 4; j++) {
        var px = p[j][0] * Math.cos(p[j][1]), py = p[j][0] * Math.sin(p[j][1]);
        if (i === 0 && j === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.arc(0, 0, ri, b + step * 0.52, b + step, false);
    }
    ctx.closePath();
    stroke(col, 0.22 * a, 1.2); ctx.stroke();
    fill(col, 0.03 * a); ctx.fill();
    stroke(col, 0.13 * a); circle(0, 0, R * 0.62);
    stroke(col, 0.24 * a); circle(0, 0, R * 0.18);
    stroke(col, 0.1 * a);
    for (var k = 0; k < 5; k++) {
      var aa = rot + (k * TAU) / 5;
      line(Math.cos(aa) * R * 0.18, Math.sin(aa) * R * 0.18, Math.cos(aa) * R * 0.62, Math.sin(aa) * R * 0.62);
    }
    dash([10, 4, 2, 4]); stroke(BLUE, 0.14 * a);
    line(-R * 1.25, 0, R * 1.25, 0); line(0, -R * 1.25, 0, R * 1.25);
    dash();
    ctx.restore();
  }
  /* lattice mast between two x positions (tapered) */
  function lattice(xb1, xb2, yb, xt1, xt2, yt, levels, c, a) {
    stroke(c, a, 1);
    line(xb1, yb, xt1, yt); line(xb2, yb, xt2, yt);
    ctx.beginPath();
    for (var i = 0; i < levels; i++) {
      var k1 = i / levels, k2 = (i + 1) / levels;
      var l1 = lerp(xb1, xt1, k1), r1 = lerp(xb2, xt2, k1), y1 = lerp(yb, yt, k1);
      var l2 = lerp(xb1, xt1, k2), r2 = lerp(xb2, xt2, k2), y2 = lerp(yb, yt, k2);
      ctx.moveTo(l1, y1); ctx.lineTo(r2, y2); ctx.moveTo(r1, y1); ctx.lineTo(l2, y2);
      ctx.moveTo(l2, y2); ctx.lineTo(r2, y2);
    }
    ctx.stroke();
  }

  /* ═════════════════ Scenes ═════════════════ */
  var scenes = {};

  /* HOME — gears + blueprint dimension notes */
  scenes.home = {
    init: function (s) {
      var r1 = S * 0.2, r2 = r1 * 0.55, r3 = S * 0.15, r4 = r3 * 0.62;
      var g1 = { x: W * 0.06, y: H * 0.28, r: r1, n: 24 };
      var g2 = { x: g1.x + Math.cos(0.55) * (r1 + r2) * 0.93, y: g1.y + Math.sin(0.55) * (r1 + r2) * 0.93, r: r2, n: 13 };
      var g3 = { x: W * 0.95, y: H * 0.95, r: r3, n: 18 };
      var g4 = { x: g3.x + Math.cos(-2.4) * (r3 + r4) * 0.93, y: g3.y + Math.sin(-2.4) * (r3 + r4) * 0.93, r: r4, n: 11 };
      s.pairs = [[g1, g2, 1], [g3, g4, -1]];
      s.notes = [
        { x: W * 0.62, y: H * 0.18, w: S * 0.26, l: 'L = 12 400 mm' },
        { x: W * 0.18, y: H * 1.2, w: S * 0.3, l: 'Ø 2 × R ' + Math.round(r1) },
        { x: W * 0.55, y: H * 0.86, w: S * 0.2, l: 'σ = M·y / I' },
        { x: W * 0.3, y: H * 1.7, w: S * 0.22, l: 'V = I · R' }
      ];
    },
    draw: function (s) {
      var span = H * 2.2, rot = flow * 0.0022;
      s.pairs.forEach(function (p) {
        var a = p[0], b = p[1];
        var oy = wrap(a.y - sy * 0.18 + H * 0.4, span) - H * 0.4 - a.y;
        gear(a.x, a.y + oy, a.r, a.n, rot * p[2], 1);
        gear(b.x, b.y + oy, b.r, b.n, -rot * p[2] * (a.n / b.n) + Math.PI / b.n, 1);
      });
      s.notes.forEach(function (n) {
        var oy = wrap(n.y - sy * 0.12 + H * 0.2, span) - H * 0.2;
        dim(n.x, oy, n.x + n.w, n.l);
      });
    }
  };

  /* CIVIL — truss bridge with a moving load (stress glow) + tower crane */
  scenes.truss = {
    init: function (s) {
      var n = Math.max(7, Math.round(W / 120)), pw = (W * 1.1) / n, x0 = -W * 0.05;
      s.deck = H * 0.8; s.th = Math.min(150, S * 0.17); s.pw = pw;
      s.bot = []; s.top = []; s.mem = [];
      for (var i = 0; i <= n; i++) s.bot.push([x0 + i * pw, s.deck]);
      for (i = 0; i < n; i++) s.top.push([x0 + (i + 0.5) * pw, s.deck - s.th]);
      for (i = 0; i < n; i++) {
        s.mem.push([s.bot[i], s.bot[i + 1]], [s.bot[i], s.top[i]], [s.top[i], s.bot[i + 1]]);
        if (i < n - 1) s.mem.push([s.top[i], s.top[i + 1]]);
      }
      s.crane = { x: W * (small ? 0.82 : 0.86), base: s.deck - s.th - 4, top: H * (small ? 0.22 : 0.12), jib: S * (small ? 0.55 : 0.5), cj: S * 0.13 };
    },
    draw: function (s) {
      var c = s.crane, mw = 12, x = c.x;
      /* crane mast + jib */
      lattice(x - mw / 2, x + mw / 2, H + 10, x - mw / 2, x + mw / 2, c.top, Math.round((H - c.top) / 16), BLUE, 0.16);
      var jy = c.top, jx = x - c.jib;
      stroke(BLUE, 0.2, 1);
      line(x + c.cj, jy, jx, jy); line(x + c.cj, jy + 10, jx + 14, jy + 10);
      ctx.beginPath();
      for (var j = 0, xx = x; xx > jx + 14; xx -= 14, j++) { ctx.moveTo(xx, jy + 10); ctx.lineTo(xx - 7, jy); ctx.lineTo(xx - 14, jy + 10); }
      ctx.stroke();
      line(x, jy - 34, x - c.jib * 0.62, jy); line(x, jy - 34, x + c.cj, jy); line(x - mw / 2, jy, x, jy - 34); line(x + mw / 2, jy, x, jy - 34);
      fill(BLUE, 0.1); ctx.fillRect(x + c.cj - 26, jy - 2, 24, 18);
      var tx = x - c.jib * (0.25 + 0.6 * (0.5 + 0.5 * Math.sin(flow * 0.005)));
      var ang = Math.sin(flow * 0.021) * 0.07, L = (c.base - jy) * 0.5;
      var hx = tx + Math.sin(ang) * L, hy = jy + 10 + Math.cos(ang) * L;
      stroke(col, 0.35, 1); line(tx, jy + 10, hx, hy);
      ctx.strokeRect(tx - 6, jy + 6, 12, 6);
      stroke(col, 0.5, 1.2); fill(col, 0.07);
      ctx.beginPath(); ctx.rect(hx - 18, hy, 36, 16); ctx.fill(); ctx.stroke();
      glowDot(x, jy - 34, 2.2, col, 0.9);

      /* piers */
      stroke(BLUE, 0.13, 1);
      [0.18, 0.5, 0.82].forEach(function (k) {
        var px = W * k;
        line(px - 10, s.deck + 6, px - 16, H); line(px + 10, s.deck + 6, px + 16, H);
      });
      stroke(BLUE, 0.22, 3); line(-10, s.deck + 6, W + 10, s.deck + 6);

      /* members glow near the moving load */
      var span = W * 1.3, lx = wrap(flow * 1.1 + sy * 0.5, span) - W * 0.15;
      ctx.lineCap = 'round';
      for (var i = 0; i < s.mem.length; i++) {
        var m = s.mem[i], mx = (m[0][0] + m[1][0]) / 2;
        var k = Math.exp(-Math.pow((mx - lx) / (s.pw * 1.4), 2));
        if (k > 0.04) stroke(col, 0.16 + k * 0.6, 1 + k * 1.8); else stroke(BLUE, 0.17, 1);
        line(m[0][0], m[0][1], m[1][0], m[1][1]);
      }
      ctx.lineCap = 'butt';
      fill(BLUE, 0.4);
      s.top.concat(s.bot).forEach(function (p) { circle(p[0], p[1], 2, true); });
      /* load (truck) */
      fill(col, 0.75); ctx.fillRect(lx - 22, s.deck - 14, 32, 11); ctx.fillRect(lx + 12, s.deck - 11, 10, 8);
      glowDot(lx - 14, s.deck - 2, 2.6, col, 0.9); glowDot(lx + 14, s.deck - 2, 2.6, col, 0.9);
      stroke(col, 0.55, 1.4); line(lx, s.deck - 46, lx, s.deck - 20);
      fill(col, 0.55); ctx.beginPath(); ctx.moveTo(lx, s.deck - 18); ctx.lineTo(lx - 5, s.deck - 26); ctx.lineTo(lx + 5, s.deck - 26); ctx.closePath(); ctx.fill();
      label('P = 400 kN', lx, s.deck - 56, 12, col, 0.6);
      var b = s.bot;
      dim(b[1][0], s.deck - s.th - 30, b[b.length - 2][0], 'L = 120.00 m', 0.9);
    }
  };

  /* ARCHITECTURE — a floor plan that draws itself + grid axes */
  scenes.plan = {
    init: function (s) {
      var k = Math.min(W * (small ? 0.66 : 0.44), H * 0.6 * 100 / 70) / 100;
      s.k = k; s.ox = small ? W * 0.12 + 12 : W * 0.95 - 100 * k; s.oy = small ? H * 0.5 - 35 * k : H * 0.5 - 30 * k;
      var L = [];
      function l(a, b, c, d, kind) { L.push({ t: 'l', p: [a, b, c, d], kind: kind || 'wall' }); }
      function arc(cx, cy, r, a0, a1, leaf) { L.push({ t: 'a', p: [cx, cy, r, a0, a1, leaf] }); }
      l(0, 0, 100, 0); l(100, 0, 100, 70); l(100, 70, 58, 70); l(48, 70, 0, 70); l(0, 70, 0, 0);
      l(40, 0, 40, 28); l(40, 36, 40, 70); l(40, 42, 64, 42); l(72, 42, 100, 42); l(72, 42, 72, 70);
      l(0, 30, 12, 30); l(20, 30, 40, 30);
      arc(40, 28, 8, 0, Math.PI / 2, [48, 28]);
      arc(64, 42, 8, 0, Math.PI / 2, [64, 50]);
      arc(12, 30, 8, -Math.PI / 2, 0, [12, 22]);
      arc(48, 70, 10, -Math.PI / 2, 0, [48, 60]);
      l(8, -1.4, 30, -1.4, 'win'); l(8, 1.4, 30, 1.4, 'win'); l(56, -1.4, 88, -1.4, 'win'); l(56, 1.4, 88, 1.4, 'win');
      l(98.6, 10, 98.6, 32, 'win'); l(101.4, 10, 101.4, 32, 'win');
      for (var x = 76; x <= 96; x += 2.5) l(x, 48, x, 64, 'fur');
      l(76, 56, 95, 56, 'fur');
      L.push({ t: 'c', p: [70, 20, 7] });
      for (var i = 0; i < 6; i++) L.push({ t: 'c', p: [70 + Math.cos(i * TAU / 6) * 10.5, 20 + Math.sin(i * TAU / 6) * 10.5, 1.8] });
      l(5, 5, 19, 5, 'fur'); l(19, 5, 19, 25, 'fur'); l(19, 25, 5, 25, 'fur'); l(5, 25, 5, 5, 'fur'); l(5, 10, 19, 10, 'fur');
      s.items = L;
    },
    draw: function (s) {
      var k = s.k, ox = s.ox, oy = s.oy + Math.sin(flow * 0.003) * 6 - (sy * 0.04) % 40;
      function X(v) { return ox + v * k; }
      function Y(v) { return oy + v * k; }
      /* grid axes (always visible) */
      dash([14, 5, 3, 5]); stroke(BLUE, 0.13, 1);
      var ax = [[0, 'A'], [40, 'B'], [72, 'C'], [100, 'D']], ay = [[0, '1'], [42, '2'], [70, '3']];
      ax.forEach(function (a) { line(X(a[0]), Y(-10), X(a[0]), Y(84)); });
      ay.forEach(function (a) { line(X(-10), Y(a[0]), X(110), Y(a[0])); });
      dash();
      ax.forEach(function (a) { stroke(BLUE, 0.3, 1); circle(X(a[0]), Y(-15), 9); label(a[1], X(a[0]), Y(-15) + 1, 12, BLUE, 0.5); });
      ay.forEach(function (a) { stroke(BLUE, 0.3, 1); circle(X(-15), Y(a[0]), 9); label(a[1], X(-15), Y(a[0]) + 1, 12, BLUE, 0.5); });
      /* dimension chain */
      dim(X(0), Y(84), X(40), '4.00', 0.9); dim(X(40), Y(84), X(72), '3.20', 0.9); dim(X(72), Y(84), X(100), '2.80', 0.9);
      dim(X(0), Y(94), X(100), '10.00', 0.9);
      /* north arrow */
      var nx = X(112), ny = Y(-6);
      stroke(BLUE, 0.3, 1); circle(nx, ny, 12);
      fill(col, 0.45); ctx.beginPath(); ctx.moveTo(nx, ny - 12); ctx.lineTo(nx + 5, ny + 6); ctx.lineTo(nx, ny + 2); ctx.lineTo(nx - 5, ny + 6); ctx.closePath(); ctx.fill();
      label('N', nx, ny - 22, 12, col, 0.6);

      /* walls drawn progressively */
      var cyc = wrap(flow / 900, 1.45), prog = Math.min(1, cyc), fade = cyc > 1.3 ? 1 - (cyc - 1.3) / 0.15 : 1;
      var N = s.items.length, r = prog * N;
      ctx.lineCap = 'round';
      for (var i = 0; i < N; i++) {
        var f = clamp(r - i, 0, 1);
        if (f <= 0) break;
        var it = s.items[i], p = it.p;
        if (it.t === 'l') {
          if (it.kind === 'wall') stroke(col, 0.5 * fade, 2.4);
          else if (it.kind === 'win') stroke(BLUE, 0.45 * fade, 1);
          else stroke(BLUE, 0.28 * fade, 1);
          line(X(p[0]), Y(p[1]), X(lerp(p[0], p[2], f)), Y(lerp(p[1], p[3], f)));
        } else if (it.t === 'a') {
          stroke(col, 0.32 * fade, 1);
          dash([4, 4]); ctx.beginPath(); ctx.arc(X(p[0]), Y(p[1]), p[2] * k, p[3], p[3] + (p[4] - p[3]) * f); ctx.stroke(); dash();
          stroke(col, 0.45 * fade, 1.6); line(X(p[0]), Y(p[1]), X(lerp(p[0], p[5][0], f)), Y(lerp(p[1], p[5][1], f)));
        } else {
          stroke(BLUE, 0.3 * fade, 1); circle(X(p[0]), Y(p[1]), p[2] * k * f);
        }
        if (f < 1 && it.t === 'l') glowDot(X(lerp(p[0], p[2], f)), Y(lerp(p[1], p[3], f)), 2.4, col, 0.95 * fade);
      }
      ctx.lineCap = 'butt';
      if (prog >= 1) {
        label('LIVING  42 m²', X(70), Y(34), 12, BLUE, 0.4 * fade);
        label('BED  12 m²', X(20), Y(40), 12, BLUE, 0.4 * fade);
      }
    }
  };

  /* MECHANICAL — meshing gear train + crank-slider (piston) */
  scenes.gears = {
    init: function (s) {
      var r1 = S * (small ? 0.24 : 0.26), r2 = r1 * 0.5, r3 = r1 * 0.36;
      var g1 = { x: W * (small ? 0.02 : 0.1), y: H * 0.32, r: r1, n: 28 };
      var g2 = { x: g1.x + Math.cos(0.45) * (r1 + r2) * 0.93, y: g1.y + Math.sin(0.45) * (r1 + r2) * 0.93, r: r2, n: 14 };
      var g3 = { x: g2.x + Math.cos(-0.5) * (r2 + r3) * 0.93, y: g2.y + Math.sin(-0.5) * (r2 + r3) * 0.93, r: r3, n: 10 };
      s.g = [g1, g2, g3];
      s.cr = { x: W * (small ? 0.78 : 0.86), y: H * (small ? 0.78 : 0.64), r: S * 0.065, L: S * 0.22 };
    },
    draw: function (s) {
      var rot = flow * 0.004, g = s.g;
      gear(g[0].x, g[0].y, g[0].r, g[0].n, rot, 1.15);
      gear(g[1].x, g[1].y, g[1].r, g[1].n, -rot * g[0].n / g[1].n + Math.PI / g[1].n, 1.15);
      gear(g[2].x, g[2].y, g[2].r, g[2].n, rot * g[0].n / g[2].n, 1.15);
      var c = s.cr, th = flow * 0.03, r = c.r, L = c.L;
      var pinX = c.x + r * Math.cos(th), pinY = c.y + r * Math.sin(th);
      var px = pinX - Math.sqrt(L * L - Math.pow(r * Math.sin(th), 2));
      var ph = r * 1.5, pw = r * 1.2, cylL = c.x - L - r - pw * 1.3, cylR = c.x - L + r + 6;
      stroke(BLUE, 0.28, 1.4);
      line(cylL, c.y - ph / 2 - 4, cylR, c.y - ph / 2 - 4); line(cylL, c.y + ph / 2 + 4, cylR, c.y + ph / 2 + 4); line(cylL, c.y - ph / 2 - 4, cylL, c.y + ph / 2 + 4);
      fill(col, 0.06); ctx.fillRect(cylL + 2, c.y - ph / 2, px - pw / 2 - cylL - 2, ph);
      stroke(col, 0.55, 1.4); fill(col, 0.12);
      ctx.beginPath(); ctx.rect(px - pw / 2, c.y - ph / 2, pw, ph); ctx.fill(); ctx.stroke();
      line(px - pw / 2 + 4, c.y - ph / 2, px - pw / 2 + 4, c.y + ph / 2);
      stroke(col, 0.6, 2.2); line(px, c.y, pinX, pinY);
      stroke(BLUE, 0.3, 1.2); circle(c.x, c.y, r * 1.45);
      fill(col, 0.1); ctx.beginPath(); ctx.arc(c.x, c.y, r * 1.35, th + Math.PI - 0.8, th + Math.PI + 0.8); ctx.lineTo(c.x, c.y); ctx.closePath(); ctx.fill();
      stroke(col, 0.5, 1.6); line(c.x, c.y, pinX, pinY);
      glowDot(pinX, pinY, 3, col, 0.95); glowDot(px, c.y, 2.6, col, 0.9);
      fill(BLUE, 0.5); circle(c.x, c.y, 3, true);
      dash([10, 4, 2, 4]); stroke(BLUE, 0.15, 1); line(cylL - 20, c.y, c.x + r * 2.2, c.y); dash();
      dim(cylL, c.y + ph / 2 + 30, cylR, 'STROKE ' + Math.round(2 * r) + ' mm');
      label('n = ' + (1450 + Math.round(Math.abs(vel) * 20)) + ' rpm', c.x, c.y - r * 1.45 - 18, 12, col, 0.55);
    }
  };

  /* ELECTRICAL — three-phase waves + transmission pylons with flowing current */
  scenes.waves = {
    init: function (s) {
      var xs = small ? [W * 0.12, W * 0.88] : [W * 0.1, W * 0.5, W * 0.9];
      s.h = S * (small ? 0.36 : 0.42); s.base = H + 6;
      s.towers = xs.map(function (x) { return { x: x }; });
    },
    draw: function (s) {
      var y0 = H * (small ? 0.36 : 0.4), A = S * 0.075, k = TAU / Math.max(380, W * 0.5), ph = flow * 0.03 + sy * 0.004;
      var cs = [col, WHITE, BLUE];
      for (var p = 0; p < 3; p++) {
        stroke(cs[p], p === 0 ? 0.42 : 0.24, p === 0 ? 1.8 : 1.3);
        ctx.beginPath();
        for (var x = -6; x <= W + 6; x += 6) {
          var y = y0 + A * Math.sin(x * k - ph + p * TAU / 3);
          if (x < 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      dash([6, 6]); stroke(BLUE, 0.12, 1); line(0, y0, W, y0); line(0, y0 - A * 0.707, W, y0 - A * 0.707); line(0, y0 + A * 0.707, W, y0 + A * 0.707); dash();
      label('V RMS', 40, y0 - A * 0.707 - 10, 11, BLUE, 0.4, 'start');
      for (var d = 0; d < 6; d++) {
        var xd = wrap(d * W / 6 + flow * 1.6, W);
        glowDot(xd, y0 + A * Math.sin(xd * k - ph), 2.4, col, 0.8);
      }
      /* pylons */
      var h = s.h, b = s.base, tips = [];
      s.towers.forEach(function (tw) {
        var x = tw.x, bw = h * 0.3, top = b - h;
        lattice(x - bw / 2, x + bw / 2, b, x - 5, x + 5, top, 9, BLUE, 0.18);
        var arms = [[top + h * 0.2, h * 0.36], [top + h * 0.38, h * 0.28]];
        stroke(BLUE, 0.22, 1.2);
        arms.forEach(function (a) {
          line(x - a[1], a[0], x + a[1], a[0]); line(x - a[1], a[0], x - 6, a[0] - 12); line(x + a[1], a[0], x + 6, a[0] - 12);
          line(x - a[1] + 4, a[0], x - a[1] + 4, a[0] + 12); line(x + a[1] - 4, a[0], x + a[1] - 4, a[0] + 12);
        });
        line(x, top, x, top - 16);
        tips.push([[x - arms[0][1] + 4, arms[0][0] + 12], [x + arms[0][1] - 4, arms[0][0] + 12], [x - arms[1][1] + 4, arms[1][0] + 12], [x + arms[1][1] - 4, arms[1][0] + 12]]);
      });
      for (var i = 0; i < tips.length - 1; i++) {
        for (var w = 0; w < 4; w++) {
          var a = tips[i][w], c = tips[i + 1][w], sag = 46;
          var cx = (a[0] + c[0]) / 2, cy = (a[1] + c[1]) / 2 + sag * 2;
          stroke(BLUE, 0.2, 1);
          ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo(cx, cy, c[0], c[1]); ctx.stroke();
          var u = wrap(flow * 0.004 + w * 0.27 + i * 0.13, 1), v = 1 - u;
          glowDot(v * v * a[0] + 2 * v * u * cx + u * u * c[0], v * v * a[1] + 2 * v * u * cy + u * u * c[1], 2.2, col, 0.85);
        }
      }
      label('132 kV · 50 Hz', W / 2, y0 - A - 22, 12, col, 0.5);
    }
  };

  /* COMPUTER — PCB traces with travelling signals + chips */
  scenes.circuit = {
    init: function (s) {
      var g = small ? 26 : 32, cols = Math.ceil(W / g), rows = Math.ceil(H / g);
      var DIRS = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
      var count = Math.round(clamp(W * H / 16000, 26, 80));
      s.tr = [];
      for (var i = 0; i < count; i++) {
        var x = Math.floor(Math.random() * cols) * g, y = Math.floor(Math.random() * rows) * g;
        var d = Math.floor(Math.random() * 4) * 2, P = [[x, y]], segs = 3 + Math.floor(Math.random() * 5);
        for (var j = 0; j < segs; j++) {
          var len = d % 2 ? 1 : 1 + Math.floor(Math.random() * 4);
          x += DIRS[d][0] * len * g; y += DIRS[d][1] * len * g; P.push([x, y]);
          d = (d + (Math.random() < 0.5 ? 1 : 7)) % 8;
        }
        var acc = [0];
        for (j = 1; j < P.length; j++) acc.push(acc[j - 1] + Math.hypot(P[j][0] - P[j - 1][0], P[j][1] - P[j - 1][1]));
        s.tr.push({ P: P, acc: acc, len: acc[acc.length - 1], u: rnd(-300, acc[acc.length - 1]), v: rnd(1.2, 2.6) });
      }
      s.chips = [];
      var nc = small ? 1 : 3;
      for (i = 0; i < nc; i++) s.chips.push({ x: rnd(W * 0.1, W * 0.8), y: rnd(H * 0.1, H * 0.8), w: S * rnd(0.1, 0.16), l: ['CPU', 'GPU', 'SoC'][i] });
    },
    at: function (tr, dd) {
      var A = tr.acc, P = tr.P;
      for (var i = 1; i < A.length; i++) {
        if (dd <= A[i]) { var f = (dd - A[i - 1]) / (A[i] - A[i - 1] || 1); return [lerp(P[i - 1][0], P[i][0], f), lerp(P[i - 1][1], P[i][1], f), i]; }
      }
      return [P[P.length - 1][0], P[P.length - 1][1], P.length - 1];
    },
    draw: function (s) {
      var self = this, sp = 1 + Math.min(Math.abs(vel), 60) * 0.08;
      var oy = -wrap(sy * 0.1, H);
      s.tr.forEach(function (tr) {
        tr.u += tr.v * sp;
        if (tr.u > tr.len + 60) tr.u = -rnd(40, 400);
      });
      for (var pass = 0; pass < 2; pass++) {
        var off = oy + pass * H;
        ctx.save(); ctx.translate(0, off);
        stroke(BLUE, 0.15, 1.3);
        ctx.beginPath();
        s.tr.forEach(function (tr) {
          tr.P.forEach(function (p, i) { if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); });
        });
        ctx.stroke();
        stroke(col, 0.3, 1);
        s.tr.forEach(function (tr) { var e = tr.P[tr.P.length - 1]; circle(e[0], e[1], 3.2); fill(BLUE, 0.3); circle(tr.P[0][0], tr.P[0][1], 2.2, true); });
        s.chips.forEach(function (c) {
          stroke(BLUE, 0.3, 1.2); fill([10, 20, 40], 0.5);
          ctx.beginPath(); ctx.rect(c.x, c.y, c.w, c.w); ctx.fill(); ctx.stroke();
          stroke(col, 0.25, 1); ctx.strokeRect(c.x + c.w * 0.2, c.y + c.w * 0.2, c.w * 0.6, c.w * 0.6);
          stroke(BLUE, 0.28, 1.4);
          for (var q = 1; q < 9; q++) {
            var o = c.w * q / 9;
            line(c.x + o, c.y, c.x + o, c.y - 8); line(c.x + o, c.y + c.w, c.x + o, c.y + c.w + 8);
            line(c.x, c.y + o, c.x - 8, c.y + o); line(c.x + c.w, c.y + o, c.x + c.w + 8, c.y + o);
          }
          label(c.l, c.x + c.w / 2, c.y + c.w / 2, 14, col, 0.55);
        });
        s.tr.forEach(function (tr) {
          if (tr.u < 0) return;
          var h = self.at(tr, Math.min(tr.u, tr.len)), tail = self.at(tr, Math.max(0, tr.u - 70));
          stroke(col, 0.55, 2);
          ctx.beginPath(); ctx.moveTo(tail[0], tail[1]);
          for (var i = tail[2]; i < h[2]; i++) ctx.lineTo(tr.P[i][0], tr.P[i][1]);
          ctx.lineTo(h[0], h[1]); ctx.stroke();
          if (tr.u <= tr.len) glowDot(h[0], h[1], 2.6, col, 1);
        });
        ctx.restore();
      }
    }
  };

  /* SOFTWARE — code editor minimaps scrolling + floating syntax glyphs */
  scenes.code = {
    init: function (s) {
      s.panels = small ? [{ x: W * 0.08, y: H * 0.56, w: W * 0.84, h: H * 0.34 }] :
        [{ x: W * 0.05, y: H * 0.14, w: W * 0.25, h: H * 0.48 }, { x: W * 0.7, y: H * 0.46, w: W * 0.25, h: H * 0.44 }];
      s.panels.forEach(function (p) {
        p.lines = [];
        var ind = 0;
        for (var i = 0; i < 70; i++) {
          if (Math.random() < 0.18 && ind < 4) ind++; else if (Math.random() < 0.2 && ind > 0) ind--;
          var tk = [], n = 1 + Math.floor(Math.random() * 4);
          for (var j = 0; j < n; j++) tk.push([rnd(8, 46), Math.floor(Math.random() * 5)]);
          p.lines.push({ ind: ind, tk: Math.random() < 0.1 ? [] : tk });
        }
      });
      var G = ['{ }', '</>', '=>', '( )', '[ ]', '&&', 'fn', 'if', '0', '1', '::', '/* */', '#', 'λ', '==', 'git', '++', '?:'];
      s.gl = [];
      for (var i = 0; i < (small ? 12 : 22); i++) s.gl.push({ t: G[i % G.length], x: rnd(0, W), y: rnd(0, H), z: rnd(0.3, 1), sz: rnd(14, 44) });
    },
    draw: function (s) {
      var PAL = [col, BLUE, WHITE, [244, 114, 182], [74, 222, 128]], lh = 13;
      s.gl.forEach(function (g) {
        var y = wrap(g.y - flow * 0.35 * g.z - sy * 0.25 * g.z, H + 80) - 40;
        label(g.t, g.x, y, g.sz, g.z > 0.7 ? col : BLUE, 0.06 + g.z * 0.1);
      });
      s.panels.forEach(function (p, pi) {
        ctx.save();
        stroke(BLUE, 0.22, 1); fill([6, 14, 28], 0.55);
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(p.x, p.y, p.w, p.h, 14); else ctx.rect(p.x, p.y, p.w, p.h);
        ctx.fill(); ctx.stroke();
        [[255, 95, 87], [254, 188, 46], [40, 200, 64]].forEach(function (c, i) { fill(c, 0.5); circle(p.x + 16 + i * 14, p.y + 14, 4, true); });
        label(pi ? 'server.py' : 'app.js', p.x + p.w - 14, p.y + 14, 11, BLUE, 0.4, 'end');
        stroke(BLUE, 0.12, 1); line(p.x, p.y + 28, p.x + p.w, p.y + 28);
        ctx.beginPath(); ctx.rect(p.x, p.y + 30, p.w, p.h - 32); ctx.clip();
        var total = p.lines.length * lh, off = wrap(flow * 0.28 * (pi ? 0.8 : 1) + sy * 0.2, total);
        for (var r = 0; r < 2; r++) {
          p.lines.forEach(function (ln, i) {
            var y = p.y + 40 + i * lh - off + r * total;
            if (y < p.y + 28 || y > p.y + p.h) return;
            fill(BLUE, 0.18); ctx.fillRect(p.x + 10, y - 2, 10, 4);
            var x = p.x + 30 + ln.ind * 12;
            ln.tk.forEach(function (tk) {
              if (x + tk[0] > p.x + p.w - 10) return;
              fill(PAL[tk[1]], 0.32); ctx.fillRect(x, y - 2.5, tk[0], 5); x += tk[0] + 6;
            });
          });
        }
        if (Math.floor(t / 30) % 2 === 0) { fill(col, 0.85); ctx.fillRect(p.x + p.w * 0.5, p.y + p.h * 0.55, 2, 12); }
        ctx.restore();
      });
    }
  };

  /* COMMUNICATION — antenna masts emitting waves + orbiting satellite + AM carrier */
  scenes.radio = {
    init: function (s) {
      var h = S * (small ? 0.3 : 0.36);
      s.tw = (small ? [W * 0.5] : [W * 0.14, W * 0.86]).map(function (x) { return { x: x, b: H + 4, top: H + 4 - h }; });
      s.rings = []; s.acc = 0;
      s.orb = { cx: W * 0.5, cy: H * 0.2, rx: W * 0.42, ry: H * 0.1 };
    },
    draw: function (s) {
      var o = s.orb;
      dash([4, 8]); stroke(BLUE, 0.16, 1); ctx.beginPath(); ctx.ellipse(o.cx, o.cy, o.rx, o.ry, -0.08, 0, TAU); ctx.stroke(); dash();
      var a = flow * 0.0032, sx = o.cx + o.rx * Math.cos(a), sY = o.cy + o.ry * Math.sin(a);
      /* AM carrier */
      var y0 = H * 0.52, A = S * 0.06;
      stroke(col, 0.22, 1.2); ctx.beginPath();
      for (var x = 0; x <= W; x += 3) {
        var env = 1 + 0.6 * Math.sin(x * 0.006 - flow * 0.02);
        var y = y0 + A * env * 0.5 * Math.sin(x * 0.11 - flow * 0.2);
        if (x) ctx.lineTo(x, y); else ctx.moveTo(x, y);
      }
      ctx.stroke();
      stroke(BLUE, 0.14, 1); ctx.beginPath();
      for (x = 0; x <= W; x += 6) { var ev = A * 0.5 * (1 + 0.6 * Math.sin(x * 0.006 - flow * 0.02)); if (x) ctx.lineTo(x, y0 - ev); else ctx.moveTo(x, y0 - ev); }
      ctx.stroke();
      /* rings */
      s.acc += (1 + Math.min(Math.abs(vel), 40) * 0.05) * k;
      if (s.acc > 70) { s.acc = 0; s.tw.forEach(function (tw) { s.rings.push({ x: tw.x, y: tw.top, r: 6 }); }); }
      var rmax = S * 0.7;
      s.rings = s.rings.filter(function (r) { r.r += 1.5 + Math.min(Math.abs(vel), 40) * 0.04; return r.r < rmax; });
      s.rings.forEach(function (r) {
        stroke(col, 0.45 * (1 - r.r / rmax), 1.4);
        ctx.beginPath(); ctx.arc(r.x, r.y, r.r, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
      });
      s.tw.forEach(function (tw) {
        lattice(tw.x - 22, tw.x + 22, tw.b, tw.x - 3, tw.x + 3, tw.top, 10, BLUE, 0.2);
        stroke(BLUE, 0.28, 1.4);
        [0.25, 0.45].forEach(function (k) {
          var yy = lerp(tw.top, tw.b, k);
          ctx.beginPath(); ctx.ellipse(tw.x - 14, yy, 5, 10, 0, 0, TAU); ctx.stroke();
          ctx.beginPath(); ctx.ellipse(tw.x + 14, yy + 18, 5, 10, 0, 0, TAU); ctx.stroke();
        });
        if (Math.floor(t / 40) % 2 === 0) glowDot(tw.x, tw.top - 4, 3, [255, 70, 70], 0.9);
        if (sY < o.cy + o.ry * 0.3) {
          dash([3, 7]); stroke(col, 0.22 + 0.15 * Math.sin(flow * 0.05), 1); line(sx, sY, tw.x, tw.top); dash();
        }
      });
      /* satellite */
      ctx.save(); ctx.translate(sx, sY); ctx.rotate(-0.08);
      stroke(BLUE, 0.5, 1); fill(BLUE, 0.15);
      ctx.beginPath(); ctx.rect(-28, -5, 18, 10); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.rect(10, -5, 18, 10); ctx.fill(); ctx.stroke();
      line(-10, 0, 10, 0);
      fill(col, 0.75); ctx.fillRect(-6, -6, 12, 12);
      ctx.restore();
      glowDot(sx, sY, 2, col, 0.9);
      label('5G · 3.5 GHz', s.tw[0].x, s.tw[0].top - 26, 12, col, 0.55);
    }
  };

  /* CHEMICAL — floating aromatic rings & molecules + rising bubbles */
  scenes.molecules = {
    init: function (s) {
      var types = ['benz', 'naph', 'h2o', 'co2', 'ch4', 'chain'];
      s.items = [];
      for (var i = 0; i < (small ? 8 : 15); i++) {
        s.items.push({ k: types[i % types.length], x: rnd(0, W), y: rnd(0, H + 200), sz: rnd(22, 46), r0: rnd(0, TAU), vr: rnd(-0.004, 0.004), v: rnd(0.15, 0.4), z: rnd(0.4, 1) });
      }
      s.bub = [];
      for (i = 0; i < (small ? 18 : 34); i++) s.bub.push({ x: rnd(0, W), y: rnd(0, H), r: rnd(1.5, 5), v: rnd(0.3, 1), ph: rnd(0, TAU) });
    },
    hex: function (cx, cy, sz, rot, a, inner) {
      ctx.beginPath();
      for (var i = 0; i <= 6; i++) { var b = rot + i * TAU / 6; var x = cx + sz * Math.cos(b), y = cy + sz * Math.sin(b); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
      stroke(col, 0.35 * a, 1.4); ctx.stroke();
      if (inner) { stroke(BLUE, 0.25 * a, 1); circle(cx, cy, sz * 0.58); }
      fill(col, 0.5 * a);
      for (i = 0; i < 6; i++) { var bb = rot + i * TAU / 6; circle(cx + sz * Math.cos(bb), cy + sz * Math.sin(bb), 2.2, true); }
    },
    atoms: function (list, bonds, rot, cx, cy, a) {
      var P = list.map(function (p) { var c = Math.cos(rot), sn = Math.sin(rot); return [cx + p[0] * c - p[1] * sn, cy + p[0] * sn + p[1] * c, p[2], p[3]]; });
      bonds.forEach(function (b) {
        var p = P[b[0]], q = P[b[1]];
        stroke(BLUE, 0.3 * a, 1.4);
        if (b[2] === 2) {
          var dx = q[1] - p[1], dy = p[0] - q[0], l = Math.hypot(dx, dy) || 1; dx = dx / l * 2.5; dy = dy / l * 2.5;
          line(p[0] + dx, p[1] + dy, q[0] + dx, q[1] + dy); line(p[0] - dx, p[1] - dy, q[0] - dx, q[1] - dy);
        } else line(p[0], p[1], q[0], q[1]);
      });
      P.forEach(function (p) {
        fill(p[3] ? col : BLUE, (p[3] ? 0.22 : 0.16) * a); circle(p[0], p[1], p[2], true);
        stroke(p[3] ? col : BLUE, 0.5 * a, 1); circle(p[0], p[1], p[2]);
      });
    },
    draw: function (s) {
      var self = this;
      s.bub.forEach(function (b) {
        var y = wrap(b.y - flow * b.v - sy * 0.2, H + 40) - 20, x = b.x + Math.sin(flow * 0.02 + b.ph) * 6;
        stroke(b.r > 3.5 ? col : BLUE, 0.28, 1); circle(x, y, b.r);
      });
      s.items.forEach(function (it) {
        var y = wrap(it.y - flow * it.v * 0.6 - sy * 0.12 * it.z, H + 200) - 100, x = it.x, r = it.r0 + flow * it.vr, z = it.sz, a = it.z;
        if (it.k === 'benz') { self.hex(x, y, z, r, a, true); label('C₆H₆', x, y + z + 16, 12, BLUE, 0.3 * a); }
        else if (it.k === 'naph') { self.hex(x, y, z * 0.8, r, a, true); self.hex(x + z * 0.8 * Math.sqrt(3) * Math.cos(r + Math.PI / 6), y + z * 0.8 * Math.sqrt(3) * Math.sin(r + Math.PI / 6), z * 0.8, r, a, true); }
        else if (it.k === 'h2o') { var an = 52 * Math.PI / 180; self.atoms([[0, 0, 9, 1], [Math.sin(an) * z, Math.cos(an) * z, 5, 0], [-Math.sin(an) * z, Math.cos(an) * z, 5, 0]], [[0, 1], [0, 2]], r, x, y, a); label('H₂O', x, y - 18, 12, BLUE, 0.3 * a); }
        else if (it.k === 'co2') { self.atoms([[-z, 0, 7, 1], [0, 0, 6, 0], [z, 0, 7, 1]], [[0, 1, 2], [1, 2, 2]], r, x, y, a); label('CO₂', x, y + 22, 12, BLUE, 0.3 * a); }
        else if (it.k === 'ch4') { self.atoms([[0, 0, 8, 1], [z, 0, 4.5, 0], [-z, 0, 4.5, 0], [0, z, 4.5, 0], [0, -z, 4.5, 0]], [[0, 1], [0, 2], [0, 3], [0, 4]], r, x, y, a); }
        else {
          var L = [], B = [];
          for (var i = 0; i < 6; i++) { L.push([i * z * 0.87 - z * 2.2, (i % 2 ? 0.5 : 0) * z, 5, 1]); if (i) B.push([i - 1, i]); }
          self.atoms(L, B, r, x, y, a);
        }
      });
    }
  };

  /* PETROLEUM — rock strata, reservoir, pump jacks and a derrick */
  scenes.oil = {
    init: function (s) {
      s.surf = H * (small ? 0.6 : 0.56);
      s.L = [];
      for (var i = 0; i < 5; i++) s.L.push({ base: s.surf + (H - s.surf) * (0.14 + i * 0.19), amp: 8 + i * 5, f: rnd(0.004, 0.008), ph: rnd(0, TAU) });
      s.jacks = small ? [W * 0.36] : [W * 0.22, W * 0.6];
      s.der = small ? W * 0.84 : W * 0.88;
      s.u = S * (small ? 0.1 : 0.085);
    },
    ly: function (l, x, i) { return l.base + l.amp * Math.sin(x * l.f + l.ph + sy * 0.0012 * (i + 1)) + l.amp * 0.4 * Math.sin(x * l.f * 2.3 + l.ph * 1.7 + flow * 0.002); },
    draw: function (s) {
      var self = this, i, x;
      /* reservoir band (between layer 2 and 3) */
      var l2 = s.L[2], l3 = s.L[3];
      fill(col, 0.06); ctx.beginPath();
      for (x = 0; x <= W; x += 12) ctx.lineTo(x, self.ly(l2, x, 2));
      for (x = W; x >= 0; x -= 12) ctx.lineTo(x, self.ly(l3, x, 3));
      ctx.closePath(); ctx.fill();
      fill(col, 0.25);
      for (x = 8; x < W; x += 22) for (var yy = 0; yy < 3; yy++) {
        var ya = self.ly(l2, x, 2), yb = self.ly(l3, x, 3), y = lerp(ya, yb, 0.25 + yy * 0.25) + Math.sin(x + yy) * 2;
        circle(x + (yy % 2) * 11, y, 1.2, true);
      }
      s.L.forEach(function (l, k) {
        stroke(k === 2 || k === 3 ? col : BLUE, k === 2 || k === 3 ? 0.3 : 0.15, 1.2);
        ctx.beginPath(); for (var xx = 0; xx <= W; xx += 10) { var y = self.ly(l, xx, k); if (xx) ctx.lineTo(xx, y); else ctx.moveTo(xx, y); } ctx.stroke();
      });
      label('RESERVOIR · φ 22%  k 150 mD', W * 0.5, (self.ly(l2, W * 0.5, 2) + self.ly(l3, W * 0.5, 3)) / 2, 12, col, 0.5);
      stroke(BLUE, 0.25, 1.4); line(0, s.surf, W, s.surf);
      /* pump jacks */
      var u = s.u;
      s.jacks.forEach(function (jx, k) {
        var P = [jx, s.surf - 1.5 * u], th = Math.sin(flow * 0.025 + k) * 0.28;
        var hx = P[0] - 1.4 * u, rodTop = P[1] - 1.4 * u * Math.sin(th);
        var T = [P[0] + 1.2 * u * Math.cos(th), P[1] + 1.2 * u * Math.sin(th)];
        var K = [jx + 1.2 * u, s.surf - 0.55 * u], ph = flow * 0.025 + k + Math.PI / 2;
        var pin = [K[0] + 0.35 * u * Math.cos(ph), K[1] + 0.35 * u * Math.sin(ph)];
        stroke(BLUE, 0.3, 1.4); line(jx - 1.6 * u, s.surf, jx + 1.6 * u, s.surf);
        line(jx - 0.4 * u, s.surf, P[0], P[1]); line(jx + 0.4 * u, s.surf, P[0], P[1]);
        stroke(col, 0.55, 3); line(P[0] - 1.3 * u * Math.cos(th), P[1] - 1.3 * u * Math.sin(th), T[0], T[1]);
        ctx.beginPath(); ctx.arc(P[0], P[1], 1.4 * u, Math.PI + th - 0.22, Math.PI + th + 0.22); ctx.stroke();
        stroke(col, 0.45, 1.3); line(T[0], T[1], pin[0], pin[1]);
        stroke(BLUE, 0.3, 1.2); line(K[0], K[1] + 0.55 * u, K[0], K[1]);
        fill(col, 0.18); ctx.beginPath(); ctx.arc(K[0], K[1], 0.5 * u, ph + Math.PI - 0.6, ph + Math.PI + 0.6); ctx.lineTo(K[0], K[1]); ctx.closePath(); ctx.fill();
        stroke(WHITE, 0.4, 1); line(hx, rodTop, hx, s.surf - 8);
        fill(BLUE, 0.4); ctx.fillRect(hx - 5, s.surf - 10, 10, 10);
        glowDot(P[0], P[1], 2.5, col, 0.9);
        /* wellbore + rising oil */
        var bottom = (self.ly(l2, hx, 2) + self.ly(l3, hx, 3)) / 2;
        dash([5, 5]); stroke(BLUE, 0.25, 1); line(hx, s.surf, hx, bottom); dash();
        for (var d = 0; d < 5; d++) glowDot(hx, bottom - wrap(flow * 0.9 + d * 40, bottom - s.surf), 1.8, col, 0.8);
      });
      /* derrick with rotating bit */
      var dx = s.der, dh = S * 0.42;
      lattice(dx - 30, dx + 30, s.surf, dx - 6, dx + 6, s.surf - dh, 12, BLUE, 0.22);
      stroke(col, 0.4, 1.2); line(dx, s.surf - dh, dx, s.surf - dh * 0.35);
      fill(col, 0.45); ctx.fillRect(dx - 8, s.surf - dh - 6, 16, 6);
      var bitY = lerp(s.surf, self.ly(s.L[4], dx, 4), 0.85);
      dash([5, 5]); stroke(BLUE, 0.25, 1); line(dx, s.surf, dx, bitY); dash();
      stroke(col, 0.6, 1.2);
      for (var q = 0; q < 3; q++) { var b = flow * 0.08 + q * TAU / 3; line(dx, bitY, dx + Math.cos(b) * 7, bitY + Math.sin(b) * 3); }
      glowDot(dx, bitY, 3, col, 0.9);
      label('TD 3 250 m', small ? dx - 14 : dx + 14, bitY, 12, col, 0.5, small ? 'end' : 'start');
    }
  };

  /* WATER — layered waves, rain, ripples and a flood hydrograph */
  scenes.water = {
    init: function (s) {
      s.rain = [];
      for (var i = 0; i < (small ? 40 : 80); i++) s.rain.push({ x: rnd(0, W), y: rnd(0, H), v: rnd(4, 8), l: rnd(8, 18) });
      s.rip = []; s.acc = 0;
    },
    wy: function (i, x) {
      var base = H * ((small ? 0.7 : 0.66) + i * 0.075), amp = S * (0.026 - i * 0.004), k = TAU / (W * (0.6 - i * 0.1)), sp = 0.02 + i * 0.01;
      return base + amp * Math.sin(x * k + flow * sp + sy * 0.003 * (i + 1)) + amp * 0.4 * Math.sin(x * k * 2.1 - flow * sp * 1.3);
    },
    draw: function (s) {
      var self = this, i, x;
      s.rain.forEach(function (r) {
        r.y += r.v * (1 + Math.min(Math.abs(vel), 40) * 0.03) * k;
        if (r.y > self.wy(0, r.x)) { if (Math.random() < 0.08) s.rip.push({ x: r.x, y: self.wy(0, r.x), r: 2 }); r.y = -20; r.x = rnd(0, W); }
        stroke(BLUE, 0.2, 1); line(r.x, r.y, r.x - 3, r.y + r.l);
      });
      s.rip = s.rip.filter(function (r) { r.r += 0.6; return r.r < 34; });
      s.rip.forEach(function (r) { stroke(col, 0.4 * (1 - r.r / 34), 1); ctx.beginPath(); ctx.ellipse(r.x, r.y, r.r, r.r * 0.3, 0, 0, TAU); ctx.stroke(); });
      for (i = 0; i < 4; i++) {
        ctx.beginPath();
        for (x = 0; x <= W; x += 8) { var y = self.wy(i, x); if (x) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
        stroke(col, 0.32 - i * 0.06, 1.4); ctx.stroke();
        ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
        fill(col, 0.03 + i * 0.012); ctx.fill();
      }
      /* hydrograph */
      if (!small) {
        var gx = W * 0.06, gy = H * 0.16, gw = W * 0.26, gh = H * 0.22;
        stroke(BLUE, 0.3, 1); line(gx, gy, gx, gy + gh); line(gx, gy + gh, gx + gw, gy + gh);
        label('Q (m³/s)', gx, gy - 12, 12, BLUE, 0.45, 'start'); label('t (h)', gx + gw, gy + gh + 14, 12, BLUE, 0.45, 'end');
        var prog = wrap(flow / 600, 1.3);
        stroke(col, 0.6, 1.8); ctx.beginPath();
        for (var k = 0; k <= Math.min(1, prog) * 60; k++) {
          var u = k / 60, q = Math.pow(u * 3, 2) * Math.exp(-u * 6) / 0.3;
          var px = gx + u * gw, py = gy + gh - q * gh * 0.9;
          if (k) ctx.lineTo(px, py); else ctx.moveTo(px, py);
        }
        ctx.stroke();
        dash([4, 5]); stroke(col, 0.25, 1); line(gx, gy + gh * 0.32, gx + gw, gy + gh * 0.32); dash();
        label('Qp', gx + gw - 6, gy + gh * 0.32 - 10, 12, col, 0.5, 'end');
      }
    }
  };

  /* BIOMEDICAL — sweeping ECG trace + rotating DNA double helix */
  function ecg(u) {
    function g(m, w, a) { return a * Math.exp(-Math.pow((u - m) / w, 2)); }
    return g(0.18, 0.035, 0.12) - g(0.36, 0.012, 0.12) + g(0.4, 0.014, 1) - g(0.44, 0.014, 0.25) + g(0.66, 0.06, 0.28);
  }
  scenes.pulse = {
    init: function (s) { s.dna = small ? [W * 0.88] : [W * 0.07, W * 0.93]; },
    draw: function (s) {
      var y0 = H * (small ? 0.62 : 0.52), amp = S * 0.17, per = Math.max(240, W * 0.3), span = W + 160;
      var head = wrap(flow * 2.6 + sy * 0.6, span) - 80;
      stroke(col, 0.06, 1.2); ctx.beginPath();
      for (var x = 0; x <= W; x += 4) { var y = y0 - ecg(wrap(x, per) / per) * amp; if (x) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
      ctx.stroke();
      ctx.lineWidth = 2; ctx.lineJoin = 'round';
      for (var c0 = 0; c0 < W; c0 += 24) {
        var age = wrap(head - c0, span);
        if (age > W * 0.9) continue;
        ctx.strokeStyle = rgba(col, 0.75 * (1 - age / (W * 0.9)));
        ctx.beginPath();
        for (x = c0; x <= Math.min(W, c0 + 24); x += 3) { y = y0 - ecg(wrap(x, per) / per) * amp; if (x === c0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
        ctx.stroke();
      }
      if (head >= 0 && head <= W) glowDot(head, y0 - ecg(wrap(head, per) / per) * amp, 3.4, col, 1);
      label('HR 72 bpm · SpO₂ 98%', W * 0.5, y0 + amp * 0.45, 13, col, 0.45);
      s.dna.forEach(function (cx, k) {
        var R = S * 0.06, step = 16, sA = [], sB = [];
        for (var yy = -40; yy <= H + 40; yy += step) {
          var ph = yy * 0.035 + flow * 0.02 + sy * 0.003 + k * 1.3, sn = Math.sin(ph), z = Math.cos(ph);
          var x1 = cx + R * sn, x2 = cx - R * sn;
          stroke(BLUE, 0.06 + 0.1 * (z + 1) / 2, 1.2); line(x1, yy, x2, yy);
          sA.push([x1, yy, z]); sB.push([x2, yy, -z]);
        }
        [sA, sB].forEach(function (st, si) {
          stroke(si ? BLUE : col, 0.3, 1.4); ctx.beginPath();
          st.forEach(function (p, i) { if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); });
          ctx.stroke();
          st.forEach(function (p) { fill(si ? BLUE : col, 0.25 + 0.35 * (p[2] + 1) / 2); circle(p[0], p[1], 1.6 + (p[2] + 1), true); });
        });
      });
    }
  };

  /* AEROSPACE — stars, planet limb, orbits and a launch trajectory */
  scenes.orbit = {
    init: function (s) {
      s.stars = [];
      for (var i = 0; i < (small ? 70 : 150); i++) s.stars.push({ x: rnd(0, W), y: rnd(0, H), r: rnd(0.4, 1.6), ph: rnd(0, TAU), sp: rnd(0.02, 0.06) });
      var R = S * (small ? 0.55 : 0.5);
      s.pl = { x: W * (small ? 0.7 : 0.82), y: H * 1.08, r: R };
      s.orbits = [{ rx: R * 1.5, ry: R * 0.35, rot: -0.35, sp: 0.004, ph: 0 }, { rx: R * 1.9, ry: R * 0.55, rot: -0.2, sp: -0.0026, ph: 2 }, { rx: R * 2.45, ry: R * 0.8, rot: -0.5, sp: 0.0017, ph: 4 }];
    },
    draw: function (s) {
      s.stars.forEach(function (st) {
        fill(WHITE, 0.15 + 0.45 * (0.5 + 0.5 * Math.sin(flow * st.sp + st.ph)));
        circle(st.x, wrap(st.y - sy * 0.05 * st.r, H), st.r, true);
      });
      var p = s.pl;
      var g = ctx.createRadialGradient(p.x - p.r * 0.3, p.y - p.r * 0.4, p.r * 0.1, p.x, p.y, p.r);
      g.addColorStop(0, rgba(col, 0.16)); g.addColorStop(1, rgba(col, 0.02));
      ctx.fillStyle = g; circle(p.x, p.y, p.r, true);
      stroke(col, 0.06, 18); circle(p.x, p.y, p.r + 6);
      stroke(col, 0.4, 1.5); circle(p.x, p.y, p.r);
      ctx.save(); ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, TAU); ctx.clip();
      stroke(BLUE, 0.1, 1);
      for (var i = 1; i < 5; i++) { ctx.beginPath(); ctx.ellipse(p.x, p.y, p.r, p.r * i * 0.2, 0, 0, TAU); ctx.stroke(); }
      ctx.restore();
      s.orbits.forEach(function (o) {
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(o.rot);
        dash([3, 7]); stroke(BLUE, 0.2, 1); ctx.beginPath(); ctx.ellipse(0, 0, o.rx, o.ry, 0, 0, TAU); ctx.stroke(); dash();
        var a = o.ph + flow * o.sp, sx = o.rx * Math.cos(a), syy = o.ry * Math.sin(a);
        var behind = Math.sin(a) < 0 && Math.hypot(sx, syy) < p.r;
        if (!behind) { glowDot(sx, syy, 3, col, 0.95); stroke(col, 0.5, 1); line(sx - 9, syy, sx + 9, syy); }
        ctx.restore();
      });
      var A = [W * 0.08, H * 0.98], C = [W * 0.18, H * 0.05], B = [W * 0.66, H * 0.06];
      dash([2, 8]); stroke(BLUE, 0.16, 1); ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.quadraticCurveTo(C[0], C[1], B[0], B[1]); ctx.stroke(); dash();
      var u = wrap(flow * 0.0024, 1.35);
      if (u <= 1) {
        stroke(col, 0.5, 2); ctx.beginPath();
        for (var k = Math.max(0, u - 0.18); k <= u; k += 0.01) {
          var v = 1 - k, x = v * v * A[0] + 2 * v * k * C[0] + k * k * B[0], y = v * v * A[1] + 2 * v * k * C[1] + k * k * B[1];
          if (k === Math.max(0, u - 0.18)) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
        var vv = 1 - u;
        glowDot(vv * vv * A[0] + 2 * vv * u * C[0] + u * u * B[0], vv * vv * A[1] + 2 * vv * u * C[1] + u * u * B[1], 3.4, col, 1);
      }
      label('LEO 400 km · v 7.66 km/s', p.x, p.y - p.r - 30, 12, col, 0.5);
    }
  };

  /* INDUSTRIAL — conveyor belt with boxes, Gantt chart and SPC control chart */
  scenes.conveyor = {
    init: function (s) {
      s.y = H * (small ? 0.86 : 0.82);
      s.sizes = [];
      for (var i = 0; i < 20; i++) s.sizes.push(rnd(30, 50));
      s.bars = [[0, 3], [2, 4], [3, 2], [5, 4], [6, 3], [8, 4]];
      s.data = []; for (i = 0; i < 30; i++) s.data.push(rnd(-0.7, 0.7)); s.acc = 0;
    },
    draw: function (s) {
      var y = s.y, off = flow * 1.2 + sy * 0.6, i;
      stroke(BLUE, 0.28, 1.4); line(0, y, W, y); line(0, y + 22, W, y + 22);
      for (i = 0; i * 64 < W + 64; i++) {
        var rx = i * 64 + 20, r = 9, an = off / r;
        stroke(BLUE, 0.3, 1); circle(rx, y + 11, r);
        line(rx, y + 11, rx + Math.cos(an) * r, y + 11 + Math.sin(an) * r);
        if (i % 3 === 0) { stroke(BLUE, 0.16, 1); line(rx - 10, y + 22, rx - 18, H); line(rx + 10, y + 22, rx + 18, H); }
      }
      dash([10, 8]); stroke(col, 0.3, 1); ctx.lineDashOffset = -off; line(0, y + 2, W, y + 2); ctx.lineDashOffset = 0; dash();
      for (i = 0; i < 8; i++) {
        var bw = s.sizes[i], bx = wrap(i * 190 + off, Math.max(W + 200, 8 * 190)) - 100;
        stroke(col, 0.5, 1.2); fill(col, 0.07);
        ctx.beginPath(); ctx.rect(bx, y - bw * 0.8, bw, bw * 0.8); ctx.fill(); ctx.stroke();
        stroke(col, 0.3, 1); line(bx + bw / 2, y - bw * 0.8, bx + bw / 2, y);
        label('A-' + (101 + i), bx + bw / 2, y - bw * 0.8 - 10, 11, BLUE, 0.4);
      }
      var gx = small ? W * 0.08 : W * 0.56, gy = H * 0.12, gw = small ? W * 0.84 : W * 0.38, gh = H * (small ? 0.24 : 0.28);
      var cw = gw / 12, rh = gh / 7, prog = Math.min(1, wrap(flow / 700, 1.3));
      stroke(BLUE, 0.1, 1);
      for (i = 0; i <= 12; i++) line(gx + i * cw, gy, gx + i * cw, gy + gh);
      stroke(BLUE, 0.25, 1); line(gx, gy + rh * 0.6, gx + gw, gy + rh * 0.6);
      for (i = 0; i < 12; i++) label('W' + (i + 1), gx + i * cw + cw / 2, gy + rh * 0.3, 10, BLUE, 0.35);
      s.bars.forEach(function (b, k) {
        var by = gy + rh * (k + 1.1), bx2 = gx + b[0] * cw, bl = b[1] * cw;
        stroke(BLUE, 0.3, 1); ctx.strokeRect(bx2, by, bl, rh * 0.55);
        var f = clamp((prog * 12 - b[0]) / b[1], 0, 1);
        fill(col, 0.35); ctx.fillRect(bx2, by, bl * f, rh * 0.55);
      });
      var today = gx + prog * gw;
      stroke(col, 0.6, 1.4); line(today, gy, today, gy + gh); glowDot(today, gy, 2.6, col, 1);
      if (!small) {
        var cx = W * 0.06, cy = H * 0.24, cww = W * 0.3, chh = H * 0.22, mid = cy + chh / 2;
        s.acc += (1 + Math.min(Math.abs(vel), 40) * 0.05) * k;
        if (s.acc > 34) { s.acc = 0; s.data.shift(); s.data.push(Math.random() < 0.06 ? rnd(1.05, 1.3) * (Math.random() < 0.5 ? -1 : 1) : rnd(-0.75, 0.75)); }
        stroke(BLUE, 0.25, 1); line(cx, cy - 10, cx, cy + chh + 10); line(cx, cy + chh + 10, cx + cww, cy + chh + 10);
        stroke(col, 0.35, 1); line(cx, mid, cx + cww, mid);
        dash([6, 5]); stroke([255, 90, 90], 0.35, 1); line(cx, cy, cx + cww, cy); line(cx, cy + chh, cx + cww, cy + chh); dash();
        label('UCL', cx + cww + 8, cy, 11, [255, 120, 120], 0.5, 'start'); label('CL', cx + cww + 8, mid, 11, col, 0.5, 'start'); label('LCL', cx + cww + 8, cy + chh, 11, [255, 120, 120], 0.5, 'start');
        stroke(BLUE, 0.4, 1.3); ctx.beginPath();
        s.data.forEach(function (d, k) { var px = cx + k * cww / 29, py = mid - d * chh / 2; if (k) ctx.lineTo(px, py); else ctx.moveTo(px, py); });
        ctx.stroke();
        s.data.forEach(function (d, k) {
          var px = cx + k * cww / 29, py = mid - d * chh / 2;
          if (Math.abs(d) > 1) glowDot(px, py, 3.4, [255, 90, 90], 1); else { fill(BLUE, 0.55); circle(px, py, 2, true); }
        });
      }
    }
  };

  /* SURVEYING — topographic contours, triangulation network, GPS ping, live reticle */
  scenes.contour = {
    init: function (s) {
      s.hills = [
        { x: W * 0.2, y: H * 0.34, r: S * 0.05, n: 9, p1: rnd(0, TAU), p2: rnd(0, TAU), e: 1250 },
        { x: W * 0.8, y: H * 0.64, r: S * 0.045, n: 10, p1: rnd(0, TAU), p2: rnd(0, TAU), e: 980 },
        { x: W * 0.56, y: H * 0.06, r: S * 0.04, n: 7, p1: rnd(0, TAU), p2: rnd(0, TAU), e: 1540 }
      ];
      s.pts = [];
      for (var i = 0; i < (small ? 6 : 9); i++) s.pts.push([rnd(W * 0.08, W * 0.92), rnd(H * 0.12, H * 0.88)]);
      s.edges = [];
      s.pts.forEach(function (p, a) {
        var near = s.pts.map(function (q, b) { return [b, Math.hypot(p[0] - q[0], p[1] - q[1])]; }).filter(function (e) { return e[0] !== a; }).sort(function (u, v) { return u[1] - v[1]; }).slice(0, 2);
        near.forEach(function (e) { if (!s.edges.some(function (x) { return (x[0] === a && x[1] === e[0]) || (x[1] === a && x[0] === e[0]); })) s.edges.push([a, e[0]]); });
      });
    },
    draw: function (s) {
      var oy = -wrap(sy * 0.08, H);
      for (var pass = 0; pass < 2; pass++) {
        ctx.save(); ctx.translate(0, oy + pass * H);
        s.hills.forEach(function (h) {
          for (var k = 1; k <= h.n; k++) {
            var idx = k % 4 === 0;
            stroke(idx ? col : BLUE, idx ? 0.26 : 0.13, idx ? 1.4 : 1);
            ctx.beginPath();
            for (var j = 0; j <= 72; j++) {
              var a = j / 72 * TAU;
              var rad = h.r * k * (1 + 0.16 * Math.sin(3 * a + h.p1 + flow * 0.0015) + 0.08 * Math.sin(5 * a + h.p2 - flow * 0.001) + 0.05 * Math.sin(2 * a + k * 0.3));
              var x = h.x + rad * Math.cos(a), y = h.y + rad * Math.sin(a) * 0.8;
              if (j) ctx.lineTo(x, y); else ctx.moveTo(x, y);
            }
            ctx.stroke();
            if (idx) label(String(h.e - k * 10), h.x + h.r * k * 1.05, h.y, 11, col, 0.4);
          }
          fill(col, 0.5); label('▲ ' + h.e, h.x, h.y, 12, col, 0.55);
        });
        ctx.restore();
      }
      dash([5, 6]); stroke(BLUE, 0.18, 1);
      s.edges.forEach(function (e) { var a = s.pts[e[0]], b = s.pts[e[1]]; line(a[0], a[1], b[0], b[1]); });
      dash();
      s.pts.forEach(function (p, i) {
        stroke(col, 0.55, 1.2);
        ctx.beginPath(); ctx.moveTo(p[0], p[1] - 7); ctx.lineTo(p[0] + 6, p[1] + 4); ctx.lineTo(p[0] - 6, p[1] + 4); ctx.closePath(); ctx.stroke();
        label('BM-' + (i < 9 ? '0' : '') + (i + 1), p[0] + 10, p[1] - 10, 11, BLUE, 0.45, 'start');
      });
      var E = s.edges.length ? s.edges[Math.floor(flow / 180) % s.edges.length] : null;
      if (E) {
        var a = s.pts[E[0]], b = s.pts[E[1]], f = (flow % 180) / 180;
        stroke(col, 0.6, 1.4); line(a[0], a[1], lerp(a[0], b[0], f), lerp(a[1], b[1], f));
        glowDot(lerp(a[0], b[0], f), lerp(a[1], b[1], f), 2.6, col, 1);
        if (f > 0.6) label(Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) * 1.7) + '.000 m', (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 12, 12, col, 0.6);
      }
      var g = s.pts[0];
      for (var r = 0; r < 3; r++) { var rr = wrap(flow * 0.6 + r * 40, 120); stroke(col, 0.4 * (1 - rr / 120), 1); circle(g[0], g[1], rr); }
      if (mouse.x > -100) {
        var mx = mouse.x, my = mouse.y;
        stroke(col, 0.5, 1); circle(mx, my, 18); line(mx - 30, my, mx - 8, my); line(mx + 8, my, mx + 30, my); line(mx, my - 30, mx, my - 8); line(mx, my + 8, mx, my + 30);
        label('N ' + (36.19 + (H / 2 - my) * 0.0004).toFixed(4) + '°  E ' + (44.01 + (mx - W / 2) * 0.0004).toFixed(4) + '°', mx + 26, my + 28, 12, col, 0.6, 'start');
      }
    }
  };

  /* ═════════════════ common layer + loop ═════════════════ */
  function initPts() {
    var count = Math.round(Math.min(small ? 46 : 100, Math.max(30, W * H / 15000)));
    pts = [];
    for (var i = 0; i < count; i++) pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22, r: Math.random() * 1.5 + 0.6, z: Math.random() * 0.8 + 0.2 });
  }
  function drawNetwork(alpha) {
    var P = [];
    for (var a = 0; a < pts.length; a++) {
      var p = pts[a];
      if (!reduce) {
        p.x += p.vx * k; p.y += p.vy * k;
        if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20; if (p.y > H + 20) p.y = -20;
        var dxm = p.x - mouse.x, dym = p.y - mouse.y;
        if (dxm * dxm + dym * dym < 22000) { p.x += dxm * 0.004; p.y += dym * 0.004; }
      }
      P.push({ x: p.x, y: wrap(p.y - sy * 0.06 * p.z, H + 40) - 20, r: p.r, z: p.z });
    }
    ctx.lineWidth = 0.8;
    for (var b = 0; b < P.length; b++) {
      for (var c = b + 1; c < P.length; c++) {
        var dx = P[b].x - P[c].x, dy = P[b].y - P[c].y, d = dx * dx + dy * dy;
        if (d < 17000) { ctx.strokeStyle = rgba([140, 180, 255], (1 - d / 17000) * 0.16 * alpha); line(P[b].x, P[b].y, P[c].x, P[c].y); }
      }
      var mx = P[b].x - mouse.x, my = P[b].y - mouse.y, md = mx * mx + my * my;
      if (md < 30000) { ctx.strokeStyle = rgba(col, (1 - md / 30000) * 0.4 * alpha); line(P[b].x, P[b].y, mouse.x, mouse.y); }
    }
    for (var e = 0; e < P.length; e++) {
      ctx.fillStyle = e % 4 === 0 ? rgba(col, 0.7 * P[e].z * alpha) : rgba([180, 210, 255], 0.55 * P[e].z * alpha);
      circle(P[e].x, P[e].y, P[e].r, true);
    }
  }

  var state = {};
  function sceneState(name) {
    if (!scenes[name]) name = 'home';
    var s = state[name];
    if (!s || s.W !== W || s.H !== H) { s = state[name] = { W: W, H: H }; scenes[name].init(s); }
    return s;
  }
  function drawScene(name, alpha) {
    if (alpha <= 0.01) return;
    var sc = scenes[name] || scenes.home;
    ctx.save(); ctx.globalAlpha = alpha;
    sc.draw.call(sc, sceneState(name));
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    var gx = W * (0.7 + Math.sin(t * 0.0023) * 0.12), gy = H * (0.3 + Math.cos(t * 0.0019) * 0.12);
    var g = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.max(W, H) * 0.6);
    g.addColorStop(0, rgba(col, 0.13)); g.addColorStop(1, rgba(col, 0));
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    var bx = W * (0.2 + Math.cos(t * 0.0017) * 0.1), by = H * (0.8 + Math.sin(t * 0.0021) * 0.1);
    var g2 = ctx.createRadialGradient(bx, by, 0, bx, by, Math.max(W, H) * 0.55);
    g2.addColorStop(0, 'rgba(40,110,255,0.10)'); g2.addColorStop(1, 'rgba(40,110,255,0)');
    ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);

    var netA = function (n) { return n === 'home' ? 1 : 0.5; };
    drawNetwork(prev && mix < 1 ? lerp(netA(prev), netA(cur), mix) : netA(cur));
    if (prev && mix < 1) drawScene(prev, 1 - mix);
    drawScene(cur, prev ? mix : 1);
  }

  function resize() {
    W = window.innerWidth; H = window.innerHeight; S = Math.min(W, H); small = W < 700;
    DPR = Math.min(small ? 1.5 : 2, window.devicePixelRatio || 1);
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    cv.style.width = W + 'px'; cv.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    initPts();
    if (reduce) draw();
  }

  /* Phones draw at ~40 fps; every step is scaled by elapsed time so speeds stay the same */
  var minGap = 0;
  function loop(now) {
    if (!running) return;
    requestAnimationFrame(loop);
    now = now || performance.now();
    if (!lastT) lastT = now;
    var dt = now - lastT;
    if (dt < minGap) return;
    lastT = now;
    k = Math.max(0.5, Math.min(3, dt / 16.67));
    t += k;
    sy = window.scrollY || window.pageYOffset || 0;
    var dv = sy - lastSy; lastSy = sy;
    vel = vel * Math.pow(0.85, k) + dv * 0.15;
    flow += (1 + Math.min(Math.abs(dv / k), 80) * 0.25) * k;
    var f = 1 - Math.pow(0.95, k);
    for (var i = 0; i < 3; i++) col[i] += (tgt[i] - col[i]) * f;
    if (mix < 1) { mix = Math.min(1, mix + 0.022 * k); if (mix >= 1) prev = null; }
    draw();
  }

  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  document.addEventListener('pointerleave', function () { mouse.x = -9999; mouse.y = -9999; });
  document.addEventListener('visibilitychange', function () {
    if (reduce) return;
    var was = running;
    running = !document.hidden;
    if (running && !was) { lastT = 0; requestAnimationFrame(loop); }
  });
  if (reduce) window.addEventListener('scroll', function () { sy = window.scrollY; draw(); }, { passive: true });

  resize();
  minGap = small ? 24 : 0;
  window.addEventListener('resize', function () { minGap = small ? 24 : 0; });
  if (!reduce) requestAnimationFrame(loop);

  return {
    setColor: function (hex) {
      tgt = hexToRgb(hex);
      if (reduce) { col = tgt.slice(); draw(); }
    },
    setScene: function (name) {
      if (!scenes[name]) name = 'home';
      if (name === cur) return;
      if (reduce) { cur = name; prev = null; mix = 1; draw(); return; }
      prev = mix < 1 && prev ? (mix > 0.5 ? cur : prev) : cur;
      cur = name; mix = 0;
    },
    velocity: function () { return vel; }
  };
})();
