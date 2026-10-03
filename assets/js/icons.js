/* Icons (24×24 stroke) and gear geometry shared by the UI and the background */
window.ICONS = (function () {
  function gearD(cx, cy, R, ri, n, rot) {
    rot = rot || 0;
    var step = (Math.PI * 2) / n, d = '';
    for (var i = 0; i < n; i++) {
      var a = rot + i * step;
      var pts = [[ri, a], [R, a + step * 0.14], [R, a + step * 0.38], [ri, a + step * 0.52]];
      for (var j = 0; j < pts.length; j++) {
        var x = (cx + pts[j][0] * Math.cos(pts[j][1])).toFixed(2);
        var y = (cy + pts[j][0] * Math.sin(pts[j][1])).toFixed(2);
        d += (i === 0 && j === 0 ? 'M' : 'L') + x + ' ' + y;
      }
      var nx = (cx + ri * Math.cos(a + step)).toFixed(2), ny = (cy + ri * Math.sin(a + step)).toFixed(2);
      d += 'A' + ri + ' ' + ri + ' 0 0 1 ' + nx + ' ' + ny;
    }
    return d + 'Z';
  }
  var I = {
    civil: '<path d="M2 18h20M3 18v-3M21 18v-3M2 15c3.5-6 16.5-6 20 0M7.5 18v-5.6M12 18v-6.8M16.5 18v-5.6"/><path d="M2 21h20"/>',
    arch: '<path d="M3 21h18M5 21V10l7-6 7 6v11"/><path d="M9.5 21v-5.5h5V21M9 11.5h.01M15 11.5h.01"/>',
    mech: '<path d="' + gearD(12, 12, 10.2, 7.8, 9) + '"/><circle cx="12" cy="12" r="3"/>',
    elec: '<path d="M13.5 2 4 13.5h7L10 22l10-12.5h-7z"/>',
    computer: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5" rx=".6"/><path d="M9 2.5V6M15 2.5V6M9 18v3.5M15 18v3.5M2.5 9H6M2.5 15H6M18 9h3.5M18 15h3.5"/>',
    software: '<path d="m15.5 17.5 6-5.5-6-5.5M8.5 6.5 2.5 12l6 5.5M13.5 4l-3 16"/>',
    comm: '<path d="M12 13v9M9 22l3-9 3 9"/><circle cx="12" cy="10.5" r="2"/><path d="M7.8 6.3a6 6 0 0 0 0 8.4M16.2 6.3a6 6 0 0 1 0 8.4M4.9 3.4a10 10 0 0 0 0 14.2M19.1 3.4a10 10 0 0 1 0 14.2"/>',
    chem: '<path d="M9 2.5h6M10 2.5v6.8L4.4 19a1.6 1.6 0 0 0 1.4 2.4h12.4a1.6 1.6 0 0 0 1.4-2.4L14 9.3V2.5"/><path d="M6.8 15h10.4"/><circle cx="10.5" cy="18" r=".6"/><circle cx="13.8" cy="17.2" r=".6"/>',
    petro: '<path d="M6.5 22 12 2.5 17.5 22M8.6 15h6.8M10.2 9.5h3.6M8.6 15l5.2-5.5M15.4 15l-5.2-5.5M3.5 22h17"/>',
    water: '<path d="M12 2.8S5.8 9.6 5.8 13.9a6.2 6.2 0 0 0 12.4 0C18.2 9.6 12 2.8 12 2.8z"/><path d="M9 14.5a3 3 0 0 0 3 3"/>',
    biomed: '<path d="M20.4 5a5.3 5.3 0 0 0-7.5 0L12 5.9l-.9-.9a5.3 5.3 0 0 0-7.5 7.5L12 21l8.4-8.5a5.3 5.3 0 0 0 0-7.5z"/><path d="M3.5 12.5h4l1.8-2.8 2.6 5.3 1.8-2.5H20"/>',
    aero: '<path d="M21.5 2.5c-2 0-4 .8-5.4 2.2L13 7.8 5 5.5 3 7.5l6.3 4-3 3.2-2.8-.4L2 15.7l3.4 1.6L7 20.7l1.4-1.5-.4-2.8 3.2-3 4 6.3 2-2-2.3-8 3.1-3.1a7.6 7.6 0 0 0 2.2-5.4z"/>',
    industrial: '<path d="M2 21h20M3 21V10l5 3.2V10l5 3.2V10l5 3.2V3.5h3.5V21"/><path d="M7 17h2M11.5 17h2M16 17h2"/>',
    survey: '<rect x="8.5" y="3" width="7" height="5.5" rx="1.2"/><path d="M15.5 5.7H19M12 8.5v2.5M12 11 6 22M12 11l6 11M12 11v11"/>',
    helmet: '<path d="M2 18.5h20M4 18.5a8 8 0 0 1 16 0"/><path d="M10 10.8V6.6a8 8 0 0 1 4 0v4.2"/>',
    vest: '<path d="M8.5 3 4.5 6v15h6v-7.5L12 11l1.5 2.5V21h6V6l-4-3-2 4h-3z"/><path d="M4.5 14.5h6M13.5 14.5h6M4.5 17.5h6M13.5 17.5h6"/>',
    boots: '<path d="M5 3h6.5v8.2l5.6 1.9c2.4.8 3.9 2.3 3.9 4.4V20H5z"/><path d="M5 17h17M13.5 13.5v3.5"/>',
    gloves: '<path d="M8.3 21v-4.6L5 12.3V6.6a1.5 1.5 0 0 1 3 0v3.9M8 10.5V4a1.5 1.5 0 0 1 3 0v6.3M11 10.3V3.5a1.5 1.5 0 0 1 3 0v6.8M14 10.3V5a1.5 1.5 0 0 1 3 0v8.2l-2.2 3.2V21z"/>',
    insgloves: '<path d="M7.3 21v-4.6L4 12.3V6.6a1.5 1.5 0 0 1 3 0v3.9M7 10.5V4a1.5 1.5 0 0 1 3 0v6.3M10 10.3V3.5a1.5 1.5 0 0 1 3 0v6.8M13 10.3V7a1.5 1.5 0 0 1 3 0v6.2l-2.2 3.2V21z"/><path d="m20.5 3-2.3 3.6h2.4L18.3 10"/>',
    glasses: '<circle cx="6.5" cy="14" r="3.6"/><circle cx="17.5" cy="14" r="3.6"/><path d="M10.1 14h3.8M2.9 13.5 1.8 9M21.1 13.5l1.1-4.5"/>',
    goggles: '<rect x="2" y="8" width="20" height="9.5" rx="4.7"/><path d="M12 11.2v3.2M2 12.7H.8M22 12.7h1.2M6 11.5c.8-.8 2-.9 3-.3"/>',
    faceshield: '<path d="M3.5 5.5h17v3.3h-17zM5 8.8v6.7a7 7 0 0 0 14 0V8.8"/><path d="M8 11.5c0 2.5 1 4.3 2.6 5"/>',
    ear: '<path d="M5 14v-3a7 7 0 0 1 14 0v3"/><rect x="2.5" y="13" width="5" height="7.5" rx="2.2"/><rect x="16.5" y="13" width="5" height="7.5" rx="2.2"/>',
    mask: '<path d="M4 9.5c3.2-2.2 12.8-2.2 16 0v3.8a8 8 0 0 1-16 0z"/><circle cx="8.3" cy="14.2" r="2.1"/><circle cx="15.7" cy="14.2" r="2.1"/><path d="M4 10.5 1.8 8M20 10.5 22.2 8M12 17.5v2"/>',
    harness: '<path d="M8 2.5v7.5l4 3 4-3V2.5M8 10l-1.8 11M16 10l1.8 11M12 13v3.5M6.7 16h10.6"/><circle cx="12" cy="18.5" r="1.6"/>',
    fr: '<path d="M8 3h8l3.2 4-2.2 2v12h-4v-7h-2v7H7V9L4.8 7z"/><path d="M12 5.2c1.1 1.1 1.7 2 1.7 3a1.7 1.7 0 0 1-3.4 0c0-1 .6-1.8 1.7-3z"/>',
    labcoat: '<path d="M9 3 5 5.2V21h14V5.2L15 3l-3 5.2z"/><path d="M12 8.2V21M14.7 14.5h2.2M7.2 12.5h2.2"/>',
    gas: '<rect x="6" y="3" width="12" height="18" rx="2.2"/><rect x="8.5" y="5.8" width="7" height="4.2" rx="1"/><circle cx="12" cy="15.2" r="2.6"/><path d="M12 13.9v1.3"/>',
    rf: '<rect x="7" y="10" width="10" height="11.5" rx="2"/><circle cx="12" cy="15.7" r="1.7"/><path d="M9.3 7a4.2 4.2 0 0 1 5.4 0M7 4.4a7.6 7.6 0 0 1 10 0"/>',
    esd: '<circle cx="8" cy="12" r="5"/><circle cx="8" cy="12" r="2.4"/><path d="M13 12h3.5l2 3.5M18.5 15.5h3"/>',
    lifejacket: '<path d="M9 3 5.7 5v14.5L12 21.5l6.3-2V5L15 3l-3 4.2z"/><path d="M5.7 11h12.6M5.7 15h12.6"/>',
    welding: '<path d="M4.5 4.5h15v9a7.5 7.5 0 0 1-15 0z"/><rect x="7.7" y="8" width="8.6" height="3.4" rx="1"/><path d="M9 17.5h6"/>',
    dosimeter: '<rect x="7" y="2.5" width="10" height="19" rx="2.2"/><circle cx="12" cy="12" r="1.2"/><path d="M12 7.5a4.5 4.5 0 0 1 3.9 2.3M8.1 9.8A4.5 4.5 0 0 1 12 7.5M9.8 15.9a4.5 4.5 0 0 0 4.4 0"/>',
    bumpcap: '<path d="M4 15.5a8 8 0 0 1 16 0z"/><path d="M20 15.5h2.5c0 1.4-1.4 2.2-3.4 2.2H4"/><path d="M12 7.5v8"/>',
    ergo: '<path d="M7 3h8.5v9H7zM5.5 12h11.5M11.3 12v5M7 21.5l4.3-4.5 4.3 4.5M3.5 8.5h2"/>',
    bulb: '<path d="M9 18h6M10 21.5h4M12 2.5a6.5 6.5 0 0 0-3.8 11.8c.5.4.8 1 .8 1.7v.5h6V16c0-.7.3-1.3.8-1.7A6.5 6.5 0 0 0 12 2.5z"/>',
    pin: '<path d="M12 21.5s-7-6.2-7-11.5a7 7 0 0 1 14 0c0 5.3-7 11.5-7 11.5z"/><circle cx="12" cy="10" r="2.5"/>',
    book: '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5zM4 21.5A2.5 2.5 0 0 1 6.5 19H20"/>',
    cap: '<path d="M2 9.5 12 5l10 4.5-10 4.5z"/><path d="M6 11.3v4.7c2.6 2.3 9.4 2.3 12 0v-4.7M22 9.5V15"/>',
    briefcase: '<rect x="2.5" y="7" width="19" height="13.5" rx="2"/><path d="M8.5 7V4.8A1.8 1.8 0 0 1 10.3 3h3.4a1.8 1.8 0 0 1 1.8 1.8V7M2.5 12.5h19"/>',
    branch: '<rect x="9" y="2.8" width="6" height="5" rx="1.3"/><rect x="2.5" y="16.2" width="5.6" height="5" rx="1.3"/><rect x="9.2" y="16.2" width="5.6" height="5" rx="1.3"/><rect x="15.9" y="16.2" width="5.6" height="5" rx="1.3"/><path d="M12 7.8v8.4M5.3 16.2v-2.4c0-.9.7-1.6 1.6-1.6h10.2c.9 0 1.6.7 1.6 1.6v2.4"/>',
    code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
    star: '<path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"/>',
    shield: '<path d="M12 2.5 4 5.5v6c0 5 3.4 8.8 8 10 4.6-1.2 8-5 8-10v-6z"/><path d="m8.8 12 2.2 2.2 4.4-4.4"/>',
    info: '<circle cx="12" cy="12" r="9.5"/><path d="M12 11v5.5M12 7.5h.01"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    back: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
    ext: '<path d="M14 3.5h6.5V10M20.5 3.5 11 13M18 14v5.5a1.5 1.5 0 0 1-1.5 1.5h-12A1.5 1.5 0 0 1 3 19.5v-12A1.5 1.5 0 0 1 4.5 6H10"/>',
    image: '<rect x="3" y="3.5" width="18" height="17" rx="2.2"/><circle cx="8.5" cy="9" r="1.8"/><path d="m21 15.5-5-5-9.5 10"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20.5 20.5-4.5-4.5"/>',
    check: '<path d="m4.5 12.5 5 5 10-11"/>',
    menu: '<path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h17"/>',
    close: '<path d="M5.5 5.5l13 13M18.5 5.5l-13 13"/>',
    up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    down: '<path d="M6 9l6 6 6-6"/>',
    refresh: '<path d="M20.5 12a8.5 8.5 0 1 1-2.5-6"/><path d="M20.5 3.5V8H16"/>',
    globe: '<circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19M12 2.5c2.6 2.8 3.9 6 3.9 9.5s-1.3 6.7-3.9 9.5c-2.6-2.8-3.9-6-3.9-9.5s1.3-6.7 3.9-9.5z"/>',
    quote: '<path d="M10 7H6.5A2.5 2.5 0 0 0 4 9.5V13h5v5H4M20 7h-3.5A2.5 2.5 0 0 0 14 9.5V13h5v5h-5"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.8a3.5 3.5 0 0 1 0 6.4M18 14a6.5 6.5 0 0 1 3.5 6"/>',
    calendar: '<rect x="3" y="4.5" width="18" height="16.5" rx="2.2"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>',
    company: '<path d="M3 21h18M5 21V5.5L13 3v18M13 8.5l6 2V21M8 8h2M8 12h2M8 16h2M16 13h1M16 16.5h1"/>',
    layers: '<path d="m12 3 9.5 5-9.5 5-9.5-5z"/><path d="m2.5 13 9.5 5 9.5-5"/>',
    sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>',
    calc: '<rect x="4.5" y="2.5" width="15" height="19" rx="2.2"/><path d="M8 6.5h8v3H8zM8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01M16 17h.01"/>',
    ruler: '<path d="M3 16.5 16.5 3 21 7.5 7.5 21z"/><path d="m7 12.5 2 2M10 9.5l1.5 1.5M13 6.5l2 2M5.5 14l1 1M14.5 5l1 1"/>',
    cube: '<path d="m12 2.8 8.5 4.8v8.8L12 21.2l-8.5-4.8V7.6z"/><path d="m3.5 7.6 8.5 4.8 8.5-4.8M12 12.4v8.8"/>',
    uni: '<path d="m12 3 9.5 5H2.5z"/><path d="M4.5 8.5v9M9 8.5v9M15 8.5v9M19.5 8.5v9M2.5 20.5h19M3.5 17.5h17"/>',
    column: '<path d="M5 4h14M6 6.5h12M5 20h14M4 22h16M8 6.5V20M12 6.5V20M16 6.5V20"/><path d="M5 4c0-1 1-1.5 2-1.5h10c1 0 2 .5 2 1.5"/>',
    pdf: '<path d="M14 2.5H6.5A1.5 1.5 0 0 0 5 4v16a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 20V7.5z"/><path d="M14 2.5v5h5M8.5 13h7M8.5 16.5h5"/>',
    download: '<path d="M12 3.5v12M7 10.5l5 5 5-5M4 20.5h16"/>',
    award: '<circle cx="12" cy="9" r="6"/><path d="m8.5 13.8-1.5 7.7 5-2.8 5 2.8-1.5-7.7"/>',
    trend: '<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
    send: '<path d="M21.5 3 2.5 10.5l7 2.5 2.5 7z"/><path d="m21.5 3-12 10"/>',
    flag: '<path d="M5 21V4M5 4.5c4-2 7 2 14 0v9c-7 2-10-2-14 0"/>',
    rotate: '<path d="M3.5 12a8.5 8.5 0 0 1 14.6-5.9L20.5 8.5M20.5 3.5v5h-5M20.5 12a8.5 8.5 0 0 1-14.6 5.9L3.5 15.5M3.5 20.5v-5h5"/>',
    blueprint: '<rect x="3" y="3.5" width="18" height="17" rx="1.5"/><path d="M3 9h18M9 9v11.5M13 13h5M13 16.5h3"/>',
    filter: '<path d="M3.5 5h17l-6.5 8v6l-4 2v-8z"/>',
    swap: '<path d="M4 8h15l-4-4M20 16H5l4 4"/>'
  };
  return { gearD: gearD, get: function (k) { return I[k] || ''; }, all: I };
})();
