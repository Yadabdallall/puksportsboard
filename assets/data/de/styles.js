/* Deutsch — Architekturstile */
window.I18N = window.I18N || {};
(function (L) {
  L.styles = {
    feat: 'Merkmale', idea: 'Idee & Haltung', mat: 'Materialien', spot: 'So erkennst du ihn:', build: 'Berühmte Bauten', arch: 'Architekten', palette: 'Farben dieses Stils',
    era: {
      kurdish: '≈ 6.000 Jahre – heute', egypt: '3100 – 30 v. Chr.', greek: '800 – 146 v. Chr.', roman: '509 v. Chr. – 476 n. Chr.', byzantine: '330 – 1453', islamic: '7. Jh. – heute',
      gothic: '1140 – 1500', renaissance: '1400 – 1600', baroque: '1600 – 1750', neoclassical: '1750 – 1850', nouveau: '1890 – 1914', deco: '1920 – 1940',
      bauhaus: '1919 – 1933', modern: '1920 – 1970', brutal: '1950 – 1980', postmodern: '1965 – 1995', hightech: '1970er – heute', decon: '1980er – heute',
      minimal: '1980er – heute', parametric: '2000er – heute', green: '1990er – heute'
    },
    s: {
      kurdish: {
        n: 'Kurdische Architektur & Erbe',
        d: 'Kurdistan gehört zu den ältesten Siedlungsräumen der Menschheit. Die Zitadelle von Erbil blickt auf rund 6.000 Jahre Besiedlung zurück und zählt zu den ältesten bewohnten Orten der Welt; seit 2014 ist sie UNESCO-Welterbe, 2021 folgten die Terrassendörfer von Hawraman. Kurdische Architektur ist eine kluge Antwort auf Berge, heiße Sommer, kalte Winter und lokale Baustoffe.',
        idea: 'Mit der Natur bauen, nicht gegen sie: In Hawraman ist das Dach eines Hauses der Hof des darüberliegenden, sodass das Dorf wie eine Treppe den Hang hinaufsteigt und kein Ackerland verschwendet.',
        feat: ['Terrassenhäuser am Hang — jedes Dach ist der Hof des Hauses darüber', 'Dicke Mauern aus Stein oder Lehmziegeln, im Sommer kühl und im Winter warm', 'Flachdächer aus Pappelbalken, Schilf und gestampftem Lehm, mit einer Steinwalze (Bagirdan) verdichtet', 'Hofhäuser in Erbil und Sulaimani mit Iwan sowie Sommer- und Winterräumen', 'Kleine, tiefe Fenster gegen Kälte, Wind und starke Sonne', 'Zitadelle und überdachter Basar (Qaysari) im Herzen der Stadt'],
        mat: 'Lokaler Stein (trocken oder mit Lehm), Lehm- und gebrannte Ziegel, Pappel- und Walnussholz, Schilf, Lehm und Gips.',
        spot: 'Wenn ein Dorf wie eine Treppe den Berg hinaufsteigt und die Dächer die Wege der Menschen sind — das ist Hawraman.'
      },
      egypt: {
        n: 'Altägyptische Architektur',
        d: 'Sie dauerte rund 3.000 Jahre und schuf Pyramiden, Tempel und große Grabanlagen. Die Pharaonen bauten für die Ewigkeit und wählten deshalb Stein statt Lehmziegel. Imhotep, Planer der Stufenpyramide des Djoser, ist der erste namentlich bekannte Architekt.',
        idea: 'Architektur als Weg ins Jenseits und Zeichen göttlicher Macht: einfache, gewaltige, ewige Formen; Ordnung, Symmetrie und Ausrichtung nach den Sternen sind zentral.',
        feat: ['Gewaltige Größe und einfache Geometrie (Pyramiden, Pylone)', 'Säulensäle (Hypostyl) mit massiven Säulen in Form von Papyrus- und Lotusstängeln', 'Geböschte Mauern, unten dicker', 'Hieroglyphen und farbige Malereien an Wänden und Säulen', 'Axiale Abfolge: Sphingenallee, Tor, Hof und dunkles Allerheiligstes', 'Ausrichtung nach Sonne und Sternen'],
        mat: 'Sandstein, Kalkstein und Granit; Lehmziegel für Wohnhäuser; Kupfer- und Steinwerkzeuge.',
        spot: 'Sehr dicke, dicht stehende Säulen, Wände voller Hieroglyphen und riesige geböschte Tore.'
      },
      greek: {
        n: 'Klassische griechische Architektur',
        d: 'Die Griechen machten Ordnung, Proportion und mathematische Schönheit zur Grundlage der Architektur. Sie schufen die drei Säulenordnungen — dorisch, ionisch und korinthisch —, die wir bis heute an Banken, Gerichten und Universitäten sehen. Der Parthenon ist ihr Höhepunkt.',
        idea: 'Schönheit liegt in Proportion und Gleichgewicht: Jedes Teil steht in festem Maß zu den anderen; der Mensch ist das Maß aller Dinge.',
        feat: ['Säulenordnungen: dorisch (schlicht), ionisch (Voluten), korinthisch (Akanthusblätter)', 'Dreieckiger Giebel mit Skulpturen an der Front', 'Rechteckiger Tempel, rundum von Säulen umgeben', 'Vollkommene Symmetrie und mathematische Proportion', 'Optische Korrekturen: leichte Schwellung der Säulen (Entasis) und gewölbte Basis', 'Skulpturenfries über den Säulen'],
        mat: 'Weißer Marmor (etwa pentelischer Marmor), Kalkstein und Tuff; Eisenklammern zur Verbindung.',
        spot: 'Eine Reihe weißer Säulen, gekrönt von einem großen Dreieck — wie die Front des Parthenon.'
      },
      roman: {
        n: 'Römische Architektur',
        d: 'Die Römer übernahmen griechische Formen und machten sie mit Ingenieurskunst zu riesigen Bauten: Bogen, Kuppel und römischer Beton. Sie bauten Straßen, Brücken, Aquädukte, Thermen und Arenen im ganzen Reich; Vitruv schrieb die „Zehn Bücher über Architektur“.',
        idea: 'Architektur im Dienst von Stadt und Staat: Nützlichkeit, Festigkeit und Schönheit (utilitas, firmitas, venustas) — Vitruvs drei Prinzipien, bis heute gelehrt.',
        feat: ['Rundbögen und Arkaden', 'Kuppeln und Gewölbe', 'Römischer Beton mit vulkanischer Puzzolanerde', 'Große öffentliche Bauten: Arenen, Thermen, Märkte und Basiliken', 'Griechische Säulen als Schmuck an Bogenwänden', 'Aquädukte und mehrstöckige Brücken'],
        mat: 'Römischer Beton (Kalk + Puzzolan + Bruchstein), gebrannte Ziegel, Travertin und Marmor.',
        spot: 'Reihen sich wiederholender Rundbögen — wie Kolosseum oder Pont du Gard.'
      },
      byzantine: {
        n: 'Byzantinische Architektur',
        d: 'Sie entstand in Konstantinopel (Istanbul) und verband römische Technik mit östlicher Pracht. Die Hagia Sophia (537) war über 900 Jahre die größte Kathedrale der Welt; ihre Kuppel scheint zu schweben.',
        idea: 'Der Innenraum als Abbild des Himmels: Licht, Gold und Kuppel erzeugen das Gefühl des Heiligen; außen schlicht, innen überreich.',
        feat: ['Riesige Kuppel über quadratischem Grundriss dank Pendentifs', 'Grundriss des griechischen Kreuzes (vier gleiche Arme)', 'Goldene und farbige Mosaike im Inneren', 'Fensterkranz am Kuppelfuß, der sie mit Licht krönt', 'Außenwände aus Ziegel und Stein in farbigen Lagen', 'Halbkuppeln, die die Lasten zu den Wänden leiten'],
        mat: 'Gebrannter Ziegel mit dicken Mörtelfugen, farbiger Marmor, vergoldetes Glasmosaik.',
        spot: 'Eine große Kuppel mit Halbkuppeln und ein Inneres, das in Goldmosaik leuchtet.'
      },
      islamic: {
        n: 'Islamische Architektur',
        d: 'Seit dem 7. Jahrhundert verbreitete sie sich von al-Andalus bis Indien und verband römische, byzantinische und sasanidische Traditionen. Das spiralförmige Malwiya-Minarett von Samarra im Irak, der Felsendom, die Alhambra und das Taj Mahal sind berühmte Beispiele. Allein Mimar Sinan baute über 300 Bauwerke.',
        idea: 'Schönheit durch Geometrie, Kalligrafie und Licht statt Menschenbilder: endlose geometrische Muster, Höfe, Wasser und Schatten schaffen Ruhe und Einheit.',
        feat: ['Kuppeln und Minarette', 'Spitz-, Hufeisen- und Vielpassbögen', 'Muqarnas (Stalaktitengewölbe) wie Bienenwaben', 'Geometrische Muster, Arabesken und arabische Kalligrafie', 'Blaue und türkise Fliesen, Höfe mit Becken und Brunnen', 'Der Iwan — eine zum Hof offene Gewölbehalle'],
        mat: 'Ziegel, glasierte Fliesen, geschnitzter Stuck, Stein und Marmor, geschnitztes Holz.',
        spot: 'Kuppeln, Minarette, blaue Fliesen und endlos wiederholte geometrische Muster.'
      },
      gothic: {
        n: 'Gotik',
        d: 'Sie begann im 12. Jahrhundert in Frankreich mit der Abteikirche Saint-Denis. Gotische Baumeister verwandelten dicke Mauern in Glasfenster und ließen ihre Bauten in den Himmel wachsen. Am Kölner Dom wurde 632 Jahre gebaut.',
        idea: 'Licht als Zeichen Gottes: Je höher und heller der Bau, desto näher dem Himmel; das Tragwerk wird offen zur Schönheit.',
        feat: ['Spitzbögen, die Lasten steiler ableiten', 'Kreuzrippengewölbe', 'Strebebögen außen', 'Riesige Glasfenster und Fensterrosen', 'Hohe Türme und spitze Turmhelme', 'Skulpturen und Wasserspeier an der Fassade'],
        mat: 'Kalk- und Sandstein, farbiges Glas, Bleidächer, Eisenanker.',
        spot: 'Ein sehr hoher Bau mit Spitzbögen, äußeren Strebebögen und runder Fensterrose.'
      },
      renaissance: {
        n: 'Renaissance',
        d: 'Sie entstand im Florenz des 15. Jahrhunderts, als Architekten zu den Proportionen und Prinzipien Griechenlands und Roms zurückkehrten. Brunelleschi baute die Domkuppel von Florenz ohne Lehrgerüst — ein Meisterwerk der Technik; später verbreitete Palladio den Stil weltweit.',
        idea: 'Der Mensch im Mittelpunkt der Welt, die Mathematik als Sprache der Schönheit: Symmetrie, regelmäßige Proportion und Perspektive.',
        feat: ['Vollkommene Symmetrie und mathematische Proportion', 'Hohe Kuppel auf einem Tambour', 'Klassische Säulen, Pilaster und Rundbögen', 'Regelmäßige Fensterreihen mit Dreiecks- oder Bogengiebeln', 'Horizontal geschichtete Fassaden (Rustika im Sockel)', 'Zentralbauten — Kreis oder Quadrat'],
        mat: 'Stein und Marmor, Ziegel, Putz und Stuck, kräftiges Holz für Dachstühle.',
        spot: 'Eine ruhige, symmetrische Fassade mit klassischen Säulen und einer majestätischen Kuppel.'
      },
      baroque: {
        n: 'Barock',
        d: 'Er begann im Rom des 17. Jahrhunderts und diente Kirche und Königen zur Darstellung von Macht und Glanz. Bernini und Borromini schufen geschwungene, bewegte Fassaden; Schloss Versailles ist der Höhepunkt in Frankreich.',
        idea: 'Architektur als Theater: Gefühl, Bewegung und Staunen — Licht und Schatten, Schwünge und reicher Schmuck überwältigen den Besucher.',
        feat: ['Geschwungene, wogende Fassaden (konkav und konvex)', 'Üppiger Schmuck: Gold, Skulpturen und Deckengemälde', 'Dramatisches Spiel von Licht und Schatten', 'Kuppeln und ovale Grundrisse', 'Große Plätze, Gärten und Brunnen', 'Prunktreppen und Spiegelsäle'],
        mat: 'Stein, farbiger Marmor, Stuck, Vergoldung, Spiegel und Fresken.',
        spot: 'Eine Fassade voller Bewegung und Schwünge — und ein Inneres, in dem alles Gold und Malerei ist.'
      },
      neoclassical: {
        n: 'Klassizismus',
        d: 'Er entstand Mitte des 18. Jahrhunderts als Reaktion auf den barocken Überfluss und kehrte zur Schlichtheit Griechenlands und Roms zurück. Brandenburger Tor, Panthéon in Paris und das US-Kapitol sind Beispiele; Gerichte und Parlamente bauen bis heute so.',
        idea: 'Vernunft, Ordnung und Bürgertugend — die Ideen der Aufklärung; ein Bau soll klar, ernst und würdevoll sein.',
        feat: ['Schlichte, regelmäßige Fassaden mit großem Säulenportikus', 'Dreiecksgiebel', 'Kuppel mit Säulenkranz um den Tambour', 'Wenig Schmuck, klare Linien', 'Vollkommene Symmetrie', 'Breite Freitreppe vor dem Eingang'],
        mat: 'Kalk- und Sandstein, Marmor, weiß verputzter Ziegel, Schmiedeeisen.',
        spot: 'Ein Bau wie ein griechischer Tempel, nur größer — oft Gericht, Museum oder Parlament.'
      },
      nouveau: {
        n: 'Jugendstil (Art nouveau)',
        d: 'Er entstand Ende des 19. Jahrhunderts in Belgien und Frankreich und ist bekannt für Naturmotive, fließende Linien, Eisen und Glas. In Barcelona machte Gaudí Gebäude zu lebenden Skulpturen; in Brüssel verwandelte Horta Eisen in Blumen und Blätter.',
        idea: 'Die Natur ist die beste Lehrerin: In der Natur gibt es keine geraden Linien; Kunst, Technik und Handwerk sollen eins sein.',
        feat: ['Peitschenhieb-Linien', 'Motive von Blüten, Blättern, Tieren und Knochen', 'Ornamentales Eisen und Glasfenster', 'Farbige Keramikfliesen (Gaudís Trencadís)', 'Unregelmäßige, organische Fenster und Türen', 'Gesamtkunstwerk: auch Möbel, Lampen und Türgriffe'],
        mat: 'Schmiede- und Gusseisen, Glas, Keramik, Stein und geschnitztes Holz.',
        spot: 'Eine wellige Fassade wie Knochen oder Blätter und Eisen wie Blumen.'
      },
      deco: {
        n: 'Art déco',
        d: 'Benannt nach der Pariser Ausstellung von 1925, war er der Stil des Jazz-Zeitalters, der Autos und Flugzeuge. Das Chrysler Building mit seiner glänzenden Stahlkrone und das Empire State Building sind die besten Beispiele; er prägte auch Kinos, Hotels und Autos.',
        idea: 'Glanz und Tempo der neuen Zeit: kräftige Geometrie, glänzende Materialien und ein Gefühl von Fortschritt und Luxus.',
        feat: ['Gestufte Formen (Zikkurat) und starke Vertikalen', 'Sonnenstrahl-, Zickzack- und Chevron-Motive', 'Glänzende Materialien: Chrom, Edelstahl, farbiges Glas', 'Rücksprünge an Hochhäusern', 'Prächtige, reich verzierte Eingänge', 'Kräftige Farben: Schwarz, Gold, Weiß und Dunkelgrün'],
        mat: 'Beton, Edelstahl, Chrom, schwarzer Marmor, Glas und Aluminium.',
        spot: 'Ein Hochhaus mit gestufter, glänzender Krone und Sonnenstrahl-Ornament.'
      },
      bauhaus: {
        n: 'Bauhaus',
        d: 'Eine Schule, 1919 von Walter Gropius in Weimar gegründet, die Kunst, Handwerk, Industrie und Architektur vereinte. 1925 zog sie nach Dessau und wurde 1933 unter dem Druck der Nationalsozialisten geschlossen — doch ihre Lehrer trugen die Idee nach Amerika und in die Welt.',
        idea: '„Form follows function“: kein nutzloser Schmuck; gutes Design soll für alle da sein und industriell herstellbar.',
        feat: ['Einfache Geometrie: Rechteck, Kreis und Dreieck', 'Industrielle Glasfassaden (Vorhangfassade)', 'Flachdächer', 'Freie, asymmetrische Grundrisse nach der Funktion', 'Grundfarben — Rot, Gelb und Blau — auf Weiß und Grau', 'Kein Ornament — Schönheit liegt in Material und Proportion'],
        mat: 'Stahl, Glas und Beton; Industriestoffe und Stahlrohr für Möbel.',
        spot: 'Ein weißer, schlichter Bau mit langen Glasfenstern und Flachdach, ganz ohne Ornament.'
      },
      modern: {
        n: 'Moderne & Internationaler Stil',
        d: 'Zwischen 1920 und 1970 wurde sie zur gemeinsamen Sprache der Welt. Le Corbusier formulierte die „Fünf Punkte einer neuen Architektur“, Mies van der Rohe sagte „weniger ist mehr“, und Frank Lloyd Wright zeigte mit Fallingwater die organische Moderne.',
        idea: 'Das Haus als „Wohnmaschine“: Licht, Luft, offene Grundrisse und neue Technik für alle — verbunden mit der Natur.',
        feat: ['Le Corbusiers fünf Punkte: Pilotis (Stützen, die den Bau anheben)', 'Freier Grundriss und freie Fassade', 'Lange, horizontale Bandfenster', 'Dachgärten', 'Viel Glas und Stahl, klare Linien', 'Fließender Übergang von innen und außen'],
        mat: 'Stahlbeton, Stahl, große Glasscheiben; Stein und Holz bei Wright und Aalto.',
        spot: 'Ein weißer Bau auf schlanken Stützen mit Bandfenstern und Flachdach — wie die Villa Savoye.'
      },
      brutal: {
        n: 'Brutalismus',
        d: 'Der Name kommt vom französischen „béton brut“, Sichtbeton. Nach dem Zweiten Weltkrieg prägte er Sozialwohnungen, Universitäten und Behördenbauten; berühmt sind das Barbican in London und Habitat 67 in Montreal.',
        idea: 'Materialehrlichkeit: Beton zeigt sich, wie er ist, Tragwerk und Funktion werden nicht versteckt; Architektur für die Gesellschaft.',
        feat: ['Sichtbeton mit Abdruck der Brettschalung', 'Schwere, massive, skulpturale Formen', 'Kleine, tiefe, sich wiederholende Fenster', 'Sichtbares Tragwerk und sichtbare Technik', 'Wiederholte modulare Blöcke', 'Hochliegende Fußwege und öffentliche Höfe'],
        mat: 'Unbehandelter Sichtbeton, Ziegel und Stahl.',
        spot: 'Ein riesiger grauer Betonbau, der noch die Spuren seiner Holzschalung zeigt.'
      },
      postmodern: {
        n: 'Postmoderne',
        d: 'Sie kam Ende der 1960er-Jahre als Reaktion auf die Strenge der Moderne. Robert Venturi spottete „less is a bore“ und brachte Farbe, Humor und historische Zeichen zurück in die Architektur.',
        idea: 'Architektur soll zu ganz normalen Menschen sprechen: vertraute Zeichen, Farbe, Witz und Zitate aus der Geschichte — frei und ohne strenge Regeln.',
        feat: ['Klassische Säulen und Giebel in Riesenmaßstab oder mit Ironie', 'Kräftige und Pastellfarben', 'Fassaden wie Plakate oder Zeichen', 'Mischung verschiedener Stile (Eklektizismus)', 'Überraschende, unregelmäßige Formen', 'Bedeutung und Erzählung wichtiger als reine Funktion'],
        mat: 'Innen Beton und Stahl, außen Stein, Fliesen, Putz und kräftige Farben.',
        spot: 'Ein moderner Bau mit riesigen, bunten klassischen Säulen und Giebeln.'
      },
      hightech: {
        n: 'High-Tech-Architektur',
        d: 'Sie entstand in den 1970er-Jahren in Großbritannien und Frankreich und machte Technik zur eigentlichen Schönheit eines Gebäudes. Das Centre Pompidou (1977) zeigt Rohre, Treppen und Tragwerk an der Fassade; Norman Foster und Richard Rogers sind ihre Pioniere.',
        idea: 'Das Gebäude als Maschine: Tragwerk und Haustechnik (Wasser, Luft, Strom) werden stolz gezeigt, der Innenraum bleibt frei veränderbar.',
        feat: ['Außen liegendes Stahltragwerk', 'Farbcodierte Rohre und Kanäle an der Fassade (eine Farbe je Medium)', 'Viel Glas und Glasfassaden', 'Industrielle Fertigteile', 'Offene, flexible Innenräume', 'Außen liegende gläserne Treppen und Aufzüge'],
        mat: 'Stahl, Glas, Aluminium, Zugseile und technische Kunststoffe.',
        spot: 'Ein Gebäude, dessen Rohre und Tragwerk außen sichtbar sind wie bei einer Maschine.'
      },
      decon: {
        n: 'Dekonstruktivismus',
        d: 'Er entstand in den 1980er-Jahren und erhielt seinen Namen durch die MoMA-Ausstellung 1988. Frank Gehry, Daniel Libeskind und Zaha Hadid brachen regelmäßige, ausgewogene Formen auf; das Guggenheim-Museum Bilbao (1997) verwandelte eine ganze Stadt.',
        idea: 'Regeln brechen: zersplitterte, gekippte und geschwungene Formen zeigen die Unordnung und Komplexität des modernen Lebens; erst Computer machten sie baubar.',
        feat: ['Zersplitterte, gekippte, fragmentierte Formen', 'Keine Symmetrie, kaum rechte Winkel', 'Geschwungene Metallhüllen', 'Tragwerke, die zu stürzen scheinen', 'Bauteile, die kollidieren und sich durchdringen', 'Entwurf mit Luftfahrt-Software (CATIA)'],
        mat: 'Titan, Edelstahl, Glas, Beton und Stahl.',
        spot: 'Ein Gebäude, das zu zerbrechen, sich zu drehen oder zu tanzen scheint — wie das Tanzende Haus in Prag.'
      },
      minimal: {
        n: 'Minimalismus',
        d: 'Er wuchs seit den 1980er-Jahren, inspiriert von Mies van der Rohes „weniger ist mehr“ und japanischer Zen-Ruhe. Tadao Ando mit Beton und Licht und Peter Zumthor mit Stein und Wasser schaffen stille, ruhige Räume.',
        idea: 'Alles Überflüssige weglassen, bis nur das Wesentliche bleibt: Leere, Licht, Material und Stille gehören zum Entwurf.',
        feat: ['Äußerst einfache Geometrie', 'Wenige Farben: Weiß, Grau und die Farbe des Materials', 'Offener Raum und Tageslicht', 'Kein Ornament — die Präzision liegt in Fugen und Materialien', 'Ein oder zwei Materialien, konsequent wiederholt', 'Bezug zu Natur, Wasser und Himmel'],
        mat: 'Glatter Sichtbeton, Glas, Naturstein, Holz und Stahl.',
        spot: 'Ein stiller Bau mit glatten Wänden, wenigen Linien und sorgfältig gesetztem Licht — wie Andos Kirche des Lichts.'
      },
      parametric: {
        n: 'Parametrismus',
        d: 'Ein Stil des 21. Jahrhunderts, entworfen mit Computern und Gleichungen. Patrik Schumacher gab ihm 2008 den Namen; Zaha Hadids Heydar-Aliyev-Zentrum in Baku ist sein bekanntestes Beispiel.',
        idea: 'Das Gebäude als lebendes System: Die Form entsteht aus Regeln und Parametern (Wind, Sonne, Bewegung der Menschen), und alle Teile fließen weich ineinander.',
        feat: ['Durchgehend gekrümmte Flächen ohne Ecken', 'Algorithmischer Entwurf (Grasshopper, Rhino)', 'Für jede Stelle ein anderes Bauteil (Mass Customization)', 'Boden, Wände und Dach verschmelzen', 'Sich allmählich verändernde Wiederholungsmuster', 'Fertigung mit CNC und 3D-Druck'],
        mat: 'Stahl, Spezialbetone, GFRC und GFRP (glasfaserverstärkter Beton und Kunststoff), gebogenes Glas.',
        spot: 'Ein Gebäude, das wie eine Welle oder weißer Stoff fließt — ohne einen einzigen rechten Winkel.'
      },
      green: {
        n: 'Grüne & nachhaltige Architektur',
        d: 'Die Antwort der Architektur auf den Klimawandel: Gebäude, die wenig Energie verbrauchen, Wasser sammeln und die Natur in die Stadt zurückholen. Der Bosco Verticale in Mailand trägt rund 800 Bäume und Tausende Pflanzen auf seinen Balkonen.',
        idea: 'Ein Gebäude soll Teil der Natur sein, keine Last für sie: weniger Energie, wiederverwendete Materialien sowie Gesundheit und Wohlbefinden des Menschen (biophiles Design).',
        feat: ['Gründächer und lebende Wände', 'Solarpaneele und natürliche Lüftung', 'Verschattung und Ausrichtung zur Sonne', 'Regenwassernutzung', 'Regionale und wiederverwendete Materialien', 'Zertifizierung nach LEED, BREEAM und Passivhaus'],
        mat: 'Brettsperrholz (CLT), CO₂-armer Beton, Zweifachverglasung, Solarpaneele und Pflanzen.',
        spot: 'Ein Gebäude mit Bäumen und Pflanzen auf Balkonen und Dach und Solarpaneelen obenauf.'
      }
    }
  };
})(window.I18N.de = window.I18N.de || {});
