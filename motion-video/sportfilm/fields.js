// Fields, courts, tracks and boards for sportfilm.html, seen from above.
// Each FIELDS[name](variant) returns { w, h, pad, card, draw(t, s), ... }:
// w x h is the field in its own units (metres for most), pad the margin
// shown around it, card the colour of the card it sits on. draw() runs
// with the canvas already scaled to field units (s pixels per unit), lines
// in beige by default. The extra keys (goal, route, course, ...) tell the
// plays in plays.js where things are.

const FL = {
  line(x1, y1, x2, y2) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); },
  rect(x, y, w, h) { ctx.strokeRect(x, y, w, h); },
  arc(x, y, r, a0 = 0, a1 = Math.PI * 2, ccw = false) { ctx.beginPath(); ctx.arc(x, y, r, a0, a1, ccw); ctx.stroke(); },
  dot(x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); },
  fill(x, y, w, h, col) { ctx.save(); ctx.fillStyle = col; ctx.fillRect(x, y, w, h); ctx.restore(); },
  circle(x, y, r, col) { ctx.save(); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.restore(); },
  poly(pts, col) { ctx.save(); ctx.fillStyle = col; gpoly(pts); ctx.fill(); ctx.restore(); },
  // draw once, then again mirrored top to bottom
  both(h, fn) { fn(); ctx.save(); ctx.translate(0, h); ctx.scale(1, -1); fn(); ctx.restore(); },
  dashed(s, on, off, fn) { ctx.save(); ctx.setLineDash([on / s, off / s]); fn(); ctx.restore(); },
  width(s, px) { ctx.lineWidth = px / s; },
  // text in screen pixels at a point in field units
  label(s, str, x, y, px, col, alpha = 1) {
    ctx.save(); ctx.translate(x, y); ctx.scale(1 / s, 1 / s);
    text(str, 0, px * 0.36, { size: px, weight: 800, color: col, alpha });
    ctx.restore();
  },
  // alternate mowing bands
  stripes(w, h, n, col = 'rgba(0,0,0,0.055)', x0 = 0, y0 = 0) {
    ctx.save(); ctx.fillStyle = col;
    for (let i = 0; i < n; i += 2) ctx.fillRect(x0, y0 + (i * h) / n, w, h / n);
    ctx.restore();
  },
  // a goal net: frame and mesh
  net(x, y, w, h, s) {
    ctx.save();
    ctx.lineWidth = 1.2 / s;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    const step = 7 / s;
    for (let i = x; i <= x + w + 1e-6; i += step) { ctx.moveTo(i, y); ctx.lineTo(i, y + h); }
    for (let j = y; j <= y + h + 1e-6; j += step) { ctx.moveTo(x, j); ctx.lineTo(x + w, j); }
    ctx.stroke();
    ctx.restore();
    ctx.save(); ctx.lineWidth = 4 / s; ctx.strokeRect(x, y, w, h); ctx.restore();
  },
  speckle(w, h, n, col, seed, r = 0.12) {
    const rr = rand(seed);
    ctx.save(); ctx.fillStyle = col;
    for (let i = 0; i < n; i++) { ctx.beginPath(); ctx.arc(rr() * w, rr() * h, r * (0.5 + rr()), 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  },
};

// smooth a list of points into a dense polyline (Catmull-Rom)
function smooth(pts, per = 16, closed = false) {
  const out = [];
  const n = pts.length;
  const P = i => (closed ? pts[(i + n) % n] : pts[clamp(i, 0, n - 1)]);
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const [p0, p1, p2, p3] = [P(i - 1), P(i), P(i + 1), P(i + 2)];
    for (let k = 0; k < per; k++) {
      const u = k / per, u2 = u * u, u3 = u2 * u;
      out.push([0, 1].map(d => 0.5 * (2 * p1[d] + (-p0[d] + p2[d]) * u + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * u2 + (-p0[d] + 3 * p1[d] - 3 * p2[d] + p3[d]) * u3)));
    }
  }
  out.push(closed ? pts[0] : pts[n - 1]);
  return out;
}
// a polyline that can be walked by distance: at(u) for u in 0..1 gives [x, y, heading]
function walker(poly) {
  const cum = [0];
  for (let i = 1; i < poly.length; i++) cum.push(cum[i - 1] + Math.hypot(poly[i][0] - poly[i - 1][0], poly[i][1] - poly[i - 1][1]));
  const total = cum[cum.length - 1];
  return {
    poly, total,
    at(u) {
      const d = clamp(u) * total;
      let i = 1;
      while (i < cum.length - 1 && cum[i] < d) i++;
      const k = (d - cum[i - 1]) / (cum[i] - cum[i - 1] || 1);
      const [a, b] = [poly[i - 1], poly[i]];
      return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), Math.atan2(b[1] - a[1], b[0] - a[0])];
    },
    // the fraction of the way along at the point nearest to p
    near(p) {
      let best = 0, bd = 1e9;
      poly.forEach((q, i) => { const d = Math.hypot(q[0] - p[0], q[1] - p[1]); if (d < bd) { bd = d; best = cum[i] / total; } });
      return best;
    },
  };
}
// offset a polyline sideways (for lanes)
function offsetPoly(poly, d) {
  return poly.map((p, i) => {
    const a = poly[Math.max(0, i - 1)], b = poly[Math.min(poly.length - 1, i + 1)];
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    return [p[0] - Math.sin(ang) * d, p[1] + Math.cos(ang) * d];
  });
}
function strokePoly(poly, col, lw, s, dash) {
  ctx.save();
  ctx.strokeStyle = col;
  ctx.lineWidth = lw / s;
  if (dash) ctx.setLineDash(dash.map(v => v / s));
  gpoly(poly, false);
  ctx.stroke();
  ctx.restore();
}

// ---------------------------------------------------------------- team ball games
function footballPitch() {
  const w = 68, h = 105;
  return {
    w, h, pad: 3, card: C.green, goal: [w / 2, -1.1],
    draw(t, s) {
      FL.stripes(w, h, 14);
      FL.rect(0, 0, w, h);
      FL.line(0, h / 2, w, h / 2);
      FL.arc(w / 2, h / 2, 9.15);
      FL.dot(w / 2, h / 2, 0.5);
      FL.both(h, () => {
        FL.rect(w / 2 - 20.16, 0, 40.32, 16.5);
        FL.rect(w / 2 - 9.16, 0, 18.32, 5.5);
        FL.dot(w / 2, 11, 0.45);
        FL.arc(w / 2, 11, 9.15, 0.6448, Math.PI - 0.6448);
        FL.arc(0, 0, 1.2, 0, Math.PI / 2);
        FL.arc(w, 0, 1.2, Math.PI / 2, Math.PI);
        FL.net(w / 2 - 3.66, -2.2, 7.32, 2.2, s);
      });
    },
  };
}
// futsal and handball: 40 x 20 indoor courts with D-shaped areas
function hallCourt(kind) {
  const w = 20, h = 40, half = kind === 'handball' ? 1.5 : 1.58;
  const dArea = r => {
    ctx.beginPath();
    ctx.moveTo(w / 2 - half - r, 0);
    ctx.arc(w / 2 - half, 0, r, Math.PI, Math.PI / 2, true);
    ctx.lineTo(w / 2 + half, r);
    ctx.arc(w / 2 + half, 0, r, Math.PI / 2, 0, true);
  };
  return {
    w, h, pad: 1.7, card: C.blueDark, base: C.blue, goal: [w / 2, -0.5],
    draw(t, s) {
      FL.fill(0, 0, w, h, C.blue);
      ctx.save();
      ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.clip();
      FL.both(h, () => {
        if (kind === 'handball') { dArea(6); ctx.save(); ctx.fillStyle = 'rgba(16,52,70,0.45)'; ctx.fill(); ctx.restore(); }
        dArea(6); ctx.stroke();
        if (kind === 'handball') { FL.dashed(s, 12, 10, () => { dArea(9); ctx.stroke(); }); FL.line(w / 2 - 0.5, 7, w / 2 + 0.5, 7); } else { FL.dot(w / 2, 6, 0.14); FL.dot(w / 2, 10, 0.14); }
      });
      ctx.restore();
      FL.rect(0, 0, w, h);
      FL.line(0, h / 2, w, h / 2);
      FL.arc(w / 2, h / 2, 3);
      FL.dot(w / 2, h / 2, 0.15);
      FL.both(h, () => FL.net(w / 2 - 1.5, -1, 3, 1, s));
    },
  };
}
function beachPitch() {
  const w = 26, h = 36;
  return {
    w, h, pad: 2, card: C.beige2, base: C.beige2, line: C.blue, goal: [w / 2, -0.8],
    draw(t, s) {
      FL.speckle(w + 4, h + 4, 260, 'rgba(160,130,80,0.25)', 11, 0.1);
      FL.width(s, 6);
      FL.rect(0, 0, w, h);
      FL.dashed(s, 14, 12, () => FL.line(0, h / 2, w, h / 2));
      FL.both(h, () => { FL.width(s, 3); FL.dashed(s, 8, 10, () => FL.line(0, 9, w, 9)); FL.net(w / 2 - 2.75, -1.6, 5.5, 1.6, s); });
    },
  };
}
function rugbyPitch(american) {
  const w = american ? 48.8 : 70, h = american ? 109.7 : 120, end = american ? 9.14 : 10;
  return {
    w, h, pad: 3, card: C.green, goal: [w / 2, end * 0.45],
    draw(t, s) {
      FL.stripes(w, h, american ? 22 : 12);
      FL.both(h, () => FL.fill(0, 0, w, end, american ? C.blue : 'rgba(10,90,0,0.5)'));
      FL.rect(0, 0, w, h);
      if (american) {
        for (let y = end; y <= h - end + 1e-6; y += 4.572) FL.line(0, y, w, y);
        for (let y = end; y <= h - end; y += 0.9144) { FL.line(w / 2 - 3.1, y, w / 2 - 2.5, y); FL.line(w / 2 + 2.5, y, w / 2 + 3.1, y); }
        FL.both(h, () => { FL.width(s, 6); FL.line(w / 2 - 2.8, -1.2, w / 2 + 2.8, -1.2); FL.width(s, 3.4); });
      } else {
        FL.line(0, h / 2, w, h / 2);
        FL.both(h, () => {
          FL.line(0, end, w, end);
          FL.line(0, end + 22, w, end + 22);
          FL.dashed(s, 14, 12, () => { FL.line(0, h / 2 - 10, w, h / 2 - 10); FL.line(0, end + 5, w, end + 5); FL.line(5, end, 5, h / 2); FL.line(w - 5, end, w - 5, h / 2); });
          FL.width(s, 7); FL.line(w / 2 - 2.8, end, w / 2 + 2.8, end); FL.width(s, 3.4);
          FL.dot(w / 2 - 2.8, end, 0.7); FL.dot(w / 2 + 2.8, end, 0.7);
        });
      }
    },
  };
}
function hockeyPitch(polo) {
  const w = polo ? 146 : 55, h = polo ? 274 : 91.4, gw = polo ? 7.3 : 3.66;
  return {
    w, h, pad: polo ? 6 : 2.5, card: polo ? C.green : C.blueDark, base: polo ? C.green : C.blue, goal: [w / 2, -0.8],
    draw(t, s) {
      if (polo) FL.stripes(w, h, 16); else FL.fill(0, 0, w, h, C.blue);
      FL.rect(0, 0, w, h);
      FL.line(0, h / 2, w, h / 2);
      FL.both(h, () => {
        if (polo) {
          for (const d of [27.4, 36.6, 54.9]) { FL.line(w / 2 - 3, d, w / 2 + 3, d); FL.line(0, d, 3, d); FL.line(w - 3, d, w, d); }
          FL.width(s, 7); FL.dot(w / 2 - gw / 2, 0, 1.4); FL.dot(w / 2 + gw / 2, 0, 1.4); FL.width(s, 3.4);
        } else {
          FL.line(0, 22.9, w, 22.9);
          const D = r => { ctx.beginPath(); ctx.moveTo(w / 2 - gw / 2 - r, 0); ctx.arc(w / 2 - gw / 2, 0, r, Math.PI, Math.PI / 2, true); ctx.lineTo(w / 2 + gw / 2, r); ctx.arc(w / 2 + gw / 2, 0, r, Math.PI / 2, 0, true); ctx.stroke(); };
          D(14.63);
          FL.dashed(s, 10, 12, () => D(19.63));
          FL.dot(w / 2, 6.475, 0.2);
          FL.net(w / 2 - gw / 2, -1.2, gw, 1.2, s);
        }
      });
    },
  };
}

