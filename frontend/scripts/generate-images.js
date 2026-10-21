import fs from 'fs';
import path from 'path';

const baseDir = path.resolve('public/images/resources');

const items = [
  {
    folder: 'books',
    files: ['dsa-book.jpg', 'dsa-book.svg'],
    title: 'Data Structures & Algorithms',
    subtitle: 'CLRS 3rd Edition • Cormen',
    category: 'Books',
    accent: '#10b981',
    bg: '#064e3b',
    symbol: 'DSA',
    tag: 'Core CS'
  },
  {
    folder: 'books',
    files: ['engineering-maths.jpg', 'engineering-maths.svg'],
    title: 'Engineering Mathematics',
    subtitle: 'B.S. Grewal • Vol 1 & 2',
    category: 'Books',
    accent: '#059669',
    bg: '#065f46',
    symbol: '∫dx',
    tag: '1st Year'
  },
  {
    folder: 'books',
    files: ['fluid-mechanics.jpg', 'fluid-mechanics.svg'],
    title: 'Fluid Mechanics & Machines',
    subtitle: 'Dr. R.K. Bansal • 9th Ed',
    category: 'Books',
    accent: '#0d9488',
    bg: '#115e59',
    symbol: 'ρvg',
    tag: 'Mech Core'
  },
  {
    folder: 'books',
    files: ['signals-systems.jpg', 'signals-systems.svg'],
    title: 'Signals & Systems',
    subtitle: 'Alan V. Oppenheim • 2nd Ed',
    category: 'Books',
    accent: '#0284c7',
    bg: '#075985',
    symbol: 'x(t)',
    tag: 'ECE Core'
  },
  {
    folder: 'electronics',
    files: ['calculator.jpg', 'calculator.svg'],
    title: 'Casio Scientific Calculator',
    subtitle: 'fx-991ES Plus • Dual Power',
    category: 'Electronics',
    accent: '#6366f1',
    bg: '#3730a3',
    symbol: 'fx-991',
    tag: 'Exam Approved'
  },
  {
    folder: 'electronics',
    files: ['earphones.jpg', 'earphones.svg'],
    title: 'boAt BassHeads 242',
    subtitle: 'Extra Bass • Noise Isolating',
    category: 'Electronics',
    accent: '#8b5cf6',
    bg: '#5b21b6',
    symbol: '♪ ♫',
    tag: 'Audio'
  },
  {
    folder: 'electronics',
    files: ['desk-lamp.jpg', 'desk-lamp.svg'],
    title: 'LED Desk Study Lamp',
    subtitle: '3 Light Modes • USB Powered',
    category: 'Electronics',
    accent: '#eab308',
    bg: '#854d0e',
    symbol: '💡',
    tag: 'Study'
  },
  {
    folder: 'electronics',
    files: ['arduino.jpg', 'arduino.svg'],
    title: 'Arduino Uno R3 Starter Kit',
    subtitle: 'Board + Sensors + Jumper Wires',
    category: 'Electronics',
    accent: '#06b6d4',
    bg: '#155e75',
    symbol: 'UNO',
    tag: 'Hardware'
  },
  {
    folder: 'cycles',
    files: ['mountain-cycle.jpg', 'mountain-cycle.svg'],
    title: 'Hero Sprint 26T MTB',
    subtitle: '21-Speed Shimano • Serviced',
    category: 'Cycles',
    accent: '#10b981',
    bg: '#064e3b',
    symbol: '🚲',
    tag: 'Campus Ride'
  },
  {
    folder: 'cycles',
    files: ['atlas-cycle.jpg', 'atlas-cycle.svg'],
    title: 'Atlas MTB 26-Inch Cycle',
    subtitle: 'Sturdy Steel Frame • Low Maint',
    category: 'Cycles',
    accent: '#14b8a6',
    bg: '#134e4a',
    symbol: '🚲',
    tag: 'For Sale'
  },
  {
    folder: 'cycles',
    files: ['firefox-cycle.jpg', 'firefox-cycle.svg'],
    title: 'Firefox Road Runner',
    subtitle: '7-Speed Hybrid • Alloy Frame',
    category: 'Cycles',
    accent: '#059669',
    bg: '#047857',
    symbol: '🚲',
    tag: 'High Speed'
  },
  {
    folder: 'stationery',
    files: ['practical-notebooks.jpg', 'practical-notebooks.svg'],
    title: 'A4 Practical Notebooks (5x)',
    subtitle: '100 Pages Plain • Lab Ready',
    category: 'Stationery',
    accent: '#f59e0b',
    bg: '#78350f',
    symbol: '📓',
    tag: 'Lab Prep'
  },
  {
    folder: 'stationery',
    files: ['drawing-kit.jpg', 'drawing-kit.svg'],
    title: 'Staedtler Drawing Kit',
    subtitle: 'Compass + Divider + Set Squares',
    category: 'Stationery',
    accent: '#3b82f6',
    bg: '#1e3a8a',
    symbol: '📐',
    tag: 'Engg Drawing'
  },
  {
    folder: 'stationery',
    files: ['graph-papers.jpg', 'graph-papers.svg'],
    title: 'Graph Sheets & Record Covers',
    subtitle: '50 Sheets + 10 Hard Covers',
    category: 'Stationery',
    accent: '#10b981',
    bg: '#064e3b',
    symbol: '📊',
    tag: 'Submissions'
  },
  {
    folder: 'sports',
    files: ['cricket-bat.jpg', 'cricket-bat.svg'],
    title: 'Cosco Kashmir Willow Bat',
    subtitle: 'Full Size • Knocked & Ready',
    category: 'Sports',
    accent: '#ef4444',
    bg: '#7f1d1d',
    symbol: '🏏',
    tag: 'Cricket'
  },
  {
    folder: 'sports',
    files: ['badminton-racket.jpg', 'badminton-racket.svg'],
    title: 'Yonex Mavis 200i Pair',
    subtitle: '2 Rackets + 3 Nylon Shuttles',
    category: 'Sports',
    accent: '#ec4899',
    bg: '#831843',
    symbol: '🏸',
    tag: 'Badminton'
  },
  {
    folder: 'sports',
    files: ['football.jpg', 'football.svg'],
    title: 'Nivia Storm Football',
    subtitle: 'Size 5 • All-Weather TPU',
    category: 'Sports',
    accent: '#10b981',
    bg: '#064e3b',
    symbol: '⚽',
    tag: 'Match Ball'
  },
  {
    folder: 'hostel',
    files: ['immersion-rod.jpg', 'immersion-rod.svg'],
    title: 'Bajaj 1000W Immersion Rod',
    subtitle: 'Instant Water Heater • Safe Grip',
    category: 'Hostel Items',
    accent: '#f97316',
    bg: '#7c2d12',
    symbol: '⚡',
    tag: 'Winter Essential'
  },
  {
    folder: 'hostel',
    files: ['table-fan.jpg', 'table-fan.svg'],
    title: 'Usha Maxx Air Table Fan',
    subtitle: '3-Speed Oscillation • High Airflow',
    category: 'Hostel Items',
    accent: '#06b6d4',
    bg: '#164e63',
    symbol: '🌀',
    tag: 'Hostel Room'
  },
  {
    folder: 'hostel',
    files: ['mattress.jpg', 'mattress.svg'],
    title: 'Single Bed Foam Mattress',
    subtitle: '6-Inch High Density • Clean',
    category: 'Hostel Items',
    accent: '#8b5cf6',
    bg: '#4c1d95',
    symbol: '🛏️',
    tag: 'Hostel Cot'
  },
  {
    folder: 'hostel',
    files: ['study-chair.jpg', 'study-chair.svg'],
    title: 'Cushioned Folding Chair',
    subtitle: 'Sturdy Steel • Back Support',
    category: 'Hostel Items',
    accent: '#3b82f6',
    bg: '#1e3a8a',
    symbol: '🪑',
    tag: 'Ergonomic'
  },
  {
    folder: 'hostel',
    files: ['electric-kettle.jpg', 'electric-kettle.svg'],
    title: 'Prestige 1.5L Electric Kettle',
    subtitle: 'Auto Cut-Off • Fast Boiling',
    category: 'Hostel Items',
    accent: '#10b981',
    bg: '#064e3b',
    symbol: '☕',
    tag: 'Maggi & Tea'
  }
];

