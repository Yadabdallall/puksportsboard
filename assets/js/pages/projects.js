/* The 20 greatest engineering projects — each drawn as a blueprint and as a 3D line model.
   Models are simplified, built from real proportions (metres). Drag to turn; nothing moves on its own.
   Texts: assets/data/<lang>/projects.js */
(function () {
  'use strict';
  var MODS = window.PAGE_MODS = window.PAGE_MODS || {};
  var PI = Math.PI, sin = Math.sin, cos = Math.cos;

  /* ───────── geometry helpers: every model is a list of 3D segments ───────── */
  function G() { this.s = []; }
  G.prototype.seg = function (a, b) { this.s.push(a[0], a[1], a[2], b[0], b[1], b[2]); };
  G.prototype.poly = function (p, closed) {
    for (var i = 0; i < p.length - 1; i++) this.seg(p[i], p[i + 1]);
    if (closed && p.length > 2) this.seg(p[p.length - 1], p[0]);
  };
  G.prototype.rect = function (x0, z0, x1, z1, y) { this.poly([[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]], true); };
  G.prototype.box = function (x0, y0, z0, x1, y1, z1) {
    this.rect(x0, z0, x1, z1, y0); this.rect(x0, z0, x1, z1, y1);
    var g = this;
    [[x0, z0], [x1, z0], [x1, z1], [x0, z1]].forEach(function (c) { g.seg([c[0], y0, c[1]], [c[0], y1, c[1]]); });
  };
  /* closed outline in the x–z plane at height y */
  G.prototype.ring = function (pts, y) { this.poly(pts.map(function (p) { return [p[0], y, p[1]]; }), true); };
  function circ(n, r, cx, cz, rot) { var o = []; for (var i = 0; i < n; i++) { var a = (rot || 0) + i / n * 2 * PI; o.push([cx + r * cos(a), cz + r * sin(a)]); } return o; }
  /* vertical cylinder */
  G.prototype.cyl = function (cx, cz, r, y0, y1, n, rings, verts) {
    var c = circ(n, r, cx, cz);
    for (var k = 0; k <= rings; k++) this.ring(c, y0 + (y1 - y0) * k / Math.max(1, rings));
    for (var i = 0; i < verts; i++) { var a = i / verts * 2 * PI; this.seg([cx + r * cos(a), y0, cz + r * sin(a)], [cx + r * cos(a), y1, cz + r * sin(a)]); }
  };
  /* cone / frustum between two radii */
  G.prototype.frustum = function (cx, cz, r0, r1, y0, y1, n, verts) {
    this.ring(circ(n, r0, cx, cz), y0); if (r1 > 0.05) this.ring(circ(n, r1, cx, cz), y1);
    for (var i = 0; i < verts; i++) { var a = i / verts * 2 * PI; this.seg([cx + r0 * cos(a), y0, cz + r0 * sin(a)], [cx + r1 * cos(a), y1, cz + r1 * sin(a)]); }
  };
  /* cylinder along the x axis (tunnels) */
  G.prototype.tubeX = function (x0, x1, cy, cz, r, n, rings, longs) {
    for (var k = 0; k <= rings; k++) {
      var x = x0 + (x1 - x0) * k / rings, p = [];
      for (var i = 0; i < n; i++) { var a = i / n * 2 * PI; p.push([x, cy + r * sin(a), cz + r * cos(a)]); }
      this.poly(p, true);
    }
    for (var j = 0; j < longs; j++) { var b = j / longs * 2 * PI; this.seg([x0, cy + r * sin(b), cz + r * cos(b)], [x1, cy + r * sin(b), cz + r * cos(b)]); }
  };
  /* polar outline r(θ) sampled n times */
  function polar(n, f, rot) { var o = []; for (var i = 0; i < n; i++) { var a = i / n * 2 * PI; var r = f(a); o.push([r * cos(a + (rot || 0)), r * sin(a + (rot || 0))]); } return o; }
  /* stacked outlines: rings at each level + vertical lines through every k-th point */
  G.prototype.loft = function (levels, every) {
    var g = this;
    levels.forEach(function (L) { g.ring(L.p, L.y); });
    for (var i = 0; i < levels.length - 1; i++) {
      var A = levels[i], B = levels[i + 1];
      for (var j = 0; j < A.p.length; j += every) { var q = B.p[j % B.p.length]; g.seg([A.p[j][0], A.y, A.p[j][1]], [q[0], B.y, q[1]]); }
    }
  };

  /* ───────── the 20 models ───────── */
  var BUILD = {
    pyramid: function (g) {
      var a = 115.2, H = 146.6, n = 16;
      for (var i = 0; i < n; i++) { var y = H * i / n, s = a * (1 - i / n); g.rect(-s, -s, s, s, y); }
      [[-a, -a], [a, -a], [a, a], [-a, a]].forEach(function (c) { g.seg([c[0], 0, c[1]], [0, H, 0]); });
      g.seg([0, 17, -a * 0.88], [0, 60, -a * 0.25]); /* entrance passage towards the Grand Gallery */
    },
    pantheon: function (g) {
      g.cyl(0, 0, 27, 0, 30, 40, 3, 24);
      var R = 25, cy = 21.7;
      for (var k = 1; k <= 6; k++) { var y = 30 + k * 2.4, rr = Math.sqrt(Math.max(0, R * R - (y - cy) * (y - cy))); g.ring(circ(40, rr, 0, 0), y); }
      g.ring(circ(20, 4.4, 0, 0), 45.9);
      for (var m = 0; m < 16; m++) {
        var a = m / 16 * 2 * PI, p = [];
        for (var t = 0; t <= 8; t++) { var yy = 30 + t / 8 * 15.9, r2 = Math.max(4.4, Math.sqrt(Math.max(0, R * R - (yy - cy) * (yy - cy)))); p.push([r2 * cos(a), yy, r2 * sin(a)]); }
        g.poly(p);
      }
      g.box(-17, 0, -42, 17, 30, -26);                       /* intermediate block */
      g.box(-17, 14, -58, 17, 17.5, -42);                   /* entablature */
      g.poly([[-17, 17.5, -58], [0, 24.5, -58], [17, 17.5, -58]]); g.poly([[-17, 17.5, -42], [0, 24.5, -42], [17, 17.5, -42]]);
      g.seg([0, 24.5, -58], [0, 24.5, -42]);
      for (var c = 0; c < 8; c++) g.cyl(-15 + c * 30 / 7, -56, 0.8, 0, 14, 8, 1, 4);
      [-15, -10.7, 10.7, 15].forEach(function (x) { g.cyl(x, -50, 0.8, 0, 14, 8, 1, 4); g.cyl(x, -44.5, 0.8, 0, 14, 8, 1, 4); });
    },
    wall: function (g) {
      var N = 140, top1 = [], top2 = [], b1 = [], b2 = [], H = 14, W = 7;
      function at(t) { return { x: -620 + 1240 * t, z: 150 * sin(t * PI * 2.6) + 50 * sin(t * 11), y: 70 * Math.pow(sin(t * PI * 2.2), 2) + 26 * sin(t * 7.3) + 30 }; }
      for (var i = 0; i <= N; i++) {
        var t = i / N, p = at(t), q = at(Math.min(1, t + 1 / N)), dx = q.x - p.x, dz = q.z - p.z, l = Math.hypot(dx, dz) || 1, nx = -dz / l * W / 2, nz = dx / l * W / 2;
        b1.push([p.x + nx, p.y, p.z + nz]); b2.push([p.x - nx, p.y, p.z - nz]);
        top1.push([p.x + nx, p.y + H, p.z + nz]); top2.push([p.x - nx, p.y + H, p.z - nz]);
        if (i % 4 === 0) { g.seg(b1[i], top1[i]); g.seg(b2[i], top2[i]); }
        if (i % 2 === 0 && i < N) g.seg(top1[i], [p.x + nx, p.y + H + 2.5, p.z + nz]);
        if (i % 20 === 10) g.box(p.x - 9, p.y, p.z - 9, p.x + 9, p.y + H + 12, p.z + 9);
      }
      g.poly(top1); g.poly(top2); g.poly(b1); g.poly(b2);
      for (var r = -2; r <= 2; r++) {
        var h = [];
        for (var j = 0; j <= 60; j++) { var tt = j / 60, pp = at(tt); h.push([pp.x, Math.max(0, pp.y - 18 - Math.abs(r) * 14), pp.z + r * 90]); }
        g.poly(h);
      }
    },
    eiffel: function (g) {
      function w(y) { return 56.5 * Math.exp(-y / 85.6) + 6; }
      var lv = [], y;
      for (y = 0; y <= 115.7; y += 7.2) lv.push(y);
      lv.push(115.7);
      [-1, 1].forEach(function (sx) {
        [-1, 1].forEach(function (sz) {
          var o = [], i1 = [], i2 = [], ic = [];
          lv.forEach(function (yy) {
            var W = w(yy), lw = 26 - 9 * yy / 115.7;
            o.push([sx * W, yy, sz * W]); i1.push([sx * (W - lw), yy, sz * W]); i2.push([sx * W, yy, sz * (W - lw)]); ic.push([sx * (W - lw), yy, sz * (W - lw)]);
          });
          g.poly(o); g.poly(i1); g.poly(i2); g.poly(ic);
          for (var k = 0; k < lv.length - 1; k++) {
            var a = k % 2 ? 0 : 1;
            g.seg(a ? o[k] : i1[k], a ? i1[k + 1] : o[k + 1]); g.seg(a ? o[k] : i2[k], a ? i2[k + 1] : o[k + 1]);
            g.seg(a ? ic[k] : i1[k], a ? i1[k + 1] : ic[k + 1]); g.seg(a ? ic[k] : i2[k], a ? i2[k + 1] : ic[k + 1]);
          }
        });
      });
      /* the decorative arches between the legs */
      [0, 1, 2, 3].forEach(function (f) {
        var p = [];
        for (var t = 0; t <= 20; t++) {
          var a = t / 20 * PI, yy = 39 * sin(a), W = w(yy), half = (w(0) - 26) * cos(a);
          var pt = f === 0 ? [half, yy, -W] : f === 1 ? [half, yy, W] : f === 2 ? [-W, yy, half] : [W, yy, half];
          p.push(pt);
        }
        g.poly(p);
      });
      var up = [];
      for (y = 115.7; y <= 300; y += 9.2) up.push(Math.min(300, y));
      var cs = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
      cs.forEach(function (c) { g.poly(up.map(function (yy) { return [c[0] * w(yy), yy, c[1] * w(yy)]; })); });
      for (var k = 0; k < up.length - 1; k++) {
        for (var f2 = 0; f2 < 4; f2++) {
          var A = cs[f2], B = cs[(f2 + 1) % 4], y0 = up[k], y1 = up[k + 1];
          g.seg([A[0] * w(y0), y0, A[1] * w(y0)], [B[0] * w(y1), y1, B[1] * w(y1)]);
          g.seg([B[0] * w(y0), y0, B[1] * w(y0)], [A[0] * w(y1), y1, A[1] * w(y1)]);
        }
      }
      [[57, 37], [115.7, 21], [276, 9]].forEach(function (pl) { g.rect(-pl[1], -pl[1], pl[1], pl[1], pl[0]); g.rect(-pl[1], -pl[1], pl[1], pl[1], pl[0] + 3); });
      g.rect(-w(300), -w(300), w(300), w(300), 300);
      g.seg([0, 300, 0], [0, 330, 0]);
    },
    panama: function (g0) {
      var g = { seg: function (a, b) { g0.seg([a[0], a[1] * 2.5, a[2]], [b[0], b[1] * 2.5, b[2]]); } };   /* heights × 2.5 so the steps read */
      g.poly = G.prototype.poly; g.rect = G.prototype.rect; g.box = G.prototype.box;
      [-22, 22].forEach(function (zc) {
        for (var k = 0; k < 3; k++) {
          var x0 = -480 + k * 320, x1 = x0 + 305, y0 = k * 8.7, y1 = y0 + 24;
          g.box(x0, y0, zc - 17, x1, y1, zc + 17);
          g.seg([x0, y0 + 16, zc - 17], [x1, y0 + 16, zc - 17]); g.seg([x0, y0 + 16, zc + 17], [x1, y0 + 16, zc + 17]);
          g.poly([[x1, y0, zc - 17], [x1 - 14, y0, zc], [x1, y0, zc + 17]]);
          g.poly([[x1, y0 + 24, zc - 17], [x1 - 14, y0 + 24, zc], [x1, y0 + 24, zc + 17]]);
        }
      });
      g.box(-440, 10, -34, -230, 34, -10); g.box(-300, 34, -30, -255, 50, -14);    /* a ship in the first chamber */
      g.rect(-640, -60, -480, 60, 0); g.rect(480, -60, 700, 60, 26.1);              /* sea approach and Gatun Lake */
      for (var x = 500; x <= 700; x += 40) g.seg([x, 26.1, -60], [x, 26.1, 60]);
    },
    empire: function (g) {
      var T = [[64.5, 28.5, 0, 25], [52, 27, 25, 95], [40, 22, 95, 265], [32, 18, 265, 310], [22, 14, 310, 320]];
      T.forEach(function (t, i) {
        g.box(-t[0], t[2], -t[1], t[0], t[3], t[1]);
        var step = i === 2 ? 4 : 8;
        for (var x = -t[0] + step; x < t[0]; x += step) { g.seg([x, t[2], -t[1]], [x, t[3], -t[1]]); g.seg([x, t[2], t[1]], [x, t[3], t[1]]); }
        for (var z = -t[1] + step; z < t[1]; z += step) { g.seg([-t[0], t[2], z], [-t[0], t[3], z]); g.seg([t[0], t[2], z], [t[0], t[3], z]); }
      });
      g.frustum(0, 0, 8, 5, 320, 373, 16, 8); g.frustum(0, 0, 5, 0.6, 373, 381, 16, 8); g.seg([0, 381, 0], [0, 443, 0]);
    },
    hoover: function (g) {
      var Ru = 152, H = 221, lev = [0, 30, 60, 90, 120, 150, 180, 205, 221];
      function th(y) { return 2.49 * (0.42 + 0.58 * y / H); }
      function t(y) { return 14 + 186 * Math.pow(1 - y / H, 1.6); }
      function pt(r, a, y) { return [r * sin(a), y, Ru - r * cos(a)]; }
      lev.forEach(function (y) {
        var A = th(y) / 2, up = [], dn = [];
        for (var i = 0; i <= 30; i++) { var a = -A + 2 * A * i / 30; up.push(pt(Ru, a, y)); dn.push(pt(Ru + t(y), a, y)); }
        g.poly(up); g.poly(dn); g.seg(up[0], dn[0]); g.seg(up[30], dn[30]);
      });
      for (var m = -6; m <= 6; m++) {
        var p = [], q = [];
        lev.forEach(function (y) { var A = th(y) / 2, a = A * m / 6; p.push(pt(Ru + t(y), a, y)); q.push(pt(Ru, a, y)); });
        g.poly(p); if (m % 3 === 0) g.poly(q);
      }
      [-130, -95, 95, 130].forEach(function (x) { g.cyl(x, -60, 9, 100, 221, 16, 3, 6); });
      var Ac = th(H) / 2;   /* canyon walls above the crest */
      g.poly([pt(Ru, -Ac, H), pt(Ru + 40, -Ac - 0.5, H + 60)]); g.poly([pt(Ru, Ac, H), pt(Ru + 40, Ac + 0.5, H + 60)]);
    },
    golden: function (g) {
      var D = 67, T = 227, half = 640, side = 343, zc = 16;
      [-half, half].forEach(function (x) {
        [-zc, zc].forEach(function (z) { g.box(x - 5, 0, z - 4, x + 5, T, z + 4); });
        [D - 10, 110, 150, 190, T - 5].forEach(function (y) { g.box(x - 4, y - 4, -zc, x + 4, y, zc); });
      });
      [-zc, zc].forEach(function (z) {
        var c = [];
        for (var i = 0; i <= 64; i++) { var x = -half + 2 * half * i / 64, u = x / half; c.push([x, D + 6 + (T - D - 6) * u * u, z]); }
        g.poly(c);
        for (var s = -1; s <= 1; s += 2) {
          var c2 = [];
          for (var j = 0; j <= 16; j++) { var tt = j / 16, xx = s * (half + side * tt); c2.push([xx, T - (T - D + 5) * Math.pow(tt, 1.25), z]); }
          g.poly(c2);
        }
        for (var x2 = -half + 15; x2 < half; x2 += 15) { var u2 = x2 / half; g.seg([x2, D, z], [x2, D + 6 + (T - D - 6) * u2 * u2, z]); }
      });
      [-zc, zc, 0].forEach(function (z) { g.seg([-half - side, D, z], [half + side, D, z]); });
      g.seg([-half - side, D - 8, -zc], [half + side, D - 8, -zc]); g.seg([-half - side, D - 8, zc], [half + side, D - 8, zc]);
      for (var x3 = -half - side; x3 <= half + side; x3 += 30) { g.seg([x3, D - 8, -zc], [x3, D, -zc]); g.seg([x3, D - 8, zc], [x3, D, zc]); }
      g.box(-half - side - 30, 0, -30, -half - side, D + 5, 30); g.box(half + side, 0, -30, half + side + 30, D + 5, 30);
    },
    opera: function (g) {
      g.box(-95, 0, -62, 95, 20, 62);
      function shell(xb, d, h, w, zc, archH) {
        var V = 8, U = 6;
        function P(u, v) {
          var wid = w * Math.pow(1 - u, 0.85), x = xb + d * u, y = 20 + h * sin(u * PI / 2) + archH * (1 - v * v) * (1 - u);
          return [x + (d > 0 ? -1 : 1) * 6 * (1 - v * v) * (1 - u), y, zc + v * wid];
        }
        for (var i = 0; i <= V; i++) { var v = -1 + 2 * i / V, p = []; for (var k = 0; k <= 14; k++) p.push(P(k / 14, v)); g.poly(p); }
        for (var j = 0; j < U; j++) { var u = j / U, q = []; for (var m = 0; m <= 16; m++) q.push(P(u, -1 + 2 * m / 16)); g.poly(q); }
      }
      [[-62, 52, 47, 27, 22], [-14, -42, 40, 25, 18], [22, 30, 30, 19, 13], [52, -22, 21, 14, 9]].forEach(function (s) { shell(s[0], s[1], s[2], s[3], -28, s[4]); });
      [[-58, 46, 40, 23, 19], [-14, -38, 34, 21, 15], [20, 27, 25, 16, 11], [48, -19, 18, 12, 8]].forEach(function (s) { shell(s[0], s[1], s[2], s[3], 30, s[4]); });
      shell(70, 14, 12, 9, 0, 5); shell(84, -11, 9, 7, 0, 4);
      for (var st = 0; st < 8; st++) g.seg([-95 - st * 4, 20 - st * 2.5, -50], [-95 - st * 4, 20 - st * 2.5, 50]);
    },
    saturn: function (g) {
      var r = 5.05, n = 28;
      g.cyl(0, 0, r, 0, 42, n, 6, 12); g.cyl(0, 0, r, 42, 44, n, 1, 0);
      g.cyl(0, 0, r, 44, 69, n, 4, 12);
      g.frustum(0, 0, r, 3.3, 69, 75, n, 12); g.cyl(0, 0, 3.3, 75, 93, n, 3, 10); g.cyl(0, 0, 3.3, 93, 94, n, 1, 0);
      g.frustum(0, 0, 3.3, 1.95, 94, 103, n, 10); g.frustum(0, 0, 1.95, 0.35, 103, 106.5, n, 8);
      g.seg([0, 106.5, 0], [0, 110.6, 0]); g.frustum(0, 0, 0.5, 0.2, 108, 109.5, 8, 4);
      for (var f = 0; f < 4; f++) {
        var a = PI / 4 + f * PI / 2, c = cos(a), s = sin(a);
        g.poly([[r * c, 9.5, r * s], [8.2 * c, 2, 8.2 * s], [8.2 * c, -1, 8.2 * s], [r * c, 0, r * s]]);
      }
      [[0, 0], [3.2, 0], [-3.2, 0], [0, 3.2], [0, -3.2]].forEach(function (e) { g.frustum(e[0], e[1], 0.9, 1.9, 0, -5.8, 16, 6); });
    },
    chunnel: function (g) {
      var L = 90;
      g.tubeX(-L, L, 0, -15, 3.8, 22, 22, 10); g.tubeX(-L, L, 0, 15, 3.8, 22, 22, 10); g.tubeX(-L, L, -0.6, 0, 2.4, 16, 22, 8);
      [-60, -15, 30, 75].forEach(function (x) { g.box(x - 1.6, -2, -11.2, x + 1.6, 1.5, -2.4); g.box(x - 1.6, -2, 2.4, x + 1.6, 1.5, 11.2); });
      [-40, 50].forEach(function (x) { var p = []; for (var i = 0; i <= 16; i++) { var a = i / 16 * PI; p.push([x, 3.8 + 7 * sin(a), -15 * cos(a)]); } g.poly(p); });
      g.box(-70, -3.2, -17.2, 20, 0.6, -12.8);
      for (var xs = -L; xs <= L; xs += 30) { var q = []; for (var j = 0; j <= 16; j++) { var z = -32 + 64 * j / 16; q.push([xs, 15 + 2.2 * sin(z / 9 + xs / 40), z]); } g.poly(q); }
      g.seg([-L, 15, -32], [L, 15, -32]); g.seg([-L, 15, 32], [L, 15, 32]);
    },
    petronas: function (g) {
      function star(R) { return polar(32, function (a) { var k = (a / (PI / 8)) % 2; return R * (k < 1 ? 1 - 0.17 * k : 0.83 + 0.17 * (k - 1)); }, PI / 8); }
      [-52, 52].forEach(function (cx) {
        var tiers = [[0, 270, 23], [270, 330, 20.5], [330, 360, 17.5], [360, 380, 14], [380, 395, 10]];
        tiers.forEach(function (t) {
          var p = star(t[2]).map(function (q) { return [q[0] + cx, q[1]]; }), lv = [];
          for (var y = t[0]; y < t[1]; y += 30) lv.push({ y: y, p: p });
          lv.push({ y: t[1], p: p });
          g.loft(lv, 4);
        });
        g.frustum(cx, 0, 6, 1.2, 395, 430, 12, 6); g.seg([cx, 430, 0], [cx, 451.9, 0]);
      });
      g.box(-29, 170, -3, 29, 176, 3); g.seg([-29, 120, 0], [0, 170, 0]); g.seg([29, 120, 0], [0, 170, 0]);
    },
    iss: function (g) {
      var L = 54, h = 2.5;
      g.box(-L, -h, -h, L, h, h);
      for (var x = -L; x < L; x += 6) { g.seg([x, -h, -h], [x + 6, h, -h]); g.seg([x, -h, h], [x + 6, h, h]); g.seg([x, h, -h], [x + 6, h, h]); g.rect(x, -h, x, h, -h); }
      [-52, -38, 38, 52].forEach(function (xc) {
        [-1, 1].forEach(function (s) {
          var z0 = s * 4, z1 = s * 39;
          g.rect(xc - 5.5, z0, xc + 5.5, z1, 0);
          for (var k = 1; k < 6; k++) { var z = z0 + (z1 - z0) * k / 6; g.seg([xc - 5.5, 0, z], [xc + 5.5, 0, z]); }
          g.seg([xc, 0, z0], [xc, 0, z1]);
        });
      });
      function mod(x0, y0, z0, x1, y1, z1, r) {
        var dx = x1 - x0, dz = z1 - z0, l = Math.hypot(dx, dz), ux = dx / l, uz = dz / l;
        for (var k = 0; k <= 3; k++) {
          var t = k / 3, cx = x0 + dx * t, cz = z0 + dz * t, p = [];
          for (var i = 0; i < 14; i++) { var a = i / 14 * 2 * PI; p.push([cx + uz * r * cos(a), y0 + r * sin(a), cz - ux * r * cos(a)]); }
          g.poly(p, true);
        }
        for (var j = 0; j < 6; j++) { var b = j / 6 * 2 * PI; g.seg([x0 + uz * r * cos(b), y0 + r * sin(b), z0 - ux * r * cos(b)], [x1 + uz * r * cos(b), y1 + r * sin(b), z1 - ux * r * cos(b)]); }
      }
      mod(0, -7, -32, 0, -7, -13, 2.1); mod(0, -7, -13, 0, -7, 0, 2.2); mod(0, -7, 0, 0, -7, 9, 2.2); mod(0, -7, 9, 0, -7, 20, 2.2);
      mod(0, -7, 20, 0, -7, 27, 2.2); mod(0, -7, 20, -8, -7, 20, 2.2); mod(0, -7, 20, 11, -7, 20, 2.2);
      g.seg([0, -4.8, 0], [0, -h, 0]);
      [-18, 18].forEach(function (xc) { g.rect(xc - 1, -h, xc + 1, -24, -h); g.poly([[xc, -h, -h], [xc, -h - 22, -h - 6], [xc, -h - 22, h + 6], [xc, -h, h]], true); });
    },
    millau: function (g) {
      var D = 270, P = [[-1020, 94.5], [-678, 245], [-336, 221], [6, 144.2], [348, 136.4], [690, 111.9], [1032, 77.6]];
      function zc(x) { return x * x / 40000; }
      var dk = [];
      for (var x = -1230; x <= 1230; x += 60) dk.push(x);
      [-16, 16].forEach(function (z) { g.poly(dk.map(function (xx) { return [xx, D, z + zc(xx)]; })); g.poly(dk.map(function (xx) { return [xx, D - 4.2, z * 0.6 + zc(xx)]; })); });
      var gr = [[-1230, D - 20]].concat(P.map(function (p) { return [p[0], D - p[1]]; })).concat([[1230, D - 30]]);
      [-140, 0, 140].forEach(function (z) { g.poly(gr.map(function (q) { return [q[0], q[1] - Math.abs(z) * 0.1, z + zc(q[0])]; })); });
      P.forEach(function (p) {
        var x = p[0], z = zc(x), y0 = D - p[1], split = D - Math.min(90, p[1] * 0.4);
        g.poly([[x - 13, y0, z - 9], [x - 4, split, z - 7], [x - 4, D - 4, z - 7]]); g.poly([[x + 13, y0, z - 9], [x + 4, split, z - 7], [x + 4, D - 4, z - 7]]);
        g.poly([[x - 13, y0, z + 9], [x - 4, split, z + 7], [x - 4, D - 4, z + 7]]); g.poly([[x + 13, y0, z + 9], [x + 4, split, z + 7], [x + 4, D - 4, z + 7]]);
        g.rect(x - 13, z - 9, x + 13, z + 9, y0);
        g.poly([[x - 9, D, z], [x, D + 38, z], [x + 9, D, z]]); g.seg([x, D + 38, z], [x, D + 87, z]);
        for (var k = 1; k <= 11; k++) {
          var top = D + 45 + k * 3.5;
          g.seg([x, top, z], [x - 18 - k * 13, D, zc(x - 18 - k * 13)]); g.seg([x, top, z], [x + 18 + k * 13, D, zc(x + 18 + k * 13)]);
        }
      });
    },
    gorges: function (g) {
      var L = 1167, H = 181;
      function sec(x) { return [[x, 0, 0], [x, H, 0], [x, H, 15], [x, 0, 115]]; }
      [-L, L].forEach(function (x) { g.poly(sec(x), true); });
      [[0, 0], [H, 0], [H, 15], [0, 115]].forEach(function (c) { g.seg([-L, c[0], c[1]], [L, c[0], c[1]]); });
      for (var x = -L + 50; x < L; x += 50) g.poly([[x, H, 15], [x, 0, 115]]);
      for (var x2 = -240; x2 <= 240; x2 += 21.8) { g.seg([x2, H - 30, 15 + 100 * 30 / H], [x2, 40, 15 + 100 * (H - 40) / H]); }
      g.box(-900, 0, 115, -330, 60, 170); g.box(330, 0, 115, 900, 60, 170);
      for (var s = 0; s < 5; s++) g.box(-1500 + s * 120, 20 * (4 - s), -260, -1380 + s * 120, 20 * (4 - s) + 28, -226);
      g.box(-1300, 0, -200, -1250, 170, -150);
      for (var w = 0; w < 5; w++) g.seg([-L - 300, 175, -40 - w * 60], [L + 300, 175, -40 - w * 60]);
      for (var w2 = 0; w2 < 4; w2++) g.seg([-L, 66, 140 + w2 * 60], [L, 66, 140 + w2 * 60]);
    },
    burj: function (g) {
      var R = 48, lv = [];
      function lobe(a, k) { var d = a - (PI / 2 + k * 2 * PI / 3); return Math.pow((1 + cos(d)) / 2, 7); }
      for (var i = 0; i <= 26; i++) {
        var y = i * 22.5, s = [0, 1, 2].map(function (k) { return Math.max(0.18, 1 - i / 30 - ((i + k) % 3 === 0 ? 0.07 : 0)); });
        var core = Math.max(0.2, 0.34 - i * 0.004);
        var p = polar(48, function (a) { return R * (core + 0.66 * Math.max(s[0] * lobe(a, 0), s[1] * lobe(a, 1), s[2] * lobe(a, 2))); });
        lv.push({ y: y, p: p });
      }
      g.loft(lv, 4);
      g.frustum(0, 0, 6.5, 1.4, 585, 760, 6, 3); g.seg([0, 760, 0], [0, 828, 0]);
    },
    lhc: function (g) {
      var R = 4243, y = -100;
      g.ring(circ(120, R - 45, 0, 0), y); g.ring(circ(120, R + 45, 0, 0), y);
      for (var i = 0; i < 48; i++) {
        var a = i / 48 * 2 * PI, c = cos(a), s = sin(a), p = [];
        for (var k = 0; k <= 12; k++) { var b = k / 12 * 2 * PI; p.push([(R + 45 * cos(b)) * c, y + 45 * sin(b), (R + 45 * cos(b)) * s]); }
        g.poly(p);
      }
      [PI / 2, PI / 4 + PI / 2, -PI / 2, -PI / 4 + PI].forEach(function (a, n) {
        var x = R * cos(a), z = R * sin(a), r = n % 2 ? 180 : 260;
        g.cyl(x, z, r, y - r, y + r, 20, 2, 8); g.seg([x, y + r, z], [x, 0, z]);
        g.box(x - 120, 0, z - 80, x + 120, 90, z + 80);
      });
      g.ring(circ(80, 1100, -2700, 3900), y + 20);
      for (var gx = -6000; gx <= 6000; gx += 1500) { g.seg([gx, 0, -6000], [gx, 0, 6000]); g.seg([-6000, 0, gx], [6000, 0, gx]); }
    },
    shanghai: function (g) {
      var lv = [];
      for (var i = 0; i <= 26; i++) {
        var y = i * 24.3, t = y / 632, R = 41 * (1 - 0.42 * t), rot = t * 2 * PI / 3;
        lv.push({ y: y, p: polar(60, function (a) { return R * (0.84 + 0.16 * cos(3 * a)); }, rot) });
      }
      g.loft(lv, 5);
      [0, 6, 12, 18, 24].forEach(function (k) { g.ring(circ(30, 15, 0, 0), k * 24.3); });
      g.seg([0, 632, 0], [0, 580, 0]);
    },
    hzmb: function (g) {
      var D = 40;
      [-12, 12].forEach(function (z) { g.seg([-900, D, z], [150, D, z]); g.seg([650, D, z], [900, D, z]); });
      for (var x = -900; x <= 150; x += 50) g.seg([x, 0, 0], [x, D, 0]);
      for (var x2 = 650; x2 <= 900; x2 += 50) g.seg([x2, 0, 0], [x2, D, 0]);
      [-700, -400, -110].forEach(function (xc, i) {
        var top = D + (i === 0 ? 105 : 85);
        if (i === 1) { g.poly([[xc - 6, D, 0], [xc - 3, top, 0], [xc + 3, top, 0], [xc + 6, D, 0]]); g.seg([xc - 3, top - 25, 0], [xc + 3, top - 25, 0]); }
        else g.seg([xc, D, 0], [xc, top, 0]);
        for (var k = 1; k <= 8; k++) { g.seg([xc, top - k * 6, 0], [xc - 14 - k * 14, D, -10]); g.seg([xc, top - k * 6, 0], [xc + 14 + k * 14, D, 10]); }
      });
      [150, 650].forEach(function (xc) {
        g.ring(circ(36, 1, 0, 0).map(function (p) { return [xc + p[0] * 110, p[1] * 46]; }), 0);
        g.ring(circ(36, 1, 0, 0).map(function (p) { return [xc + p[0] * 100, p[1] * 40]; }), 8);
        g.box(xc - 40, 8, -15, xc + 40, 26, 15);
      });
      var tp = [];
      for (var j = 0; j <= 20; j++) { var t = j / 20; tp.push([150 + 500 * t, -10 - 25 * sin(t * PI), 0]); }
      [-8, 8].forEach(function (z) { g.poly(tp.map(function (p) { return [p[0], p[1], z]; })); g.poly(tp.map(function (p) { return [p[0], p[1] - 10, z]; })); });
      for (var k2 = 0; k2 <= 20; k2 += 2) g.rect(tp[k2][0], -8, tp[k2][0], 8, tp[k2][1]);
      for (var z2 = -80; z2 <= 80; z2 += 40) g.seg([-900, 0, z2], [900, 0, z2]);
    },
    jwst: function (g) {
      var tilt = 0.35;
      function M(x, y) { return [x, 7 + y * cos(tilt), -y * sin(tilt)]; }
      var hx = [];
      for (var q = -2; q <= 2; q++) for (var r = -2; r <= 2; r++) { var s = -q - r; if (Math.abs(s) <= 2 && (q || r) && Math.max(Math.abs(q), Math.abs(r), Math.abs(s)) <= 2) hx.push([q, r]); }
      hx.forEach(function (h) {
        var sz = 0.78, cx = sz * Math.sqrt(3) * (h[0] + h[1] / 2), cy = sz * 1.5 * h[1];   /* pointy-top hex grid */
        var p = [];
        for (var i = 0; i < 6; i++) { var a = PI / 6 + i * PI / 3; p.push(M(cx + 0.74 * cos(a), cy + 0.74 * sin(a))); }
        g.poly(p, true);
      });
      var c0 = M(0, 0), sm = [c0[0], c0[1] + 2.6, c0[2] + 7.0];   /* secondary mirror on three struts */
      g.poly(circ(12, 0.38, 0, 0).map(function (p) { return [sm[0] + p[0], sm[1] + p[1] * 0.4, sm[2] + p[1]]; }), true);
      [M(0, 3.4), M(-3.0, -1.8), M(3.0, -1.8)].forEach(function (p) { g.seg(p, sm); });
      for (var l = 0; l < 5; l++) {
        var y = 3 - l * 0.32, d = l * 0.25;
        g.poly([[-10.5 + d, y, 0], [0, y, -7 + d], [10.5 - d, y, 0], [0, y, 7 - d]], true);
      }
      g.box(-1.6, 0.5, -1.6, 1.6, 1.4, 1.6);
      g.seg([-6, 0.9, 1.6], [-6, 0.9, 3.5]); g.rect(-8.5, 3.5, -3.5, 6, 0.9);
    }
  };

  /* id, Wikipedia title, year, fields, numbers [label key, value], engineers, blueprint view, dimension labels, start camera [yaw, pitch] */
  var P = [
    { id: 'pyramid', w: 'Great Pyramid of Giza', y: '≈ 2560 BC', f: ['civil', 'arch'], s: [['height', '146.6 m'], ['base', '230.3 m'], ['blocks', '≈ 2,300,000']], e: 'Hemiunu (attributed)', v: 'front', dh: '146.6 m', dw: '230.3 m', cam: [0.65, 0.32] },
    { id: 'pantheon', w: 'Pantheon, Rome', y: '≈ 126 AD', f: ['civil', 'arch'], s: [['dome', '43.3 m'], ['height', '43.3 m'], ['age', '≈ 1,900']], e: 'Emperor Hadrian (patron)', v: 'front', dh: '43.3 m', dw: 'Ø 43.3 m', cam: [2.6, 0.3] },
    { id: 'wall', w: 'Great Wall of China', y: '7th c. BC – 1644', f: ['civil', 'survey'], s: [['length', '21,196 km'], ['height', '≈ 5 – 8 m'], ['built', '≈ 2,000 yrs']], e: 'Qin, Han and Ming dynasties', v: 'front', dh: '', dw: '21,196 km', cam: [0.5, 0.42] },
    { id: 'eiffel', w: 'Eiffel Tower', y: '1889', f: ['civil', 'mech'], s: [['height', '330 m'], ['parts', '18,038'], ['rivets', '2,500,000']], e: 'Gustave Eiffel · Maurice Koechlin · Émile Nouguier', v: 'front', dh: '330 m', dw: '125 m', cam: [0.78, 0.12] },
    { id: 'panama', w: 'Panama Canal', y: '1914', f: ['civil', 'water'], s: [['length', '82 km'], ['lift', '26 m'], ['ships', '≈ 14,000 / yr']], e: 'John F. Stevens · George W. Goethals', v: 'front', dh: '26 m', dw: '3 × 305 m', cam: [0.55, 0.45] },
    { id: 'empire', w: 'Empire State Building', y: '1931', f: ['civil', 'arch'], s: [['height', '443 m'], ['floors', '102'], ['built', '410 days']], e: 'Shreve, Lamb & Harmon', v: 'front', dh: '443 m', dw: '129 m', cam: [0.6, 0.15] },
    { id: 'hoover', w: 'Hoover Dam', y: '1936', f: ['civil', 'water', 'elec'], s: [['height', '221 m'], ['crest', '379 m'], ['concrete', '≈ 2,500,000 m³']], e: 'John L. Savage · Frank Crowe', v: 'front', dh: '221 m', dw: '379 m', cam: [2.7, 0.3] },
    { id: 'golden', w: 'Golden Gate Bridge', y: '1937', f: ['civil'], s: [['span', '1,280 m'], ['towers', '227 m'], ['length', '2,737 m']], e: 'Joseph Strauss · Charles Ellis · Leon Moisseiff', v: 'front', dh: '227 m', dw: '1,280 m', cam: [0.42, 0.18] },
    { id: 'opera', w: 'Sydney Opera House', y: '1973', f: ['arch', 'civil'], s: [['height', '67 m'], ['tiles', '1,056,006'], ['built', '14 yrs']], e: 'Jørn Utzon · Ove Arup & Partners', v: 'front', dh: '67 m', dw: '183 m', cam: [0.7, 0.25] },
    { id: 'saturn', w: 'Saturn V', y: '1967', f: ['aero', 'mech'], s: [['height', '110.6 m'], ['mass', '2,970 t'], ['thrust', '34.5 MN']], e: 'Wernher von Braun', v: 'front', dh: '110.6 m', dw: 'Ø 10.1 m', cam: [0.5, 0.1] },
    { id: 'chunnel', w: 'Channel Tunnel', y: '1994', f: ['civil', 'survey'], s: [['length', '50.45 km'], ['undersea', '37.9 km'], ['depth', '75 m']], e: 'TransManche Link', v: 'side', dh: '', dw: '', cam: [0.9, 0.35] },
    { id: 'petronas', w: 'Petronas Towers', y: '1998', f: ['civil', 'arch'], s: [['height', '451.9 m'], ['floors', '88'], ['bridge', '170 m']], e: 'César Pelli · Thornton Tomasetti', v: 'front', dh: '451.9 m', dw: '58.4 m', cam: [0.35, 0.12] },
    { id: 'iss', w: 'International Space Station', y: '1998 – 2011', f: ['aero', 'mech', 'elec', 'comm'], s: [['length', '109 m'], ['mass', '≈ 420 t'], ['orbit', '≈ 400 km']], e: 'NASA · Roscosmos · ESA · JAXA · CSA', v: 'plan', dh: '', dw: '109 m', cam: [0.6, 0.6] },
    { id: 'millau', w: 'Millau Viaduct', y: '2004', f: ['civil'], s: [['height', '343 m'], ['length', '2,460 m'], ['deck', '270 m']], e: 'Michel Virlogeux · Norman Foster', v: 'front', dh: '343 m', dw: '2,460 m', cam: [0.3, 0.2] },
    { id: 'gorges', w: 'Three Gorges Dam', y: '2006 / 2012', f: ['civil', 'water', 'elec'], s: [['height', '181 m'], ['length', '2,335 m'], ['power', '22,500 MW']], e: 'China Three Gorges Corporation', v: 'front', dh: '181 m', dw: '2,335 m', cam: [2.5, 0.35] },
    { id: 'burj', w: 'Burj Khalifa', y: '2010', f: ['civil', 'arch'], s: [['height', '828 m'], ['floors', '163'], ['concrete', '330,000 m³']], e: 'Adrian Smith · Bill Baker (SOM)', v: 'front', dh: '828 m', dw: '≈ 90 m', cam: [0.4, 0.1] },
    { id: 'lhc', w: 'Large Hadron Collider', y: '2008', f: ['elec', 'mech', 'computer'], s: [['circ', '26.7 km'], ['temp', '−271.3 °C'], ['depth', '50 – 175 m']], e: 'CERN · Lyn Evans', v: 'plan', dh: '', dw: 'Ø 8.5 km', cam: [0.4, 0.62] },
    { id: 'shanghai', w: 'Shanghai Tower', y: '2015', f: ['civil', 'arch'], s: [['height', '632 m'], ['twist', '120°'], ['wind', '−24 %']], e: 'Gensler (Jun Xia) · Thornton Tomasetti', v: 'front', dh: '632 m', dw: '≈ 83 m', cam: [0.5, 0.12] },
    { id: 'hzmb', w: 'Hong Kong–Zhuhai–Macau Bridge', y: '2018', f: ['civil', 'water'], s: [['length', '55 km'], ['tunnel', '6.7 km'], ['life', '120 yrs']], e: 'CCCC · Hong Kong & Macau governments', v: 'front', dh: '', dw: '55 km', cam: [0.45, 0.3] },
    { id: 'jwst', w: 'James Webb Space Telescope', y: '2021', f: ['aero', 'mech', 'elec'], s: [['mirror', '6.5 m'], ['shield', '21 × 14 m'], ['dist', '1.5 M km']], e: 'NASA · ESA · CSA · Northrop Grumman', v: 'front', dh: '', dw: '21 m', cam: [0.8, 0.3] }
  ];

  /* ───────── renderer ───────── */
  var DPR = Math.min(2, window.devicePixelRatio || 1);
  var cache = {};
  function model(id) {
    if (cache[id]) return cache[id];
    var g = new G(); BUILD[id](g);
    var s = g.s, mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9];
    for (var i = 0; i < s.length; i += 3) for (var k = 0; k < 3; k++) { if (s[i + k] < mn[k]) mn[k] = s[i + k]; if (s[i + k] > mx[k]) mx[k] = s[i + k]; }
    var c = [(mn[0] + mx[0]) / 2, (mn[1] + mx[1]) / 2, (mn[2] + mx[2]) / 2], size = Math.max(mx[0] - mn[0], mx[1] - mn[1], mx[2] - mn[2]) || 1;
    var a = new Float32Array(s.length);
    for (var j = 0; j < s.length; j += 3) { a[j] = (s[j] - c[0]) / size; a[j + 1] = (s[j + 1] - c[1]) / size; a[j + 2] = (s[j + 2] - c[2]) / size; }
    return (cache[id] = { a: a, n: s.length / 6, ground: (mn[1] - c[1]) / size, span: [(mx[0] - mn[0]) / size, (mx[1] - mn[1]) / size, (mx[2] - mn[2]) / size] });
  }

  function View(el, p, T) {
    this.el = el; this.p = p; this.T = T;
    this.cv = el.querySelector('canvas'); this.ctx = this.cv.getContext('2d');
    this.mode = '3d'; this.yaw = p.cam[0]; this.pitch = p.cam[1]; this.prog = 1; this.drawn = false;
  }
  View.prototype.size = function () {
    var r = this.cv.getBoundingClientRect(), w = Math.max(1, Math.round(r.width * DPR)), h = Math.max(1, Math.round(r.height * DPR));
    if (this.cv.width !== w || this.cv.height !== h) { this.cv.width = w; this.cv.height = h; }
    return [w, h];
  };
  View.prototype.draw = function () {
    if (this.mode === 'ph') return;
    var wh = this.size(), W = wh[0], H = wh[1], ctx = this.ctx, m = model(this.p.id), a = m.a, n = m.n;
    ctx.clearRect(0, 0, W, H);
    var bp = this.mode === 'bp', view = this.p.v;
    var cyw = cos(this.yaw), syw = sin(this.yaw), cp = cos(this.pitch), sp = sin(this.pitch), dist = 2.6;
    var P2 = new Float32Array(n * 4), Z = new Float32Array(n * 2), minx = 1e9, maxx = -1e9, miny = 1e9, maxy = -1e9, minz = 1e9, maxz = -1e9;
    for (var i = 0; i < n * 2; i++) {
      var x = a[i * 3], y = a[i * 3 + 1], z = a[i * 3 + 2], X, Y, D;
      if (bp) {
        if (view === 'side') { X = z; Y = y; } else if (view === 'plan') { X = x; Y = -z; } else { X = x; Y = y; }
        D = 0;
      } else {
        var x1 = x * cyw - z * syw, z1 = x * syw + z * cyw, y2 = y * cp - z1 * sp, z2 = y * sp + z1 * cp, f = dist / (dist - z2);
        X = x1 * f; Y = y2 * f; D = z2;
      }
      P2[i * 2] = X; P2[i * 2 + 1] = Y; Z[i] = D;
      if (X < minx) minx = X; if (X > maxx) maxx = X; if (Y < miny) miny = Y; if (Y > maxy) maxy = Y; if (D < minz) minz = D; if (D > maxz) maxz = D;
    }
    var pad = bp ? 0.16 : 0.1, padB = bp ? 0.24 : 0.1;
    var sc = Math.min(W * (1 - 2 * pad) / Math.max(1e-6, maxx - minx), H * (1 - pad - padB) / Math.max(1e-6, maxy - miny));
    var ox = W / 2 - (minx + maxx) / 2 * sc, oy = H * pad + (H * (1 - pad - padB)) / 2 + (miny + maxy) / 2 * sc;
    var lim = Math.floor(n * this.prog), lw = Math.max(1, DPR * (bp ? 0.9 : 1));
    ctx.lineCap = 'round';
    if (bp) {
      ctx.strokeStyle = 'rgba(235,245,255,.92)'; ctx.lineWidth = lw;
      ctx.beginPath();
      for (var k = 0; k < lim; k++) { ctx.moveTo(ox + P2[k * 4] * sc, oy - P2[k * 4 + 1] * sc); ctx.lineTo(ox + P2[k * 4 + 2] * sc, oy - P2[k * 4 + 3] * sc); }
      ctx.stroke();
      this.dims(ctx, W, H, ox + minx * sc, oy - maxy * sc, ox + maxx * sc, oy - miny * sc, sc);
    } else {
      /* depth cue: nearer lines brighter, drawn in four batches */
      var buckets = 4, zr = Math.max(1e-6, maxz - minz);
      for (var b = 0; b < buckets; b++) {
        ctx.beginPath();
        for (var k2 = 0; k2 < lim; k2++) {
          var zz = ((Z[k2 * 2] + Z[k2 * 2 + 1]) / 2 - minz) / zr, bi = Math.min(buckets - 1, Math.floor(zz * buckets));
          if (bi !== b) continue;
          ctx.moveTo(ox + P2[k2 * 4] * sc, oy - P2[k2 * 4 + 1] * sc); ctx.lineTo(ox + P2[k2 * 4 + 2] * sc, oy - P2[k2 * 4 + 3] * sc);
        }
        ctx.strokeStyle = 'rgba(150,215,255,' + (0.28 + 0.62 * (b + 1) / buckets).toFixed(2) + ')';
        ctx.lineWidth = lw * (0.85 + 0.35 * b / buckets);
        ctx.stroke();
      }
    }
  };
  /* blueprint dimension lines and title block */
  View.prototype.dims = function (ctx, W, H, x0, y0, x1, y1) {
    var p = this.p, f = Math.round(11 * DPR), col = 'rgba(235,245,255,.8)';
    ctx.save();
    ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = Math.max(1, DPR * 0.8);
    ctx.font = '600 ' + f + 'px Zain, system-ui, sans-serif'; ctx.textBaseline = 'middle';
    try { ctx.direction = 'ltr'; } catch (e) {}
    function tick(x, y) { ctx.moveTo(x - 4 * DPR, y + 4 * DPR); ctx.lineTo(x + 4 * DPR, y - 4 * DPR); }
    if (p.dh && p.v !== 'plan') {
      var dx = Math.min(W - 24 * DPR, x1 + 22 * DPR);
      ctx.beginPath(); ctx.moveTo(dx, y0); ctx.lineTo(dx, y1); tick(dx, y0); tick(dx, y1);
      ctx.moveTo(x1 + 4 * DPR, y0); ctx.lineTo(dx + 6 * DPR, y0); ctx.moveTo(x1 + 4 * DPR, y1); ctx.lineTo(dx + 6 * DPR, y1); ctx.stroke();
      ctx.save(); ctx.translate(dx - 8 * DPR, (y0 + y1) / 2); ctx.rotate(-PI / 2); ctx.textAlign = 'center'; ctx.fillText(p.dh, 0, 0); ctx.restore();
    }
    if (p.dw) {
      var dy = Math.min(H - 52 * DPR, y1 + 18 * DPR);
      ctx.beginPath(); ctx.moveTo(x0, dy); ctx.lineTo(x1, dy); tick(x0, dy); tick(x1, dy);
      ctx.moveTo(x0, y1 + 4 * DPR); ctx.lineTo(x0, dy + 6 * DPR); ctx.moveTo(x1, y1 + 4 * DPR); ctx.lineTo(x1, dy + 6 * DPR); ctx.stroke();
      ctx.textAlign = 'center'; ctx.fillText(p.dw, (x0 + x1) / 2, dy - 9 * DPR);
    }
    /* title block */
    var bw = Math.min(W * 0.62, 300 * DPR), bh = 34 * DPR, bx = W - bw - 10 * DPR, by = H - bh - 10 * DPR;
    ctx.strokeRect(bx, by, bw, bh);
    ctx.beginPath(); ctx.moveTo(bx + bw * 0.66, by); ctx.lineTo(bx + bw * 0.66, by + bh); ctx.moveTo(bx, by + bh / 2); ctx.lineTo(bx + bw * 0.66, by + bh / 2); ctx.stroke();
    ctx.textAlign = 'left'; ctx.font = '700 ' + Math.round(10.5 * DPR) + 'px Zain, system-ui, sans-serif';
    ctx.fillText(p.w.toUpperCase().slice(0, 34), bx + 6 * DPR, by + bh / 4);
    ctx.font = '400 ' + Math.round(9.5 * DPR) + 'px Zain, system-ui, sans-serif';
    ctx.fillText((p.v === 'plan' ? 'PLAN' : p.v === 'side' ? 'SIDE ELEVATION' : 'FRONT ELEVATION') + ' · NTS', bx + 6 * DPR, by + bh * 3 / 4);
    ctx.textAlign = 'center'; ctx.font = '700 ' + Math.round(10.5 * DPR) + 'px Zain, system-ui, sans-serif';
    ctx.fillText(p.y, bx + bw * 0.83, by + bh / 2);
    ctx.restore();
  };
  View.prototype.reveal = function (reduce) {
    if (this.drawn) return;
    this.drawn = true;
    var self = this;
    if (reduce) { this.prog = 1; this.draw(); return; }
    var t0 = performance.now();
    (function step(now) {
      var k = Math.min(1, (now - t0) / 1100);
      self.prog = 1 - Math.pow(1 - k, 3);
      self.draw();
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  };
  View.prototype.setMode = function (m, A) {
    this.mode = m;
    this.el.setAttribute('data-mode', m);
    this.el.querySelectorAll('.pj-tabs button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-mode') === m); });
    if (m === 'ph') { var fig = this.el.querySelector('.pj-ph'); if (fig && !fig.getAttribute('data-l')) { fig.setAttribute('data-l', '1'); A.lazyFill(fig.parentNode); } }
    else this.draw();
  };
  View.prototype.bind = function () {
    var self = this, cv = this.cv, drag = null, raf = 0;
    cv.addEventListener('pointerdown', function (e) {
      if (self.mode !== '3d') return;
      drag = { x: e.clientX, y: e.clientY, yaw: self.yaw, pitch: self.pitch, id: e.pointerId };
      self.el.classList.add('dragging');
      try { cv.setPointerCapture(e.pointerId); } catch (er) {}
    });
    cv.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.id) return;
      self.yaw = drag.yaw + (e.clientX - drag.x) * 0.012;
      if (e.pointerType === 'mouse') self.pitch = Math.max(-0.2, Math.min(1.35, drag.pitch + (e.clientY - drag.y) * 0.008));
      if (!raf) raf = requestAnimationFrame(function () { raf = 0; self.draw(); });
    });
    function end() { drag = null; self.el.classList.remove('dragging'); }
    cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
  };

  /* ───────── page ───────── */
  function render(A) {
    var T = A.t('') || {}, esc = A.esc, icon = A.icon, tx = A.tx;
    return '<section class="sec pj-sec"><p class="note reveal un-note">' + icon('info') + '<span>' + esc(T.note) + '</span></p>' +
      '<nav class="pj-index reveal" aria-label="index">' + P.map(function (p, i) {
        return '<a href="#/projects/' + p.id + '"><b dir="ltr">' + A.pad(i + 1) + '</b>' + esc(((T.p || {})[p.id] || {}).n || p.w) + '</a>';
      }).join('') + '</nav>' +
      '<div class="pjs">' + P.map(function (p, i) {
        var t = (T.p || {})[p.id] || {};
        return '<article class="pj reveal" id="s-' + p.id + '">' +
          '<div class="pj-view" data-pj="' + p.id + '" data-mode="3d"><canvas aria-label="' + esc(t.n || p.w) + '"></canvas>' +
          '<figure class="pj-ph ph">' + A.wimg(p.w, p.w, p.w) + '<span class="ph-fb">' + icon('image') + '</span></figure>' +
          '<div class="pj-tabs" role="tablist"><button data-mode="3d" class="on">' + icon('cube') + '3D</button><button data-mode="bp">' + icon('blueprint') + esc(T.bp) + '</button><button data-mode="ph">' + icon('image') + esc(T.photo) + '</button></div>' +
          '<span class="pj-hint">' + icon('rotate') + esc(T.drag) + '</span><span class="pj-n" dir="ltr">' + A.pad(i + 1) + '</span></div>' +
          '<div class="pj-b"><p class="pj-y"><bdi dir="ltr">' + esc(p.y) + '</bdi> · ' + esc(t.loc) + '</p><h3>' + esc(t.n || p.w) + '</h3>' + (A.isEn ? '' : '<em dir="ltr">' + esc(p.w) + '</em>') +
          '<div class="pj-stats">' + p.s.map(function (s) {
            return '<div><b dir="ltr">' + esc(s[1]) + '</b><span>' + esc((T.k || {})[s[0]] || s[0]) + '</span></div>';
          }).join('') + '</div>' +
          '<p class="pj-d">' + tx(t.d) + '</p>' +
          (t.x ? '<p class="pj-x">' + icon('bulb') + '<span><b>' + esc(T.secret) + '</b> ' + tx(t.x) + '</span></p>' : '') +
          '<p class="pj-e">' + icon('users') + '<span dir="ltr">' + esc(p.e) + '</span></p>' +
          '<p class="pj-f">' + p.f.map(function (id) { var d = A.byId[id]; return d ? '<a href="#/dept/' + id + '" style="--dc:' + d.color + '"><i></i>' + esc(A.dName(d)) + '</a>' : ''; }).join('') +
          '<a class="pj-wiki" href="' + A.wikiUrl(p.w) + '" target="_blank" rel="noopener">' + icon('ext') + 'Wikipedia</a></p>' +
          '</div></article>';
      }).join('') + '</div></section>';
  }

  var views = [], io = null, ro = null;
  function mount(A, root) {
    views = []; if (io) io.disconnect(); if (ro) ro.disconnect();
    root.querySelectorAll('.pj-view').forEach(function (el) {
      var p = P.filter(function (x) { return x.id === el.getAttribute('data-pj'); })[0], v = new View(el, p);
      v.bind(); views.push(v); el._v = v;
      el.querySelector('.pj-tabs').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) v.setMode(b.getAttribute('data-mode'), A); });
    });
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(function (en) {
        en.forEach(function (x) { if (x.isIntersecting) { x.target._v.reveal(A.reduce); } });
      }, { rootMargin: '120px 0px' });
      views.forEach(function (v) { io.observe(v.el); });
    } else views.forEach(function (v) { v.reveal(true); });
    var lastW = window.innerWidth;
    window.addEventListener('resize', function () {
      if (Math.abs(window.innerWidth - lastW) < 2) return; lastW = window.innerWidth;
      views.forEach(function (v) { if (v.drawn && document.body.contains(v.el)) v.draw(); });
    });
  }
  function sub(A, root, s) {
    var el = s && document.getElementById('s-' + s);
    if (el) { A.scrollToEl(el, true); A.M.show(el); return true; }
    return false;
  }
  MODS.projects = { render: render, mount: mount, sub: sub, scene: 'truss' };
})();
