/* Deutsch — Oberflächentexte */
window.I18N = window.I18N || {};
(function (L) {
  L.ui = {
    brand: 'Ingenieurpedia', brandSub: 'Die Enzyklopädie des Ingenieurwesens', lang: 'Sprache',
    nav: { depts: 'Fachrichtungen', colors: 'Helmfarben', safety: 'Sicherheit', software: 'Software', legends: 'Ingenieure', quiz: 'Welches Fach passt zu mir?' },
    loader: 'Dein Helm wird vorbereitet…',
    heroKicker: 'INGENIEURWESEN · ENZYKLOPÄDIE',
    heroTitle: ['Alle', 'Ingenieurfächer', 'an einem Ort'],
    heroLead: 'Diese Website ist eine einfache, verlässliche Enzyklopädie. Sie beleuchtet die wichtigsten Ingenieurfächer, die Art ihrer Arbeit, ihre wichtigste Software und die Berufswege in jedem Fach. Unser Ziel ist, dass du sie verstehst und das richtige Fach für dich wählst.',
    ctaDepts: 'Fachrichtungen entdecken', ctaQuiz: 'Welches Fach passt zu mir?',
    stageHint: 'Tippen, um den Helm aufzusetzen',
    helmetOf: 'Helm in {c}',
    quote: { label: 'Zitat des Tages', text: 'Ich bin Bauingenieur… gemacht für die Baustelle.', by: 'Yad Abdullah', role: 'Bauingenieur' },
    stats: { depts: 'Ingenieurfächer', branches: 'Zweige & Vertiefungen', engineers: 'Brillante Ingenieure', projects: 'Weltbekannte Projekte', software: 'Wichtige Programme' },
    sec: {
      intro: { eyebrow: 'Über', title: 'Was ist|Ingenieurwesen?', lead: 'Ingenieurwesen heißt, Naturwissenschaft und Mathematik zu nutzen, um echte Probleme zu lösen: von Brücken, Gebäuden und Strom bis zu Handys, Medizin und Raketen. Jedes Fach ist eine eigene Welt — wir öffnen sie alle für dich.' },
      colors: { eyebrow: 'Farben', title: 'Eine Helmfarbe|für jedes Fach', lead: 'Jedes Fach hat seine eigene Farbe — dieselbe Farbe wie der Helm, den du beim Betreten aufsetzt. Auch Hintergrund und Oberfläche jedes Fachs passen sich daran an.' },
      depts: { eyebrow: 'Fachrichtungen', title: 'Die Ingenieur-|fachrichtungen', lead: 'Wähle ein Fach und sieh, wie es ist, was Studierende lernen, wie viele Zweige es hat, welche Master- und Promotionswege es gibt und wer seine größten Ingenieure sind.' },
      safety: { eyebrow: 'Sicherheit', title: 'Helme &|Sicherheit', lead: 'Sicherheit ist die erste Regel des Ingenieurwesens. Hier lernst du den Farbcode der Helme, die Helmtypen, die elektrischen Klassen und die gesamte persönliche Schutzausrüstung (PSA).' },
      software: { eyebrow: 'Software', title: 'Der Werkzeugkasten|der Ingenieure', lead: 'Die Programme, die Ingenieure jeden Tag nutzen. Tippe auf ein Programm, um zu erfahren, was es ist, wer es nutzt und welche großen Werke damit entstanden sind.' },
      legends: { eyebrow: 'Legenden', title: 'Die größten Ingenieure|der Welt', lead: '140 Ingenieure und Erfinder — 10 für jedes Fach, jeweils mit Biografie und 3 bedeutenden Projekten. Tippe auf jemanden, um ihn kennenzulernen.' },
      quiz: { eyebrow: 'Wählen', title: 'Welches Fach|passt zu dir?', lead: 'Beantworte sechs kurze Fragen und sieh die drei Fächer, die am besten zu dir passen.' },
      others: { eyebrow: 'Mehr', title: 'Weitere|Ingenieurfächer', lead: 'Neben den Hauptfächern gibt es an Universitäten weltweit diese Vertiefungen; die meisten sind Zweige eines der Hauptfächer.' }
    },
    search: 'Suche: Elektro, Erdöl, AutoCAD, GIS …', empty: 'Nichts gefunden. Versuch ein anderes Wort.',
    card: { branches: 'Zweige', years: 'Jahre', enter: 'Eintreten' },
    safety: {
      codes: 'Farbcode der Helme auf der Baustelle', codesNote: 'Dies ist eine verbreitete allgemeine Orientierung; die Farben unterscheiden sich je nach Land und Firma. Halte dich immer an die Regeln deiner eigenen Baustelle.',
      types: 'Helmtypen nach Stoßschutz', classes: 'Elektrische Klassen', styles: 'Helmformen',
      standards: 'Internationale Normen', care: 'So pflegst du deinen Helm',
      ppe: 'Persönliche Schutzausrüstung (PSA)', ppeNote: 'Die farbigen Punkte unten auf jeder Karte zeigen, welche Fächer diesen Gegenstand brauchen.'
    },
    swAll: 'Alle Programme', swOpen: 'Details', swMore: 'Alle Programme anzeigen',
    quiz: { restart: 'Neu beginnen', again: 'Noch einmal', result: 'Diese Fächer passen am besten zu dir', match: 'Übereinstimmung', note: 'Dieses Ergebnis ist nur eine Orientierung; sprich mit Ingenieuren und Studierenden dieser Fächer, bevor du dich entscheidest.' },
    dept: {
      back: 'Alle Fächer', label: 'Fach',
      tabs: ['Über', 'Studium', 'Zweige', 'Master & Promotion', 'Software', 'Berufe', 'Sicherheit', 'Ingenieure'],
      chips: { years: '{n} Jahre Studium', branches: '{n} Zweige', engineers: '{n} berühmte Ingenieure' },
      about: 'Wie ist|dieses Fach?', nature: 'Art der Arbeit', fact: 'Wusstest du?',
      study: 'Was lernen|die Studierenden?', studyLead: 'Dieses Studium dauert meist {n} Jahre. Das sind die wichtigsten Fächer jedes Studienjahres.',
      studyNote: 'Hinweis: Diese Lehrveranstaltungen sind ein allgemeiner Überblick für Ingenieurfächer; Namen, Anzahl und Reihenfolge der Fächer ändern sich je nach Universität, Land und Stadt.',
      stage: 'Jahr {n}',
      branches: 'Wie viele|Zweige?', branchesCount: 'Hauptzweige & Vertiefungen',
      grad: 'Master &|Promotion', gradLead: 'Nach dem Bachelor kannst du in diesen Vertiefungen weitermachen. Ein Master dauert meist 2 Jahre, eine Promotion 3 bis 5 Jahre.', msc: 'Master', phd: 'Promotion — Forschungsfelder',
      software: 'Wichtige|Software', softwareLead: 'Diese Programme werden an Universitäten und auf dem Arbeitsmarkt am meisten genutzt. Tippe auf eines für eine Beschreibung, wer es nutzt und Beispiele großer Werke.',
      jobs: 'Welche Berufe|gibt es?', jobsLead: 'Nach dem Abschluss sind das die wichtigsten Berufswege — in Kurdistan und weltweit.',
      safety: 'Helm &|Schutzausrüstung', helmetColor: 'Helmfarbe', spec: 'Typ & Klasse', style: 'Form', ppe: 'Nötige Schutzausrüstung', tip: 'Sicherheitstipp',
      engineers: 'Die größten Ingenieure|dieses Fachs', engineersLead: '10 berühmte Ingenieure, ihre Biografien und jeweils 3 bedeutende Projekte. Die Fotos stammen aus Wikipedia / Wikimedia Commons.',
      bio: 'Biografie', wiki: 'Wikipedia', google: 'Bilder bei Google', projects: 'Bedeutende Projekte',
      prev: 'Vorheriges Fach', next: 'Nächstes Fach'
    },
    sw: { maker: 'Hersteller', since: 'Erste Version', usedIn: 'Genutzt in diesen Fächern', who: 'Wer nutzt es?', works: 'Große Werke & Beispiele', about: 'Was ist dieses Programm?', site: 'Offizielle Website', wiki: 'Wikipedia', google: 'Bilder bei Google', close: 'Schließen' },
    drop: { wear: 'Setz den Helm in {c} auf', welcome: 'Willkommen — {d}' },
    footer: {
      about: 'Eine einfache, verlässliche Enzyklopädie, die dir hilft, das Ingenieurwesen zu verstehen und das richtige Fach zu wählen.',
      img: 'Bilder: Fotos von Ingenieuren und Projekten stammen aus Wikipedia und Wikimedia Commons, Fotos der Fächer von Pexels (kostenlos). Jede Karte hat außerdem einen Button „Bilder bei Google“.',
      helmet: 'Die Helmfarben der Fächer auf dieser Website dienen der Erkennung; auf einer echten Baustelle gelten die Regeln der Firma und des Landes.',
      credit: 'Entwickelt von Yad Abdullah', top: 'Nach oben'
    }
  };

  L.helmet = {
    codes: [
      { n: 'Weiß', r: 'Ingenieure, Bauleiter und Aufsichtspersonen' },
      { n: 'Gelb', r: 'Allgemeine Arbeiter und Erdbaumaschinenführer' },
      { n: 'Orange', r: 'Straßenbautrupps, Kran- und Hebezeugführer, Einweiser' },
      { n: 'Blau', r: 'Elektriker, Zimmerleute und Techniker' },
      { n: 'Grün', r: 'Sicherheitsfachkräfte und Prüfer (auf manchen Baustellen neue Arbeiter)' },
      { n: 'Rot', r: 'Feuerwehr und Notfallteams' },
      { n: 'Braun', r: 'Schweißer und Arbeiten mit großer Hitze' },
      { n: 'Grau', r: 'Besucher der Baustelle' },
      { n: 'Rosa', r: 'Vorübergehender Ersatzhelm (für jemanden, der seinen vergessen hat)' },
      { n: 'Schwarz', r: 'Leitende Aufsichtspersonen in manchen Firmen' }
    ],
    types: [
      { n: 'Schutz von oben', d: 'Für Gegenstände, die von oben herabfallen; der häufigste Typ auf Baustellen.' },
      { n: 'Schutz von oben & seitlich', d: 'Hat eine innere Schaumschicht gegen Schläge von der Seite, von vorn und hinten; besser für Fabriken und bewegte Maschinen.' }
    ],
    classes: [
      { n: 'Allgemein', v: '2.200 V', d: 'Schutz bei Kontakt mit Niederspannung; für die meisten Bauarbeiten geeignet.' },
      { n: 'Elektrisch', v: '20.000 V', d: 'Für Hochspannung geprüft; Pflicht für alle Elektroingenieure und -arbeiter.' },
      { n: 'Leitfähig', v: '0 V', d: 'Kein elektrischer Schutz; leicht und belüftet, für Bereiche fern von Strom.' }
    ],
    styles: [
      { n: 'Kappenform', d: 'Die häufigste Form; ein kurzer vorderer Schirm gegen Regen und Sonne.' },
      { n: 'Rundum-Krempe', d: 'Beschattet Gesicht und Nacken; ideal für die heißen Sommer in Kurdistan.' },
      { n: 'Belüftet', d: 'Hat Lüftungsöffnungen zur Kühlung; nicht für Elektroarbeiten geeignet.' },
      { n: 'Kletterhelm', d: 'Hat einen Kinnriemen, damit er nicht herunterfällt; für Masten und Höhenarbeit.' },
      { n: 'Anstoßkappe', d: 'Für niedrige, enge Räume; schützt nicht vor schweren fallenden Gegenständen.' },
      { n: 'Kombi-Set', d: 'Mit Gesichtsschutz und Gehörschutz; für Schneiden, Schweißen und Forstarbeit.' },
      { n: 'Grubenhelm', d: 'Trägt eine Lampe; für Bergwerke, Tunnel und dunkle Orte.' },
      { n: 'Feuerwehrhelm', d: 'Widersteht sehr großer Hitze und Flammen.' }
    ],
    standards: ['Amerikanische Norm für Helmtypen und -klassen', 'Europäische Norm für Industrieschutzhelme', 'Elektrisch isolierende Helme bis 1.000 V', 'Helme für Klettern und Höhenarbeit', 'Industrielle Anstoßkappen'],
    care: [
      'Prüfe ihn täglich vor dem Gebrauch: Risse, Löcher, Erweichung oder Farbveränderung.',
      'Ersetze ihn nach jedem starken Schlag, auch wenn du keinen Schaden siehst.',
      'Als Faustregel: Innenausstattung jedes Jahr und Schale alle 2 bis 5 Jahre ersetzen — folge den Angaben des Herstellers.',
      'Nicht bemalen, nicht anbohren und nicht mit Aufklebern bedecken; Chemikalien schwächen den Kunststoff.',
      'Nicht in der prallen Sonne im Auto liegen lassen; Hitze und UV-Licht schwächen Kunststoff.'
    ]
  };

  L.ppe = {
    helmet: { n: 'Schutzhelm', d: 'Schützt den Kopf vor fallenden Gegenständen und Stößen; die erste Bedingung, um eine Baustelle zu betreten.' },
    vest: { n: 'Warnweste', d: 'Damit Fahrer und Maschinenführer dich sehen, bei Tag und Nacht.' },
    boots: { n: 'Sicherheitsschuhe', d: 'Stahlkappen und durchtrittsichere, rutschfeste Sohlen.' },
    gloves: { n: 'Arbeitshandschuhe', d: 'Schützen die Hände vor Schnitten, Abschürfungen und rauen Materialien.' },
    insgloves: { n: 'Isolierhandschuhe', d: 'Isolierte Gummihandschuhe für Arbeiten nahe unter Spannung stehender Teile.' },
    glasses: { n: 'Schutzbrille', d: 'Schützt die Augen vor fliegenden Teilchen, Staub und Strahlung.' },
    goggles: { n: 'Vollsichtbrille', d: 'Deckt die Augen vollständig ab, gegen Chemikalienspritzer und Dämpfe.' },
    faceshield: { n: 'Gesichtsschutz', d: 'Schützt das ganze Gesicht vor Spritzern, Splittern und Störlichtbögen.' },
    ear: { n: 'Gehörschutz', d: 'Für Lärm über 85 Dezibel; lauter Lärm führt langsam zu Taubheit.' },
    mask: { n: 'Atemschutzmaske', d: 'Schutz vor Staub, Rauch, Dämpfen und giftigen Gasen.' },
    harness: { n: 'Auffanggurt', d: 'Ein Ganzkörpergurt für Arbeiten mehr als 1,8 Meter über dem Boden.' },
    fr: { n: 'Flammhemmende Kleidung', d: 'Nicht brennbare (FR) Kleidung, wo Gefahr durch Feuer, Gas oder Lichtbögen besteht.' },
    labcoat: { n: 'Laborkittel', d: 'Schützt Kleidung und Haut vor chemischen und biologischen Stoffen.' },
    gas: { n: 'Gaswarngerät', d: 'Warnt dich vor giftigen und explosiven Gasen wie H₂S, CO und Methan.' },
    rf: { n: 'HF-Strahlungswarner', d: 'Warnt dich, wenn du starken Antennen zu nahe kommst.' },
    esd: { n: 'ESD-Armband', d: 'Verhindert, dass statische Elektrizität Chips und Elektronikplatinen beschädigt.' },
    lifejacket: { n: 'Rettungsweste', d: 'Für Arbeiten am Wasser, an Talsperren, Kanälen und auf See.' },
    welding: { n: 'Schweißhelm', d: 'Schützt Augen und Gesicht vor UV-Licht und dem Schweißlichtbogen.' },
    dosimeter: { n: 'Strahlendosimeter', d: 'Misst, wie viel Strahlung du abbekommen hast; in der Nähe von Röntgen- und CT-Geräten.' },
    bumpcap: { n: 'Anstoßkappe', d: 'Für niedrige, enge Räume; schützt nicht vor schweren fallenden Gegenständen.' },
    ergo: { n: 'Büro-Ergonomie', d: 'Ein guter Stuhl, der Bildschirm auf Augenhöhe und kurze Pausen — Sicherheit für Computeringenieure.' }
  };

  L.quiz = [
    { q: 'Welche Arbeit macht dich am glücklichsten?', a: ['Etwas Riesiges bauen, das Jahrhunderte hält', 'Maschinen, Motoren und Bewegung verstehen', 'Strom, Schaltungen und Elektronik', 'Code schreiben und Apps bauen', 'Chemische Experimente und Stoffe umwandeln'] },
    { q: 'Wo möchtest du arbeiten?', a: ['Auf der Baustelle, draußen an der frischen Luft', 'In einer Fabrik oder Werkstatt', 'Im Büro am Computer', 'Im Labor oder im Krankenhaus'] },
    { q: 'Welches Fach magst du am liebsten?', a: ['Mathematik und Physik', 'Chemie und Biologie', 'Kunst und Zeichnen', 'Geografie und Karten', 'Logik und Denksportaufgaben'] },
    { q: 'Welches Projekt fasziniert dich am meisten?', a: ['Burj Khalifa', 'Die Saturn-V-Rakete und die Mondlandung', 'Handys und das Internet', 'Dukan-Talsperre', 'Ein Öl- und Gasfeld', 'Kunstherzen und Medizingeräte'] },
    { q: 'Wie denkst du?', a: ['Systeme, Zeit und Kosten organisieren und verbessern', 'Neue Dinge erfinden und entwerfen', 'Genau rechnen und analysieren', 'Probleme mit Code lösen'] },
    { q: 'Wie sehr magst du Arbeit im Gelände?', a: ['Sehr — ich kann nicht den ganzen Tag im Büro sitzen', 'Mittel — eine Mischung aus beidem', 'Wenig — ich bevorzuge Büro und Labor'] }
  ];

  L.others = [
    { n: 'Umwelttechnik', d: 'Wasser, Luft und Abfall behandeln und die Natur vor Verschmutzung schützen.' },
    { n: 'Bergbau', d: 'Mineralien und Gestein sicher und wirtschaftlich finden und gewinnen.' },
    { n: 'Werkstoffe & Metallurgie', d: 'Neue Werkstoffe schaffen: Stahl, Aluminium, Verbundwerkstoffe und Keramik.' },
    { n: 'Kerntechnik', d: 'Kernkraftwerke, Strahlenschutz und Nuklearmedizin.' },
    { n: 'Mechatronik', d: 'Mechanik, Elektronik und Informatik vereint für Roboter und intelligente Maschinen.' },
    { n: 'Schiffs- & Meerestechnik', d: 'Schiffe, Häfen und Offshore-Bauwerke entwerfen.' },
    { n: 'Agrartechnik', d: 'Landmaschinen, moderne Bewässerung und Lebensmittelverarbeitung.' },
    { n: 'Fahrzeugtechnik', d: 'Autos entwerfen und bauen, besonders Elektrofahrzeuge.' },
    { n: 'Robotik & KI', d: 'Industrieroboter, selbstfahrende Autos und Systeme mit maschinellem Lernen.' },
    { n: 'Elektronik & Regelungstechnik', d: 'Schaltungen, Sensoren und automatische Regelsysteme entwerfen.' }
  ];
})(window.I18N.de = window.I18N.de || {});
