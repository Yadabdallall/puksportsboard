// Flat sport icons for sportfilm.html, each drawn around (0, 0) inside a
// ±100 box. They sit on the green disc of the intro, so they use white,
// beige, blue and a little ink. glyph(name, ...) draws one; unknown names
// fall back to the medal. To add a sport icon, add a function here and use
// its name as "gear" in sports/sports.json.

function gcircle(x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); }
function gpoly(pts, close = true) {
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  if (close) ctx.closePath();
}
function gfill(col) { ctx.fillStyle = col; ctx.fill(); }
function gstroke(col = C.ink, lw = 6) {
  ctx.strokeStyle = col;
  ctx.lineWidth = lw;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
}
// fill and outline the same path
function gshape(fill, lw = 6, line = C.ink) { gfill(fill); gstroke(line, lw); }
// a thick line with an ink outline
function gbar(pts, col, w, outline = 5) {
  gpoly(pts, false); gstroke(C.ink, w + outline * 2);
  gpoly(pts, false); gstroke(col, w);
}
const star = (r1, r2, n = 5, rot = -Math.PI / 2) =>
  Array.from({ length: n * 2 }, (_, k) => { const r = k % 2 ? r2 : r1, a = rot + (k * Math.PI) / n; return [Math.cos(a) * r, Math.sin(a) * r]; });

