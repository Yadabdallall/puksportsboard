/* Deutsch — Ingenieur-Rechner */
window.I18N = window.I18N || {};
(function (L) {
  L.tools = {
    disclaimer: 'Die Ergebnisse sind ingenieurmäßige Schätzungen für Planung, Materialbestellung und Lernen. Für die endgültige Bemessung gelten die Normen deines Landes (z. B. ACI 318, IEC 60364, ASHRAE) und der verantwortliche Ingenieur.',
    secs: { civil: 'Bau', elec: 'Elektro', mech: 'Maschinenbau', conv: 'Einheiten' },
    secLabels: { civil: 'Bauingenieurwesen', elec: 'Elektrotechnik', mech: 'Maschinenbau & TGA', conv: 'Für alle Fächer' },
    secTitles: { civil: 'Beton, Steine|und Bewehrung', elec: 'Kabel, Sicherungen|und Licht', mech: 'Klimagerät|und Luftkanal', conv: 'Einheiten|umrechnen' },
    common: { how: 'Wie wird gerechnet?', bad: 'Bitte gültige Zahlen eingeben (null oder mehr).' },
    c: {
      concrete: {
        t: 'Zement, Sand und Kies für Beton',
        d: 'Zement (Säcke), Sand, Kies und Wasser für Decke, Fundament, Stütze oder jedes Betonbauteil.',
        f: { L: 'Länge', W: 'Breite', H: 'Dicke / Höhe', n: 'Anzahl der Bauteile', grade: 'Mischungsverhältnis', waste: 'Verlustzuschlag', bag: 'Zementsack' },
        o: { grade: { m10: '1:3:6 — etwa M10 (Sauberkeitsschicht, einfache Fundamente)', m15: '1:2:4 — etwa M15 (allgemein, normale Decken)', m20: '1:1,5:3 — etwa M20 (Decken, Balken, Stützen)', m25: '1:1:2 — etwa M25 (hohe Festigkeit)' } },
        r: { vol: 'Betonvolumen', bags: 'Zementsäcke', cement: 'Zementmenge', sand: 'Sand', gravel: 'Kies', water: 'Wasser', mix: 'Mischungsverhältnis', wc: 'Wasserzementwert' },
        how: 'Frischbetonvolumen × 1,54 = Trockenvolumen der Ausgangsstoffe (die Hohlräume zwischen den Körnern werden gefüllt). Dieses Volumen wird nach dem Mischungsverhältnis aufgeteilt; Zement hat 1440 kg/m³. Das sind Rezeptmischungen; für wichtige Bauteile ist eine Mischung nach ACI 211 besser.'
      },
      block: {
        t: 'Steine und Mörtel',
        d: 'Anzahl der Steine, Mörtelvolumen, Zement und Sand für eine Wand — abzüglich Türen und Fenster.',
        f: { L: 'Wandlänge', H: 'Wandhöhe', open: 'Fläche Türen & Fenster', size: 'Steinformat', joint: 'Fugendicke', mortar: 'Mörtelverhältnis (Zement : Sand)', waste: 'Bruchzuschlag' },
        r: { area: 'Wandfläche', blocks: 'Anzahl Steine', perM2: 'Steine pro m²', mortarV: 'Mörtelvolumen', bags: 'Zementsäcke (50 kg)', sand: 'Sand' },
        how: 'Steine = Fläche ÷ ((Steinlänge + Fuge) × (Steinhöhe + Fuge)). Mörtel wird nur für die Fugen gerechnet und für das Trockenvolumen mit 1,33 multipliziert. Hohlblocksteine brauchen etwas weniger Mörtel.'
      },
      rebar: {
        t: 'Bewehrungsgewicht',
        d: 'Gewicht der Bewehrung aus Durchmesser, Länge und Anzahl — mit der Zahl der 12-m-Stäbe zum Einkauf.',
        f: { d: 'Stabdurchmesser', len: 'Länge je Stab', count: 'Anzahl der Stäbe' },
        r: { kgm: 'Gewicht pro Meter', total: 'Gesamtlänge', weight: 'Gesamtgewicht', tonnes: 'In Tonnen', bars12: '12-m-Stäbe' },
        how: 'Gewicht pro Meter = d² ÷ 162 (d in mm). Das folgt aus Stabquerschnitt × Stahldichte (7850 kg/m³). Übergreifungen und Verschnitt separat ansetzen.'
      },
      section: {
        t: 'Bewehrung eines Betonquerschnitts',
        d: 'Für Balken, Stütze, Decke, Fundament oder Wand: erforderlicher Stahlquerschnitt, Stabanzahl und Gewicht aus dem Bewehrungsgrad (ρ).',
        f: { type: 'Bauteil', b: 'Breite (b)', h: 'Höhe / Dicke (h)', len: 'Länge', rho: 'Bewehrungsgrad (ρ)', d: 'Durchmesser Hauptbewehrung' },
        o: { type: { beam: 'Balken', column: 'Stütze', slab: 'Decke (ein Streifen)', footing: 'Fundament', wall: 'Betonwand' } },
        r: { As: 'Erforderlicher Stahlquerschnitt (As)', nbars: 'Stäbe', main: 'Gewicht Hauptbewehrung', vol: 'Betonvolumen', kgm3: 'kg pro m³', est: 'Gesamtschätzung inkl. Bügel' },
        n: {
          n_beam: 'Balken: Mindestbewehrung nach ACI 318 etwa 0,33 % (fy = 420 MPa); üblich sind 0,8 % – 1,5 %.',
          n_column: 'Stützen: ACI 318 begrenzt den Bewehrungsgrad auf 1 % bis 8 %; praktisch meist 1 % – 3 %.',
          n_slab: 'Decken: Mindestbewehrung für Schwinden und Temperatur 0,18 % (ACI 318, fy = 420 MPa).',
          n_footing: 'Fundamente: mindestens 0,18 %; die Dicke folgt aus Querkraft und Bodenpressung.',
          n_wall: 'Wände: ACI 318 fordert mindestens 0,12 % vertikal und 0,20 % horizontal (Stäbe ≤ 16 mm).'
        },
        how: 'As = ρ × b × h. Stäbe = As ÷ Querschnitt eines Stabes (π d² / 4). Gewicht = Stäbe × Länge × d² / 162. Die „Gesamtschätzung“ nutzt einen typischen Wert in kg pro m³ für dieses Bauteil, einschließlich Bügeln und Übergreifungen.'
      },
      cable: {
        t: 'Kabelquerschnitt',
        d: 'Kabelquerschnitt aus Strom und Spannungsfall — mit passender Sicherung und Temperaturkorrektur für heiße Sommer.',
        f: { sys: 'Netz', P: 'Leistung', pf: 'Leistungsfaktor', len: 'Kabellänge (einfach)', vd: 'Max. Spannungsfall', mat: 'Leiter', method: 'Verlegeart', temp: 'Umgebungstemperatur' },
        o: { sys: { 1: 'Einphasig — 230 V', 3: 'Dreiphasig — 400 V' }, mat: { cu: 'Kupfer (Cu)', al: 'Aluminium (Al)' }, method: { B1: 'Im Rohr auf der Wand (B1)', C: 'Direkt auf der Wand (C)' } },
        r: { Ib: 'Betriebsstrom (Ib)', In: 'Sicherung (In)', size: 'Kabelquerschnitt', Iz: 'Belastbarkeit (Iz)', vdrop: 'Spannungsfall', volts: 'Spannung' },
        w: { tooBig: 'Die Last ist für ein einzelnes Kabel zu groß; parallele Kabel, höhere Spannung oder kürzere Leitung wählen.' },
        how: 'Strom: I = P ÷ (V × cos φ) — dreiphasig √3 × V. Dann wird der kleinste Querschnitt gewählt, dessen (1) Belastbarkeit nach Temperaturkorrektur ≥ der Sicherung ist und (2) Spannungsfall innerhalb der Grenze bleibt. Tabellen: IEC 60364-5-52, PVC-Kabel.'
      },
      breaker: {
        t: 'Sicherungsgröße',
        d: 'Passender Leitungsschutzschalter (MCB/MCCB), Auslösecharakteristik und Mindestquerschnitt für eine Last.',
        f: { sys: 'Netz', P: 'Leistung', pf: 'Leistungsfaktor', load: 'Lastart', cont: 'Dauerlast (3 h oder länger)' },
        o: { sys: { 1: 'Einphasig — 230 V', 3: 'Dreiphasig — 400 V' }, load: { light: 'Beleuchtung und Heizgeräte', socket: 'Steckdosen und allgemeine Lasten', motor: 'Motoren, Pumpen, Klimageräte', heavy: 'Transformatoren und große Motoren' }, cont: { yes: 'Ja', no: 'Nein' } },
        r: { Ib: 'Betriebsstrom', need: 'Bemessungsstrom', In: 'Sicherung', curve: 'Charakteristik', kind: 'Typ', cable: 'Mindestquerschnitt' },
        n: { rcd: 'Für Steckdosen, Bäder und Feuchträume einen FI-Schutzschalter (RCD) 30 mA ergänzen — er schützt Leben.' },
        how: 'Für Dauerlasten: In ≥ 1,25 × Ib (wie im NEC), dann der nächste Normwert. Charakteristik B für Licht, C für Motoren, D für sehr hohe Einschaltströme. Die Belastbarkeit Iz des Kabels muss immer ≥ In sein.'
      },
      lux: {
        t: 'Raumbeleuchtung (Lux)',
        d: 'Anzahl und Anordnung der Leuchten, um die nötige Beleuchtungsstärke eines Raumes nach EN 12464-1 zu erreichen.',
        f: { L: 'Raumlänge', W: 'Raumbreite', room: 'Raumart', E: 'Erforderliche Beleuchtungsstärke', lm: 'Lumen je Leuchte', uf: 'Raumwirkungsgrad', mf: 'Wartungsfaktor', eff: 'Lichtausbeute' },
        o: { room: { corridor: 'Flur (100 lx)', bedroom: 'Schlafzimmer (150 lx)', living: 'Wohnzimmer (200 lx)', kitchen: 'Küche (300 lx)', classroom: 'Klassenraum (300 lx)', office: 'Büro (500 lx)', meeting: 'Besprechungsraum (500 lx)', drawing: 'Technisches Zeichnen (750 lx)', workshop: 'Werkstatt (500 lx)', hospital: 'Untersuchungsraum (1000 lx)', parking: 'Parkhaus (75 lx)' } },
        r: { area: 'Fläche', flux: 'Benötigter Lichtstrom', n: 'Leuchten', grid: 'Anordnung', achieved: 'Erreichte Beleuchtungsstärke', power: 'Gesamtleistung', wm2: 'Leistung pro m²' },
        how: 'Wirkungsgradverfahren: N = E × A ÷ (Φ × UF × MF). E ist die erforderliche Beleuchtungsstärke (Lux), A die Fläche, Φ der Lichtstrom einer Leuchte, UF der Anteil, der die Arbeitsfläche erreicht (etwa 0,5 – 0,7), MF der Verlust durch Alterung und Schmutz (etwa 0,8).'
      },
      ac: {
        t: 'Klimagerät-Größe (BTU / Tonnen)',
        d: 'Kühllast in BTU/h und Tonnen für einen Raum — abgestimmt auf das heiße Klima Kurdistans und des Irak.',
        f: { L: 'Raumlänge', W: 'Raumbreite', H: 'Raumhöhe', people: 'Personen', climate: 'Klima', sun: 'Sonne', kitchen: 'Küche?', equip: 'Geräte (TV, Computer …)' },
        o: { climate: { moderate: 'Gemäßigt (≈ 35 °C)', hot: 'Heiß — Sommer in Kurdistan (≈ 45 °C)', veryhot: 'Sehr heiß — Südirak & Golf (≈ 50 °C)' }, sun: { shade: 'Schattig / Nordseite', normal: 'Normal', sunny: 'Sehr sonnig / oberstes Geschoss' }, kitchen: { no: 'Nein', yes: 'Ja' } },
        r: { area: 'Fläche', btu: 'Kühllast', ton: 'Tonnen', kw: 'Kilowatt (Kälte)', unit: 'Empfohlenes Gerät', cfm: 'Luftmenge' },
        how: 'Schnellschätzung: Fläche × Last pro m² je nach Klima × (Raumhöhe ÷ 2,7) × Sonnenfaktor, + 600 BTU/h pro Person über 2, + 4000 für eine Küche, + Watt × 3,412 für Geräte. 1 Tonne = 12.000 BTU/h. Für die genaue Auslegung ASHRAE (CLTD/RTS) verwenden.'
      },
      duct: {
        t: 'Luftkanal-Dimensionierung',
        d: 'Rund- und Rechteckkanal aus Luftmenge und Geschwindigkeit — mit Druckverlust.',
        f: { Q: 'Luftmenge', qu: 'Einheit der Luftmenge', v: 'Luftgeschwindigkeit', hh: 'Höhe des Rechteckkanals' },
        r: { A: 'Erforderliche Fläche', D: 'Theoretischer Durchmesser', Ds: 'Rundkanal (Norm)', rect: 'Rechteckkanal (Breite × Höhe)', vAct: 'Tatsächliche Geschwindigkeit', fric: 'Druckverlust' },
        w: { aspect: 'Das Seitenverhältnis liegt über 4; eine größere Höhe senkt Geräusch und Druckverlust.' },
        how: 'Geschwindigkeitsverfahren: A = Q ÷ v und D = √(4A/π). Das Rechteck wird mit der Huebscher-Gleichung dem Rundkanal gleichwertig gemacht (gleicher Druckverlust). Empfohlene Geschwindigkeiten: Hauptkanal 4 – 6 m/s im Wohnbau, 6 – 9 m/s im Gewerbebau; Abzweige 2,5 – 4 m/s. 1 Tonne ≈ 400 CFM.'
      },
      conv: {
        t: 'Einheitenrechner',
        d: 'Länge, Fläche (mit Dunam), Volumen, Masse, Kraft, Druck, Leistung, Energie, Volumenstrom und Temperatur.',
        cat: 'Größe', value: 'Wert', from: 'Von', to: 'Nach', swap: 'Tauschen',
        cats: { length: 'Länge', area: 'Fläche', volume: 'Volumen', mass: 'Masse', force: 'Kraft', pressure: 'Druck & Spannung', power: 'Leistung', energy: 'Energie', flow: 'Volumenstrom', temp: 'Temperatur' }
      }
    }
  };
})(window.I18N.de = window.I18N.de || {});
