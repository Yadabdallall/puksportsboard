window.I18N = window.I18N || {}; I18N.en = I18N.en || {}; I18N.en.depts = I18N.en.depts || {};
I18N.en.depts.software = {
  n: 'Software Engineering', cname: 'Sky blue', style: 'Visitor helmet (only when visiting a site)',
  tag: 'Apps, websites, games and systems: designing and building the programs that run the world.',
  why: 'Software engineers mostly work in offices or at home; but when they visit a site for factory, smart-building or data-center projects, they wear a visitor helmet. Sky blue is this department’s color on this website.',
  about: 'Software engineering applies engineering principles to building programs: planning, design, writing code, testing and maintenance. The difference from just “coding” is that software engineers think about large systems, big teams, quality, security and long-term development. From mobile apps and websites to banks, hospitals, aircraft and AI, everything runs on software.',
  nature: [
    'Mostly computer work — in the office, at home or remotely.',
    'Agile teamwork: short daily meetings and small steps.',
    'Problem solving and constantly learning new languages and tools.',
    'A global job market: you can work from Kurdistan for a company abroad.'
  ],
  br: [
    ['Web Development', 'Websites and web apps: frontend and backend.'],
    ['Mobile Development', 'Android and iOS apps.'],
    ['AI & Data Science', 'Machine learning, data analysis and language models.'],
    ['DevOps & Cloud', 'Automated deployment, servers and cloud services.'],
    ['Cybersecurity', 'Protecting programs and data from attacks.'],
    ['Game Development', 'Computer and mobile games with Unity and Unreal.'],
    ['QA & Testing', 'Ensuring quality and finding bugs.'],
    ['UI/UX Design', 'Designing interfaces and the user experience.']
  ],
  jobs: ['Web developer (frontend / backend / full-stack)', 'Mobile app developer', 'AI and data engineer', 'DevOps and cloud engineer', 'Cybersecurity specialist', 'UI/UX designer', 'QA test engineer', 'Freelancer or startup founder'],
  tip: 'Your safety is mostly ergonomics: screen at eye level, a straight back and the 20-20-20 rule — every 20 minutes, look at something 20 feet (6 m) away for 20 seconds.',
  fact: 'The Apollo 11 guidance computer had only about 4 KB of RAM — millions of times less than your phone — yet its software landed humans safely on the Moon.',
  eng: [
    { n: 'Margaret Hamilton', from: 'USA',
      bio: 'Leader of the Apollo flight software team at MIT and the person who popularized the term “software engineering”.',
      story: 'Born in Indiana in 1936, she studied mathematics. At MIT she first wrote weather-prediction software and air-defense systems. She then led the team that wrote the software for the Apollo spacecraft computers. A famous photo shows her standing beside the printed Apollo code, as tall as she is. In 2016 she received the US Presidential Medal of Freedom.',
      p: [
        { n: 'Apollo flight software', at: 'MIT, USA', d: 'Minutes before the Apollo 11 landing the computer overloaded and raised an alarm (1202); the software prioritized the critical tasks and the landing succeeded.' },
        { n: 'SAGE air-defense software', at: 'MIT Lincoln Lab, USA', d: 'A huge radar-and-computer system for detecting enemy aircraft; one of the first real-time computing systems.' },
        { n: 'Universal Systems Language', at: 'Cambridge, USA', d: 'A language and method for designing systems so that errors are found before the code is written.' }
      ] },
    { n: 'Dennis Ritchie', from: 'USA',
      bio: 'Creator of the C language and co-creator of Unix. Most of today’s systems — Windows, Linux, macOS and Android — are built on his work.',
      story: 'Born in New York in 1941, he studied physics and mathematics at Harvard. At Bell Labs he created Unix with Ken Thompson and invented C to rewrite it. His book with Brian Kernighan, “The C Programming Language”, is considered one of the best programming books ever. He received the Turing Award in 1983. He died in 2011, a week after Steve Jobs, but with far less attention.',
      p: [
        { n: 'C language', at: 'Bell Labs, USA', d: 'A fast, close-to-the-machine language from which C++, Java, C# and Go descend; still one of the most used languages.' },
        { n: 'Unix', at: 'Bell Labs, USA', d: 'An operating system whose philosophy of “small tools that do one thing well” lives on in Linux and macOS.' },
        { n: 'Plan 9', at: 'Bell Labs, USA', d: 'An experimental operating system that treated everything on the network as a file; its ideas influenced newer systems.' }
      ] },
    { n: 'Linus Torvalds', from: 'Finland',
      bio: 'Creator of the Linux kernel and Git — two of the most important open-source programs in the world.',
      story: 'Born in Helsinki in 1969, at 21, as a student at the University of Helsinki, he began writing an operating system and said in a message, “just a hobby, won’t be big”. Thousands of developers around the world joined in. Today Linux runs Android, most internet servers and all of the world’s 500 fastest supercomputers.',
      p: [
        { n: 'Linux kernel', at: 'Helsinki, Finland', d: 'The core of an open operating system used by billions of devices: Android phones, servers, routers and smart TVs.' },
        { n: 'Git', at: 'Portland, USA', d: 'A version-control system he wrote in about 10 days; today almost every programmer and GitHub use it.' },
        { n: 'Subsurface', at: 'USA', d: 'An open-source dive-log program he wrote for his own hobby, scuba diving.' }
      ] },
    { n: 'Tim Berners-Lee', from: 'United Kingdom',
      bio: 'Inventor of the World Wide Web. He gave the web to the world for free, without a patent.',
      story: 'Born in London in 1955 to parents who both worked on one of the first computers, he studied physics at Oxford. In 1989 at CERN he wrote a proposal for sharing information among scientists, on which his manager wrote “vague but exciting”. He later founded the W3C to standardize the web. He received the Turing Award in 2016.',
      p: [
        { n: 'World Wide Web', at: 'CERN, Switzerland', d: 'The world’s first website (info.cern.ch) went live in 1991; today there are billions of web pages.' },
        { n: 'HTML & HTTP', at: 'CERN, Switzerland', d: 'The language for writing web pages and the protocol for sending them, along with URLs; the three cornerstones of the web.' },
        { n: 'First web browser', at: 'CERN, Switzerland', d: 'A browser called WorldWideWeb on a NeXT computer that could both read and edit pages.' }
      ] },
    { n: 'Grace Hopper', from: 'USA',
      bio: 'US Navy rear admiral and programming-language pioneer. She built the first compiler and popularized the term “bug”.',
      story: 'Born in New York in 1906, she earned a PhD in mathematics at Yale. In World War II she joined the Navy and was one of the first programmers of the Harvard Mark I. She believed programs should be written in a language close to English, which many people did not accept at the time. In 1947 her team found a real moth inside a computer. She retired at 79 as the oldest serving officer and died in 1992.',
      p: [
        { n: 'Harvard Mark I', at: 'Harvard, USA', d: 'A 15 m electro-mechanical computer; Hopper programmed it and wrote its manual.' },
        { n: 'A-0 compiler', at: 'Philadelphia, USA', d: 'One of the first compilers: a program that translates human-written code into machine code.' },
        { n: 'COBOL', at: 'USA', d: 'A business language built on her work; much of the world’s banking still runs on COBOL.' }
      ] },
    { n: 'Ada Lovelace', from: 'England',
      bio: 'The world’s first programmer. In 1843 she wrote the first algorithm for a machine and predicted computers would one day make music.',
      story: 'Born in London in 1815, the daughter of the famous poet Lord Byron. Her mother taught her mathematics and science to keep her from poetic fancy. At 17 she met Charles Babbage and was fascinated by his machines. In translating an article on the Analytical Engine she added notes three times longer than the article itself. She died in 1852 at 36. Ada Lovelace Day is held every October to honor women in science.',
      p: [
        { n: 'Note G — the first published algorithm', at: 'London, UK', d: 'She explained step by step how the Analytical Engine would compute Bernoulli numbers — the first computer program in history.' },
        { n: 'Notes on the Analytical Engine', at: 'London, UK', d: 'She wrote that the machine could process symbols and music, not only numbers — an idea a century ahead of computers.' },
        { n: 'Ada language (named after her)', at: 'US Department of Defense', d: 'A safety-focused programming language named after her and still used in aircraft, railways and military systems.' }
      ] },
    { n: 'Ken Thompson', from: 'USA',
      bio: 'Co-creator of Unix, inventor of UTF-8 — the encoding that lets Kurdish and every language be written on computers — and of the Go language.',
      story: 'Born in New Orleans in 1943, he studied electrical engineering at UC Berkeley. At Bell Labs in 1969 he wrote the first version of Unix on an old, small computer. He created the B language, the parent of C, and built a chess machine called Belle. In 1983 he shared the Turing Award with Ritchie. Later, at Google, he created the Go language.',
      p: [
        { n: 'Unix', at: 'Bell Labs, USA', d: 'He wrote the first version on a PDP-7 computer; the basis of Linux, macOS, iOS and Android.' },
        { n: 'UTF-8', at: 'New Jersey, USA', d: 'Designed with Rob Pike on a diner placemat; today used by over 98% of the world’s websites — including for these Kurdish letters.' },
        { n: 'Go language', at: 'Google, USA', d: 'A simple, fast language for servers and the cloud; Docker and Kubernetes are written in Go.' }
      ] },
    { n: 'James Gosling', from: 'Canada',
      bio: 'The “father of Java”. He created a language known for the slogan “write once, run anywhere”.',
      story: 'Born in Calgary, Canada, in 1955, he earned a PhD in computer science at Carnegie Mellon. At Sun Microsystems in 1991 he started a project for smart home devices whose language was first called “Oak”. It became Java and spread quickly across the web, banking and mobile. For a long time Java was the main language for Android apps.',
      p: [
        { n: 'Gosling Emacs', at: 'Carnegie Mellon, USA', d: 'The first version of the Emacs editor for Unix written in C.' },
        { n: 'NeWS window system', at: 'Sun Microsystems, USA', d: 'A network-based graphical interface system that pioneered sending code over the network for display.' },
        { n: 'Java', at: 'Sun Microsystems, USA', d: 'A language that runs on a “virtual machine”, so the same program runs on any system; used by billions of devices.' }
      ] },
    { n: 'Anders Hejlsberg', from: 'Denmark',
      bio: 'Designer of Turbo Pascal, Delphi, C# and TypeScript — one of the most influential programming-language designers.',
      story: 'Born in Copenhagen in 1960, he studied engineering at the Technical University of Denmark. At Borland he created the Turbo Pascal compiler and then Delphi. In 1996 he joined Microsoft and designed C# and the .NET platform. In 2012 he created TypeScript, which made JavaScript safer for large projects.',
      p: [
        { n: 'Turbo Pascal', at: 'Borland', d: 'A very fast, affordable compiler that combined editor and compiler in one program; a generation learned to code with it.' },
        { n: 'C#', at: 'Microsoft, USA', d: 'A modern language for Windows apps, the web and games; the Unity game engine is programmed in C#.' },
        { n: 'TypeScript', at: 'Microsoft, USA', d: 'JavaScript with types; it catches errors before the code runs and is now one of the most used languages on GitHub.' }
      ] },
    { n: 'John Carmack', from: 'USA',
      bio: 'Genius game programmer and creator of the Doom and Quake engines. A pioneer of 3D graphics and virtual reality (VR).',
      story: 'Born in Kansas in 1970, he did not finish university. In 1991 he co-founded id Software. He invented new graphics techniques that turned the ordinary computers of the time into 3D gaming machines. He released his games’ source code for free so people could learn from it. He later became CTO of Oculus and now works on artificial intelligence.',
      p: [
        { n: 'Doom engine', at: 'Texas, USA', d: 'A game engine that used BSP techniques to create a fast, 3D-like world on ordinary computers.' },
        { n: 'Quake engine', at: 'Texas, USA', d: 'One of the first fully 3D engines with online play; the basis of many famous later games.' },
        { n: 'Oculus Rift (VR)', at: 'California, USA', d: 'As CTO he helped turn the VR headset into a home device.' }
      ] }
  ]
};
