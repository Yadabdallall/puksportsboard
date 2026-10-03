/* English — world engineering standards */
window.I18N = window.I18N || {};
(function (L) {
  L.standards = {
    kinds: [
      ['Standard', 'Standard', 'A document agreed by experts that defines a test method, a material property or a product requirement — like ASTM C39 for testing the compressive strength of concrete.'],
      ['Code', 'Code', 'A set of design and construction rules that governments or cities often adopt as law — like ACI 318 for concrete or the IBC for buildings.'],
      ['Specification', 'Specification', 'The requirements a material or a piece of work must meet — like ASTM C150 for cement, or a project specification that is part of the contract.'],
      ['Guide', 'Guide', 'Advice and good practice rather than mandatory rules — ACI documents ending in R (such as ACI 213R) are guides.']
    ],
    anatTitle: 'How do you read a standard’s name?',
    anat: [
      'The organisation that wrote the standard (ASTM International).',
      'The class letter: C for concrete, cement and masonry; A for iron and steel; D for soil, plastics and petroleum; E for general test methods.',
      'The serial number of the standard.',
      'M means the metric (SI) version is published together with the inch-pound version.',
      'The year of the latest revision (2021). Always use the current edition — or the edition named in your contract.'
    ],
    listLabel: 'Organisations', listTitle: 'The organisations that wrote|the language of engineering',
    listLead: 'Pick a field to see only the standards that matter for it. Tap a field name inside any card to filter as well.',
    all: 'All', codes: 'Key codes and standards', site: 'Official website: ',
    iqTitle: 'What is used in Iraq and the Kurdistan Region?',
    iq: [
      'Concrete design mostly follows ACI 318 and materials testing follows ASTM; older projects also use the British BS 8110.',
      'Cement and aggregates are tested to the Iraqi standards IQS No. 5 and IQS No. 45, issued by COSQC (founded 1979).',
      'The power network is 230/400 V, 50 Hz; designs commonly refer to IEC 60364 or BS 7671.',
      'Fire protection and alarm systems in large projects follow NFPA, and heating and cooling follow ASHRAE.',
      'In the oil and gas fields, API and ASME standards are the basis of the work.',
      'International and donor-funded projects often use FIDIC contracts; Iraqi government contracts have their own general conditions.',
      'Before you start, always check which code — and which edition — the contract and the client require.'
    ],
    orgs: {
      aci: { d: 'The world’s leading authority on concrete design and construction. ACI 318 is the basis for designing concrete buildings in most of the Middle East, including Iraq and Kurdistan.' },
      astm: { d: 'More than 12,000 standards for materials and testing: concrete, steel, soil, petroleum, plastics and medical devices. Concrete and soil labs in Kurdistan use them every day.' },
      iso: { d: 'The largest standards developer in the world, with about 170 member countries. ISO 9001 for quality and ISO 19650 for BIM are the best-known standards for engineering companies.' },
      iec: { d: 'Sets world standards for everything electrical and electronic: building installations, circuit breakers, lightning protection and medical equipment. Most of the world outside North America relies on it.' },
      ieee: { d: 'The largest professional organisation of engineers in the world. Wi-Fi (802.11) and Ethernet (802.3) are IEEE standards — every device you connect to the internet uses them.' },
      nfpa: { d: 'Writes fire and electrical safety codes. NFPA 70 (the NEC) is America’s electrical code, and NFPA 101 sets the exits and life safety rules of buildings.' },
      asme: { d: 'Its Boiler and Pressure Vessel Code (BPVC) is one of the oldest and most important codes in engineering. Refinery and power plant piping and mechanical drawings (GD&T) follow ASME.' },
      ashrae: { d: 'The main reference for HVAC engineers. Its standards for energy (90.1), indoor air (62.1) and thermal comfort (55), and the ASHRAE Handbook, are used around the world.' },
      aisc: { d: 'Writes the design code for steel buildings. AISC 360 covers normal design and AISC 341 earthquake resistance; halls, factories and steel high-rises are designed with it.' },
      asce: { d: 'The oldest engineering society in the United States. ASCE 7 defines the loads — wind, snow, earthquake and live loads — the first step in designing any building.' },
      icc: { d: 'Publishes a complete family of building codes: building (IBC), fire, mechanical, plumbing and energy. Adopted as law across the United States and in several other countries.' },
      aashto: { d: 'Sets standards for roads and bridges. AASHTO LRFD for bridge design and the “Green Book” for road geometry are used in many countries; the AASHTO soil classification is standard in highway labs.' },
      api: { d: 'The standards of the oil and gas industry: line pipe, storage tanks, wellheads, pumps and inspection. They are the basis of work in the oil fields of Kurdistan and Iraq.' },
      aws: { d: 'Writes the welding codes: AWS D1.1 for structural steel and D1.5 for bridges. Its CWI (Certified Welding Inspector) is one of the best-known certificates in industry.' },
      awwa: { d: 'Sets standards for drinking water networks: pipes, tanks, treatment and operation. Water resources and civil engineers rely on it when designing water supply systems.' },
      cen: { d: 'The Eurocodes (EN 1990 to EN 1999) are Europe’s common system for structural design: concrete, steel, timber, soil and earthquakes. EN 206 and EN 197 cover concrete and cement.' },
      bsi: { d: 'The world’s first national standards body (1901). BS 8110, although withdrawn, is still met in the Middle East, and BS 7671 is the British wiring regulation.' },
      din: { d: 'Germany’s standards for industry, construction and electrical work. The A4 paper size comes from DIN 476 (1922) and is now ISO 216 — proof of DIN’s worldwide reach.' },
      sae: { d: 'Writes standards for cars and aerospace. SAE J3016 defines the levels of self-driving (0 to 5) and AS9100 is the quality system of the aviation and space industry.' },
      itu: { d: 'The oldest international organisation (1865), now a United Nations agency. It shares out radio frequencies and sets standards for optical fibre, video (H.264) and 5G.' },
      ipc: { d: 'Standards for designing and building printed circuit boards and soldering components. IPC-A-610 is the world benchmark for what an acceptable electronic assembly looks like.' },
      ansi: { d: 'Coordinates the US standards system and represents the United States in ISO. Its standards for hard hats (Z89.1), safety glasses (Z87.1) and hi-vis clothing (107) are widely used in safety.' },
      osha: { d: 'A US government agency that writes workplace safety law. Its rules for construction (1926) and general industry (1910) and the OSHA 30 training are known worldwide as a safety benchmark.' },
      fidic: { d: 'Publishes the standard contracts of engineering projects. The coloured FIDIC books (Red, Yellow, Silver …) share duties and risks between the client and the contractor.' },
      ogc: { d: 'Sets open standards for maps and geographic data. KML (Google Earth files), WMS and GeoPackage come from OGC — the common language of GIS and surveying.' },
      iqs: { d: 'Iraq’s Central Organization for Standardization and Quality Control was founded by Law No. 54 of 1979. IQS No. 5 for Portland cement and IQS No. 45 for aggregates are widely used in research and labs in Iraq and Kurdistan.' }
    }
  };
})(window.I18N.en = window.I18N.en || {});
