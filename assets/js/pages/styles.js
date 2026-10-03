/* Architectural styles — from ancient Egypt to Minimalism, Parametricism and Kurdish heritage.
   Photos from Pexels (falls back to Wikipedia). Texts: assets/data/<lang>/styles.js */
(function () {
  'use strict';
  var MODS = window.PAGE_MODS = window.PAGE_MODS || {};

  /* id, start year (negative = BC), era label, Pexels ids, Wikipedia fallback, famous buildings, architects, colour palette */
  var S = [
    { id: 'egypt', y: -3100, era: '3100 – 30 BC', px: [15188082, 631339, 18934596], w: 'Karnak', b: ['Great Pyramid of Giza', 'Karnak Temple, Luxor', 'Abu Simbel', 'Temple of Hatshepsut, Deir el-Bahari'], a: ['Imhotep', 'Hemiunu', 'Senenmut'], pal: ['#d9b47c', '#a8763e', '#1f4e8c', '#c9a227'] },
    { id: 'greek', y: -800, era: '800 – 146 BC', px: [3264725, 15241686, 772688], w: 'Parthenon', b: ['Parthenon, Athens', 'Erechtheion, Athens', 'Temple of Hephaestus, Athens', 'Theatre of Epidaurus'], a: ['Ictinus', 'Callicrates', 'Phidias', 'Mnesicles'], pal: ['#efe9dc', '#cfc4ad', '#8a9bb0', '#b5543a'] },
    { id: 'roman', y: -509, era: '509 BC – 476 AD', px: [19048747, 20399706], w: 'Colosseum', b: ['Colosseum, Rome', 'Pantheon, Rome', 'Pont du Gard, Nîmes', 'Baths of Caracalla, Rome'], a: ['Vitruvius', 'Apollodorus of Damascus'], pal: ['#d8c3a0', '#b9895b', '#8b3a2b', '#6d6a5f'] },
    { id: 'byzantine', y: 330, era: '330 – 1453', px: [15418709, 19156755, 10748171], w: 'Hagia Sophia', b: ['Hagia Sophia, Istanbul', 'Basilica of San Vitale, Ravenna', "St Mark's Basilica, Venice", 'Hosios Loukas, Greece'], a: ['Anthemius of Tralles', 'Isidore of Miletus'], pal: ['#c9a227', '#7a2e3a', '#2f4f7f', '#e8dcc0'] },
    { id: 'islamic', y: 622, era: '7th c. – today', px: [30270123, 35284991, 33105187], w: 'Sheikh Lotfollah Mosque', b: ['Dome of the Rock, Jerusalem', 'Great Mosque of Samarra, Iraq', 'Mosque–Cathedral of Córdoba', 'Alhambra, Granada', 'Sheikh Lotfollah Mosque, Isfahan', 'Taj Mahal, Agra'], a: ['Mimar Sinan', 'Ustad Ahmad Lahauri'], pal: ['#1f8a8a', '#1d3f8c', '#c9a227', '#f4efe4'] },
    { id: 'gothic', y: 1140, era: '1140 – 1500', px: [15919937, 12384933, 6832384], w: 'Cologne Cathedral', b: ['Notre-Dame de Paris', 'Cologne Cathedral', 'Chartres Cathedral', 'Milan Cathedral'], a: ['Abbot Suger', 'Villard de Honnecourt', 'Peter Parler'], pal: ['#6d6a64', '#2b3a67', '#8c1c2b', '#c8a24a'] },
    { id: 'renaissance', y: 1400, era: '1400 – 1600', px: [161376, 15595693, 29430188], w: 'Florence Cathedral', b: ['Florence Cathedral dome', "St. Peter's Basilica, Vatican", 'Villa La Rotonda, Vicenza', 'Tempietto, Rome'], a: ['Filippo Brunelleschi', 'Leon Battista Alberti', 'Donato Bramante', 'Michelangelo', 'Andrea Palladio'], pal: ['#c05a3a', '#e9dfc9', '#5a7a4d', '#7d6b4f'] },
    { id: 'baroque', y: 1600, era: '1600 – 1750', px: [13692199, 17220696, 13692197], w: 'Palace of Versailles', b: ['Palace of Versailles', "St. Peter's Square, Vatican", 'Trevi Fountain, Rome', 'Würzburg Residence'], a: ['Gian Lorenzo Bernini', 'Francesco Borromini', 'Jules Hardouin-Mansart', 'Balthasar Neumann'], pal: ['#c9a227', '#f2e6cf', '#8b2e2e', '#3b5e8c'] },
    { id: 'neoclassical', y: 1750, era: '1750 – 1850', px: [356879, 18799537, 19096569], w: 'Brandenburg Gate', b: ['Brandenburg Gate, Berlin', 'Panthéon, Paris', 'United States Capitol', 'British Museum, London'], a: ['Carl Gotthard Langhans', 'Jacques-Germain Soufflot', 'Karl Friedrich Schinkel', 'Robert Smirke'], pal: ['#f1ece2', '#c8bda8', '#7f8c99', '#46505c'] },
    { id: 'nouveau', y: 1890, era: '1890 – 1914', px: [16041809, 22662073, 34960354], w: 'Casa Batlló', b: ['Casa Batlló, Barcelona', 'Hôtel Tassel, Brussels', 'Secession Building, Vienna', 'Paris Métro entrances'], a: ['Antoni Gaudí', 'Victor Horta', 'Hector Guimard', 'Otto Wagner'], pal: ['#3f7f6e', '#c58f3d', '#7b4b8f', '#e7d8b5'] },
    { id: 'deco', y: 1920, era: '1920 – 1940', px: [15260234, 30311243, 24589261], w: 'Chrysler Building', b: ['Chrysler Building, New York', 'Empire State Building, New York', 'Rockefeller Center, New York', 'Miami Beach Art Deco District'], a: ['William Van Alen', 'Raymond Hood', 'William F. Lamb'], pal: ['#111111', '#c9a227', '#d9d9d9', '#0f5b5b'] },
    { id: 'bauhaus', y: 1919, era: '1919 – 1933', px: [31158458, 29525052], w: 'Bauhaus Dessau', b: ['Bauhaus Building, Dessau', "Masters' Houses, Dessau", 'Weissenhof Estate, Stuttgart', 'White City, Tel Aviv'], a: ['Walter Gropius', 'Ludwig Mies van der Rohe', 'Hannes Meyer', 'Marcel Breuer'], pal: ['#e63a2e', '#f4c430', '#1d4e9e', '#f2f2f2'] },
    { id: 'modern', y: 1925, era: '1920 – 1970', px: [1133463], w: 'Villa Savoye', b: ['Villa Savoye, Poissy', 'Barcelona Pavilion', 'Fallingwater, Pennsylvania', 'Seagram Building, New York'], a: ['Le Corbusier', 'Ludwig Mies van der Rohe', 'Frank Lloyd Wright', 'Alvar Aalto', 'Oscar Niemeyer'], pal: ['#f5f5f2', '#9aa3a8', '#2c2c2c', '#6b8e5a'] },
    { id: 'brutal', y: 1950, era: '1950 – 1980', px: [30797258, 17330501, 12527346], w: 'Barbican Estate', b: ["Unité d'Habitation, Marseille", 'Barbican Estate, London', 'Habitat 67, Montreal', 'National Assembly of Bangladesh, Dhaka'], a: ['Le Corbusier', 'Alison & Peter Smithson', 'Paul Rudolph', 'Louis Kahn', 'Moshe Safdie'], pal: ['#8d8a84', '#6c6a66', '#b7b2a8', '#3d3c3a'] },
    { id: 'postmodern', y: 1965, era: '1965 – 1995', px: [], w: 'Portland Building', b: ['Vanna Venturi House, Philadelphia', 'Portland Building, Oregon', "Piazza d'Italia, New Orleans", 'Neue Staatsgalerie, Stuttgart'], a: ['Robert Venturi', 'Denise Scott Brown', 'Michael Graves', 'Philip Johnson', 'James Stirling'], pal: ['#e8a0a0', '#3fa7a0', '#f2c14e', '#5b5ea6'] },
    { id: 'hightech', y: 1970, era: '1970s – today', px: [15785071, 16710589, 310480], w: 'Centre Pompidou', b: ['Centre Pompidou, Paris', "Lloyd's building, London", 'HSBC Main Building, Hong Kong', '30 St Mary Axe, London'], a: ['Richard Rogers', 'Renzo Piano', 'Norman Foster'], pal: ['#d23c2b', '#1f5fae', '#2d9c5a', '#c7ccd1'] },
    { id: 'decon', y: 1982, era: '1980s – today', px: [11831187, 28736098, 18484573], w: 'Guggenheim Museum Bilbao', b: ['Guggenheim Museum Bilbao', 'Dancing House, Prague', 'Jewish Museum Berlin', 'Walt Disney Concert Hall, Los Angeles'], a: ['Frank Gehry', 'Daniel Libeskind', 'Zaha Hadid', 'Bernard Tschumi', 'Rem Koolhaas'], pal: ['#b9c0c7', '#8e979f', '#c48a4a', '#3a4048'] },
    { id: 'minimal', y: 1985, era: '1980s – today', px: [12016784, 5623083, 34658645], w: 'Church of the Light', b: ['Church of the Light, Ibaraki', 'Therme Vals, Switzerland', 'Neue Nationalgalerie, Berlin', '21st Century Museum, Kanazawa'], a: ['Tadao Ando', 'Peter Zumthor', 'John Pawson', 'Kazuyo Sejima', 'Ludwig Mies van der Rohe'], pal: ['#f4f4f2', '#d6d3cc', '#9c9890', '#2b2b2b'] },
    { id: 'parametric', y: 2005, era: '2000s – today', px: [18612678, 30094907, 18178840], w: 'Heydar Aliyev Center', b: ['Heydar Aliyev Center, Baku', 'Beijing National Stadium', 'MAXXI, Rome', 'Galaxy SOHO, Beijing'], a: ['Zaha Hadid', 'Patrik Schumacher', 'Herzog & de Meuron'], pal: ['#f7f7f7', '#c9d3dc', '#5c6b7a', '#1c1f24'] },
    { id: 'green', y: 2000, era: '1990s – today', px: [19579742, 21047957, 12767100], w: 'Bosco Verticale', b: ['Bosco Verticale, Milan', 'Gardens by the Bay, Singapore', 'Masdar City, Abu Dhabi', 'The Edge, Amsterdam'], a: ['Stefano Boeri', 'Ken Yeang', 'Norman Foster'], pal: ['#3f7d3a', '#8fbf5a', '#c8b28a', '#5a6f7d'] },
    { id: 'kurdish', y: -5000, era: '≈ 6,000 years – today', px: [20811426, 34033648], w: 'Erbil Citadel', b: ['Erbil Citadel (UNESCO 2014)', 'Hawraman / Uramanat villages (UNESCO 2021)', 'Amêdî (Amadiya)', 'Qaysari Bazaar, Erbil'], a: ['Kurdish master builders (Wasta)'], pal: ['#c7a77a', '#8a6a48', '#6f8f5a', '#e8dcc4'] }
  ];
  /* timeline order (Kurdish heritage is shown first: it is the oldest continuous tradition here) */
  var ORDER = S.slice().sort(function (a, b) { return a.y - b.y; });

  function render(A) {
    var T = A.t('') || {}, esc = A.esc, icon = A.icon, tx = A.tx;
    function era(s) { return esc((T.era || {})[s.id] || s.era); }
    var h = '<section class="sec stl-sec">' +
      '<div class="stl-time reveal" id="stlTime"><div class="stl-track">' + ORDER.map(function (s) {
        var t = (T.s || {})[s.id] || {};
        return '<a href="#/styles/' + s.id + '" style="--s1:' + s.pal[0] + ';--s2:' + s.pal[2] + '"><i></i><b>' + esc(t.n) + '</b><small>' + era(s) + '</small></a>';
      }).join('') + '</div></div>' +
      '<div class="stl-list">' + ORDER.map(function (s, i) {
        var t = (T.s || {})[s.id] || {};
        return '<article class="stl reveal" id="s-' + s.id + '">' +
          '<figure class="stl-ph ph" data-px="' + s.px.join(',') + '" data-w="' + esc(s.w) + '"><span class="ph-fb">' + icon('column') + '</span>' +
          '<figcaption><span class="stl-i" dir="ltr">' + A.pad(i + 1) + '</span><b>' + esc(t.n) + '</b><small>' + era(s) + '</small></figcaption></figure>' +
          '<div class="stl-b"><p class="stl-d">' + tx(t.d) + '</p>' +
          '<div class="stl-pal" aria-hidden="true">' + s.pal.map(function (c) { return '<i style="background:' + c + '"></i>'; }).join('') + '<span>' + esc(T.palette) + '</span></div>' +
          '<div class="stl-grid"><div><h4>' + icon('sparkle') + esc(T.feat) + '</h4><ul class="stl-feat">' + (t.feat || []).map(function (f) { return '<li>' + tx(f) + '</li>'; }).join('') + '</ul></div>' +
          '<div><h4>' + icon('bulb') + esc(T.idea) + '</h4><p>' + tx(t.idea) + '</p>' +
          '<h4>' + icon('layers') + esc(T.mat) + '</h4><p>' + tx(t.mat) + '</p>' +
          '<p class="stl-spot">' + icon('search') + '<span><b>' + esc(T.spot) + '</b> ' + tx(t.spot) + '</span></p></div></div>' +
          '<div class="stl-foot"><div><h4>' + icon('pin') + esc(T.build) + '</h4><p class="stl-chips">' + s.b.map(function (b) { return '<a href="' + A.wikiUrl(b.replace(/ \(.*\)$/, '').replace(/,.*$/, '')) + '" target="_blank" rel="noopener" dir="ltr">' + esc(b) + '</a>'; }).join('') + '</p></div>' +
          '<div><h4>' + icon('users') + esc(T.arch) + '</h4><p class="stl-chips names">' + s.a.map(function (a) { return '<span dir="ltr">' + esc(a) + '</span>'; }).join('') + '</p></div></div>' +
          '</div></article>';
      }).join('') + '</div></section>';
    return h;
  }

  /* photos: try each Pexels id, then the Wikipedia photo of the style's best-known building */
  function loadPhoto(A, fig) {
    if (fig.getAttribute('data-state')) return;
    fig.setAttribute('data-state', '1');
    var ids = (fig.getAttribute('data-px') || '').split(',').filter(Boolean), i = 0, w = Math.min(1600, Math.round(fig.clientWidth * Math.min(2, window.devicePixelRatio || 1) / 100) * 100) || 1200;
    var img = document.createElement('img');
    img.alt = ''; img.decoding = 'async'; img.referrerPolicy = 'no-referrer';
    function wiki() {
      img.remove();
      var holder = document.createElement('div');
      holder.innerHTML = A.wimg(fig.getAttribute('data-w'), fig.getAttribute('data-w') + ' architecture', fig.getAttribute('data-w'));
      fig.insertBefore(holder.firstChild, fig.firstChild);
      A.lazyFill(fig);
    }
    img.onload = function () { A.fitImg(img); };
    img.onerror = function () { i++; if (i < ids.length) img.src = A.C.pexels(ids[i], w); else wiki(); };
    if (!ids.length) { wiki(); return; }
    fig.insertBefore(img, fig.firstChild);
    img.src = A.C.pexels(ids[0], w);
  }
  function mount(A, root) {
    var figs = Array.prototype.slice.call(root.querySelectorAll('.stl-ph'));
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (en) {
        en.forEach(function (x) { if (x.isIntersecting) { io.unobserve(x.target); loadPhoto(A, x.target); } });
      }, { rootMargin: '500px 0px' });
      figs.forEach(function (f) { io.observe(f); });
    } else figs.forEach(function (f) { loadPhoto(A, f); });
  }
  function sub(A, root, s) {
    var el = s && document.getElementById('s-' + s);
    if (el) { A.scrollToEl(el, true); A.M.show(el); return true; }
    return false;
  }
  MODS.styles = { render: render, mount: mount, sub: sub, scene: 'plan' };
})();
