// MY PUZZLE — the ten picture puzzles.
// Photos come from Unsplash (free under the Unsplash License) and are stored in this repo:
//   assets/img/<id>.webp        3840×2560 (3:2) for computers and tablets
//   assets/img/m/<id>.webp      2400×1600 for phones (faster to load, less memory)
//   assets/img/thumb/<id>.webp  900×600 for the gallery cards
// `photo` is the Unsplash image id; `credit` is the photographer when the file names one.

export const PUZZLES = [
  { id: 'golden-autumn',    title: 'Golden Autumn',    place: 'Autumn forest reflections', accent: '#ff7a1a', credit: 'Ricardo Gomez Angel', photo: '1507371341162-763b5e419408' },
  { id: 'balloon-sunrise',  title: 'Balloon Sunrise',  place: 'Cappadocia, Türkiye',       accent: '#ff5c8a', credit: '', photo: '1641128324972-af3212f0f6bd' },
  { id: 'neon-tokyo',       title: 'Neon Tokyo',       place: 'Shibuya, Tokyo',            accent: '#7b5cff', credit: 'Jezar', photo: '1542051841857-5f90071e7989' },
  { id: 'northern-lights',  title: 'Northern Lights',  place: 'Aurora over the forest',    accent: '#00d68f', credit: '', photo: '1483347756197-71ef80e95f73' },
  { id: 'turquoise-lagoon', title: 'Turquoise Lagoon', place: 'Maldives',                  accent: '#00c2d1', credit: '', photo: '1573843981267-be1999ff37cd' },
  { id: 'venice-glow',      title: 'Venice Glow',      place: 'Grand Canal, Venice',       accent: '#ffb03b', credit: '', photo: '1514890547357-a9ee288728e0' },
  { id: 'fuji-in-bloom',    title: 'Fuji in Bloom',    place: 'Mount Fuji, Japan',         accent: '#ff8fb1', credit: '', photo: '1490806843957-31f4c9a91c65' },
  { id: 'lavender-sunset',  title: 'Lavender Sunset',  place: 'Lavender fields',           accent: '#9b6bff', credit: '', photo: '1499002238440-d264edd596ec' },
  { id: 'liquid-color',     title: 'Liquid Color',     place: 'Ink in water',              accent: '#ff4d6d', credit: '', photo: '1541701494587-cb58502866ab' },
  { id: 'cosmic-bubble',    title: 'Cosmic Bubble',    place: 'Bubble Nebula, deep space', accent: '#3fa7ff', credit: '', photo: '1462331940025-496dfbfc7564' },
];

// Piece counts. Every board has a 3:2 ratio, so pieces stay square.
export const LEVELS = [
  { pieces: 54,  cols: 9,  rows: 6,  label: 'Relaxed',    points: 150 },
  { pieces: 96,  cols: 12, rows: 8,  label: 'Classic',    points: 300 },
  { pieces: 150, cols: 15, rows: 10, label: 'Masterpiece', points: 600 },
];

// Phones get the 2400 px version: still sharp on a small screen, about half the download.
const isPhone = () => Math.min(screen.width, screen.height) < 700;
export const imageUrl = (id) => isPhone() ? `assets/img/m/${id}.webp` : `assets/img/${id}.webp`;
export const thumbUrl = (id) => `assets/img/thumb/${id}.webp`;
export const creditText = (p) => `Photo${p.credit ? ` by ${p.credit}` : ''} on Unsplash`;