// basketball and netball
function court(kind) {
  const net = kind === 'netball';
  const w = net ? 15.25 : 15, h = net ? 30.5 : 28;
  return {
    w, h, pad: 1.6, card: C.green, base: C.blue, goal: net ? [w / 2, 0.55] : [w / 2, 1.575], hoop: true,
    draw(t, s) {
      FL.fill(0, 0, w, h, C.blue);
      if (net) {
        FL.rect(0, 0, w, h);
        FL.line(0, h / 3, w, h / 3); FL.line(0, (2 * h) / 3, w, (2 * h) / 3);
        FL.arc(w / 2, h / 2, 0.45);
        FL.both(h, () => { FL.arc(w / 2, 0, 4.9, 0, Math.PI); ctx.save(); ctx.lineWidth = 3 / s; FL.arc(w / 2, 0.55, 0.19); ctx.restore(); });
        return;
      }
      FL.both(h, () => {
        FL.fill(w / 2 - 2.45, 0, 4.9, 5.8, C.blueDark);
        FL.rect(w / 2 - 2.45, 0, 4.9, 5.8);
        FL.arc(w / 2, 5.8, 1.8, 0, Math.PI);
        FL.dashed(s, 8, 8, () => FL.arc(w / 2, 5.8, 1.8, Math.PI, Math.PI * 2));
        FL.line(0.9, 0, 0.9, 2.99); FL.line(w - 0.9, 0, w - 0.9, 2.99);
        FL.arc(w / 2, 1.575, 6.75, 0.2111, Math.PI - 0.2111);
        FL.arc(w / 2, 1.575, 1.25, 0, Math.PI);
        FL.width(s, 6); FL.line(w / 2 - 0.9, 1.2, w / 2 + 0.9, 1.2); FL.width(s, 3.4);
        FL.arc(w / 2, 1.575, 0.25);
      });
      FL.rect(0, 0, w, h);
      FL.line(0, h / 2, w, h / 2);
      FL.arc(w / 2, h / 2, 1.8);
    },
  };
}

// net and racket courts; the net runs across the middle
function netCourt(kind) {
  const K = {
    volleyball: { w: 9, h: 18, pad: 2, card: C.green, court: C.blue },
    beach: { w: 8, h: 16, pad: 2, card: C.beige2, court: null, line: C.blue, sand: true },
    tennis: { w: 10.97, h: 23.77, pad: 3, card: C.green, court: C.blue },
    badminton: { w: 6.1, h: 13.4, pad: 1.2, card: C.blueDark, court: C.green },
    squash: { w: 6.4, h: 9.75, pad: 0.6, card: C.blueDark, court: C.beige2, line: C.blue, wall: true },
    padel: { w: 10, h: 20, pad: 0.8, card: C.blueDark, court: C.blue },
    pickleball: { w: 6.1, h: 13.41, pad: 1.2, card: C.green, court: C.blue },
    sitting: { w: 6, h: 10, pad: 1.5, card: C.green, court: C.blue },
  }[kind || 'volleyball'];
  const { w, h } = K;
  return {
    w, h, pad: K.pad, card: K.card, base: K.court || K.card, line: K.line, netY: K.wall ? null : h / 2, wall: K.wall,
    draw(t, s) {
      if (K.sand) FL.speckle(w + 4, h + 4, 220, 'rgba(160,130,80,0.25)', 5, 0.05);
      if (K.court) FL.fill(0, 0, w, h, K.court);
      if (kind === 'pickleball') FL.fill(0, h / 2 - 2.13, w, 4.26, C.green);
      if (kind === 'beach') FL.width(s, 7);
      FL.rect(0, 0, w, h);
      if (kind === 'volleyball' || !kind) { FL.line(0, h / 2 - 3, w, h / 2 - 3); FL.line(0, h / 2 + 3, w, h / 2 + 3); }
      if (kind === 'sitting') { FL.line(0, h / 2 - 2, w, h / 2 - 2); FL.line(0, h / 2 + 2, w, h / 2 + 2); }
      if (kind === 'tennis') {
        FL.line(1.37, 0, 1.37, h); FL.line(w - 1.37, 0, w - 1.37, h);
        FL.line(1.37, h / 2 - 6.4, w - 1.37, h / 2 - 6.4); FL.line(1.37, h / 2 + 6.4, w - 1.37, h / 2 + 6.4);
        FL.line(w / 2, h / 2 - 6.4, w / 2, h / 2 + 6.4);
        FL.line(w / 2, 0, w / 2, 0.3); FL.line(w / 2, h - 0.3, w / 2, h);
      }
      if (kind === 'badminton') {
        FL.line(0.46, 0, 0.46, h); FL.line(w - 0.46, 0, w - 0.46, h);
        FL.both(h, () => { FL.line(0, h / 2 - 1.98, w, h / 2 - 1.98); FL.line(0, 0.76, w, 0.76); FL.line(w / 2, 0, w / 2, h / 2 - 1.98); });
      }
      if (kind === 'pickleball') FL.both(h, () => { FL.line(0, h / 2 - 2.13, w, h / 2 - 2.13); FL.line(w / 2, 0, w / 2, h / 2 - 2.13); });
      if (kind === 'padel') {
        FL.both(h, () => { FL.line(0, h / 2 - 6.95, w, h / 2 - 6.95); FL.line(w / 2, h / 2 - 6.95, w / 2, h / 2); });
        ctx.save(); ctx.strokeStyle = 'rgba(248,243,231,0.55)'; ctx.lineWidth = 10 / s;
        FL.both(h, () => { ctx.beginPath(); ctx.moveTo(0, 4); ctx.lineTo(0, 0); ctx.lineTo(w, 0); ctx.lineTo(w, 4); ctx.stroke(); });
        ctx.restore();
      }
      if (kind === 'squash') {
        FL.line(0, 4.26, w, 4.26);
        FL.line(w / 2, 4.26, w / 2, h);
        FL.rect(0, 4.26, 1.6, 1.6); FL.rect(w - 1.6, 4.26, 1.6, 1.6);
        ctx.save(); ctx.strokeStyle = C.ink; ctx.lineWidth = 12 / s; FL.line(-0.3, 0, w + 0.3, 0); ctx.restore();
        return;
      }
      // the net, with its posts
      const ext = kind === 'tennis' ? 0.91 : 0.5;
      ctx.save();
      ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 9 / s; FL.line(-ext, h / 2 + 5 / s, w + ext, h / 2 + 5 / s);
      ctx.strokeStyle = C.white; ctx.lineWidth = 7 / s; FL.line(-ext, h / 2, w + ext, h / 2);
      ctx.fillStyle = C.ink; FL.dot(-ext, h / 2, 6 / s); FL.dot(w + ext, h / 2, 6 / s);
      ctx.restore();
    },
  };
}

