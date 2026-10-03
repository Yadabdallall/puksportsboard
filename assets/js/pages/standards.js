/* World engineering standards — organisations, their best-known codes and the fields they serve.
   Code titles stay in English (their official names); descriptions live in assets/data/<lang>/standards.js */
(function () {
  'use strict';
  var MODS = window.PAGE_MODS = window.PAGE_MODS || {};

  /* id, abbreviation, official name, founded, headquarters, website, fields, [code, title] */
  var ORGS = [
    { id: 'aci', a: 'ACI', n: 'American Concrete Institute', y: 1904, hq: 'Farmington Hills, USA', url: 'https://www.concrete.org', f: ['civil', 'arch'], c: [
      ['ACI 318', 'Building Code Requirements for Structural Concrete'], ['ACI 211.1', 'Selecting Proportions for Normal, Heavyweight and Mass Concrete'],
      ['ACI 301', 'Specifications for Concrete Construction'], ['ACI 350', 'Environmental Engineering Concrete Structures'],
      ['ACI 213R', 'Guide for Structural Lightweight-Aggregate Concrete'], ['ACI 523.1R', 'Guide for Cast-in-Place Low-Density Cellular Concrete']] },
    { id: 'astm', a: 'ASTM', n: 'ASTM International', y: 1898, hq: 'West Conshohocken, USA', url: 'https://www.astm.org', f: ['civil', 'mech', 'chem', 'petro', 'water', 'aero', 'biomed'], c: [
      ['ASTM C39', 'Compressive Strength of Cylindrical Concrete Specimens'], ['ASTM C150', 'Specification for Portland Cement'],
      ['ASTM C33', 'Specification for Concrete Aggregates'], ['ASTM A615', 'Deformed and Plain Carbon-Steel Bars for Concrete Reinforcement'],
      ['ASTM C143', 'Slump of Hydraulic-Cement Concrete'], ['ASTM E8', 'Tension Testing of Metallic Materials'],
      ['ASTM D1557', 'Laboratory Compaction of Soil (Modified Proctor)'], ['ASTM C330', 'Lightweight Aggregates for Structural Concrete']] },
    { id: 'iso', a: 'ISO', n: 'International Organization for Standardization', y: 1947, hq: 'Geneva, Switzerland', url: 'https://www.iso.org', f: ['industrial', 'software', 'computer', 'biomed', 'survey', 'mech', 'chem', 'arch'], c: [
      ['ISO 9001', 'Quality management systems'], ['ISO 14001', 'Environmental management systems'], ['ISO 45001', 'Occupational health and safety management'],
      ['ISO 19650', 'Information management using BIM'], ['ISO/IEC 27001', 'Information security management'], ['ISO 13485', 'Medical devices — quality management'],
      ['ISO 2768', 'General tolerances'], ['ISO 19111', 'Geographic information — referencing by coordinates']] },
    { id: 'iec', a: 'IEC', n: 'International Electrotechnical Commission', y: 1906, hq: 'Geneva, Switzerland', url: 'https://www.iec.ch', f: ['elec', 'comm', 'computer', 'biomed'], c: [
      ['IEC 60364', 'Low-voltage electrical installations'], ['IEC 61439', 'Low-voltage switchgear and controlgear assemblies'],
      ['IEC 60898', 'Circuit-breakers for household installations'], ['IEC 62305', 'Protection against lightning'],
      ['IEC 61850', 'Communication networks in substations'], ['IEC 60529', 'Degrees of protection by enclosures (IP code)'], ['IEC 60601', 'Medical electrical equipment']] },
    { id: 'ieee', a: 'IEEE', n: 'Institute of Electrical and Electronics Engineers', y: 1963, hq: 'New York, USA', url: 'https://standards.ieee.org', f: ['elec', 'computer', 'comm', 'software', 'biomed'], c: [
      ['IEEE 802.3', 'Ethernet'], ['IEEE 802.11', 'Wireless LAN (Wi-Fi)'], ['IEEE 754', 'Floating-point arithmetic'],
      ['IEEE 80', 'Safety in AC substation grounding'], ['IEEE 519', 'Harmonic control in power systems'], ['IEEE 1547', 'Interconnection of distributed energy resources'],
      ['ISO/IEC/IEEE 29148', 'Requirements engineering']] },
    { id: 'nfpa', a: 'NFPA', n: 'National Fire Protection Association', y: 1896, hq: 'Quincy, USA', url: 'https://www.nfpa.org', f: ['elec', 'arch', 'mech', 'chem', 'petro'], c: [
      ['NFPA 70', 'National Electrical Code (NEC)'], ['NFPA 101', 'Life Safety Code'], ['NFPA 13', 'Installation of sprinkler systems'],
      ['NFPA 72', 'National Fire Alarm and Signaling Code'], ['NFPA 70E', 'Electrical safety in the workplace'], ['NFPA 20', 'Stationary fire pumps']] },
    { id: 'asme', a: 'ASME', n: 'American Society of Mechanical Engineers', y: 1880, hq: 'New York, USA', url: 'https://www.asme.org', f: ['mech', 'petro', 'chem', 'aero', 'industrial'], c: [
      ['ASME BPVC', 'Boiler and Pressure Vessel Code'], ['BPVC Section VIII', 'Rules for construction of pressure vessels'], ['ASME B31.3', 'Process piping'],
      ['ASME B31.1', 'Power piping'], ['ASME Y14.5', 'Dimensioning and tolerancing (GD&T)'], ['ASME B16.5', 'Pipe flanges and flanged fittings'],
      ['ASME A17.1', 'Safety code for elevators and escalators']] },
    { id: 'ashrae', a: 'ASHRAE', n: 'American Society of Heating, Refrigerating and Air-Conditioning Engineers', y: 1894, hq: 'Peachtree Corners, USA', url: 'https://www.ashrae.org', f: ['mech', 'arch'], c: [
      ['ASHRAE 90.1', 'Energy standard for buildings'], ['ASHRAE 62.1', 'Ventilation for acceptable indoor air quality'],
      ['ASHRAE 55', 'Thermal environmental conditions for human occupancy'], ['ASHRAE 15', 'Safety standard for refrigeration systems'],
      ['ASHRAE 34', 'Designation and safety classification of refrigerants'], ['ASHRAE Handbook', 'Fundamentals']] },
    { id: 'aisc', a: 'AISC', n: 'American Institute of Steel Construction', y: 1921, hq: 'Chicago, USA', url: 'https://www.aisc.org', f: ['civil', 'arch'], c: [
      ['AISC 360', 'Specification for Structural Steel Buildings'], ['AISC 341', 'Seismic Provisions for Structural Steel Buildings'],
      ['AISC 358', 'Prequalified connections for moment frames'], ['AISC 303', 'Code of Standard Practice for Steel Buildings and Bridges'], ['Steel Construction Manual', 'Design tables and guidance']] },
    { id: 'asce', a: 'ASCE', n: 'American Society of Civil Engineers', y: 1852, hq: 'Reston, USA', url: 'https://www.asce.org', f: ['civil', 'water', 'arch'], c: [
      ['ASCE/SEI 7', 'Minimum Design Loads for Buildings and Other Structures'], ['ASCE/SEI 41', 'Seismic Evaluation and Retrofit of Existing Buildings'],
      ['ASCE 24', 'Flood Resistant Design and Construction'], ['ASCE/SEI 37', 'Design Loads on Structures During Construction']] },
    { id: 'icc', a: 'ICC', n: 'International Code Council', y: 1994, hq: 'Washington, D.C., USA', url: 'https://www.iccsafe.org', f: ['arch', 'civil', 'mech', 'elec'], c: [
      ['IBC', 'International Building Code'], ['IRC', 'International Residential Code'], ['IFC', 'International Fire Code'],
      ['IMC', 'International Mechanical Code'], ['IPC', 'International Plumbing Code'], ['IECC', 'International Energy Conservation Code']] },
    { id: 'aashto', a: 'AASHTO', n: 'American Association of State Highway and Transportation Officials', y: 1914, hq: 'Washington, D.C., USA', url: 'https://www.transportation.org', f: ['civil', 'survey'], c: [
      ['AASHTO LRFD', 'Bridge Design Specifications'], ['Green Book', 'A Policy on Geometric Design of Highways and Streets'],
      ['AASHTO M 145', 'Classification of soils and soil-aggregate mixtures'], ['AASHTO T 180', 'Moisture–density relations of soils (modified)'],
      ['AASHTO 1993', 'Guide for Design of Pavement Structures']] },
    { id: 'api', a: 'API', n: 'American Petroleum Institute', y: 1919, hq: 'Washington, D.C., USA', url: 'https://www.api.org', f: ['petro', 'chem', 'mech'], c: [
      ['API 5L', 'Line pipe'], ['API 650', 'Welded tanks for oil storage'], ['API 6A', 'Wellhead and tree equipment'],
      ['API 610', 'Centrifugal pumps for petroleum and gas industries'], ['API 1104', 'Welding of pipelines'], ['API 510', 'Pressure vessel inspection code']] },
    { id: 'aws', a: 'AWS', n: 'American Welding Society', y: 1919, hq: 'Doral, USA', url: 'https://www.aws.org', f: ['mech', 'civil', 'petro', 'industrial'], c: [
      ['AWS D1.1', 'Structural Welding Code — Steel'], ['AWS D1.2', 'Structural Welding Code — Aluminum'], ['AWS D1.5', 'Bridge Welding Code'],
      ['AWS A2.4', 'Symbols for welding, brazing and NDE'], ['AWS A5', 'Filler metal specifications'], ['CWI', 'Certified Welding Inspector']] },
    { id: 'awwa', a: 'AWWA', n: 'American Water Works Association', y: 1881, hq: 'Denver, USA', url: 'https://www.awwa.org', f: ['water', 'civil', 'chem'], c: [
      ['AWWA C900', 'PVC pressure pipe for water'], ['AWWA C151', 'Ductile-iron pipe'], ['AWWA D100', 'Welded carbon steel tanks for water storage'],
      ['AWWA C651', 'Disinfecting water mains'], ['AWWA M-manuals', 'Manuals of water supply practice']] },
    { id: 'cen', a: 'CEN', n: 'European Committee for Standardization — Eurocodes', y: 1961, hq: 'Brussels, Belgium', url: 'https://www.cencenelec.eu', f: ['civil', 'arch', 'mech'], c: [
      ['EN 1990', 'Eurocode 0 — Basis of structural design'], ['EN 1991', 'Eurocode 1 — Actions on structures'], ['EN 1992', 'Eurocode 2 — Concrete structures'],
      ['EN 1993', 'Eurocode 3 — Steel structures'], ['EN 1997', 'Eurocode 7 — Geotechnical design'], ['EN 1998', 'Eurocode 8 — Earthquake resistance'],
      ['EN 206', 'Concrete — specification and conformity'], ['EN 197-1', 'Cement — composition and specifications']] },
    { id: 'bsi', a: 'BSI', n: 'British Standards Institution', y: 1901, hq: 'London, UK', url: 'https://www.bsigroup.com', f: ['civil', 'elec', 'arch', 'mech'], c: [
      ['BS 8110', 'Structural use of concrete (withdrawn, still met in the region)'], ['BS 7671', 'Requirements for electrical installations (IET Wiring Regulations)'],
      ['BS 5950', 'Structural use of steelwork (withdrawn)'], ['BS 8500', 'Concrete — complementary to BS EN 206'],
      ['BS EN 12390', 'Testing hardened concrete'], ['BS 1192', 'Collaborative production of information (now ISO 19650)']] },
    { id: 'din', a: 'DIN', n: 'Deutsches Institut für Normung', y: 1917, hq: 'Berlin, Germany', url: 'https://www.din.de', f: ['mech', 'civil', 'elec', 'industrial'], c: [
      ['DIN 476 → ISO 216', 'Paper sizes — the A4 sheet'], ['DIN 1045', 'Concrete, reinforced and prestressed concrete structures'],
      ['DIN 4108', 'Thermal insulation and energy economy in buildings'], ['DIN VDE 0100', 'Low-voltage electrical installations'],
      ['DIN 912 → ISO 4762', 'Hexagon socket head cap screws'], ['DIN EN ISO 9001', 'Quality management (German adoption)']] },
    { id: 'sae', a: 'SAE', n: 'SAE International', y: 1905, hq: 'Warrendale, USA', url: 'https://www.sae.org', f: ['aero', 'mech'], c: [
      ['SAE J3016', 'Levels of driving automation'], ['SAE J300', 'Engine oil viscosity classification'], ['SAE J429', 'Bolt grades for threaded fasteners'],
      ['AS9100', 'Quality management for aviation, space and defence'], ['SAE AMS', 'Aerospace material specifications'], ['ARP4754A', 'Development of civil aircraft and systems']] },
    { id: 'itu', a: 'ITU', n: 'International Telecommunication Union', y: 1865, hq: 'Geneva, Switzerland', url: 'https://www.itu.int', f: ['comm', 'computer'], c: [
      ['ITU-T G.652', 'Single-mode optical fibre'], ['ITU-T H.264 / H.265', 'Video coding'], ['ITU-T E.164', 'International telephone numbering'],
      ['ITU-R RR', 'Radio Regulations'], ['IMT-2020', '5G requirements'], ['ITU-T G.711', 'Telephone audio coding (PCM)']] },
    { id: 'ipc', a: 'IPC', n: 'IPC — Association Connecting Electronics Industries', y: 1957, hq: 'Bannockburn, USA', url: 'https://www.ipc.org', f: ['elec', 'computer', 'industrial'], c: [
      ['IPC-A-610', 'Acceptability of electronic assemblies'], ['IPC-2221', 'Generic standard on printed board design'],
      ['J-STD-001', 'Requirements for soldered assemblies'], ['IPC-A-600', 'Acceptability of printed boards']] },
    { id: 'ansi', a: 'ANSI', n: 'American National Standards Institute', y: 1918, hq: 'Washington, D.C., USA', url: 'https://www.ansi.org', f: ['industrial', 'comm', 'mech', 'civil'], c: [
      ['ANSI/ISEA Z89.1', 'Industrial head protection (hard hats)'], ['ANSI/ISEA Z87.1', 'Eye and face protection'], ['ANSI/ISEA 107', 'High-visibility safety apparel'],
      ['ANSI Z535', 'Safety signs and colours'], ['ANSI/TIA-568', 'Structured cabling for buildings']] },
    { id: 'osha', a: 'OSHA', n: 'Occupational Safety and Health Administration', y: 1971, hq: 'Washington, D.C., USA', url: 'https://www.osha.gov', f: ['industrial', 'civil', 'chem', 'petro'], c: [
      ['29 CFR 1910', 'General industry'], ['29 CFR 1926', 'Construction'], ['1910.147', 'Lockout / tagout'],
      ['1926.501', 'Duty to have fall protection'], ['1910.1200', 'Hazard communication']] },
    { id: 'fidic', a: 'FIDIC', n: 'International Federation of Consulting Engineers', y: 1913, hq: 'Geneva, Switzerland', url: 'https://fidic.org', f: ['civil', 'arch', 'industrial', 'petro'], c: [
      ['Red Book', 'Conditions of Contract for Construction'], ['Yellow Book', 'Plant and Design-Build'], ['Silver Book', 'EPC / Turnkey projects'],
      ['White Book', 'Client / Consultant services agreement'], ['Green Book', 'Short form of contract'], ['Emerald Book', 'Underground works']] },
    { id: 'ogc', a: 'OGC', n: 'Open Geospatial Consortium', y: 1994, hq: 'Arlington, USA', url: 'https://www.ogc.org', f: ['survey', 'software', 'civil'], c: [
      ['WMS', 'Web Map Service'], ['WFS', 'Web Feature Service'], ['GML', 'Geography Markup Language'],
      ['KML', 'Keyhole Markup Language'], ['GeoPackage', 'Open format for geodata'], ['CityGML', '3D city models']] },
    { id: 'iqs', a: 'IQS', n: 'Iraqi Standards — COSQC', y: 1979, hq: 'Baghdad, Iraq', url: 'https://cosqc.gov.iq', f: ['civil', 'chem', 'industrial'], c: [
      ['IQS No. 5', 'Portland cement'], ['IQS No. 45', 'Aggregates from natural sources for concrete and building']] }
  ];

  function color(A, o) { var d = A.byId[o.f[0]]; return d ? d.color : '#FFB81C'; }

  function render(A, sub) {
    var T = A.t('') || {}, esc = A.esc, icon = A.icon, tx = A.tx;
    var f = A.byId[sub] ? sub : '';
    var h = '';
    /* basics: standard, code, specification + how to read a code name */
    h += '<section class="sec st-basics"><div class="st-kinds">' + (T.kinds || []).map(function (k) {
      return '<div class="mini reveal"><span class="key">' + esc(k[0]) + '</span><b>' + esc(k[1]) + '</b><p>' + tx(k[2]) + '</p></div>';
    }).join('') + '</div>' +
      '<div class="st-anat reveal"><p class="st-anat-t">' + icon('info') + '<span>' + esc(T.anatTitle) + '</span></p>' +
      '<div class="st-code" dir="ltr">' + [['ASTM', 0], [' C', 1], ['39', 2], ['/C39M', 3], ['-21', 4]].map(function (p) {
        return '<span class="p' + p[1] + '"><b>' + esc(p[0]) + '</b><i>' + (p[1] + 1) + '</i></span>';
      }).join('') + '</div><ol class="st-parts">' + (T.anat || []).map(function (x, i) {
        return '<li><i>' + (i + 1) + '</i><span>' + tx(x) + '</span></li>';
      }).join('') + '</ol></div></section>';

    /* field filter + organisations */
    h += '<section class="sec st-list" id="s-list"><header class="sec-head">' + A.label(T.listLabel) + A.h2(T.listTitle) + A.lead(T.listLead) + '</header>' +
      '<div class="chips reveal" id="stFilter"><button data-f=""' + (f ? '' : ' class="on"') + '>' + esc(T.all) + ' <span class="n">' + ORGS.length + '</span></button>' +
      A.D.map(function (d) {
        var n = ORGS.filter(function (o) { return o.f.indexOf(d.id) > -1; }).length;
        return n ? '<button data-f="' + d.id + '" style="' + A.vars(d.color) + '"' + (f === d.id ? ' class="on"' : '') + '><i></i>' + esc(A.dName(d)) + ' <span class="n">' + n + '</span></button>' : '';
      }).join('') + '</div>' +
      '<div class="st-grid" id="stGrid">' + ORGS.map(function (o) {
        var t = (T.orgs || {})[o.id] || {}, c = color(A, o);
        return '<article class="st reveal" id="s-' + o.id + '" data-f="' + o.f.join(' ') + '" style="' + A.vars(c) + '"' + (f && o.f.indexOf(f) < 0 ? ' hidden' : '') + '>' +
          '<header class="st-h"><span class="st-a" dir="ltr">' + esc(o.a) + '</span><div><h3 dir="ltr">' + esc(o.n) + '</h3>' +
          '<p class="st-meta"><span>' + icon('calendar') + '<bdi dir="ltr">' + o.y + '</bdi></span><span>' + icon('pin') + '<bdi dir="ltr">' + esc(o.hq) + '</bdi></span></p></div></header>' +
          (t.n ? '<p class="st-local">' + esc(t.n) + '</p>' : '') +
          '<p class="st-d">' + tx(t.d) + '</p>' +
          '<p class="st-for">' + o.f.map(function (id) { var d = A.byId[id]; return d ? '<a href="#/standards/' + id + '" style="--dc:' + d.color + '"><i></i>' + esc(A.dName(d)) + '</a>' : ''; }).join('') + '</p>' +
          '<h4>' + icon('book') + esc(T.codes) + '</h4><ul class="st-codes">' + o.c.map(function (x) {
            return '<li><b dir="ltr">' + esc(x[0]) + '</b><span dir="ltr">' + esc(x[1]) + '</span></li>';
          }).join('') + '</ul>' +
          '<a class="st-link" href="' + o.url + '" target="_blank" rel="noopener">' + icon('ext') + esc(T.site) + '<bdi dir="ltr">' + esc(o.url.replace(/^https?:\/\/(www\.)?/, '')) + '</bdi></a>' +
          '</article>';
      }).join('') + '</div></section>';

    /* Iraq & Kurdistan */
    h += '<section class="sec st-local-sec" id="s-iraq"><div class="panel st-iq reveal"><h3 class="sub">' + icon('pin') + esc(T.iqTitle) + '</h3><ul class="care">' + (T.iq || []).map(function (x) {
      return '<li>' + icon('check') + '<span>' + tx(x) + '</span></li>';
    }).join('') + '</ul></div></section>';
    return h;
  }

  function filter(root, f) {
    root.querySelectorAll('#stFilter button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-f') === f); });
    root.querySelectorAll('#stGrid .st').forEach(function (el) {
      var show = !f || el.getAttribute('data-f').split(' ').indexOf(f) > -1;
      el.hidden = !show;
      if (show) el.classList.add('is-in');
    });
  }
  function mount(A, root, sub) {
    root.querySelector('#stFilter').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var f = b.getAttribute('data-f');
      filter(root, f);
      if (history.replaceState) history.replaceState(null, '', f ? '#/standards/' + f : '#/standards');
    });
  }
  function sub(A, root, s) {
    if (s && A.byId[s]) { filter(root, s); A.scrollToEl(document.getElementById('s-list'), true); return true; }
    var el = s && document.getElementById('s-' + s);
    if (el) { filter(root, ''); A.scrollToEl(el, true); A.M.show(el); return true; }
    return false;
  }

  MODS.standards = { render: render, mount: mount, sub: sub, scene: 'home' };
})();