const GLYPHS = {
  football() {
    gcircle(0, 0, 92); gfill(C.white);
    ctx.save();
    gcircle(0, 0, 92); ctx.clip();
    const pent = (cx, cy, r, rot) => gpoly(Array.from({ length: 5 }, (_, k) => [cx + r * Math.cos(rot + k * 1.2566), cy + r * Math.sin(rot + k * 1.2566)]));
    pent(0, 0, 30, -Math.PI / 2); gfill(C.ink);
    for (let k = 0; k < 5; k++) {
      const a = -Math.PI / 2 + k * 1.2566, b = a + 0.6283;
      gpoly([[Math.cos(a) * 30, Math.sin(a) * 30], [Math.cos(a) * 58, Math.sin(a) * 58]], false); gstroke(C.ink, 5);
      gpoly([[Math.cos(a) * 58, Math.sin(a) * 58], [Math.cos(b) * 74, Math.sin(b) * 74]], false); gstroke(C.ink, 5);
      gpoly([[Math.cos(a) * 58, Math.sin(a) * 58], [Math.cos(a - 0.6283) * 74, Math.sin(a - 0.6283) * 74]], false); gstroke(C.ink, 5);
      pent(Math.cos(b) * 98, Math.sin(b) * 98, 28, b + Math.PI); gfill(C.ink);
    }
    ctx.restore();
    gcircle(0, 0, 92); gstroke(C.ink, 6);
  },
  basketball() {
    gcircle(0, 0, 92); gshape(C.blue);
    ctx.save();
    gcircle(0, 0, 92); ctx.clip();
    ctx.beginPath();
    ctx.moveTo(0, -92); ctx.lineTo(0, 92); ctx.moveTo(-92, 0); ctx.lineTo(92, 0);
    ctx.moveTo(-66, -66); ctx.quadraticCurveTo(-18, 0, -66, 66);
    ctx.moveTo(66, -66); ctx.quadraticCurveTo(18, 0, 66, 66);
    gstroke(C.beige, 7);
    ctx.restore();
    gcircle(0, 0, 92); gstroke(C.ink, 6);
  },
  volleyball() {
    gcircle(0, 0, 92); gfill(C.white);
    ctx.save();
    gcircle(0, 0, 92); ctx.clip();
    const end = k => { const a = -Math.PI / 2 + k * 2.094; return [Math.cos(a) * 92, Math.sin(a) * 92, a]; };
    const ctl = k => { const a = -Math.PI / 2 + k * 2.094 + 0.9; return [Math.cos(a) * 52, Math.sin(a) * 52]; };
    // one panel in blue
    const [x0, y0, a0] = end(0), [, , a1] = end(1);
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.quadraticCurveTo(...ctl(0), x0, y0);
    ctx.arc(0, 0, 92, a0, a1);
    ctx.quadraticCurveTo(...ctl(1), 0, 0);
    gfill(C.blue);
    for (let k = 0; k < 3; k++) {
      const [x, y] = end(k);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(...ctl(k), x, y); gstroke(C.ink, 6);
      const [cx, cy] = ctl(k + 0.5);
      const [ex, ey] = end(k + 0.55);
      ctx.beginPath(); ctx.moveTo(cx * 0.5, cy * 0.5); ctx.quadraticCurveTo(cx * 1.2, cy * 1.2, ex, ey); gstroke(C.ink, 3);
    }
    ctx.restore();
    gcircle(0, 0, 92); gstroke(C.ink, 6);
  },
  handball() {
    gcircle(0, 0, 92); gfill(C.white);
    ctx.save();
    gcircle(0, 0, 92); ctx.clip();
    ctx.beginPath(); ctx.moveTo(-100, -30); ctx.quadraticCurveTo(0, 30, 100, -30); ctx.lineTo(100, 20); ctx.quadraticCurveTo(0, 80, -100, 20); ctx.closePath();
    gfill(C.blue);
    ctx.beginPath();
    ctx.moveTo(-100, -30); ctx.quadraticCurveTo(0, 30, 100, -30);
    ctx.moveTo(-100, 20); ctx.quadraticCurveTo(0, 80, 100, 20);
    ctx.moveTo(-20, -100); ctx.quadraticCurveTo(-50, -40, -20, 4);
    ctx.moveTo(40, -100); ctx.quadraticCurveTo(10, -40, 36, 2);
    gstroke(C.ink, 5);
    ctx.restore();
    gcircle(0, 0, 92); gstroke(C.ink, 6);
  },
  baseball() {
    gcircle(0, 0, 92); gshape(C.white);
    for (const s of [-1, 1]) {
      ctx.beginPath(); ctx.arc(s * -132, 0, 100, s > 0 ? -0.75 : Math.PI - 0.75, s > 0 ? 0.75 : Math.PI + 0.75); gstroke(C.blue, 6);
      for (let k = -4; k <= 4; k++) {
        const a = (s > 0 ? 0 : Math.PI) + k * 0.17, x = s * -132 + Math.cos(a) * 100, y = Math.sin(a) * 100;
        const nx = Math.cos(a), ny = Math.sin(a);
        ctx.beginPath(); ctx.moveTo(x - nx * 9 - ny * 5, y - ny * 9 + nx * 5); ctx.lineTo(x, y); ctx.lineTo(x - nx * 9 + ny * 5, y - ny * 9 - nx * 5);
        gstroke(C.blue, 3.5);
      }
    }
  },
  bat() {
    ctx.save();
    ctx.rotate(-0.6);
    ctx.beginPath(); ctx.roundRect(-30, -30, 60, 132, 16); gshape(C.white);
    ctx.beginPath(); ctx.moveTo(0, -20); ctx.lineTo(0, 90); gstroke(C.beige2, 5);
    ctx.beginPath(); ctx.roundRect(-12, -108, 24, 82, 9); gshape(C.blue, 5);
    ctx.restore();
    gcircle(66, 56, 26); gshape(C.blue, 5);
    ctx.beginPath(); ctx.arc(66, 56, 18, -0.9, 0.9); gstroke(C.white, 3);
  },
  rugby() {
    ctx.save();
    ctx.rotate(-0.6);
    ctx.beginPath(); ctx.ellipse(0, 0, 100, 60, 0, 0, Math.PI * 2);
    gfill(C.white);
    ctx.save(); ctx.clip();
    ctx.fillStyle = C.blue; ctx.fillRect(-74, -70, 16, 140); ctx.fillRect(58, -70, 16, 140);
    ctx.restore();
    ctx.beginPath(); ctx.ellipse(0, 0, 100, 60, 0, 0, Math.PI * 2); gstroke(C.ink, 6);
    ctx.beginPath(); ctx.moveTo(-36, -18); ctx.lineTo(36, -18); gstroke(C.ink, 5);
    for (let x = -28; x <= 28; x += 14) { ctx.beginPath(); ctx.moveTo(x, -27); ctx.lineTo(x, -9); gstroke(C.ink, 4); }
    ctx.restore();
  },
  hockey() {
    gbar([[-40, -100], [16, 46], [30, 64], [80, 66]], C.white, 18);
    gpoly([[-34, -84], [-20, -48]], false); gstroke(C.blue, 18);
    ctx.beginPath(); ctx.ellipse(-48, 70, 34, 13, 0, 0, Math.PI * 2); gfill(C.ink);
    ctx.beginPath(); ctx.ellipse(-48, 62, 34, 13, 0, 0, Math.PI * 2); gshape(C.blue, 4);
  },
  racket() {
    ctx.save();
    ctx.rotate(-0.45);
    ctx.beginPath(); ctx.ellipse(0, -30, 56, 70, 0, 0, Math.PI * 2);
    ctx.save(); ctx.clip();
    ctx.beginPath();
    for (let x = -50; x <= 50; x += 14) { ctx.moveTo(x, -110); ctx.lineTo(x, 50); }
    for (let y = -96; y <= 36; y += 14) { ctx.moveTo(-60, y); ctx.lineTo(60, y); }
    gstroke('rgba(22,22,22,0.55)', 2.5);
    ctx.restore();
    ctx.beginPath(); ctx.ellipse(0, -30, 56, 70, 0, 0, Math.PI * 2); gstroke(C.ink, 18);
    ctx.beginPath(); ctx.ellipse(0, -30, 56, 70, 0, 0, Math.PI * 2); gstroke(C.blue, 11);
    gpoly([[-26, 34], [0, 66], [26, 34]], false); gstroke(C.blue, 9);
    ctx.beginPath(); ctx.roundRect(-11, 62, 22, 50, 7); gshape(C.white, 5);
    ctx.restore();
    gcircle(66, 52, 23); gshape(C.white, 5);
    ctx.beginPath(); ctx.arc(52, 52, 18, -1.1, 1.1); gstroke(C.blue, 4);
  },
  paddle() {
    ctx.save();
    ctx.rotate(0.5);
    ctx.beginPath(); ctx.roundRect(-15, 30, 30, 76, 10); gshape(C.white, 5);
    gcircle(0, -26, 68); gshape(C.blue, 6);
    gcircle(0, -26, 60); gstroke('rgba(241,232,213,0.35)', 3);
    ctx.restore();
    gcircle(-66, -72, 17); gshape(C.white, 5);
  },
  shuttle() {
    ctx.save();
    ctx.rotate(0.35);
    gpoly([[-30, 40], [30, 40], [70, -92], [-70, -92]]); gshape(C.white, 5);
    ctx.beginPath();
    for (const x of [-15, 0, 15]) { ctx.moveTo(x, 40); ctx.lineTo(x * 4, -92); }
    gstroke('rgba(22,22,22,0.5)', 3);
    gpoly([[-46, -26], [46, -26]], false); gstroke(C.blue, 8);
    ctx.beginPath(); ctx.moveTo(-32, 40); ctx.lineTo(32, 40); ctx.arc(0, 40, 32, 0, Math.PI); gshape(C.white, 5);
    ctx.fillStyle = C.blue; ctx.fillRect(-32, 40, 64, 10);
    ctx.restore();
  },
  glove() {
    ctx.save();
    ctx.translate(0, 8);
    ctx.scale(0.5, 0.5);
    ctx.beginPath();
    ctx.moveTo(-74, 70);
    ctx.bezierCurveTo(-96, 10, -112, -70, -96, -122);
    ctx.bezierCurveTo(-82, -176, -30, -196, 8, -192);
    ctx.bezierCurveTo(60, -188, 100, -160, 104, -104);
    ctx.bezierCurveTo(106, -60, 96, -10, 78, 70);
    ctx.closePath();
    gshape(C.blue, 10);
    ctx.beginPath(); ctx.ellipse(92, -28, 34, 70, -0.2, 0, Math.PI * 2); gshape(C.blueDark, 8);
    ctx.beginPath(); ctx.arc(0, -96, 70, -2.6, -1.2); gstroke('rgba(255,255,255,0.45)', 12);
    ctx.beginPath(); ctx.roundRect(-82, 56, 166, 110, 16); gshape(C.white, 10);
    ctx.fillStyle = C.green; ctx.fillRect(-77, 92, 156, 26);
    ctx.restore();
  },
  belt() {
    ctx.save();
    ctx.translate(0, -16);
    gpoly([[-8, 10], [-62, 96], [-36, 104], [4, 22]]); gshape(C.ink, 4, C.ink);
    gpoly([[8, 10], [66, 92], [42, 104], [-4, 22]]); gshape(C.ink, 4, C.ink);
    ctx.fillStyle = C.blue;
    gpoly([[-56, 86], [-62, 96], [-36, 104], [-32, 94]]); gfill(C.blue);
    gpoly([[60, 84], [66, 92], [42, 104], [38, 96]]); gfill(C.blue);
    ctx.beginPath(); ctx.roundRect(-100, -16, 200, 34, 6); gfill(C.ink);
    ctx.beginPath(); ctx.moveTo(-96, -6); ctx.lineTo(96, -6); ctx.moveTo(-96, 8); ctx.lineTo(96, 8);
    ctx.setLineDash([7, 7]); gstroke('rgba(241,232,213,0.55)', 2); ctx.setLineDash([]);
    ctx.beginPath(); ctx.roundRect(-26, -30, 52, 58, 10); gshape(C.ink, 5, C.white);
    ctx.restore();
  },
  laurel() {
    for (const s of [-1, 1]) {
      ctx.beginPath(); ctx.arc(0, 0, 76, Math.PI / 2 + s * 0.3, Math.PI / 2 + s * 2.6, s < 0); gstroke(C.white, 6);
      for (let k = 0; k < 7; k++) {
        const a = Math.PI / 2 + s * (0.45 + k * 0.33);
        ctx.save();
        ctx.translate(Math.cos(a) * 76, Math.sin(a) * 76);
        ctx.rotate(a + (s > 0 ? 0.5 : -0.5) + Math.PI / 2);
        ctx.beginPath(); ctx.ellipse(0, 0, 25, 10, 0, 0, Math.PI * 2); gshape(C.white, 3.5);
        ctx.restore();
      }
    }
    gpoly([[-8, 74], [-34, 104], [-14, 100], [0, 82], [14, 100], [34, 104], [8, 74]]); gshape(C.blue, 4);
    gpoly(star(30, 13)); gshape(C.blue, 4);
  },
  swords() {
    for (const s of [-1, 1]) {
      ctx.save();
      ctx.rotate(s * 0.7);
      gbar([[0, -104], [0, 34]], C.white, 6, 3);
      ctx.beginPath(); ctx.ellipse(0, 36, 30, 11, 0, 0, Math.PI * 2); gshape(C.blue, 4);
      ctx.beginPath(); ctx.roundRect(-6, 44, 12, 40, 4); gfill(C.ink);
      gcircle(0, 90, 9); gfill(C.ink);
      ctx.restore();
    }
  },
  shoe() {
    ctx.save();
    ctx.translate(0, 6);
    gpoly([[-92, 34], [-94, -8], [-66, -26], [-34, -66], [6, -66], [18, -32], [56, -12], [90, 6], [98, 34]]);
    gshape(C.white, 6);
    ctx.beginPath(); ctx.moveTo(-60, -10); ctx.quadraticCurveTo(0, 20, 70, -4); gstroke(C.blue, 10);
    for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(-6 + k * 14, -54 + k * 10); ctx.lineTo(10 + k * 14, -46 + k * 10); gstroke(C.ink, 4); }
    ctx.beginPath(); ctx.roundRect(-100, 28, 204, 26, 13); gshape(C.blue, 5);
    ctx.restore();
  },
  stopwatch(t) {
    ctx.beginPath(); ctx.roundRect(-14, -98, 28, 20, 5); gshape(C.blue, 5);
    gpoly([[0, -78], [0, -66]], false); gstroke(C.ink, 8);
    ctx.save(); ctx.translate(58, -56); ctx.rotate(0.8); ctx.beginPath(); ctx.roundRect(-8, -10, 16, 20, 4); gshape(C.blue, 4); ctx.restore();
    gcircle(0, 12, 80); gshape(C.white, 7);
    const a = -Math.PI / 2 + (t || 0) * 1.6;
    ctx.beginPath(); ctx.moveTo(0, 12); ctx.arc(0, 12, 62, -Math.PI / 2, a); ctx.closePath(); gfill('rgba(31,95,125,0.25)');
    for (let k = 0; k < 12; k++) {
      const b = (k * Math.PI) / 6;
      gpoly([[Math.cos(b) * 64, 12 + Math.sin(b) * 64], [Math.cos(b) * 72, 12 + Math.sin(b) * 72]], false); gstroke(C.ink, k % 3 ? 3 : 5);
    }
    gpoly([[0, 12], [Math.cos(a) * 58, 12 + Math.sin(a) * 58]], false); gstroke(C.blue, 7);
    gcircle(0, 12, 8); gfill(C.ink);
  },
  javelin() {
    for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(-96 + k * 8, -6 + k * 30); ctx.lineTo(-56 + k * 8, -36 + k * 30); gstroke(C.white, 7); }
    ctx.save();
    ctx.rotate(0.8);
    gbar([[0, -112], [0, 104]], C.white, 8, 4);
    gpoly([[0, -128], [8, -104], [-8, -104]]); gfill(C.ink);
    ctx.beginPath(); ctx.roundRect(-8, -14, 16, 40, 4); gshape(C.blue, 4);
    ctx.restore();
  },
  shot() {
    for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(-100, -26 + k * 28); ctx.lineTo(-52 + k * 8, -26 + k * 28); gstroke(C.white, 9); }
    gcircle(26, 4, 62); gshape(C.blue, 6);
    ctx.beginPath(); ctx.arc(26, 4, 44, -2.6, -1.4); gstroke('rgba(255,255,255,0.6)', 8);
  },
  barbell() {
    gpoly([[-104, 0], [104, 0]], false); gstroke(C.ink, 10);
    for (const s of [-1, 1]) {
      ctx.beginPath(); ctx.roundRect(s * 58 - 13, -64, 26, 128, 7); gshape(C.blue, 5);
      ctx.beginPath(); ctx.roundRect(s * 82 - 9, -44, 18, 88, 6); gshape(C.white, 5);
      ctx.beginPath(); ctx.roundRect(s * 38 - 5, -18, 10, 36, 3); gfill(C.ink);
    }
  },
  dumbbell() {
    ctx.save();
    ctx.rotate(-0.5);
    ctx.beginPath(); ctx.roundRect(-46, -10, 92, 20, 6); gfill(C.ink);
    for (const s of [-1, 1]) {
      ctx.beginPath(); ctx.roundRect(s * 56 - 13, -52, 26, 104, 8); gshape(C.blue, 5);
      ctx.beginPath(); ctx.roundRect(s * 80 - 9, -36, 18, 72, 6); gshape(C.white, 5);
    }
    ctx.restore();
  },
  rings(t) {
    const sw = Math.sin((t || 0) * 1.4) * 0.05;
    for (const s of [-1, 1]) {
      ctx.save();
      ctx.translate(s * 46, -104);
      ctx.rotate(sw);
      gpoly([[0, 0], [0, 92]], false); gstroke(C.white, 9);
      ctx.beginPath(); ctx.roundRect(-9, 74, 18, 18, 4); gfill(C.blue);
      gcircle(0, 130, 36); gstroke(C.ink, 18);
      gcircle(0, 130, 36); gstroke(C.white, 10);
      ctx.restore();
    }
  },
  swim() {
    gpoly([[-100, -14], [-74, -14]], false); gstroke(C.blue, 8);
    gpoly([[74, -14], [100, -14]], false); gstroke(C.blue, 8);
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(s * 40, -14, 34, 26, 0, 0, Math.PI * 2); gshape(C.blue, 7, C.white); }
    gpoly([[-8, -14], [8, -14]], false); gstroke(C.white, 7);
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(s * 40 - 8, -22, 10, 6, 0, 0, Math.PI * 2); gfill('rgba(255,255,255,0.5)'); }
    for (let k = 0; k < 2; k++) {
      ctx.beginPath();
      for (let x = -90; x <= 90; x += 4) { const y = 50 + k * 30 + Math.sin(x * 0.07) * 8; x === -90 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
      gstroke(C.white, 8);
    }
  },
  oars() {
    for (const s of [-1, 1]) {
      ctx.save();
      ctx.rotate(s * 0.6);
      gbar([[0, -104], [0, 50]], C.white, 8, 4);
      ctx.beginPath(); ctx.roundRect(-18, 40, 36, 66, 16); gshape(C.blue, 5);
      ctx.beginPath(); ctx.roundRect(-7, -108, 14, 28, 5); gfill(C.ink);
      ctx.restore();
    }
  },
  sail() {
    gpoly([[0, 44], [0, -98]], false); gstroke(C.ink, 6);
    gpoly([[8, -92], [8, 34], [80, 34]]); gshape(C.white, 5);
    gpoly([[-8, -80], [-8, 34], [-66, 34]]); gshape(C.blue, 5);
    gpoly([[-84, 46], [84, 46], [58, 76], [-58, 76]]); gshape(C.blue, 5);
    ctx.beginPath();
    for (let x = -100; x <= 100; x += 4) { const y = 92 + Math.sin(x * 0.08) * 6; x === -100 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
    gstroke(C.white, 7);
  },
  bike(t) {
    for (const s of [-1, 1]) {
      gcircle(s * 54, 30, 40); gstroke(C.ink, 12);
      gcircle(s * 54, 30, 40); gstroke(C.white, 6);
      for (let k = 0; k < 4; k++) {
        const a = (t || 0) * 3 + (k * Math.PI) / 4;
        gpoly([[s * 54 - Math.cos(a) * 36, 30 - Math.sin(a) * 36], [s * 54 + Math.cos(a) * 36, 30 + Math.sin(a) * 36]], false); gstroke('rgba(22,22,22,0.5)', 2);
      }
    }
    gpoly([[-54, 30], [-8, 30], [30, -22], [-22, -22], [-54, 30]], false); gstroke(C.blue, 9);
    gpoly([[-8, 30], [-22, -22]], false); gstroke(C.blue, 9);
    gpoly([[30, -22], [54, 30]], false); gstroke(C.blue, 9);
    ctx.beginPath(); ctx.roundRect(-40, -38, 34, 11, 5); gfill(C.ink);
    gpoly([[30, -22], [36, -44], [56, -46]], false); gstroke(C.ink, 7);
  },
  flag(t) {
    gpoly([[-72, -100], [-72, 104]], false); gstroke(C.ink, 8);
    const cols = 5, rows = 4, fw = 150, fh = 108;
    const pt = (i, j) => [-68 + (i / cols) * fw, -96 + (j / rows) * fh + Math.sin(i * 0.9 - (t || 0) * 4) * 7 * (i / cols)];
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
      gpoly([pt(i, j), pt(i + 1, j), pt(i + 1, j + 1), pt(i, j + 1)]);
      gfill((i + j) % 2 ? C.ink : C.white);
    }
    gpoly([pt(0, 0), pt(cols, 0), pt(cols, rows), pt(0, rows)]); gstroke(C.ink, 4);
  },
  mountain() {
    gpoly([[-104, 84], [-22, -70], [62, 84]]); gshape(C.blue, 6);
    gpoly([[-22, -70], [-46, -24], [-30, -32], [-18, -20], [2, -26]]); gfill(C.white);
    gpoly([[-30, 84], [44, -18], [104, 84]]); gshape(C.blueDark, 6);
    gpoly([[44, -18], [26, 8], [40, 2], [52, 12], [62, 6]]); gfill(C.white);
    gpoly([[-22, -70], [-22, -108]], false); gstroke(C.ink, 5);
    gpoly([[-20, -108], [16, -98], [-20, -88]]); gfill(C.white);
  },
  wing() {
    ctx.beginPath(); ctx.arc(0, 40, 112, Math.PI * 1.13, Math.PI * 1.87); ctx.arc(0, 40, 80, Math.PI * 1.87, Math.PI * 1.13, true); ctx.closePath();
    gshape(C.white, 6);
    for (let k = 1; k < 6; k++) {
      const a = Math.PI * (1.13 + (0.74 * k) / 6);
      gpoly([[Math.cos(a) * 80, 40 + Math.sin(a) * 80], [Math.cos(a) * 112, 40 + Math.sin(a) * 112]], false); gstroke(C.blue, k % 2 ? 6 : 3);
    }
    ctx.beginPath();
    for (const a of [1.15, 1.35, 1.65, 1.85]) { ctx.moveTo(Math.cos(Math.PI * a) * 80, 40 + Math.sin(Math.PI * a) * 80); ctx.lineTo(0, 76); }
    gstroke('rgba(22,22,22,0.6)', 2.5);
    gcircle(0, 84, 13); gshape(C.blue, 4);
  },
  compass(t) {
    gcircle(0, 0, 84); gshape(C.white, 7);
    gcircle(0, 0, 66); gstroke('rgba(22,22,22,0.25)', 3);
    for (let k = 0; k < 4; k++) {
      const b = (k * Math.PI) / 2;
      gpoly([[Math.cos(b) * 70, Math.sin(b) * 70], [Math.cos(b) * 82, Math.sin(b) * 82]], false); gstroke(C.ink, 6);
    }
    ctx.save();
    ctx.rotate(0.25 + Math.sin((t || 0) * 1.5) * 0.12);
    gpoly([[0, -60], [14, 0], [-14, 0]]); gfill(C.blue);
    gpoly([[0, 60], [14, 0], [-14, 0]]); gfill(C.ink);
    ctx.restore();
    gcircle(0, 0, 7); gfill(C.white);
  },
  target() {
    [[92, C.white], [72, C.blue], [52, C.white], [32, C.blue], [13, C.white]].forEach(([r, c]) => { gcircle(0, 0, r); gfill(c); });
    gcircle(0, 0, 92); gstroke(C.ink, 5);
    gpoly([[8, -8], [92, -92]], false); gstroke(C.ink, 7);
    gpoly([[76, -92], [98, -110], [104, -86], [92, -76]]); gfill(C.white);
    gpoly([[92, -76], [110, -98], [114, -72], [100, -62]]); gfill(C.blue);
  },
  golf() {
    ctx.beginPath(); ctx.ellipse(18, 78, 44, 13, 0, 0, Math.PI * 2); gfill(C.ink);
    gpoly([[18, 78], [18, -100]], false); gstroke(C.white, 7);
    gpoly([[20, -100], [92, -78], [20, -54]]); gshape(C.blue, 5);
    gcircle(-52, 62, 24); gshape(C.white, 5);
    for (const [x, y] of [[-58, 54], [-46, 58], [-54, 68], [-42, 70], [-62, 66]]) { gcircle(x, y, 2.4); gfill('rgba(22,22,22,0.35)'); }
  },
  eight() {
    gcircle(0, 0, 90); gfill(C.ink);
    ctx.beginPath(); ctx.arc(0, 0, 76, -2.5, -1.6); gstroke('rgba(255,255,255,0.3)', 8);
    gcircle(0, 4, 40); gfill(C.white);
    ctx.save();
    ctx.font = '900 64px Zain';
    ctx.textAlign = 'center';
    ctx.direction = 'ltr';
    ctx.fillStyle = C.ink;
    ctx.fillText('8', 0, 26);
    ctx.restore();
  },
  pin() {
    ctx.save();
    ctx.translate(30, 0);
    ctx.beginPath();
    ctx.moveTo(-16, -40);
    ctx.bezierCurveTo(-30, -60, -30, -104, 0, -104);
    ctx.bezierCurveTo(30, -104, 30, -60, 16, -40);
    ctx.bezierCurveTo(54, 4, 50, 70, 22, 100);
    ctx.lineTo(-22, 100);
    ctx.bezierCurveTo(-50, 70, -54, 4, -16, -40);
    gshape(C.white, 6);
    ctx.fillStyle = C.blue;
    ctx.fillRect(-17, -54, 34, 7); ctx.fillRect(-15, -42, 30, 7);
    ctx.restore();
    gcircle(-50, 60, 42); gshape(C.blue, 6);
    for (const [x, y] of [[-62, 46], [-46, 44], [-54, 62]]) { gcircle(x, y, 6); gfill(C.ink); }
  },
  boules() {
    for (const [x, y] of [[-42, 34], [42, 34], [0, -34]]) {
      gcircle(x, y, 42); gshape(C.blue, 5);
      ctx.beginPath(); ctx.arc(x, y, 30, -2.4, -0.9); gstroke('rgba(255,255,255,0.5)', 5);
      ctx.beginPath(); ctx.moveTo(x - 40, y + 4); ctx.quadraticCurveTo(x, y + 20, x + 40, y + 4); gstroke('rgba(255,255,255,0.35)', 3);
    }
    gcircle(70, -64, 15); gshape(C.white, 4);
  },
  stone() {
    ctx.beginPath(); ctx.roundRect(-90, -6, 180, 76, 34); gshape(C.beige2, 6);
    ctx.beginPath(); ctx.roundRect(-90, -6, 180, 20, 10); gfill(C.blue);
    ctx.beginPath(); ctx.roundRect(-90, -6, 180, 76, 34); gstroke(C.ink, 6);
    gpoly([[-26, -6], [-26, -48], [70, -48]], false); gstroke(C.ink, 22);
    gpoly([[-26, -6], [-26, -48], [70, -48]], false); gstroke(C.blue, 14);
  },
  ski() {
    for (const s of [-1, 1]) {
      ctx.save();
      ctx.rotate(s * 0.32);
      ctx.beginPath(); ctx.roundRect(-10, -86, 20, 190, 10); gshape(C.white, 5);
      ctx.beginPath(); ctx.moveTo(-10, -80); ctx.quadraticCurveTo(0, -112, 10, -80); gshape(C.blue, 4);
      ctx.restore();
    }
    for (const s of [-1, 1]) {
      gpoly([[s * -72, -90], [s * 58, 96]], false); gstroke(C.ink, 5);
      ctx.beginPath(); ctx.ellipse(s * 48, 80, 13, 5, s * -0.6, 0, Math.PI * 2); gstroke(C.ink, 4);
    }
  },
  skate() {
    gpoly([[-60, -94], [8, -94], [16, -22], [78, 0], [84, 34], [-60, 34]]); gshape(C.white, 6);
    for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(-4, -76 + k * 16); ctx.lineTo(18, -72 + k * 16); gstroke(C.ink, 4); }
    ctx.beginPath(); ctx.roundRect(-60, 26, 144, 12, 4); gfill(C.blue);
    gpoly([[-46, 38], [-46, 62]], false); gstroke(C.ink, 6);
    gpoly([[62, 38], [62, 62]], false); gstroke(C.ink, 6);
    ctx.beginPath(); ctx.moveTo(-80, 66); ctx.lineTo(80, 66); ctx.quadraticCurveTo(100, 66, 96, 50); gstroke(C.blue, 9);
  },
  horseshoe() {
    // a U, open at the top
    ctx.beginPath(); ctx.arc(0, -6, 66, -0.28, Math.PI + 0.28); gstroke(C.ink, 44);
    ctx.beginPath(); ctx.arc(0, -6, 66, -0.28, Math.PI + 0.28); gstroke(C.white, 32);
    for (let k = 0; k < 8; k++) {
      const a = -0.12 + (k / 7) * (Math.PI + 0.24);
      gcircle(Math.cos(a) * 66, -6 + Math.sin(a) * 66, 4.5); gfill(C.blue);
    }
  },
  knight() {
    ctx.save();
    ctx.font = '700 196px Pieces';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = C.white;
    ctx.fillText('♞', 0, 6);
    ctx.fillStyle = C.ink;
    ctx.fillText('♘', 0, 6);
    ctx.restore();
  },
  checker() {
    [[C.ink, 52], [C.white, 18], [C.blue, -16]].forEach(([col, y]) => {
      ctx.beginPath(); ctx.ellipse(0, y + 18, 76, 26, 0, 0, Math.PI); ctx.lineTo(-76, y); ctx.ellipse(0, y, 76, 26, 0, Math.PI, 0); ctx.closePath();
      gshape(col, 5);
      ctx.beginPath(); ctx.ellipse(0, y, 76, 26, 0, 0, Math.PI * 2); gshape(col, 5);
      ctx.beginPath(); ctx.ellipse(0, y, 52, 17, 0, 0, Math.PI * 2); gstroke(col === C.white ? C.blue : 'rgba(241,232,213,0.5)', 3);
    });
  },
  skateboard(t) {
    ctx.save();
    ctx.rotate(-0.35 + Math.sin((t || 0) * 2) * 0.04);
    ctx.beginPath(); ctx.roundRect(-104, -20, 208, 40, 20); gshape(C.blue, 6);
    ctx.beginPath(); ctx.roundRect(-84, -10, 168, 20, 10); gfill('rgba(241,232,213,0.3)');
    for (const s of [-1, 1]) {
      ctx.beginPath(); ctx.roundRect(s * 58 - 18, 20, 36, 10, 3); gfill(C.ink);
      gcircle(s * 58 - 14, 40, 13); gshape(C.white, 4);
      gcircle(s * 58 + 14, 40, 13); gshape(C.white, 4);
    }
    ctx.restore();
  },
  gamepad() {
    // the outline first, fattened, then the body on top: one clean silhouette
    const body = () => { ctx.beginPath(); ctx.roundRect(-92, -44, 184, 84, 40); ctx.moveTo(-26, 30); ctx.arc(-58, 36, 36, 0, Math.PI * 2); ctx.moveTo(94, 36); ctx.arc(58, 36, 36, 0, Math.PI * 2); };
    body(); gstroke(C.ink, 12);
    body(); gfill(C.white);
    ctx.fillStyle = C.blue;
    ctx.fillRect(-66, -14, 40, 13); ctx.fillRect(-52.5, -28, 13, 40);
    [[52, -26, C.blue], [70, -8, C.ink], [34, -8, C.ink], [52, 10, C.blue]].forEach(([x, y, c]) => { gcircle(x, y, 9); gfill(c); });
  },
  medal() {
    gpoly([[-56, -104], [-22, -104], [8, -6], [-24, -6]]); gshape(C.blue, 4);
    gpoly([[56, -104], [22, -104], [-8, -6], [24, -6]]); gshape(C.white, 4);
    gcircle(0, 40, 58); gshape(C.white, 6);
    gcircle(0, 40, 42); gstroke(C.blue, 6);
    ctx.save(); ctx.translate(0, 40); gpoly(star(24, 10)); gfill(C.blue); ctx.restore();
  },
};

// draw a sport's icon; `squash` flattens it a little when it lands
function glyph(name, x, y, s = 1, rot = 0, t = 0, squash = 1) {
  const fn = GLYPHS[name] || GLYPHS.medal;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(s * squash, s / squash);
  fn(t);
  ctx.restore();
}
