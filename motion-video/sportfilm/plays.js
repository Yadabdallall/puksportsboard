// What moves on the field in sportfilm.html. PLAYS[name](F, variant, S)
// returns { events, scoreAt, draw(t, s) }: events are [time, role] pairs
// that audio/sportfilm.py turns into sounds (a touch, a hit, a splash...),
// scoreAt is the play's big moment, and draw() runs in field units like the
// field itself. Everything happens on the beat: EV holds the seven moments,
// 6.25 s to 13.75 s, one every two beats.

const APPEAR = [5.75, 6.15];
function tokenAt(x, y, r, fill, ringCol, s, lift = 0, alpha = 1) {
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.beginPath(); ctx.arc(x + (3 + lift * 0.45) / s, y + (4 + lift * 0.8) / s, (r * (1 - lift / 400)) / s, 0, Math.PI * 2); ctx.fill();
  const k = 1 + lift / 160;
  disc(x, y - lift / s, (r * k) / s, fill);
  if (ringCol) ring(x, y - lift / s, (r * k) / s, ringCol, 3.5 / s);
  ctx.restore();
}
function rippleAt(x, y, t, t0, s, col = C.white, maxR = 60, dur = 0.7) {
  const u = prog(t, t0, t0 + dur);
  if (u <= 0 || u >= 1) return;
  ring(x, y, (8 + maxR * ease.out(u)) / s, col, (7 * (1 - u) + 1) / s, 1 - u);
}
function burstAt(x, y, t, t0, s, col = C.white, size = 1) {
  const u = prog(t, t0, t0 + 0.45);
  if (u <= 0 || u >= 1) return;
  ctx.save();
  ctx.strokeStyle = col;
  ctx.lineWidth = ((10 * (1 - u) + 2) * size) / s;
  ctx.lineCap = 'round';
  for (let j = 0; j < 10; j++) {
    const a = (j / 10) * Math.PI * 2 + 0.3;
    const r0 = ((20 + 50 * ease.out(u)) * size) / s, r1 = r0 + ((30 * (1 - u)) * size) / s;
    ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); ctx.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1); ctx.stroke();
  }
  ctx.restore();
}
// a fading dashed trail between two points
function trail(a, b, s, alpha, col = C.white) {
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.strokeStyle = col;
  ctx.lineWidth = 3 / s;
  ctx.setLineDash([8 / s, 9 / s]);
  ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke();
  ctx.restore();
}
const appear = t => ease.out(prog(t, ...APPEAR));
// the two sides' colours, chosen to stand out on what they stand on
function teams(F) {
  const b = F.base || F.card;
  if (b === C.white || b === C.beige2 || b === C.card) return [C.green, C.blue];
  if (b === C.blue || b === C.blueDark) return [C.white, C.green];
  return [C.white, C.blue];
}

