/* Deutsch — die besten Universitäten für Ingenieurwesen */
window.I18N = window.I18N || {};
(function (L) {
  L.universities = {
    note: 'Das ist keine nummerierte Rangliste: Die Tabellen von QS, THE und ShanghaiRanking ändern sich jedes Jahr. Diese 20 Universitäten bleiben an der Spitze der Ingenieurlisten — und zu jeder nennen wir die Fächer, in denen sie am stärksten ist.',
    all: 'Alle', best: 'Am stärksten in:', alumni: 'Bekannte Namen:', site: 'Offizielle Website', wiki: 'Wikipedia',
    type: { 'public': 'Staatlich', 'private': 'Privat' },
    cc: { USA: 'USA', UK: 'Vereinigtes Königreich', Switzerland: 'Schweiz', Netherlands: 'Niederlande', Germany: 'Deutschland', Italy: 'Italien', China: 'China', Singapore: 'Singapur', Japan: 'Japan', EU: 'Europäische Union' },
    schTitle: 'Wie kommt man dorthin? Stipendien',
    schLead: 'Die meisten Studierenden aus Kurdistan kommen mit einem Stipendium an diese Universitäten. Die bekanntesten Programme:',
    schTip: 'Tipp: gute Noten, IELTS oder TOEFL (bzw. Deutsch für Deutschland), Empfehlungsschreiben deiner Lehrenden und ein gutes Forschungsprojekt im Bachelor helfen sehr. Früh anfangen — die meisten Stipendien enden etwa ein Jahr vor Studienbeginn.',
    u: {
      mit: { d: 'Gilt als Hauptstadt der Ingenieurwelt und führt oft die Rankings für Technik an. Berühmte Labore wie das Media Lab und CSAIL und das Motto „Mens et Manus“ (Geist und Hand) lehren durch Bauen.' },
      stanford: { d: 'Das Herz des Silicon Valley: Google, HP, Yahoo und NVIDIA entstanden aus Studierenden und Absolventen. Weltspitze in Informatik, Elektrotechnik und Energie (Energierohstoff- und Erdöltechnik).' },
      berkeley: { d: 'Die beste staatliche Universität der USA. Berkeleys Bauingenieurwesen ist oft führend in Erdbeben- und Tragwerksplanung, und das EECS-Institut schuf Meilensteine wie BSD-Unix und RISC-Prozessoren.' },
      caltech: { d: 'Klein (rund 1.000 Bachelorstudierende), aber außergewöhnlich stark. Caltech betreibt das Jet Propulsion Laboratory der NASA, das die Mars-Rover baute — Spitze in Luft- und Raumfahrt und technischer Physik.' },
      harvard: { n: 'Harvard University — Graduate School of Design & SEAS', d: 'Die älteste Universität der USA (1636). Die Graduate School of Design (GSD) gehört zu den besten Orten der Welt für Architektur, Stadtplanung und Landschaftsarchitektur; Walter Gropius lehrte hier nach dem Bauhaus.' },
      gatech: { d: 'Ihr Wirtschaftsingenieur- und Systemtechnik-Programm ist seit Jahrzehnten die Nummer eins der USA. Auch in Bau-, Luftfahrt- und Elektrotechnik gehört sie zu den US-Top-Ten.' },
      cmu: { d: 'Einer der besten Orte der Welt für Informatik, Softwaretechnik und Robotik. Das Robotics Institute (1979) gehört zu den ersten und größten weltweit, und hier sitzt das Software Engineering Institute (SEI).' },
      purdue: { d: 'Die „Wiege der Astronauten“: Mehr als 25 Astronauten studierten hier, darunter Neil Armstrong, der erste Mensch auf dem Mond, und Eugene Cernan, der letzte. Spitze in Luft- und Raumfahrt und Maschinenbau.' },
      uiuc: { d: 'Eine der drei besten Bauingenieur-Fakultäten der USA. Fazlur Rahman Khan — Planer des Sears und des John Hancock Towers — machte hier Master und Promotion, und der erste grafische Webbrowser (Mosaic) entstand hier.' },
      cambridge: { d: 'Über 800 Jahre alt. Ingenieure lernen in Cambridge alle Fachrichtungen gemeinsam, bevor sie sich spezialisieren; Frank Whittle, Erfinder des Strahltriebwerks, und Charles Babbage, Vater des Computers, studierten hier.' },
      imperial: { d: 'Ausschließlich Naturwissenschaften, Technik, Medizin und Wirtschaft. Der Master in Erdöltechnik gehört zu den bekanntesten der Welt, und in Chemie-, Bau- und Medizintechnik führt Imperial in Europa.' },
      eth: { n: 'Eidgenössische Technische Hochschule Zürich', d: 'Die beste technische Universität Kontinentaleuropas, verbunden mit 22 Nobelpreisen. Albert Einstein studierte hier, ebenso Othmar Ammann, Planer der George-Washington- und der Verrazzano-Brücke. Bauingenieurwesen, Architektur und Geomatik sind Weltklasse.' },
      epfl: { n: 'Eidgenössische Technische Hochschule Lausanne', d: 'Die Schwester der ETH in der französischsprachigen Schweiz, mit modernem Campus am Genfersee. Sehr stark in Bau-, Kommunikations- und Computertechnik sowie Bioengineering; das Rolex Learning Center ist ein Architektur-Wahrzeichen.' },
      delft: { n: 'Technische Universiteit Delft', d: 'Die älteste und größte technische Universität der Niederlande. Weil ein großer Teil des Landes unter dem Meeresspiegel liegt, führt Delft weltweit im Wasser-, Küsten- und Talsperrenbau; Johan van Veen, Vater des Delta-Plans, studierte hier.' },
      tum: { n: 'Technische Universität München', d: 'Deutschlands führende technische Universität. Rudolf Diesel, Erfinder des Dieselmotors, schloss hier ab, und die TUM arbeitet eng mit BMW, Siemens und Airbus zusammen. Bekannt für Maschinenbau, Fahrzeug- sowie Luft- und Raumfahrttechnik.' },
      bauhaus: { d: '1919 gründete Walter Gropius hier das Bauhaus — die berühmteste Schule für Architektur und Gestaltung der Geschichte, die „form follows function“ und die moderne Architektur in die Welt trug. Heute eine angesehene Universität für Architektur, Bauingenieurwesen und Gestaltung.' },
      polimi: { d: 'Italiens beste technische Universität und stets unter den weltweiten Top Ten für Architektur und Design. Renzo Piano, Architekt des Centre Pompidou und des Shard, studierte hier, und Giulio Natta erhielt den Nobelpreis für Chemie.' },
      tsinghua: { d: 'Chinas führende technische Universität und in manchen Rankings weltweit Nummer eins im Ingenieurwesen. Sehr stark in Bau-, Wasserbau-, Elektro- und Computertechnik; viele Ingenieure der chinesischen Megaprojekte studierten hier.' },
      nus: { d: 'In den meisten Rankings die beste Universität Asiens. Singapur selbst ist ein Ingenieurlabor — grüne Gebäude, Wasser und Smart City — und die NUS ist Spitze im Bau-, Chemie- und Computeringenieurwesen.' },
      tokyo: { n: 'Universität Tokio', d: 'Japans beste Universität. Hidetsugu Yagi, Erfinder der Yagi-Antenne auf den Dächern, und Kenzo Tange, Pritzker-Preisträger, studierten hier. Stark in Erdbebeningenieurwesen, Robotik und Elektronik.' }
    }
  };
})(window.I18N.de = window.I18N.de || {});
