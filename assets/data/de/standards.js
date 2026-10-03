/* Deutsch — internationale Ingenieurnormen */
window.I18N = window.I18N || {};
(function (L) {
  L.standards = {
    kinds: [
      ['Standard', 'Norm', 'Ein von Fachleuten vereinbartes Dokument, das ein Prüfverfahren, eine Materialeigenschaft oder eine Produktanforderung festlegt — etwa ASTM C39 für die Druckfestigkeitsprüfung von Beton.'],
      ['Code', 'Regelwerk (Code)', 'Regeln für Bemessung und Ausführung, die Staaten oder Städte oft als Gesetz übernehmen — etwa ACI 318 für Beton oder der IBC für Gebäude.'],
      ['Specification', 'Spezifikation', 'Die Anforderungen, die ein Material oder eine Leistung erfüllen muss — etwa ASTM C150 für Zement oder die Projektspezifikation als Teil des Vertrags.'],
      ['Guide', 'Leitfaden', 'Empfehlungen und gute Praxis statt verbindlicher Regeln — ACI-Dokumente mit R am Ende (wie ACI 213R) sind Leitfäden.']
    ],
    anatTitle: 'Wie liest man den Namen einer Norm?',
    anat: [
      'Die Organisation, die die Norm herausgegeben hat (ASTM International).',
      'Der Klassenbuchstabe: C für Beton, Zement und Mauerwerk; A für Eisen und Stahl; D für Boden, Kunststoffe und Erdöl; E für allgemeine Prüfverfahren.',
      'Die laufende Nummer der Norm.',
      'M bedeutet, dass die metrische (SI-)Fassung zusammen mit der Zoll-Pfund-Fassung erscheint.',
      'Das Jahr der letzten Überarbeitung (2021). Immer die aktuelle Ausgabe verwenden — oder die im Vertrag genannte.'
    ],
    listLabel: 'Organisationen', listTitle: 'Die Organisationen, die die Sprache|der Technik geschrieben haben',
    listLead: 'Wähle ein Fach, um nur die dafür wichtigen Normen zu sehen. Auch ein Klick auf einen Fachnamen in einer Karte filtert.',
    all: 'Alle', codes: 'Wichtigste Normen und Regelwerke', site: 'Offizielle Website: ',
    iqTitle: 'Was wird im Irak und in der Region Kurdistan verwendet?',
    iq: [
      'Betonbemessung folgt meist ACI 318 und Materialprüfung ASTM; in älteren Projekten trifft man auch die britische BS 8110.',
      'Zement und Gesteinskörnung werden nach den irakischen Normen IQS No. 5 und IQS No. 45 geprüft, herausgegeben von der COSQC (gegründet 1979).',
      'Das Stromnetz hat 230/400 V und 50 Hz; Planungen beziehen sich meist auf IEC 60364 oder BS 7671.',
      'Brandschutz- und Brandmeldeanlagen großer Projekte folgen NFPA, Heizung und Kühlung ASHRAE.',
      'In den Öl- und Gasfeldern sind die Normen von API und ASME die Arbeitsgrundlage.',
      'Internationale und geberfinanzierte Projekte nutzen oft FIDIC-Verträge; irakische Staatsaufträge haben eigene allgemeine Bedingungen.',
      'Vor Beginn immer klären, welche Norm — und welche Ausgabe — Vertrag und Bauherr verlangen.'
    ],
    orgs: {
      aci: { d: 'Die weltweit führende Instanz für Betonbemessung und -ausführung. ACI 318 ist in den meisten Ländern des Nahen Ostens, auch im Irak und in Kurdistan, Grundlage für Betonbauten.' },
      astm: { d: 'Über 12.000 Normen für Werkstoffe und Prüfungen: Beton, Stahl, Boden, Erdöl, Kunststoffe und Medizinprodukte. Beton- und Bodenlabore in Kurdistan nutzen sie täglich.' },
      iso: { d: 'Der größte Normenherausgeber der Welt mit rund 170 Mitgliedsländern. ISO 9001 für Qualität und ISO 19650 für BIM sind die bekanntesten Normen für Ingenieurbüros.' },
      iec: { d: 'Setzt weltweite Normen für alles Elektrische und Elektronische: Gebäudeinstallationen, Leitungsschutzschalter, Blitzschutz und Medizingeräte. Fast die ganze Welt außerhalb Nordamerikas stützt sich darauf.' },
      ieee: { d: 'Die größte Berufsorganisation von Ingenieuren weltweit. WLAN (802.11) und Ethernet (802.3) sind IEEE-Normen — jedes Gerät, das du mit dem Internet verbindest, nutzt sie.' },
      nfpa: { d: 'Schreibt Regelwerke für Brand- und Elektrosicherheit. NFPA 70 (NEC) ist Amerikas Elektrocode, NFPA 101 regelt Fluchtwege und Personensicherheit in Gebäuden.' },
      asme: { d: 'Ihr Boiler and Pressure Vessel Code (BPVC) gehört zu den ältesten und wichtigsten Regelwerken der Technik. Rohrleitungen in Raffinerien und Kraftwerken sowie technische Zeichnungen (GD&T) folgen ASME.' },
      ashrae: { d: 'Die wichtigste Referenz für TGA- und Klimaingenieure. Normen für Energie (90.1), Raumluft (62.1) und thermische Behaglichkeit (55) sowie das ASHRAE Handbook werden weltweit genutzt.' },
      aisc: { d: 'Gibt die Bemessungsnorm für Stahlbauten heraus. AISC 360 für die normale Bemessung und AISC 341 für Erdbebensicherheit; Hallen, Fabriken und Stahlhochhäuser werden damit geplant.' },
      asce: { d: 'Die älteste Ingenieurvereinigung der USA. ASCE 7 legt die Lasten fest — Wind, Schnee, Erdbeben und Nutzlasten — der erste Schritt bei jedem Gebäudeentwurf.' },
      icc: { d: 'Veröffentlicht eine komplette Familie von Bauordnungen: Bau (IBC), Brandschutz, Haustechnik, Sanitär und Energie. In den USA und weiteren Ländern als Gesetz übernommen.' },
      aashto: { d: 'Normen für Straßen und Brücken. AASHTO LRFD für Brückenbau und das „Green Book“ für Straßengeometrie gelten in vielen Ländern; die AASHTO-Bodenklassifikation ist Standard in Straßenbaulaboren.' },
      api: { d: 'Die Normen der Öl- und Gasindustrie: Leitungsrohre, Lagertanks, Bohrlochköpfe, Pumpen und Inspektion. Grundlage der Arbeit in den Ölfeldern Kurdistans und des Irak.' },
      aws: { d: 'Schreibt die Schweißnormen: AWS D1.1 für Stahlbau und D1.5 für Brücken. Der CWI (Certified Welding Inspector) ist eines der bekanntesten Zertifikate der Industrie.' },
      awwa: { d: 'Normen für Trinkwassernetze: Rohre, Behälter, Aufbereitung und Betrieb. Wasserbau- und Bauingenieure stützen sich darauf bei der Planung der Wasserversorgung.' },
      cen: { d: 'Die Eurocodes (EN 1990 bis EN 1999) sind Europas gemeinsames System der Tragwerksplanung: Beton, Stahl, Holz, Geotechnik und Erdbeben. EN 206 und EN 197 regeln Beton und Zement.' },
      bsi: { d: 'Die erste nationale Normungsorganisation der Welt (1901). BS 8110 ist zwar zurückgezogen, begegnet einem im Nahen Osten aber noch; BS 7671 ist die britische Installationsvorschrift.' },
      din: { n: 'Deutsches Institut für Normung', d: 'Deutschlands Normen für Industrie, Bau und Elektrotechnik. Das A4-Format stammt aus DIN 476 (1922) und ist heute ISO 216 — ein Beleg für die weltweite Wirkung von DIN.' },
      sae: { d: 'Normen für Fahrzeuge und Luftfahrt. SAE J3016 definiert die Stufen des automatisierten Fahrens (0 bis 5), AS9100 das Qualitätssystem der Luft- und Raumfahrt.' },
      itu: { d: 'Die älteste internationale Organisation (1865), heute eine Agentur der Vereinten Nationen. Sie verteilt Funkfrequenzen und setzt Normen für Glasfaser, Video (H.264) und 5G.' },
      ipc: { d: 'Normen für Entwurf und Fertigung von Leiterplatten und das Löten von Bauteilen. IPC-A-610 ist der weltweite Maßstab dafür, wann eine Baugruppe akzeptabel ist.' },
      ansi: { d: 'Koordiniert das US-Normensystem und vertritt die USA in der ISO. Seine Normen für Schutzhelme (Z89.1), Schutzbrillen (Z87.1) und Warnkleidung (107) sind in der Arbeitssicherheit verbreitet.' },
      osha: { d: 'Eine US-Behörde, die Arbeitsschutzrecht setzt. Ihre Regeln für das Bauwesen (1926) und die Industrie (1910) und die OSHA-30-Schulung gelten weltweit als Sicherheitsmaßstab.' },
      fidic: { d: 'Gibt die Musterverträge für Ingenieurprojekte heraus. Die farbigen FIDIC-Bücher (Rot, Gelb, Silber …) verteilen Pflichten und Risiken zwischen Bauherr und Auftragnehmer.' },
      ogc: { d: 'Setzt offene Normen für Karten und Geodaten. KML (Google-Earth-Dateien), WMS und GeoPackage stammen vom OGC — die gemeinsame Sprache von GIS und Vermessung.' },
      iqs: { d: 'Die irakische Zentralorganisation für Normung und Qualitätskontrolle wurde 1979 durch Gesetz Nr. 54 gegründet. IQS No. 5 für Portlandzement und IQS No. 45 für Gesteinskörnungen sind in Forschung und Laboren im Irak und in Kurdistan weit verbreitet.' }
    }
  };
})(window.I18N.de = window.I18N.de || {});