const PLAYS = {
  // passes up the field and a shot into the goal (or a basket, or a try)
  pass(F, v, S) {
    const { w, h } = F;
    const goal = F.goal;
    const P = [[0.5, 0.86], [0.22, 0.7], [0.72, 0.57], [0.3, 0.44], [0.74, 0.32], [0.42, 0.2]].map(([a, b]) => [a * w, b * h]);
    const D = [[0.52, 0.64], [0.6, 0.47], [0.38, 0.36], [0.62, 0.22], [0.5, 0.1], [0.2, 0.3]].map(([a, b]) => [a * w, b * h]);
    const hoop = v === 'hoop', run = v === 'try';
    const IN = EV[5] + (run ? 1.0 : hoop ? 0.75 : 0.5);
    const [A, B] = teams(F);
    const ballCol = F.base === C.white ? C.ink : C.white;
    const ballAt = t => {
      if (t < EV[0]) return [...P[0], 0];
      for (let i = 0; i < 5; i++) {
        if (t < EV[i + 1]) {
          const u = ease.out(prog(t, EV[i], EV[i] + 0.85));
          const [x, y] = lerp2(P[i], P[i + 1], u);
          return [x, y, hoop ? 30 * Math.sin(Math.PI * u) : 0];
        }
      }
      const u = prog(t, EV[5], IN);
      if (u < 1) {
        const [x, y] = lerp2(P[5], goal, run ? u : ease.out(u));
        return [x, y, hoop ? 120 * Math.sin(Math.PI * u) : 0];
      }
      // resting in the net, or dropping through the basket
      const k = t - IN;
      return [goal[0], goal[1] + (hoop ? Math.min(k * 3, 1.2) : 0), hoop ? 0 : 0];
    };
    return {
      scoreAt: IN,
      events: [...EV.slice(0, 6).map(t => [t, 'touch']), [IN, 'score']],
      draw(t, s) {
        const a = appear(t);
        if (a <= 0) return;
        ctx.save();
        ctx.globalAlpha = a;
        const [bx, by, lift] = ballAt(t);
        // the last pass, as a fading line
        const i = EV.findIndex(e => t < e) - 1;
        if (i >= 0 && i < 6) {
          const from = P[Math.min(i, 5)];
          trail(from, [bx, by], s, 0.7 * (1 - prog(t, EV[i] + 0.9, EV[i] + 1.2)));
        }
        D.forEach((d, j) => {
          const drift = [Math.sin(t * 1.3 + j) * 0.012 * w, Math.cos(t * 1.1 + j * 2) * 0.01 * h];
          const p = lerp2(d, [bx, by], 0.14);
          tokenAt(p[0] + drift[0], p[1] + drift[1], 15, B, C.white, s);
        });
        P.forEach((p, j) => {
          // each player steps towards the ball as it comes
          const recv = j > 0 ? ease.inOut(prog(t, EV[j - 1], EV[j - 1] + 0.85)) : 0;
          let q = [p[0] + Math.sin(t * 1.2 + j) * 0.01 * w, p[1] + (1 - recv) * 0.025 * h];
          if (run && j === 5 && t > EV[5]) q = [bx - 0.02 * w, by + 0.01 * h];
          tokenAt(q[0], q[1], 16, A, B === C.green ? C.green : C.blue, s);
        });
        if (hoop) {
          // the ring, so the ball can pass through it
          ctx.save(); ctx.strokeStyle = C.white; ctx.lineWidth = 5 / s; ctx.beginPath(); ctx.arc(goal[0], goal[1], 0.32, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
        }
        tokenAt(bx, by, 9, ballCol, C.ink, s, lift);
        rippleAt(goal[0], goal[1], t, IN, s, C.white, 110, 1.0);
        rippleAt(goal[0], goal[1], t, IN + 0.18, s, C.white, 70, 0.9);
        EV.slice(0, 6).forEach((e, j) => rippleAt(...P[j], t, e, s, C.white, 34, 0.5));
        ctx.restore();
      },
    };
  },

  // the ball crosses the net on every hit; the last shot is a winner
  rally(F, v, S) {
    const { w, h } = F;
    const wall = F.wall, side = S.side || 1;
    const [A, B] = teams(F);
    const xs = [0.36, 0.66, 0.3, 0.7, 0.42, 0.62, 0.34];
    const yA = wall ? 0.72 : 0.86, yB = wall ? 0.84 : 0.14;
    const pos = i => [xs[i] * w, (i % 2 === 0 ? yA : yB) * h];
    const LAND = EV[6] + 0.6, landAt = wall ? [0.82 * w, 0.9 * h] : [0.86 * w, 0.08 * h];
    const bounce = v === 'bounce', high = v === 'high', shuttle = v === 'shuttle';
    const shot = (t, i) => {
      const from = pos(i), to = i < 6 ? pos(i + 1) : landAt;
      const t1 = i < 6 ? EV[i + 1] : LAND;
      const u = prog(t, EV[i], t1);
      if (wall) {
        const wp = [lerp(from[0], to[0], 0.5), 0.03 * h];
        return u < 0.45 ? [...lerp2(from, wp, u / 0.45), 30 * Math.sin((Math.PI * u) / 0.9)] : [...lerp2(wp, to, (u - 0.45) / 0.55), 20 * Math.sin((Math.PI * (u - 0.45)) / 1.1)];
      }
      const k = shuttle ? ease.out(u) : u;
      const [x, y] = lerp2(from, to, k);
      let lift = 0;
      if (high) lift = 150 * Math.sin(Math.PI * u);
      else if (bounce) lift = u < 0.62 ? 55 * Math.sin((Math.PI * u) / 0.62) : 26 * Math.sin((Math.PI * (u - 0.62)) / 0.38);
      else lift = 70 * Math.sin(Math.PI * u);
      return [x, y, lift, Math.atan2(to[1] - from[1], to[0] - from[0])];
    };
    const ev = EV.map(t => [t, 'hit']);
    if (bounce || wall) for (let i = 0; i < 6; i++) ev.push([lerp(EV[i], EV[i + 1], wall ? 0.45 : 0.62), 'bounce']);
    ev.push([LAND, 'score']);
    return {
      scoreAt: LAND,
      events: ev.sort((a, b) => a[0] - b[0]),
      draw(t, s) {
        const a = appear(t);
        if (a <= 0) return;
        ctx.save();
        ctx.globalAlpha = a;
        const i = clamp(EV.findIndex(e => t < e) - 1, -1, 6);
        const [bx, by, lift, dir] = i < 0 ? [...pos(0), 0, 0] : shot(t, i);
        // players: each side's hitter follows its next shot
        const nextOf = side0 => { for (let j = Math.max(i, 0); j < 7; j++) if (j % 2 === side0) return pos(j); return pos(side0); };
        [[0, A], [1, B]].forEach(([sd, col]) => {
          const target = nextOf(sd);
          for (let m = 0; m < side; m++) {
            const off = (m - (side - 1) / 2) * 0.32 * w;
            const x = m === Math.floor(side / 2) || side === 1 ? target[0] : clamp(target[0] + off, 0.1 * w, 0.9 * w);
            const y = target[1] + (side > 1 && m !== Math.floor(side / 2) ? (sd ? 0.08 : -0.08) * h : 0);
            tokenAt(x + Math.sin(t * 2 + m) * 0.01 * w, y, 16, col, sd ? C.white : C.blue, s);
          }
        });
        if (shuttle && i >= 0) {
          ctx.save();
          ctx.translate(bx, by - lift / s);
          ctx.rotate(dir + Math.PI / 2);
          ctx.scale(0.13 / s, 0.13 / s);
          GLYPHS.shuttle();
          ctx.restore();
        } else tokenAt(bx, by, 9, C.white, C.ink, s, lift);
        EV.forEach((e, j) => rippleAt(...pos(j), t, e, s, C.white, 30, 0.45));
        rippleAt(...landAt, t, LAND, s, C.white, 90, 0.9);
        ctx.restore();
      },
    };
  },

  // a pitch, a hit into the outfield and a run round the bases
  diamond(F) {
    const { home, first, second, third, mound, deep } = F;
    const bases = [home, first, second, third, home];
    const fielders = [mound, [home[0], home[1] + 4], [first[0] + 3, first[1] - 6], [second[0] + 12, second[1] + 4], [second[0] - 12, second[1] + 4],
      [third[0] - 3, third[1] - 6], [40, 34], [75, 22], [110, 34]];
    return {
      scoreAt: EV[5],
      events: [[EV[0], 'hit'], [EV[1], 'land'], [EV[2], 'step'], [EV[3], 'step'], [EV[4], 'step'], [EV[5], 'score']],
      draw(t, s) {
        const a = appear(t);
        if (a <= 0) return;
        ctx.save();
        ctx.globalAlpha = a;
        // the ball: pitched, hit high into left-centre, fielded
        let ball;
        if (t < EV[0]) ball = [...lerp2(mound, home, prog(t, 5.85, EV[0])), 6];
        else if (t < EV[1]) { const u = prog(t, EV[0], EV[1]); ball = [...lerp2(home, deep, u), 220 * Math.sin(Math.PI * u)]; }
        else { const u = ease.out(prog(t, EV[1], EV[1] + 0.6)); ball = [...lerp2(deep, [deep[0] - 4, deep[1] + 6], u), 0]; }
        const lf = lerp2(fielders[6], [deep[0] - 4, deep[1] + 8], ease.inOut(prog(t, EV[0] + 0.3, EV[1] + 0.6)));
        fielders.forEach((p, j) => tokenAt(...(j === 6 ? lf : p), 13, C.blue, C.white, s));
        // the runner
        let r = home;
        for (let k = 0; k < 4; k++) {
          const t0 = k === 0 ? EV[0] + 0.1 : EV[k + 1], t1 = EV[k + 2];
          if (t >= t0) r = lerp2(bases[k], bases[k + 1], ease.inOut(prog(t, t0, t1)));
        }
        strokePoly([home, ...bases.slice(1, 1 + clamp(EV.findIndex(e => t < e) - 1, 0, 4))], 'rgba(255,255,255,0.5)', 4, s, [8, 8]);
        tokenAt(...r, 15, C.white, C.green, s);
        tokenAt(...ball.slice(0, 2), 7, C.white, C.ink, s, ball[2]);
        burstAt(...home, t, EV[0], s, C.white, 0.6);
        [EV[2], EV[3], EV[4]].forEach((e, k) => rippleAt(...bases[k + 1], t, e, s, C.white, 40, 0.6));
        rippleAt(...home, t, EV[5], s, C.white, 120, 1.0);
        rippleAt(...home, t, EV[5] + 0.2, s, C.white, 80, 0.9);
        ctx.restore();
      },
    };
  },

  // two opponents circle; on the beat one strikes; the last move wins
  duel(F, v, S) {
    const c = F.center, R = F.R;
    const fence = v === 'fence', throwIt = v === 'throw';
    const [A, B] = teams(F);
    const END = EV[6] + (throwIt ? 0.45 : 0);
    const base = t => {
      if (fence) {
        const d = 2.2 + 0.5 * Math.sin(t * 1.7);
        return [[c[0], c[1] + d], [c[0], c[1] - d]];
      }
      const th = 0.55 * (t - 5) + 0.6;
      const r = R * (0.5 + 0.06 * Math.sin(t * 2.1));
      return [[c[0] + Math.cos(th) * r, c[1] + Math.sin(th) * r], [c[0] - Math.cos(th) * r, c[1] - Math.sin(th) * r]];
    };
    return {
      scoreAt: END,
      events: [...EV.slice(0, 6).map(t => [t, 'strike']), [END, 'finish']],
      draw(t, s) {
        const a = appear(t);
        if (a <= 0) return;
        ctx.save();
        ctx.globalAlpha = a;
        let [pa, pb] = base(Math.min(t, EV[6]));
        const gap = Math.hypot(pb[0] - pa[0], pb[1] - pa[1]);
        const toward = (p, q, d) => { const k = d / Math.hypot(q[0] - p[0], q[1] - p[1]); return [p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k]; };
        let hitPt = null;
        EV.forEach((e, i) => {
          const k = t - e;
          if (k < -0.22 || k > 0.5) return;
          const reach = k < 0 ? ease.in(prog(k, -0.22, 0)) : 1 - ease.out(prog(k, 0, 0.5));
          const d = (gap - 34 / s) * reach * (fence ? 0.9 : 0.75);
          if (i % 2 === 0) pa = toward(pa, pb, d); else pb = toward(pb, pa, d);
          if (Math.abs(k) < 0.02 || (k >= 0 && k < 0.05)) hitPt = lerp2(pa, pb, 0.5);
        });
        // the winning move
        const fu = prog(t, EV[6], EV[6] + 0.9);
        let lift = 0;
        if (fu > 0 && !fence) {
          if (throwIt) {
            const u = prog(t, EV[6], END);
            const land = [pa[0] + (pa[0] - pb[0]) * 0.9, pa[1] + (pa[1] - pb[1]) * 0.9];
            pb = lerp2(pb, land, ease.inOut(u));
            lift = 140 * Math.sin(Math.PI * u);
          } else pb = lerp2(pb, toward(pb, [2 * pb[0] - pa[0], 2 * pb[1] - pa[1]], 1.2 * R), ease.out(fu));
        }
        // each fighter faces the other: a body and two fists
        const fighter = (p, q, col, rc, lf) => {
          const ang = Math.atan2(q[1] - p[1], q[0] - p[0]);
          tokenAt(...p, 26, col, rc, s, lf);
          if (fence) {
            ctx.save(); ctx.strokeStyle = C.ink; ctx.lineWidth = 4 / s; ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(p[0] + Math.cos(ang) * (24 / s), p[1] + Math.sin(ang) * (24 / s)); ctx.lineTo(p[0] + Math.cos(ang) * (95 / s), p[1] + Math.sin(ang) * (95 / s)); ctx.stroke(); ctx.restore();
            return;
          }
          for (const sd of [-0.55, 0.55]) disc(p[0] + Math.cos(ang + sd) * (30 / s), p[1] - lf / s + Math.sin(ang + sd) * (30 / s), 9 / s, rc);
        };
        fighter(pa, pb, A, C.green, 0);
        fighter(pb, pa, B, C.white, lift);
        EV.slice(0, 6).forEach((e, i) => {
          const [qa, qb] = base(e);
          const mid = lerp2(qa, qb, i % 2 === 0 ? 0.8 : 0.2);
          burstAt(...mid, t, e, s, C.white, 0.7);
        });
        if (fence) {
          // the scoring lamps light on each touch
          const lit = EV.filter(e => t > e).length;
          for (const [k, col] of [[0, C.green], [1, C.blue]]) {
            const on = lit > 0 && (lit - 1) % 2 === k && t - EV[lit - 1] < 0.9;
            disc(c[0] + (k ? 1.2 : -1.2), F.h + 0.55, 0.38, on ? col : 'rgba(22,22,22,0.4)');
          }
        }
        rippleAt(...pb, t, END, s, C.white, 120, 1.0);
        rippleAt(...pb, t, END + 0.15, s, C.white, 70, 0.9);
        if (hitPt) { /* the burst above marks it */ }
        ctx.restore();
      },
    };
  },

  // four racers; the leader passes a marker on every beat and finishes on the last
  race(F, v, S) {
    const lanes = F.lanes >= 8 ? [2, 3, 4, 5] : [0, 1, 2, 3];
    const routes = lanes.map(l => walker(F.route(l)));
    const START = 5.9;
    const lead = t => {
      if (t <= START) return 0;
      const pts = [[START, 0], ...EV.map((e, k) => [e, (k + 1) / 7])];
      for (let k = 1; k < pts.length; k++) if (t <= pts[k][0]) return lerp(pts[k - 1][1], pts[k][1], prog(t, pts[k - 1][0], pts[k][0]));
      return 1;
    };
    const timeOf = p => { for (let x = START; x < EV[6]; x += 0.01) if (lead(x) >= p) return x; return EV[6]; };
    const gaps = [0, 0.035, 0.06, 0.085];
    const order = [1, 0, 2, 3]; // the lane that wins
    const prog4 = (t, j) => {
      const g = gaps[order.indexOf(j)] * prog(t, START, START + 2) * (1 + 0.4 * Math.sin(t * 0.9 + j));
      return clamp(lead(t) - g);
    };
    const style = S.sfx;
    const cols = [C.white, C.beige, C.green, C.blueLight];
    const ev = [...EV.slice(0, 6).map(t => [t, 'pass']), [EV[6], 'finish']];
    (F.turns || []).forEach(p => ev.push([timeOf(p), 'turn']));
    return {
      scoreAt: EV[6],
      events: ev.sort((a, b) => a[0] - b[0]),
      draw(t, s) {
        const a = appear(t);
        if (a <= 0) return;
        ctx.save();
        ctx.globalAlpha = a;
        routes.forEach((rw, j) => {
          const p = prog4(t, j);
          // the trail behind each racer
          ctx.save();
          ctx.lineCap = 'round';
          for (let k = 1; k <= 10; k++) {
            const q0 = rw.at(Math.max(0, p - (k * 0.012))), q1 = rw.at(Math.max(0, p - ((k - 1) * 0.012)));
            ctx.strokeStyle = cols[j];
            ctx.globalAlpha = a * 0.5 * (1 - k / 10);
            ctx.lineWidth = (14 * (1 - k / 12)) / s;
            ctx.beginPath(); ctx.moveTo(q0[0], q0[1]); ctx.lineTo(q1[0], q1[1]); ctx.stroke();
          }
          ctx.restore();
          const [x, y, hd] = rw.at(p);
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(hd);
          ctx.fillStyle = 'rgba(0,0,0,0.25)';
          const shape = (dx, dy) => {
            ctx.beginPath();
            if (style === 'motor') ctx.roundRect(-18 / s + dx, -10 / s + dy, 36 / s, 20 / s, 6 / s);
            else if (style === 'wheel' || style === 'hoof' || style === 'water' || style === 'ice') ctx.ellipse(dx, dy, 20 / s, 9 / s, 0, 0, Math.PI * 2);
            else ctx.arc(dx, dy, 13 / s, 0, Math.PI * 2);
          };
          shape(3 / s, 4 / s); ctx.fill();
          shape(0, 0); ctx.fillStyle = cols[j]; ctx.fill();
          ctx.strokeStyle = C.ink; ctx.lineWidth = 3 / s; ctx.stroke();
          if (style === 'water') { ctx.fillStyle = 'rgba(255,255,255,0.7)'; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.arc(-6 / s, (sd * 14) / s * (0.6 + 0.4 * Math.sin(t * 12 + j)), 4 / s, 0, Math.PI * 2); ctx.fill(); } }
          ctx.restore();
        });
        // the markers the leader passes, and the finish
        const lw = routes[order[0]];
        EV.slice(0, 6).forEach((e, k) => { const [x, y] = lw.at((k + 1) / 7); rippleAt(x, y, t, e, s, C.white, 40, 0.6); });
        const [fx, fy] = lw.at(1);
        rippleAt(fx, fy, t, EV[6], s, C.white, 130, 1.0);
        rippleAt(fx, fy, t, EV[6] + 0.2, s, C.white, 80, 0.9);
        ctx.restore();
      },
    };
  },

  // arrows, darts or shots land on the target, the last one dead centre
  shoot(F, v) {
    const c = F.center, R = F.R;
    const offs = [[0.5, -0.32], [-0.26, 0.4], [0.18, 0.14], [-0.4, -0.2], [0.06, -0.1], [0.26, 0.28], [0, 0]];
    const hits = offs.map(([x, y]) => [c[0] + x * R, c[1] + y * R]);
    const gun = v === 'shooting';
    const score = p => clamp(10 - Math.floor(Math.hypot(p[0] - c[0], p[1] - c[1]) / (R / 10)), 1, 10);
    return {
      scoreAt: EV[6],
      events: [...EV.slice(0, 6).map(t => [t, 'impact']), [EV[6], 'score']],
      draw(t, s) {
        const a = appear(t);
        if (a <= 0) return;
        ctx.save();
        ctx.globalAlpha = a;
        hits.forEach((p, i) => {
          const e = EV[i];
          const u = prog(t, e - 0.3, e);
          if (u <= 0) return;
          const from = [p[0] + R * 1.4, p[1] + R * 1.9];
          const q = lerp2(from, p, ease.in(u));
          if (gun) {
            if (u < 1) { trail(lerp2(from, p, Math.max(0, ease.in(u) - 0.25)), q, s, 0.8, C.white); return; }
            disc(...p, 7 / s, C.white); disc(...p, 5 / s, C.ink);
          } else {
            // an arrow: shaft, fletching; it shakes a little when it lands
            const shake = u >= 1 ? Math.sin((t - e) * 40) * Math.exp(-(t - e) * 8) * 0.05 : 0;
            const ang = Math.atan2(p[1] - from[1], p[0] - from[0]) + shake;
            const len = (v === 'darts' ? 60 : 110) / s;
            ctx.save();
            ctx.translate(...q);
            ctx.rotate(ang);
            ctx.strokeStyle = C.ink; ctx.lineWidth = 4 / s; ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-len, 0); ctx.stroke();
            ctx.fillStyle = i === 6 ? C.white : i % 2 ? C.blue : C.white;
            gpoly([[-len, 0], [-len - 18 / s, -10 / s], [-len + 8 / s, 0], [-len - 18 / s, 10 / s]]); ctx.fill();
            ctx.restore();
          }
          if (u >= 1 && i < 6) {
            const pu = ease.back(prog(t, e, e + 0.35)) * (1 - prog(t, e + 1.0, e + 1.3));
            if (pu > 0) {
              ctx.save(); ctx.translate(p[0] + 26 / s, p[1] - 40 / s); ctx.scale(pu / s, pu / s);
              pill(kd(score(p)), 0, 0, 1, { size: 34, weight: 900, bg: C.ink, color: C.white, padX: 16 });
              ctx.restore();
            }
          }
          rippleAt(...p, t, e, s, C.white, i === 6 ? 140 : 40, i === 6 ? 1.1 : 0.5);
        });
        rippleAt(...c, t, EV[6] + 0.2, s, C.white, 90, 0.9);
        ctx.restore();
      },
    };
  },

  // throws and jumps that land further each time; golf to the hole; cricket to the boundary
  arc(F, v) {
    const golf = v === 'golf', jump = v === 'jump', cricket = v === 'cricket';
    let shots; // [from, to, t0, t1, height]
    if (golf) shots = [[F.tee, F.land1, EV[0], EV[1], 240], [F.land1, F.land2, EV[2], EV[3], 200], [F.land2, F.hole, EV[4], EV[5], 0]];
    else if (cricket) shots = [[F.bat, [26, 30], EV[0], EV[1], 150], [F.bat, [108, 44], EV[2], EV[3], 120], [F.bat, [48, -6], EV[4], EV[5], 260]];
    else if (jump) shots = F.landings.map((l, k) => [F.origin, l, EV[2 * k + 1] - 0.05, EV[2 * k + 1] + 0.65, 120]);
    else shots = F.landings.map((l, k) => [F.origin, l, EV[2 * k], EV[2 * k + 1], 260]);
    const ev = [];
    shots.forEach(([, , t0, t1], k) => { ev.push([t0, golf ? 'swing' : cricket ? 'hit' : 'release']); ev.push([t1, golf && k === 2 ? 'score' : 'land']); });
    if (!golf) ev.push([EV[6], 'score']);
    const scoreAt = golf ? EV[5] : EV[6];
    return {
      scoreAt,
      events: ev,
      draw(t, s) {
        const a = appear(t);
        if (a <= 0) return;
        ctx.save();
        ctx.globalAlpha = a;
        if (golf) {
          const [hx, hy] = F.hole;
          ctx.save(); ctx.strokeStyle = C.white; ctx.lineWidth = 4 / s; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx, hy - 110 / s); ctx.stroke();
          const wv = Math.sin(t * 5) * 6 / s;
          ctx.fillStyle = C.blue; gpoly([[hx, hy - 110 / s], [hx + 54 / s, hy - 96 / s + wv], [hx, hy - 80 / s]]); ctx.fill(); ctx.restore();
        }
        if (cricket) {
          tokenAt(...F.bowl, 15, C.blue, C.white, s);
          [[30, 60], [100, 60], [40, 110], [95, 112], [65, 30], [20, 90], [110, 90], [65, 128]].forEach(p => tokenAt(...p, 12, C.blue, C.white, s));
          tokenAt(...F.bat, 15, C.white, C.green, s);
        }
        let ball = null;
        shots.forEach(([from, to, t0, t1, hgt], k) => {
          const u = prog(t, t0, t1);
          if (t >= t0 && (t < t1 || k === shots.length - 1 || t < shots[k + 1][2])) {
            const p = golf && k === 2 ? lerp2(from, to, ease.out(u)) : lerp2(from, to, u);
            ball = [...p, hgt * Math.sin(Math.PI * Math.min(u, 1))];
            if (u >= 1 && golf && k === 2) ball = null;
          }
          if (u > 0) {
            ctx.save(); ctx.globalAlpha *= 0.55 * (1 - prog(t, t1 + 0.5, t1 + 1.5) * 0.6);
            ctx.strokeStyle = C.white; ctx.lineWidth = 3 / s; ctx.setLineDash([6 / s, 8 / s]);
            ctx.beginPath();
            for (let j = 0; j <= 30 * Math.min(u, 1); j++) {
              const q = lerp2(from, to, j / 30), hh = (hgt * Math.sin((Math.PI * j) / 30)) / s;
              j ? ctx.lineTo(q[0], q[1] - hh * 0.6) : ctx.moveTo(q[0], q[1]);
            }
            ctx.stroke(); ctx.restore();
          }
          if (u >= 1 && !golf && !cricket) {
            // a marker where it landed
            ctx.save(); ctx.strokeStyle = C.white; ctx.lineWidth = 3 / s; ctx.beginPath(); ctx.moveTo(to[0], to[1]); ctx.lineTo(to[0], to[1] - 30 / s); ctx.stroke();
            ctx.fillStyle = k === shots.length - 1 ? C.blue : C.white; gpoly([[to[0], to[1] - 30 / s], [to[0] + 20 / s, to[1] - 24 / s], [to[0], to[1] - 18 / s]]); ctx.fill(); ctx.restore();
          }
          rippleAt(...to, t, t1, s, C.white, k === shots.length - 1 ? 100 : 46, 0.7);
        });
        // the athlete
        if (jump) {
          const k = shots.findIndex(([, , t0]) => t < t0 + 0.8);
          const [from, to, t0, t1] = shots[k < 0 ? shots.length - 1 : k];
          const runStart = [from[0], F.h - 4];
          let p, lf = 0;
          if (t < t0) p = lerp2(runStart, from, ease.in(prog(t, t0 - 1.1, t0)));
          else if (t < t1) { const u = prog(t, t0, t1); p = lerp2(from, to, u); lf = 130 * Math.sin(Math.PI * u); }
          else p = to;
          tokenAt(...p, 16, C.white, C.blue, s, lf);
        } else if (!golf && !cricket) {
          const spin = t * 6;
          tokenAt(F.origin[0] + Math.cos(spin) * (10 / s), F.origin[1] + Math.sin(spin) * (6 / s), 16, C.white, C.blue, s);
        }
        if (ball && !jump) tokenAt(ball[0], ball[1], golf ? 7 : 9, C.white, C.ink, s, ball[2]);
        if (!golf) rippleAt(...shots[shots.length - 1][1], t, EV[6], s, C.white, 130, 1.0);
        else rippleAt(...F.hole, t, EV[5] + 0.15, s, C.white, 130, 1.0);
        ctx.restore();
      },
    };
  },

  // bowling, curling, boules and billiards: things that roll or slide
  roll(F, v) {
    if (v === 'billiard') return PLAYS.billiard(F);
    const curling = v === 'curling', boules = v === 'boules';
    const throws = [[EV[0], EV[1]], [EV[2], EV[3]], [EV[4], EV[5]]];
    const ev = [];
    throws.forEach(([t0, t1]) => { ev.push([t0, 'release']); ev.push([t1, 'impact']); });
    ev.push([EV[6], 'score']);
    // where each throw ends
    const ends = curling ? [[4.9, 7.4], [3.2, 5.0], [4, 6]] : boules ? [[3.6, 4.6], [2.3, 3.4], [3.05, 4.05]] : [[3.4, 5.4], [3.3, 5.4], [3.2, 5.4]];
    const jack = [3, 4];
    const pins = F.pins || [];
    return {
      scoreAt: EV[6],
      events: ev,
      draw(t, s) {
        const a = appear(t);
        if (a <= 0) return;
        ctx.save();
        ctx.globalAlpha = a;
        if (boules) tokenAt(...jack, 9, C.white, C.ink, s);
        if (!curling && !boules) {
          // the pins fly on each strike and come back for the next ball
          pins.forEach((p, i) => {
            let q = p, alpha = 1, rot = 0;
            throws.forEach(([t0, t1], k) => {
              if (t < t1) return;
              const nextRelease = throws[k + 1] ? throws[k + 1][0] : 99;
              if (t > nextRelease - 0.4) { alpha = prog(t, nextRelease - 0.4, nextRelease); q = p; return; }
              const r = rand(i * 7 + k * 13 + 3);
              const ang = -Math.PI / 2 + (r() - 0.5) * 2.4 + (p[0] - F.w / 2) * 0.5;
              const d = (1.5 + r() * 3) * ease.out(prog(t, t1, t1 + 0.7));
              q = [p[0] + Math.cos(ang) * d, p[1] + Math.sin(ang) * d];
              rot = (t - t1) * (r() - 0.5) * 12;
              alpha = 1 - prog(t, t1 + 0.6, t1 + 1.0);
            });
            if (alpha <= 0) return;
            ctx.save(); ctx.globalAlpha *= alpha; ctx.translate(...q); ctx.rotate(rot);
            disc(0, 0, 13 / s, C.ink); disc(0, 0, 10.5 / s, C.white); disc(0, 0, 4 / s, C.blue);
            ctx.restore();
          });
        }
        throws.forEach(([t0, t1], k) => {
          const u = prog(t, t0, t1);
          if (u <= 0) return;
          const start = boules ? [F.start[0], F.start[1]] : F.start;
          const end = ends[k];
          // curling stones and bowling balls curl on the way
          const curl = curling ? 0.9 : boules ? 0 : -0.8;
          const kk = boules ? u : curling ? ease.out(u) : u * u * (3 - 2 * u) * 0.35 + u * 0.65;
          const p = [lerp(start[0], end[0], kk) + curl * Math.sin(Math.PI * kk), lerp(start[1], end[1], kk)];
          let q = p;
          if (curling && k === 1 && t > t1) q = end;
          if (curling && k === 0 && t > throws[1][1]) q = lerp2(end, [6.6, 3.5], ease.out(prog(t, throws[1][1], throws[1][1] + 0.6)));
          const lift = boules ? 120 * Math.sin(Math.PI * Math.min(u / 0.7, 1)) * (u < 0.7 ? 1 : 0) : 0;
          if (!boules && !curling && t > t1 + 0.3) return; // the ball is gone into the pit
          if (curling) {
            const col = k % 2 ? C.green : C.blue;
            tokenAt(...q, 20, col, C.ink, s);
            disc(q[0], q[1], 7 / s, C.white);
          } else tokenAt(...q, boules ? 13 : 16, boules ? C.blue : C.blue, C.ink, s, lift);
          rippleAt(...end, t, t1, s, C.white, 50, 0.6);
        });
        rippleAt(...(curling ? F.house : boules ? jack : [F.w / 2, 4]), t, EV[6], s, curling ? C.ink : C.white, 120, 1.0);
        ctx.restore();
      },
    };
  },

  // billiards: the break, then balls into the pockets one by one
  billiard(F) {
    const { w, h } = F;
    const cols = [C.blue, C.green, C.beige, C.blueLight, C.green, C.blue, C.ink];
    const rack = [[0, 0], [-1, -1], [1, -1], [-2, -2], [0, -2], [2, -2], [-1, -3]].map(([x, y]) => [w / 2 + x * 0.034, h * 0.25 + y * 0.06]);
    const spread = [[0.25, 0.9], [0.95, 0.35], [0.3, 1.5], [0.85, 1.1], [0.55, 0.62], [0.2, 0.2], [0.6, 1.8]].map(([x, y]) => [x * w, y]);
    const shots = [1, 2, 3, 4, 5].map((k, j) => ({ ball: [0, 1, 3, 5, 6][j], t: EV[k] }));
    const pocketOf = p => F.pockets.reduce((b, q) => (Math.hypot(q[0] - p[0], q[1] - p[1]) < Math.hypot(b[0] - p[0], b[1] - p[1]) ? q : b));
    return {
      scoreAt: EV[5] + 0.5,
      events: [[EV[0], 'impact'], ...shots.map(({ t }) => [t, 'impact']), ...shots.map(({ t }) => [t + 0.5, 'pocket']), [EV[6], 'score']],
      draw(t, s) {
        const a = appear(t);
        if (a <= 0) return;
        ctx.save();
        ctx.globalAlpha = a;
        const br = ease.out(prog(t, EV[0], EV[0] + 1.0));
        let cue = lerp2([w / 2, h * 0.78], [w / 2, h * 0.27], ease.in(prog(t, EV[0] - 0.4, EV[0])));
        if (t > EV[0]) cue = lerp2([w / 2, h * 0.27], [w * 0.5, h * 0.55], ease.out(prog(t, EV[0], EV[0] + 1.0)));
        rack.forEach((r, i) => {
          let p = lerp2(r, spread[i], br);
          const shot = shots.find(sh => sh.ball === i);
          if (shot) {
            const u = prog(t, shot.t, shot.t + 0.5);
            if (u >= 1) return;
            p = lerp2(p, pocketOf(spread[i]), ease.in(u));
          }
          tokenAt(...p, 11, cols[i], C.ink, s);
        });
        shots.forEach(({ ball, t: st }) => {
          const target = spread[ball], pk = pocketOf(target);
          const dir = [target[0] - pk[0], target[1] - pk[1]], len = Math.hypot(...dir);
          const contact = [target[0] + (dir[0] / len) * 0.06, target[1] + (dir[1] / len) * 0.06];
          if (t > st - 0.45 && t < st + 1.0) {
            const prev = cue;
            cue = lerp2(prev, contact, ease.in(prog(t, st - 0.45, st)));
          }
          rippleAt(...pk, t, st + 0.5, s, C.white, 40, 0.6);
        });
        tokenAt(...cue, 11, C.white, C.ink, s);
        ctx.restore();
      },
    };
  },

  // chess: a famous short game; draughts and go: moves on the beat
  board(F, v) {
    if (v === 'go') {
      const stones = [[3, 3, 1], [15, 15, 0], [15, 3, 1], [3, 15, 0], [9, 9, 1], [5, 9, 0], [9, 5, 1], [13, 9, 0], [9, 13, 1], [6, 6, 0], [12, 12, 1], [12, 6, 0], [6, 12, 1], [10, 10, 0]];
      return {
        scoreAt: EV[6],
        events: EV.map((t, i) => [t, i < 6 ? 'move' : 'score']),
        draw(t, s) {
          const a = appear(t);
          if (a <= 0) return;
          ctx.save(); ctx.globalAlpha = a;
          stones.forEach(([x, y, c], i) => {
            const t0 = i < 7 ? 5.8 : EV[i - 7];
            const u = ease.back(prog(t, t0 - 0.12, t0 + 0.12));
            if (u <= 0) return;
            tokenAt(x, y, 18 * u, c ? C.ink : C.white, C.ink, s);
            if (i >= 7) rippleAt(x, y, t, t0, s, C.green, 40, 0.5);
          });
          rippleAt(10, 10, t, EV[6], s, C.green, 120, 1.0);
          ctx.restore();
        },
      };
    }
    if (v === 'checkers') {
      const start = [];
      for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) if ((x + y) % 2 === 1 && (y < 3 || y > 4)) start.push([x, y, y < 3 ? 1 : 0]);
      const moves = [[[2, 5], [3, 4]], [[5, 2], [4, 3]], [[1, 6], [2, 5]], [[6, 1], [5, 2]], [[3, 4], [5, 2]], [[6, 1], [4, 3]], [[2, 5], [3, 4]]];
      return {
        scoreAt: EV[6],
        events: EV.map((t, i) => [t, i < 6 ? 'move' : 'score']),
        draw(t, s) {
          const a = appear(t);
          if (a <= 0) return;
          ctx.save(); ctx.globalAlpha = a;
          const pos = start.map(p => ({ x: p[0], y: p[1], c: p[2], alive: 1 }));
          moves.forEach(([from, to], i) => {
            const pc = pos.find(p => p.alive > 0 && p.x === from[0] && p.y === from[1]);
            if (!pc) return;
            const u = ease.inOut(prog(t, EV[i] - 0.45, EV[i]));
            if (u <= 0) return;
            if (Math.abs(to[0] - from[0]) === 2) {
              const mid = pos.find(p => p.x === (from[0] + to[0]) / 2 && p.y === (from[1] + to[1]) / 2);
              if (mid && t > EV[i]) mid.alive = 1 - prog(t, EV[i], EV[i] + 0.4);
            }
            pc.x = lerp(from[0], to[0], u); pc.y = lerp(from[1], to[1], u); pc.lift = 40 * Math.sin(Math.PI * u);
          });
          pos.forEach(p => tokenAt(p.x + 0.5, p.y + 0.5, 30, p.c ? C.blue : C.white, C.ink, s, p.lift || 0, p.alive));
          moves.forEach(([, to], i) => rippleAt(to[0] + 0.5, to[1] + 0.5, t, EV[i], s, C.white, 40, 0.5));
          ctx.restore();
        },
      };
    }
    // chess: 1.e4 e5 2.Bc4 Nc6 3.Qh5 Nf6 4.Qxf7#
    const sq = n => ['abcdefgh'.indexOf(n[0]), 8 - Number(n[1])];
    const back = 'RNBQKBNR';
    const pieces = [];
    for (let i = 0; i < 8; i++) {
      pieces.push({ p: back[i], w: 1, at: [i, 7] }, { p: 'P', w: 1, at: [i, 6] }, { p: back[i], w: 0, at: [i, 0] }, { p: 'P', w: 0, at: [i, 1] });
    }
    const moves = [['e2', 'e4'], ['e7', 'e5'], ['f1', 'c4'], ['b8', 'c6'], ['d1', 'h5'], ['g8', 'f6'], ['h5', 'f7']];
    const GL = { K: ['♔', '♚'], Q: ['♕', '♛'], R: ['♖', '♜'], B: ['♗', '♝'], N: ['♘', '♞'], P: ['♙', '♟'] };
    return {
      scoreAt: EV[6],
      events: EV.map((t, i) => [t, i < 6 ? 'move' : 'score']),
      draw(t, s) {
        const a = appear(t);
        if (a <= 0) return;
        ctx.save(); ctx.globalAlpha = a;
        const state = pieces.map(p => ({ ...p, x: p.at[0], y: p.at[1], alive: 1, lift: 0 }));
        moves.forEach(([f, to], i) => {
          const [fx, fy] = sq(f), [tx, ty] = sq(to);
          const pc = state.find(p => p.at[0] === fx && p.at[1] === fy && p.alive);
          const u = ease.inOut(prog(t, EV[i] - 0.5, EV[i]));
          if (!pc || u <= 0) return;
          const victim = state.find(p => p !== pc && p.at[0] === tx && p.at[1] === ty);
          if (victim && t > EV[i]) victim.alive = 1 - prog(t, EV[i], EV[i] + 0.3);
          pc.x = lerp(fx, tx, u); pc.y = lerp(fy, ty, u); pc.lift = Math.sin(Math.PI * u);
          pc.at = u >= 1 ? [tx, ty] : pc.at;
        });
        // the mated king's square glows
        const mu = prog(t, EV[6], EV[6] + 0.4);
        if (mu > 0) { ctx.save(); ctx.globalAlpha *= 0.55 + 0.25 * Math.sin(t * 6); FL.fill(4, 0, 1, 1, C.blue); ctx.restore(); }
        ctx.save();
        ctx.scale(1 / s, 1 / s);
        ctx.font = `700 ${Math.round(s * 0.8)}px Pieces`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        state.forEach(p => {
          if (p.alive <= 0) return;
          const [solid, outline] = [GL[p.p][1], GL[p.p][0]];
          const x = (p.x + 0.5) * s, y = (p.y + 0.52) * s - p.lift * s * 0.25;
          ctx.globalAlpha = a * p.alive;
          ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillText(solid, x + 3, y + 4 + p.lift * 10);
          ctx.fillStyle = p.w ? C.white : C.blue; ctx.fillText(solid, x, y);
          ctx.fillStyle = C.ink; ctx.fillText(outline, x, y);
        });
        ctx.restore();
        moves.forEach(([, to], i) => { const [x, y] = sq(to); rippleAt(x + 0.5, y + 0.5, t, EV[i], s, C.white, 36, 0.5); });
        rippleAt(4.5, 0.5, t, EV[6], s, C.white, 120, 1.0);
        ctx.restore();
      },
    };
  },

  // jumps and spins across the floor, landing on the beat
  flip(F, v) {
    const { w, h } = F;
    const pts = [[0.25, 0.8], [0.7, 0.68], [0.3, 0.52], [0.72, 0.4], [0.28, 0.28], [0.68, 0.18], [0.5, 0.48]].map(([x, y]) => [x * w, y * h]);
    const AIR = 0.6;
    return {
      scoreAt: EV[6],
      events: [...EV.map(t => [t - AIR, 'jump']), ...EV.slice(0, 6).map(t => [t, 'land']), [EV[6], 'score']].sort((a, b) => a[0] - b[0]),
      draw(t, s) {
        const a = appear(t);
        if (a <= 0) return;
        ctx.save(); ctx.globalAlpha = a;
        let p = pts[0], lift = 0, spin = 0;
        const start = [0.2 * w, 0.92 * h];
        for (let i = 0; i < 7; i++) {
          const from = i ? pts[i - 1] : start, t0 = EV[i] - AIR;
          if (t < t0) { if (i === 0) p = lerp2(start, start, 0); break; }
          const u = prog(t, t0, EV[i]);
          p = lerp2(from, pts[i], ease.inOut(u));
          lift = 150 * Math.sin(Math.PI * u);
          spin = u * Math.PI * 2;
        }
        // the path so far, like a ribbon on the floor
        ctx.save(); ctx.strokeStyle = 'rgba(248,243,231,0.35)'; ctx.lineWidth = 3 / s; ctx.setLineDash([6 / s, 8 / s]);
        const done = EV.filter(e => t >= e).length;
        gpoly([start, ...pts.slice(0, done), p], false); ctx.stroke(); ctx.restore();
        tokenAt(...p, 22, C.white, C.green, s, lift);
        if (lift > 2) {
          ctx.save(); ctx.strokeStyle = C.blueLight; ctx.lineWidth = 6 / s; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.arc(p[0], p[1] - lift / s, 40 / s, spin, spin + 2.2); ctx.stroke();
          ctx.strokeStyle = C.white; ctx.beginPath(); ctx.arc(p[0], p[1] - lift / s, 40 / s, spin + Math.PI, spin + Math.PI + 1.4); ctx.stroke();
          ctx.restore();
        }
        EV.forEach((e, i) => rippleAt(...pts[i], t, e, s, C.white, i === 6 ? 130 : 46, i === 6 ? 1.0 : 0.6));
        rippleAt(...pts[6], t, EV[6] + 0.2, s, C.white, 80, 0.9);
        ctx.restore();
      },
    };
  },

  // a lift: pull, lock out overhead, three white lights, drop
  lift(F) {
    const floor = F.floor, low = floor - 11, hips = floor - 34, top = floor - 60;
    return {
      scoreAt: EV[6],
      events: [[EV[0], 'pull'], [EV[1], 'lock'], [EV[2], 'light'], [EV[3], 'light'], [EV[4], 'light'], [EV[5], 'drop'], [EV[6], 'score']],
      draw(t, s) {
        const a = appear(t);
        if (a <= 0) return;
        ctx.save(); ctx.globalAlpha = a;
        let y = low;
        if (t > EV[0] - 0.3) y = lerp(low, hips, ease.out(prog(t, EV[0] - 0.3, EV[0] + 0.4)));
        if (t > EV[1] - 0.35) y = lerp(hips, top, ease.out(prog(t, EV[1] - 0.35, EV[1])));
        if (t > EV[1]) y = top + Math.sin((t - EV[1]) * 3) * 0.4;
        if (t > EV[5] - 0.32) y = lerp(top, low, ease.in(prog(t, EV[5] - 0.32, EV[5])));
        if (t > EV[5]) y = low - 6 * Math.abs(Math.sin((t - EV[5]) * 9)) * Math.exp(-(t - EV[5]) * 5);
        // the lights come on one by one
        F.lights.forEach(([x, ly], i) => {
          const on = prog(t, EV[2 + i], EV[2 + i] + 0.15);
          if (on > 0) { disc(x, ly, 5.2 * ease.back(on), C.white); rippleAt(x, ly, t, EV[2 + i], s, C.white, 50, 0.6); }
        });
        // a ghost of the bar's path
        ctx.save(); ctx.strokeStyle = 'rgba(248,243,231,0.25)'; ctx.lineWidth = 3 / s; ctx.setLineDash([5 / s, 7 / s]); ctx.beginPath(); ctx.moveTo(50, low); ctx.lineTo(50, Math.min(y, low)); ctx.stroke(); ctx.restore();
        ctx.save(); ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.ellipse(50, floor + 1, 38 * (1 - (low - y) / 120), 2.2, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        ctx.save(); ctx.strokeStyle = C.ink; ctx.lineWidth = 7 / s; ctx.beginPath(); ctx.moveTo(10, y); ctx.lineTo(90, y); ctx.stroke(); ctx.restore();
        for (const sd of [-1, 1]) {
          [[30, 11, C.blue], [34.6, 11, C.green], [38.8, 8, C.white], [42.2, 6, C.ink]].forEach(([x, r, col]) => {
            ctx.save(); ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(50 + sd * x - 2.1, y - r, 4.2, 2 * r, 1); ctx.fill();
            ctx.strokeStyle = C.ink; ctx.lineWidth = 2 / s; ctx.stroke(); ctx.restore();
          });
          ctx.save(); ctx.fillStyle = C.ink; ctx.fillRect(50 + sd * 26 - 1.2, y - 3, 2.4, 6); ctx.restore();
        }
        // chalk dust when it leaves and meets the floor
        for (const t0 of [EV[0] - 0.3, EV[5]]) {
          const u = prog(t, t0, t0 + 0.8);
          if (u <= 0 || u >= 1) continue;
          const rr = rand(Math.round(t0 * 100));
          for (let k = 0; k < 18; k++) {
            const ang = Math.PI + rr() * Math.PI, d = (20 + rr() * 50) * ease.out(u);
            disc(50 + (rr() - 0.5) * 70 + Math.cos(ang) * d * 0.3, floor - 2 + Math.sin(ang) * d * 0.4, (2 + rr() * 3) * (1 - u) / s * 6, 'rgba(241,232,213,0.7)');
          }
        }
        rippleAt(50, top, t, EV[1], s, C.white, 90, 0.8);
        rippleAt(50, top, t, EV[6], s, C.white, 160, 1.1);
        ctx.restore();
      },
    };
  },

  // up the route, camp by camp, and a flag on the summit
  climb(F) {
    const pts = F.climb;
    const at = t => {
      if (t < 5.9) return pts[0];
      for (let i = 0; i < 7; i++) {
        const t0 = i ? EV[i - 1] : 5.9;
        if (t < EV[i]) return lerp2(pts[i], pts[i + 1], ease.inOut(prog(t, t0 + (i ? 0.25 : 0), EV[i])));
      }
      return pts[7];
    };
    return {
      scoreAt: EV[6],
      events: EV.map((e, i) => [e, i < 6 ? 'step' : 'score']),
      draw(t, s) {
        const a = appear(t);
        if (a <= 0) return;
        ctx.save(); ctx.globalAlpha = a;
        strokePoly(pts, 'rgba(248,243,231,0.4)', 3, s, [6, 9]);
        const p = at(t);
        const done = EV.filter(e => t >= e).length;
        strokePoly([...pts.slice(0, done + 1), p], C.white, 5, s, [10, 7]);
        pts.slice(1, 7).forEach((q, i) => {
          if (t < EV[i]) return;
          const u = ease.back(prog(t, EV[i], EV[i] + 0.3));
          ctx.save(); ctx.translate(...q); ctx.scale(u / s, u / s);
          gpoly([[0, -22], [18, 8], [-18, 8]]); ctx.fillStyle = C.white; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.stroke();
          gpoly([[0, -22], [5, 8], [-5, 8]]); ctx.fillStyle = C.green; ctx.fill();
          ctx.restore();
          rippleAt(...q, t, EV[i], s, C.white, 40, 0.6);
        });
        // the summit flag rises
        const fu = ease.back(prog(t, EV[6], EV[6] + 0.5));
        if (fu > 0) {
          const [x, y] = pts[7];
          ctx.save(); ctx.strokeStyle = C.ink; ctx.lineWidth = 4 / s; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - (90 * fu) / s); ctx.stroke();
          const wv = Math.sin(t * 6) * 5 / s;
          ctx.fillStyle = C.green; gpoly([[x, y - (90 * fu) / s], [x + (60 * fu) / s, y - (78 * fu) / s + wv], [x, y - (56 * fu) / s]]); ctx.fill(); ctx.restore();
        }
        tokenAt(...p, 16, C.white, C.blue, s);
        rippleAt(...pts[7], t, EV[6], s, C.white, 140, 1.1);
        ctx.restore();
      },
    };
  },

  // along a course: over fences and ramps, through gates, or through the air
  course(F, v) {
    const c = F.course;
    const wk = walker(c.pts);
    const START = 5.9;
    const pAt = t => {
      if (t <= START) return 0;
      const knots = [[START, 0], ...EV.map((e, k) => [e, (k + 1) / 7])];
      for (let k = 1; k < knots.length; k++) if (t <= knots[k][0]) return lerp(knots[k - 1][1], knots[k][1], prog(t, knots[k - 1][0], knots[k][0]));
      return 1;
    };
    const hops = c.hops;
    const ev = [];
    EV.slice(0, 6).forEach(e => { if (hops) { ev.push([e - 0.22, 'jump']); ev.push([e + 0.22, 'land']); } else ev.push([e, 'pass']); });
    ev.push([EV[6], 'finish']);
    return {
      scoreAt: EV[6],
      events: ev,
      draw(t, s) {
        const a = appear(t);
        if (a <= 0) return;
        ctx.save(); ctx.globalAlpha = a;
        strokePoly(c.pts, 'rgba(248,243,231,0.35)', 3, s, [6, 9]);
        if (c.gates) {
          for (let k = 1; k <= 6; k++) {
            const [x, y, hd] = wk.at(k / 7);
            const nx = -Math.sin(hd), ny = Math.cos(hd), d = 7;
            for (const sd of [-1, 1]) {
              const gx = x + nx * d * sd, gy = y + ny * d * sd;
              ctx.save(); ctx.strokeStyle = C.ink; ctx.lineWidth = 3 / s; ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx, gy - 40 / s); ctx.stroke();
              ctx.fillStyle = k % 2 ? C.blue : C.green; gpoly([[gx, gy - 40 / s], [gx + 22 / s, gy - 32 / s], [gx, gy - 24 / s]]); ctx.fill(); ctx.restore();
            }
          }
        }
        const p = pAt(t);
        // the trail
        ctx.save(); ctx.lineCap = 'round';
        for (let k = 1; k <= 12; k++) {
          const q0 = wk.at(Math.max(0, p - k * 0.01)), q1 = wk.at(Math.max(0, p - (k - 1) * 0.01));
          ctx.strokeStyle = C.white; ctx.globalAlpha = a * 0.5 * (1 - k / 12); ctx.lineWidth = (12 * (1 - k / 14)) / s;
          ctx.beginPath(); ctx.moveTo(q0[0], q0[1]); ctx.lineTo(q1[0], q1[1]); ctx.stroke();
        }
        ctx.restore();
        let lift = 0;
        if (hops) EV.slice(0, 6).forEach(e => { const u = prog(t, e - 0.22, e + 0.22); if (u > 0 && u < 1) lift = 110 * Math.sin(Math.PI * u); });
        if (c.fly) lift = 60 * (1 - p) + 10 * Math.sin(t * 2);
        const [x, y, hd] = wk.at(p);
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = 'rgba(0,0,0,0.22)';
        ctx.beginPath(); ctx.ellipse((4 + lift * 0.4) / s, (5 + lift * 0.8) / s, 20 / s, 10 / s, hd, 0, Math.PI * 2); ctx.fill();
        ctx.translate(0, -lift / s);
        ctx.rotate(hd);
        const k = 1 + lift / 200;
        if (c.fly) {
          ctx.rotate(-hd);
          ctx.scale(0.22 * k / s, 0.22 * k / s);
          GLYPHS.wing();
        } else {
          ctx.beginPath(); ctx.ellipse(0, 0, (22 * k) / s, (11 * k) / s, 0, 0, Math.PI * 2);
          ctx.fillStyle = C.white; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 3 / s; ctx.stroke();
          disc((10 * k) / s, 0, (5 * k) / s, C.green);
        }
        ctx.restore();
        EV.slice(0, 6).forEach((e, k2) => { const [qx, qy] = wk.at((k2 + 1) / 7); rippleAt(qx, qy, t, e + (hops ? 0.22 : 0), s, C.white, 40, 0.6); });
        const [fx, fy] = wk.at(1);
        rippleAt(fx, fy, t, EV[6], s, C.white, 130, 1.0);
        ctx.restore();
      },
    };
  },

  // a knockout bracket: winners move up on the beat to the trophy
  bracket(F) {
    const L = F.levels;
    const wins = [[0, 3, 4, 7], [1, 2], [1]]; // the winner's index in the level below, per match
    const matches = [];
    [0, 1, 2, 3].forEach(i => matches.push({ lv: 1, i, from: L[0][wins[0][i]], to: L[1][i], t: EV[i] }));
    [0, 1].forEach(i => matches.push({ lv: 2, i, from: L[1][wins[1][i]], to: L[2][i], t: EV[4 + i] }));
    matches.push({ lv: 3, i: 0, from: L[2][1], to: L[3][0], t: EV[6] });
    return {
      scoreAt: EV[6],
      events: EV.map((e, i) => [e, i < 6 ? 'move' : 'score']),
      draw(t, s) {
        const a = appear(t);
        if (a <= 0) return;
        ctx.save(); ctx.globalAlpha = a;
        matches.forEach(m => {
          const u = ease.inOut(prog(t, m.t - 0.5, m.t));
          if (u <= 0) return;
          const path = [[m.from[0], m.from[1] - 4], [m.from[0], m.to[1] + 8], [m.to[0], m.to[1] + 8], [m.to[0], m.to[1] + 4]];
          const wk = walker(path);
          const pts = [];
          for (let k = 0; k <= 20; k++) pts.push(wk.at((k / 20) * u));
          strokePoly(pts, C.green, 9, s);
          strokePoly(pts, C.white, 3, s);
          if (u >= 1) {
            const k = ease.back(prog(t, m.t, m.t + 0.3));
            ctx.save(); ctx.fillStyle = C.green; ctx.beginPath(); ctx.roundRect(m.to[0] - 5 * k, m.to[1] - 4 * k, 10 * k, 8 * k, 2); ctx.fill(); ctx.restore();
            rippleAt(...m.to, t, m.t, s, C.white, 40, 0.5);
          }
        });
        const tu = ease.back(prog(t, EV[6], EV[6] + 0.5));
        if (tu > 0) {
          ctx.save(); ctx.translate(L[3][0][0], L[3][0][1] - 14); ctx.scale((0.55 * tu) / s, (0.55 * tu) / s);
          disc(0, 0, 110, C.green); GLYPHS.medal(); ctx.restore();
        }
        rippleAt(L[3][0][0], L[3][0][1] - 14, t, EV[6], s, C.white, 140, 1.1);
        ctx.restore();
      },
    };
  },
};
