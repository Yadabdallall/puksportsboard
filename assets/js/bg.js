/* باکگراوندی جووڵاوی ئەندازیاری: چەرخی ددانەدار، تۆڕی خاڵ و نەخشەی بلووپرینت */
window.BG = (function () {
  var cv = document.getElementById('bg');
  if (!cv || !cv.getContext) return { setColor: function () {}, velocity: function () { return 0; } };
  var ctx = cv.getContext('2d');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  var W = 0, H = 0, DPR = 1, pts = [], gears = [], notes = [];
  var t = 0, sy = 0, lastSy = 0, vel = 0, spin = 0, running = true;
  var col = [255, 184, 28], tgt = [255, 184, 28];
  var mouse = { x: -9999, y: -9999 };

  function hexToRgb(h) {
    h = h.replace('#', '');
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    var n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function rgba(c, a) { return 'rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + a + ')'; }

  function makeGear(x, y, r, n, dir, phase) {
    return { x: x, y: y, r: r, n: n, dir: dir, phase: phase || 0 };
  }

  function init() {
    var area = W * H;
    var count = Math.round(Math.min(110, Math.max(36, area / 15000)));
    pts = [];
    for (var i = 0; i < count; i++) {
      pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22, r: Math.random() * 1.5 + 0.6, z: Math.random() * 0.8 + 0.2 });
    }
    var s = Math.min(W, H);
    var r1 = s * 0.2, r2 = r1 * 0.55, r3 = s * 0.15, r4 = r3 * 0.62;
    var g1 = makeGear(W * 0.06, H * 0.28, r1, 24, 1, 0);
    var a1 = 0.55;
    var g2 = makeGear(g1.x + Math.cos(a1) * (r1 + r2) * 0.93, g1.y + Math.sin(a1) * (r1 + r2) * 0.93, r2, 13, -1, Math.PI / 13);
    var g3 = makeGear(W * 0.95, H * 0.95, r3, 18, -1, 0);
    var a2 = -2.4;
    var g4 = makeGear(g3.x + Math.cos(a2) * (r3 + r4) * 0.93, g3.y + Math.sin(a2) * (r3 + r4) * 0.93, r4, 11, 1, Math.PI / 11);
    var g5 = makeGear(W * 0.78, H * 1.55, s * 0.11, 14, 1, 0);
    gears = [g1, g2, g3, g4, g5];
    notes = [
      { x: W * 0.62, y: H * 0.18, w: s * 0.26, label: 'L = 12 400 mm' },
      { x: W * 0.18, y: H * 1.2, w: s * 0.3, label: 'Ø 2 × R ' + Math.round(r1) },
      { x: W * 0.55, y: H * 0.86, w: s * 0.2, label: 'σ = M·y / I' },
      { x: W * 0.3, y: H * 1.7, w: s * 0.22, label: 'V = I · R' }
    ];
  }

  function resize() {
    DPR = Math.min(2, window.devicePixelRatio || 1);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    cv.style.width = W + 'px'; cv.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    init();
    if (reduce) draw();
  }

  function wrapY(y, span) { return ((y % span) + span) % span; }

  function drawGear(g, rot, oy) {
    var y = g.y + oy;
    var n = g.n, R = g.r, ri = R * 0.84, step = (Math.PI * 2) / n;
    ctx.save();
    ctx.translate(g.x, y);
    ctx.beginPath();
    for (var i = 0; i < n; i++) {
      var a = rot + i * step;
      var p = [[ri, a], [R, a + step * 0.14], [R, a + step * 0.38], [ri, a + step * 0.52]];
      for (var j = 0; j < 4; j++) {
        var px = p[j][0] * Math.cos(p[j][1]), py = p[j][0] * Math.sin(p[j][1]);
        if (i === 0 && j === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.arc(0, 0, ri, a + step * 0.52, a + step, false);
    }
    ctx.closePath();
    ctx.strokeStyle = rgba(col, 0.2);
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.fillStyle = rgba(col, 0.025);
    ctx.fill();
    // ناوەوە: بازنە و تیلەکان
    ctx.beginPath(); ctx.arc(0, 0, R * 0.62, 0, Math.PI * 2); ctx.strokeStyle = rgba(col, 0.12); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, R * 0.18, 0, Math.PI * 2); ctx.strokeStyle = rgba(col, 0.22); ctx.stroke();
    for (var k = 0; k < 5; k++) {
      var aa = rot + (k * Math.PI * 2) / 5;
      ctx.beginPath();
      ctx.moveTo(Math.cos(aa) * R * 0.18, Math.sin(aa) * R * 0.18);
      ctx.lineTo(Math.cos(aa) * R * 0.62, Math.sin(aa) * R * 0.62);
      ctx.strokeStyle = rgba(col, 0.1); ctx.stroke();
    }
    // هێڵی ناوەند (Center lines)
    ctx.setLineDash([10, 4, 2, 4]);
    ctx.strokeStyle = rgba([150, 190, 255], 0.14);
    ctx.beginPath(); ctx.moveTo(-R * 1.25, 0); ctx.lineTo(R * 1.25, 0); ctx.moveTo(0, -R * 1.25); ctx.lineTo(0, R * 1.25); ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  function drawNote(nt, oy) {
    var y = nt.y + oy, x = nt.x, w = nt.w;
    ctx.save();
    ctx.strokeStyle = rgba([150, 190, 255], 0.2);
    ctx.fillStyle = rgba([150, 190, 255], 0.35);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y - 10); ctx.lineTo(x, y + 10);
    ctx.moveTo(x + w, y - 10); ctx.lineTo(x + w, y + 10);
    ctx.moveTo(x, y); ctx.lineTo(x + w, y);
    ctx.stroke();
    // تیرەکان
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 8, y - 3); ctx.lineTo(x + 8, y + 3); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x + w, y); ctx.lineTo(x + w - 8, y - 3); ctx.lineTo(x + w - 8, y + 3); ctx.closePath(); ctx.fill();
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = rgba([170, 205, 255], 0.35);
    ctx.fillText(nt.label, x + w / 2, y - 7);
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // ڕووناکی نەرم
    var gx = W * (0.7 + Math.sin(t * 0.0023) * 0.12), gy = H * (0.3 + Math.cos(t * 0.0019) * 0.12);
    var g = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.max(W, H) * 0.6);
    g.addColorStop(0, rgba(col, 0.13)); g.addColorStop(1, rgba(col, 0));
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    var bx = W * (0.2 + Math.cos(t * 0.0017) * 0.1), by = H * (0.8 + Math.sin(t * 0.0021) * 0.1);
    var g2 = ctx.createRadialGradient(bx, by, 0, bx, by, Math.max(W, H) * 0.55);
    g2.addColorStop(0, 'rgba(40,110,255,0.10)'); g2.addColorStop(1, 'rgba(40,110,255,0)');
    ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);

    // چەرخەکان — لەگەڵ سکرۆڵدا دەجووڵێن و دەسووڕێنەوە
    var span = H * 2.2;
    var rot = t * 0.0022 + spin;
    for (var i = 0; i < gears.length; i++) {
      var gr = gears[i];
      var ratio = gears[0].n / gr.n;
      var r = (i === 0 ? rot : rot * ratio) * gr.dir + gr.phase;
      if (i >= 2) r = (rot * (gears[2].n / gr.n)) * gr.dir + gr.phase;
      var oy = wrapY(gr.y - sy * 0.18 + H * 0.4, span) - H * 0.4 - gr.y;
      drawGear(gr, r, oy);
    }
    for (var n = 0; n < notes.length; n++) {
      var nt = notes[n];
      var noy = wrapY(nt.y - sy * 0.12 + H * 0.2, span) - H * 0.2 - nt.y;
      drawNote(nt, noy);
    }

    // تۆڕی خاڵەکان
    var P = [];
    for (var a = 0; a < pts.length; a++) {
      var p = pts[a];
      if (!reduce) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20; if (p.y > H + 20) p.y = -20;
        var dxm = p.x - mouse.x, dym = p.y - mouse.y, dm = dxm * dxm + dym * dym;
        if (dm < 22000) { p.x += dxm * 0.004; p.y += dym * 0.004; }
      }
      P.push({ x: p.x, y: wrapY(p.y - sy * 0.06 * p.z, H + 40) - 20, r: p.r, z: p.z });
    }
    ctx.lineWidth = 0.8;
    for (var b = 0; b < P.length; b++) {
      for (var c = b + 1; c < P.length; c++) {
        var dx = P[b].x - P[c].x, dy = P[b].y - P[c].y, d = dx * dx + dy * dy;
        if (d < 17000) {
          ctx.strokeStyle = rgba([140, 180, 255], (1 - d / 17000) * 0.16);
          ctx.beginPath(); ctx.moveTo(P[b].x, P[b].y); ctx.lineTo(P[c].x, P[c].y); ctx.stroke();
        }
      }
      var mx = P[b].x - mouse.x, my = P[b].y - mouse.y, md = mx * mx + my * my;
      if (md < 30000) {
        ctx.strokeStyle = rgba(col, (1 - md / 30000) * 0.4);
        ctx.beginPath(); ctx.moveTo(P[b].x, P[b].y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
    }
    for (var e = 0; e < P.length; e++) {
      ctx.fillStyle = e % 4 === 0 ? rgba(col, 0.7 * P[e].z) : rgba([180, 210, 255], 0.55 * P[e].z);
      ctx.beginPath(); ctx.arc(P[e].x, P[e].y, P[e].r, 0, Math.PI * 2); ctx.fill();
    }
  }

  function loop() {
    if (!running) return;
    t += 1;
    sy = window.scrollY || window.pageYOffset || 0;
    var dv = sy - lastSy; lastSy = sy;
    vel = vel * 0.85 + dv * 0.15;
    spin += dv * 0.0016;
    for (var i = 0; i < 3; i++) col[i] += (tgt[i] - col[i]) * 0.05;
    draw();
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  window.addEventListener('pointerleave', function () { mouse.x = -9999; mouse.y = -9999; });
  document.addEventListener('visibilitychange', function () {
    if (reduce) return;
    running = !document.hidden;
    if (running) requestAnimationFrame(loop);
  });
  if (reduce) {
    window.addEventListener('scroll', function () { sy = window.scrollY; draw(); }, { passive: true });
  }

  resize();
  if (!reduce) requestAnimationFrame(loop);

  return {
    setColor: function (hex) {
      tgt = hexToRgb(hex);
      if (reduce) { col = tgt.slice(); draw(); }
    },
    velocity: function () { return vel; }
  };
})();