function tableField(kind) {
  if (kind === 'billiard') {
    const w = 1.27, h = 2.54;
    return {
      w, h, pad: 0.17, card: C.blue,
      pockets: [[0, 0], [w, 0], [0, h / 2], [w, h / 2], [0, h], [w, h]],
      draw(t, s) {
        ctx.save(); ctx.fillStyle = C.blueDark; ctx.beginPath(); ctx.roundRect(-0.11, -0.11, w + 0.22, h + 0.22, 0.08); ctx.fill(); ctx.restore();
        FL.fill(0, 0, w, h, C.green);
        FL.width(s, 2.5);
        FL.line(0, h * 0.75, w, h * 0.75);
        FL.arc(w / 2, h * 0.75, 0.29, 0, Math.PI);
        FL.dot(w / 2, h * 0.25, 0.012);
        for (let i = 1; i < 4; i++) { FL.dot((w * i) / 4, -0.06, 0.012); FL.dot((w * i) / 4, h + 0.06, 0.012); }
        for (let i = 1; i < 8; i++) if (i !== 4) { FL.dot(-0.06, (h * i) / 8, 0.012); FL.dot(w + 0.06, (h * i) / 8, 0.012); }
        for (const [x, y] of this.pockets) FL.circle(x, y, 0.065, C.ink);
      },
    };
  }
  const w = 1.525, h = 2.74;
  return {
    w, h, pad: 0.55, card: C.green, base: C.blue, netY: h / 2,
    draw(t, s) {
      ctx.save(); ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillRect(0.03, 0.04, w, h); ctx.restore();
      FL.fill(0, 0, w, h, C.blue);
      FL.width(s, 6); FL.rect(0, 0, w, h);
      FL.width(s, 2.5); FL.line(w / 2, 0, w / 2, h);
      ctx.save();
      ctx.strokeStyle = C.white; ctx.lineWidth = 7 / s; FL.line(-0.1525, h / 2, w + 0.1525, h / 2);
      ctx.fillStyle = C.ink; FL.dot(-0.1525, h / 2, 6 / s); FL.dot(w + 0.1525, h / 2, 6 / s);
      ctx.restore();
    },
  };
}

function diamondField() {
  const w = 116, h = 98, home = [58, 92], R = 80, B = 27.43;
  const d = B / Math.SQRT2;
  const first = [home[0] + d, home[1] - d], second = [home[0], home[1] - 2 * d], third = [home[0] - d, home[1] - d];
  const mound = [home[0], home[1] - 18.44];
  return {
    w, h, pad: 0, card: C.greenDark, home, first, second, third, mound, deep: [36, 26],
    outfield: [[30, 36], [58, 22], [86, 36]],
    draw(t, s) {
      const fan = () => { ctx.beginPath(); ctx.moveTo(...home); ctx.arc(home[0], home[1], R, -Math.PI * 0.75, -Math.PI * 0.25); ctx.closePath(); };
      ctx.save();
      fan(); ctx.fillStyle = C.green; ctx.fill(); ctx.clip();
      for (let r = 10; r < R; r += 16) { ctx.beginPath(); ctx.arc(home[0], home[1], r + 8, 0, Math.PI * 2); ctx.arc(home[0], home[1], r, 0, Math.PI * 2, true); ctx.fillStyle = 'rgba(0,0,0,0.05)'; ctx.fill(); }
      ctx.beginPath(); ctx.arc(home[0], home[1], R, 0, Math.PI * 2); ctx.arc(home[0], home[1], R - 4, 0, Math.PI * 2, true); ctx.fillStyle = C.beige2; ctx.fill();
      ctx.beginPath(); ctx.arc(mound[0], mound[1], 29, 0, Math.PI * 2); ctx.fillStyle = C.beige2; ctx.fill();
      ctx.restore();
      // infield grass inside the base paths
      const k = 0.78, c = [home[0], home[1] - d];
      FL.poly([home, first, second, third].map(p => [c[0] + (p[0] - c[0]) * k, c[1] + (p[1] - c[1]) * k + 1.5]), C.green);
      FL.circle(mound[0], mound[1], 2.8, C.beige2);
      FL.circle(home[0], home[1], 4.2, C.beige2);
      FL.width(s, 3.4);
      FL.line(...home, home[0] - R * 0.7071, home[1] - R * 0.7071);
      FL.line(...home, home[0] + R * 0.7071, home[1] - R * 0.7071);
      FL.rect(home[0] - 2.6, home[1] - 1, 1.2, 2); FL.rect(home[0] + 1.4, home[1] - 1, 1.2, 2);
      ctx.save();
      ctx.fillStyle = C.white;
      for (const p of [first, second, third]) { ctx.save(); ctx.translate(...p); ctx.rotate(Math.PI / 4); ctx.fillRect(-0.9, -0.9, 1.8, 1.8); ctx.restore(); }
      gpoly([[home[0] - 0.9, home[1] - 0.9], [home[0] + 0.9, home[1] - 0.9], [home[0] + 0.9, home[1]], [home[0], home[1] + 0.9], [home[0] - 0.9, home[1]]]); ctx.fill();
      ctx.fillRect(mound[0] - 0.6, mound[1] - 0.15, 1.2, 0.3);
      ctx.restore();
    },
  };
}

function ovalField() {
  const w = 130, h = 150, c = [65, 75];
  return {
    w, h, pad: 0, card: C.greenDark, bat: [65, 65.6], bowl: [65, 84.4], center: c,
    draw(t, s) {
      for (let k = 0; k < 9; k++) {
        ctx.beginPath(); ctx.ellipse(...c, 63 - k * 7, 73 - k * 8.1, 0, 0, Math.PI * 2);
        ctx.fillStyle = k % 2 ? C.green : '#139f02'; ctx.fill();
      }
      FL.width(s, 5); ctx.beginPath(); ctx.ellipse(...c, 63, 73, 0, 0, Math.PI * 2); ctx.stroke();
      FL.width(s, 3); FL.dashed(s, 10, 10, () => { ctx.beginPath(); ctx.ellipse(...c, 27.4, 37.5, 0, 0, Math.PI * 2); ctx.stroke(); });
      FL.fill(c[0] - 1.6, c[1] - 11, 3.2, 22, C.beige2);
      for (const sy of [-1, 1]) {
        FL.line(c[0] - 1.6, c[1] + sy * 8.84, c[0] + 1.6, c[1] + sy * 8.84);
        FL.line(c[0] - 1.3, c[1] + sy * 10.06, c[0] + 1.3, c[1] + sy * 10.06);
        for (const dx of [-0.25, 0, 0.25]) FL.circle(c[0] + dx, c[1] + sy * 10.06, 0.16, C.ink);
      }
    },
  };
}

