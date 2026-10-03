/* Engineering calculators — civil, electrical, mechanical and a unit converter.
   Every result is an engineering estimate; texts live in assets/data/<lang>/tools.js */
(function () {
  'use strict';
  var MODS = window.PAGE_MODS = window.PAGE_MODS || {};

  /* ───────── number helpers (Latin digits) ───────── */
  function fx(x, d) {
    if (x == null || !isFinite(x)) return '—';
    d = d == null ? 2 : d;
    var s = (Math.round(x * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d);
    if (d > 0) s = s.replace(/\.?0+$/, '');
    var p = s.split('.');
    p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return p.join('.');
  }
  /* In right-to-left text, keep "40 °C", "230 V", "40 × 20 cm" in their written order (Unicode isolates) */
  function iso(s, rtl) {
    return rtl ? String(s).replace(/\([0-9A-Za-z][^()]*\)|[0-9A-Za-zØ°%][0-9A-Za-zØ°%.,:×\/²³~ ]*[0-9A-Za-z°%²³]|[0-9]/g, function (m) { return '\u2066' + m + '\u2069'; }) : s;
  }
  function ceil(x) { return isFinite(x) ? Math.ceil(x - 1e-9) : NaN; }
  function nextOf(list, x) { for (var i = 0; i < list.length; i++) if (list[i] >= x - 1e-9) return list[i]; return null; }

  /* ───────── tables ───────── */
  /* Copper, PVC 70 °C, ambient 30 °C — IEC 60364-5-52 (methods B1 and C) */
  var SIZES = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240];
  var AMP = {
    B1: { 2: [17.5, 24, 32, 41, 57, 76, 101, 125, 151, 192, 232, 269, 309, 353, 415], 3: [15.5, 21, 28, 36, 50, 68, 89, 110, 134, 171, 207, 239, 275, 314, 369] },
    C: { 2: [19.5, 27, 36, 46, 63, 85, 112, 138, 168, 213, 258, 299, 344, 392, 461], 3: [17.5, 24, 32, 41, 57, 76, 96, 119, 144, 184, 223, 259, 299, 341, 403] }
  };
  var BREAKERS = [6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 320, 400, 500, 630, 800];
  var RHO = { cu: 0.0225, al: 0.036 };           /* Ω·mm²/m at working temperature */
  var AL_FACTOR = 0.78;                           /* aluminium ampacity vs copper */
  var TEMP = { 30: 1, 35: 0.94, 40: 0.87, 45: 0.79, 50: 0.71 };   /* PVC ambient correction */
  var GRADES = { m10: [1, 3, 6, 0.6], m15: [1, 2, 4, 0.55], m20: [1, 1.5, 3, 0.5], m25: [1, 1, 2, 0.45] };   /* nominal mixes + w/c */
  var BLOCKS = { b20: [0.40, 0.20, 0.20], b15: [0.40, 0.20, 0.15], b10: [0.40, 0.20, 0.10] };
  var RATIO = { beam: 1.2, column: 2, slab: 0.35, footing: 0.4, wall: 0.5 };
  var KGM3 = { beam: [120, 180], column: [150, 250], slab: [80, 110], footing: [70, 110], wall: [60, 100] };
  var LUX = { corridor: 100, bedroom: 150, living: 200, kitchen: 300, classroom: 300, office: 500, meeting: 500, drawing: 750, workshop: 500, hospital: 1000, parking: 75 };
  var AC_UNITS = [9000, 12000, 18000, 24000, 30000, 36000, 48000, 60000];
  var CLIMATE = { moderate: 450, hot: 650, veryhot: 800 };        /* BTU/h per m² at 2.7 m ceiling */
  var SUN = { shade: 0.9, normal: 1, sunny: 1.15 };
  var ROUND_D = [100, 125, 150, 160, 200, 250, 315, 355, 400, 450, 500, 560, 630, 710, 800, 900, 1000, 1120, 1250, 1400, 1600];
  var BARS = [6, 8, 10, 12, 14, 16, 18, 20, 22, 25, 28, 32];

  var UNITS = {
    length: [['m', 1], ['cm', 0.01], ['mm', 0.001], ['km', 1000], ['in', 0.0254], ['ft', 0.3048], ['yd', 0.9144], ['mi', 1609.344]],
    area: [['m²', 1], ['cm²', 1e-4], ['mm²', 1e-6], ['km²', 1e6], ['ha', 1e4], ['dunam (2500 m²)', 2500], ['ft²', 0.09290304], ['in²', 0.00064516], ['acre', 4046.8564224]],
    volume: [['m³', 1], ['L', 0.001], ['mL', 1e-6], ['ft³', 0.028316846592], ['yd³', 0.764554857984], ['gal (US)', 0.003785411784]],
    mass: [['kg', 1], ['g', 0.001], ['t', 1000], ['lb', 0.45359237], ['oz', 0.028349523125]],
    force: [['N', 1], ['kN', 1000], ['kgf', 9.80665], ['tf', 9806.65], ['lbf', 4.4482216152605], ['kip', 4448.2216152605]],
    pressure: [['Pa', 1], ['kPa', 1000], ['MPa', 1e6], ['bar', 1e5], ['psi', 6894.757293168], ['ksi', 6894757.293168], ['kgf/cm²', 98066.5], ['atm', 101325]],
    power: [['W', 1], ['kW', 1000], ['hp', 745.69987158227], ['BTU/h', 0.29307107017], ['TR (ton)', 3516.8528420667]],
    energy: [['J', 1], ['kJ', 1000], ['kWh', 3.6e6], ['cal', 4.184], ['kcal', 4184], ['BTU', 1055.05585262]],
    flow: [['m³/s', 1], ['m³/h', 1 / 3600], ['L/s', 0.001], ['CFM', 0.0004719474432], ['GPM (US)', 0.0000630901964]],
    temp: [['°C'], ['°F'], ['K']]
  };
  function toC(v, u) { return u === '°F' ? (v - 32) * 5 / 9 : u === 'K' ? v - 273.15 : v; }
  function fromC(c, u) { return u === '°F' ? c * 9 / 5 + 32 : u === 'K' ? c + 273.15 : c; }

  /* ───────── calculators ─────────
     f: [key, kind, default, unit or options]   kind: num | sel
     calc(v) → { rows: [[key, value, unit, main?]], note?: key, warn?: key } */
  var DEFS = {
    concrete: {
      sec: 'civil', icon: 'civil',
      f: [['L', 'num', 5, 'm'], ['W', 'num', 4, 'm'], ['H', 'num', 0.15, 'm'], ['n', 'num', 1, '×'], ['grade', 'sel', 'm15', ['m10', 'm15', 'm20', 'm25']], ['waste', 'num', 5, '%'], ['bag', 'sel', '50', ['50', '42.5', '25']]],
      calc: function (v) {
        var g = GRADES[v.grade], V = v.L * v.W * v.H * v.n, Vw = V * (1 + v.waste / 100), Vd = Vw * 1.54, sum = g[0] + g[1] + g[2];
        var cem = Vd * g[0] / sum * 1440, sand = Vd * g[1] / sum, grav = Vd * g[2] / sum;
        return { rows: [['vol', fx(V, 3), 'm³'], ['bags', fx(ceil(cem / +v.bag), 0), '', true], ['cement', fx(cem, 0), 'kg'],
          ['sand', fx(sand, 2), 'm³', true], ['gravel', fx(grav, 2), 'm³', true], ['water', fx(cem * g[3], 0), 'L'],
          ['mix', g[0] + ' : ' + g[1] + ' : ' + g[2], ''], ['wc', fx(g[3], 2), '']] };
      },
      how: 'V × 1.54 = V(dry)  ·  cement = V(dry) × c / (c+s+g) × 1440 kg/m³'
    },
    block: {
      sec: 'civil', icon: 'layers',
      f: [['L', 'num', 10, 'm'], ['H', 'num', 3, 'm'], ['open', 'num', 2.5, 'm²'], ['size', 'sel', 'b20', ['b20', 'b15', 'b10']], ['joint', 'num', 1, 'cm'], ['mortar', 'sel', '4', ['4', '5', '6']], ['waste', 'num', 5, '%']],
      calc: function (v) {
        var b = BLOCKS[v.size], j = v.joint / 100, A = Math.max(0, v.L * v.H - v.open);
        var per = 1 / ((b[0] + j) * (b[1] + j)), n = A * per;
        var mPer = ((b[0] + j) * (b[1] + j) - b[0] * b[1]) * b[2];
        var mort = n * mPer, dry = mort * 1.33, r = +v.mortar;
        var cem = dry / (1 + r) * 1440;
        return { rows: [['area', fx(A, 2), 'm²'], ['blocks', fx(ceil(n * (1 + v.waste / 100)), 0), '', true], ['perM2', fx(per, 1), '/m²'],
          ['mortarV', fx(mort, 3), 'm³'], ['bags', fx(ceil(cem / 50), 0), '', true], ['sand', fx(dry * r / (1 + r), 2), 'm³', true]] };
      },
      how: 'n = A / ((l + j)(h + j))  ·  mortar = n × [(l + j)(h + j) − l·h] × t × 1.33'
    },
    rebar: {
      sec: 'civil', icon: 'branch',
      f: [['d', 'sel', '12', BARS.map(String)], ['len', 'num', 6, 'm'], ['count', 'num', 20, '×']],
      calc: function (v) {
        var d = +v.d, kgm = d * d / 162, total = v.len * v.count;
        return { rows: [['kgm', fx(kgm, 3), 'kg/m'], ['total', fx(total, 1), 'm'], ['weight', fx(kgm * total, 1), 'kg', true],
          ['tonnes', fx(kgm * total / 1000, 3), 't'], ['bars12', fx(ceil(total / 12), 0), '× 12 m', true]] };
      },
      how: 'kg/m = d² / 162   (d in mm;  = π/4 · d² · 7850 kg/m³)'
    },
    section: {
      sec: 'civil', icon: 'cube',
      f: [['type', 'sel', 'beam', ['beam', 'column', 'slab', 'footing', 'wall']], ['b', 'num', 300, 'mm'], ['h', 'num', 600, 'mm'], ['len', 'num', 5, 'm'], ['rho', 'num', 1.2, '%'], ['d', 'sel', '16', BARS.map(String)]],
      calc: function (v) {
        var As = v.rho / 100 * v.b * v.h, d = +v.d, ab = Math.PI * d * d / 4, n = Math.max(2, ceil(As / ab));
        var main = n * v.len * d * d / 162, V = v.b * v.h / 1e6 * v.len, rng = KGM3[v.type] || [80, 150];
        return { rows: [['As', fx(As / 100, 2), 'cm²'], ['nbars', n + ' × ' + d + ' mm', '', true], ['main', fx(main, 1), 'kg', true],
          ['vol', fx(V, 3), 'm³'], ['kgm3', fx(main / V, 0), 'kg/m³'], ['est', fx(V * rng[0], 0) + ' – ' + fx(V * rng[1], 0), 'kg']], note: 'n_' + v.type };
      },
      how: 'As = ρ · b · h  ·  n = As / (π d² / 4)  ·  W = n · L · d² / 162',
      onSel: function (k, v, set) { if (k === 'type') set('rho', RATIO[v.type]); }
    },
    cable: {
      sec: 'elec', icon: 'elec',
      f: [['sys', 'sel', '1', ['1', '3']], ['P', 'num', 5, 'kW'], ['pf', 'num', 0.9, 'cos φ'], ['len', 'num', 30, 'm'], ['vd', 'sel', '3', ['3', '5']], ['mat', 'sel', 'cu', ['cu', 'al']], ['method', 'sel', 'B1', ['B1', 'C']], ['temp', 'sel', '40', ['30', '35', '40', '45', '50']]],
      calc: function (v) {
        var three = v.sys === '3', V = three ? 400 : 230, I = v.P * 1000 / ((three ? Math.sqrt(3) : 1) * V * v.pf);
        var In = nextOf(BREAKERS, I), k = TEMP[v.temp] || 1, tab = AMP[v.method][three ? 3 : 2], pick = null;
        for (var i = 0; i < SIZES.length; i++) {
          if (v.mat === 'al' && SIZES[i] < 16) continue;
          var Iz = tab[i] * k * (v.mat === 'al' ? AL_FACTOR : 1);
          var dv = (three ? Math.sqrt(3) : 2) * v.len * I * RHO[v.mat] * v.pf / SIZES[i], pct = dv / V * 100;
          if (Iz >= (In || I) && pct <= +v.vd) { pick = { s: SIZES[i], Iz: Iz, pct: pct }; break; }
        }
        if (!pick) return { rows: [['Ib', fx(I, 1), 'A', true]], warn: 'tooBig' };
        return { rows: [['Ib', fx(I, 1), 'A'], ['In', In ? In : '—', 'A'], ['size', fx(pick.s, 1), 'mm²', true], ['Iz', fx(pick.Iz, 0), 'A'],
          ['vdrop', fx(pick.pct, 2), '%', true], ['volts', V + (three ? ' (3~)' : ' (1~)'), 'V']] };
      },
      how: 'I = P / (V · cos φ)  [3~: √3·V]  ·  Ib ≤ In ≤ Iz·k  ·  ΔV = 2·L·I·ρ·cos φ / S  [3~: √3]'
    },
    breaker: {
      sec: 'elec', icon: 'shield',
      f: [['sys', 'sel', '1', ['1', '3']], ['P', 'num', 3.5, 'kW'], ['pf', 'num', 0.9, 'cos φ'], ['load', 'sel', 'socket', ['light', 'socket', 'motor', 'heavy']], ['cont', 'sel', 'yes', ['yes', 'no']]],
      calc: function (v) {
        var three = v.sys === '3', V = three ? 400 : 230, I = v.P * 1000 / ((three ? Math.sqrt(3) : 1) * V * v.pf);
        var need = I * (v.cont === 'yes' ? 1.25 : 1), In = nextOf(BREAKERS, need);
        var curve = { light: 'B', socket: 'B / C', motor: 'C', heavy: 'D' }[v.load];
        var tab = AMP.C[three ? 3 : 2], cab = null;
        for (var i = 0; i < SIZES.length; i++) if (tab[i] >= (In || need)) { cab = SIZES[i]; break; }
        return { rows: [['Ib', fx(I, 1), 'A'], ['need', fx(need, 1), 'A'], ['In', In ? In : '—', 'A', true], ['curve', curve, '', true],
          ['kind', In && In > 125 ? 'MCCB' : 'MCB', ''], ['cable', cab ? fx(cab, 1) : '—', 'mm² Cu']], note: 'rcd' };
      },
      how: 'In ≥ 1.25 × Ib (continuous load)  →  next standard rating  ·  Iz ≥ In'
    },
    lux: {
      sec: 'elec', icon: 'bulb',
      f: [['L', 'num', 6, 'm'], ['W', 'num', 4, 'm'], ['room', 'sel', 'office', Object.keys(LUX)], ['E', 'num', 500, 'lx'], ['lm', 'num', 3600, 'lm'], ['uf', 'num', 0.6, 'UF'], ['mf', 'num', 0.8, 'MF'], ['eff', 'num', 110, 'lm/W']],
      calc: function (v) {
        var A = v.L * v.W, tot = v.E * A / (v.uf * v.mf), n = ceil(tot / v.lm);
        var cols = Math.max(1, Math.round(Math.sqrt(n * v.L / v.W))), rows = ceil(n / cols), W = n * v.lm / v.eff;
        return { rows: [['area', fx(A, 2), 'm²'], ['flux', fx(tot, 0), 'lm'], ['n', fx(n, 0), '', true], ['grid', cols + ' × ' + rows, '', true],
          ['achieved', fx(n * v.lm * v.uf * v.mf / A, 0), 'lx'], ['power', fx(W, 0), 'W'], ['wm2', fx(W / A, 1), 'W/m²']] };
      },
      how: 'N = E × A / (Φ × UF × MF)',
      onSel: function (k, v, set) { if (k === 'room') set('E', LUX[v.room]); }
    },
    ac: {
      sec: 'mech', icon: 'mech',
      f: [['L', 'num', 5, 'm'], ['W', 'num', 4, 'm'], ['H', 'num', 3, 'm'], ['people', 'num', 2, '×'], ['climate', 'sel', 'hot', ['moderate', 'hot', 'veryhot']], ['sun', 'sel', 'normal', ['shade', 'normal', 'sunny']], ['kitchen', 'sel', 'no', ['no', 'yes']], ['equip', 'num', 300, 'W']],
      calc: function (v) {
        var A = v.L * v.W, btu = A * CLIMATE[v.climate] * (v.H / 2.7) * SUN[v.sun];
        btu += Math.max(0, v.people - 2) * 600 + (v.kitchen === 'yes' ? 4000 : 0) + v.equip * 3.412;
        var unit = nextOf(AC_UNITS, btu);
        return { rows: [['area', fx(A, 1), 'm²'], ['btu', fx(btu, 0), 'BTU/h', true], ['ton', fx(btu / 12000, 2), 'TR', true],
          ['kw', fx(btu / 3412.14, 2), 'kW'], ['unit', unit ? fx(unit, 0) : '2 × ' + fx(nextOf(AC_UNITS, btu / 2), 0), 'BTU/h', true], ['cfm', fx(btu / 12000 * 400, 0), 'CFM']] };
      },
      how: 'BTU/h ≈ A × q(climate) × H/2.7 × sun + 600/person + 4000 (kitchen) + W × 3.412  ·  1 TR = 12,000 BTU/h'
    },
    duct: {
      sec: 'mech', icon: 'swap',
      f: [['Q', 'num', 800, ''], ['qu', 'sel', 'CFM', ['CFM', 'm³/h', 'L/s']], ['v', 'num', 5, 'm/s'], ['hh', 'num', 250, 'mm']],
      calc: function (v) {
        var q = v.Q * (v.qu === 'CFM' ? 0.0004719474432 : v.qu === 'm³/h' ? 1 / 3600 : 0.001), A = q / v.v;
        var D = Math.sqrt(4 * A / Math.PI) * 1000, Ds = nextOf(ROUND_D, D) || Math.round(D);
        /* rectangle with the same friction as the round duct (Huebscher) */
        function de(a, b) { return 1.3 * Math.pow(a * b, 0.625) / Math.pow(a + b, 0.25); }
        var lo = 10, hi = 20000, H = v.hh;
        for (var i = 0; i < 60; i++) { var mid = (lo + hi) / 2; if (de(mid, H) < D) lo = mid; else hi = mid; }
        var Wr = Math.ceil(hi / 50) * 50, cfm = q / 0.0004719474432, din = Ds / 25.4;
        var fr = 0.109136 * Math.pow(cfm, 1.9) / Math.pow(din, 5.02) * 8.1723;
        return { rows: [['A', fx(A, 4), 'm²'], ['D', fx(D, 0), 'mm'], ['Ds', String(Ds), 'mm', true], ['rect', Wr + ' × ' + H, 'mm', true],
          ['vAct', fx(q / (Math.PI * Math.pow(Ds / 1000, 2) / 4), 2), 'm/s'], ['fric', fx(fr, 2), 'Pa/m']], warn: Wr / H > 4 ? 'aspect' : null };
      },
      how: 'A = Q / v  ·  D = √(4A/π)  ·  De = 1.30 (a·b)^0.625 / (a+b)^0.25'
    },
    conv: {
      sec: 'conv', icon: 'swap', conv: true
    }
  };
  /* option labels that are the same in every language */
  var OPT = {
    bag: function (o) { return o + ' kg'; }, mortar: function (o) { return '1 : ' + o; }, d: function (o) { return o + ' mm'; },
    vd: function (o) { return o + ' %'; }, temp: function (o) { return o + ' °C'; },
    size: function (o) { return { b20: '40 × 20 × 20 cm', b15: '40 × 20 × 15 cm', b10: '40 × 20 × 10 cm' }[o]; },
    grade: function (o) { var g = GRADES[o]; return g[0] + ' : ' + g[1] + ' : ' + g[2]; }
  };
  var SECS = [['civil', 'civil'], ['elec', 'elec'], ['mech', 'mech'], ['conv', 'swap']];

  /* ───────── rendering ───────── */
  function render(A, sub) {
    var T = A.t('') || {}, esc = A.esc, icon = A.icon;
    var tabs = '<nav class="p-tabs" id="toolTabs"><div class="p-tabs-in">' + SECS.map(function (s) {
      return '<button data-tsec="' + s[0] + '">' + icon(s[1]) + esc((T.secs || {})[s[0]]) + '</button>';
    }).join('') + '</div></nav>';
    var html = tabs + '<p class="tool-note sec reveal">' + icon('info') + '<span>' + esc(T.disclaimer) + '</span></p>';
    SECS.forEach(function (s) {
      var list = Object.keys(DEFS).filter(function (k) { return DEFS[k].sec === s[0]; });
      html += '<section class="sec tool-sec" id="t-' + s[0] + '"><header class="sec-head">' + A.label((T.secLabels || {})[s[0]]) + A.h2((T.secTitles || {})[s[0]]) + '</header>' +
        '<div class="calcs' + (list.length === 1 ? ' one' : '') + '">' + list.map(function (k) { return card(A, T, k); }).join('') + '</div></section>';
    });
    return html;
  }
  function card(A, T, id) {
    var d = DEFS[id], c = (T.c || {})[id] || {}, esc = A.esc;
    var body;
    if (d.conv) {
      var cats = Object.keys(UNITS);
      body = '<div class="cf"><label class="fld"><span>' + esc(c.cat) + '</span><select data-k="cat">' + cats.map(function (k) {
        return '<option value="' + k + '">' + esc(iso((c.cats || {})[k] || k, A.rtl)) + '</option>';
      }).join('') + '</select></label>' +
        '<label class="fld"><span>' + esc(c.value) + '</span><input type="number" inputmode="decimal" step="any" data-k="val" value="1" dir="ltr"></label>' +
        '<label class="fld"><span>' + esc(c.from) + '</span><select data-k="from" dir="ltr"></select></label>' +
        '<label class="fld"><span>' + esc(c.to) + '</span><select data-k="to" dir="ltr"></select></label>' +
        '<button class="swap-btn" type="button" data-swap aria-label="' + esc(c.swap) + '">' + A.icon('swap') + '<span>' + esc(c.swap) + '</span></button></div>';
    } else {
      body = '<div class="cf">' + d.f.map(function (f) {
        var lab = esc((c.f || {})[f[0]] || f[0]);
        if (f[1] === 'sel') {
          return '<label class="fld"><span>' + lab + '</span><select data-k="' + f[0] + '">' + f[3].map(function (o) {
            var ol = ((c.o || {})[f[0]] || {})[o] || (OPT[f[0]] && OPT[f[0]](o));
            return '<option value="' + esc(o) + '"' + (o === f[2] ? ' selected' : '') + '>' + esc(iso(ol || o, A.rtl)) + '</option>';
          }).join('') + '</select></label>';
        }
        return '<label class="fld"><span>' + lab + '</span><span class="inp"><input type="number" inputmode="decimal" step="any" min="0" data-k="' + f[0] + '" value="' + f[2] + '" dir="ltr">' +
          (f[3] ? '<i dir="ltr">' + esc(f[3]) + '</i>' : '') + '</span></label>';
      }).join('') + '</div>';
    }
    return '<article class="calc reveal" id="c-' + id + '" data-calc="' + id + '">' +
      '<header class="calc-h"><span class="calc-ic">' + A.icon(d.icon) + '</span><div><h3>' + A.tx(c.t) + '</h3><p>' + A.tx(c.d) + '</p></div></header>' +
      body + '<div class="cres" aria-live="polite"></div>' +
      (d.how || c.how ? '<details class="how"><summary>' + A.icon('info') + esc((T.common || {}).how) + '</summary>' + (c.how ? '<p>' + A.tx(c.how) + '</p>' : '') + (d.how ? '<code dir="ltr">' + esc(d.how) + '</code>' : '') + '</details>' : '') +
      '</article>';
  }

  function readVals(el, d) {
    var v = {};
    d.f.forEach(function (f) {
      var inp = el.querySelector('[data-k="' + f[0] + '"]');
      v[f[0]] = f[1] === 'num' ? parseFloat(inp.value) : inp.value;
      if (f[1] === 'num' && !isFinite(v[f[0]])) v[f[0]] = NaN;
    });
    return v;
  }
  function run(A, el) {
    var id = el.getAttribute('data-calc'), d = DEFS[id], T = A.t('') || {}, c = (T.c || {})[id] || {}, esc = A.esc, out = el.querySelector('.cres');
    if (d.conv) return runConv(A, el, c);
    var v = readVals(el, d), bad = d.f.some(function (f) { return f[1] === 'num' && (!(v[f[0]] >= 0)); });
    if (bad) { out.innerHTML = '<p class="cwarn">' + esc((T.common || {}).bad) + '</p>'; return; }
    var r;
    try { r = d.calc(v); } catch (e) { r = null; }
    if (!r) { out.innerHTML = '<p class="cwarn">' + esc((T.common || {}).bad) + '</p>'; return; }
    out.innerHTML = '<div class="cgrid">' + r.rows.map(function (x) {
      return '<div class="cr' + (x[3] ? ' main' : '') + '"><span>' + esc((c.r || {})[x[0]] || x[0]) + '</span><b dir="ltr">' + esc(x[1]) + (x[2] ? ' <small>' + esc(x[2]) + '</small>' : '') + '</b></div>';
    }).join('') + '</div>' +
      (r.warn ? '<p class="cwarn">' + A.icon('info') + '<span>' + A.tx((c.w || {})[r.warn] || '') + '</span></p>' : '') +
      (r.note && (c.n || {})[r.note] ? '<p class="cnote">' + A.icon('info') + '<span>' + A.tx(c.n[r.note]) + '</span></p>' : '');
  }

  /* Unit converter */
  function fillUnits(el, keep) {
    var cat = el.querySelector('[data-k="cat"]').value, list = UNITS[cat], f = el.querySelector('[data-k="from"]'), t = el.querySelector('[data-k="to"]');
    var o = list.map(function (u, i) { return '<option value="' + i + '">' + u[0] + '</option>'; }).join('');
    f.innerHTML = o; t.innerHTML = o;
    t.value = list.length > 1 ? '1' : '0';
    if (keep) { f.value = keep[0]; t.value = keep[1]; }
  }
  function runConv(A, el, c) {
    var cat = el.querySelector('[data-k="cat"]').value, list = UNITS[cat], out = el.querySelector('.cres');
    var val = parseFloat(el.querySelector('[data-k="val"]').value), fi = +el.querySelector('[data-k="from"]').value, ti = +el.querySelector('[data-k="to"]').value;
    if (!isFinite(val)) { out.innerHTML = ''; return; }
    function cv(x, a, b) { return cat === 'temp' ? fromC(toC(x, list[a][0]), list[b][0]) : x * list[a][1] / list[b][1]; }
    function nice(x) { var ax = Math.abs(x); return ax !== 0 && (ax < 1e-4 || ax >= 1e9) ? x.toExponential(4).replace('e', ' × 10^') : fx(x, ax < 1 ? 6 : 4); }
    var res = cv(val, fi, ti);
    out.innerHTML = '<div class="conv-main" dir="ltr"><span>' + fx(val, 6) + ' ' + A.esc(list[fi][0]) + ' =</span><b>' + nice(res) + ' <small>' + A.esc(list[ti][0]) + '</small></b></div>' +
      '<div class="conv-all" dir="ltr">' + list.map(function (u, i) {
        return i === fi ? '' : '<span><b>' + nice(cv(val, fi, i)) + '</b> ' + A.esc(u[0]) + '</span>';
      }).join('') + '</div>';
  }

  function mount(A, root) {
    A.$root = root;
    root.querySelectorAll('.calc').forEach(function (el) {
      var id = el.getAttribute('data-calc'), d = DEFS[id];
      if (d.conv) fillUnits(el);
      run(A, el);
      el.addEventListener('input', function () { run(A, el); });
      el.addEventListener('change', function (e) {
        var k = e.target.getAttribute('data-k');
        if (d.conv && k === 'cat') fillUnits(el);
        if (d.onSel && k) {
          d.onSel(k, readVals(el, d), function (key, val) { var i = el.querySelector('[data-k="' + key + '"]'); if (i) i.value = val; });
        }
        run(A, el);
      });
      var sw = el.querySelector('[data-swap]');
      if (sw) sw.addEventListener('click', function () {
        var f = el.querySelector('[data-k="from"]'), t = el.querySelector('[data-k="to"]'), x = f.value;
        f.value = t.value; t.value = x; run(A, el);
      });
    });
    /* tabs follow the scroll */
    var tabs = root.querySelectorAll('#toolTabs button');
    tabs.forEach(function (b) {
      b.addEventListener('click', function () { A.scrollToEl(document.getElementById('t-' + b.getAttribute('data-tsec')), true); });
    });
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (en) {
        en.forEach(function (x) {
          if (!x.isIntersecting) return;
          tabs.forEach(function (b) { b.classList.toggle('on', 't-' + b.getAttribute('data-tsec') === x.target.id); });
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      root.querySelectorAll('.tool-sec').forEach(function (s) { io.observe(s); });
    }
  }
  function sub(A, root, s) {
    var el = s && (document.getElementById('t-' + s) || document.getElementById('c-' + s));
    if (el) { A.scrollToEl(el, true); A.M.show(el); return true; }
    return false;
  }

  MODS.tools = { render: render, mount: mount, sub: sub, scene: 'home' };
})();
