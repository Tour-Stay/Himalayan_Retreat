import { useEffect, useMemo, useRef, useState } from 'react';

/* ===================================================================== */
/*  MANDIR MALA 2026 — fully designed 2D illustrated map (pure SVG/CSS)   */
/*  No image file, no WebGL. Every place is vector art with its own       */
/*  hover animation. Coordinates live in a 617 x 822 design space.        */
/* ===================================================================== */

const W = 617;
const H = 822;
const ZOOM = 1.85;
const SERIF = "'Marcellus', Georgia, serif";
const SANS = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";

/* ----------------------------- the road ------------------------------ */
// Progressive ascending road from Haldwani (bottom) -> Kasar Hotel -> Adi Kailash (top)
const ROAD = [
  [190, 785], [155, 735], [135, 695], [195, 675], [260, 665],
  [360, 655], [440, 645], [455, 605], [375, 580], [260, 565],
  [160, 550], [140, 510], [230, 485], [350, 475], [440, 465],
  [455, 425], [365, 405], [255, 395], [170, 385], [145, 345],
  [235, 325], [345, 312], [445, 305], [440, 260], [365, 225],
  [260, 195],
];

const buildRoad = (pts) => {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  const samples = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`;
    for (let k = 1; k <= 10; k++) {
      const t = k / 10, u = 1 - t;
      samples.push([
        u * u * u * p1[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * p2[0],
        u * u * u * p1[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * p2[1],
      ]);
    }
  }
  return { d, samples };
};
const ROAD_PATH = buildRoad(ROAD);

/* ----------------------------- the places ---------------------------- */
// Ordered by distance from Haldwani (Pickup Point) & based around our Hotel in Kasar Devi
const STOPS = [
  { id: 'base-camp', label: ['HALDWANI BASE', { sub: '0 km • Pickup Hub (1,450 FT)' }], x: 155, y: 735, plaque: [15, 26], hit: [-65, -75, 150, 100] },
  { id: 'kainchi-dham', label: ['KAINCHI DHAM', { sub: '42 km • Neem Karoli Baba Ashram' }], x: 440, y: 645, plaque: [-10, 26], hit: [-65, -75, 150, 115] },
  { id: 'kasar-devi', label: ['THE KASAR HEIGHTS', { sub: '88 km • Retreat Base (6,942 FT)' }], x: 160, y: 550, plaque: [15, 26], hit: [-65, -75, 150, 115] },
  { id: 'chitai-golu', label: ['CHITAI GOLU DEVTA', { sub: '98 km • Temple of Bells' }], x: 440, y: 465, plaque: [-10, 26], hit: [-65, -75, 150, 115] },
  { id: 'jageshwar-dham', label: ['JAGESHWAR DHAM', { sub: '125 km • Shiva Temples' }], x: 170, y: 385, plaque: [15, 30], hit: [-70, -70, 150, 115] },
  { id: 'patal-bhuvaneshwar', label: ['PATAL BHUVANESHWAR', { sub: '195 km • Sacred Cave' }], x: 445, y: 305, plaque: [-10, 32], hit: [-75, -65, 155, 115] },
  { id: 'adi-kailash', label: ['ADI KAILASH', { sub: '365 km • 14,750 FT Peak' }], x: 260, y: 195, plaque: [0, 26], hit: [-85, -100, 175, 175] },
];

/* ----------------------------- pine forest --------------------------- */
const TREES = (() => {
  let a = 1234567;
  const rnd = () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = [];
  for (let y = 228; y <= 772; y += 17) {
    for (let x = 60; x <= 558; x += 19) {
      const px = x + (rnd() - 0.5) * 16, py = y + (rnd() - 0.5) * 12;
      if (rnd() > 0.5) continue;
      if (ROAD_PATH.samples.some(([rx, ry]) => Math.hypot(rx - px, ry - py) < 16)) continue;
      if (STOPS.some((s) => px > s.x + s.hit[0] - 8 && px < s.x + s.hit[0] + s.hit[2] + 8 && py > s.y + s.hit[1] - 6 && py < s.y + s.hit[1] + s.hit[3] + 6)) continue;
      if (py > 556 && Math.abs(px - (248 + (py - 560) * 0.4)) < 34 + (py - 560) * 0.1) continue;
      out.push({ x: px, y: py, s: 0.5 + rnd() * 0.5 + (py - 228) / 1500, v: rnd() > 0.5 ? 'a' : 'b' });
    }
  }
  return out.sort((p, q) => p.y - q.y);
})();

/* ----------------------- frame ornaments ----------------------------- */
// Cream blossom with gold centre and two leaves, used at frame corners
const Blossom = ({ x, y, r = 7 }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={-r * 0.9} cy={r * 0.5} rx={r * 0.7} ry={r * 0.28} fill="#4f7a3a" stroke="#2f5a25" strokeWidth=".4" transform={`rotate(-35 ${-r * 0.9} ${r * 0.5})`} />
    <ellipse cx={r * 0.9} cy={r * 0.5} rx={r * 0.7} ry={r * 0.28} fill="#4f7a3a" stroke="#2f5a25" strokeWidth=".4" transform={`rotate(35 ${r * 0.9} ${r * 0.5})`} />
    {[0, 72, 144, 216, 288].map((a) => (
      <ellipse key={a} cx="0" cy={-r * 0.55} rx={r * 0.38} ry={r * 0.55} fill="#f7f1e1" stroke="#b9a277" strokeWidth=".4" transform={`rotate(${a})`} />
    ))}
    <circle r={r * 0.26} fill="#EAA722" />
  </g>
);

// Green leaf for garlands
const Leaf = ({ x, y, a = 0, rx = 9 }) => (
  <ellipse cx={x} cy={y} rx={rx} ry={rx * 0.42} fill="#4f7a3a" stroke="#2f5a25" strokeWidth=".4" transform={`rotate(${a} ${x} ${y})`} />
);

// Small gold diamond used along carved columns
const Diamond = ({ x, y, s = 3 }) => (
  <path d={`M${x},${y - s} L${x + s * 0.7},${y} L${x},${y + s} L${x - s * 0.7},${y} Z`} fill="#c9a65a" fillOpacity=".55" />
);

// Mountain emblem used on footer and side panels
const MountainIcon = ({ x, y, s = 1, c = '#c9a65a' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-12,8 L-4,-6 L0,0 L4,-8 L12,8 Z" fill={c} opacity=".9" />
    <path d="M-4,-6 L-2,-2 L-4,-3 L-6,-1 Z M4,-8 L6,-4 L4,-5 L2,-3 Z" fill="#f4f8fb" opacity=".8" />
  </g>
);

const Plaque = ({ lines, num }) => {
  const rows = lines.map((l) => (typeof l === 'string' ? { t: l, sub: false } : { t: l.sub, sub: true }));
  const w = Math.max(...rows.map((r) => r.t.length * (r.sub ? 5.2 : 7.2))) + 26;
  const h = rows.reduce((n, r) => n + (r.sub ? 11 : 14), 0) + 8;
  let cy = -h / 2 + 5;
  return (
    <g className="mm-plaque">
      <rect className="mm-board" x={-w / 2} y={-h / 2} width={w} height={h} rx="5" strokeWidth="1.2" />
      <rect x={-w / 2 + 2} y={-h / 2 + 2} width={w - 4} height={h - 4} rx="3.5" fill="none" stroke="#c9a65a" strokeOpacity=".4" strokeWidth=".7" />
      {rows.map((r, i) => {
        cy += r.sub ? 11 : 14;
        return (
          <text
            key={i}
            x="0"
            y={cy - (r.sub ? 3 : 3.5)}
            textAnchor="middle"
            fontFamily={r.sub ? SANS : SERIF}
            fontWeight={r.sub ? 500 : 700}
            fontStyle="normal"
            fontSize={r.sub ? 8 : 11}
            letterSpacing={r.sub ? 0.2 : 0.6}
            fill="#f6e6bd"
          >
            {r.t}
          </text>
        );
      })}
      <g transform={`translate(${-w / 2} ${-h / 2})`}>
        <circle className="mm-badge" r="8.5" strokeWidth="1.4" />
        <text textAnchor="middle" y="3.2" fontFamily={SANS} fontWeight="700" fontSize="8.5" fill="#081E1A">{num}</text>
      </g>
    </g>
  );
};

/* ----------------------------- art helpers --------------------------- */
// Deodar pine cedar tree helper
const Deodar = ({ x = 0, y = 0, s = 1, c = '#245a35' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-1.3" y="-4" width="2.6" height="5" fill="#3d2716" />
    <path d="M0,-34 L10,-14 L5,-14 L12,-4 L-12,-4 L-5,-14 L-10,-14 Z" fill={c} />
    <path d="M0,-34 L10,-14 L5,-14 L12,-4 L5,-4 Z" fill="#163a22" opacity=".45" />
  </g>
);

// North-Indian shikhara: tapered spire with banded rings, plinth, arched doorway, kalash finial
const Shikhara2 = ({ x, base, w, h, c = '#7d776b', band = '#4f4a40', bands = 3, door = true, cls = 'mm-sh' }) => {
  const pb = h * 0.14;
  const top = base - h;
  const b = base - pb;
  const sh = b - top;
  const halfAt = (t) => (w / 2) * Math.pow(1 - t, 0.55) * 0.92;
  const spire = `M${x - w / 2},${b} C${x - w * 0.32},${b - sh * 0.45} ${x - w * 0.1},${b - sh * 0.8} ${x},${top} C${x + w * 0.1},${b - sh * 0.8} ${x + w * 0.32},${b - sh * 0.45} ${x + w / 2},${b} Z`;
  const doorH = Math.min(h * 0.2, sh * 0.5);
  return (
    <g className={cls}>
      <rect x={x - w / 2 - 1.5} y={b} width={w + 3} height={pb} fill="#4d483f" />
      <path d={spire} fill={c} stroke="#3e3a32" strokeWidth=".5" />
      <path d={`M${x},${top} C${x + w * 0.1},${b - sh * 0.8} ${x + w * 0.32},${b - sh * 0.45} ${x + w / 2},${b} L${x},${b} Z`} fill="#000" opacity=".18" />
      {Array.from({ length: bands }, (_, i) => {
        const t = 0.3 + (i * 0.5) / Math.max(bands, 1);
        const yy = b - sh * t;
        const hw = halfAt(t) * 0.95;
        return <path key={i} d={`M${x - hw},${yy} Q${x},${yy + 1.2} ${x + hw},${yy}`} stroke={band} strokeWidth="1" fill="none" />;
      })}
      {door && (
        <path d={`M${x - w * 0.1},${b} L${x - w * 0.1},${b - doorH + w * 0.05} Q${x - w * 0.1},${b - doorH} ${x},${b - doorH} Q${x + w * 0.1},${b - doorH} ${x + w * 0.1},${b - doorH + w * 0.05} L${x + w * 0.1},${b} Z`} fill="#1f1b16" />
      )}
      <ellipse cx={x} cy={top + sh * 0.07} rx={w * 0.09} ry="1.4" fill={band} />
      <path d={`M${x},${top + 1} L${x},${top - 4}`} stroke="#c9a65a" strokeWidth=".8" />
      <circle cx={x} cy={top - 5} r="1.1" fill="#EAA722" />
    </g>
  );
};

/* ----------------------------- place artwork ------------------------- */

// Haldwani: railway station gate with a platform, station building, and taxi stand with yellow cab
const BaseCampArt = () => (
  <g>
    <rect x="-66" y="-3" width="132" height="5" fill="#b8ae98" stroke="#7d7464" strokeWidth=".5" />
    <rect x="-64" y="-30" width="40" height="28" fill="#efe3c4" stroke="#8a7a5a" strokeWidth=".6" />
    <path d="M-68,-30 L-44,-40 L-20,-30 Z" fill="#b5452e" stroke="#7a2a18" strokeWidth=".5" />
    {[-60, -52, -44, -36, -28].map((wx) => (
      <rect key={wx} x={wx} y="-20" width="4" height="7" fill="#4a3a28" />
    ))}
    <rect x="-22" y="-30" width="6" height="30" fill="url(#mm-stone)" stroke="#4a443a" strokeWidth=".5" />
    <rect x="16" y="-30" width="6" height="30" fill="url(#mm-stone)" stroke="#4a443a" strokeWidth=".5" />
    <path d="M-22,-30 Q0,-44 22,-30 L22,-24 Q0,-38 -22,-24 Z" fill="#e8c98a" stroke="#6d5a3a" strokeWidth=".7" />
    <rect x="-14" y="-44" width="28" height="7" rx="1.5" fill="#d9822b" stroke="#6d3a10" strokeWidth=".5" />
    <text x="0" y="-38.8" textAnchor="middle" fontFamily={SERIF} fontWeight="700" fontSize="5" letterSpacing=".4" fill="#fff6dc">HALDWANI</text>
    <rect x="30" y="-40" width="30" height="9" rx="1.5" fill="#EAA722" stroke="#6d4a10" strokeWidth=".5" />
    <text x="45" y="-33.6" textAnchor="middle" fontFamily={SERIF} fontWeight="700" fontSize="5" fill="#3d0f06">TAXI STAND</text>
    <path d="M32,-31 L32,-14" stroke="#3d2716" strokeWidth="1" />
    <path d="M58,-31 L58,-14" stroke="#3d2716" strokeWidth="1" />
    <rect x="30" y="-13" width="32" height="9" rx="2" fill="#f5c518" stroke="#8a6a10" strokeWidth=".5" />
    <path d="M36,-13 L40,-19 L52,-19 L57,-13 Z" fill="#f5c518" stroke="#8a6a10" strokeWidth=".5" />
    <path d="M41,-13 L43,-17.5 L49,-17.5 L52,-13 Z" fill="#9fc3d6" />
    <rect x="43" y="-21" width="6" height="2" fill="#fff3b0" stroke="#8a6a10" strokeWidth=".3" />
    <rect x="58" y="-11" width="3" height="2" fill="#ffe59a" />
    <circle cx="37" cy="-4" r="2.6" fill="#161616" />
    <circle cx="55" cy="-4" r="2.6" fill="#161616" />
    <circle cx="37" cy="-4" r="1" fill="#9a9a9a" />
    <circle cx="55" cy="-4" r="1" fill="#9a9a9a" />
    <path d="M-68,2 L-68,-34" stroke="#3d2716" strokeWidth="1" />
    <path className="mm-flag" fill="#d23a2a" d="M-68,-34 l10,2 l-10,6 Z" />
  </g>
);

// Kainchi Dham: unchanged
const KainchiArt = () => (
  <g>
    <Deodar x={-56} y={2} s={1.2} />
    <Deodar x={58} y={2} s={1.15} />
    <Deodar x={-36} y={-6} s={.9} c="#2b5a36" />
    <Deodar x={40} y={-6} s={.95} c="#2b5a36" />
    <rect x="-48" y="-12" width="96" height="12" fill="#f4eee0" stroke="#b8ae98" strokeWidth=".6" />
    {[[-34, -22, 22], [30, -22, 22]].map(([bx, by, bw], i) => (
      <g key={i}>
        <rect x={bx - bw / 2} y={by} width={bw} height="13" fill="#fbf8ef" stroke="#b8ae98" strokeWidth=".5" />
        <path d={`M${bx - bw / 2 - 3},${by + 1} L${bx},${by - 8} L${bx + bw / 2 + 3},${by + 1} Z`} fill="#b5452e" />
        <rect x={bx - 2} y={by + 5} width="4" height="8" fill="#6b4a2a" opacity=".6" />
      </g>
    ))}
    <rect x="-13" y="-42" width="26" height="30" fill="#fdfaf1" stroke="#b8ae98" strokeWidth=".6" />
    <path d="M-15,-42 Q-12,-50 -8,-54 Q-4,-62 0,-66 Q4,-62 8,-54 Q12,-50 15,-42 Z" fill="#e3962c" stroke="#8a5a10" strokeWidth=".5" />
    <path d="M0,-66 L0,-72" stroke="#EAA722" strokeWidth="1" />
    <circle cx="0" cy="-73" r="1.6" fill="#EAA722" />
    <rect x="-4" y="-28" width="8" height="16" rx="4" fill="#4a2a14" />
    <path d="M16,-30 L16,-62" stroke="#3d2716" strokeWidth=".9" />
    <path className="mm-flag" fill="#e4572e" d="M16.5,-62 L28,-58 L16.5,-54 Z" />
    {[[-6, -68], [6, -64]].map(([sx, sy], i) => (
      <circle key={i} className="mm-smoke" cx={sx} cy={sy} r="2.6" fill="#fff" style={{ '--i': `${i * 0.7}s` }} />
    ))}
  </g>
);

// Kasar Heights: multi-storey stone and timber hotel on a hillside, balconies, lit windows
const KasarArt = () => (
  <g>
    <Deodar x={-52} y={2} s={1.3} />
    <Deodar x={54} y={2} s={1.25} />
    <path d="M-40,2 L-40,-6 L40,-6 L40,2 Z" fill="#8a8170" stroke="#5a5244" strokeWidth=".5" />
    {[
      { top: -18, x: -34, w: 68 },
      { top: -31, x: -30, w: 60 },
      { top: -44, x: -27, w: 54 },
    ].map((f, i) => (
      <g key={i}>
        <rect x={f.x} y={f.top} width={f.w} height="12" fill="#efe4cb" stroke="#b8ae98" strokeWidth=".4" />
        <rect x={f.x - 2} y={f.top - 2} width={f.w + 4} height="2.2" fill="#6b4a2a" />
        {Array.from({ length: Math.floor(f.w / 10) }, (_, k) => (
          <rect key={k} className="mm-win" x={f.x + 4 + k * 10} y={f.top + 3} width="5" height="6" fill="#ffd76a" opacity=".85" />
        ))}
      </g>
    ))}
    <path d="M-30,-44 L-6,-56 L-6,-48 L-30,-44 Z" fill="#2f5a3e" />
    <path d="M-30,-44 L0,-58 L28,-44 Z" fill="#2f5a3e" />
    <path d="M-28,-44 L28,-44 L28,-42 L-28,-42 Z" fill="#1f3d2a" />
    <rect x="-3" y="-64" width="5" height="8" fill="#8a7d6a" />
    {[-22, 14].map((lx) => <circle key={lx} cx={lx} cy="-24" r="1" fill="#ffe59a" />)}
  </g>
);

// Chitai Golu Devta: white dome shrine with red roofs and walls hung with bells
const ChitaiArt = () => (
  <g>
    <Deodar x={-56} y={2} s={1.1} />
    <Deodar x={58} y={2} s={1.1} />
    <rect x="-42" y="-6" width="84" height="6" fill="#9a9385" />
    <rect x="-40" y="-24" width="80" height="18" fill="#e9dcc4" stroke="#b8ae98" strokeWidth=".5" />
    <path d="M-16,-36 Q-16,-54 0,-62 Q16,-54 16,-36 Z" fill="#f6e9e6" stroke="#b8ae98" strokeWidth=".6" />
    <path d="M0,-62 L0,-68" stroke="#EAA722" strokeWidth="1" />
    <circle cx="0" cy="-69" r="1.8" fill="#EAA722" />
    <rect x="-6" y="-24" width="12" height="18" fill="#5a2a1a" />
    <path d="M-44,-24 L-34,-34 L34,-34 L44,-24 Z" fill="#b5452e" stroke="#7a2a18" strokeWidth=".5" />
    <rect x="-44" y="-26" width="88" height="2.5" fill="#d9a33a" />
    {Array.from({ length: 14 }, (_, i) => {
      const x = -36 + i * 5.5;
      if (Math.abs(x) < 9) return null;
      return (
        <g key={i} className="mm-bell" style={{ '--i': `${i * 0.08}s` }} transform={`translate(${x} -24)`}>
          <path d="M0,0 L0,3" stroke="#8a6a1a" strokeWidth=".5" />
          <path d="M-1.8,8 Q-1.8,4 0,4 Q1.8,4 1.8,8 Z" fill={i % 2 ? '#EAA722' : '#d23a2a'} />
        </g>
      );
    })}
    {[-50, 50].map((dx) => (
      <g key={dx}>
        <rect x={dx - 3} y="-16" width="6" height="12" fill="#d9c29c" />
        <circle cx={dx} cy="-18" r="1.4" fill="#EAA722" />
      </g>
    ))}
  </g>
);

// Jageshwar Dham: grey shikhara cluster among deodars, tall wooden-balcony tower at the back
const JageshwarArt = () => (
  <g>
    <Deodar x={-60} y={6} s={1.3} />
    <Deodar x={62} y={6} s={1.25} />
    <Deodar x={-42} y={-4} s={.95} c="#2b5a36" />
    <Deodar x={46} y={-2} s={.9} c="#2b5a36" />

    {/* courtyard stone */}
    <path d="M-62,20 L62,20 L62,26 L-62,26 Z" fill="#8c8576" />
    <rect x="-62" y="23" width="124" height="3" fill="#a89f8c" opacity=".7" />
    <ellipse cx="-30" cy="22" rx="10" ry="1.5" fill="#4f7a45" opacity=".5" />
    <ellipse cx="34" cy="22" rx="12" ry="1.5" fill="#4f7a45" opacity=".5" />

    {/* back wooden-balcony tower on the right */}
    <rect x="44" y="-74" width="18" height="78" fill="#7b7366" stroke="#3e3a32" strokeWidth=".5" />
    <path d="M40,-74 L66,-74 L63,-79 L43,-79 Z" fill="#6b4a2a" />
    <rect x="41" y="-52" width="24" height="3" fill="#6b4a2a" />
    <path d="M42,-49 L64,-49 M42,-44 L64,-44" stroke="#3d2716" strokeWidth=".6" />
    {[43, 48, 53, 58, 63].map((px) => <path key={px} d={`M${px},-49 L${px},-44`} stroke="#3d2716" strokeWidth=".5" />)}
    <rect x="48" y="-38" width="6" height="8" fill="#2a2620" />
    <path d="M42,-82 L53,-100 L64,-82 Z" fill="#4d483f" />
    <path d="M53,-100 L53,-106" stroke="#c9a65a" strokeWidth=".8" />
    <circle cx="53" cy="-107" r="1.3" fill="#EAA722" />

    {/* back row (base y=6) */}
    <Shikhara2 x={-62} base={6} w={12} h={24} bands={1} />
    <Shikhara2 x={-42} base={6} w={16} h={36} bands={2} />
    <Shikhara2 x={-20} base={6} w={18} h={52} bands={3} />
    <Shikhara2 x={2} base={6} w={24} h={74} bands={4} c="#8a8375" />
    <Shikhara2 x={26} base={6} w={18} h={48} bands={3} />

    {/* front row (base y=18), darker stone */}
    <Shikhara2 x={-50} base={18} w={10} h={16} bands={1} c="#6d675d" door={false} />
    <Shikhara2 x={-30} base={18} w={11} h={20} bands={2} c="#6d675d" />
    <Shikhara2 x={-10} base={18} w={12} h={24} bands={2} c="#6d675d" />
    <Shikhara2 x={14} base={18} w={11} h={18} bands={2} c="#6d675d" />
    <Shikhara2 x={34} base={18} w={10} h={14} bands={1} c="#6d675d" door={false} />
  </g>
);

// Patal Bhuvaneshwar: limestone cliff with a dark cave mouth, lit inside, iron chains, pink gate
const PatalArt = () => (
  <g>
    <path d="M-60,2 L-56,-26 L-40,-40 L-14,-50 L18,-48 L44,-34 L60,-14 L62,2 Z" fill="#8a8170" />
    <path d="M-40,-40 L-14,-50 L18,-48 L8,-38 L-20,-36 Z" fill="#a39a88" />
    <path d="M-50,-14 L40,-14 M-54,-6 L56,-6" stroke="#5a5244" strokeWidth=".6" opacity=".6" />
    <path d="M-20,2 L-20,-14 Q-20,-34 0,-34 Q20,-34 20,-14 L20,2 Z" fill="#1a130c" />
    <path d="M-16,2 L-16,-14 Q-16,-28 0,-28 Q16,-28 16,-14 L16,2 Z" fill="#3a2a18" />
    <ellipse className="mm-cave" cx="0" cy="-8" rx="12" ry="12" fill="url(#mm-cave)" />
    {[-10, -4, 4, 10].map((cx) => (
      <path key={cx} d={`M${cx},-30 L${cx},-6`} stroke="#3e3a32" strokeWidth=".6" strokeDasharray="1.5 1" />
    ))}
    <path d="M-22,4 L22,4 L22,7 L-22,7 Z" fill="#b8ae98" />
    <path d="M-26,7 L26,7 L26,10 L-26,10 Z" fill="#9a9385" />
    <rect x="-52" y="-22" width="6" height="22" fill="#c94a6a" />
    <rect x="-34" y="-22" width="6" height="22" fill="#c94a6a" />
    <path d="M-54,-22 Q-43,-36 -32,-22 Z" fill="#f2f2f5" stroke="#8a8a96" strokeWidth=".5" />
    <rect x="-50" y="-30" width="14" height="3" fill="#c94a6a" />
    <circle cx="-43" cy="-36" r="1.2" fill="#EAA722" />
    {[[-26, -44], [30, -36]].map(([fx, fy], i) => (
      <path key={i} className="mm-flag" fill={['#d23a2a', '#2f6fd0'][i]} d={`M${fx},${fy} l6,2 l-6,3 Z`} />
    ))}
  </g>
);

// Adi Kailash: dark pyramidal snow peak on the left, jagged dark peak with snow patches on the right
const AdiArt = () => (
  <g>
    <path d="M-40,2 L-12,-54 L-4,-70 L10,-74 L18,-60 L34,2 Z" fill="#3a3f48" />
    <path d="M-12,-54 L-4,-70 L10,-74 L18,-60 L8,-56 L0,-50 Z" fill="#f4f8fb" />
    <path d="M-12,-54 L-4,-46 L2,-40 L-4,-30 L-18,-30 Z" fill="#f4f8fb" opacity=".85" />
    <path d="M-2,-62 L4,-40 L12,-30 L18,-60 Z" fill="#f4f8fb" opacity=".75" />
    <path d="M26,2 L40,-34 L52,-44 L62,-56 L74,-40 L90,-30 L96,2 Z" fill="#4a4f58" />
    <path d="M52,-44 L62,-56 L74,-40 L66,-38 L58,-44 Z" fill="#f4f8fb" />
    <path d="M44,-34 L50,-30 L56,-34 L48,-26 Z" fill="#f4f8fb" opacity=".8" />
    <path d="M10,-74 L18,-60 L34,2 L20,2 Z" fill="#262a31" opacity=".5" />
    <ellipse cx="22" cy="-2" rx="16" ry="2.2" fill="#7fb3c9" opacity=".7" />
    <path d="M-76,2 L96,2 L96,6 L-76,6 Z" fill="#3f6a34" />
    <g className="mm-halo">
      <ellipse cx="10" cy="-96" rx="17" ry="6" fill="none" stroke="#EAA722" strokeWidth="2.2" />
      <text x="10" y="-92" textAnchor="middle" fontSize="11" fill="#EAA722" fontFamily={SERIF}>ॐ</text>
      {[[-20, -88], [40, -86], [-30, -66], [58, -70]].map(([sx, sy], i) => (
        <path key={i} className="mm-twinkle" d={`M${sx},${sy - 4} L${sx + 1.2},${sy - 1.2} L${sx + 4},${sy} L${sx + 1.2},${sy + 1.2} L${sx},${sy + 4} L${sx - 1.2},${sy + 1.2} L${sx - 4},${sy} L${sx - 1.2},${sy - 1.2} Z`} fill="#fff3b0" style={{ '--i': `${i * 0.25}s` }} />
      ))}
    </g>
  </g>
);

const ART = { 'base-camp': BaseCampArt, 'kainchi-dham': KainchiArt, 'kasar-devi': KasarArt, 'chitai-golu': ChitaiArt, 'jageshwar-dham': JageshwarArt, 'patal-bhuvaneshwar': PatalArt, 'adi-kailash': AdiArt };

/* ----------------------------- styles -------------------------------- */
const CSS = `
.mm2d svg { display:block; width:100%; height:auto; user-select:none; -webkit-user-select:none; }
.mm2d .mm-stop { cursor:pointer; outline:none; opacity:0; transform:translateY(28px) scale(.9); transform-box:fill-box; transform-origin:50% 100%; }
.mm2d.mm-rev .mm-stop { opacity:1; transform:none; transition:opacity .6s ease var(--d), transform 1s cubic-bezier(.34,1.56,.64,1) var(--d); }
.mm2d .mm-art { transition:transform .45s cubic-bezier(.2,.8,.2,1), filter .45s ease; transform-box:fill-box; transform-origin:50% 100%; }
.mm2d .mm-stop.is-active .mm-art, .mm2d .mm-stop:focus-visible .mm-art { transform:translateY(-5px) scale(1.07); filter:drop-shadow(0 10px 6px rgba(20,10,0,.5)); }
.mm2d .mm-stop:hover .mm-art { transform:translateY(-9px) scale(1.12); filter:drop-shadow(0 14px 8px rgba(20,10,0,.55)); }
.mm2d .mm-glow { opacity:0; transition:opacity .4s; }
.mm2d .mm-stop:hover .mm-glow, .mm2d .mm-stop.is-active .mm-glow { opacity:1; }
.mm2d .mm-ring { opacity:0; fill:none; stroke:#FFD76A; stroke-width:2; }
.mm2d .mm-stop.is-active .mm-ring { opacity:1; animation:mm-ring 1.9s ease-out infinite; transform-box:fill-box; transform-origin:center; }
.mm2d .mm-board { fill:url(#mm-wood); stroke:#c9a65a; transition:stroke .3s, filter .3s; }
.mm2d .mm-badge { fill:#EAA722; stroke:#fff0b0; }
.mm2d .mm-plaque { transform-box:fill-box; transform-origin:50% 50%; transition:transform .35s cubic-bezier(.2,.8,.2,1); }
.mm2d .mm-stop:hover .mm-plaque, .mm2d .mm-stop:focus-visible .mm-plaque { transform:scale(1.08); }
.mm2d .mm-stop:hover .mm-board, .mm2d .mm-stop.is-active .mm-board { stroke:#FFE08A; filter:drop-shadow(0 0 6px rgba(234,167,34,.9)); }
.mm2d .hit { fill:transparent; stroke:transparent; }
.mm2d .mm-stop:focus-visible .hit { stroke:#FFE08A; stroke-dasharray:4 3; }
.mm2d .mm-road { stroke-dasharray:1; stroke-dashoffset:1; }
.mm2d.mm-rev .mm-road { stroke-dashoffset:0; transition:stroke-dashoffset 2.6s ease-in-out .2s; }
.mm2d .mm-dash, .mm2d .mm-fade { opacity:0; }
.mm2d.mm-rev .mm-dash { opacity:1; transition:opacity .8s ease 2.2s; }
.mm2d.mm-rev .mm-fade { opacity:1; transition:opacity .8s ease 1.2s; }
.mm2d .mm-flag { transform-box:fill-box; transform-origin:0 50%; animation:mm-wave 2.4s ease-in-out infinite alternate; }
.mm2d .mm-stop:hover .mm-flag { animation-duration:.55s; }
.mm2d .mm-flame { transform-box:fill-box; transform-origin:50% 100%; animation:mm-flick .5s ease-in-out infinite alternate; }
.mm2d .mm-f2 { animation-duration:.35s; }
.mm2d .mm-firelight { opacity:.45; transition:opacity .4s; }
.mm2d .mm-stop:hover .mm-firelight { opacity:1; }
.mm2d .mm-bell { transform-box:fill-box; transform-origin:50% 0; }
.mm2d .mm-stop:hover .mm-bell, .mm2d .mm-stop:focus-visible .mm-bell { animation:mm-swing .8s ease-in-out infinite alternate; animation-delay:var(--i); }
.mm2d .mm-sh { transition:transform .4s cubic-bezier(.2,.8,.2,1) var(--d); }
.mm2d .mm-stop:hover .mm-sh, .mm2d .mm-stop:focus-visible .mm-sh { transform:translateY(-5px); }
.mm2d .mm-win { fill:#5b4a35; transition:fill .4s; }
.mm2d .mm-stop:hover .mm-win, .mm2d .mm-stop.is-active .mm-win { fill:#ffd76a; }
.mm2d .mm-smoke { opacity:0; }
.mm2d .mm-stop:hover .mm-smoke { animation:mm-smoke 2.6s ease-out infinite; animation-delay:var(--i); }
.mm2d .mm-cave { opacity:.12; transition:opacity .5s; }
.mm2d .mm-stop:hover .mm-cave, .mm2d .mm-stop.is-active .mm-cave { opacity:1; }
.mm2d .mm-halo { opacity:0; transition:opacity .5s; }
.mm2d .mm-stop:hover .mm-halo, .mm2d .mm-stop.is-active .mm-halo { opacity:1; }
.mm2d .mm-twinkle { transform-box:fill-box; transform-origin:center; opacity:0; }
.mm2d .mm-stop:hover .mm-twinkle, .mm2d .mm-stop.is-active .mm-twinkle { animation:mm-twinkle 1.4s ease-in-out infinite; animation-delay:var(--i); }
.mm2d .mm-bellrope { transform-box:fill-box; transform-origin:50% 0; animation:mm-swing 3.6s ease-in-out infinite alternate; }
.mm2d .mm-mist { animation:mm-mist 40s ease-in-out infinite alternate; }
.mm2d .mm-jeep { animation:mm-bob .9s ease-in-out infinite; }
@keyframes mm-ring { 0% { transform:scale(.7); opacity:.9; } 100% { transform:scale(1.35); opacity:0; } }
@keyframes mm-wave { from { transform:scaleX(1) skewY(0); } to { transform:scaleX(.8) skewY(8deg); } }
@keyframes mm-flick { from { transform:scale(1,1); } to { transform:scale(.88,1.12); } }
@keyframes mm-swing { from { transform:rotate(-16deg); } to { transform:rotate(16deg); } }
@keyframes mm-smoke { 0% { transform:translateY(0) scale(.6); opacity:0; } 25% { opacity:.7; } 100% { transform:translateY(-22px) scale(1.8); opacity:0; } }
@keyframes mm-twinkle { 0%,100% { transform:scale(.3); opacity:0; } 50% { transform:scale(1.2); opacity:1; } }
@keyframes mm-mist { from { transform:translateX(-30px); } to { transform:translateX(30px); } }
@keyframes mm-bob { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-1.2px); } }
@media (prefers-reduced-motion: reduce) { .mm2d * { animation:none !important; transition:none !important; } .mm2d .mm-stop { opacity:1; transform:none; } .mm2d .mm-road { stroke-dashoffset:0; } .mm2d .mm-dash, .mm2d .mm-fade { opacity:1; } }
`;

/* ----------------------------- component ----------------------------- */
const MandirMalaMap2D = ({ activeIdx, onSelectStop, waypoints }) => {
  const rootRef = useRef(null);
  const roadRef = useRef(null);
  const jeepRef = useRef(null);
  const firstIdx = useRef(true);
  const [revealed, setRevealed] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  const reduced = useMemo(
    () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    []
  );

  // reveal when scrolled into view
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === 'undefined') { setRevealed(true); return undefined; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setRevealed(true); io.disconnect(); } }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // jeep drives up and down the road
  useEffect(() => {
    const path = roadRef.current, jeep = jeepRef.current;
    if (!path || !jeep || !revealed) return undefined;
    const len = path.getTotalLength();
    let pos = len * 0.12, dir = 1, face = 1, raf, last = performance.now();
    const place = () => {
      const a = path.getPointAtLength(pos), b = path.getPointAtLength(Math.min(len, Math.max(0, pos + dir * 3)));
      if (Math.abs(b.x - a.x) > 0.25) face = b.x > a.x ? 1 : -1;
      jeep.setAttribute('transform', `translate(${a.x} ${a.y}) scale(${face} 1)`);
    };
    place();
    if (reduced) return undefined;
    const step = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      pos += dir * dt * 30;
      if (pos > len - 6) { pos = len - 6; dir = -1; }
      if (pos < 6) { pos = 6; dir = 1; }
      place();
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [revealed, reduced]);

  // camera follows the stop picked anywhere (tabs, Prev/Next, map)
  useEffect(() => {
    if (firstIdx.current) { firstIdx.current = false; return; }
    setZoomed(true);
  }, [activeIdx]);

  const select = (i) => { onSelectStop?.(i); setZoomed(true); };
  const onKey = (e, i) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(i); } };

  const cur = STOPS[activeIdx] || STOPS[0];
  const s = zoomed ? ZOOM : 1;
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const tx = zoomed ? clamp(W / 2 - cur.x * s, W - W * s, 0) : 0;
  const ty = zoomed ? clamp(H / 2 - (cur.y - 24) * s, H - H * s, 0) : 0;
  const nameOf = (st) => st.label.filter((l) => typeof l === 'string').join(' ');

  // side column content
  const COLUMNS = [
    { cx: 8, lines: ['HAR', 'HAR', 'MAHADEV'], size: 8.5 },
    { cx: 563, lines: ['जय', 'बद्री', 'विशाल'], size: 10.5 },
  ];

  return (
    <div ref={rootRef} className={`mm2d w-full mx-auto max-w-full lg:max-w-[590px] flex flex-col ${revealed ? 'mm-rev' : ''}`}>
      <style>{CSS}</style>
      <div className="overflow-hidden rounded-3xl border-2 border-[#EAA722]/50 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_35px_rgba(234,167,34,0.2)]">
        <svg viewBox={`0 0 ${W} ${H}`} role="group" aria-label="Mandir Mala 2026 illustrated pilgrimage map">
          <defs>
            <linearGradient id="mm-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6a4730" /><stop offset="1" stopColor="#3a2515" /></linearGradient>
            <linearGradient id="mm-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff0b0" /><stop offset=".55" stopColor="#eaa722" /><stop offset="1" stopColor="#b8751a" /></linearGradient>
            <linearGradient id="mm-stone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#aaa291" /><stop offset="1" stopColor="#6f685b" /></linearGradient>
            <linearGradient id="mm-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a9c9de" /><stop offset="1" stopColor="#eef1ee" /></linearGradient>
            <linearGradient id="mm-ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4f7a45" /><stop offset=".5" stopColor="#3f6a34" /><stop offset="1" stopColor="#6f8f4c" /></linearGradient>
            <linearGradient id="mm-river" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7fd6d0" /><stop offset="1" stopColor="#1d8d8a" /></linearGradient>
            <linearGradient id="mm-parch" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f4e8c8" /><stop offset=".5" stopColor="#e8d5a6" /><stop offset="1" stopColor="#d6bd87" /></linearGradient>
            <linearGradient id="mm-carvecol" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#5a3a22" /><stop offset=".5" stopColor="#3a2414" /><stop offset="1" stopColor="#5a3a22" /></linearGradient>
            <radialGradient id="mm-glowg"><stop offset="0" stopColor="#ffd76a" stopOpacity=".7" /><stop offset="1" stopColor="#ffd76a" stopOpacity="0" /></radialGradient>
            <radialGradient id="mm-cave"><stop offset="0" stopColor="#ffc15a" stopOpacity=".95" /><stop offset=".6" stopColor="#c0561a" stopOpacity=".5" /><stop offset="1" stopColor="#7a2a00" stopOpacity="0" /></radialGradient>
            <radialGradient id="mm-vig" cx=".5" cy=".5" r=".75"><stop offset=".6" stopColor="#5a3516" stopOpacity="0" /><stop offset="1" stopColor="#5a3516" stopOpacity=".45" /></radialGradient>
            <pattern id="mm-carve" width="16" height="16" patternUnits="userSpaceOnUse">
              <rect width="16" height="16" fill="#4a2f1d" />
              <path d="M8,1 L15,8 L8,15 L1,8 Z" fill="none" stroke="#b08a55" strokeOpacity=".5" strokeWidth=".8" />
              <circle cx="8" cy="8" r="1.6" fill="#c9a65a" fillOpacity=".5" />
              <path d="M0,0 L16,16 M16,0 L0,16" stroke="#2a1a0e" strokeOpacity=".25" strokeWidth=".6" />
            </pattern>
            <pattern id="mm-speck" width="23" height="19" patternUnits="userSpaceOnUse">
              <circle cx="5" cy="7" r=".8" fill="#8a6a3a" fillOpacity=".25" />
              <circle cx="16" cy="13" r=".6" fill="#8a6a3a" fillOpacity=".2" />
              <circle cx="11" cy="3" r=".5" fill="#8a6a3a" fillOpacity=".2" />
            </pattern>
            <clipPath id="mm-clip"><rect x="56" y="104" width="505" height="676" /></clipPath>
            <g id="mm-pine-a"><rect x="-1.3" y="-4" width="2.6" height="5" fill="#3d2716" /><path d="M0,-34 L10,-14 L5,-14 L12,-4 L-12,-4 L-5,-14 L-10,-14 Z" fill="#245a35" /><path d="M0,-34 L10,-14 L5,-14 L12,-4 L5,-4 Z" fill="#163a22" opacity=".55" /></g>
            <g id="mm-pine-b"><rect x="-1.3" y="-4" width="2.6" height="5" fill="#3d2716" /><path d="M0,-34 L10,-14 L5,-14 L12,-4 L-12,-4 L-5,-14 L-10,-14 Z" fill="#2f6e3e" /><path d="M0,-34 L10,-14 L5,-14 L12,-4 L5,-4 Z" fill="#1d4a2b" opacity=".5" /></g>
          </defs>

          {/* parchment background */}
          <rect width={W} height={H} fill="url(#mm-parch)" />
          <rect width={W} height={H} fill="url(#mm-speck)" />
          <rect width={W} height={H} fill="url(#mm-vig)" />

          {/* ================= ZOOMING SCENE ================= */}
          <g clipPath="url(#mm-clip)">
            <g style={{ transform: `translate(${tx}px, ${ty}px) scale(${s})`, transformOrigin: '0 0', transition: reduced ? 'none' : 'transform 1.1s cubic-bezier(.65,0,.35,1)' }}>
              <rect x="0" y="90" width={W} height="170" fill="url(#mm-sky)" />
              <path d="M56,215 L90,170 L120,190 L170,150 L210,185 L260,140 L310,175 L350,155 L400,180 L450,145 L500,175 L540,160 L563,185 L563,240 L56,240 Z" fill="#8fa8bd" />
              {[[90, 170], [170, 150], [260, 140], [350, 155], [450, 145], [540, 160]].map(([px, py]) => (
                <path key={px} d={`M${px - 13},${py + 16} L${px},${py} L${px + 13},${py + 16} L${px + 6},${py + 12} L${px},${py + 17} L${px - 6},${py + 12} Z`} fill="#f7fafc" />
              ))}
              <path d="M56,225 Q120,190 190,215 Q260,185 340,212 Q420,190 500,214 Q540,205 563,215 L563,270 L56,270 Z" fill="#4f7a68" />
              <g className="mm-mist" opacity=".55">
                <ellipse cx="200" cy="222" rx="110" ry="12" fill="#fff" />
                <ellipse cx="430" cy="236" rx="120" ry="11" fill="#fff" />
              </g>
              <path d="M56,240 Q150,222 250,238 Q350,222 460,236 Q520,228 563,238 L563,790 L56,790 Z" fill="url(#mm-ground)" />
              {[[150, 330, 90, 26], [380, 300, 80, 22], [430, 430, 100, 28], [160, 540, 90, 24], [260, 690, 110, 26]].map(([ex, ey, rx, ry], i) => (
                <ellipse key={i} cx={ex} cy={ey} rx={rx} ry={ry} fill="#8aa84f" opacity=".22" />
              ))}
              <path d="M225,560 C235,590 235,610 245,640 C262,690 250,720 280,760 L300,800 L395,800 C360,760 330,720 316,670 C300,620 290,600 272,570 Z" fill="url(#mm-river)" />
              <path d="M240,600 C252,640 244,690 275,740 M262,585 C275,620 280,660 300,700 M290,700 C305,740 335,770 350,790" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="6 9" />
              <path d="M380,600 Q470,570 563,590 L563,700 L380,700 Z" fill="#587d3a" opacity=".5" />

              <path d={ROAD_PATH.d} className="mm-road" pathLength="1" fill="none" stroke="#2c241a" strokeOpacity=".4" strokeWidth="17" strokeLinecap="round" strokeLinejoin="round" transform="translate(1.5 3)" />
              <path d={ROAD_PATH.d} className="mm-road" pathLength="1" fill="none" stroke="#efe6cc" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
              <path d={ROAD_PATH.d} className="mm-road" pathLength="1" fill="none" stroke="#6f6b63" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
              <path ref={roadRef} d={ROAD_PATH.d} className="mm-dash" fill="none" stroke="#f1e7c8" strokeWidth="1.2" strokeDasharray="6 8" />

              <g transform="translate(260 665) rotate(-6)" className="mm-fade">
                <rect x="-28" y="-6" width="56" height="12" fill="#6a4a2c" stroke="#3d2716" strokeWidth="1" />
                <path d="M-28,-8 L28,-8 M-28,8 L28,8" stroke="#4f3820" strokeWidth="2" />
                {[-24, -12, 0, 12, 24].map((bx) => <path key={bx} d={`M${bx},-8 L${bx},-14 M${bx},8 L${bx},14`} stroke="#4f3820" strokeWidth="1.6" />)}
              </g>

              {TREES.map((t, i) => <use key={i} href={`#mm-pine-${t.v}`} transform={`translate(${t.x} ${t.y}) scale(${t.s})`} />)}

              <g ref={jeepRef} className="mm-fade">
                <g className="mm-jeep" transform="translate(0 -4) scale(1.15)">
                  <ellipse cy="5" rx="15" ry="2.4" fill="#000" opacity=".3" />
                  <path d="M-13,1 L-13,-6 L-9,-7 L-6,-12 L7,-12 L9,-7 L13,-6 L13,1 Z" fill="#3d5a36" />
                  <path d="M-5,-11 L6,-11 L8,-7 L-7,-7 Z" fill="#cfe3dc" />
                  <rect x="-6" y="-14.5" width="12" height="2" fill="#222" />
                  {[-8, 8].map((wx) => (<g key={wx}><circle cx={wx} cy="1.5" r="3.6" fill="#161616" /><circle cx={wx} cy="1.5" r="1.4" fill="#9a9a9a" /></g>))}
                </g>
              </g>

              {STOPS.map((st, i) => {
                const Art = ART[st.id];
                const active = activeIdx === i;
                const [hx, hy, hw, hh] = st.hit;
                const cx = hx + hw / 2;
                return (
                  <g key={st.id} transform={`translate(${st.x} ${st.y})`}>
                    <g
                      className={`mm-stop${active ? ' is-active' : ''}`}
                      style={{ '--d': `${700 + i * 260}ms` }}
                      role="button" tabIndex={0}
                      aria-label={`${nameOf(st)}, ${waypoints?.[i]?.distance || ''}`}
                      aria-pressed={active}
                      onClick={() => select(i)}
                      onKeyDown={(e) => onKey(e, i)}
                    >
                      <ellipse className="mm-glow" cx={cx} cy="4" rx={hw * 0.55} ry="15" fill="url(#mm-glowg)" />
                      <ellipse className="mm-ring" cx={cx} cy="5" rx={hw * 0.4} ry="9" />
                      <g className="mm-art"><Art /></g>
                      <g transform={`translate(${st.plaque[0]} ${st.plaque[1]})`}><Plaque lines={st.label} num={String(i + 1).padStart(2, '0')} /></g>
                      <rect className="hit" x={hx} y={hy} width={hw} height={hh} rx="10" />
                    </g>
                  </g>
                );
              })}
            </g>
          </g>

          {/* ================= FIXED CARVED FRAME ================= */}
          {/* outer carved wood border */}
          <rect x="2" y="2" width={W - 4} height={H - 4} rx="16" fill="none" stroke="url(#mm-wood)" strokeWidth="7" />
          <rect x="5.5" y="5.5" width={W - 11} height={H - 11} rx="13" fill="none" stroke="#c9a65a" strokeOpacity=".7" strokeWidth="1" />
          <rect x="9" y="9" width={W - 18} height={H - 18} rx="11" fill="none" stroke="#2a1a0e" strokeOpacity=".5" strokeWidth=".8" />

          {/* map window */}
          <rect x="56" y="104" width="505" height="676" fill="none" stroke="#2a1a0e" strokeWidth="5" />
          <rect x="59" y="107" width="499" height="670" fill="none" stroke="#c9a65a" strokeOpacity=".7" strokeWidth="1" />

          {/* carved side columns */}
          {COLUMNS.map(({ cx, lines, size }, k) => (
            <g key={cx}>
              <rect x={cx} y="60" width="46" height="724" rx="6" fill="url(#mm-carve)" stroke="#1f140b" strokeWidth="2.5" />
              <rect x={cx + 3} y="63" width="40" height="718" rx="4" fill="none" stroke="#c9a65a" strokeOpacity=".5" strokeWidth=".8" />
              {/* carved cap */}
              <rect x={cx - 2} y="54" width="50" height="14" rx="5" fill="url(#mm-carvecol)" stroke="#c9a65a" strokeWidth=".8" />
              <circle cx={cx + 23} cy="61" r="2.6" fill="url(#mm-gold)" stroke="#8a5a10" strokeWidth=".5" />
              {/* diamonds along the column */}
              {[160, 200, 240, 280, 320, 360, 400, 440, 480, 520, 560, 600, 640].map((dy) => (
                <Diamond key={dy} x={cx + 23} y={dy} s={2.4} />
              ))}
              {/* top symbol panel */}
              <rect x={cx + 5} y="72" width="36" height="104" rx="5" fill="#2a1a0e" stroke="#c9a65a" strokeWidth="1" />
              <rect x={cx + 7.5} y="74.5" width="31" height="99" rx="3.5" fill="none" stroke="#c9a65a" strokeOpacity=".35" strokeWidth=".6" />
              <g transform={`translate(${cx + 23} 96)`} stroke="#EAA722" strokeWidth="1.8" fill="none" strokeLinecap="round">
                <path d="M0,-14 L0,12 M-7,-8 Q-7,4 0,4 Q7,4 7,-8 M-7,-12 L-7,-6 M7,-12 L7,-6" />
              </g>
              {/* vertical text */}
              {lines.map((t, i) => (
                <text key={t + i} x={cx + 23} y={128 + i * 13} textAnchor="middle" fontFamily={SERIF} fontWeight="700" fontSize={size} fill="#f3dfa6">{t}</text>
              ))}
              {/* lower mountain panel */}
              <rect x={cx + 5} y="680" width="36" height="92" rx="5" fill="#2a1a0e" stroke="#c9a65a" strokeWidth="1" />
              <rect x={cx + 7.5} y="682.5" width="31" height="87" rx="3.5" fill="none" stroke="#c9a65a" strokeOpacity=".35" strokeWidth=".6" />
              <MountainIcon x={cx + 23} y={716} s={1.3} />
              <path d={`M${cx + 13},732 Q${cx + 23},728 ${cx + 33},732`} stroke="#EAA722" strokeWidth="1" fill="none" />
              <circle cx={cx + 23} cy="742" r="1.6" fill="#EAA722" />
              {/* gold rosette at base */}
              <circle cx={cx + 23} cy="778" r="3" fill="url(#mm-gold)" stroke="#8a5a10" strokeWidth=".6" />
              <circle cx={cx + 23} cy="778" r="1" fill="#8a5a10" />
            </g>
          ))}

          {/* corner blossoms where the map window meets the frame */}
          <Blossom x={92} y={100} r={7} />
          <Blossom x={525} y={100} r={7} />
          <Blossom x={92} y={784} r={6} />
          <Blossom x={525} y={784} r={6} />

          {/* title banner with snow-capped mountain crest */}
          <path d="M200,30 L244,2 L270,18 L308,-2 L346,18 L372,2 L416,30 Z" fill="#3a2515" stroke="#1f140b" strokeWidth="1" />
          <path d="M244,2 L252,12 L244,10 L236,14 Z M308,-2 L316,10 L308,7 L300,11 Z M372,2 L380,12 L372,10 L364,14 Z" fill="#f4f8fb" opacity=".95" />
          <rect x="110" y="24" width="397" height="88" rx="12" fill="url(#mm-wood)" stroke="#1f140b" strokeWidth="2.5" />
          <rect x="115" y="29" width="387" height="78" rx="8" fill="none" stroke="#c9a65a" strokeWidth="1" />
          <rect x="120" y="34" width="377" height="68" rx="6" fill="none" stroke="#c9a65a" strokeOpacity=".3" strokeWidth=".6" strokeDasharray="2 2" />

          {/* curled scroll ends */}
          <path d="M102,40 Q96,56 104,72 L114,72 Q110,56 114,40 Z" fill="#4a2f1d" stroke="#c9a65a" strokeWidth=".8" />
          <path d="M515,40 Q521,56 513,72 L503,72 Q507,56 503,40 Z" fill="#4a2f1d" stroke="#c9a65a" strokeWidth=".8" />
          <circle cx="108" cy="40" r="3" fill="url(#mm-gold)" stroke="#8a5a10" strokeWidth=".5" />
          <circle cx="509" cy="40" r="3" fill="url(#mm-gold)" stroke="#8a5a10" strokeWidth=".5" />

          {/* leaf and blossom garlands at banner ends */}
          <Leaf x={100} y={66} a={-40} />
          <Leaf x={106} y={82} a={20} rx={8} />
          <Leaf x={517} y={66} a={40} />
          <Leaf x={511} y={82} a={-20} rx={8} />
          <Blossom x={96} y={96} r={5} />
          <Blossom x={521} y={96} r={5} />

          <text x="308.5" y="72" textAnchor="middle" fontFamily={SERIF} fontWeight="700" fontSize="28" letterSpacing="3" fill="url(#mm-gold)" stroke="#2a1a0e" strokeWidth="1" paintOrder="stroke">MANDIR MALA 2026</text>
          <text x="308.5" y="93" textAnchor="middle" fontFamily={SERIF} fontSize="10" letterSpacing="2.5" fill="#ecd59a">FAITH  ✦  NATURE  ✦  JOURNEY</text>

          {/* bell ropes at top corners */}
          {[62, 555].map((bx) => (
            <g key={bx} transform={`translate(${bx} 30)`}>
              <path d="M-3,-10 L3,-10 L3,0 L-3,0 Z" fill="#c9a65a" />
              <g className="mm-bellrope">
                <path d="M-10,22 Q-10,2 0,0 Q10,2 10,22 Z" fill="url(#mm-gold)" stroke="#8a5a10" strokeWidth="1" />
                <circle cy="25" r="2.6" fill="#8a5a10" />
              </g>
            </g>
          ))}

          {/* footer: carved wood plaque with mountain emblem */}
          <rect x="196" y="782" width="226" height="38" rx="11" fill="url(#mm-wood)" stroke="#1f140b" strokeWidth="2.5" />
          <rect x="201" y="787" width="216" height="28" rx="8" fill="none" stroke="#c9a65a" strokeWidth="1" />
          <rect x="205" y="790" width="208" height="22" rx="6" fill="none" stroke="#c9a65a" strokeOpacity=".3" strokeWidth=".6" strokeDasharray="2 2" />
          <MountainIcon x={222} y={802} s={1.1} />
          <path d="M412,800 L420,796 L420,804 Z M204,800 L212,796 L212,804 Z" fill="#c9a65a" opacity=".7" />
          <text x="320" y="806" textAnchor="middle" fontFamily={SERIF} fontWeight="700" fontSize="15" letterSpacing="1.5" fill="#f3dfa6">BY SATYAS</text>

          {/* corner shrines */}
          <Shikhara2 x={34} base={820} w={22} h={46} bands={2} c="#d9c29c" band="#8d6a44" />
          <Shikhara2 x={583} base={820} w={22} h={46} bands={2} c="#d9c29c" band="#8d6a44" />
        </svg>
      </div>

      {/* ============== step controls ============== */}
      <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-[#EAA722]/30 bg-[#280803]/95 px-4 py-2.5 text-xs sm:text-sm text-[#FAF5EC] shadow-lg flex-shrink-0">
        <button
          type="button"
          onClick={() => select(Math.max(0, activeIdx - 1))}
          disabled={activeIdx === 0}
          className="rounded-xl border border-[#EAA722]/40 px-3.5 py-1.5 font-sans font-semibold text-xs sm:text-sm text-[#EAA722] transition-all hover:bg-[#EAA722] hover:text-[#240702] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#EAA722] cursor-pointer"
        >
          ‹ Prev
        </button>
        <div className="flex min-w-0 flex-col items-center text-center">
          <span className="truncate font-heading font-medium text-xs sm:text-sm text-white tracking-wide">
            Stop {String(activeIdx + 1).padStart(2, '0')} · {nameOf(cur)}
          </span>
          <button
            type="button"
            onClick={() => setZoomed((z) => !z)}
            className="text-[11px] sm:text-xs text-[#EAA722]/85 font-sans hover:text-[#FFE394] transition-colors cursor-pointer"
          >
            {zoomed ? '⤢ Show full map' : '⤡ Zoom to stop'}
          </button>
        </div>
        <button
          type="button"
          onClick={() => select(Math.min(STOPS.length - 1, activeIdx + 1))}
          disabled={activeIdx === STOPS.length - 1}
          className="rounded-xl border border-[#EAA722]/40 px-3.5 py-1.5 font-sans font-semibold text-xs sm:text-sm text-[#EAA722] transition-all hover:bg-[#EAA722] hover:text-[#240702] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#EAA722] cursor-pointer"
        >
          Next ›
        </button>
      </div>
    </div>
  );
};

export default MandirMalaMap2D;