// ---------------------------------------------------------------- combat
function ringField(kind) {
  if (kind === 'cage') {
    const w = 9.2, h = 9.2, r = 4.6;
    const oct = Array.from({ length: 8 }, (_, k) => [w / 2 + r * Math.cos(Math.PI / 8 + (k * Math.PI) / 4), h / 2 + r * Math.sin(Math.PI / 8 + (k * Math.PI) / 4)]);
    return {
      w, h, pad: 0.8, card: C.blueDark, base: C.card, center: [w / 2, h / 2], R: 3.4,
      draw(t, s) {
        FL.poly(oct, C.card);
        FL.circle(w / 2, h / 2, 1.6, 'rgba(31,95,125,0.18)');
        ctx.save(); ctx.strokeStyle = C.ink; ctx.lineWidth = 8 / s; gpoly(oct); ctx.stroke(); ctx.restore();
        ctx.save(); ctx.fillStyle = C.ink; oct.forEach(p => FL.dot(...p, 0.16)); ctx.restore();
      },
    };
  }
  const w = 7.3, h = 7.3;
  return {
    w, h, pad: 1.4, card: C.blueDark, base: C.blue, center: [w / 2, h / 2], R: 2.6,
    draw(t, s) {
      FL.fill(-0.6, -0.6, w + 1.2, h + 1.2, C.blue);
      FL.circle(w / 2, h / 2, 1.5, 'rgba(241,232,213,0.12)');
      for (const [o, col] of [[0, C.white], [0.12, C.beige], [0.24, C.white]]) {
        ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 6 / s; ctx.strokeRect(o, o, w - 2 * o, h - 2 * o); ctx.restore();
      }
      [[0, 0, C.green], [w, 0, C.white], [w, h, C.blueLight], [0, h, C.white]].forEach(([x, y, col]) => {
        FL.circle(x, y, 0.3, C.ink); FL.circle(x, y, 0.22, col);
      });
    },
  };
}
function matField(kind) {
  const sq = (w, card) => ({ w, h: w, pad: 0.5, card, center: [w / 2, w / 2] });
  if (kind === 'judo') return { ...sq(14, C.blueDark), base: C.green, R: 3.2, draw(t, s) {
    FL.fill(0, 0, 14, 14, C.blue); FL.fill(3, 3, 8, 8, C.green); FL.rect(3, 3, 8, 8);
    ctx.save(); ctx.lineWidth = 8 / s; ctx.strokeStyle = C.white; FL.line(5, 6.7, 5, 7.3); ctx.strokeStyle = C.blueLight; FL.line(9, 6.7, 9, 7.3); ctx.restore();
  } };
  if (kind === 'karate') return { ...sq(10, C.blueDark), base: C.blue, R: 3, draw(t, s) {
    FL.fill(0, 0, 10, 10, C.green); FL.fill(1, 1, 8, 8, C.blue); FL.rect(1, 1, 8, 8);
    FL.width(s, 5); FL.line(4.75, 3.5, 5.25, 3.5); FL.line(4.75, 6.5, 5.25, 6.5); FL.line(4.6, 2.2, 5.4, 2.2);
  } };
  if (kind === 'taekwondo') return { ...sq(10, C.blueDark), base: C.green, R: 2.8, draw(t, s) {
    FL.fill(0, 0, 10, 10, C.blue);
    const oct = Array.from({ length: 8 }, (_, k) => [5 + 4.33 * Math.cos(Math.PI / 8 + (k * Math.PI) / 4), 5 + 4.33 * Math.sin(Math.PI / 8 + (k * Math.PI) / 4)]);
    FL.poly(oct, C.green); gpoly(oct); ctx.stroke();
    FL.dot(5, 5, 0.08);
  } };
  if (kind === 'sumo') return { ...sq(6.7, C.blue), base: C.beige2, R: 1.5, draw(t, s) {
    FL.fill(0, 0, 6.7, 6.7, C.beige2);
    FL.speckle(6.7, 6.7, 200, 'rgba(150,120,70,0.25)', 8, 0.025);
    ctx.save(); ctx.strokeStyle = C.ink; ctx.lineWidth = 18 / s; FL.arc(3.35, 3.35, 2.42); ctx.strokeStyle = C.card; ctx.lineWidth = 13 / s; FL.arc(3.35, 3.35, 2.42); ctx.restore();
    ctx.save(); ctx.fillStyle = C.white; ctx.fillRect(2.95, 2.9, 0.06, 0.9); ctx.fillRect(3.69, 2.9, 0.06, 0.9); ctx.restore();
  } };
  if (kind === 'gym') return { ...sq(14, C.green), base: C.blue, R: 4, draw(t, s) {
    FL.fill(0, 0, 14, 14, C.blue); FL.width(s, 5); FL.rect(1, 1, 12, 12);
    FL.stripes(14, 14, 14, 'rgba(255,255,255,0.03)');
  } };
  if (kind === 'kabaddi') return { w: 10, h: 13, pad: 0.6, card: C.blueDark, base: C.blue, center: [5, 6.5], R: 2.6, draw(t, s) {
    FL.fill(0, 0, 10, 13, C.blue); FL.fill(0, 0, 1, 13, C.green); FL.fill(9, 0, 1, 13, C.green);
    FL.rect(0, 0, 10, 13); FL.line(0, 6.5, 10, 6.5);
    FL.both(13, () => { FL.line(1, 6.5 - 3.75, 9, 6.5 - 3.75); FL.dashed(s, 8, 8, () => FL.line(1, 6.5 - 4.75, 9, 6.5 - 4.75)); });
  } };
  // wrestling: a circle inside a square
  return { ...sq(12, C.blueDark), base: C.blue, R: 2.6, draw(t, s) {
    FL.fill(0, 0, 12, 12, C.blue);
    FL.circle(6, 6, 4.5, C.green);
    FL.circle(6, 6, 3.5, C.blue);
    FL.arc(6, 6, 4.5);
    FL.arc(6, 6, 0.5);
  } };
}
function pisteField() {
  const w = 4, h = 16;
  return {
    w, h, pad: 1, card: C.blueDark, base: C.beige2, center: [w / 2, h / 2], line: C.ink,
    draw(t, s) {
      FL.fill(0, 0, w, h, C.beige2);
      FL.both(h, () => FL.fill(0, 0, w, 2, 'rgba(31,95,125,0.35)'));
      FL.width(s, 3);
      FL.rect(0, 0, w, h);
      FL.line(0, h / 2, w, h / 2);
      FL.both(h, () => { FL.line(0, h / 2 - 2, w, h / 2 - 2); FL.line(0, 2, w, 2); });
    },
  };
}

