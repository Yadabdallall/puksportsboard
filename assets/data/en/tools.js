/* English — engineering calculators */
window.I18N = window.I18N || {};
(function (L) {
  L.tools = {
    disclaimer: 'Results are engineering estimates for planning, ordering materials and learning. For final design, follow your country’s code (e.g. ACI 318, IEC 60364, ASHRAE) and the responsible engineer.',
    secs: { civil: 'Civil & building', elec: 'Electrical', mech: 'Mechanical', conv: 'Unit converter' },
    secLabels: { civil: 'Civil & building engineering', elec: 'Electrical engineering', mech: 'Mechanical engineering', conv: 'For every field' },
    secTitles: { civil: 'Concrete, blocks|and rebar', elec: 'Cables, breakers|and lighting', mech: 'Split AC|and ducts', conv: 'Unit|converter' },
    common: { how: 'How is it calculated?', bad: 'Please enter valid numbers (zero or more).' },
    c: {
      concrete: {
        t: 'Cement, sand and gravel for concrete',
        d: 'Cement (bags), sand, gravel and water for a slab, footing, column or any concrete element.',
        f: { L: 'Length', W: 'Width', H: 'Thickness / height', n: 'Number of elements', grade: 'Mix ratio', waste: 'Waste allowance', bag: 'Cement bag' },
        o: { grade: { m10: '1:3:6 — about M10 (blinding, plain footings)', m15: '1:2:4 — about M15 (general work, ordinary slabs)', m20: '1:1.5:3 — about M20 (slabs, beams, columns)', m25: '1:1:2 — about M25 (high strength)' } },
        r: { vol: 'Concrete volume', bags: 'Cement bags', cement: 'Cement weight', sand: 'Sand', gravel: 'Gravel', water: 'Water', mix: 'Mix ratio', wc: 'Water–cement ratio' },
        how: 'Wet concrete volume × 1.54 = dry material volume (the voids between grains fill up). That volume is split by the mix ratio; cement density is 1440 kg/m³. These are nominal mixes; for important work a designed mix to ACI 211 is better.'
      },
      block: {
        t: 'Blocks and mortar',
        d: 'Number of blocks, mortar volume, cement and sand for a wall — after taking out doors and windows.',
        f: { L: 'Wall length', H: 'Wall height', open: 'Door & window area', size: 'Block size', joint: 'Joint thickness', mortar: 'Mortar ratio (cement : sand)', waste: 'Breakage allowance' },
        r: { area: 'Wall area', blocks: 'Number of blocks', perM2: 'Blocks per m²', mortarV: 'Mortar volume', bags: 'Cement bags (50 kg)', sand: 'Sand' },
        how: 'Blocks = area ÷ ((block length + joint) × (block height + joint)). Mortar is counted for the joints only and multiplied by 1.33 for dry volume. Hollow blocks need slightly less mortar.'
      },
      rebar: {
        t: 'Rebar weight',
        d: 'Rebar weight from diameter, length and count — with the number of 12 m bars to buy.',
        f: { d: 'Bar diameter', len: 'Length of each bar', count: 'Number of bars' },
        r: { kgm: 'Weight per metre', total: 'Total length', weight: 'Total weight', tonnes: 'In tonnes', bars12: '12 m bars' },
        how: 'Weight per metre = d² ÷ 162 (d in mm). It comes from the bar area × steel density (7850 kg/m³). Add laps and cutting waste separately.'
      },
      section: {
        t: 'Rebar for a concrete section',
        d: 'For a beam, column, slab, footing or wall: required steel area, number of bars and their weight from the steel ratio (ρ).',
        f: { type: 'Element', b: 'Width (b)', h: 'Depth / thickness (h)', len: 'Length', rho: 'Steel ratio (ρ)', d: 'Main bar diameter' },
        o: { type: { beam: 'Beam', column: 'Column', slab: 'Slab (one strip)', footing: 'Footing', wall: 'Concrete wall' } },
        r: { As: 'Required steel area (As)', nbars: 'Bars', main: 'Main steel weight', vol: 'Concrete volume', kgm3: 'kg per m³', est: 'Overall estimate incl. stirrups' },
        n: {
          n_beam: 'Beams: ACI 318 minimum is about 0.33 % (fy = 420 MPa); usual ratios are 0.8 % – 1.5 %.',
          n_column: 'Columns: ACI 318 keeps the steel ratio between 1 % and 8 %; in practice usually 1 % – 3 %.',
          n_slab: 'Slabs: the minimum for shrinkage and temperature is 0.18 % (ACI 318, fy = 420 MPa).',
          n_footing: 'Footings: minimum 0.18 %; the thickness is governed by shear and soil pressure.',
          n_wall: 'Walls: ACI 318 minimum is 0.12 % vertical and 0.20 % horizontal (bars ≤ 16 mm).'
        },
        how: 'As = ρ × b × h. Bars = As ÷ area of one bar (π d² / 4). Weight = bars × length × d² / 162. The "overall estimate" uses a typical kg per m³ for that element type, including stirrups and laps.'
      },
      cable: {
        t: 'Cable sizing',
        d: 'Cable size from current and voltage drop — with a matching breaker and a temperature correction for hot summers.',
        f: { sys: 'System', P: 'Load power', pf: 'Power factor', len: 'Cable length (one way)', vd: 'Max. voltage drop', mat: 'Conductor', method: 'Installation method', temp: 'Ambient temperature' },
        o: { sys: { 1: 'Single phase — 230 V', 3: 'Three phase — 400 V' }, mat: { cu: 'Copper (Cu)', al: 'Aluminium (Al)' }, method: { B1: 'In conduit on a wall (B1)', C: 'Clipped direct to a wall (C)' } },
        r: { Ib: 'Load current (Ib)', In: 'Breaker (In)', size: 'Cable size', Iz: 'Cable capacity (Iz)', vdrop: 'Voltage drop', volts: 'Voltage' },
        w: { tooBig: 'This load is too large for a single cable; use parallel cables, a higher voltage or a shorter run.' },
        how: 'Current: I = P ÷ (V × cos φ) — for three phase √3 × V. Then the smallest cable is chosen whose (1) capacity after temperature correction is ≥ the breaker and (2) voltage drop stays within the chosen limit. Tables: IEC 60364-5-52, PVC cable.'
      },
      breaker: {
        t: 'Breaker size',
        d: 'A suitable breaker (MCB/MCCB), trip curve and minimum cable for a load.',
        f: { sys: 'System', P: 'Load power', pf: 'Power factor', load: 'Load type', cont: 'Continuous load (3 h or more)' },
        o: { sys: { 1: 'Single phase — 230 V', 3: 'Three phase — 400 V' }, load: { light: 'Lighting and heaters', socket: 'Sockets and general load', motor: 'Motors, pumps, split AC', heavy: 'Transformers and large motors' }, cont: { yes: 'Yes', no: 'No' } },
        r: { Ib: 'Load current', need: 'Design current', In: 'Breaker', curve: 'Curve', kind: 'Type', cable: 'Minimum cable' },
        n: { rcd: 'For sockets, bathrooms and wet areas add a 30 mA RCD to protect lives.' },
        how: 'For continuous loads: In ≥ 1.25 × Ib (as in the NEC), then the next standard rating. Curve B for lighting, C for motors, D for loads with very high inrush current. The cable’s Iz must always be ≥ In.'
      },
      lux: {
        t: 'Room lighting (lux)',
        d: 'Number of luminaires and their layout to reach the lighting level a room needs, following EN 12464-1.',
        f: { L: 'Room length', W: 'Room width', room: 'Room type', E: 'Required illuminance', lm: 'Lumens per luminaire', uf: 'Utilisation factor', mf: 'Maintenance factor', eff: 'Luminaire efficacy' },
        o: { room: { corridor: 'Corridor (100 lx)', bedroom: 'Bedroom (150 lx)', living: 'Living room (200 lx)', kitchen: 'Kitchen (300 lx)', classroom: 'Classroom (300 lx)', office: 'Office (500 lx)', meeting: 'Meeting room (500 lx)', drawing: 'Technical drawing (750 lx)', workshop: 'Workshop (500 lx)', hospital: 'Examination room (1000 lx)', parking: 'Car park (75 lx)' } },
        r: { area: 'Area', flux: 'Total lumens needed', n: 'Luminaires', grid: 'Layout', achieved: 'Achieved illuminance', power: 'Total power', wm2: 'Power per m²' },
        how: 'Lumen method: N = E × A ÷ (Φ × UF × MF). E is the required illuminance (lux), A the area, Φ the lumens of one luminaire, UF the share of light that reaches the working plane (about 0.5 – 0.7) and MF the loss over time and dirt (about 0.8).'
      },
      ac: {
        t: 'Split AC size (BTU / tons)',
        d: 'Cooling load in BTU/h and tons for a room — tuned for the hot climate of Kurdistan and Iraq.',
        f: { L: 'Room length', W: 'Room width', H: 'Ceiling height', people: 'People', climate: 'Climate', sun: 'Sun', kitchen: 'Kitchen?', equip: 'Equipment (TV, computers…)' },
        o: { climate: { moderate: 'Moderate (≈ 35 °C)', hot: 'Hot — Kurdistan summer (≈ 45 °C)', veryhot: 'Very hot — south Iraq & Gulf (≈ 50 °C)' }, sun: { shade: 'Shaded / north', normal: 'Normal', sunny: 'Very sunny / top floor' }, kitchen: { no: 'No', yes: 'Yes' } },
        r: { area: 'Area', btu: 'Cooling load', ton: 'Tons', kw: 'Kilowatts (cooling)', unit: 'Suggested split unit', cfm: 'Air flow' },
        how: 'Quick estimate: area × load per m² for the climate × (ceiling height ÷ 2.7) × sun factor, + 600 BTU/h for every person above 2, + 4000 for a kitchen, + watts × 3.412 for equipment. 1 ton = 12,000 BTU/h. For detailed design use ASHRAE (CLTD/RTS methods).'
      },
      duct: {
        t: 'Duct sizing',
        d: 'Round and rectangular duct size from air flow and velocity — with the pressure loss.',
        f: { Q: 'Air flow', qu: 'Air flow unit', v: 'Air velocity', hh: 'Rectangular duct height' },
        r: { A: 'Required area', D: 'Theoretical diameter', Ds: 'Round duct (standard)', rect: 'Rectangular duct (width × height)', vAct: 'Actual velocity', fric: 'Pressure loss' },
        w: { aspect: 'Width-to-height ratio is above 4; choose a taller duct to reduce noise and pressure loss.' },
        how: 'Velocity method: A = Q ÷ v and D = √(4A/π). The rectangle is made equivalent to the round duct with the Huebscher equation (same pressure loss). Suggested velocities: main ducts 4 – 6 m/s in homes, 6 – 9 m/s in commercial buildings; branches 2.5 – 4 m/s. 1 ton ≈ 400 CFM.'
      },
      conv: {
        t: 'Unit converter',
        d: 'Length, area (with the dunam), volume, mass, force, pressure, power, energy, flow and temperature.',
        cat: 'Quantity', value: 'Value', from: 'From', to: 'To', swap: 'Swap',
        cats: { length: 'Length', area: 'Area', volume: 'Volume', mass: 'Mass', force: 'Force', pressure: 'Pressure & stress', power: 'Power', energy: 'Energy', flow: 'Flow rate', temp: 'Temperature' }
      }
    }
  };
})(window.I18N.en = window.I18N.en || {});
