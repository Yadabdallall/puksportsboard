/* English — interface texts */
window.I18N = window.I18N || {};
(function (L) {
  L.ui = {
    brand: 'Engineerpedia', brandSub: 'The engineering encyclopedia', lang: 'Language',
    nav: { depts: 'Departments', colors: 'Helmet colors', safety: 'Safety', software: 'Software', legends: 'Engineers', quiz: 'Which field suits me?' },
    loader: 'Preparing your helmet…',
    heroKicker: 'ENGINEERING · ENCYCLOPEDIA',
    heroTitle: ['Every engineering', 'department', 'in one place'],
    heroLead: 'This website is a simple, reliable encyclopedia. It shines a light on the most important engineering departments, the nature of their work, their key software and the career paths in each. Our goal is to help you understand them and choose the right department for you.',
    ctaDepts: 'Explore departments', ctaQuiz: 'Which field suits me?',
    stageHint: 'Tap to put the helmet on',
    helmetOf: '{c} helmet',
    quote: { label: 'Quote of the day', text: 'I am a civil engineer… made for the project site.', by: 'Yad Abdullah', role: 'Civil engineer' },
    stats: { depts: 'Engineering departments', branches: 'Branches & specialties', engineers: 'Brilliant engineers', projects: 'World-class projects', software: 'Key programs' },
    sec: {
      intro: { eyebrow: 'About', title: 'What is|engineering?', lead: 'Engineering is the use of science and mathematics to solve real-life problems: from bridges, buildings and electricity to phones, medicine and rockets. Every department is a world of its own — we open all of them for you.' },
      colors: { eyebrow: 'Colors', title: 'A helmet color|for every department', lead: 'Each department has its own color — the same color as the helmet you put on when you enter it. The background and interface of every department change to match it, too.' },
      depts: { eyebrow: 'Departments', title: 'Engineering|departments', lead: 'Pick a department to see what it is like, what students study, how many branches it has, its master’s and PhD options, and who its greatest engineers are.' },
      safety: { eyebrow: 'Safety', title: 'Helmets &|safety', lead: 'Safety is the first rule of engineering. Here you will learn the helmet color code, helmet types, electrical classes and all the personal protective equipment (PPE).' },
      software: { eyebrow: 'Software', title: 'The engineers’|toolbox', lead: 'The programs engineers use every day. Tap any program to learn what it is, who uses it and which great works were made with it.' },
      legends: { eyebrow: 'Legends', title: 'The world’s|greatest engineers', lead: '140 engineers and inventors — 10 for every department, each with a biography and 3 landmark projects. Tap anyone to meet them.' },
      quiz: { eyebrow: 'Choose', title: 'Which field|suits you?', lead: 'Answer six quick questions and see the three departments that fit you best.' },
      others: { eyebrow: 'More', title: 'Other engineering|fields', lead: 'Besides the main departments, these specialties exist at universities around the world; most of them are branches of one of the main departments.' }
    },
    search: 'Search: electrical, oil, AutoCAD, GIS …', empty: 'Nothing found. Try another word.',
    card: { branches: 'branches', years: 'years', enter: 'Step inside' },
    safety: {
      codes: 'Helmet color code on site', codesNote: 'This is a common general guide; colors differ from country to country and company to company. Always follow your own site’s rules.',
      types: 'Helmet types by impact', classes: 'Electrical classes', styles: 'Helmet styles',
      standards: 'International standards', care: 'How to look after your helmet',
      ppe: 'Personal protective equipment (PPE)', ppeNote: 'The colored dots at the bottom of each card show which departments need that item.'
    },
    swAll: 'All programs', swOpen: 'Details', swMore: 'Show all programs',
    quiz: { restart: 'Start over', again: 'Try again', result: 'These departments suit you best', match: 'match', note: 'This result is only a guide; talk to engineers and students of these departments before you decide.' },
    dept: {
      back: 'All departments', label: 'Department',
      tabs: ['About', 'Study', 'Branches', 'MSc & PhD', 'Software', 'Careers', 'Safety', 'Engineers'],
      chips: { years: '{n} years of study', branches: '{n} branches', engineers: '{n} famous engineers' },
      about: 'What is this|department like?', nature: 'Nature of the work', fact: 'Did you know?',
      study: 'What do|students study?', studyLead: 'This degree usually takes {n} years. These are the main courses of each stage.',
      studyNote: 'Note: these courses are a general outline for engineering departments; course names, numbers and order change depending on your university, country and city.',
      stage: 'Year {n}',
      branches: 'How many|branches?', branchesCount: 'main branches & specialties',
      grad: 'Master’s &|PhD', gradLead: 'After your bachelor’s you can continue in these specialties. A master’s usually takes 2 years and a PhD 3 to 5 years.', msc: 'Master’s', phd: 'PhD — research areas',
      software: 'Key|software', softwareLead: 'These programs are the most used at universities and in the job market. Tap any of them for a description, who uses it and examples of great works.',
      jobs: 'What jobs|do they do?', jobsLead: 'After graduation these are the main career paths — in Kurdistan and around the world.',
      safety: 'Helmet &|safety gear', helmetColor: 'Helmet color', spec: 'Type & class', style: 'Style', ppe: 'Required protective equipment', tip: 'Safety tip',
      engineers: 'The greatest engineers|of this field', engineersLead: '10 famous engineers, their biographies and 3 landmark projects each. Photos come from Wikipedia / Wikimedia Commons.',
      bio: 'Biography', wiki: 'Wikipedia', google: 'Images on Google', projects: 'Landmark projects',
      prev: 'Previous department', next: 'Next department'
    },
    sw: { maker: 'Maker', since: 'First release', usedIn: 'Used in these departments', who: 'Who uses it?', works: 'Great works & examples', about: 'What is this program?', site: 'Official website', wiki: 'Wikipedia', google: 'Images on Google', close: 'Close' },
    drop: { wear: 'Put on the {c} helmet', welcome: 'Welcome to {d}' },
    footer: {
      about: 'A simple, reliable encyclopedia to help you understand engineering and choose the right department.',
      img: 'Images: photos of engineers and projects come from Wikipedia and Wikimedia Commons, and department photos from Pexels (free). Every card also has an “Images on Google” button.',
      helmet: 'The department helmet colors on this website are for identification; on a real site, company and national rules apply.',
      credit: 'Developed by Yad Abdullah', top: 'Back to top'
    }
  };

  L.helmet = {
    codes: [
      { n: 'White', r: 'Engineers, site managers and supervisors' },
      { n: 'Yellow', r: 'General laborers and earth-moving operators' },
      { n: 'Orange', r: 'Road crews, crane & lifting operators, signalers' },
      { n: 'Blue', r: 'Electricians, carpenters and technicians' },
      { n: 'Green', r: 'Safety officers and inspectors (new workers on some sites)' },
      { n: 'Red', r: 'Firefighters and emergency teams' },
      { n: 'Brown', r: 'Welders and high-heat work' },
      { n: 'Grey', r: 'Visitors to the site' },
      { n: 'Pink', r: 'Temporary replacement helmet (for someone who forgot theirs)' },
      { n: 'Black', r: 'Senior supervisors in some companies' }
    ],
    types: [
      { n: 'Top protection', d: 'Designed for objects falling from above; the most common type on construction sites.' },
      { n: 'Top & lateral protection', d: 'Has an inner foam layer for blows to the side, front and back; better for factories and moving machinery.' }
    ],
    classes: [
      { n: 'General', v: '2,200 V', d: 'Protection against low-voltage contact; suitable for most construction work.' },
      { n: 'Electrical', v: '20,000 V', d: 'Tested for high voltage; required for all electrical engineers and workers.' },
      { n: 'Conductive', v: '0 V', d: 'No electrical protection; light and ventilated, for areas far from electricity.' }
    ],
    styles: [
      { n: 'Cap style', d: 'The most common style; a short front brim for rain and sun.' },
      { n: 'Full brim', d: 'Shades the face and neck; ideal for Kurdistan’s hot summers.' },
      { n: 'Vented', d: 'Has air vents to keep you cool; not suitable for electrical work.' },
      { n: 'Climbing helmet', d: 'Has a chin strap so it won’t fall off; for towers and work at height.' },
      { n: 'Bump cap', d: 'For low, tight spaces; does not protect against heavy falling objects.' },
      { n: 'Combo kit', d: 'With face screen and ear defenders; for cutting, welding and forestry.' },
      { n: 'Mining helmet', d: 'Carries a lamp; for mines, tunnels and dark places.' },
      { n: 'Firefighter helmet', d: 'Resists very high heat and flames.' }
    ],
    standards: ['American standard for helmet types and classes', 'European standard for industrial helmets', 'Electrically insulating helmets up to 1,000 V', 'Climbing and work-at-height helmets', 'Industrial bump caps'],
    care: [
      'Inspect it daily before use: cracks, holes, softening or color change.',
      'Replace it after any strong impact, even if you see no damage.',
      'As a rule: replace the suspension every year and the shell every 2 to 5 years — follow the manufacturer’s guidance.',
      'Don’t paint it, drill it or cover it in stickers; chemicals weaken the plastic.',
      'Don’t leave it in direct sun inside a car; heat and UV light weaken plastic.'
    ]
  };

  L.ppe = {
    helmet: { n: 'Safety helmet', d: 'Protects the head from falling objects and bumps; the first condition for entering any site.' },
    vest: { n: 'High-visibility vest', d: 'So drivers and machine operators can see you, day and night.' },
    boots: { n: 'Safety boots', d: 'Steel toe caps and nail-proof, anti-slip soles.' },
    gloves: { n: 'Work gloves', d: 'Protect hands from cuts, scrapes and rough materials.' },
    insgloves: { n: 'Insulating gloves', d: 'Insulated rubber gloves for working near live electricity.' },
    glasses: { n: 'Safety glasses', d: 'Protect the eyes from flying particles, dust and radiation.' },
    goggles: { n: 'Sealed goggles', d: 'Fully cover the eyes against chemical splashes and vapors.' },
    faceshield: { n: 'Face shield', d: 'Protects the whole face from splashes, fragments and electrical arc flash.' },
    ear: { n: 'Ear defenders', d: 'For noise above 85 decibels; loud noise slowly causes deafness.' },
    mask: { n: 'Respirator', d: 'Protection from dust, smoke, vapors and toxic gases.' },
    harness: { n: 'Fall-arrest harness', d: 'A full-body harness for work more than 1.8 meters above ground.' },
    fr: { n: 'Flame-resistant clothing', d: 'Non-flammable (FR) clothing where there is risk of fire, gas or arc flash.' },
    labcoat: { n: 'Lab coat', d: 'Protects clothes and skin from chemical and biological materials.' },
    gas: { n: 'Gas detector', d: 'Warns you of toxic and explosive gases such as H₂S, CO and methane.' },
    rf: { n: 'RF radiation monitor', d: 'Warns you when you get too close to powerful antennas.' },
    esd: { n: 'Anti-static wrist strap', d: 'Prevents static electricity from damaging chips and electronic boards.' },
    lifejacket: { n: 'Life jacket', d: 'For work on water, dams, canals and the sea.' },
    welding: { n: 'Welding helmet', d: 'Protects the eyes and face from UV light and the welding arc.' },
    dosimeter: { n: 'Radiation dosimeter', d: 'Measures how much radiation you have received; near X-ray and CT machines.' },
    bumpcap: { n: 'Bump cap', d: 'For low, tight spaces; does not protect against heavy falling objects.' },
    ergo: { n: 'Office ergonomics', d: 'A proper chair, screen at eye level and short breaks — safety for computer engineers.' }
  };

  L.quiz = [
    { q: 'What kind of work makes you happiest?', a: ['Building something huge that will last for centuries', 'Understanding machines, engines and motion', 'Electricity, circuits and electronics', 'Writing code and building apps', 'Chemistry experiments and transforming materials'] },
    { q: 'Where would you like to work?', a: ['On site, outdoors in the fresh air', 'In a factory or workshop', 'In an office at a computer', 'In a lab or a hospital'] },
    { q: 'Which subject do you enjoy most?', a: ['Mathematics and physics', 'Chemistry and biology', 'Art and drawing', 'Geography and maps', 'Logic and brain teasers'] },
    { q: 'Which project fascinates you most?', a: ['Burj Khalifa', 'The Saturn V rocket and the Moon landing', 'Mobile phones and the internet', 'Dukan Dam', 'An oil and gas field', 'Artificial hearts and medical devices'] },
    { q: 'How do you think?', a: ['Organizing and improving systems, time and cost', 'Inventing and designing new things', 'Precise calculation and analysis', 'Solving problems with code'] },
    { q: 'How much do you enjoy fieldwork?', a: ['A lot — I can’t sit in an office all day', 'Somewhere in the middle — a mix of both', 'Not much — I prefer the office and the lab'] }
  ];

  L.others = [
    { n: 'Environmental engineering', d: 'Treating water, air and waste and protecting nature from pollution.' },
    { n: 'Mining engineering', d: 'Finding and extracting minerals and rock safely and economically.' },
    { n: 'Materials & metallurgy', d: 'Creating new materials: steel, aluminium, composites and ceramics.' },
    { n: 'Nuclear engineering', d: 'Nuclear power plants, radiation protection and nuclear medicine.' },
    { n: 'Mechatronics', d: 'Mechanics, electronics and computing combined for robots and smart machines.' },
    { n: 'Marine engineering', d: 'Designing ships, ports and offshore structures.' },
    { n: 'Agricultural engineering', d: 'Farm machinery, modern irrigation and food processing.' },
    { n: 'Automotive engineering', d: 'Designing and producing cars, especially electric vehicles.' },
    { n: 'Robotics & AI', d: 'Industrial robots, self-driving cars and machine-learning systems.' },
    { n: 'Electronics & control', d: 'Designing circuits, sensors and automatic control systems.' }
  ];
})(window.I18N.en = window.I18N.en || {});
