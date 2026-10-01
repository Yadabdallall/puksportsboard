window.I18N = window.I18N || {}; I18N.en = I18N.en || {}; I18N.en.depts = I18N.en.depts || {};
I18N.en.depts.elec = {
  n: 'Electrical Engineering', cname: 'Blue', style: 'Cap style with no vents (Class E)',
  tag: 'The world’s energy: power plants, transmission grids, motors, electronics and control.',
  why: 'An electrical engineer’s helmet must be Class E — tested to 20,000 volts — with no ventilation holes. On many sites blue is the color of electricians and technicians.',
  about: 'Electrical engineering covers the generation, transmission, distribution and use of electrical energy, as well as electronics and control systems. Electrical engineers design and run power plants, high-voltage lines, substations, city grids, motors, generators and factory automation. In the age of electric vehicles and solar power, this department matters more than ever.',
  nature: [
    'Strong mathematics and physics: circuits, magnetic fields and system analysis.',
    'Work in offices, labs and the field: substations, lines, factories and building projects.',
    'Safety is critical; a small mistake with high voltage can be fatal.',
    'Fast growth: renewable energy, smart grids, batteries and electric vehicles.'
  ],
  br: [
    ['Power Systems', 'Generating, transmitting and distributing electricity.'],
    ['Control & Automation', 'PLC, SCADA and factory robots.'],
    ['Electronics', 'Circuits, transistors, sensors and electronic boards.'],
    ['Electrical Machines', 'Motors, generators and transformers.'],
    ['Power Electronics', 'Inverters, chargers and motor speed control.'],
    ['Renewables & Smart Grid', 'Solar and wind plants, batteries and smart grids.'],
    ['Instrumentation', 'Measuring and monitoring industrial systems.']
  ],
  jobs: ['Power plant engineer', 'Transmission and distribution grid engineer', 'Electrical engineer for buildings and projects', 'Automation engineer (PLC/SCADA) in factories and refineries', 'Solar power plant designer', 'Protection and testing engineer', 'Oil, gas and telecom companies', 'University lecturer and researcher'],
  tip: 'Before any work, make sure the power is off and test it with a meter — never assume it is “dead”. Follow Lockout/Tagout rules.',
  fact: 'A lightning bolt can exceed 100 million volts, and its channel reaches about 30,000 degrees — roughly five times the temperature of the Sun’s surface.',
  eng: [
    { n: 'Nikola Tesla', from: 'Serbia / USA',
      bio: 'Inventor of the alternating-current (AC) system and the induction motor — the system that delivers electricity to every home today.',
      story: 'Born in 1856 to a Serbian family in today’s Croatia, he emigrated to the United States in 1884 and briefly worked for Edison. He then sold his AC motor patents to George Westinghouse and won the “War of the Currents” against Edison’s DC. He held more than 300 patents, and the unit of magnetic flux density (the tesla) is named after him. He died poor in 1943 in a New York hotel room.',
      p: [
        { n: 'AC induction motor', at: 'New York, USA', d: 'A brushless motor driven by a rotating magnetic field; today it is everywhere in fans, pumps and factories.' },
        { n: 'Tesla coil', at: 'New York, USA', d: 'A resonant transformer that creates extremely high voltages and artificial lightning; still used in science and shows.' },
        { n: 'Wardenclyffe Tower', at: 'Long Island, USA', d: 'Tesla’s dream of sending messages and power wirelessly around the world; funding ran out and it was never finished.' }
      ] },
    { n: 'Thomas Edison', from: 'USA',
      bio: 'One of the most prolific inventors in history with more than 1,000 patents. He founded the world’s first industrial research laboratory.',
      story: 'Born in Ohio in 1847, he attended school for only a few months and was taught at home by his mother. As a boy he sold newspapers on trains and later became a telegraph operator. In 1876 he founded the Menlo Park laboratory, where a team of inventors worked together. From the light bulb and phonograph to the movie camera, his inventions changed daily life. He died in 1931.',
      p: [
        { n: 'Practical light bulb', at: 'Menlo Park, USA', d: 'He tested thousands of materials until he found a carbon filament that glowed for hundreds of hours; it made the bulb a household product.' },
        { n: 'Phonograph', at: 'Menlo Park, USA', d: 'The first machine that recorded sound and played it back; the first recording was a children’s rhyme.' },
        { n: 'Pearl Street Station', at: 'New York, USA', d: 'The world’s first commercial power station, delivering DC electricity to Manhattan homes and shops through a wire network.' }
      ] },
    { n: 'George Westinghouse', from: 'USA',
      bio: 'American engineer and industrialist who, with Tesla, brought the AC system to victory and invented the railway air brake.',
      story: 'Born in New York in 1846, he served in the American Civil War. At 22 he invented the air brake, which transformed railway safety. In 1886 he founded Westinghouse Electric and bought Tesla’s patents. In his lifetime he founded about 60 companies and held more than 360 patents. He died in 1914.',
      p: [
        { n: 'Railway air brake', at: 'Pittsburgh, USA', d: 'A system that stops all the cars together with compressed air; still the basis of brakes on trains and heavy trucks.' },
        { n: 'Lighting of the Chicago World’s Fair', at: 'Chicago, USA', d: 'He lit the fair with about 100,000 lamps on an AC system, proving AC was safe and cheaper.' },
        { n: 'Niagara Falls power plant', at: 'Niagara, USA', d: 'The first large AC hydroelectric plant; it carried power to the city of Buffalo and decided the War of the Currents.' }
      ] },
    { n: 'Werner von Siemens', from: 'Germany',
      bio: 'Inventor and founder of Siemens. He discovered the self-excited dynamo principle that made large generators possible.',
      story: 'Born in Germany in 1816, he studied engineering in the Prussian army. In 1847, with Johann Halske, he founded a telegraph company that became Siemens. He built telegraph lines, dynamos, electric railways and an electric elevator. The unit of electrical conductance (the siemens) is named after him. He died in 1892.',
      p: [
        { n: 'Dynamo-electric principle', at: 'Berlin, Germany', d: 'A generator that strengthens its own magnets with its own current; it allowed electricity to be produced cheaply and in large amounts.' },
        { n: 'Indo-European Telegraph Line', at: 'London to Calcutta', d: 'A line of about 11,000 km that carried a message from London to India in minutes instead of weeks.' },
        { n: 'First electric tram', at: 'Berlin, Germany', d: 'The world’s first commercial electric tram, in Lichterfelde; the beginning of electric urban transport.' }
      ] },
    { n: 'Jack Kilby', from: 'USA',
      bio: 'Inventor of the integrated circuit — the basis of every chip today. He won the Nobel Prize in Physics in 2000.',
      story: 'Born in Missouri in 1923, he studied electrical engineering at the University of Illinois. In the summer of 1958, newly hired at Texas Instruments while his colleagues were on vacation, he tested the idea of building all the parts of a circuit on a single piece of semiconductor. On 12 September 1958 the world’s first chip worked. He held more than 60 patents and died in 2005.',
      p: [
        { n: 'Integrated circuit (IC)', at: 'Dallas, USA', d: 'The first chip combining transistor, resistor and capacitor on one piece of germanium; the basis of computers and phones.' },
        { n: 'Handheld calculator (Cal-Tech)', at: 'Dallas, USA', d: 'The prototype of the pocket calculator built with chips; it turned the calculator from a large desk machine into a handheld device.' },
        { n: 'Thermal printer', at: 'Dallas, USA', d: 'A printer that writes with heat on special paper; used today for store receipts and bank machines.' }
      ] },
    { n: 'Michael Faraday', from: 'England',
      bio: 'English scientist who discovered electromagnetic induction — the basis of every generator, motor and transformer.',
      story: 'Born into a poor London family in 1791, he had only basic schooling. At 14 he worked in a bookbinder’s shop and read the books he bound. After attending Humphry Davy’s lectures he became his assistant at the Royal Institution. Without advanced mathematics, he explained magnetic fields through experiments. The unit of capacitance (the farad) is named after him. He died in 1867.',
      p: [
        { n: 'First electric motor', at: 'London, UK', d: 'A current-carrying wire that rotated around a magnet; the first time electricity became continuous motion.' },
        { n: 'Electromagnetic induction', at: 'London, UK', d: 'He discovered that a changing magnetic field creates electricity; every power plant today works by this law.' },
        { n: 'Faraday cage', at: 'London, UK', d: 'A conductive cage that keeps outside electric fields from reaching inside; that is why you are protected from lightning inside a car or airplane.' }
      ] },
    { n: 'William Stanley Jr.', from: 'USA',
      bio: 'American engineer who built the first practical transformer and installed the first AC distribution system in a town.',
      story: 'Born in New York in 1858, he left Yale to work directly in the electrical industry. As chief engineer at Westinghouse he turned the European transformer of Gaulard and Gibbs into a practical device. This made it possible to send electricity at high voltage over long distances. He died in 1916.',
      p: [
        { n: 'Practical AC transformer', at: 'Great Barrington, USA', d: 'A transformer that steps voltage up and down; without it, sending electricity over long distances would be impossible.' },
        { n: 'First AC distribution system', at: 'Great Barrington, USA', d: 'In 1886 he lit the town’s main street with AC electricity — America’s first AC grid.' },
        { n: 'Stanley Electric Manufacturing', at: 'Pittsfield, USA', d: 'A company making transformers and AC equipment, later bought by General Electric.' }
      ] },
    { n: 'Sebastian Ziani de Ferranti', from: 'United Kingdom',
      bio: 'British engineer and pioneer of high-voltage transmission. He designed the world’s first modern central power station.',
      story: 'Born in Liverpool in 1864, he was fascinated by electrical devices as a child. At 17 he invented an alternator and founded his own company. At 23 he designed the Deptford power station, which transmitted electricity at 10,000 volts. He held about 176 patents and died in 1930.',
      p: [
        { n: 'Ferranti alternator', at: 'London, UK', d: 'A small, powerful AC generator he invented at the age of 17.' },
        { n: 'Deptford Power Station', at: 'London, UK', d: 'The first large high-voltage AC power station (10,000 V), supplying central London — a prototype of the modern grid.' },
        { n: 'Ferranti company', at: 'United Kingdom', d: 'A company that made everything from transformers and meters to one of the first commercial computers (Ferranti Mark 1).' }
      ] },
    { n: 'Nick Holonyak Jr.', from: 'USA',
      bio: 'The “father of the LED”. He created the first visible-light LED — a red light now found in every device.',
      story: 'Born in Illinois in 1928 to an immigrant coal-miner’s family, he was the first doctoral student of John Bardeen, co-inventor of the transistor. At General Electric in 1962 he made the first red LED and predicted that one day it would replace the light bulb — which it did. He later taught at the University of Illinois and did research for decades. He died in 2022.',
      p: [
        { n: 'First visible LED', at: 'New York, USA', d: 'A red LED made of GaAsP; the beginning of LED lighting now found in screens, phones and bulbs.' },
        { n: 'Semiconductor switch for dimmers', at: 'New York, USA', d: 'A multi-layer semiconductor switch used to dim lights and control motor speed.' },
        { n: 'Quantum-well laser', at: 'University of Illinois, USA', d: 'A highly efficient semiconductor laser used today in fiber-optic communication and disc readers.' }
      ] },
    { n: 'Shuji Nakamura', from: 'Japan / USA',
      bio: 'Inventor of the bright blue LED that opened the way to white LED lighting. He won the Nobel Prize in Physics in 2014.',
      story: 'Born in 1954 on the Japanese island of Shikoku, he worked at a small chemical company called Nichia. With a tiny budget and self-built equipment he worked on gallium nitride (GaN), a material most scientists had abandoned. In 1993 he made the world’s first bright blue LED. He is now a professor at the University of California, Santa Barbara.',
      p: [
        { n: 'Bright blue LED', at: 'Anan, Japan', d: 'After red and green, blue was the missing color; its discovery made full-color screens and white light possible.' },
        { n: 'Blue-violet laser (Blu-ray)', at: 'Anan, Japan', d: 'A short-wavelength laser that fits more data on a disc; the basis of Blu-ray technology.' },
        { n: 'White LED lighting', at: 'Anan, Japan', d: 'A blue LED with a yellow phosphor creates white light; billions of low-energy bulbs work this way today.' }
      ] }
  ]
};
