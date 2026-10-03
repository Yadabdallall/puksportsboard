/* Engineerpedia — language-neutral data (ids, colors, years, Wikipedia titles, software registry).
   All translatable text lives in assets/data/<lang>/*.js */
window.CORE = (function () {
  var P = function (id) { return id; };

  var depts = [
  /* ───────────────────────── CIVIL ───────────────────────── */
  { id: 'civil', en: 'Civil Engineering', icon: 'civil', color: '#F2EEE3', scene: 'truss', years: 4, spec: 'Type I · Class E',
    cover: [P(5505125), P(4513940), P(7108779)],
    study: [
      ['Calculus I', 'Physics', 'Engineering Drawing', 'Statics', 'Engineering Chemistry', 'Programming'],
      ['Calculus II', 'Strength of Materials', 'Surveying', 'Construction Materials', 'Fluid Mechanics', 'Engineering Geology'],
      ['Structural Analysis', 'Reinforced Concrete Design', 'Soil Mechanics', 'Hydraulics', 'Highway Engineering', 'Numerical Analysis'],
      ['Steel Design', 'Foundation Engineering', 'Sanitary Engineering', 'Quantity Surveying', 'Project Management', 'Graduation Project']
    ],
    br: ['Structural', 'Geotechnical', 'Transportation', 'Hydraulic & Water', 'Environmental', 'Construction Management', 'Construction Materials', 'Earthquake Engineering'],
    msc: ['M.Sc. Structural Engineering', 'M.Sc. Geotechnical Engineering', 'M.Sc. Transportation', 'M.Sc. Water Resources', 'M.Sc. Construction Management', 'M.Sc. Construction Materials', 'M.Sc. Environmental Engineering'],
    phd: ['Advanced & Green Concrete (UHPC)', 'Structural Dynamics & Earthquakes', 'BIM & Digital Twins', 'Smart Cities & Mobility', 'Computational Mechanics (FEM)', 'Structural Health Monitoring'],
    sw: ['autocad', 'revit', 'etabs', 'sap2000', 'safe', 'staad', 'civil3d', 'plaxis', 'primavera', 'tekla'],
    ppe: ['helmet', 'vest', 'boots', 'gloves', 'glasses', 'harness', 'ear', 'mask'],
    eng: [
      { w: 'Fazlur Rahman Khan', en: 'Fazlur Rahman Khan', life: '1929–1982', img: 'assets/img/eng/fazlur-khan.jpg', p: [
        { w: 'Willis Tower', en: 'Willis Tower', y: '1973' },
        { w: 'John Hancock Center', en: 'John Hancock Center', y: '1969' },
        { w: 'Hajj Terminal', en: 'Hajj Terminal', y: '1981' }] },
      { w: 'Gustave Eiffel', en: 'Gustave Eiffel', life: '1832–1923', p: [
        { w: 'Eiffel Tower', en: 'Eiffel Tower', y: '1889' },
        { w: 'Statue of Liberty', en: 'Statue of Liberty (iron frame)', y: '1886' },
        { w: 'Garabit viaduct', en: 'Garabit Viaduct', y: '1884' }] },
      { w: 'Isambard Kingdom Brunel', en: 'Isambard Kingdom Brunel', life: '1806–1859', p: [
        { w: 'Clifton Suspension Bridge', en: 'Clifton Suspension Bridge', y: '1864' },
        { w: 'Great Western Railway', en: 'Great Western Railway', y: '1841' },
        { w: 'SS Great Britain', en: 'SS Great Britain', y: '1843' }] },
      { w: 'Othmar Ammann', en: 'Othmar Ammann', life: '1879–1965', p: [
        { w: 'George Washington Bridge', en: 'George Washington Bridge', y: '1931' },
        { w: 'Verrazzano-Narrows Bridge', en: 'Verrazzano-Narrows Bridge', y: '1964' },
        { w: 'Bayonne Bridge', en: 'Bayonne Bridge', y: '1931' }] },
      { w: 'William F. Baker (engineer)', en: 'William F. Baker', life: '1953–', p: [
        { w: 'Burj Khalifa', en: 'Burj Khalifa', y: '2010' },
        { w: 'Cayan Tower', en: 'Cayan Tower', y: '2013' },
        { w: 'Pearl River Tower', en: 'Pearl River Tower', y: '2011' }] },
      { w: 'John Smeaton', en: 'John Smeaton', life: '1724–1792', p: [
        { w: "Smeaton's Tower", en: "Smeaton's Tower (Eddystone Lighthouse)", y: '1759' },
        { w: 'Forth and Clyde Canal', en: 'Forth and Clyde Canal', y: '1790' },
        { w: 'Coldstream Bridge', en: 'Coldstream Bridge', y: '1766' }] },
      { w: 'Thomas Telford', en: 'Thomas Telford', life: '1757–1834', p: [
        { w: 'Pontcysyllte Aqueduct', en: 'Pontcysyllte Aqueduct', y: '1805' },
        { w: 'Menai Suspension Bridge', en: 'Menai Suspension Bridge', y: '1826' },
        { w: 'Caledonian Canal', en: 'Caledonian Canal', y: '1822' }] },
      { w: 'Pier Luigi Nervi', en: 'Pier Luigi Nervi', life: '1891–1979', p: [
        { w: 'Palazzetto dello Sport', en: 'Palazzetto dello Sport', y: '1957' },
        { w: 'Pirelli Tower', en: 'Pirelli Tower', y: '1958' },
        { w: 'Cathedral of Saint Mary of the Assumption (San Francisco)', en: 'St. Mary’s Cathedral, San Francisco', y: '1971' }] },
      { w: 'Michel Virlogeux', en: 'Michel Virlogeux', life: '1946–', p: [
        { w: 'Pont de Normandie', en: 'Pont de Normandie', y: '1995' },
        { w: 'Millau Viaduct', en: 'Millau Viaduct', y: '2004' },
        { w: 'Pont Gustave-Flaubert', en: 'Pont Gustave-Flaubert', y: '2008' }] },
      { w: 'Jörg Schlaich', en: 'Jörg Schlaich', life: '1934–2021', p: [
        { w: 'Olympiastadion (Munich)', en: 'Munich Olympic Stadium roof', y: '1972' },
        { w: 'Mercedes-Benz Arena (Stuttgart)', en: 'Stuttgart Stadium membrane roof', y: '1993' },
        { w: 'Solar updraft tower', en: 'Manzanares Solar Updraft Tower', y: '1982' }] }
    ] },

  /* ───────────────────────── ARCHITECTURE ───────────────────────── */
  { id: 'arch', en: 'Architectural Engineering', icon: 'arch', color: '#FACC15', scene: 'plan', years: 5, spec: 'Type I · Class G',
    cover: [P(20954930), P(6615235), P(3862135)],
    study: [
      ['Basic Design', 'Freehand Drawing', 'Technical Drawing', 'History of Architecture I', 'Model Making', 'Mathematics'],
      ['Architectural Design I', 'Islamic Architecture', 'Perspective & Shade', 'Building Materials', 'Building Structures', 'CAD'],
      ['Architectural Design II', 'Building Construction', 'Climatic Design', 'Lighting & Acoustics', 'Architectural Theory', 'Building Services'],
      ['Architectural Design III', 'Urban Planning', 'Interior Design', 'Landscape Design', 'Heritage Conservation', 'BIM'],
      ['Graduation Project', 'Urban Design', 'Professional Practice', 'Specifications', 'Sustainable Architecture']
    ],
    br: ['Architectural Design', 'Urban & Regional Planning', 'Interior Design', 'Landscape Architecture', 'Heritage Conservation', 'Building Technology & Sustainability', 'Computational Design'],
    msc: ['M.Arch Architectural Design', 'M.Sc. Urban Design', 'M.Sc. Urban Planning', 'M.Sc. Heritage Conservation', 'M.Sc. Sustainable Architecture', 'M.A. Interior Architecture', 'M.Sc. Building Technology'],
    phd: ['Architectural Theory', 'Urbanism & Society', 'Vernacular & Islamic Architecture', 'Net-Zero Buildings', 'Computational Design & AI', 'Cultural Heritage'],
    sw: ['autocad', 'revit', 'archicad', 'sketchup', 'rhino', '3dsmax', 'lumion', 'vray', 'photoshop', 'indesign'],
    ppe: ['helmet', 'vest', 'boots', 'glasses'],
    eng: [
      { w: 'Zaha Hadid', en: 'Zaha Hadid', life: '1950–2016', p: [
        { w: 'Heydar Aliyev Center', en: 'Heydar Aliyev Center', y: '2012' },
        { w: 'London Aquatics Centre', en: 'London Aquatics Centre', y: '2011' },
        { w: 'Guangzhou Opera House', en: 'Guangzhou Opera House', y: '2010' }] },
      { w: 'Mimar Sinan', en: 'Mimar Sinan', life: '1490–1588', p: [
        { w: 'Süleymaniye Mosque', en: 'Süleymaniye Mosque', y: '1557' },
        { w: 'Selimiye Mosque', en: 'Selimiye Mosque', y: '1575' },
        { w: 'Şehzade Mosque', en: 'Şehzade Mosque', y: '1548' }] },
      { w: 'Frank Lloyd Wright', en: 'Frank Lloyd Wright', life: '1867–1959', p: [
        { w: 'Fallingwater', en: 'Fallingwater', y: '1937' },
        { w: 'Solomon R. Guggenheim Museum', en: 'Guggenheim Museum, New York', y: '1959' },
        { w: 'Frederick C. Robie House', en: 'Robie House', y: '1910' }] },
      { w: 'I. M. Pei', en: 'I. M. Pei', life: '1917–2019', p: [
        { w: 'Louvre Pyramid', en: 'Louvre Pyramid', y: '1989' },
        { w: 'Bank of China Tower (Hong Kong)', en: 'Bank of China Tower', y: '1990' },
        { w: 'Museum of Islamic Art, Doha', en: 'Museum of Islamic Art, Doha', y: '2008' }] },
      { w: 'Norman Foster', en: 'Norman Foster', life: '1935–', p: [
        { w: '30 St Mary Axe', en: '30 St Mary Axe (The Gherkin)', y: '2004' },
        { w: 'Reichstag building', en: 'Reichstag Dome', y: '1999' },
        { w: 'Apple Park', en: 'Apple Park', y: '2017' }] },
      { w: 'Le Corbusier', en: 'Le Corbusier', life: '1887–1965', p: [
        { w: 'Villa Savoye', en: 'Villa Savoye', y: '1931' },
        { w: "Unité d'habitation (Marseille)", en: "Unité d'habitation, Marseille", y: '1952' },
        { w: 'Chandigarh Capitol Complex', en: 'Chandigarh Capitol Complex', y: '1953' }] },
      { w: 'Antoni Gaudí', en: 'Antoni Gaudí', life: '1852–1926', p: [
        { w: 'Sagrada Família', en: 'Sagrada Família', y: '1882' },
        { w: 'Park Güell', en: 'Park Güell', y: '1914' },
        { w: 'Casa Batlló', en: 'Casa Batlló', y: '1906' }] },
      { w: 'Frank Gehry', en: 'Frank Gehry', life: '1929–2025', p: [
        { w: 'Guggenheim Museum Bilbao', en: 'Guggenheim Museum Bilbao', y: '1997' },
        { w: 'Walt Disney Concert Hall', en: 'Walt Disney Concert Hall', y: '2003' },
        { w: 'Dancing House', en: 'Dancing House, Prague', y: '1996' }] },
      { w: 'Renzo Piano', en: 'Renzo Piano', life: '1937–', p: [
        { w: 'Centre Pompidou', en: 'Centre Pompidou', y: '1977' },
        { w: 'The Shard', en: 'The Shard', y: '2012' },
        { w: 'Kansai International Airport', en: 'Kansai Airport Terminal', y: '1994' }] },
      { w: 'Ludwig Mies van der Rohe', en: 'Ludwig Mies van der Rohe', life: '1886–1969', p: [
        { w: 'Barcelona Pavilion', en: 'Barcelona Pavilion', y: '1929' },
        { w: 'Farnsworth House', en: 'Farnsworth House', y: '1951' },
        { w: 'Seagram Building', en: 'Seagram Building', y: '1958' }] }
    ] },

  /* ───────────────────────── MECHANICAL ───────────────────────── */
  { id: 'mech', en: 'Mechanical Engineering', icon: 'mech', color: '#FB923C', scene: 'gears', years: 4, spec: 'Type II · Class G',
    cover: [P(3785930), P(159298), P(239419)],
    study: [
      ['Calculus I', 'Physics', 'Engineering Drawing', 'Workshop Practice', 'Statics', 'Programming'],
      ['Dynamics', 'Strength of Materials', 'Thermodynamics I', 'Fluid Mechanics', 'Metallurgy', 'Machine Drawing'],
      ['Thermodynamics II', 'Heat Transfer', 'Theory of Machines', 'Machine Design', 'Manufacturing Processes', 'Electrical Technology'],
      ['Control Systems', 'Mechanical Vibrations', 'Refrigeration & HVAC', 'Internal Combustion Engines', 'Turbomachinery', 'Graduation Project']
    ],
    br: ['Thermal & Power', 'Applied Mechanics & Design', 'Production & Manufacturing', 'Refrigeration & HVAC', 'Automotive', 'Mechatronics & Robotics', 'Materials', 'Renewable Energy'],
    msc: ['M.Sc. Thermal Power', 'M.Sc. Applied Mechanics', 'M.Sc. Production Engineering', 'M.Sc. HVAC', 'M.Sc. Mechatronics', 'M.Sc. Renewable Energy', 'M.Sc. Materials Engineering'],
    phd: ['Computational Fluid Dynamics', 'Fracture & Fatigue', 'Additive Manufacturing', 'Robotics & Control', 'Energy Storage & Hydrogen', 'Smart & Nano Materials'],
    sw: ['solidworks', 'autocad', 'catia', 'ansys', 'inventor', 'fusion360', 'matlab', 'nx', 'comsol', 'hap'],
    ppe: ['helmet', 'boots', 'gloves', 'glasses', 'ear', 'faceshield', 'welding', 'vest'],
    eng: [
      { w: 'James Watt', en: 'James Watt', life: '1736–1819', p: [
        { w: 'Watt steam engine', en: 'Watt Steam Engine', y: '1776' },
        { w: 'Centrifugal governor', en: 'Centrifugal Governor', y: '1788' },
        { w: 'Soho Foundry', en: 'Soho Foundry', y: '1796' }] },
      { w: 'Carl Benz', en: 'Karl Benz', life: '1844–1929', p: [
        { w: 'Benz Patent-Motorwagen', en: 'Benz Patent-Motorwagen', y: '1886' },
        { w: 'Benz Velo', en: 'Benz Velo', y: '1894' },
        { w: 'Flat engine', en: 'Boxer (Flat) Engine', y: '1896' }] },
      { w: 'Henry Ford', en: 'Henry Ford', life: '1863–1947', p: [
        { w: 'Ford Model T', en: 'Ford Model T', y: '1908' },
        { w: 'Assembly line', en: 'Moving Assembly Line', y: '1913' },
        { w: 'Ford River Rouge complex', en: 'River Rouge Complex', y: '1928' }] },
      { w: 'George Stephenson', en: 'George Stephenson', life: '1781–1848', p: [
        { w: 'Locomotion No. 1', en: 'Locomotion No. 1', y: '1825' },
        { w: 'Liverpool and Manchester Railway', en: 'Liverpool and Manchester Railway', y: '1830' },
        { w: 'Geordie lamp', en: 'Geordie Safety Lamp', y: '1815' }] },
      { w: 'Ferdinand Porsche', en: 'Ferdinand Porsche', life: '1875–1951', p: [
        { w: 'Lohner–Porsche', en: 'Lohner–Porsche', y: '1900' },
        { w: 'Volkswagen Beetle', en: 'Volkswagen Beetle', y: '1938' },
        { w: 'Auto Union racing cars', en: 'Auto Union Racing Car', y: '1934' }] },
      { w: 'Rudolf Diesel', en: 'Rudolf Diesel', life: '1858–1913', p: [
        { w: 'Diesel engine', en: 'Diesel Engine', y: '1897' },
        { w: 'MAN SE', en: 'First engine at Maschinenfabrik Augsburg', y: '1893' },
        { w: 'Vegetable oil fuel', en: 'Engine on peanut oil, Paris Expo', y: '1900' }] },
      { w: 'Nicolaus Otto', en: 'Nikolaus Otto', life: '1832–1891', p: [
        { w: 'Four-stroke engine', en: 'Four-Stroke Engine', y: '1876' },
        { w: 'Gas engine', en: 'Atmospheric Gas Engine', y: '1867' },
        { w: 'Deutz AG', en: 'Deutz AG', y: '1864' }] },
      { w: 'Ismail al-Jazari', en: 'Ismail al-Jazari', life: '1136–1206', p: [
        { w: 'The Book of Knowledge of Ingenious Mechanical Devices', en: 'Book of Ingenious Mechanical Devices', y: '1206' },
        { w: 'Elephant clock', en: 'Elephant Clock', y: '1206' },
        { w: 'Castle clock', en: 'Castle Clock', y: '1206' }] },
      { w: 'Soichiro Honda', en: 'Soichiro Honda', life: '1906–1991', p: [
        { w: 'Honda', en: 'Honda Motor Company', y: '1948' },
        { w: 'Honda Super Cub', en: 'Honda Super Cub', y: '1958' },
        { w: 'Honda CVCC engine', en: 'Honda CVCC Engine', y: '1972', q: 'Honda CVCC engine' }] },
      { w: 'Charles Algernon Parsons', en: 'Charles Parsons', life: '1854–1931', p: [
        { w: 'Steam turbine', en: 'Steam Turbine', y: '1884' },
        { w: 'Turbinia', en: 'Turbinia', y: '1894' },
        { w: 'C. A. Parsons and Company', en: 'C. A. Parsons & Company', y: '1889', q: 'Parsons Heaton works turbine' }] }
    ] },

  /* ───────────────────────── ELECTRICAL ───────────────────────── */
  { id: 'elec', en: 'Electrical Engineering', icon: 'elec', color: '#3B82F6', scene: 'waves', years: 4, spec: 'Type I · Class E · 20,000 V',
    cover: [P(29886913), P(189524), P(3334038)],
    study: [
      ['Calculus I', 'Physics', 'Electric Circuits I', 'Engineering Drawing', 'C++ Programming', 'Electrical Workshop'],
      ['Electric Circuits II', 'Electronics I', 'Digital Logic', 'Electromagnetics', 'Measurements', 'Engineering Mathematics'],
      ['Electrical Machines', 'Electronics II', 'Control Systems', 'Signals & Systems', 'Microprocessors', 'Power Electronics'],
      ['Power Systems', 'Protection & Switchgear', 'Renewable Energy', 'PLC & Automation', 'Electrical Installations', 'Graduation Project']
    ],
    br: ['Power Systems', 'Control & Automation', 'Electronics', 'Electrical Machines', 'Power Electronics', 'Renewables & Smart Grid', 'Instrumentation'],
    msc: ['M.Sc. Power Systems', 'M.Sc. Control Engineering', 'M.Sc. Electronics', 'M.Sc. Power Electronics & Drives', 'M.Sc. Renewable Energy', 'M.Sc. Electrical Machines'],
    phd: ['Smart Grids & Microgrids', 'Power System Stability', 'Electric Vehicles & Charging', 'Batteries & Energy Storage', 'Intelligent Control & AI', 'Wide-Bandgap Devices (SiC, GaN)'],
    sw: ['matlab', 'etap', 'powerfactory', 'psse', 'acadelec', 'dialux', 'ltspice', 'proteus', 'tiaportal', 'pvsyst'],
    ppe: ['helmet', 'insgloves', 'fr', 'faceshield', 'boots', 'glasses', 'harness'],
    eng: [
      { w: 'Nikola Tesla', en: 'Nikola Tesla', life: '1856–1943', p: [
        { w: 'Induction motor', en: 'AC Induction Motor', y: '1888' },
        { w: 'Tesla coil', en: 'Tesla Coil', y: '1891' },
        { w: 'Wardenclyffe Tower', en: 'Wardenclyffe Tower', y: '1901' }] },
      { w: 'Thomas Edison', en: 'Thomas Edison', life: '1847–1931', p: [
        { w: 'Incandescent light bulb', en: 'Practical Light Bulb', y: '1879' },
        { w: 'Phonograph', en: 'Phonograph', y: '1877' },
        { w: 'Pearl Street Station', en: 'Pearl Street Station', y: '1882' }] },
      { w: 'George Westinghouse', en: 'George Westinghouse', life: '1846–1914', p: [
        { w: 'Railway air brake', en: 'Railway Air Brake', y: '1869' },
        { w: "World's Columbian Exposition", en: "World's Columbian Exposition lighting", y: '1893' },
        { w: 'Adams Power Plant Transformer House', en: 'Niagara Falls Power Plant', y: '1895', q: 'Niagara Falls Adams hydroelectric power plant 1895' }] },
      { w: 'Werner von Siemens', en: 'Werner von Siemens', life: '1816–1892', p: [
        { w: 'Dynamo', en: 'Dynamo-Electric Principle', y: '1866' },
        { w: 'Indo-European telegraph line', en: 'Indo-European Telegraph Line', y: '1870' },
        { w: 'Gross-Lichterfelde Tramway', en: 'First Electric Tram', y: '1881' }] },
      { w: 'Jack Kilby', en: 'Jack Kilby', life: '1923–2005', p: [
        { w: 'Integrated circuit', en: 'Integrated Circuit', y: '1958' },
        { w: 'Calculator', en: 'Handheld Calculator (Cal-Tech)', y: '1967' },
        { w: 'Thermal printing', en: 'Thermal Printer', y: '1965' }] },
      { w: 'Michael Faraday', en: 'Michael Faraday', life: '1791–1867', p: [
        { w: 'Homopolar motor', en: 'First Electric Motor', y: '1821' },
        { w: "Faraday's law of induction", en: 'Electromagnetic Induction', y: '1831' },
        { w: 'Faraday cage', en: 'Faraday Cage', y: '1836' }] },
      { w: 'William Stanley Jr.', en: 'William Stanley Jr.', life: '1858–1916', p: [
        { w: 'Transformer', en: 'Practical AC Transformer', y: '1886' },
        { w: 'Great Barrington, Massachusetts', en: 'First AC Distribution System', y: '1886' },
        { w: 'Alternating current', en: 'Stanley Electric Manufacturing', y: '1890', q: 'Stanley Electric Manufacturing Company Pittsfield' }] },
      { w: 'Sebastian Ziani de Ferranti', en: 'Sebastian Ziani de Ferranti', life: '1864–1930', p: [
        { w: 'Alternator', en: 'Ferranti Alternator', y: '1882' },
        { w: 'Deptford Power Station', en: 'Deptford Power Station', y: '1889' },
        { w: 'Ferranti', en: 'Ferranti Company', y: '1882' }] },
      { w: 'Nick Holonyak', en: 'Nick Holonyak Jr.', life: '1928–2022', p: [
        { w: 'Light-emitting diode', en: 'First Visible LED', y: '1962' },
        { w: 'Silicon controlled rectifier', en: 'Five-Layer SCR (light dimmers)', y: '1959' },
        { w: 'Quantum well laser', en: 'Quantum Well Laser', y: '1977' }] },
      { w: 'Shuji Nakamura', en: 'Shuji Nakamura', life: '1954–', p: [
        { w: 'Gallium nitride', en: 'Bright Blue LED', y: '1993' },
        { w: 'Laser diode', en: 'Blue-Violet Laser (Blu-ray)', y: '1996' },
        { w: 'LED lamp', en: 'White LED Lighting', y: '1996' }] }
    ] },

  /* ───────────────────────── COMPUTER ───────────────────────── */
  { id: 'computer', en: 'Computer Engineering', icon: 'computer', color: '#8B5CF6', scene: 'circuit', years: 4, spec: 'Type I · Class E',
    cover: [P(6636476), P(6636500), P(6636497)],
    study: [
      ['Calculus I', 'Physics', 'Programming Fundamentals', 'Digital Logic', 'Discrete Mathematics', 'Computer Fundamentals'],
      ['Data Structures', 'Electric Circuits', 'Electronics', 'Object-Oriented Programming', 'Signals & Systems', 'Engineering Mathematics'],
      ['Computer Architecture', 'Operating Systems', 'Computer Networks', 'Embedded Systems', 'Databases', 'Algorithms'],
      ['VLSI & FPGA Design', 'Artificial Intelligence', 'Network Security', 'Internet of Things', 'Parallel & Cloud Computing', 'Graduation Project']
    ],
    br: ['Computer Architecture', 'Embedded & IoT', 'Networks & Cybersecurity', 'AI & Robotics', 'VLSI & Chip Design', 'Cloud & Distributed Systems', 'Computer Vision'],
    msc: ['M.Sc. Computer Engineering', 'M.Sc. Networks & Security', 'M.Sc. Embedded Systems', 'M.Sc. Artificial Intelligence', 'M.Sc. VLSI Design', 'M.Sc. Robotics'],
    phd: ['AI Accelerators & Deep Learning Hardware', 'Quantum Computing', 'Cybersecurity', 'Edge Computing & IoT', 'Processor Architecture', 'Autonomous Systems'],
    sw: ['vscode', 'python', 'vivado', 'matlab', 'packettracer', 'wireshark', 'linux', 'arduino', 'git', 'docker'],
    ppe: ['esd', 'glasses', 'ear', 'ergo', 'helmet'],
    eng: [
      { w: 'Alan Turing', en: 'Alan Turing', life: '1912–1954', p: [
        { w: 'Turing machine', en: 'Turing Machine', y: '1936' },
        { w: 'Bombe', en: 'The Bombe', y: '1940' },
        { w: 'Automatic Computing Engine', en: 'Automatic Computing Engine (ACE)', y: '1945' }] },
      { w: 'John von Neumann', en: 'John von Neumann', life: '1903–1957', p: [
        { w: 'Von Neumann architecture', en: 'Von Neumann Architecture', y: '1945' },
        { w: 'EDVAC', en: 'EDVAC', y: '1949' },
        { w: 'IAS machine', en: 'IAS Machine', y: '1951' }] },
      { w: 'Seymour Cray', en: 'Seymour Cray', life: '1925–1996', p: [
        { w: 'CDC 6600', en: 'CDC 6600', y: '1964' },
        { w: 'Cray-1', en: 'Cray-1', y: '1976' },
        { w: 'Cray-2', en: 'Cray-2', y: '1985' }] },
      { w: 'Steve Wozniak', en: 'Steve Wozniak', life: '1950–', p: [
        { w: 'Apple I', en: 'Apple I', y: '1976' },
        { w: 'Apple II', en: 'Apple II', y: '1977' },
        { w: 'Disk II', en: 'Disk II', y: '1978' }] },
      { w: 'Federico Faggin', en: 'Federico Faggin', life: '1941–', p: [
        { w: 'Intel 4004', en: 'Intel 4004', y: '1971' },
        { w: 'Zilog Z80', en: 'Zilog Z80', y: '1976' },
        { w: 'Touchpad', en: 'Synaptics Touchpad', y: '1994' }] },
      { w: 'Charles Babbage', en: 'Charles Babbage', life: '1791–1871', p: [
        { w: 'Difference engine', en: 'Difference Engine', y: '1822' },
        { w: 'Analytical engine', en: 'Analytical Engine', y: '1837' },
        { w: 'Science Museum, London', en: 'Difference Engine No. 2 (built 1991)', y: '1849', q: 'Difference Engine No. 2 Science Museum' }] },
      { w: 'J. Presper Eckert', en: 'J. Presper Eckert', life: '1919–1995', p: [
        { w: 'ENIAC', en: 'ENIAC', y: '1945' },
        { w: 'Delay-line memory', en: 'Mercury Delay-Line Memory', y: '1947' },
        { w: 'UNIVAC I', en: 'UNIVAC I', y: '1951' }] },
      { w: 'Robert Noyce', en: 'Robert Noyce', life: '1927–1990', p: [
        { w: 'Fairchild Semiconductor', en: 'Fairchild Semiconductor', y: '1957' },
        { w: 'Planar process', en: 'Monolithic Silicon Integrated Circuit', y: '1959' },
        { w: 'Intel', en: 'Intel', y: '1968' }] },
      { w: 'Jensen Huang', en: 'Jensen Huang', life: '1963–', p: [
        { w: 'Nvidia', en: 'NVIDIA', y: '1993' },
        { w: 'GeForce 256', en: 'GeForce 256 — first "GPU"', y: '1999' },
        { w: 'CUDA', en: 'CUDA', y: '2007' }] },
      { w: 'Sophie Wilson', en: 'Sophie Wilson', life: '1957–', p: [
        { w: 'BBC Micro', en: 'BBC Micro', y: '1981' },
        { w: 'ARM architecture family', en: 'ARM Instruction Set', y: '1985' },
        { w: 'Acorn Archimedes', en: 'Acorn Archimedes', y: '1987' }] }
    ] },

  /* ───────────────────────── SOFTWARE ───────────────────────── */
  { id: 'software', en: 'Software Engineering', icon: 'software', color: '#22D3EE', scene: 'code', years: 4, spec: 'Type I · Class G (visitor)',
    cover: [P(546819), P(6424584), P(10816120)],
    study: [
      ['Programming Fundamentals', 'Calculus', 'Discrete Mathematics', 'Computer Fundamentals', 'Web Design (HTML/CSS)', 'Technical English'],
      ['OOP (Java/C#)', 'Data Structures & Algorithms', 'Databases (SQL)', 'Probability & Statistics', 'Web Programming', 'Operating Systems'],
      ['Software Engineering (SDLC, UML)', 'Software Testing & QA', 'Computer Networks', 'Mobile Development', 'UI/UX Design', 'Theory of Computation'],
      ['Software Architecture & Patterns', 'Agile Project Management', 'Artificial Intelligence', 'Cloud & DevOps', 'Software Security', 'Graduation Project']
    ],
    br: ['Web Development', 'Mobile Development', 'AI & Data Science', 'DevOps & Cloud', 'Cybersecurity', 'Game Development', 'QA & Testing', 'UI/UX Design'],
    msc: ['M.Sc. Software Engineering', 'M.Sc. Computer Science', 'M.Sc. Artificial Intelligence', 'M.Sc. Data Science', 'M.Sc. Cybersecurity', 'M.Sc. Information Systems'],
    phd: ['Large Language Models', 'Formal Verification', 'AI for Software Engineering', 'Distributed Systems', 'Privacy & Security', 'Human–Computer Interaction'],
    sw: ['vscode', 'git', 'jetbrains', 'androidstudio', 'figma', 'docker', 'postman', 'jira', 'postgresql', 'python'],
    ppe: ['ergo', 'helmet', 'vest', 'boots'],
    eng: [
      { w: 'Margaret Hamilton (software engineer)', en: 'Margaret Hamilton', life: '1936–', p: [
        { w: 'Apollo Guidance Computer', en: 'Apollo Flight Software', y: '1969' },
        { w: 'Semi-Automatic Ground Environment', en: 'SAGE Air-Defense Software', y: '1961' },
        { w: 'Universal Systems Language', en: 'Universal Systems Language', y: '1986' }] },
      { w: 'Dennis Ritchie', en: 'Dennis Ritchie', life: '1941–2011', p: [
        { w: 'C (programming language)', en: 'C Language', y: '1972' },
        { w: 'Unix', en: 'Unix', y: '1971' },
        { w: 'Plan 9 from Bell Labs', en: 'Plan 9', y: '1992' }] },
      { w: 'Linus Torvalds', en: 'Linus Torvalds', life: '1969–', p: [
        { w: 'Linux kernel', en: 'Linux Kernel', y: '1991' },
        { w: 'Git', en: 'Git', y: '2005' },
        { w: 'Subsurface (software)', en: 'Subsurface', y: '2011' }] },
      { w: 'Tim Berners-Lee', en: 'Tim Berners-Lee', life: '1955–', p: [
        { w: 'World Wide Web', en: 'World Wide Web', y: '1991' },
        { w: 'HTML', en: 'HTML & HTTP', y: '1990' },
        { w: 'WorldWideWeb', en: 'First Web Browser', y: '1990' }] },
      { w: 'Grace Hopper', en: 'Grace Hopper', life: '1906–1992', p: [
        { w: 'Harvard Mark I', en: 'Harvard Mark I', y: '1944' },
        { w: 'A-0 System', en: 'A-0 Compiler', y: '1952' },
        { w: 'COBOL', en: 'COBOL', y: '1959' }] },
      { w: 'Ada Lovelace', en: 'Ada Lovelace', life: '1815–1852', p: [
        { w: 'Note G', en: 'Note G — first published algorithm', y: '1843' },
        { w: 'Analytical engine', en: 'Notes on the Analytical Engine', y: '1843' },
        { w: 'Ada (programming language)', en: 'Ada Language (named after her)', y: '1980' }] },
      { w: 'Ken Thompson', en: 'Ken Thompson', life: '1943–', p: [
        { w: 'Unix', en: 'Unix', y: '1969' },
        { w: 'UTF-8', en: 'UTF-8', y: '1992' },
        { w: 'Go (programming language)', en: 'Go Language', y: '2009' }] },
      { w: 'James Gosling', en: 'James Gosling', life: '1955–', p: [
        { w: 'Gosling Emacs', en: 'Gosling Emacs', y: '1981' },
        { w: 'NeWS', en: 'NeWS Window System', y: '1986' },
        { w: 'Java (programming language)', en: 'Java', y: '1995' }] },
      { w: 'Anders Hejlsberg', en: 'Anders Hejlsberg', life: '1960–', p: [
        { w: 'Turbo Pascal', en: 'Turbo Pascal', y: '1983' },
        { w: 'C Sharp (programming language)', en: 'C#', y: '2000' },
        { w: 'TypeScript', en: 'TypeScript', y: '2012' }] },
      { w: 'John Carmack', en: 'John Carmack', life: '1970–', p: [
        { w: 'Doom (1993 video game)', en: 'Doom Engine', y: '1993' },
        { w: 'Quake (video game)', en: 'Quake Engine', y: '1996' },
        { w: 'Oculus Rift', en: 'Oculus Rift (VR)', y: '2016' }] }
    ] },

  /* ───────────────────────── COMMUNICATION ───────────────────────── */
  { id: 'comm', en: 'Communication Engineering', icon: 'comm', color: '#E879F9', scene: 'radio', years: 4, spec: 'Climbing helmet · EN 12492',
    cover: [P(9290873), P(10395944)],
    study: [
      ['Calculus I', 'Physics', 'Electric Circuits', 'Programming', 'Digital Logic', 'Engineering Drawing'],
      ['Electronics', 'Signals & Systems', 'Electromagnetic Fields', 'Probability & Random Processes', 'Engineering Mathematics', 'Microprocessors'],
      ['Analog Communication', 'Digital Communication', 'Antennas & Propagation', 'Digital Signal Processing', 'Communication Networks', 'Microwave Engineering'],
      ['Mobile Communication (4G/5G)', 'Optical Fiber Communication', 'Satellite Communication', 'Information Theory & Coding', 'Wireless Networks', 'Graduation Project']
    ],
    br: ['Wireless & Mobile', 'Optical Communication', 'Satellite Communication', 'RF & Microwave', 'Networking', 'Signal Processing', 'Radar & Navigation'],
    msc: ['M.Sc. Communication Engineering', 'M.Sc. Wireless Communication', 'M.Sc. Optical Communication', 'M.Sc. Signal Processing', 'M.Sc. RF & Microwave', 'M.Sc. Networking'],
    phd: ['6G Networks', 'Massive MIMO & Beamforming', 'Machine Learning for Communications', 'Satellite Internet', 'Quantum Communication', 'THz & mmWave'],
    sw: ['matlab', 'simulink', 'cst', 'hfss', 'atoll', 'packettracer', 'gns3', 'wireshark', 'gnuradio', 'optisystem'],
    ppe: ['helmet', 'harness', 'rf', 'boots', 'gloves', 'vest'],
    eng: [
      { w: 'Guglielmo Marconi', en: 'Guglielmo Marconi', life: '1874–1937', p: [
        { w: 'Wireless telegraphy', en: 'Wireless Telegraphy', y: '1897' },
        { w: 'Poldhu', en: 'First Transatlantic Radio Signal', y: '1901', q: 'Marconi Poldhu transatlantic radio 1901' },
        { w: 'Marconi Company', en: 'Marconi Company', y: '1897' }] },
      { w: 'Alexander Graham Bell', en: 'Alexander Graham Bell', life: '1847–1922', p: [
        { w: 'Telephone', en: 'Telephone', y: '1876' },
        { w: 'Photophone', en: 'Photophone', y: '1880' },
        { w: 'Graphophone', en: 'Graphophone', y: '1886' }] },
      { w: 'Claude Shannon', en: 'Claude Shannon', life: '1916–2001', p: [
        { w: 'A Symbolic Analysis of Relay and Switching Circuits', en: 'Switching Circuit Theory', y: '1937' },
        { w: 'A Mathematical Theory of Communication', en: 'A Mathematical Theory of Communication', y: '1948' },
        { w: 'Nyquist–Shannon sampling theorem', en: 'Sampling Theorem', y: '1949' }] },
      { w: 'Martin Cooper (inventor)', en: 'Martin Cooper', life: '1928–', p: [
        { w: 'Motorola DynaTAC', en: 'Motorola DynaTAC', y: '1973' },
        { w: 'ArrayComm', en: 'ArrayComm Smart Antennas', y: '1992' },
        { w: 'GreatCall', en: 'Jitterbug Phone', y: '2006' }] },
      { w: 'Vint Cerf', en: 'Vint Cerf', life: '1943–', p: [
        { w: 'Internet protocol suite', en: 'TCP/IP', y: '1974' },
        { w: 'ARPANET', en: 'ARPANET → Internet', y: '1983' },
        { w: 'Interplanetary Internet', en: 'Interplanetary Internet', y: '1998' }] },
      { w: 'Samuel Morse', en: 'Samuel Morse', life: '1791–1872', p: [
        { w: 'Morse code', en: 'Morse Code', y: '1838' },
        { w: 'What hath God wrought', en: 'Washington–Baltimore Telegraph Line', y: '1844' },
        { w: 'Electrical telegraph', en: 'Morse Telegraph', y: '1847' }] },
      { w: 'Philo Farnsworth', en: 'Philo Farnsworth', life: '1906–1971', p: [
        { w: 'Image dissector', en: 'Image Dissector', y: '1927' },
        { w: 'History of television', en: 'First All-Electronic TV Picture', y: '1927' },
        { w: 'Fusor', en: 'Farnsworth–Hirsch Fusor', y: '1964' }] },
      { w: 'John R. Pierce', en: 'John R. Pierce', life: '1910–2002', p: [
        { w: 'Traveling-wave tube', en: 'Traveling-Wave Tube', y: '1946' },
        { w: 'Project Echo', en: 'Echo 1 Satellite', y: '1960' },
        { w: 'Telstar 1', en: 'Telstar 1', y: '1962' }] },
      { w: 'Andrew Viterbi', en: 'Andrew Viterbi', life: '1935–', p: [
        { w: 'Viterbi algorithm', en: 'Viterbi Algorithm', y: '1967' },
        { w: 'Qualcomm', en: 'Qualcomm', y: '1985' },
        { w: 'Code-division multiple access', en: 'CDMA Mobile Networks', y: '1995' }] },
      { w: 'Robert Metcalfe', en: 'Robert Metcalfe', life: '1946–', p: [
        { w: 'Ethernet', en: 'Ethernet', y: '1973' },
        { w: '3Com', en: '3Com', y: '1979' },
        { w: "Metcalfe's law", en: "Metcalfe's Law", y: '1980' }] }
    ] },

  /* ───────────────────────── CHEMICAL ───────────────────────── */
  { id: 'chem', en: 'Chemical Engineering', icon: 'chem', color: '#22C55E', scene: 'molecules', years: 4, spec: 'Type II · Class E',
    cover: [P(1366944), P(8325706), P(10407689)],
    study: [
      ['Calculus I', 'Physics', 'General Chemistry', 'Engineering Drawing', 'Programming', 'Intro to Chemical Engineering'],
      ['Material & Energy Balances', 'Organic Chemistry', 'Physical Chemistry', 'Thermodynamics I', 'Fluid Flow', 'Engineering Mathematics'],
      ['Heat Transfer', 'Mass Transfer', 'Chemical Thermodynamics', 'Reaction Engineering', 'Unit Operations', 'Numerical Methods'],
      ['Plant Design & Economics', 'Process Control', 'Separation Processes', 'Petroleum Refining', 'Process Safety (HAZOP)', 'Graduation Project']
    ],
    br: ['Process & Refining', 'Petrochemicals', 'Polymer Engineering', 'Environmental', 'Biochemical & Pharmaceutical', 'Food Engineering', 'Energy & Fuels'],
    msc: ['M.Sc. Chemical Engineering', 'M.Sc. Process Engineering', 'M.Sc. Polymer Engineering', 'M.Sc. Environmental Engineering', 'M.Sc. Biochemical Engineering', 'M.Sc. Oil & Gas Processing'],
    phd: ['Catalysis & Nanomaterials', 'Carbon Capture (CCUS)', 'Green Hydrogen', 'Bioprocess Engineering', 'Membrane Separation', 'Process Systems Engineering & AI'],
    sw: ['hysys', 'aspenplus', 'chemcad', 'dwsim', 'matlab', 'comsol', 'fluent', 'plant3d', 'pro2', 'excel'],
    ppe: ['helmet', 'goggles', 'fr', 'gloves', 'mask', 'boots', 'gas', 'faceshield'],
    eng: [
      { w: 'Carl Bosch', en: 'Carl Bosch', life: '1874–1940', p: [
        { w: 'Haber process', en: 'Haber–Bosch Process', y: '1913' },
        { w: 'Leuna', en: 'Leuna Ammonia Works', y: '1917', q: 'Leuna chemical plant ammonia 1917' },
        { w: 'Methanol', en: 'High-Pressure Methanol Synthesis', y: '1923' }] },
      { w: 'Frances Arnold', en: 'Frances Arnold', life: '1956–', p: [
        { w: 'Directed evolution', en: 'Directed Evolution of Enzymes', y: '1993' },
        { w: 'Gevo', en: 'Gevo Renewable Fuels', y: '2005' },
        { w: 'Provivi', en: 'Provivi', y: '2013', q: 'Provivi pheromone pest control company' }] },
      { w: 'Robert S. Langer', en: 'Robert Langer', life: '1948–', p: [
        { w: 'Drug delivery', en: 'Controlled Drug Delivery', y: '1976' },
        { w: 'Tissue engineering', en: 'Tissue Engineering', y: '1993' },
        { w: 'Moderna', en: 'Moderna', y: '2010' }] },
      { w: 'Ernest Solvay', en: 'Ernest Solvay', life: '1838–1922', p: [
        { w: 'Solvay process', en: 'Solvay Process', y: '1861' },
        { w: 'Solvay S.A.', en: 'Solvay Company', y: '1863' },
        { w: 'Solvay Conference', en: 'Solvay Conferences', y: '1911' }] },
      { w: 'Eugene Houdry', en: 'Eugene Houdry', life: '1892–1962', p: [
        { w: 'Cracking (chemistry)', en: 'Catalytic Cracking', y: '1937' },
        { w: 'Avgas', en: '100-Octane Aviation Fuel', y: '1940' },
        { w: 'Catalytic converter', en: 'Catalytic Converter', y: '1956' }] },
      { w: 'George E. Davis', en: 'George E. Davis', life: '1850–1907', p: [
        { w: 'Society of Chemical Industry', en: 'Society of Chemical Industry', y: '1881' },
        { w: 'University of Manchester Institute of Science and Technology', en: 'First Chemical Engineering Lectures, Manchester', y: '1887' },
        { w: 'Chemical engineering', en: 'A Handbook of Chemical Engineering', y: '1901' }] },
      { w: 'Warren K. Lewis', en: 'Warren K. Lewis', life: '1882–1975', p: [
        { w: 'Unit operation', en: 'Principles of Chemical Engineering', y: '1923' },
        { w: 'Mass transfer', en: 'Two-Film Theory of Mass Transfer', y: '1924' },
        { w: 'Fluid catalytic cracking', en: 'Fluid Catalytic Cracking', y: '1942' }] },
      { w: 'Charles Martin Hall', en: 'Charles Martin Hall', life: '1863–1914', p: [
        { w: 'Hall–Héroult process', en: 'Hall–Héroult Process', y: '1886' },
        { w: 'Alcoa', en: 'Alcoa', y: '1888' },
        { w: 'Aluminium', en: 'Affordable Aluminium', y: '1890' }] },
      { w: 'Wallace Carothers', en: 'Wallace Carothers', life: '1896–1937', p: [
        { w: 'Neoprene', en: 'Neoprene', y: '1930' },
        { w: 'Polyester', en: 'Polyester Research', y: '1930' },
        { w: 'Nylon', en: 'Nylon', y: '1935' }] },
      { w: 'Leo Baekeland', en: 'Leo Baekeland', life: '1863–1944', p: [
        { w: 'Photographic paper', en: 'Velox Photographic Paper', y: '1893' },
        { w: 'Bakelite', en: 'Bakelite', y: '1907' },
        { w: 'Plastic', en: 'The Age of Plastics', y: '1910' }] }
    ] },

  /* ───────────────────────── PETROLEUM ───────────────────────── */
  { id: 'petro', en: 'Petroleum Engineering', icon: 'petro', color: '#EF4444', scene: 'oil', years: 4, spec: 'Type I · Class E',
    cover: [P(16862261), P(9698520), P(10407689)],
    study: [
      ['Calculus I', 'Physics', 'Chemistry', 'Physical Geology', 'Engineering Drawing', 'Programming'],
      ['Petroleum Geology', 'Reservoir Rock Properties', 'Reservoir Fluids (PVT)', 'Fluid Mechanics', 'Thermodynamics', 'Engineering Mathematics'],
      ['Drilling Engineering I', 'Reservoir Engineering I', 'Well Logging', 'Production Engineering', 'Drilling Fluids', 'Petroleum Geophysics'],
      ['Directional Drilling', 'Reservoir Simulation', 'Artificial Lift', 'Well Testing', 'Enhanced Oil Recovery', 'Petroleum Economics']
    ],
    br: ['Drilling Engineering', 'Reservoir Engineering', 'Production Engineering', 'Petrophysics', 'Natural Gas Engineering', 'EOR & Unconventional', 'Petroleum Economics'],
    msc: ['M.Sc. Petroleum Engineering', 'M.Sc. Reservoir Engineering', 'M.Sc. Drilling Engineering', 'M.Sc. Natural Gas Engineering', 'M.Sc. Petroleum Economics', 'M.Sc. Petroleum Geoscience'],
    phd: ['Chemical & Gas EOR', 'Fractured Carbonate Reservoirs', 'Underground CO₂ Storage', 'Digital Oilfield & AI', 'Geomechanics', 'Geothermal Energy'],
    sw: ['petrel', 'eclipse', 'cmg', 'pipesim', 'olga', 'techlog', 'kappa', 'landmark', 'prosper', 'ip'],
    ppe: ['helmet', 'fr', 'gas', 'boots', 'gloves', 'glasses', 'ear', 'harness'],
    eng: [
      { w: 'Edwin Drake', en: 'Edwin Drake', life: '1819–1880', p: [
        { w: 'Drake Well Museum', en: 'Drake Well', y: '1859', q: 'Drake Well Titusville 1859' },
        { w: 'Casing (borehole)', en: 'Drive Pipe (Casing)', y: '1859' },
        { w: 'Pennsylvania oil rush', en: 'Pennsylvania Oil Rush', y: '1860' }] },
      { w: 'Anthony Francis Lucas', en: 'Anthony F. Lucas', life: '1855–1921', p: [
        { w: 'Spindletop', en: 'Spindletop Gusher', y: '1901' },
        { w: 'Salt dome', en: 'Salt Dome Exploration', y: '1901' },
        { w: 'Drilling fluid', en: 'Rotary Drilling with Mud', y: '1901' }] },
      { w: 'Conrad Schlumberger', en: 'Conrad Schlumberger', life: '1878–1936', p: [
        { w: 'Electrical resistivity tomography', en: 'Electrical Resistivity Prospecting', y: '1912', q: 'electrical resistivity survey geophysics' },
        { w: 'Schlumberger', en: 'Schlumberger (SLB)', y: '1926' },
        { w: 'Well logging', en: 'First Electrical Well Log', y: '1927' }] },
      { w: 'Howard R. Hughes Sr.', en: 'Howard R. Hughes Sr.', life: '1869–1924', p: [
        { w: 'Drill bit', en: 'Two-Cone Roller Bit', y: '1909' },
        { w: 'Hughes Tool Company', en: 'Hughes Tool Company', y: '1909' },
        { w: 'Baker Hughes', en: 'Baker Hughes', y: '1987' }] },
      { w: 'George P. Mitchell', en: 'George P. Mitchell', life: '1919–2013', p: [
        { w: 'The Woodlands, Texas', en: 'The Woodlands', y: '1974' },
        { w: 'Barnett Shale', en: 'Barnett Shale', y: '1981' },
        { w: 'Hydraulic fracturing', en: 'Slickwater Fracturing', y: '1998' }] },
      { w: 'Everette Lee DeGolyer', en: 'Everette Lee DeGolyer', life: '1886–1956', p: [
        { w: 'Potrero del Llano', en: 'Potrero del Llano No. 4', y: '1910', q: 'Potrero del Llano oil well Mexico 1910' },
        { w: 'Hess Corporation', en: 'Amerada Petroleum', y: '1919' },
        { w: 'DeGolyer and MacNaughton', en: 'DeGolyer and MacNaughton', y: '1936' }] },
      { w: 'John Clarence Karcher', en: 'J. Clarence Karcher', life: '1894–1978', p: [
        { w: 'Reflection seismology', en: 'Reflection Seismograph', y: '1921' },
        { w: 'Seismometer', en: 'Geophysical Research Corporation', y: '1925' },
        { w: 'Texas Instruments', en: 'Geophysical Service Inc. → Texas Instruments', y: '1930' }] },
      { w: 'Max Steineke', en: 'Max Steineke', life: '1898–1952', p: [
        { w: 'Dammam No. 7', en: 'Dammam No. 7', y: '1938' },
        { w: 'Abqaiq', en: 'Abqaiq Field', y: '1940', q: 'Abqaiq oil field discovery 1940' },
        { w: 'Ghawar Field', en: 'Ghawar Field', y: '1948' }] },
      { w: 'M. King Hubbert', en: 'M. King Hubbert', life: '1903–1989', p: [
        { w: 'Groundwater flow', en: 'Theory of Groundwater Motion', y: '1940' },
        { w: 'Hubbert peak theory', en: 'Hubbert Peak Theory', y: '1956' },
        { w: 'Fracture mechanics', en: 'Mechanics of Hydraulic Fracturing', y: '1957' }] },
      { w: 'Erle P. Halliburton', en: 'Erle P. Halliburton', life: '1892–1957', p: [
        { w: 'Halliburton', en: 'Halliburton Company', y: '1919' },
        { w: 'Cement', en: 'Oil-Well Cementing Method', y: '1920', q: 'oil well cementing Halliburton' },
        { w: 'Southwest Air Fast Express', en: 'SAFEway Airline', y: '1929' }] }
    ] },

  /* ───────────────────────── WATER RESOURCES ───────────────────────── */
  { id: 'water', en: 'Water Resources Engineering', icon: 'water', color: '#2DD4BF', scene: 'water', years: 4, spec: 'Type I · Class G',
    cover: [P(2796964), P(21772130)],
    study: [
      ['Calculus I', 'Physics', 'Chemistry', 'Engineering Drawing', 'Statics', 'Engineering Geology'],
      ['Strength of Materials', 'Fluid Mechanics', 'Surveying', 'Engineering Hydrology', 'Construction Materials', 'Engineering Mathematics'],
      ['Open Channel Hydraulics', 'Groundwater Hydrology', 'Irrigation & Drainage', 'Soil Mechanics', 'Concrete Design', 'Statistics & Numerical Methods'],
      ['Dam Engineering', 'Hydraulic Structures', 'Water Resources Management', 'Water Supply & Sewerage', 'GIS & Remote Sensing', 'Graduation Project']
    ],
    br: ['Hydraulic Structures', 'Hydrology', 'Groundwater', 'Irrigation & Drainage', 'Dam Engineering', 'Water Management & Climate', 'Water Supply & Treatment'],
    msc: ['M.Sc. Water Resources', 'M.Sc. Hydraulic Engineering', 'M.Sc. Hydrology', 'M.Sc. Irrigation & Drainage', 'M.Sc. Hydrogeology', 'M.Sc. Water Management'],
    phd: ['AI Flood Forecasting', 'Climate Change & Water', 'Dam Safety', 'Satellite Hydrology', 'Smart Irrigation', 'Transboundary Rivers & Water Diplomacy'],
    sw: ['hecras', 'hechms', 'arcgis', 'watergems', 'epanet', 'sewergems', 'modflow', 'swmm', 'cropwat', 'civil3d'],
    ppe: ['helmet', 'lifejacket', 'boots', 'vest', 'gloves', 'gas'],
    eng: [
      { w: 'Henry Darcy', en: 'Henry Darcy', life: '1803–1858', p: [
        { w: 'Dijon', en: 'Dijon Water Supply System', y: '1840', q: 'Darcy Dijon water supply system 1840' },
        { w: "Darcy's law", en: "Darcy's Law", y: '1856' },
        { w: 'Darcy–Weisbach equation', en: 'Darcy–Weisbach Equation', y: '1857' }] },
      { w: 'Frank Crowe', en: 'Frank Crowe', life: '1882–1946', p: [
        { w: 'Hoover Dam', en: 'Hoover Dam', y: '1936' },
        { w: 'Parker Dam', en: 'Parker Dam', y: '1938' },
        { w: 'Shasta Dam', en: 'Shasta Dam', y: '1945' }] },
      { w: 'Cornelis Lely', en: 'Cornelis Lely', life: '1854–1929', p: [
        { w: 'Afsluitdijk', en: 'Afsluitdijk', y: '1932' },
        { w: 'Zuiderzee Works', en: 'Zuiderzee Works', y: '1975' },
        { w: 'Lelystad', en: 'Lelystad', y: '1967' }] },
      { w: 'Joseph Bazalgette', en: 'Joseph Bazalgette', life: '1819–1891', p: [
        { w: 'London sewerage system', en: 'London Sewerage System', y: '1875' },
        { w: 'Victoria Embankment', en: 'Victoria Embankment', y: '1870' },
        { w: 'Hammersmith Bridge', en: 'Hammersmith Bridge', y: '1887' }] },
      { w: 'William Willcocks', en: 'William Willcocks', life: '1852–1932', p: [
        { w: 'Aswan Low Dam', en: 'Aswan Low Dam', y: '1902' },
        { w: 'Lake Habbaniyah', en: 'Habbaniyah Flood Plan', y: '1911' },
        { w: 'Hindiya Barrage', en: 'Hindiya Barrage', y: '1914' }] },
      { w: 'Pierre-Paul Riquet', en: 'Pierre-Paul Riquet', life: '1609–1680', p: [
        { w: 'Bassin de Saint-Ferréol', en: 'Saint-Ferréol Reservoir', y: '1672' },
        { w: 'Malpas Tunnel', en: 'Malpas Tunnel', y: '1679' },
        { w: 'Canal du Midi', en: 'Canal du Midi', y: '1681' }] },
      { w: 'John L. Savage', en: 'John L. Savage', life: '1879–1967', p: [
        { w: 'Hoover Dam', en: 'Hoover Dam (chief designer)', y: '1936' },
        { w: 'Grand Coulee Dam', en: 'Grand Coulee Dam', y: '1942' },
        { w: 'Three Gorges Dam', en: 'Yangtze Gorge Plan', y: '1944' }] },
      { w: 'Johan van Veen', en: 'Johan van Veen', life: '1893–1959', p: [
        { w: 'Delta Works', en: 'Delta Plan', y: '1953' },
        { w: 'Haringvlietdam', en: 'Haringvliet Dam', y: '1971' },
        { w: 'Oosterscheldekering', en: 'Eastern Scheldt Barrier', y: '1986' }] },
      { w: 'Arthur Cotton', en: 'Arthur Cotton', life: '1803–1899', p: [
        { w: 'Kallanai', en: 'Restoring the Grand Anicut (Kallanai)', y: '1840' },
        { w: 'Dowleswaram', en: 'Dowleswaram Barrage', y: '1852', q: 'Dowleswaram barrage Godavari Arthur Cotton' },
        { w: 'Godavari River', en: 'Godavari Delta Irrigation', y: '1855' }] },
      { w: 'Ellis S. Chesbrough', en: 'Ellis S. Chesbrough', life: '1813–1886', p: [
        { w: 'Cochituate Aqueduct', en: 'Boston Cochituate Aqueduct', y: '1848', q: 'Cochituate aqueduct Boston' },
        { w: 'Raising of Chicago', en: 'Chicago Sewer System', y: '1856' },
        { w: 'Chicago water crib', en: 'Chicago Lake Tunnel & Water Crib', y: '1867', q: 'Chicago two mile water crib 1867' }] }
    ] },

  /* ───────────────────────── BIOMEDICAL ───────────────────────── */
  { id: 'biomed', en: 'Biomedical Engineering', icon: 'biomed', color: '#F472B6', scene: 'pulse', years: 4, spec: 'Bump cap · EN 812',
    cover: [P(7089017), P(13176450)],
    study: [
      ['Calculus I', 'Physics', 'Chemistry', 'Biology', 'Programming', 'Engineering Drawing'],
      ['Anatomy & Physiology', 'Electric Circuits', 'Electronics', 'Biomechanics', 'Biochemistry', 'Engineering Mathematics'],
      ['Biomedical Instrumentation', 'Biosignal Processing', 'Biomaterials', 'Microcontrollers', 'Control Systems', 'Biophysics'],
      ['Medical Imaging (X-ray, CT, MRI)', 'Prosthetics & Rehabilitation', 'Clinical Engineering', 'Medical Device Safety', 'Image Processing', 'Graduation Project']
    ],
    br: ['Medical Instrumentation', 'Medical Imaging', 'Biomechanics & Prosthetics', 'Biomaterials & Tissue Engineering', 'Clinical Engineering', 'Health Informatics & AI', 'Neuroengineering'],
    msc: ['M.Sc. Biomedical Engineering', 'M.Sc. Medical Imaging', 'M.Sc. Clinical Engineering', 'M.Sc. Biomechanics', 'M.Sc. Biomaterials', 'M.Sc. Medical Physics'],
    phd: ['AI in Diagnostics', 'Brain–Computer Interfaces', '3D Bioprinting', 'Surgical Robotics', 'Nanomedicine', 'Wearable Health Tech'],
    sw: ['matlab', 'labview', 'solidworks', 'comsol', 'ansys', 'slicer', 'python', 'proteus', 'opensim', 'imagej'],
    ppe: ['labcoat', 'gloves', 'glasses', 'mask', 'dosimeter', 'esd', 'bumpcap'],
    eng: [
      { w: 'Wilson Greatbatch', en: 'Wilson Greatbatch', life: '1919–2011', img: 'assets/img/eng/wilson-greatbatch.jpg', p: [
        { w: 'Artificial cardiac pacemaker', en: 'Implantable Pacemaker', y: '1960' },
        { w: 'Integer Holdings', en: 'Greatbatch Ltd.', y: '1970', q: 'Greatbatch Ltd medical battery company' },
        { w: 'Lithium–iodine battery', en: 'Lithium–Iodine Battery', y: '1971', q: 'lithium iodine battery pacemaker Greatbatch' }] },
      { w: 'Earl Bakken', en: 'Earl Bakken', life: '1924–2018', p: [
        { w: 'Medtronic', en: 'Medtronic', y: '1949' },
        { w: 'Transcutaneous pacing', en: 'Wearable Battery Pacemaker', y: '1957', q: 'Bakken first wearable transistorized pacemaker 1957' },
        { w: 'The Bakken Museum', en: 'The Bakken Museum', y: '1975', q: 'Bakken Museum Minneapolis' }] },
      { w: 'Willem Johan Kolff', en: 'Willem Kolff', life: '1911–2009', p: [
        { w: 'Hemodialysis', en: 'Kidney Dialysis Machine', y: '1943' },
        { w: 'Heart–lung machine', en: 'Membrane Oxygenator', y: '1956' },
        { w: 'Jarvik-7', en: 'Jarvik-7 Artificial Heart', y: '1982' }] },
      { w: 'Godfrey Hounsfield', en: 'Godfrey Hounsfield', life: '1919–2004', p: [
        { w: 'EMIDEC 1100', en: 'EMIDEC 1100 Computer', y: '1959' },
        { w: 'CT scan', en: 'CT Scanner', y: '1971' },
        { w: 'Hounsfield scale', en: 'Hounsfield Scale', y: '1972' }] },
      { w: 'Graeme Clark (doctor)', en: 'Graeme Clark', life: '1935–', p: [
        { w: 'Cochlear implant', en: 'Multichannel Cochlear Implant', y: '1978' },
        { w: 'Cochlear Limited', en: 'Cochlear Limited', y: '1981' },
        { w: 'Bionics Institute', en: 'Bionics Institute', y: '1983' }] },
      { w: 'Forrest Bird', en: 'Forrest Bird', life: '1921–2015', p: [
        { w: 'Medical ventilator', en: 'Bird Mark 7 Respirator', y: '1958' },
        { w: 'Mechanical ventilation', en: 'Babybird Infant Ventilator', y: '1970', q: 'Babybird infant ventilator Forrest Bird' },
        { w: 'Intrapulmonary percussive ventilation', en: 'Percussive Ventilation', y: '1979', q: 'intrapulmonary percussive ventilator' }] },
      { w: 'Rune Elmqvist', en: 'Rune Elmqvist', life: '1906–1996', p: [
        { w: 'Inkjet printing', en: 'Mingograph — first inkjet ECG recorder', y: '1948' },
        { w: 'Artificial cardiac pacemaker', en: 'First Fully Implanted Pacemaker', y: '1958' },
        { w: 'Electrocardiography', en: 'Elema-Schönander ECG Instruments', y: '1950' }] },
      { w: 'Leland Clark', en: 'Leland Clark', life: '1918–2005', p: [
        { w: 'Clark electrode', en: 'Clark Oxygen Electrode', y: '1954' },
        { w: 'Biosensor', en: 'Glucose Biosensor', y: '1962' },
        { w: 'Liquid breathing', en: 'Liquid Breathing', y: '1966' }] },
      { w: 'Dean Kamen', en: 'Dean Kamen', life: '1951–', p: [
        { w: 'Insulin pump', en: 'AutoSyringe Insulin Pump', y: '1976' },
        { w: 'Peritoneal dialysis', en: 'Portable Home Dialysis', y: '1993' },
        { w: 'iBOT', en: 'iBOT Wheelchair', y: '1999' }] },
      { w: 'Hugh Herr', en: 'Hugh Herr', life: '1964–', p: [
        { w: 'Biomechatronics', en: 'MIT Biomechatronics Group', y: '2004' },
        { w: 'Prosthesis', en: 'BiOM Powered Ankle', y: '2011', q: 'BiOM powered ankle prosthesis Hugh Herr' },
        { w: 'Powered exoskeleton', en: 'Center for Extreme Bionics', y: '2014' }] }
    ] },

  /* ───────────────────────── AEROSPACE ───────────────────────── */
  { id: 'aero', en: 'Aerospace Engineering', icon: 'aero', color: '#CBD5E1', scene: 'orbit', years: 4, spec: 'Bump cap + ear defenders',
    cover: [P(5229403), P(40024)],
    study: [
      ['Calculus I', 'Physics', 'Engineering Drawing', 'Statics', 'Programming', 'Intro to Aerospace'],
      ['Dynamics', 'Thermodynamics', 'Fluid Mechanics', 'Strength of Materials', 'Aerospace Materials', 'Engineering Mathematics'],
      ['Aerodynamics', 'Aircraft Structures', 'Propulsion', 'Flight Mechanics & Stability', 'Heat Transfer', 'Control Systems'],
      ['Aircraft Design', 'Avionics', 'Orbital Mechanics & Rocketry', 'Computational Fluid Dynamics', 'Aircraft Maintenance (MRO)', 'Graduation Project']
    ],
    br: ['Aerodynamics', 'Propulsion', 'Aerostructures', 'Avionics & Flight Control', 'Astronautics', 'Maintenance (MRO)', 'Unmanned Aerial Vehicles'],
    msc: ['M.Sc. Aerospace Engineering', 'M.Sc. Aerodynamics', 'M.Sc. Propulsion', 'M.Sc. Aerostructures', 'M.Sc. Space Engineering', 'M.Sc. UAV Systems'],
    phd: ['Hypersonics', 'Electric & Hydrogen Aviation', 'Smart Composites', 'Reusable Launch Vehicles', 'Autonomous Drone Swarms', 'Spacecraft Dynamics'],
    sw: ['catia', 'fluent', 'matlab', 'nastran', 'xflr5', 'openvsp', 'stk', 'nx', 'openfoam', 'solidworks'],
    ppe: ['bumpcap', 'ear', 'vest', 'glasses', 'boots', 'gloves', 'harness'],
    eng: [
      { w: 'Wright brothers', en: 'Wright Brothers', life: '1867–1948', p: [
        { w: 'Wright Flyer', en: 'Wright Flyer', y: '1903' },
        { w: 'Wright Flyer III', en: 'Wright Flyer III', y: '1905' },
        { w: 'Wright Model B', en: 'Wright Model B', y: '1910' }] },
      { w: 'Sergei Korolev', en: 'Sergei Korolev', life: '1907–1966', p: [
        { w: 'R-7 Semyorka', en: 'R-7 Rocket', y: '1957' },
        { w: 'Sputnik 1', en: 'Sputnik 1', y: '1957' },
        { w: 'Vostok 1', en: 'Vostok 1', y: '1961' }] },
      { w: 'Wernher von Braun', en: 'Wernher von Braun', life: '1912–1977', p: [
        { w: 'Explorer 1', en: 'Explorer 1', y: '1958' },
        { w: 'Mercury-Redstone Launch Vehicle', en: 'Mercury-Redstone', y: '1961' },
        { w: 'Saturn V', en: 'Saturn V', y: '1967' }] },
      { w: 'Kelly Johnson (engineer)', en: 'Kelly Johnson', life: '1910–1990', p: [
        { w: 'Lockheed P-38 Lightning', en: 'P-38 Lightning', y: '1939' },
        { w: 'Lockheed U-2', en: 'U-2', y: '1955' },
        { w: 'Lockheed SR-71 Blackbird', en: 'SR-71 Blackbird', y: '1964' }] },
      { w: 'Frank Whittle', en: 'Frank Whittle', life: '1907–1996', p: [
        { w: 'Power Jets WU', en: 'Power Jets WU Turbojet', y: '1937', q: 'Whittle Power Jets WU turbojet engine 1937' },
        { w: 'Gloster E.28/39', en: 'Gloster E.28/39', y: '1941' },
        { w: 'Gloster Meteor', en: 'Gloster Meteor', y: '1944' }] },
      { w: 'Igor Sikorsky', en: 'Igor Sikorsky', life: '1889–1972', p: [
        { w: 'Sikorsky Ilya Muromets', en: 'Ilya Muromets', y: '1913' },
        { w: 'Vought-Sikorsky VS-300', en: 'VS-300 Helicopter', y: '1939' },
        { w: 'Sikorsky R-4', en: 'Sikorsky R-4', y: '1942' }] },
      { w: 'Andrei Tupolev', en: 'Andrei Tupolev', life: '1888–1972', p: [
        { w: 'Tupolev ANT-20', en: 'ANT-20 Maxim Gorky', y: '1934' },
        { w: 'Tupolev Tu-104', en: 'Tu-104 Jetliner', y: '1956' },
        { w: 'Tupolev Tu-144', en: 'Tu-144 Supersonic Airliner', y: '1968' }] },
      { w: 'Hugo Junkers', en: 'Hugo Junkers', life: '1859–1935', p: [
        { w: 'Junkers J 1', en: 'Junkers J 1', y: '1915' },
        { w: 'Junkers F 13', en: 'Junkers F 13', y: '1919' },
        { w: 'Junkers Ju 52', en: 'Junkers Ju 52', y: '1930' }] },
      { w: 'Robert H. Goddard', en: 'Robert H. Goddard', life: '1882–1945', p: [
        { w: 'Multistage rocket', en: 'Multi-Stage Rocket Patent', y: '1914' },
        { w: 'Liquid-propellant rocket', en: 'First Liquid-Fueled Rocket', y: '1926' },
        { w: 'Goddard Space Flight Center', en: 'Goddard Space Flight Center', y: '1959' }] },
      { w: 'Burt Rutan', en: 'Burt Rutan', life: '1943–', p: [
        { w: 'Rutan VariEze', en: 'Rutan VariEze', y: '1975' },
        { w: 'Rutan Voyager', en: 'Voyager — nonstop around the world', y: '1986' },
        { w: 'SpaceShipOne', en: 'SpaceShipOne', y: '2004' }] }
    ] },

  /* ───────────────────────── INDUSTRIAL ───────────────────────── */
  { id: 'industrial', en: 'Industrial Engineering', icon: 'industrial', color: '#C08457', scene: 'conveyor', years: 4, spec: 'Type II · Class G',
    cover: [P(18471441), P(16544056)],
    study: [
      ['Calculus I', 'Physics', 'Engineering Drawing', 'Workshop Practice', 'Programming', 'Intro to Industrial Engineering'],
      ['Probability & Statistics', 'Manufacturing Processes', 'Engineering Economy', 'Operations Research I', 'Work Study', 'Ergonomics'],
      ['Operations Research II', 'Statistical Quality Control', 'Production Planning & Control', 'Simulation', 'Supply Chain Management', 'Facility Layout'],
      ['Lean & Six Sigma', 'Project Management', 'Information Systems (ERP)', 'Occupational Safety', 'Automation', 'Graduation Project']
    ],
    br: ['Operations Research', 'Quality & Six Sigma', 'Supply Chain & Logistics', 'Ergonomics & Human Factors', 'Lean Manufacturing', 'Engineering Management', 'Data Analytics'],
    msc: ['M.Sc. Industrial Engineering', 'M.Sc. Operations Research', 'M.Sc. Supply Chain Management', 'M.Sc. Engineering Management', 'M.Sc. Quality Management', 'M.Sc. Systems Engineering'],
    phd: ['Mathematical Optimization', 'Industry 4.0 & Smart Factories', 'Sustainable Supply Chains', 'Healthcare Systems', 'Human Factors & Safety', 'AI for Decision Making'],
    sw: ['minitab', 'arena', 'anylogic', 'flexsim', 'excel', 'gurobi', 'sap', 'msproject', 'powerbi', 'python'],
    ppe: ['helmet', 'boots', 'ear', 'glasses', 'gloves', 'vest'],
    eng: [
      { w: 'Frederick Winslow Taylor', en: 'Frederick W. Taylor', life: '1856–1915', p: [
        { w: 'Bethlehem Steel', en: 'Bethlehem Steel Studies', y: '1898' },
        { w: 'High-speed steel', en: 'High-Speed Steel', y: '1900' },
        { w: 'The Principles of Scientific Management', en: 'The Principles of Scientific Management', y: '1911' }] },
      { w: 'Lillian Moller Gilbreth', en: 'Lillian Gilbreth', life: '1878–1972', p: [
        { w: 'Therblig', en: 'Motion Study & Therbligs', y: '1915' },
        { w: 'Waste container', en: 'Foot-Pedal Trash Can', y: '1920s', q: 'pedal bin trash can foot pedal' },
        { w: 'Ergonomics', en: 'Kitchen Practical', y: '1929' }] },
      { w: 'Taiichi Ohno', en: 'Taiichi Ohno', life: '1912–1990', p: [
        { w: 'Toyota Production System', en: 'Toyota Production System', y: '1950s' },
        { w: 'Kanban', en: 'Kanban', y: '1953' },
        { w: 'Just-in-time manufacturing', en: 'Just-in-Time', y: '1970s' }] },
      { w: 'W. Edwards Deming', en: 'W. Edwards Deming', life: '1900–1993', p: [
        { w: 'PDCA', en: 'PDCA Cycle', y: '1950' },
        { w: 'Deming Prize', en: 'Deming Prize', y: '1951' },
        { w: 'Total quality management', en: 'Total Quality Management', y: '1982' }] },
      { w: 'Henry Gantt', en: 'Henry Gantt', life: '1861–1919', p: [
        { w: 'Scientific management', en: 'Task and Bonus System', y: '1901' },
        { w: 'Gantt chart', en: 'Gantt Chart', y: '1910s' },
        { w: 'Frankford Arsenal', en: 'WWI Production Scheduling', y: '1917' }] },
      { w: 'Walter A. Shewhart', en: 'Walter A. Shewhart', life: '1891–1967', p: [
        { w: 'Control chart', en: 'Control Chart', y: '1924' },
        { w: 'Statistical process control', en: 'Economic Control of Quality', y: '1931' },
        { w: 'Western Electric', en: 'Quality at Bell Labs & Western Electric', y: '1939' }] },
      { w: 'Joseph M. Juran', en: 'Joseph M. Juran', life: '1904–2008', p: [
        { w: 'Pareto principle', en: 'Pareto Principle in Quality', y: '1941' },
        { w: 'Quality control', en: 'Quality Control Handbook', y: '1951', q: 'Juran Quality Control Handbook' },
        { w: 'Quality management', en: 'Juran Trilogy', y: '1986' }] },
      { w: 'George Dantzig', en: 'George Dantzig', life: '1914–2005', p: [
        { w: 'Simplex algorithm', en: 'Simplex Algorithm', y: '1947' },
        { w: 'Linear programming', en: 'Linear Programming', y: '1947' },
        { w: 'Stochastic programming', en: 'Stochastic Programming', y: '1955' }] },
      { w: 'Shigeo Shingo', en: 'Shigeo Shingo', life: '1909–1990', p: [
        { w: 'Single-minute exchange of die', en: 'SMED', y: '1950s' },
        { w: 'Poka-yoke', en: 'Poka-Yoke', y: '1960s' },
        { w: 'Zero Defects', en: 'Zero Quality Control', y: '1986', q: 'Shingo zero quality control source inspection poka-yoke' }] },
      { w: 'Kaoru Ishikawa', en: 'Kaoru Ishikawa', life: '1915–1989', p: [
        { w: 'Quality circle', en: 'Quality Circles', y: '1962' },
        { w: 'Ishikawa diagram', en: 'Fishbone (Ishikawa) Diagram', y: '1968' },
        { w: 'Seven basic tools of quality', en: 'Seven Basic Quality Tools', y: '1968' }] }
    ] },

  /* ───────────────────────── SURVEYING ───────────────────────── */
  { id: 'survey', en: 'Surveying & Geomatics Engineering', icon: 'survey', color: '#BEF264', scene: 'contour', years: 4, spec: 'Type I · Class G',
    cover: [P(6280895)],
    study: [
      ['Calculus I', 'Physics', 'Plane Surveying I', 'Engineering Drawing', 'Programming', 'Geology'],
      ['Surveying II (Traverse & Levelling)', 'Adjustment Computations', 'Cartography', 'Photogrammetry I', 'Statistics', 'Engineering Mathematics'],
      ['Geodesy', 'Satellite Positioning (GNSS)', 'Remote Sensing', 'GIS', 'Route Surveying', 'Photogrammetry II'],
      ['Cadastral Surveying', 'Laser Scanning & LiDAR', 'UAV Mapping', 'Hydrographic Surveying', 'Spatial Databases', 'Graduation Project']
    ],
    br: ['Engineering Surveying', 'Geodesy & GNSS', 'GIS', 'Remote Sensing', 'Photogrammetry & LiDAR', 'Cadastre', 'Hydrographic Surveying'],
    msc: ['M.Sc. Geomatics', 'M.Sc. GIS & Remote Sensing', 'M.Sc. Geodesy', 'M.Sc. Photogrammetry', 'M.Sc. Land Administration', 'M.Sc. Engineering Surveying'],
    phd: ['Precise GNSS & PPP', 'GeoAI', 'Urban Digital Twins', 'InSAR Deformation Monitoring', 'Point Cloud Processing', 'Earth Observation & Climate'],
    sw: ['civil3d', 'arcgis', 'qgis', 'tbc', 'leica', 'metashape', 'pix4d', 'envi', 'globalmapper', 'gee'],
    ppe: ['helmet', 'vest', 'boots', 'glasses', 'gloves'],
    eng: [
      { w: 'George Everest', en: 'George Everest', life: '1790–1866', p: [
        { w: 'Great Trigonometrical Survey', en: 'Great Trigonometrical Survey', y: '1830' },
        { w: 'Earth ellipsoid', en: 'Everest Ellipsoid', y: '1830' },
        { w: 'Meridian arc', en: 'Great Arc of India', y: '1841', q: 'Great Arc India meridian survey Everest' }] },
      { w: 'Carl Friedrich Gauss', en: 'Carl Friedrich Gauss', life: '1777–1855', p: [
        { w: 'Least squares', en: 'Method of Least Squares', y: '1809' },
        { w: 'Heliotrope (instrument)', en: 'Heliotrope', y: '1821' },
        { w: 'Transverse Mercator projection', en: 'Gauss–Krüger Projection', y: '1825' }] },
      { w: 'Bradford Parkinson', en: 'Bradford Parkinson', life: '1935–', p: [
        { w: 'Global Positioning System', en: 'GPS', y: '1978' },
        { w: 'Precision agriculture', en: 'GPS-Guided Tractor', y: '1990s' },
        { w: 'Gravity Probe B', en: 'Gravity Probe B', y: '2004' }] },
      { w: 'Gladys West', en: 'Gladys West', life: '1930–', p: [
        { w: 'Seasat', en: 'Seasat', y: '1978' },
        { w: 'Geosat', en: 'GEOSAT', y: '1985' },
        { w: 'Geoid', en: 'Precise Geoid Model', y: '1986' }] },
      { w: 'Roger Tomlinson', en: 'Roger Tomlinson', life: '1933–2014', p: [
        { w: 'Canada Land Inventory', en: 'Canada Land Inventory', y: '1960s' },
        { w: 'Canada Geographic Information System', en: 'First GIS (CGIS)', y: '1963' },
        { w: 'Geographic information system', en: 'GIS as a Discipline', y: '1968' }] },
      { w: 'Al-Biruni', en: 'Al-Biruni', life: '973–1050', p: [
        { w: 'Earth radius', en: 'Measuring the Earth’s Radius', y: '1025' },
        { w: 'Geodesy', en: 'Determination of Coordinates of Places', y: '1025' },
        { w: 'Astrolabe', en: 'Astronomical Instruments & Masudic Canon', y: '1030' }] },
      { w: 'Friedrich Georg Wilhelm von Struve', en: 'F. G. W. von Struve', life: '1793–1864', p: [
        { w: 'Tartu Old Observatory', en: 'Tartu Observatory', y: '1820' },
        { w: 'Pulkovo Observatory', en: 'Pulkovo Observatory', y: '1839' },
        { w: 'Struve Geodetic Arc', en: 'Struve Geodetic Arc (UNESCO)', y: '1855' }] },
      { w: 'William Roy', en: 'William Roy', life: '1726–1790', p: [
        { w: "Roy's Military Survey of Scotland", en: 'Military Survey of Scotland', y: '1755', q: 'Roy Military Survey of Scotland map' },
        { w: 'Anglo-French Survey (1784–1790)', en: 'Anglo-French Survey', y: '1790' },
        { w: 'Ordnance Survey', en: 'Ordnance Survey', y: '1791' }] },
      { w: 'Heinrich Wild', en: 'Heinrich Wild', life: '1877–1951', p: [
        { w: 'Carl Zeiss AG', en: 'Zeiss Geodetic Instruments', y: '1908' },
        { w: 'Wild Heerbrugg', en: 'Wild Heerbrugg', y: '1921' },
        { w: 'Theodolite', en: 'Wild T2 Theodolite', y: '1923' }] },
      { w: 'Jack Dangermond', en: 'Jack Dangermond', life: '1945–', p: [
        { w: 'Esri', en: 'Esri', y: '1969' },
        { w: 'ArcGIS', en: 'ArcGIS', y: '1999' },
        { w: 'ArcGIS Online', en: 'ArcGIS Online & Living Atlas', y: '2012', q: 'ArcGIS Online Living Atlas' }] }
    ] }
  ];

  /* Software registry: name, maker, first release, logo slug (Simple Icons), Wikipedia title, website */
  var sw = {
    autocad: { name: 'AutoCAD', by: 'Autodesk', y: 1982, si: 'autocad', w: 'AutoCAD', url: 'https://www.autodesk.com/products/autocad' },
    revit: { name: 'Revit', by: 'Autodesk', y: 2000, si: 'autodeskrevit', w: 'Autodesk Revit', url: 'https://www.autodesk.com/products/revit' },
    etabs: { name: 'ETABS', by: 'CSI', y: 1975, w: 'ETABS', url: 'https://www.csiamerica.com/products/etabs' },
    sap2000: { name: 'SAP2000', by: 'CSI', y: 1975, w: 'SAP2000', url: 'https://www.csiamerica.com/products/sap2000' },
    safe: { name: 'SAFE', by: 'CSI', y: 1980, w: 'Computers and Structures', url: 'https://www.csiamerica.com/products/safe' },
    staad: { name: 'STAAD.Pro', by: 'Bentley Systems', y: 1997, w: 'STAAD', url: 'https://www.bentley.com/software/staad/' },
    civil3d: { name: 'Civil 3D', by: 'Autodesk', y: 2004, si: 'autodesk', w: 'AutoCAD Civil 3D', url: 'https://www.autodesk.com/products/civil-3d' },
    plaxis: { name: 'PLAXIS', by: 'Bentley Systems', y: 1987, w: 'Plaxis', url: 'https://www.bentley.com/software/plaxis-2d/' },
    primavera: { name: 'Primavera P6', by: 'Oracle', y: 1983, si: 'oracle', w: 'Primavera (software)', url: 'https://www.oracle.com/construction-engineering/primavera-p6/' },
    tekla: { name: 'Tekla Structures', by: 'Trimble', y: 1993, si: 'trimble', w: 'Tekla Structures', url: 'https://www.tekla.com/products/tekla-structures' },
    archicad: { name: 'ArchiCAD', by: 'Graphisoft', y: 1987, w: 'ArchiCAD', url: 'https://graphisoft.com/solutions/archicad' },
    sketchup: { name: 'SketchUp', by: 'Trimble', y: 2000, si: 'sketchup', w: 'SketchUp', url: 'https://www.sketchup.com' },
    rhino: { name: 'Rhino + Grasshopper', by: 'Robert McNeel & Associates', y: 1998, si: 'rhinoceros', w: 'Rhinoceros 3D', url: 'https://www.rhino3d.com' },
    '3dsmax': { name: '3ds Max', by: 'Autodesk', y: 1996, si: 'autodesk', w: 'Autodesk 3ds Max', url: 'https://www.autodesk.com/products/3ds-max' },
    lumion: { name: 'Lumion', by: 'Act-3D', y: 2010, w: 'Lumion (software)', url: 'https://lumion.com' },
    vray: { name: 'V-Ray / Enscape', by: 'Chaos', y: 1997, w: 'V-Ray', url: 'https://www.chaos.com/vray' },
    photoshop: { name: 'Photoshop', by: 'Adobe', y: 1990, si: 'adobephotoshop', w: 'Adobe Photoshop', url: 'https://www.adobe.com/products/photoshop.html' },
    indesign: { name: 'InDesign', by: 'Adobe', y: 1999, si: 'adobeindesign', w: 'Adobe InDesign', url: 'https://www.adobe.com/products/indesign.html' },
    solidworks: { name: 'SolidWorks', by: 'Dassault Systèmes', y: 1995, si: 'dassaultsystemes', w: 'SolidWorks', url: 'https://www.solidworks.com' },
    catia: { name: 'CATIA', by: 'Dassault Systèmes', y: 1977, si: 'dassaultsystemes', w: 'CATIA', url: 'https://www.3ds.com/products/catia' },
    ansys: { name: 'ANSYS', by: 'Ansys', y: 1970, si: 'ansys', w: 'Ansys', url: 'https://www.ansys.com' },
    inventor: { name: 'Inventor', by: 'Autodesk', y: 1999, si: 'autodesk', w: 'Autodesk Inventor', url: 'https://www.autodesk.com/products/inventor' },
    fusion360: { name: 'Fusion 360', by: 'Autodesk', y: 2013, si: 'autodesk', w: 'Fusion 360', url: 'https://www.autodesk.com/products/fusion-360' },
    matlab: { name: 'MATLAB / Simulink', by: 'MathWorks', y: 1984, si: 'mathworks', w: 'MATLAB', url: 'https://www.mathworks.com' },
    nx: { name: 'Siemens NX', by: 'Siemens', y: 2002, si: 'siemens', w: 'Siemens NX', url: 'https://plm.sw.siemens.com/en-US/nx/' },
    comsol: { name: 'COMSOL', by: 'COMSOL', y: 1998, w: 'COMSOL Multiphysics', url: 'https://www.comsol.com' },
    hap: { name: 'HAP', by: 'Carrier', y: 1990, w: 'Carrier Global', url: 'https://www.carrier.com/commercial/en/us/software/hvac-system-design/hourly-analysis-program/' },
    etap: { name: 'ETAP', by: 'ETAP / Operation Technology', y: 1986, w: 'ETAP (software)', url: 'https://etap.com' },
    powerfactory: { name: 'PowerFactory', by: 'DIgSILENT', y: 1993, w: 'DIgSILENT', url: 'https://www.digsilent.de/en/powerfactory.html' },
    psse: { name: 'PSS®E', by: 'Siemens', y: 1976, si: 'siemens', w: 'PSS/E', url: 'https://www.siemens.com/pss-e' },
    acadelec: { name: 'AutoCAD Electrical', by: 'Autodesk', y: 2003, si: 'autodesk', w: 'AutoCAD', url: 'https://www.autodesk.com/products/autocad/included-toolsets/autocad-electrical' },
    dialux: { name: 'DIALux', by: 'DIAL GmbH', y: 1994, w: 'DIALux', url: 'https://www.dialux.com' },
    ltspice: { name: 'LTspice', by: 'Analog Devices', y: 1999, si: 'analogdevices', w: 'LTspice', url: 'https://www.analog.com/ltspice' },
    proteus: { name: 'Proteus', by: 'Labcenter Electronics', y: 1988, w: 'Proteus Design Suite', url: 'https://www.labcenter.com' },
    tiaportal: { name: 'TIA Portal', by: 'Siemens', y: 2010, si: 'siemens', w: 'Totally Integrated Automation Portal', url: 'https://www.siemens.com/tia-portal' },
    pvsyst: { name: 'PVsyst', by: 'PVsyst SA', y: 1992, w: 'Photovoltaic system', url: 'https://www.pvsyst.com' },
    vscode: { name: 'VS Code', by: 'Microsoft', y: 2015, si: 'visualstudiocode', w: 'Visual Studio Code', url: 'https://code.visualstudio.com' },
    python: { name: 'Python', by: 'Python Software Foundation', y: 1991, si: 'python', w: 'Python (programming language)', url: 'https://www.python.org' },
    vivado: { name: 'Vivado', by: 'AMD Xilinx', y: 2012, si: 'xilinx', w: 'Vivado', url: 'https://www.amd.com/en/products/software/adaptive-socs-and-fpgas/vivado.html' },
    packettracer: { name: 'Cisco Packet Tracer', by: 'Cisco', y: 2003, si: 'cisco', w: 'Packet Tracer', url: 'https://www.netacad.com/cisco-packet-tracer' },
    wireshark: { name: 'Wireshark', by: 'Wireshark Foundation', y: 1998, si: 'wireshark', w: 'Wireshark', url: 'https://www.wireshark.org' },
    linux: { name: 'Linux', by: 'Linux Foundation & community', y: 1991, si: 'linux', w: 'Linux', url: 'https://www.kernel.org' },
    arduino: { name: 'Arduino', by: 'Arduino', y: 2005, si: 'arduino', w: 'Arduino', url: 'https://www.arduino.cc' },
    git: { name: 'Git / GitHub', by: 'Linus Torvalds & community', y: 2005, si: 'git', w: 'Git', url: 'https://git-scm.com' },
    docker: { name: 'Docker / Kubernetes', by: 'Docker Inc. / CNCF', y: 2013, si: 'docker', w: 'Docker (software)', url: 'https://www.docker.com' },
    jetbrains: { name: 'JetBrains IDEs', by: 'JetBrains', y: 2001, si: 'jetbrains', w: 'JetBrains', url: 'https://www.jetbrains.com' },
    androidstudio: { name: 'Android Studio', by: 'Google', y: 2013, si: 'androidstudio', w: 'Android Studio', url: 'https://developer.android.com/studio' },
    figma: { name: 'Figma', by: 'Figma', y: 2016, si: 'figma', w: 'Figma', url: 'https://www.figma.com' },
    postman: { name: 'Postman', by: 'Postman', y: 2012, si: 'postman', w: 'Postman (software)', url: 'https://www.postman.com' },
    jira: { name: 'Jira', by: 'Atlassian', y: 2002, si: 'jira', w: 'Jira (software)', url: 'https://www.atlassian.com/software/jira' },
    postgresql: { name: 'PostgreSQL', by: 'PostgreSQL Global Development Group', y: 1996, si: 'postgresql', w: 'PostgreSQL', url: 'https://www.postgresql.org' },
    simulink: { name: 'Simulink', by: 'MathWorks', y: 1990, si: 'mathworks', w: 'Simulink', url: 'https://www.mathworks.com/products/simulink.html' },
    cst: { name: 'CST Studio Suite', by: 'Dassault Systèmes', y: 1992, si: 'dassaultsystemes', w: 'CST Studio Suite', url: 'https://www.3ds.com/products/simulia/cst-studio-suite' },
    hfss: { name: 'Ansys HFSS', by: 'Ansys', y: 1990, si: 'ansys', w: 'HFSS', url: 'https://www.ansys.com/products/electronics/ansys-hfss' },
    atoll: { name: 'Atoll', by: 'Forsk', y: 1997, w: 'Radio planning', url: 'https://www.forsk.com/atoll-overview' },
    gns3: { name: 'GNS3', by: 'GNS3 community', y: 2008, w: 'Graphical Network Simulator-3', url: 'https://www.gns3.com' },
    gnuradio: { name: 'GNU Radio', by: 'GNU Radio project', y: 2001, si: 'gnu', w: 'GNU Radio', url: 'https://www.gnuradio.org' },
    optisystem: { name: 'OptiSystem', by: 'Optiwave', y: 2002, w: 'Fiber-optic communication', url: 'https://optiwave.com/optisystem-overview/' },
    hysys: { name: 'Aspen HYSYS', by: 'AspenTech', y: 1996, w: 'Aspen HYSYS', url: 'https://www.aspentech.com/en/products/engineering/aspen-hysys' },
    aspenplus: { name: 'Aspen Plus', by: 'AspenTech', y: 1981, w: 'Aspen Technology', url: 'https://www.aspentech.com/en/products/engineering/aspen-plus' },
    chemcad: { name: 'CHEMCAD', by: 'Chemstations', y: 1985, w: 'Chemstations', url: 'https://www.chemstations.com' },
    dwsim: { name: 'DWSIM', by: 'Open source (Daniel Medeiros)', y: 2006, w: 'DWSIM', url: 'https://dwsim.org' },
    fluent: { name: 'Ansys Fluent', by: 'Ansys', y: 1983, si: 'ansys', w: 'Ansys Fluent', url: 'https://www.ansys.com/products/fluids/ansys-fluent' },
    plant3d: { name: 'AutoCAD Plant 3D', by: 'Autodesk', y: 2008, si: 'autodesk', w: 'AutoCAD', url: 'https://www.autodesk.com/products/autocad/included-toolsets/autocad-plant-3d' },
    pro2: { name: 'PRO/II', by: 'AVEVA', y: 1967, w: 'Process simulation', url: 'https://www.aveva.com/en/products/pro-ii-simulation/' },
    excel: { name: 'Excel', by: 'Microsoft', y: 1985, si: 'microsoftexcel', w: 'Microsoft Excel', url: 'https://www.microsoft.com/microsoft-365/excel' },
    petrel: { name: 'Petrel', by: 'SLB', y: 1996, w: 'Petrel (reservoir software)', url: 'https://www.software.slb.com/products/petrel' },
    eclipse: { name: 'ECLIPSE', by: 'SLB', y: 1983, w: 'Reservoir simulation', url: 'https://www.software.slb.com/products/eclipse' },
    cmg: { name: 'CMG Suite', by: 'Computer Modelling Group', y: 1978, w: 'Computer Modelling Group', url: 'https://www.cmgl.ca' },
    pipesim: { name: 'PIPESIM', by: 'SLB', y: 1985, w: 'Pipeline transport', url: 'https://www.software.slb.com/products/pipesim' },
    olga: { name: 'OLGA', by: 'SLB', y: 1983, w: 'Multiphase flow', url: 'https://www.software.slb.com/products/olga' },
    techlog: { name: 'Techlog', by: 'SLB', y: 2000, w: 'Well logging', url: 'https://www.software.slb.com/products/techlog' },
    kappa: { name: 'KAPPA Saphir', by: 'KAPPA Engineering', y: 1987, w: 'Well test', url: 'https://www.kappaeng.com' },
    landmark: { name: 'Landmark (DecisionSpace)', by: 'Halliburton', y: 1982, w: 'Landmark Graphics Corporation', url: 'https://www.landmark.solutions' },
    prosper: { name: 'Prosper / MBAL', by: 'Petroleum Experts', y: 1990, w: 'Production engineering', url: 'https://www.petex.com' },
    ip: { name: 'Interactive Petrophysics', by: 'Lloyd’s Register / S&P', y: 1998, w: 'Petrophysics', url: 'https://www.spglobal.com/commodityinsights/en/products-solutions/upstream-software/interactive-petrophysics' },
    hecras: { name: 'HEC-RAS', by: 'US Army Corps of Engineers', y: 1995, w: 'HEC-RAS', url: 'https://www.hec.usace.army.mil/software/hec-ras/' },
    hechms: { name: 'HEC-HMS', by: 'US Army Corps of Engineers', y: 1998, w: 'HEC-HMS', url: 'https://www.hec.usace.army.mil/software/hec-hms/' },
    arcgis: { name: 'ArcGIS Pro', by: 'Esri', y: 1999, si: 'arcgis', w: 'ArcGIS', url: 'https://www.esri.com/arcgis' },
    qgis: { name: 'QGIS', by: 'QGIS community', y: 2002, si: 'qgis', w: 'QGIS', url: 'https://qgis.org' },
    watergems: { name: 'WaterGEMS', by: 'Bentley Systems', y: 2000, w: 'Water supply network', url: 'https://www.bentley.com/software/openflows-watergems/' },
    epanet: { name: 'EPANET', by: 'US EPA', y: 1993, w: 'EPANET', url: 'https://www.epa.gov/water-research/epanet' },
    sewergems: { name: 'SewerGEMS', by: 'Bentley Systems', y: 2005, w: 'Sanitary sewer', url: 'https://www.bentley.com/software/openflows-sewergems/' },
    modflow: { name: 'MODFLOW', by: 'USGS', y: 1984, w: 'MODFLOW', url: 'https://www.usgs.gov/mission-areas/water-resources/science/modflow-and-related-programs' },
    swmm: { name: 'SWMM', by: 'US EPA', y: 1971, w: 'Storm Water Management Model', url: 'https://www.epa.gov/water-research/storm-water-management-model-swmm' },
    cropwat: { name: 'CROPWAT', by: 'FAO', y: 1992, w: 'Irrigation scheduling', url: 'https://www.fao.org/land-water/databases-and-software/cropwat/en/' },
    labview: { name: 'LabVIEW', by: 'NI (Emerson)', y: 1986, w: 'LabVIEW', url: 'https://www.ni.com/labview' },
    slicer: { name: '3D Slicer', by: 'Open source (Harvard / Brigham)', y: 1998, w: '3D Slicer', url: 'https://www.slicer.org' },
    opensim: { name: 'OpenSim', by: 'Stanford University', y: 2007, w: 'OpenSim (simulation toolkit)', url: 'https://simtk.org/projects/opensim' },
    imagej: { name: 'ImageJ / Fiji', by: 'NIH (Wayne Rasband)', y: 1997, si: 'imagej', w: 'ImageJ', url: 'https://imagej.net' },
    nastran: { name: 'NASTRAN', by: 'NASA / MSC Software', y: 1968, si: 'nasa', w: 'Nastran', url: 'https://hexagon.com/products/msc-nastran' },
    xflr5: { name: 'XFLR5', by: 'André Deperrois (open source)', y: 2003, w: 'XFLR5', url: 'http://www.xflr5.tech' },
    openvsp: { name: 'OpenVSP', by: 'NASA', y: 2012, si: 'nasa', w: 'OpenVSP', url: 'https://openvsp.org' },
    stk: { name: 'STK (Systems Tool Kit)', by: 'AGI / Ansys', y: 1989, si: 'ansys', w: 'Systems Tool Kit', url: 'https://www.ansys.com/products/missions/ansys-stk' },
    openfoam: { name: 'OpenFOAM', by: 'OpenCFD / community', y: 2004, w: 'OpenFOAM', url: 'https://www.openfoam.com' },
    minitab: { name: 'Minitab', by: 'Minitab LLC', y: 1972, w: 'Minitab', url: 'https://www.minitab.com' },
    arena: { name: 'Arena Simulation', by: 'Rockwell Automation', y: 1993, w: 'Arena (software)', url: 'https://www.rockwellautomation.com/en-us/products/software/arena-simulation.html' },
    anylogic: { name: 'AnyLogic', by: 'The AnyLogic Company', y: 2000, w: 'AnyLogic', url: 'https://www.anylogic.com' },
    flexsim: { name: 'FlexSim', by: 'FlexSim Software Products', y: 2003, w: 'FlexSim', url: 'https://www.flexsim.com' },
    gurobi: { name: 'Gurobi', by: 'Gurobi Optimization', y: 2009, w: 'Gurobi Optimizer', url: 'https://www.gurobi.com' },
    sap: { name: 'SAP ERP', by: 'SAP SE', y: 1973, si: 'sap', w: 'SAP ERP', url: 'https://www.sap.com' },
    msproject: { name: 'MS Project', by: 'Microsoft', y: 1984, w: 'Microsoft Project', url: 'https://www.microsoft.com/microsoft-365/project/project-management-software' },
    powerbi: { name: 'Power BI', by: 'Microsoft', y: 2015, si: 'powerbi', w: 'Microsoft Power BI', url: 'https://powerbi.microsoft.com' },
    tbc: { name: 'Trimble Business Center', by: 'Trimble', y: 2005, si: 'trimble', w: 'Trimble Inc.', url: 'https://geospatial.trimble.com/products/software/trimble-business-center' },
    leica: { name: 'Leica Infinity', by: 'Leica Geosystems (Hexagon)', y: 2014, w: 'Leica Geosystems', url: 'https://leica-geosystems.com/products/gnss-systems/software/leica-infinity' },
    metashape: { name: 'Agisoft Metashape', by: 'Agisoft', y: 2010, w: 'Agisoft Metashape', url: 'https://www.agisoft.com' },
    pix4d: { name: 'Pix4D', by: 'Pix4D SA', y: 2011, w: 'Pix4D', url: 'https://www.pix4d.com' },
    envi: { name: 'ENVI / ERDAS', by: 'NV5 / Hexagon', y: 1994, w: 'ENVI', url: 'https://www.nv5geospatialsoftware.com/Products/ENVI' },
    globalmapper: { name: 'Global Mapper', by: 'Blue Marble Geographics', y: 2001, w: 'Global Mapper', url: 'https://www.bluemarblegeo.com/global-mapper/' },
    gee: { name: 'Google Earth Engine', by: 'Google', y: 2010, si: 'googleearthengine', w: 'Google Earth Engine', url: 'https://earthengine.google.com' }
  };

  var helmetCodes = ['#F4F2EC', '#FACC15', '#FB923C', '#3B82F6', '#22C55E', '#EF4444', '#A0673A', '#9CA3AF', '#F472B6', '#1F2937'];
  var ppeKeys = ['helmet', 'vest', 'boots', 'gloves', 'insgloves', 'glasses', 'goggles', 'faceshield', 'ear', 'mask', 'harness', 'fr', 'labcoat', 'gas', 'rf', 'esd', 'lifejacket', 'welding', 'dosimeter', 'bumpcap', 'ergo'];

  function pexels(id, w) {
    return 'https://images.pexels.com/photos/' + id + '/pexels-photo-' + id + '.jpeg?auto=compress&cs=tinysrgb&w=' + (w || 1600);
  }

  /* Quiz scoring — answer texts live in the language files (same order) */
  var quiz = [
    [{ civil: 3, arch: 2, water: 2 }, { mech: 3, aero: 2, industrial: 1 }, { elec: 3, comm: 2, computer: 2, biomed: 1 }, { software: 3, computer: 2 }, { chem: 3, petro: 2, biomed: 1 }],
    [{ civil: 2, petro: 3, survey: 3, water: 2 }, { mech: 2, industrial: 3, chem: 2 }, { software: 3, computer: 2, arch: 2 }, { biomed: 3, chem: 2 }],
    [{ civil: 2, mech: 2, elec: 2, aero: 3 }, { chem: 3, biomed: 3, petro: 1 }, { arch: 4 }, { survey: 4, water: 2 }, { software: 2, computer: 2, comm: 2, industrial: 1 }],
    [{ civil: 3, arch: 3 }, { aero: 4, mech: 1 }, { computer: 2, comm: 3, software: 2 }, { water: 4, civil: 1 }, { petro: 4, chem: 1 }, { biomed: 4 }],
    [{ industrial: 4 }, { arch: 2, mech: 2, aero: 1 }, { civil: 2, elec: 2, survey: 2 }, { software: 3, computer: 2 }],
    [{ survey: 3, petro: 3, civil: 2, water: 2, comm: 1 }, { mech: 2, elec: 2, arch: 2, chem: 1, industrial: 1 }, { software: 3, computer: 2, biomed: 2, chem: 1 }]
  ];

  /* Kurdish engineers on the Stanford University / Elsevier list of the world's top 2% scientists.
     Texts (titles, schools, highlights) live in assets/data/<lang>/home.js */
  var kurds = [
    { id: 'ahmed', en: 'Prof. Dr. Ahmed Salih Mohammed', img: 'assets/img/kurds/ahmed-mohammed.jpg', papers: 300, cites: 14669, books: 2, top: [2021, 2022, 2023, 2024, 2025], scholar: 'aU-9E8gAAAAJ', feat: true },
    { id: 'rabar', en: 'Asst. Prof. Dr. Rabar H. Faraj', img: 'assets/img/kurds/rabar-faraj.jpg', papers: 68, cites: 5253, top: [2024], scholar: 'wDDKJwUAAAAJ' },
    { id: 'rawaz', en: 'Asst. Prof. Dr. Rawaz Kurda', img: 'assets/img/kurds/rawaz-kurda.jpg', papers: 96, cites: 7180, top: [2024], scholar: 'KesSqb4AAAAJ' },
    { id: 'hemn', en: 'Asst. Prof. Dr. Hemn Unis Ahmed', img: 'assets/img/kurds/hemn-ahmed.jpg', papers: 70, cites: 6151, top: [2024], scholar: 'u9bRu-8AAAAJ' },
    { id: 'sarmad', en: 'Sarmad Dashti Latif', img: 'assets/img/kurds/sarmad-latif.jpg', papers: 57, cites: 1907, books: 2, top: [2025], scholar: 'rrjrWM4AAAAJ' }
  ];

  return {
    quiz: quiz, kurds: kurds,
    langs: [
      { id: 'ku', label: 'کوردی', short: 'KU', dir: 'rtl' },
      { id: 'ar', label: 'العربية', short: 'AR', dir: 'rtl' },
      { id: 'en', label: 'English', short: 'EN', dir: 'ltr' },
      { id: 'de', label: 'Deutsch', short: 'DE', dir: 'ltr' }
    ],
    depts: depts, sw: sw, helmetCodes: helmetCodes, ppeKeys: ppeKeys, pexels: pexels,
    heroPhoto: 6615095, quotePhoto: 3862135
  };
})();
