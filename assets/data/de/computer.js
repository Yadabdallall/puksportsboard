window.I18N = window.I18N || {}; I18N.de = I18N.de || {}; I18N.de.depts = I18N.de.depts || {};
I18N.de.depts.computer = {
  n: 'Technische Informatik', cname: 'Violett', style: 'Kappenform (für Besuche auf Baustellen und in Rechenzentren)',
  tag: 'Das digitale Herz der Welt: Chips, Prozessoren, Netzwerke, intelligente Geräte und KI.',
  why: 'Technische Informatiker verbringen die meiste Zeit in Büros und Laboren, aber in Rechenzentren, Telekom-Stationen und Fabriken sind Helm und ESD-Schutz nötig. Violett wurde gewählt, um dieses Fach zu kennzeichnen.',
  about: 'Die Technische Informatik ist die Brücke zwischen Elektrotechnik und Informatik. Technische Informatiker entwerfen sowohl „Hardware“ — Chips, Prozessoren, Platinen und intelligente Geräte — als auch hardwarenahe „Software“ wie Betriebssysteme und den Code in Autos und Handys. Internetnetze, Cybersicherheit, das Internet der Dinge (IoT) und KI-Hardware gehören ebenfalls zu diesem Fach.',
  nature: [
    'Eine Mischung aus elektronischen Schaltungen und Programmierung.',
    'Laborarbeit mit Platinen, FPGAs, Sensoren und Messgeräten.',
    'Logisches Denken und Problemlösen; ein winziger Fehler kann ein ganzes System stoppen.',
    'Ein sich schnell wandelndes Feld: Alle paar Jahre kommt neue Technik, das Lernen hört nie auf.'
  ],
  study: [
    ['Mathematik 1', 'Physik', 'Grundlagen der Programmierung', 'Digitaltechnik', 'Diskrete Mathematik', 'Grundlagen der Informatik'],
    ['Datenstrukturen', 'Elektrische Schaltungen', 'Elektronik', 'Objektorientierte Programmierung', 'Signale und Systeme', 'Ingenieurmathematik'],
    ['Rechnerarchitektur', 'Betriebssysteme', 'Rechnernetze', 'Eingebettete Systeme', 'Datenbanken', 'Algorithmen'],
    ['VLSI- und FPGA-Entwurf', 'Künstliche Intelligenz', 'Netzwerksicherheit', 'Internet der Dinge', 'Parallel- und Cloud-Computing', 'Abschlussprojekt']
  ],
  br: [
    ['Rechnerarchitektur', 'Prozessoren, Speicher und den Aufbau von Computern entwerfen.'],
    ['Eingebettete Systeme & IoT', 'Intelligente Geräte, Arduino, Sensoren und Smart Homes.'],
    ['Netzwerke & Cybersicherheit', 'Netzwerkentwurf, Firewalls und Abwehr von Cyberangriffen.'],
    ['KI & Robotik', 'Maschinelles Lernen, Roboter und selbstfahrende Autos.'],
    ['VLSI & Chipentwurf', 'Chips entwerfen, vom Transistor bis zum vollständigen Prozessor.'],
    ['Cloud & verteilte Systeme', 'Rechenzentren, Server und Cloud-Dienste.'],
    ['Computer Vision', 'Bilder, Gesichter und Videos mit KI erkennen.']
  ],
  msc: ['Technische Informatik', 'Netzwerke und Sicherheit', 'Eingebettete Systeme', 'Künstliche Intelligenz', 'VLSI-Entwurf', 'Robotik'],
  phd: ['KI-Hardware und Deep Learning', 'Quantencomputing', 'Cybersicherheit', 'Edge Computing und IoT', 'Prozessorarchitektur', 'Autonome Systeme'],
  jobs: ['Netzwerk- und Systemingenieur', 'Spezialist für Cybersicherheit', 'Ingenieur für eingebettete Systeme und IoT', 'Chip- und FPGA-Entwickler', 'Ingenieur für Rechenzentren und Cloud', 'Ingenieur für KI und Robotik', 'Telekommunikationsingenieur', 'Dozent und Forscher an der Universität'],
  tip: 'Leg ein ESD-Armband an, bevor du Platinen und Chips berührst, und achte in Rechenzentren auf Kabel, Lärm und die Löschanlage.',
  fact: 'Ein gewöhnliches Handy ist heute etwa tausendmal schneller als der Supercomputer Cray-2, der 1985 der schnellste Computer der Welt war und durch Eintauchen in eine Spezialflüssigkeit gekühlt wurde.',
  eng: [
    { n: 'Alan Turing', from: 'Vereinigtes Königreich',
      bio: 'Vater der Informatik und der künstlichen Intelligenz. Im Zweiten Weltkrieg half er, den deutschen Enigma-Code zu knacken.',
      story: 'Er wurde 1912 in London geboren und studierte Mathematik in Cambridge. Mit 24 erfand er die „Turingmaschine“: ein mathematisches Modell dessen, was Computer können und was nicht. In Bletchley Park leitete er ein Team, das Deutschlands Geheimnachrichten las und — so glauben Historiker — den Krieg verkürzte. 1950 schlug er den „Turing-Test“ für künstliche Intelligenz vor. Er starb 1954 und ist heute auf der 50-Pfund-Note abgebildet.',
      p: [
        { n: 'Turingmaschine', at: 'Cambridge, Großbritannien', d: 'Eine gedachte Maschine mit endlosem Band und einem Kopf, der liest und schreibt; die theoretische Grundlage jedes heutigen Computers.' },
        { n: 'Die Bombe', at: 'Bletchley Park, Großbritannien', d: 'Eine elektromechanische Maschine, die die Enigma-Einstellungen fand; damit wurden jeden Tag Tausende Geheimnachrichten gelesen.' },
        { n: 'Automatic Computing Engine (ACE)', at: 'London, Großbritannien', d: 'Einer der ersten vollständigen Entwürfe eines speicherprogrammierten Computers; seine kleine Version (Pilot ACE) lief 1950.' }
      ] },
    { n: 'John von Neumann', from: 'Ungarn / USA',
      bio: 'Ein genialer Mathematiker, der die Architektur des „speicherprogrammierten“ Computers festlegte — den Entwurf, den die meisten Computer noch heute nutzen.',
      story: 'Er wurde 1903 in Budapest geboren und konnte als Kind achtstellige Zahlen im Kopf teilen. 1930 ging er in die USA und kam an das Institute for Advanced Study in Princeton. Neben der Informatik entwickelte er Spieltheorie, Quantenmechanik und Wirtschaftswissenschaften weiter. 1945 schrieb er einen Bericht, in dem Programme und Daten im selben Speicher liegen. Er starb 1957.',
      p: [
        { n: 'Von-Neumann-Architektur', at: 'Princeton, USA', d: 'Prozessor, Speicher, Ein- und Ausgabe; Programme liegen wie Daten im Speicher. Das ist der Grundaufbau deines Laptops und Handys.' },
        { n: 'EDVAC', at: 'Philadelphia, USA', d: 'Einer der ersten speicherprogrammierten Computer, nach seinem Bericht entworfen und mit Binärzahlen arbeitend.' },
        { n: 'IAS-Maschine', at: 'Princeton, USA', d: 'Ein Computer, dessen Baupläne frei geteilt wurden; Dutzende andere Computer weltweit wurden danach gebaut.' }
      ] },
    { n: 'Seymour Cray', from: 'USA',
      bio: 'Der „Vater des Supercomputers“. Zwei Jahrzehnte lang entwarf er die schnellsten Computer der Welt.',
      story: 'Er wurde 1925 in Wisconsin geboren und studierte Elektrotechnik und Mathematik an der University of Minnesota. Er arbeitete bei Control Data und gründete 1972 Cray Research. Er war besessen von Kühlung und kurzen Leitungen, denn die Geschwindigkeit des Stroms in einem Draht hat Grenzen. Man erzählt, dass er einen Tunnel unter seinem Haus grub, wenn er bei einem Problem feststeckte. Er starb 1996 bei einem Autounfall.',
      p: [
        { n: 'CDC 6600', at: 'Minnesota, USA', d: 'Gilt als erster Supercomputer der Welt; etwa dreimal schneller als der bis dahin schnellste Computer.' },
        { n: 'Cray-1', at: 'Wisconsin, USA', d: 'Ein berühmter C-förmiger Computer mit einer Sitzbank rundherum; die Form hielt die Leitungen kurz.' },
        { n: 'Cray-2', at: 'USA', d: 'Alle Platinen lagen zur Kühlung in einer nichtleitenden Flüssigkeit; er war der schnellste Computer der Welt.' }
      ] },
    { n: 'Steve Wozniak', from: 'USA',
      bio: 'Mitgründer von Apple und Entwickler der ersten Apple-Computer — ein Pionier der PC-Revolution.',
      story: 'Er wurde 1950 in Kalifornien geboren; sein Vater war Elektronikingenieur. Schon als Kind entwarf er Schaltungen und wurde dafür bekannt, möglichst wenige Chips zu verwenden. 1976 gründete er mit Steve Jobs Apple in einer Garage. 1985 verließ er Apple und engagierte sich später stark für Bildung von Kindern und Wohltätigkeit.',
      p: [
        { n: 'Apple I', at: 'Kalifornien, USA', d: 'Ein Computer, den Wozniak von Hand baute; nur etwa 200 wurden hergestellt, heute erzielen sie bei Auktionen Hunderttausende Dollar.' },
        { n: 'Apple II', at: 'Kalifornien, USA', d: 'Einer der ersten erfolgreichen Personal Computer mit Farbgrafik; Millionen wurden verkauft.' },
        { n: 'Disk II', at: 'Kalifornien, USA', d: 'Ein Disketten-Controller mit bemerkenswert wenigen Chips; gilt als Meisterwerk des Elektronikentwurfs.' }
      ] },
    { n: 'Federico Faggin', from: 'Italien / USA',
      bio: 'Entwickler des Intel 4004 — des ersten kommerziellen Mikroprozessors der Welt — und der Silicon-Gate-Technik.',
      story: 'Er wurde 1941 in Italien geboren und studierte Physik an der Universität Padua. 1968 entwickelte er bei Fairchild die Silicon-Gate-Technik. Bei Intel leitete er den Entwurf des 4004 und ätzte seine Initialen (F.F.) auf den Chip. Später gründete er Zilog und Synaptics.',
      p: [
        { n: 'Intel 4004', at: 'Santa Clara, USA', d: 'Der erste kommerzielle Mikroprozessor der Welt mit etwa 2.300 Transistoren; jeder heutige Prozessor stammt von ihm ab.' },
        { n: 'Zilog Z80', at: 'Kalifornien, USA', d: 'Ein berühmter 8-Bit-Prozessor, jahrzehntelang in Heimcomputern, Spielkonsolen und Industriemaschinen verbaut.' },
        { n: 'Synaptics-Touchpad', at: 'Kalifornien, USA', d: 'Die berührungsempfindliche Fläche, die heute auf den meisten Laptops die Maus ersetzt.' }
      ] },
    { n: 'Charles Babbage', from: 'England',
      bio: 'Der „Vater des Computers“. Im 19. Jahrhundert entwarf er eine mechanische Rechenmaschine, die wie ein moderner Computer aufgebaut war.',
      story: 'Er wurde 1791 in London geboren und war Mathematikprofessor in Cambridge. Verärgert über fehlerhafte, von Hand berechnete Tabellen, beschloss er, eine Maschine zu bauen, die fehlerfrei rechnet. Danach entwarf er die Analytical Engine mit Prozessor, Speicher und Lochkarten. Ada Lovelace schrieb dafür das erste Programm der Welt. Er starb 1871, ohne dass seine Maschinen vollendet wurden.',
      p: [
        { n: 'Differenzmaschine', at: 'London, Großbritannien', d: 'Eine mechanische Maschine zur Erstellung fehlerfreier mathematischer Tabellen; nur ein kleiner Teil wurde gebaut.' },
        { n: 'Analytical Engine', at: 'London, Großbritannien', d: 'Der erste Entwurf eines Universalrechners: ein „Rechenwerk“ (Prozessor), ein „Speicher“ und Programme auf Lochkarten.' },
        { n: 'Differenzmaschine Nr. 2', at: 'Science Museum, London', d: '1991 nach seinen Zeichnungen gebaut, funktionierte sie einwandfrei — Babbage hatte recht. Sie hat etwa 8.000 Teile.' }
      ] },
    { n: 'J. Presper Eckert', from: 'USA',
      bio: 'Miterfinder des ENIAC — des ersten elektronischen Universalrechners — und des UNIVAC, des ersten kommerziellen Computers Amerikas.',
      story: 'Er wurde 1919 in Philadelphia geboren und studierte Elektrotechnik an der University of Pennsylvania. Mit 24 begann er mit John Mauchly das ENIAC-Projekt für die US-Armee. Danach gründeten sie eine der ersten Computerfirmen. Er hielt mehr als 80 Patente und starb 1995.',
      p: [
        { n: 'ENIAC', at: 'Philadelphia, USA', d: 'Ein 30 Tonnen schwerer Computer mit etwa 18.000 Elektronenröhren, der einen ganzen Raum füllte; tausendmal schneller als frühere Maschinen.' },
        { n: 'Quecksilber-Verzögerungsspeicher', at: 'Philadelphia, USA', d: 'Eine der ersten Arten von Computerspeicher; Informationen wurden als Schallwellen in einer Quecksilberröhre gespeichert.' },
        { n: 'UNIVAC I', at: 'Philadelphia, USA', d: 'Der erste kommerzielle Computer Amerikas; 1952 sagte er Eisenhowers Wahlsieg richtig voraus.' }
      ] },
    { n: 'Robert Noyce', from: 'USA',
      bio: 'Der „Bürgermeister des Silicon Valley“. Miterfinder des Siliziumchips und Mitgründer von Fairchild und Intel.',
      story: 'Er wurde 1927 in Iowa geboren und promovierte in Physik am MIT. 1957 verließen er und sieben Kollegen Shockleys Firma und gründeten Fairchild — der Beginn des Silicon Valley. 1959 erfand er mit dem Planarprozess die integrierte Siliziumschaltung, die sich in Massen fertigen ließ. 1968 gründete er mit Gordon Moore Intel. Er starb 1990.',
      p: [
        { n: 'Fairchild Semiconductor', at: 'Kalifornien, USA', d: 'Eine Firma, aus der Dutzende andere hervorgingen (darunter Intel und AMD); man nennt sie die „Mutter des Silicon Valley“.' },
        { n: 'Monolithische integrierte Siliziumschaltung', at: 'Kalifornien, USA', d: 'Ein Chip, dessen Bauteile und Verbindungen alle auf einem Stück Silizium entstanden; so ließen sich Chips millionenfach herstellen.' },
        { n: 'Intel', at: 'Santa Clara, USA', d: 'Einer der größten Chiphersteller der Welt, der den ersten Mikroprozessor und die x86-Prozessoren schuf.' }
      ] },
    { n: 'Jensen Huang', from: 'Taiwan / USA',
      bio: 'Mitgründer und CEO von NVIDIA. Er machte die Grafikkarte (GPU) zum Hauptmotor für Spiele, Wissenschaft und KI.',
      story: 'Er wurde 1963 in Taiwan geboren und zog mit 9 Jahren in die USA. Er studierte Elektrotechnik an der Oregon State University und in Stanford und arbeitete bei AMD und LSI. 1993 beschlossen er und zwei Freunde in einem Denny’s-Restaurant, NVIDIA zu gründen. 2006 entschied er, die GPU zu einem universellen Rechengerät zu machen; Jahre später wurde diese Entscheidung zur Grundlage der KI-Revolution. NVIDIA gehört heute zu den wertvollsten Unternehmen der Welt.',
      p: [
        { n: 'NVIDIA', at: 'Santa Clara, USA', d: 'Ein Unternehmen, auf dessen Chips die meisten großen KI-Modelle von heute trainiert werden.' },
        { n: 'GeForce 256 — die erste „GPU“', at: 'Santa Clara, USA', d: 'Die erste als „GPU“ vermarktete Grafikkarte, die dem Prozessor Beleuchtung und 3D-Transformation abnahm.' },
        { n: 'CUDA', at: 'Santa Clara, USA', d: 'Eine Plattform, mit der sich Tausende GPU-Kerne für Wissenschaft und KI programmieren lassen, nicht nur für Spiele.' }
      ] },
    { n: 'Sophie Wilson', from: 'Vereinigtes Königreich',
      bio: 'Entwicklerin des ARM-Befehlssatzes — des Prozessors, der heute in fast jedem Handy der Welt steckt.',
      story: 'Sie wurde 1957 in England geboren und studierte Mathematik und Informatik in Cambridge. Bei Acorn entwarf sie den BBC Micro, mit dem eine Generation britischer Kinder den Computer kennenlernte. 1983 begann sie mit Steve Furber, einen einfachen, stromsparenden Prozessor namens ARM zu entwerfen. Sie ist Fellow der Royal Society und arbeitet bis heute im Chipentwurf.',
      p: [
        { n: 'BBC Micro', at: 'Cambridge, Großbritannien', d: 'Ein Lerncomputer, der sich in britischen Schulen verbreitete und eine Generation von Ingenieuren ausbildete.' },
        { n: 'ARM-Befehlssatz', at: 'Cambridge, Großbritannien', d: 'Ein einfacher, stromsparender Prozessorentwurf in Hunderten Milliarden Chips: Handys, Tablets, Autos und Mac-Computer.' },
        { n: 'Acorn Archimedes', at: 'Cambridge, Großbritannien', d: 'Der erste Personal Computer mit ARM-Prozessor; zu seiner Zeit einer der schnellsten Heimcomputer.' }
      ] }
  ]
};
