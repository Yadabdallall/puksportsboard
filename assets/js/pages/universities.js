/* The 20 best universities for engineering — where each one is strongest.
   Not a numeric ranking (QS, THE and ShanghaiRanking change every year). Texts: assets/data/<lang>/universities.js */
(function () {
  'use strict';
  var MODS = window.PAGE_MODS = window.PAGE_MODS || {};

  /* id, short name, official name, city, country, founded, public/private, website, fields where it leads,
     famous alumni (or teachers), Wikipedia title for a campus photo */
  var U = [
    { id: 'mit', s: 'MIT', n: 'Massachusetts Institute of Technology', city: 'Cambridge, MA', cc: 'USA', y: 1861, t: 'private', url: 'https://www.mit.edu', b: ['computer', 'mech', 'aero', 'chem', 'elec'], al: ['Buzz Aldrin', 'I. M. Pei', 'Richard Feynman'], w: 'Maclaurin Buildings' },
    { id: 'stanford', s: 'Stanford', n: 'Stanford University', city: 'Stanford, CA', cc: 'USA', y: 1885, t: 'private', url: 'https://www.stanford.edu', b: ['computer', 'software', 'elec', 'petro', 'civil'], al: ['William Hewlett', 'David Packard', 'Larry Page'], w: 'Hoover Tower' },
    { id: 'berkeley', s: 'Berkeley', n: 'University of California, Berkeley', city: 'Berkeley, CA', cc: 'USA', y: 1868, t: 'public', url: 'https://www.berkeley.edu', b: ['civil', 'elec', 'computer', 'chem'], al: ['Steve Wozniak', 'Gordon Moore'], w: 'Sather Tower' },
    { id: 'caltech', s: 'Caltech', n: 'California Institute of Technology', city: 'Pasadena, CA', cc: 'USA', y: 1891, t: 'private', url: 'https://www.caltech.edu', b: ['aero', 'mech', 'elec', 'chem'], al: ['Gordon Moore', 'Linus Pauling', 'Qian Xuesen'], w: 'Millikan Library' },
    { id: 'harvard', s: 'Harvard', n: 'Harvard University — Graduate School of Design & SEAS', city: 'Cambridge, MA', cc: 'USA', y: 1636, t: 'private', url: 'https://www.gsd.harvard.edu', b: ['arch', 'biomed', 'computer'], al: ['I. M. Pei', 'Philip Johnson', 'Bill Gates'], w: 'Harvard Graduate School of Design' },
    { id: 'gatech', s: 'Georgia Tech', n: 'Georgia Institute of Technology', city: 'Atlanta, GA', cc: 'USA', y: 1885, t: 'public', url: 'https://www.gatech.edu', b: ['industrial', 'civil', 'aero', 'elec'], al: ['Jimmy Carter'], w: 'Tech Tower' },
    { id: 'cmu', s: 'CMU', n: 'Carnegie Mellon University', city: 'Pittsburgh, PA', cc: 'USA', y: 1900, t: 'private', url: 'https://www.cmu.edu', b: ['software', 'computer', 'elec'], al: ['James Gosling'], w: 'Hamerschlag Hall' },
    { id: 'purdue', s: 'Purdue', n: 'Purdue University', city: 'West Lafayette, IN', cc: 'USA', y: 1869, t: 'public', url: 'https://www.purdue.edu', b: ['aero', 'mech', 'industrial', 'civil'], al: ['Neil Armstrong', 'Eugene Cernan'], w: 'Neil Armstrong Hall of Engineering' },
    { id: 'uiuc', s: 'UIUC', n: 'University of Illinois Urbana-Champaign', city: 'Urbana-Champaign, IL', cc: 'USA', y: 1867, t: 'public', url: 'https://illinois.edu', b: ['civil', 'elec', 'computer', 'mech'], al: ['Fazlur Rahman Khan', 'Jack Kilby', 'Marc Andreessen'], w: 'Altgeld Hall' },
    { id: 'cambridge', s: 'Cambridge', n: 'University of Cambridge', city: 'Cambridge', cc: 'UK', y: 1209, t: 'public', url: 'https://www.cam.ac.uk', b: ['civil', 'mech', 'chem', 'computer'], al: ['Charles Babbage', 'Frank Whittle', 'Alan Turing'], w: "King's College Chapel, Cambridge" },
    { id: 'imperial', s: 'Imperial', n: 'Imperial College London', city: 'London', cc: 'UK', y: 1907, t: 'public', url: 'https://www.imperial.ac.uk', b: ['petro', 'chem', 'civil', 'biomed', 'aero'], al: ['Alexander Fleming', 'Brian May'], w: "Queen's Tower" },
    { id: 'eth', s: 'ETH', n: 'ETH Zürich', city: 'Zürich', cc: 'Switzerland', y: 1855, t: 'public', url: 'https://ethz.ch', b: ['civil', 'arch', 'mech', 'elec', 'survey'], al: ['Albert Einstein', 'Othmar Ammann', 'Wilhelm Röntgen'], w: 'ETH Zurich' },
    { id: 'epfl', s: 'EPFL', n: 'École Polytechnique Fédérale de Lausanne', city: 'Lausanne', cc: 'Switzerland', y: 1853, t: 'public', url: 'https://www.epfl.ch', b: ['civil', 'comm', 'computer', 'biomed'], al: ['Daniel Borel'], w: 'Rolex Learning Center' },
    { id: 'delft', s: 'TU Delft', n: 'Delft University of Technology', city: 'Delft', cc: 'Netherlands', y: 1842, t: 'public', url: 'https://www.tudelft.nl', b: ['civil', 'water', 'arch', 'aero', 'survey'], al: ['Johan van Veen'], w: 'TU Delft Library' },
    { id: 'tum', s: 'TUM', n: 'Technical University of Munich', city: 'Munich', cc: 'Germany', y: 1868, t: 'public', url: 'https://www.tum.de', b: ['mech', 'aero', 'elec', 'computer'], al: ['Rudolf Diesel', 'Claude Dornier'], w: 'Technical University of Munich' },
    { id: 'bauhaus', s: 'Bauhaus', n: 'Bauhaus-Universität Weimar', city: 'Weimar', cc: 'Germany', y: 1860, t: 'public', url: 'https://www.uni-weimar.de', b: ['arch', 'civil'], al: ['Walter Gropius', 'Marcel Breuer', 'Wassily Kandinsky'], w: 'Bauhaus-Universität Weimar' },
    { id: 'polimi', s: 'PoliMi', n: 'Politecnico di Milano', city: 'Milan', cc: 'Italy', y: 1863, t: 'public', url: 'https://www.polimi.it', b: ['arch', 'mech', 'industrial', 'civil'], al: ['Renzo Piano', 'Giulio Natta'], w: 'Polytechnic University of Milan' },
    { id: 'tsinghua', s: 'Tsinghua', n: 'Tsinghua University', city: 'Beijing', cc: 'China', y: 1911, t: 'public', url: 'https://www.tsinghua.edu.cn', b: ['civil', 'elec', 'computer', 'water'], al: ['Liang Sicheng'], w: 'Tsinghua University' },
    { id: 'nus', s: 'NUS', n: 'National University of Singapore', city: 'Singapore', cc: 'Singapore', y: 1905, t: 'public', url: 'https://www.nus.edu.sg', b: ['civil', 'chem', 'computer', 'industrial'], al: [], w: 'National University of Singapore' },
    { id: 'tokyo', s: 'UTokyo', n: 'The University of Tokyo', city: 'Tokyo', cc: 'Japan', y: 1877, t: 'public', url: 'https://www.u-tokyo.ac.jp', b: ['civil', 'mech', 'elec', 'computer'], al: ['Hidetsugu Yagi', 'Kenzo Tange'], w: 'Yasuda Auditorium' }
  ];
  var SCHOL = [
    ['DAAD', 'Germany', 'https://www.daad.de'], ['Fulbright', 'USA', 'https://foreign.fulbrightonline.org'], ['Chevening', 'UK', 'https://www.chevening.org'],
    ['Erasmus+', 'EU', 'https://erasmus-plus.ec.europa.eu'], ['Swiss Government Excellence Scholarships', 'Switzerland', ''], ['MEXT', 'Japan', ''], ['CSC — Chinese Government Scholarship', 'China', '']
  ];

  function render(A, sub) {
    var T = A.t('') || {}, esc = A.esc, icon = A.icon, tx = A.tx;
    var h = '<section class="sec un-sec"><p class="note reveal un-note">' + icon('info') + '<span>' + esc(T.note) + '</span></p>' +
      '<div class="chips reveal" id="unFilter"><button data-f="" class="on">' + esc(T.all) + ' <span class="n">' + U.length + '</span></button>' +
      A.D.map(function (d) {
        var n = U.filter(function (u) { return u.b.indexOf(d.id) > -1; }).length;
        return n ? '<button data-f="' + d.id + '" style="' + A.vars(d.color) + '"><i></i>' + esc(A.dName(d)) + ' <span class="n">' + n + '</span></button>' : '';
      }).join('') + '</div>' +
      '<div class="un-grid" id="unGrid">' + U.map(function (u, i) {
        var t = (T.u || {})[u.id] || {};
        return '<article class="un reveal" id="s-' + u.id + '" data-f="' + u.b.join(' ') + '">' +
          '<figure class="un-ph ph">' + A.wimg(u.w, u.n + ' campus', u.n) + '<span class="ph-fb">' + icon('uni') + '</span>' +
          '<span class="un-i" dir="ltr">' + A.pad(i + 1) + '</span></figure>' +
          '<div class="un-b"><div class="un-h"><span class="un-s" dir="ltr">' + esc(u.s) + '</span><div><h3 dir="ltr">' + esc(u.n) + '</h3>' +
          (t.n ? '<p class="un-local">' + esc(t.n) + '</p>' : '') + '</div></div>' +
          '<p class="un-meta"><span>' + icon('pin') + '<bdi dir="ltr">' + esc(u.city) + '</bdi> · ' + esc((T.cc || {})[u.cc] || u.cc) + '</span><span>' + icon('calendar') + '<bdi dir="ltr">' + u.y + '</bdi></span><span>' + icon('company') + esc((T.type || {})[u.t]) + '</span></p>' +
          '<p class="un-best-t">' + icon('star') + esc(T.best) + '</p><p class="un-best">' + u.b.map(function (id) {
            var d = A.byId[id]; return d ? '<a href="#/dept/' + id + '" style="--dc:' + d.color + '"><i></i>' + esc(A.dName(d)) + '</a>' : '';
          }).join('') + '</p>' +
          '<p class="un-d">' + tx(t.d) + '</p>' +
          (u.al.length ? '<p class="un-al"><b>' + esc(T.alumni) + '</b> <span dir="ltr">' + esc(u.al.join(' · ')) + '</span></p>' : '') +
          '<div class="links"><a href="' + u.url + '" target="_blank" rel="noopener">' + icon('ext') + esc(T.site) + '</a>' +
          '<a href="' + A.wikiUrl(u.n.split(' — ')[0]) + '" target="_blank" rel="noopener">' + icon('book') + esc(T.wiki) + '</a></div></div></article>';
      }).join('') + '</div></section>';
    h += '<section class="sec" id="s-scholar"><div class="panel reveal un-sch"><h3 class="sub">' + icon('cap') + esc(T.schTitle) + '</h3><p class="note">' + esc(T.schLead) + '</p><ul class="un-sch-l">' + SCHOL.map(function (s) {
      return '<li><b dir="ltr">' + (s[2] ? '<a href="' + s[2] + '" target="_blank" rel="noopener">' + esc(s[0]) + '</a>' : esc(s[0])) + '</b><span>' + esc((T.cc || {})[s[1]] || s[1]) + '</span></li>';
    }).join('') + '</ul><p class="note">' + esc(T.schTip) + '</p></div></section>';
    return h;
  }
  function filter(root, f) {
    root.querySelectorAll('#unFilter button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-f') === f); });
    root.querySelectorAll('#unGrid .un').forEach(function (el) {
      var show = !f || el.getAttribute('data-f').split(' ').indexOf(f) > -1;
      el.hidden = !show;
      if (show) el.classList.add('is-in');
    });
  }
  function mount(A, root) {
    root.querySelector('#unFilter').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (b) filter(root, b.getAttribute('data-f'));
    });
    A.lazyFill(root.querySelector('#unGrid'));
  }
  function sub(A, root, s) {
    if (s && A.byId[s]) { filter(root, s); A.scrollToEl(root.querySelector('#unFilter'), true); return true; }
    return false;
  }
  MODS.universities = { render: render, mount: mount, sub: sub, scene: 'home' };
})();