function createSvg(item) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${item.bg}"/>
      <stop offset="100%" stop-color="#021c14"/>
    </linearGradient>
    <radialGradient id="glow" cx="80%" cy="20%" r="50%">
      <stop offset="0%" stop-color="${item.accent}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${item.bg}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.03"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000" flood-opacity="0.4"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="800" height="500" fill="url(#grad)"/>
  <rect width="800" height="500" fill="url(#glow)"/>

  <!-- Decorative Pattern Grid -->
  <g opacity="0.08" stroke="#ffffff" stroke-width="1">
    <line x1="0" y1="100" x2="800" y2="100"/>
    <line x1="0" y1="200" x2="800" y2="200"/>
    <line x1="0" y1="300" x2="800" y2="300"/>
    <line x1="0" y1="400" x2="800" y2="400"/>
    <line x1="160" y1="0" x2="160" y2="500"/>
    <line x1="320" y1="0" x2="320" y2="500"/>
    <line x1="480" y1="0" x2="480" y2="500"/>
    <line x1="640" y1="0" x2="640" y2="500"/>
  </g>

  <!-- Central Card -->
  <rect x="60" y="50" width="680" height="400" rx="24" fill="url(#cardGrad)" stroke="#ffffff" stroke-opacity="0.2" stroke-width="1.5" filter="url(#shadow)"/>

  <!-- Tag Pill -->
  <g transform="translate(100, 90)">
    <rect width="130" height="36" rx="18" fill="${item.accent}" fill-opacity="0.25" stroke="${item.accent}" stroke-width="1.5"/>
    <text x="65" y="23" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">${item.tag}</text>
  </g>

  <!-- Campus Badge -->
  <g transform="translate(620, 90)">
    <circle cx="20" cy="18" r="18" fill="#ffffff" fill-opacity="0.15"/>
    <text x="20" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#ffffff" text-anchor="middle">CF</text>
  </g>

  <!-- Main Illustration Symbol -->
  <g transform="translate(400, 240)">
    <circle cx="0" cy="0" r="80" fill="${item.accent}" fill-opacity="0.2" stroke="${item.accent}" stroke-opacity="0.5" stroke-width="2"/>
    <text x="0" y="16" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="48" font-weight="800" fill="#ffffff" text-anchor="middle">${item.symbol}</text>
  </g>

  <!-- Title & Subtitle -->
  <text x="400" y="370" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="-0.5">${item.title}</text>
  <text x="400" y="405" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="500" fill="#cbd5e1" text-anchor="middle">${item.subtitle}</text>

  <!-- Category Bottom Left -->
  <text x="100" y="425" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="600" fill="${item.accent}" letter-spacing="1">${item.category.toUpperCase()}</text>
</svg>`;
}

items.forEach(item => {
  const dir = path.join(baseDir, item.folder);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const svgContent = createSvg(item);
  item.files.forEach(filename => {
    fs.writeFileSync(path.join(dir, filename), svgContent, 'utf-8');
  });
});

console.log(`Generated ${items.length} resource illustrations in public/images/resources/`);