// ---------------------------------------------------------------- racing
function stadium(cx, top, bot, r) {
  ctx.beginPath();
  ctx.moveTo(cx + r, top);
  ctx.lineTo(cx + r, bot);
  ctx.arc(cx, bot, r, 0, Math.PI);
  ctx.lineTo(cx - r, top);
  ctx.arc(cx, top, r, Math.PI, Math.PI * 2);
  ctx.closePath();
}
// one lap, anticlockwise as seen from above, starting at the top of the right straight
function stadiumLap(cx, top, bot, r) {
  const pts = [];
  for (let k = 0; k <= 24; k++) { const a = -(k / 24) * Math.PI; pts.push([cx + Math.cos(a) * r, top + Math.sin(a) * r]); }
  pts.push([cx - r, bot]);
  for (let k = 0; k <= 24; k++) { const a = Math.PI - (k / 24) * Math.PI; pts.push([cx + Math.cos(a) * r, bot + Math.sin(a) * r]); }
  pts.push([cx + r, top]);
  return pts;
}
function trackField(kind) {
  const K = {
    athletics: { L: 84.39, r0: 36.5, lane: 1.22, n: 8, band: C.blue, inner: C.green, card: C.green },
    hurdles: { L: 84.39, r0: 36.5, lane: 1.22, n: 8, band: C.blue, inner: C.green, card: C.green },
    velodrome: { L: 40, r0: 21, lane: 1.4, n: 5, band: C.beige2, inner: C.blue, card: C.blueDark },
    ice: { L: 112, r0: 26, lane: 4, n: 2, band: C.white, inner: C.blue, card: C.blueDark },
    turf: { L: 100, r0: 30, lane: 2, n: 6, band: '#1aa80a', inner: C.greenDark, card: C.greenDeep },
  }[kind || 'athletics'];
  const r8 = K.r0 + K.n * K.lane, w = 2 * r8, h = K.L + 2 * r8, cx = w / 2, top = r8, bot = r8 + K.L;
  return {
    w, h, pad: 2, card: K.card,
    route: lane => stadiumLap(cx, top, bot, K.r0 + (lane + 0.5) * K.lane),
    lanes: K.n,
    draw(t, s) {
      stadium(cx, top, bot, r8); ctx.save(); ctx.fillStyle = K.band; ctx.fill(); ctx.restore();
      stadium(cx, top, bot, K.r0); ctx.save(); ctx.fillStyle = K.inner; ctx.fill(); ctx.restore();
      if (kind === 'velodrome') {
        stadium(cx, top, bot, K.r0 + 0.9); ctx.save(); ctx.fillStyle = C.blueLight; ctx.fill(); ctx.restore();
        stadium(cx, top, bot, K.r0); ctx.save(); ctx.fillStyle = K.inner; ctx.fill(); ctx.restore();
        [[1.1, C.ink], [1.9, C.green], [3.6, C.blue]].forEach(([d, col]) => { ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 3 / s; stadium(cx, top, bot, K.r0 + d); ctx.stroke(); ctx.restore(); });
      } else if (kind === 'ice') {
        ctx.save(); ctx.fillStyle = C.blueLight; for (let k = 0; k < 60; k++) { const p = stadiumLap(cx, top, bot, K.r0 + K.lane); const q = p[Math.floor((k / 60) * p.length)]; ctx.beginPath(); ctx.arc(q[0], q[1], 0.5, 0, Math.PI * 2); ctx.fill(); } ctx.restore();
      } else {
        ctx.save();
        ctx.lineWidth = (kind === 'turf' ? 5 : 2) / s;
        ctx.strokeStyle = kind === 'turf' ? C.white : 'rgba(248,243,231,0.85)';
        for (let i = kind === 'turf' ? 0 : 0; i <= K.n; i += kind === 'turf' ? K.n : 1) { stadium(cx, top, bot, K.r0 + i * K.lane); ctx.stroke(); }
        ctx.restore();
      }
      if (kind === 'hurdles') {
        ctx.save(); ctx.strokeStyle = C.white; ctx.lineWidth = 4 / s;
        for (let k = 0; k < 6; k++) { const y = top + 8 + k * 12; for (let i = 0; i < K.n; i++) FL.line(cx - K.r0 - i * K.lane - 0.2, y, cx - K.r0 - (i + 1) * K.lane + 0.2, y); }
        ctx.restore();
      }
      if (!kind || kind === 'hurdles') {
        // a faint football pitch in the infield
        ctx.save(); ctx.globalAlpha = 0.35; ctx.lineWidth = 2 / s;
        FL.rect(cx - 30, top + 6, 60, K.L - 12); FL.line(cx - 30, (top + bot) / 2, cx + 30, (top + bot) / 2); FL.arc(cx, (top + bot) / 2, 7);
        ctx.restore();
      }
      // the finish line
      ctx.save(); ctx.strokeStyle = kind === 'ice' || kind === 'velodrome' ? C.ink : C.white; ctx.lineWidth = 6 / s;
      FL.line(cx + K.r0, top, cx + r8, top);
      ctx.restore();
    },
  };
}
function roadField(kind) {
  const w = 100, h = 150;
  const paths = {
    road: [[22, 162], [20, 132], [64, 116], [80, 92], [34, 78], [20, 54], [60, 40], [80, 18], [56, -12]],
    rally: [[80, 162], [76, 134], [30, 122], [18, 96], [56, 84], [82, 60], [44, 44], [20, 22], [40, -12]],
    map: [[20, 140], [78, 122], [40, 96], [76, 70], [26, 52], [70, 30], [36, 12]],
    ice: [[50, -10], [30, 16], [70, 38], [74, 62], [28, 76], [26, 104], [70, 120], [56, 160]],
    circuit: [[18, 132], [70, 136], [86, 120], [64, 100], [84, 76], [86, 26], [64, 12], [44, 30], [18, 28], [12, 70], [32, 92], [14, 112]],
  };
  const k = kind || 'road';
  const closed = k === 'circuit';
  const centre = k === 'map' ? paths.map : smooth(paths[k], 14, closed);
  return {
    w, h, pad: 0, card: k === 'map' ? C.card : k === 'ice' ? C.blueLight : C.green,
    route: lane => offsetPoly(centre, (lane - 1.5) * (k === 'map' ? 0.8 : 2.2)),
    lanes: 4, closed, map: k === 'map',
    draw(t, s) {
      const rr = rand(31);
      if (k === 'map') {
        // contour lines and lakes, like an orienteering map
        ctx.save();
        for (let i = 0; i < 9; i++) {
          const cx = rr() * w, cy = rr() * h;
          for (let j = 1; j < 5; j++) {
            ctx.beginPath(); ctx.ellipse(cx, cy, j * (4 + rr() * 4), j * (3 + rr() * 3), rr() * 3, 0, Math.PI * 2);
            ctx.strokeStyle = i % 3 ? 'rgba(14,122,1,0.35)' : 'rgba(31,95,125,0.35)'; ctx.lineWidth = 2 / s; ctx.stroke();
          }
        }
        ctx.fillStyle = 'rgba(31,95,125,0.35)'; ctx.beginPath(); ctx.ellipse(78, 100, 10, 6, 0.4, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
        strokePoly(centre, C.blue, 4, s);
        centre.forEach((p, i) => {
          ctx.save(); ctx.strokeStyle = C.blue; ctx.lineWidth = 5 / s;
          if (i === 0) { gpoly([[p[0], p[1] - 4], [p[0] + 3.5, p[1] + 2.5], [p[0] - 3.5, p[1] + 2.5]]); ctx.stroke(); }
          else { FL.arc(p[0], p[1], 3.2); if (i < centre.length - 1) FL.label(s, kd(i), p[0] + 6, p[1] - 4, 30, C.blue); else FL.arc(p[0], p[1], 2.2); }
          ctx.restore();
        });
        return;
      }
      // hills and trees
      for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.ellipse(rr() * w, rr() * h, 18 + rr() * 16, 10 + rr() * 10, rr(), 0, Math.PI * 2); ctx.fillStyle = k === 'ice' ? 'rgba(255,255,255,0.45)' : 'rgba(10,90,0,0.22)'; ctx.fill(); }
      for (let i = 0; i < 46; i++) {
        const x = rr() * w, y = rr() * h;
        if (k === 'ice') { FL.poly([[x, y - 3.5], [x + 2.2, y + 1.5], [x - 2.2, y + 1.5]], C.green); continue; }
        FL.circle(x + 0.6, y + 0.6, 2.2, 'rgba(0,0,0,0.15)'); FL.circle(x, y, 2.2, C.greenDeep);
      }
      if (k === 'circuit') {
        strokePoly([...centre], C.white, 112, s);
        strokePoly([...centre], C.green, 104, s, [16, 16]);
        strokePoly([...centre], C.blueDark, 92, s);
        // start grid
        const p = walker(centre).at(0.01);
        ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(p[2] + Math.PI / 2);
        for (let i = -4; i <= 4; i++) for (let j = 0; j < 2; j++) FL.fill(i * 1.1 - 0.55, j * 1.1 - 1.1, 1.1, 1.1, (i + j) % 2 ? C.ink : C.white);
        ctx.restore();
      } else if (k === 'ice') {
        strokePoly(centre, C.blue, 92, s);
        strokePoly(centre, C.white, 76, s);
      } else {
        strokePoly(centre, 'rgba(0,0,0,0.15)', 100, s);
        strokePoly(centre, C.beige2, 92, s);
        if (k === 'road') { strokePoly(centre, C.white, 3, s); strokePoly(centre, C.beige2, 84, s); strokePoly(centre, C.blue, 4, s, [16, 14]); }
        else { FL.speckle(w, h, 0, C.ink, 1); }
      }
    },
  };
}
function poolField(kind) {
  if (kind === 'waterpolo') {
    const w = 20, h = 30;
    return {
      w, h, pad: 1.4, card: C.beige2, base: C.blue, goal: [w / 2, 0.45],
      draw(t, s) {
        FL.fill(0, 0, w, h, C.blue);
        waves(w, h, t, s);
        FL.dashed(s, 6, 10, () => FL.rect(0, 0, w, h));
        FL.both(h, () => {
          [[2, C.green], [5, C.beige], [h / 2, C.white]].forEach(([d, col]) => { ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 9 / s; FL.line(-0.6, d, 0.2, d); FL.line(w - 0.2, d, w + 0.6, d); ctx.restore(); });
          FL.net(w / 2 - 1.5, -0.6, 3, 0.9, s);
        });
      },
    };
  }
  const w = 25, h = kind === 'diving' ? 25 : 50;
  return {
    w, h, pad: 1.8, card: C.beige2, lanes: 10,
    route: lane => {
      // four lengths in a lane: up, down, up, down
      const x = 2.5 * (lane + 3) + 1.25, pts = [];
      for (let k = 0; k < 4; k++) pts.push([x, k % 2 ? 1.2 : h - 1.2], [x, k % 2 ? h - 1.2 : 1.2]);
      return pts.filter((p, i) => i === 0 || p[1] !== pts[i - 1][1]);
    },
    turns: [0.25, 0.5, 0.75],
    draw(t, s) {
      FL.fill(0, 0, w, h, C.blue);
      waves(w, h, t, s);
      if (kind === 'diving') {
        [[4, 3], [9, 3], [17, 5]].forEach(([x, len]) => { FL.fill(x, h - len, 2.2, len + 1.8, C.white); FL.rect(x, h - len, 2.2, len + 1.8); });
        return;
      }
      ctx.save();
      ctx.globalAlpha = 0.55;
      for (let i = 0; i < 10; i++) { ctx.fillStyle = C.ink; ctx.fillRect(1.25 + i * 2.5 - 0.12, 2, 0.24, h - 4); ctx.fillRect(1.25 + i * 2.5 - 0.5, 2, 1, 0.24); ctx.fillRect(1.25 + i * 2.5 - 0.5, h - 2.24, 1, 0.24); }
      ctx.restore();
      for (let i = 1; i < 10; i++) {
        ctx.save(); ctx.lineWidth = 7 / s; ctx.lineCap = 'butt';
        ctx.strokeStyle = C.beige; ctx.setLineDash([0.4, 0.4]); FL.line(i * 2.5, 0, i * 2.5, h);
        ctx.strokeStyle = C.green; ctx.lineDashOffset = 0.4; FL.line(i * 2.5, 0, i * 2.5, h);
        ctx.restore();
      }
      FL.dashed(s, 4, 8, () => { FL.line(0, 5, w, 5); FL.line(0, h - 5, w, h - 5); });
    },
  };
}
// little wave marks drifting across water
function waves(w, h, t, s, n = 34, col = 'rgba(248,243,231,0.22)') {
  const rr = rand(77);
  ctx.save();
  ctx.strokeStyle = col;
  ctx.lineWidth = 3 / s;
  for (let i = 0; i < n; i++) {
    const x = (rr() * w + t * 0.4 * (1 + rr())) % w, y = rr() * h, l = Math.max(w, h) * 0.03;
    ctx.beginPath(); ctx.arc(x, y, l, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();
  }
  ctx.restore();
}
function waterField(kind) {
  const w = 60, h = 120;
  if (kind === 'surf') {
    return {
      w, h, pad: 0, card: C.blue,
      course: { pts: smooth([[8, 20], [50, 34], [16, 50], [54, 62], [18, 76], [52, 88], [30, 100]], 12), hops: false },
      draw(t, s) {
        FL.fill(0, 0, w, h, C.blueDark);
        for (let k = 0; k < 6; k++) {
          const y = ((k * 22 + t * 4) % 132) - 12;
          ctx.save(); ctx.fillStyle = k % 2 ? C.blue : '#246c8c'; ctx.beginPath(); ctx.moveTo(0, y); for (let x = 0; x <= w; x += 2) ctx.lineTo(x, y + Math.sin(x * 0.12 + k) * 2.5); ctx.lineTo(w, y + 22); ctx.lineTo(0, y + 22); ctx.fill();
          ctx.strokeStyle = C.white; ctx.lineWidth = 6 / s; ctx.beginPath(); for (let x = 0; x <= w; x += 2) { const yy = y + Math.sin(x * 0.12 + k) * 2.5; x ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); } ctx.stroke();
          ctx.restore();
        }
        ctx.save(); ctx.fillStyle = C.beige2; ctx.beginPath(); ctx.moveTo(0, 108); for (let x = 0; x <= w; x += 2) ctx.lineTo(x, 108 + Math.sin(x * 0.2) * 1.5); ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.fill(); ctx.restore();
      },
    };
  }
  return {
    w, h, pad: 0, card: C.blue, lanes: 4,
    route: lane => [[12 + lane * 12, 112], [12 + lane * 12, 6]],
    draw(t, s) {
      waves(w, h, t, s, 70);
      ctx.save();
      for (let i = 0; i <= 4; i++) {
        const x = 6 + i * 12;
        for (let y = 2; y < h - 2; y += 3) { ctx.fillStyle = (y / 3) % 5 < 1 ? C.green : C.beige; ctx.beginPath(); ctx.arc(x, y, 0.45, 0, Math.PI * 2); ctx.fill(); }
      }
      ctx.restore();
      for (let i = 0; i < 4; i++) FL.fill(8 + i * 12, 113, 8, 3, C.white);
      ctx.save(); ctx.strokeStyle = C.white; ctx.lineWidth = 5 / s; ctx.setLineDash([1, 1]); FL.line(6, 6, 54, 6); ctx.restore();
    },
  };
}

