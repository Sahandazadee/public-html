// MY PUZZLE — the ten picture puzzles.
// Images live in assets/img/<id>.webp (3840×2560, 3:2) and assets/img/thumb/<id>.webp (900×600).
// `credit` and `source` name the photographer and the original free-licence page.

export const PUZZLES = [
  { id: 'american-autumn',   title: 'American Autumn',    place: 'Vermont, USA',          accent: '#ff7a1a', credit: '', source: '' },
  { id: 'balloon-sunrise',   title: 'Balloon Sunrise',    place: 'Cappadocia, Türkiye',   accent: '#ff5c8a', credit: '', source: '' },
  { id: 'neon-tokyo',        title: 'Neon Tokyo',         place: 'Shinjuku, Japan',       accent: '#7b5cff', credit: '', source: '' },
  { id: 'aurora-dance',      title: 'Aurora Dance',       place: 'Lofoten, Norway',       accent: '#00d68f', credit: '', source: '' },
  { id: 'turquoise-lagoon',  title: 'Turquoise Lagoon',   place: 'Maldives',              accent: '#00c2d1', credit: '', source: '' },
  { id: 'color-island',      title: 'Color Island',       place: 'Burano, Italy',         accent: '#ffcc00', credit: '', source: '' },
  { id: 'cherry-blossom',    title: 'Cherry Blossom',     place: 'Kyoto, Japan',          accent: '#ff8fb1', credit: '', source: '' },
  { id: 'lavender-fields',   title: 'Lavender Fields',    place: 'Provence, France',      accent: '#9b6bff', credit: '', source: '' },
  { id: 'liquid-color',      title: 'Liquid Color',       place: 'Fluid art',             accent: '#ff4d6d', credit: '', source: '' },
  { id: 'cosmic-cliffs',     title: 'Cosmic Cliffs',      place: 'Carina Nebula, JWST',   accent: '#ffb03b', credit: '', source: '' },
];

// Piece counts. Every board has a 3:2 ratio, so pieces stay square.
export const LEVELS = [
  { pieces: 54,  cols: 9,  rows: 6,  label: 'Relaxed',    points: 150 },
  { pieces: 96,  cols: 12, rows: 8,  label: 'Classic',    points: 300 },
  { pieces: 150, cols: 15, rows: 10, label: 'Masterpiece', points: 600 },
];

export const imageUrl = (id) => `assets/img/${id}.webp`;
export const thumbUrl = (id) => `assets/img/thumb/${id}.webp`;
