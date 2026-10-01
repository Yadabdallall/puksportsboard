window.I18N = window.I18N || {}; I18N.en = I18N.en || {}; I18N.en.depts = I18N.en.depts || {};
I18N.en.depts.computer = {
  n: 'Computer Engineering', cname: 'Purple', style: 'Cap style (for site and data-center visits)',
  tag: 'The digital heart of the world: chips, processors, networks, smart devices and AI.',
  why: 'Computer engineers spend most of their time in offices and labs, but in data centers, telecom stations and factories a helmet and anti-static (ESD) protection are needed. Purple is chosen to identify this department.',
  about: 'Computer engineering is the bridge between electrical engineering and computer science. Computer engineers design both “hardware” — chips, processors, boards and smart devices — and low-level “software” such as operating systems and the code inside cars and phones. Internet networks, cybersecurity, the Internet of Things (IoT) and AI hardware are all part of this field.',
  nature: [
    'A mix of electronic circuits and programming.',
    'Lab work with boards, FPGAs, sensors and measuring instruments.',
    'Logical thinking and problem solving; a tiny bug can stop an entire system.',
    'A fast-changing field: new technology arrives every few years, so learning never stops.'
  ],
  br: [
    ['Computer Architecture', 'Designing processors, memory and computer organization.'],
    ['Embedded & IoT', 'Smart devices, Arduino, sensors and smart homes.'],
    ['Networks & Cybersecurity', 'Network design, firewalls and defense against cyberattacks.'],
    ['AI & Robotics', 'Machine learning, robots and self-driving cars.'],
    ['VLSI & Chip Design', 'Designing chips from transistors up to complete processors.'],
    ['Cloud & Distributed Systems', 'Data centers, servers and cloud services.'],
    ['Computer Vision', 'Recognizing images, faces and video with AI.']
  ],
  jobs: ['Network and systems engineer', 'Cybersecurity specialist', 'Embedded systems and IoT engineer', 'Chip and FPGA designer', 'Data center and cloud engineer', 'AI and robotics engineer', 'Telecom engineer', 'University lecturer and researcher'],
  tip: 'Wear an anti-static (ESD) wrist strap before touching boards and chips, and in data centers watch out for cables, loud noise and the fire-suppression system.',
  fact: 'An ordinary phone today is roughly a thousand times faster than the Cray-2 supercomputer, which in 1985 was the fastest computer in the world and was cooled by immersion in a special liquid.',
  eng: [
    { n: 'Alan Turing', from: 'United Kingdom',
      bio: 'Father of computer science and artificial intelligence. During World War II he helped break the German Enigma code.',
      story: 'Born in London in 1912, he studied mathematics at Cambridge. At 24 he invented the “Turing machine”: a mathematical model of what computers can and cannot do. At Bletchley Park he led a team that read Germany’s secret messages and, historians believe, shortened the war. In 1950 he proposed the “Turing test” for artificial intelligence. He died in 1954 and now appears on the £50 note.',
      p: [
        { n: 'Turing machine', at: 'Cambridge, UK', d: 'An imaginary machine with an endless tape and a head that reads and writes; the theoretical basis of every computer today.' },
        { n: 'The Bombe', at: 'Bletchley Park, UK', d: 'An electro-mechanical machine that found the Enigma settings; thousands of secret messages were read with it every day.' },
        { n: 'Automatic Computing Engine (ACE)', at: 'London, UK', d: 'One of the first complete designs of a stored-program computer; its small version (Pilot ACE) ran in 1950.' }
      ] },
    { n: 'John von Neumann', from: 'Hungary / USA',
      bio: 'A genius mathematician who defined the “stored-program” computer architecture — the design still used in most computers.',
      story: 'Born in Budapest in 1903, as a child he could divide eight-digit numbers in his head. In 1930 he went to the United States and joined the Institute for Advanced Study in Princeton. Besides computing, he developed game theory, quantum mechanics and economics. In 1945 he wrote a report in which programs and data are stored in the same memory. He died in 1957.',
      p: [
        { n: 'Von Neumann architecture', at: 'Princeton, USA', d: 'Processor, memory, input and output; programs stored in memory like data. This is the basic design of your laptop and phone.' },
        { n: 'EDVAC', at: 'Philadelphia, USA', d: 'One of the first stored-program computers, designed from his report and using binary numbers.' },
        { n: 'IAS Machine', at: 'Princeton, USA', d: 'A computer whose blueprints were freely shared; dozens of other computers around the world were built from them.' }
      ] },
    { n: 'Seymour Cray', from: 'USA',
      bio: 'The “father of supercomputing”. For two decades he designed the fastest computers in the world.',
      story: 'Born in Wisconsin in 1925, he studied electrical engineering and mathematics at the University of Minnesota. He worked at Control Data and in 1972 founded Cray Research. He obsessed over cooling and short wires, because the speed of electricity in a wire has limits. It is said that when stuck on a problem he dug a tunnel under his house. He died in a car accident in 1996.',
      p: [
        { n: 'CDC 6600', at: 'Minnesota, USA', d: 'Considered the world’s first supercomputer; about three times faster than the previous fastest computer.' },
        { n: 'Cray-1', at: 'Wisconsin, USA', d: 'A famous C-shaped computer with a bench seat around it; the shape kept the wires short.' },
        { n: 'Cray-2', at: 'USA', d: 'All its boards were immersed in a non-conductive liquid for cooling; it was the fastest computer in the world.' }
      ] },
    { n: 'Steve Wozniak', from: 'USA',
      bio: 'Co-founder of Apple and designer of Apple’s first computers — a pioneer of the personal computer revolution.',
      story: 'Born in California in 1950, his father was an electronics engineer. From childhood he designed circuits and became known for using the fewest possible chips. In 1976, with Steve Jobs, he founded Apple in a garage. He left Apple in 1985 and later did a lot of work in teaching children and philanthropy.',
      p: [
        { n: 'Apple I', at: 'California, USA', d: 'A computer Wozniak built by hand; only about 200 were made, and they now sell at auction for hundreds of thousands of dollars.' },
        { n: 'Apple II', at: 'California, USA', d: 'One of the first successful personal computers, with color graphics; millions were sold.' },
        { n: 'Disk II', at: 'California, USA', d: 'A floppy-disk controller designed with remarkably few chips; considered a masterpiece of electronic design.' }
      ] },
    { n: 'Federico Faggin', from: 'Italy / USA',
      bio: 'Designer of the Intel 4004 — the world’s first commercial microprocessor — and of silicon-gate technology.',
      story: 'Born in Italy in 1941, he studied physics at the University of Padua. In 1968 at Fairchild he developed silicon-gate technology. At Intel he led the design of the 4004 and etched his initials (F.F.) on the chip. He later founded Zilog and Synaptics.',
      p: [
        { n: 'Intel 4004', at: 'Santa Clara, USA', d: 'The world’s first commercial microprocessor, with about 2,300 transistors; every processor today descends from it.' },
        { n: 'Zilog Z80', at: 'California, USA', d: 'A famous 8-bit processor used for decades in home computers, game consoles and industrial machines.' },
        { n: 'Synaptics touchpad', at: 'California, USA', d: 'The touch-sensitive surface that has replaced the mouse on most laptops today.' }
      ] },
    { n: 'Charles Babbage', from: 'England',
      bio: 'The “father of the computer”. In the 19th century he designed a mechanical calculating engine organized like a modern computer.',
      story: 'Born in London in 1791, he was a professor of mathematics at Cambridge. Frustrated by error-filled hand-made mathematical tables, he decided to build a machine that would calculate without errors. He then designed the Analytical Engine, with a processor, memory and punched cards. Ada Lovelace wrote the world’s first program for it. He died in 1871 without his machines being completed.',
      p: [
        { n: 'Difference Engine', at: 'London, UK', d: 'A mechanical machine for producing error-free mathematical tables; only a small part was built.' },
        { n: 'Analytical Engine', at: 'London, UK', d: 'The first design of a general-purpose computer: a “mill” (processor), a “store” (memory) and programs on punched cards.' },
        { n: 'Difference Engine No. 2', at: 'Science Museum, London', d: 'Built in 1991 from his drawings and it worked perfectly — proving Babbage right. It has about 8,000 parts.' }
      ] },
    { n: 'J. Presper Eckert', from: 'USA',
      bio: 'Co-inventor of ENIAC — the first general-purpose electronic computer — and UNIVAC, America’s first commercial computer.',
      story: 'Born in Philadelphia in 1919, he studied electrical engineering at the University of Pennsylvania. At 24, with John Mauchly, he began the ENIAC project for the US Army. They then founded one of the first computer companies. He held more than 80 patents and died in 1995.',
      p: [
        { n: 'ENIAC', at: 'Philadelphia, USA', d: 'A 30-ton computer with about 18,000 vacuum tubes that filled a whole room; a thousand times faster than earlier machines.' },
        { n: 'Mercury delay-line memory', at: 'Philadelphia, USA', d: 'One of the first types of computer memory, storing information as sound waves in a tube of mercury.' },
        { n: 'UNIVAC I', at: 'Philadelphia, USA', d: 'America’s first commercial computer; in 1952 it correctly predicted Eisenhower’s election victory.' }
      ] },
    { n: 'Robert Noyce', from: 'USA',
      bio: 'The “Mayor of Silicon Valley”. Co-inventor of the silicon chip and co-founder of Fairchild and Intel.',
      story: 'Born in Iowa in 1927, he earned a PhD in physics at MIT. In 1957 he and seven colleagues left Shockley’s company and founded Fairchild — the beginning of Silicon Valley. In 1959, using the planar process, he invented the silicon integrated circuit that could be mass-produced. In 1968 he co-founded Intel with Gordon Moore. He died in 1990.',
      p: [
        { n: 'Fairchild Semiconductor', at: 'California, USA', d: 'A company that spawned dozens of others (including Intel and AMD); called the “mother of Silicon Valley”.' },
        { n: 'Monolithic silicon integrated circuit', at: 'California, USA', d: 'A chip whose components and connections were all built on one piece of silicon; it allowed chips to be made by the millions.' },
        { n: 'Intel', at: 'Santa Clara, USA', d: 'One of the world’s largest chipmakers, which created the first microprocessor and the x86 processors.' }
      ] },
    { n: 'Jensen Huang', from: 'Taiwan / USA',
      bio: 'Co-founder and CEO of NVIDIA. He turned the graphics card (GPU) into the main engine of gaming, science and AI.',
      story: 'Born in Taiwan in 1963, he moved to the United States at 9. He studied electrical engineering at Oregon State and Stanford and worked at AMD and LSI. In 1993, at a Denny’s restaurant, he and two friends decided to found NVIDIA. In 2006 he decided to make the GPU a general-purpose computing device; years later that decision became the foundation of the AI revolution. NVIDIA is now one of the most valuable companies in the world.',
      p: [
        { n: 'NVIDIA', at: 'Santa Clara, USA', d: 'A company whose chips train most of today’s large AI models.' },
        { n: 'GeForce 256 — the first “GPU”', at: 'Santa Clara, USA', d: 'The first graphics card marketed as a “GPU”, taking lighting and 3D transformation work off the processor.' },
        { n: 'CUDA', at: 'Santa Clara, USA', d: 'A platform that lets thousands of GPU cores be programmed for science and AI, not just games.' }
      ] },
    { n: 'Sophie Wilson', from: 'United Kingdom',
      bio: 'Designer of the ARM instruction set — the processor found in almost every phone in the world today.',
      story: 'Born in England in 1957, she studied mathematics and computer science at Cambridge. At Acorn she designed the BBC Micro, which taught a generation of British children to use computers. In 1983, with Steve Furber, she began designing a simple, low-power processor called ARM. She is a Fellow of the Royal Society and still works in chip design.',
      p: [
        { n: 'BBC Micro', at: 'Cambridge, UK', d: 'An educational computer that spread through British schools and trained a generation of engineers.' },
        { n: 'ARM instruction set', at: 'Cambridge, UK', d: 'A simple, low-power processor design used in hundreds of billions of chips: phones, tablets, cars and Mac computers.' },
        { n: 'Acorn Archimedes', at: 'Cambridge, UK', d: 'The first personal computer powered by an ARM processor; in its day one of the fastest home computers.' }
      ] }
  ]
};