// ---------------------------------------------------------------- mountains, walls, parks
function mountainField(kind) {
  const w = 100, h = 130, k = kind || 'rock';
  const climbPts = [[16, 124], [38, 106], [24, 92], [46, 78], [34, 62], [52, 48], [46, 34], [58, 20]];
  const ski = [[54, 6], [30, 24], [66, 40], [30, 58], [68, 74], [32, 92], [62, 108], [46, 128]];
  const fly = [[10, 12], [60, 22], [80, 44], [36, 54], [22, 76], [64, 84], [76, 104], [70, 118]];
  return {
    w, h, pad: 0, card: kind === 'snow' ? C.blueLight : C.card,
    climb: climbPts,
    course: kind === 'snow' ? { pts: smooth(ski, 12), gates: true } : kind === 'sky' ? { pts: smooth(fly, 12), fly: true } : null,
    draw(t, s) {
      const rr = rand(5);
      // clouds
      for (let i = 0; i < 5; i++) {
        const x = ((rr() * 140 + t * (0.6 + i * 0.15)) % 140) - 20, y = 8 + rr() * (k === 'sky' ? 90 : 30);
        ctx.save(); ctx.fillStyle = kind === 'snow' ? 'rgba(255,255,255,0.55)' : 'rgba(229,215,186,0.85)';
        ctx.beginPath(); ctx.ellipse(x, y, 10, 3.4, 0, 0, Math.PI * 2); ctx.ellipse(x + 5, y - 2.2, 6, 3.4, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
      if (k === 'snow') {
        FL.poly([[-10, 140], [-10, 30], [50, -4], [110, 30], [110, 140]], C.white);
        FL.poly([[50, -4], [110, 30], [110, 140], [70, 140], [62, 60]], 'rgba(127,168,187,0.35)');
        for (let i = 0; i < 40; i++) {
          const x = rr() * w, y = 20 + rr() * 110;
          if (Math.abs(x - 50) < 26) continue;
          FL.poly([[x, y - 4], [x + 2.4, y + 1.6], [x - 2.4, y + 1.6]], C.greenDark);
        }
        return;
      }
      const back = k === 'sky' ? 92 : 50;
      FL.poly([[-10, 140], [-10, back + 20], [18, back], [40, back + 16], [70, back - 8], [110, back + 22], [110, 140]], C.blueLight);
      if (k === 'sky') {
        FL.poly([[-10, 140], [-10, 110], [30, 98], [60, 112], [110, 100], [110, 140]], C.green);
        FL.circle(70, 118, 5, 'rgba(241,232,213,0.9)'); FL.circle(70, 118, 3, C.green); FL.circle(70, 118, 1.2, C.white);
        return;
      }
      FL.poly([[-10, 140], [10, 96], [58, 16], [100, 90], [110, 140]], C.blue);
      FL.poly([[58, 16], [46, 36], [52, 34], [58, 40], [64, 32], [70, 36]], C.white);
      FL.poly([[58, 16], [100, 90], [110, 140], [76, 140], [66, 60]], 'rgba(23,74,98,0.55)');
      FL.poly([[-10, 140], [-10, 112], [24, 100], [56, 118], [86, 106], [110, 116], [110, 140]], C.green);
      FL.poly([[-10, 140], [-10, 124], [30, 116], [70, 130], [110, 122], [110, 140]], C.greenDark);
    },
  };
}
function wallField() {
  const w = 40, h = 60;
  return {
    w, h, pad: 1, card: C.blueDark,
    climb: [[20, 57], [13, 49], [24, 41], [14, 33], [26, 25], [16, 17], [25, 9], [20, 2.5]],
    draw(t, s) {
      FL.fill(0, 0, w, h, C.blue);
      ctx.save(); ctx.strokeStyle = C.blueDark; ctx.lineWidth = 3 / s;
      for (let x = 10; x < w; x += 10) FL.line(x, 0, x, h);
      for (let y = 10; y < h; y += 10) FL.line(0, y, w, y);
      ctx.restore();
      ctx.save(); ctx.fillStyle = 'rgba(16,52,70,0.5)';
      for (let x = 2.5; x < w; x += 5) for (let y = 2.5; y < h; y += 5) { ctx.beginPath(); ctx.arc(x, y, 0.25, 0, Math.PI * 2); ctx.fill(); }
      ctx.restore();
      const rr = rand(19);
      for (let i = 0; i < 26; i++) {
        const x = 2 + rr() * 36, y = 2 + rr() * 56;
        ctx.save(); ctx.translate(x, y); ctx.rotate(rr() * 6);
        ctx.fillStyle = i % 3 ? 'rgba(241,232,213,0.55)' : 'rgba(127,168,187,0.8)';
        ctx.beginPath(); ctx.ellipse(0, 0, 0.9 + rr() * 0.6, 0.6 + rr() * 0.4, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
      this.climb.forEach(([x, y], i) => {
        ctx.save(); ctx.translate(x, y); ctx.rotate(i);
        ctx.fillStyle = C.ink; ctx.beginPath(); ctx.ellipse(0.15, 0.2, 1.7, 1.15, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = C.green; ctx.beginPath(); ctx.ellipse(0, 0, 1.6, 1.05, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });
    },
  };
}
function parkField(kind) {
  const w = 60, h = 90;
  const dirt = kind === 'dirt';
  const pts = dirt ? [[10, 84], [48, 78], [52, 60], [12, 52], [12, 34], [50, 28], [46, 8], [16, 6]] : [[30, 86], [46, 72], [20, 62], [40, 46], [18, 32], [42, 18], [26, 6]];
  return {
    w, h, pad: 0, card: dirt ? C.greenDark : C.beige2,
    course: { pts: smooth(pts, 12), hops: true },
    draw(t, s) {
      if (dirt) {
        strokePoly(this.course.pts, 'rgba(0,0,0,0.18)', 84, s);
        strokePoly(this.course.pts, C.beige2, 76, s);
        const wk = walker(this.course.pts);
        for (let k = 1; k <= 6; k++) {
          const [x, y, a] = wk.at(k / 7);
          ctx.save(); ctx.translate(x, y); ctx.rotate(a);
          FL.fill(-1.2, -3.2, 2.4, 6.4, 'rgba(150,120,70,0.55)'); ctx.restore();
        }
        return;
      }
      FL.speckle(w, h, 220, 'rgba(120,110,90,0.18)', 3, 0.15);
      // a bowl, a quarter pipe, a funbox and a rail
      ctx.save();
      ctx.fillStyle = C.blue; ctx.beginPath(); ctx.roundRect(4, 4, 24, 18, 8); ctx.fill();
      ctx.strokeStyle = C.white; ctx.lineWidth = 6 / s; ctx.stroke();
      ctx.fillStyle = 'rgba(16,52,70,0.4)'; ctx.beginPath(); ctx.roundRect(8, 8, 16, 10, 5); ctx.fill();
      for (let k = 0; k < 5; k++) { ctx.fillStyle = `rgba(31,95,125,${0.25 + k * 0.15})`; ctx.fillRect(0, 80 + k * 2, w, 2); }
      ctx.strokeStyle = C.white; ctx.lineWidth = 5 / s; FL.line(0, 80, w, 80);
      gpoly([[34, 38], [52, 38], [56, 52], [30, 52]]); ctx.fillStyle = C.blue; ctx.fill();
      ctx.fillStyle = C.green; ctx.fillRect(38, 41, 10, 8);
      ctx.strokeStyle = C.ink; ctx.lineWidth = 5 / s; FL.line(8, 44, 8, 70);
      ctx.restore();
    },
  };
}
function arenaField() {
  const w = 60, h = 80;
  const pts = [[50, 76], [50, 58], [26, 64], [12, 46], [30, 32], [50, 20], [30, 8]];
  return {
    w, h, pad: 1.5, card: C.green,
    course: { pts: smooth(pts, 12), hops: true, fences: true },
    draw(t, s) {
      ctx.save(); ctx.fillStyle = C.beige2; ctx.beginPath(); ctx.roundRect(0, 0, w, h, 4); ctx.fill();
      ctx.strokeStyle = C.white; ctx.lineWidth = 6 / s; ctx.stroke(); ctx.restore();
      FL.speckle(w, h, 260, 'rgba(150,120,70,0.25)', 4, 0.18);
      const wk = walker(this.course.pts);
      for (let k = 1; k <= 6; k++) {
        const [x, y, a] = wk.at(k / 7);
        ctx.save(); ctx.translate(x, y); ctx.rotate(a + Math.PI / 2);
        for (let i = -3; i < 3; i++) FL.fill(i, -0.35, 1, 0.7, i % 2 ? C.white : C.green);
        FL.fill(-4, -0.8, 1, 1.6, C.blue); FL.fill(3, -0.8, 1, 1.6, C.blue);
        ctx.restore();
      }
    },
  };
}

// ---------------------------------------------------------------- precision
function targetField(kind) {
  const w = 100, h = 100, c = [50, 50];
  return {
    w, h, pad: 0, card: kind === 'shooting' ? C.blue : kind === 'darts' ? C.blueDark : C.green, center: c,
    R: kind === 'darts' ? 37 : kind === 'shooting' ? 30 : 45,
    draw(t, s) {
      if (kind === 'darts') {
        FL.circle(...c, 46, C.ink);
        for (let i = 0; i < 20; i++) {
          const a0 = ((i - 0.5) * Math.PI) / 10 - Math.PI / 2, a1 = a0 + Math.PI / 10;
          const seg = (r0, r1, col) => { ctx.beginPath(); ctx.arc(...c, r1, a0, a1); ctx.arc(...c, r0, a1, a0, true); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); };
          seg(3.2, 37, i % 2 ? C.beige : C.ink);
          seg(19, 21.2, i % 2 ? C.green : C.blue);
          seg(34.8, 37, i % 2 ? C.green : C.blue);
        }
        FL.circle(...c, 3.2, C.green); FL.circle(...c, 1.3, C.blue);
        ctx.save(); ctx.strokeStyle = 'rgba(200,190,170,0.6)'; ctx.lineWidth = 1.2 / s; [3.2, 19, 21.2, 34.8, 37].forEach(r => FL.arc(...c, r)); ctx.restore();
        return;
      }
      if (kind === 'shooting') {
        FL.fill(14, 14, 72, 72, C.white);
        FL.circle(...c, 18, C.ink);
        ctx.save(); ctx.lineWidth = 2 / s;
        for (let k = 1; k <= 10; k++) { ctx.strokeStyle = k * 3 < 18 ? C.white : C.ink; FL.arc(...c, k * 3); }
        ctx.restore();
        for (let k = 1; k <= 8; k++) { const r = (10.5 - k) * 3; FL.label(s, kd(k), c[0], c[1] - r, 18, r < 18 ? C.white : C.ink, 0.7); }
        return;
      }
      // archery stand and face
      ctx.save(); ctx.strokeStyle = C.beige2; ctx.lineWidth = 16 / s; FL.line(18, 96, 40, 8); FL.line(82, 96, 60, 8); ctx.restore();
      const cols = [C.white, C.white, C.ink, C.ink, C.blue, C.blue, C.greenDark, C.greenDark, C.beige2, C.beige2];
      cols.forEach((col, k) => FL.circle(...c, 45 - k * 4.5, col));
      ctx.save(); ctx.lineWidth = 1.2 / s; ctx.strokeStyle = 'rgba(22,22,22,0.35)'; for (let k = 0; k < 10; k++) FL.arc(...c, 45 - k * 4.5); FL.arc(...c, 2.25); ctx.restore();
    },
  };
}
function golfField() {
  const w = 80, h = 150;
  return {
    w, h, pad: 0, card: C.greenDark,
    tee: [40, 140], land1: [30, 84], land2: [42, 30], hole: [46, 22],
    draw(t, s) {
      const fair = smooth([[40, 150], [38, 120], [28, 90], [36, 60], [46, 22]], 12);
      strokePoly(fair, C.green, 240, s);
      ctx.save(); ctx.globalAlpha = 0.08; strokePoly(fair, C.white, 240, s, [40, 40]); ctx.restore();
      FL.circle(46, 22, 13, '#20ab0f'); FL.circle(46, 22, 11, '#27b516');
      for (const [x, y, rx, ry] of [[56, 78, 6, 3.5], [32, 34, 5, 3], [60, 30, 4, 2.6]]) { ctx.save(); ctx.fillStyle = C.beige2; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0.4, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
      ctx.save(); ctx.fillStyle = C.blue; ctx.beginPath(); ctx.ellipse(16, 110, 9, 13, 0.3, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      waves(26, 30, t, s, 6, 'rgba(248,243,231,0.4)');
      FL.fill(35, 136, 10, 7, '#20ab0f');
      FL.circle(46, 22, 0.7, C.ink);
      const rr = rand(13);
      for (let i = 0; i < 30; i++) { const x = rr() * w, y = rr() * h; if (Math.abs(x - 38) < 22) continue; FL.circle(x, y, 2.4, C.greenDeep); }
    },
  };
}
function laneField(kind) {
  if (kind === 'curling') {
    const w = 8, h = 36;
    return {
      w, h, pad: 0.8, card: C.blue, start: [4, 34], house: [4, 6], line: C.ink,
      draw(t, s) {
        FL.fill(0, 0, w, h, C.white);
        FL.speckle(w, h, 260, 'rgba(127,168,187,0.35)', 2, 0.03);
        [[3.66 * 0.9, C.blue], [2.44 * 0.9, C.white], [1.22 * 0.9, C.green], [0.3, C.white]].forEach(([r, col]) => FL.circle(4, 6, r, col));
        ctx.save(); ctx.lineWidth = 2 / s; ctx.strokeStyle = 'rgba(22,22,22,0.5)'; FL.line(4, 0, 4, h); FL.line(0, 6, w, 6); FL.line(0, 2.2, w, 2.2); ctx.restore();
        ctx.save(); ctx.lineWidth = 6 / s; ctx.strokeStyle = C.green; FL.line(0, 13, w, 13); ctx.restore();
      },
    };
  }
  if (kind === 'boules') {
    const w = 6, h = 15;
    return {
      w, h, pad: 0.8, card: C.green, start: [3, 13.5], house: [3, 4],
      draw(t, s) {
        FL.fill(0, 0, w, h, C.beige2);
        FL.speckle(w, h, 300, 'rgba(150,120,70,0.35)', 6, 0.04);
        ctx.save(); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5 / s; FL.rect(0, 0, w, h); ctx.restore();
        ctx.save(); ctx.strokeStyle = C.white; ctx.lineWidth = 5 / s; FL.arc(3, 13.5, 0.5); ctx.restore();
      },
    };
  }
  const w = 6, h = 30;
  const pins = [];
  for (let r = 0; r < 4; r++) for (let k = 0; k <= r; k++) pins.push([w / 2 + (k - r / 2) * 1.15, 5.4 - r * 1.0]);
  return {
    w, h, pad: 1.2, card: C.blueDark, start: [w / 2 + 0.6, 28], pins,
    draw(t, s) {
      FL.fill(-0.9, 0, 0.8, h, 'rgba(0,0,0,0.25)'); FL.fill(w + 0.1, 0, 0.8, h, 'rgba(0,0,0,0.25)');
      FL.fill(0, 0, w, h, C.beige2);
      ctx.save(); ctx.strokeStyle = 'rgba(150,120,70,0.35)'; ctx.lineWidth = 1 / s; for (let x = 0.3; x < w; x += 0.3) FL.line(x, 0, x, h); ctx.restore();
      for (let i = 0; i < 7; i++) { const x = 0.75 + i * 0.75, y = 19 + Math.abs(i - 3) * 0.6; FL.poly([[x, y - 0.7], [x + 0.22, y], [x - 0.22, y]], C.green); }
      ctx.save(); ctx.strokeStyle = C.ink; ctx.lineWidth = 4 / s; FL.line(0, 28, w, 28); ctx.restore();
      FL.fill(0, 28, w, 2, 'rgba(255,255,255,0.3)');
    },
  };
}
function stageField() {
  const w = 100, h = 120;
  return {
    w, h, pad: 0, card: C.blue, floor: 96, lights: [[38, 10], [50, 10], [62, 10]],
    draw(t, s) {
      FL.fill(0, 0, w, 96, C.blue);
      ctx.save(); ctx.globalAlpha = 0.12; ctx.fillStyle = C.white;
      gpoly([[30, 0], [70, 0], [86, 96], [14, 96]]); ctx.fill(); ctx.restore();
      FL.fill(0, 96, w, 24, C.blueDark);
      FL.poly([[6, 96], [94, 96], [100, 104], [0, 104]], C.greenDark);
      FL.poly([[30, 96], [70, 96], [72, 104], [28, 104]], C.beige2);
      FL.fill(0, 104, w, 4, C.ink);
      for (const [x, y] of this.lights) { FL.circle(x, y, 5.2, C.blueDark); ctx.save(); ctx.strokeStyle = 'rgba(241,232,213,0.5)'; ctx.lineWidth = 3 / s; FL.arc(x, y, 5.2); ctx.restore(); }
    },
  };
}
function rinkField(kind) {
  const w = 26, h = 60;
  return {
    w, h, pad: 1.5, card: C.blue, base: C.white, goal: [w / 2, 3.4], line: C.ink,
    draw(t, s) {
      ctx.save(); ctx.fillStyle = C.white; ctx.beginPath(); ctx.roundRect(0, 0, w, h, 8.5); ctx.fill();
      ctx.strokeStyle = C.blueDark; ctx.lineWidth = 8 / s; ctx.stroke(); ctx.restore();
      if (kind === 'figure') {
        ctx.save(); ctx.strokeStyle = 'rgba(127,168,187,0.6)'; ctx.lineWidth = 2 / s;
        const rr = rand(9);
        for (let i = 0; i < 14; i++) { ctx.beginPath(); ctx.arc(4 + rr() * 18, 6 + rr() * 48, 3 + rr() * 6, rr() * 6, rr() * 6 + 2); ctx.stroke(); }
        ctx.restore();
        return;
      }
      const L = (y, col, px) => { ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = px / s; FL.line(0.6, y, w - 0.6, y); ctx.restore(); };
      L(30, C.green, 9); L(22.6, C.blue, 9); L(37.4, C.blue, 9); L(3.4, C.green, 3); L(56.6, C.green, 3);
      ctx.save(); ctx.strokeStyle = C.blue; ctx.lineWidth = 3 / s; FL.arc(w / 2, 30, 4.5); ctx.restore();
      ctx.save(); ctx.strokeStyle = C.green; ctx.lineWidth = 3 / s; ctx.fillStyle = C.green;
      for (const [x, y] of [[6.7, 10], [19.3, 10], [6.7, 50], [19.3, 50]]) { FL.arc(x, y, 4.5); FL.dot(x, y, 0.3); }
      ctx.restore();
      FL.both(h, () => {
        ctx.save(); ctx.fillStyle = 'rgba(127,168,187,0.5)'; ctx.beginPath(); ctx.arc(w / 2, 3.4, 1.8, 0, Math.PI); ctx.fill(); ctx.restore();
        ctx.save(); ctx.strokeStyle = C.ink; ctx.lineWidth = 3 / s; FL.rect(w / 2 - 0.9, 2.4, 1.8, 1); ctx.restore();
      });
    },
  };
}
function sectorField(kind) {
  if (kind === 'jump') {
    const w = 30, h = 100;
    return {
      w, h, pad: 2, card: C.green, origin: [15, 34], landings: [[15, 24], [15, 20], [15, 15]], jump: true,
      draw(t, s) {
        FL.fill(12, 34, 6, 70, C.blue);
        ctx.save(); ctx.strokeStyle = C.white; ctx.lineWidth = 2 / s; FL.line(12, 34, 12, 100); FL.line(18, 34, 18, 100); ctx.restore();
        FL.fill(10.5, 4, 9, 27, C.beige2);
        ctx.save(); ctx.translate(10.5, 4); FL.speckle(9, 27, 80, 'rgba(150,120,70,0.35)', 4, 0.12); ctx.restore();
        FL.fill(12, 33.4, 6, 1.2, C.white);
      },
    };
  }
  const w = 80, h = 100, o = [40, 94], A = (17.46 * Math.PI) / 180;
  return {
    w, h, pad: 2, card: C.green, origin: o, landings: [[34, 46], [46, 36], [38, 24]],
    draw(t, s) {
      ctx.save();
      ctx.beginPath(); ctx.moveTo(...o); ctx.lineTo(o[0] - Math.sin(A) * 96, o[1] - Math.cos(A) * 96); ctx.lineTo(o[0] + Math.sin(A) * 96, o[1] - Math.cos(A) * 96); ctx.closePath(); ctx.clip();
      for (let r = 10; r < 100; r += 20) { ctx.beginPath(); ctx.arc(...o, r + 10, 0, Math.PI * 2); ctx.arc(...o, r, 0, Math.PI * 2, true); ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.fill(); }
      ctx.restore();
      FL.line(...o, o[0] - Math.sin(A) * 96, o[1] - Math.cos(A) * 96);
      FL.line(...o, o[0] + Math.sin(A) * 96, o[1] - Math.cos(A) * 96);
      ctx.save(); ctx.lineWidth = 2 / s; ctx.globalAlpha = 0.7;
      for (let r = 20; r <= 90; r += 10) {
        FL.arc(...o, r, -Math.PI / 2 - A, -Math.PI / 2 + A);
        FL.label(s, kd(r), o[0] + Math.sin(A) * r + 4.5, o[1] - Math.cos(A) * r, 24, C.beige, 0.85);
      }
      ctx.restore();
      FL.circle(...o, 1.6, C.beige2);
      ctx.save(); ctx.lineWidth = 4 / s; FL.arc(...o, 1.6); ctx.restore();
    },
  };
}

// ---------------------------------------------------------------- boards and brackets
function boardField(kind) {
  if (kind === 'go') {
    const n = 18;
    return {
      w: n, h: n, pad: 1.1, card: C.beige2, go: true, line: C.ink,
      draw(t, s) {
        ctx.save(); ctx.strokeStyle = 'rgba(22,22,22,0.7)'; ctx.lineWidth = 1.6 / s;
        for (let i = 0; i <= n; i++) { FL.line(i, 0, i, n); FL.line(0, i, n, i); }
        ctx.fillStyle = C.ink; for (const x of [3, 9, 15]) for (const y of [3, 9, 15]) FL.dot(x, y, 0.16);
        ctx.restore();
      },
    };
  }
  return {
    w: 8, h: 8, pad: 0.6, card: C.blue,
    draw(t, s) {
      for (let x = 0; x < 8; x++) for (let y = 0; y < 8; y++) FL.fill(x, y, 1, 1, (x + y) % 2 ? C.green : C.beige);
      ctx.save(); ctx.strokeStyle = C.ink; ctx.lineWidth = 3 / s; FL.rect(0, 0, 8, 8); ctx.restore();
      if (kind !== 'checkers') for (let i = 0; i < 8; i++) { FL.label(s, 'abcdefgh'[i], i + 0.5, 8.3, 20, C.beige, 0.7); FL.label(s, String(8 - i), -0.3, i + 0.5, 20, C.beige, 0.7); }
    },
  };
}
function bracketField() {
  const w = 100, h = 120;
  const slots = Array.from({ length: 8 }, (_, i) => [8 + i * 12, 108]);
  const lvl = [slots, [0, 1, 2, 3].map(i => [14 + i * 24, 80]), [0, 1].map(i => [26 + i * 48, 52]), [[50, 24]]];
  return {
    w, h, pad: 2, card: C.blue, levels: lvl,
    draw(t, s) {
      ctx.save(); ctx.strokeStyle = 'rgba(248,243,231,0.45)'; ctx.lineWidth = 4 / s;
      for (let L = 1; L < lvl.length; L++) lvl[L].forEach((p, i) => {
        const a = lvl[L - 1][2 * i], b = lvl[L - 1][2 * i + 1];
        gpoly([[a[0], a[1] - 4], [a[0], p[1] + 8], [b[0], p[1] + 8], [b[0], b[1] - 4]], false); ctx.stroke();
        FL.line(p[0], p[1] + 8, p[0], p[1] + 4);
      });
      ctx.restore();
      slots.forEach(([x, y], i) => { ctx.save(); ctx.fillStyle = C.blueDark; ctx.beginPath(); ctx.roundRect(x - 5, y - 4, 10, 8, 2); ctx.fill(); ctx.restore(); FL.label(s, kd(i + 1), x, y, 30, C.beige, 0.8); });
      lvl.slice(1, 3).flat().forEach(([x, y]) => { ctx.save(); ctx.fillStyle = C.blueDark; ctx.beginPath(); ctx.roundRect(x - 5, y - 4, 10, 8, 2); ctx.fill(); ctx.restore(); });
    },
  };
}

const FIELDS = {
  pitch: v => (v === 'futsal' || v === 'handball' ? hallCourt(v) : v === 'beach' ? beachPitch() : v === 'rugby' || v === 'american' ? rugbyPitch(v === 'american')
    : v === 'hockey' || v === 'polo' ? hockeyPitch(v === 'polo') : footballPitch()),
  court, net: netCourt, table: tableField, diamond: diamondField, oval: ovalField,
  ring: ringField, mat: matField, piste: pisteField,
  track: trackField, road: roadField, pool: poolField, water: waterField,
  mountain: mountainField, wall: wallField, park: parkField, arena: arenaField,
  target: targetField, golf: golfField, lane: laneField, stage: stageField, rink: rinkField, sector: sectorField,
  board: boardField, bracket: bracketField,
};
