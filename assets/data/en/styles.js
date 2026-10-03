/* English — architectural styles */
window.I18N = window.I18N || {};
(function (L) {
  L.styles = {
    feat: 'Key features', idea: 'Idea & philosophy', mat: 'Materials', spot: 'How to recognise it:', build: 'Famous buildings', arch: 'Architects', palette: 'Colours of this style',
    era: {
      kurdish: '≈ 6,000 years – today', egypt: '3100 – 30 BC', greek: '800 – 146 BC', roman: '509 BC – AD 476', byzantine: '330 – 1453', islamic: '7th century – today',
      gothic: '1140 – 1500', renaissance: '1400 – 1600', baroque: '1600 – 1750', neoclassical: '1750 – 1850', nouveau: '1890 – 1914', deco: '1920 – 1940',
      bauhaus: '1919 – 1933', modern: '1920 – 1970', brutal: '1950 – 1980', postmodern: '1965 – 1995', hightech: '1970s – today', decon: '1980s – today',
      minimal: '1980s – today', parametric: '2000s – today', green: '1990s – today'
    },
    s: {
      kurdish: {
        n: 'Kurdish architecture & heritage',
        d: 'Kurdistan is one of the oldest places of human settlement. The Erbil Citadel has about 6,000 years of settlement history and is one of the oldest inhabited places in the world; it became a UNESCO World Heritage Site in 2014, and the stepped villages of Hawraman followed in 2021. Kurdish architecture is a clever answer to mountains, hot summers, cold winters and local materials.',
        idea: 'Building with nature, not against it: in Hawraman the roof of one house is the yard of the house above, so the village climbs the slope like a staircase and wastes no farmland.',
        feat: ['Stepped houses on mountain slopes — each roof is the yard of the house above', 'Thick stone or mud-brick walls that keep rooms cool in summer and warm in winter', 'Flat roofs of poplar beams, reeds and packed clay, compacted with a stone roller (bagirdan)', 'Courtyard houses in Erbil and Sulaimani, with an iwan and separate summer and winter rooms', 'Small, deep windows against cold, wind and strong sun', 'A citadel and covered bazaar (qaysari) at the heart of the town'],
        mat: 'Local stone (dry-laid or with mud), mud brick and fired brick, poplar and walnut timber, reeds, clay and gypsum.',
        spot: 'If a village climbs a mountain like a staircase and the roofs are people’s paths — that is Hawraman.'
      },
      egypt: {
        n: 'Ancient Egyptian architecture',
        d: 'It lasted about 3,000 years and produced pyramids, temples and great tombs. The pharaohs built for eternity, so they chose stone rather than mud brick. Imhotep, designer of Djoser’s Step Pyramid, is the first architect known to us by name.',
        idea: 'Architecture as a path to the afterlife and a sign of divine power: simple, colossal, eternal forms; order, symmetry and alignment with the stars matter greatly.',
        feat: ['Colossal scale and simple geometry (pyramids, pylons)', 'Hypostyle halls with massive columns shaped like papyrus and lotus stems', 'Battered (sloping) walls, thicker at the base', 'Hieroglyphs and colourful paintings on walls and columns', 'An axial sequence: avenue of sphinxes, gateway, courtyard and a dark sanctuary', 'Orientation to the sun and the stars'],
        mat: 'Sandstone, limestone and granite; mud brick for ordinary houses; copper and stone tools for cutting.',
        spot: 'Very thick, closely spaced columns, walls covered in hieroglyphs and huge sloping gateways.'
      },
      greek: {
        n: 'Classical Greek architecture',
        d: 'The Greeks made order, proportion and mathematical beauty the basis of architecture. They created the three column “orders” — Doric, Ionic and Corinthian — that we still see on banks, courts and universities. The Parthenon is the summit of the style.',
        idea: 'Beauty lies in proportion and balance: every part relates to the others by a fixed measure; man is the measure of all things.',
        feat: ['Column orders: Doric (plain), Ionic (scrolls), Corinthian (acanthus leaves)', 'A triangular pediment on the front, filled with sculpture', 'A rectangular temple surrounded by columns', 'Perfect symmetry and mathematical proportion', 'Optical corrections: columns swell slightly in the middle (entasis) and the base curves gently upward', 'A sculpted frieze above the columns'],
        mat: 'White marble (such as Pentelic marble), limestone and tufa; iron clamps to join the blocks.',
        spot: 'A row of white columns crowned by a large triangle — like the front of the Parthenon.'
      },
      roman: {
        n: 'Roman architecture',
        d: 'The Romans took Greek forms and turned them, through engineering, into huge buildings: the arch, the dome and Roman concrete. They built roads, bridges, aqueducts, baths and arenas across the empire; Vitruvius wrote the “Ten Books on Architecture”.',
        idea: 'Architecture serving the city and the state: usefulness, strength and beauty (utilitas, firmitas, venustas) — Vitruvius’ three principles, still taught today.',
        feat: ['Semicircular arches and arcades', 'Domes and vaults', 'Roman concrete made with volcanic pozzolana', 'Great public buildings: arenas, baths, markets and basilicas', 'Greek columns applied as decoration on arched walls', 'Aqueducts and multi-tier bridges'],
        mat: 'Roman concrete (lime + pozzolana + rubble), fired brick, travertine and marble.',
        spot: 'Repeating rows of round arches, like the Colosseum or the Pont du Gard.'
      },
      byzantine: {
        n: 'Byzantine architecture',
        d: 'It grew in Constantinople (Istanbul) and joined Roman engineering with Eastern splendour. Hagia Sophia (537) was the largest cathedral in the world for more than 900 years, and its dome seems to float in the air.',
        idea: 'The interior is an image of heaven: light, gold and the dome create a sense of the sacred; outside is plain, inside is rich.',
        feat: ['A huge dome over a square base, made possible by pendentives', 'A Greek-cross plan (four equal arms)', 'Gold and colourful mosaics inside', 'A ring of windows at the base of the dome that crowns it with light', 'Exterior walls of brick and stone laid in coloured bands', 'Half-domes that carry the loads down to the walls'],
        mat: 'Fired brick with thick mortar, coloured marble, gold glass mosaic.',
        spot: 'A great dome surrounded by half-domes and an interior glowing with gold mosaics.'
      },
      islamic: {
        n: 'Islamic architecture',
        d: 'From the 7th century it spread from al-Andalus to India, blending Roman, Byzantine and Sasanian traditions. The spiral Malwiya minaret of Samarra in Iraq, the Dome of the Rock, the Alhambra and the Taj Mahal are famous examples. Mimar Sinan alone built more than 300 buildings.',
        idea: 'Beauty through geometry, calligraphy and light rather than human images: endless geometric patterns, courtyards, water and shade create calm and unity.',
        feat: ['Domes and minarets', 'Pointed, horseshoe and multifoil arches', 'Muqarnas (stalactite vaulting) like a honeycomb', 'Geometric patterns, arabesques and Arabic calligraphy', 'Blue and turquoise tiles, and courtyards with pools and fountains', 'The iwan — a vaulted hall open to the courtyard'],
        mat: 'Brick, glazed tiles, carved stucco, stone and marble, carved wood.',
        spot: 'Domes, minarets, blue tiles and endlessly repeating geometric patterns.'
      },
      gothic: {
        n: 'Gothic architecture',
        d: 'It began in 12th-century France at the abbey of Saint-Denis. Gothic engineers turned thick walls into stained glass and raised their buildings towards the sky. Cologne Cathedral took 632 years to finish.',
        idea: 'Light as a sign of God: the taller and brighter the building, the closer to heaven; structure openly becomes beauty.',
        feat: ['Pointed arches that send loads more vertically', 'Rib vaults', 'Flying buttresses outside', 'Huge stained-glass windows and rose windows', 'Tall towers and sharp spires', 'Sculpture and gargoyles on the façade'],
        mat: 'Limestone and sandstone, stained glass, lead roofs, iron ties.',
        spot: 'A very tall building with pointed arches, external buttresses and a round rose window.'
      },
      renaissance: {
        n: 'Renaissance architecture',
        d: 'Born in 15th-century Florence, when architects returned to the proportions and principles of Greece and Rome. Brunelleschi built the dome of Florence Cathedral without centring — an engineering masterpiece; later Palladio spread the style around the world.',
        idea: 'Man is the centre of the world and mathematics is the language of beauty: symmetry, regular proportion and perspective.',
        feat: ['Perfect symmetry and mathematical proportion', 'A tall dome on a drum', 'Classical columns, pilasters and round arches', 'Regular rows of windows with triangular or arched heads', 'Horizontal façades in layers (rustication at the base)', 'Central plans — a circle or a square'],
        mat: 'Stone and marble, brick, plaster and stucco, strong timber for roofs.',
        spot: 'A calm, symmetrical façade with classical columns and a majestic dome.'
      },
      baroque: {
        n: 'Baroque architecture',
        d: 'It began in 17th-century Rome and served the Church and kings to display power and glory. Bernini and Borromini made curving, moving façades; the Palace of Versailles is its peak in France.',
        idea: 'Architecture as theatre: emotion, movement and wonder — light and shadow, curving forms and rich ornament overwhelm the visitor.',
        feat: ['Curved, undulating façades (in and out)', 'Lavish decoration: gold, sculpture and ceiling paintings', 'Dramatic play of light and shadow', 'Domes and oval plans', 'Great squares, gardens and fountains', 'Grand staircases and halls of mirrors'],
        mat: 'Stone, coloured marble, stucco, gilding, mirrors and frescoes.',
        spot: 'A façade full of movement and curves, and an interior where everything is gold and painting.'
      },
      neoclassical: {
        n: 'Neoclassical architecture',
        d: 'It arose in the mid-18th century as a reaction against Baroque excess and returned to the simplicity of Greece and Rome. The Brandenburg Gate, the Panthéon in Paris and the US Capitol are examples; it is still used for courts and parliaments.',
        idea: 'Reason, order and civic virtue — the ideas of the Enlightenment; a building should be clear, serious and dignified.',
        feat: ['Plain, regular façades with a large columned portico', 'A triangular pediment', 'A dome with a ring of columns around its drum', 'Little ornament and clean lines', 'Perfect symmetry', 'Broad steps in front of the entrance'],
        mat: 'Limestone and sandstone, marble, brick rendered in white stucco, wrought iron.',
        spot: 'A building like a Greek temple but bigger — often a court, museum or parliament.'
      },
      nouveau: {
        n: 'Art Nouveau',
        d: 'It appeared in late-19th-century Belgium and France and is known for natural ornament, flowing lines, iron and glass. In Barcelona Gaudí made buildings into living sculpture; in Brussels Horta turned iron into flowers and leaves.',
        idea: 'Nature is the best teacher: there are no straight lines in nature; art, engineering and craft should be one.',
        feat: ['“Whiplash” curving lines', 'Motifs of flowers, leaves, creatures and bones', 'Decorative ironwork and stained glass', 'Colourful ceramic tiles (Gaudí’s trencadís)', 'Irregular, organic windows and doors', 'Total design: furniture, lamps and door handles too'],
        mat: 'Wrought and cast iron, glass, ceramics, stone and carved wood.',
        spot: 'A wavy façade like bones or leaves, and ironwork like flowers.'
      },
      deco: {
        n: 'Art Deco',
        d: 'It took its name from the 1925 Paris exhibition and was the style of the jazz age, cars and aeroplanes. The Chrysler Building with its gleaming steel crown and the Empire State Building are the best examples; it also spread to cinemas, hotels and cars.',
        idea: 'The glamour and speed of the new age: strong geometry, shining materials and a feeling of progress and luxury.',
        feat: ['Stepped (ziggurat) forms and strong vertical lines', 'Sunburst, zigzag and chevron motifs', 'Shiny materials: chrome, stainless steel, coloured glass', 'Setbacks on tall buildings', 'Grand, richly decorated entrances', 'Bold colours: black, gold, white and deep green'],
        mat: 'Concrete, stainless steel, chrome, black marble, glass and aluminium.',
        spot: 'A tall building with a stepped, gleaming crown and sunburst ornament.'
      },
      bauhaus: {
        n: 'Bauhaus',
        d: 'A school founded by Walter Gropius in Weimar in 1919 that united art, craft, industry and architecture. It moved to Dessau in 1925 and was closed under Nazi pressure in 1933 — but its teachers carried the idea to America and the world.',
        idea: '“Form follows function”: no useless ornament; good design should be for everyone and made for industrial production.',
        feat: ['Simple geometry: rectangle, circle and triangle', 'Industrial glass walls (curtain walls)', 'Flat roofs', 'Free, asymmetric plans arranged by function', 'Primary colours — red, yellow and blue — on white and grey', 'No ornament — beauty lies in material and proportion'],
        mat: 'Steel, glass and concrete; industrial fabric and tubular steel for furniture.',
        spot: 'A white, plain building with long glass windows and a flat roof, without any ornament.'
      },
      modern: {
        n: 'Modernism & the International Style',
        d: 'Between 1920 and 1970 it became the shared language of the world. Le Corbusier set out his “Five Points of a New Architecture” and Mies van der Rohe said “less is more”; Frank Lloyd Wright showed organic modernism with Fallingwater.',
        idea: 'A house is “a machine for living in”: light, air, open plans and new technology for everyone; a link with nature.',
        feat: ['Le Corbusier’s five points: pilotis (columns lifting the building)', 'Free plan and free façade', 'Long horizontal ribbon windows', 'Roof gardens', 'Much glass and steel, clean lines', 'Indoor and outdoor flowing together'],
        mat: 'Reinforced concrete, steel, large glass panes; stone and timber in Wright’s and Aalto’s work.',
        spot: 'A white building on slender columns with ribbon windows and a flat roof — like the Villa Savoye.'
      },
      brutal: {
        n: 'Brutalism',
        d: 'The name comes from the French “béton brut”, raw concrete. After the Second World War it was used for public housing, universities and government buildings; the Barbican in London and Habitat 67 in Montreal are famous.',
        idea: 'Honesty of materials: concrete shows itself as it is, and structure and function are not hidden; architecture for society.',
        feat: ['Raw concrete with the imprint of timber formwork (board-marked)', 'Heavy, massive, sculptural forms', 'Small, deep, repeated windows', 'Exposed structure and services', 'Repeated modular blocks', 'Raised walkways and public courtyards'],
        mat: 'Exposed (unpainted) concrete, brick and steel.',
        spot: 'A huge grey concrete building still showing the marks of its timber moulds.'
      },
      postmodern: {
        n: 'Postmodernism',
        d: 'It arrived in the late 1960s as a reaction against the dryness of Modernism. Robert Venturi joked that “less is a bore” and brought colour, humour and historical symbols back into architecture.',
        idea: 'Architecture should speak to ordinary people: familiar symbols, colour, wit and references to history, used freely and without strict rules.',
        feat: ['Classical columns and pediments used at giant scale or with irony', 'Bold and pastel colours', 'Façades like posters or signs', 'Mixing of different styles (eclecticism)', 'Surprising, irregular forms', 'Meaning and story valued over pure function'],
        mat: 'Concrete and steel inside, but façades of stone, tiles, stucco and strong colour.',
        spot: 'A modern building wearing giant, colourful classical columns and pediments.'
      },
      hightech: {
        n: 'High-tech',
        d: 'It emerged in Britain and France in the 1970s and made technology and engineering the main beauty of a building. The Centre Pompidou (1977) put its pipes, stairs and structure on the façade; Norman Foster and Richard Rogers are its pioneers.',
        idea: 'The building as a machine: the structure and services (water, air and power) are proudly displayed, leaving the inside free to change.',
        feat: ['Exposed steel structure on the outside', 'Colour-coded pipes and ducts on the façade (one colour per service)', 'Lots of glass and glazed façades', 'Industrial prefabricated parts', 'Open, flexible interiors', 'External glass stairs and lifts'],
        mat: 'Steel, glass, aluminium, tension cables and technical plastics.',
        spot: 'A building whose pipes and structure show on the outside like a machine.'
      },
      decon: {
        n: 'Deconstructivism',
        d: 'It emerged in the 1980s and was named by MoMA’s 1988 exhibition. Frank Gehry, Daniel Libeskind and Zaha Hadid broke regular, balanced forms; the Guggenheim Museum Bilbao (1997) transformed a whole city.',
        idea: 'Breaking the rules: fractured, tilted and curving forms express the disorder and complexity of modern life; computers made these shapes buildable.',
        feat: ['Fractured, tilted, fragmented forms', 'No symmetry and few right angles', 'Curving metal skins', 'Structures that seem about to fall', 'Parts that collide and overlap', 'Designed with aerospace software (CATIA)'],
        mat: 'Titanium, stainless steel, glass, concrete and steel.',
        spot: 'A building that seems to break, twist or dance — like the Dancing House in Prague.'
      },
      minimal: {
        n: 'Minimalism',
        d: 'It grew from the 1980s, inspired by Mies van der Rohe’s “less is more” and Japanese Zen calm. Tadao Ando with concrete and light, and Peter Zumthor with stone and water, create quiet, peaceful spaces.',
        idea: 'Remove everything unnecessary until only the essential remains: emptiness, light, material and silence are part of the design.',
        feat: ['Extremely simple geometry', 'Few colours: white, grey and the colour of the material', 'Open space and natural light', 'No ornament — precision lies in joints and materials', 'One or two materials, repeated', 'A link with nature, water and sky'],
        mat: 'Smooth concrete, glass, natural stone, timber and steel.',
        spot: 'A silent building with smooth walls, the fewest lines and carefully chosen light — like Ando’s Church of the Light.'
      },
      parametric: {
        n: 'Parametricism',
        d: 'A 21st-century style designed with computers and equations. Patrik Schumacher named it in 2008; Zaha Hadid’s Heydar Aliyev Center in Baku is its best-known example.',
        idea: 'The building as a living system: form grows from rules and parameters (wind, sun, the movement of people) and all parts flow smoothly together.',
        feat: ['Continuous curved surfaces without corners', 'Algorithmic design (Grasshopper, Rhino)', 'A different part for every position (mass customisation)', 'Ground, walls and roof flowing into one', 'Gradually changing repeated patterns', 'Built with CNC machining and 3D printing'],
        mat: 'Steel, special concretes, GFRC and GFRP (glass-fibre reinforced concrete and plastic), curved glass.',
        spot: 'A building that flows like a wave or white fabric, without a single right angle.'
      },
      green: {
        n: 'Green & sustainable architecture',
        d: 'Architecture’s answer to climate change: buildings that use little energy, collect water and bring nature back into the city. Bosco Verticale in Milan carries about 800 trees and thousands of plants on its balconies.',
        idea: 'A building should be part of nature, not a burden on it: less energy, recycled materials, and human health and comfort (biophilic design).',
        feat: ['Green roofs and living walls', 'Solar panels and natural ventilation', 'Shading and orientation to the sun', 'Rainwater harvesting', 'Local and recycled materials', 'LEED, BREEAM and Passivhaus certification'],
        mat: 'CLT timber, low-carbon concrete, double glazing, solar panels and plants.',
        spot: 'A building with trees and plants on its balconies and roof, and solar panels on top.'
      }
    }
  };
})(window.I18N.en = window.I18N.en || {});
