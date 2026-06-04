// Pre-bundled "hand-drawn" sketches used to seed the Aquarium template.
// Designed to look like a 5-year-old's marker drawing: thick wobbly
// outlines, bright multi-colour fills, polka dots / stripes, big
// happy eyes and smiles. Each is marked with `source.kind === "drawn"`
// so it appears indistinguishable in the tray from sprites she draws
// herself — the message is "yours could go here too".

const wrap = (body: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${body}</svg>`;
  // base64 is more reliable than percent-encoded URL across browsers.
  // Chrome has gotten stricter about non-standard ';utf8' parameters
  // and edge cases of encodeURIComponent on SVG; base64 sidesteps both.
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export type Sketch = {
  id: string;
  name: string;
  dataUrl: string;
};

// Reusable cartoon eye: white sclera, big black pupil, tiny highlight.
const eye = (cx: number, cy: number, r = 7) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#ffffff" stroke="#3a2e2a" stroke-width="2.5"/>` +
  `<circle cx="${cx + 1}" cy="${cy + 1}" r="${r * 0.55}" fill="#3a2e2a"/>` +
  `<circle cx="${cx - 0.5}" cy="${cy - 1.5}" r="${r * 0.2}" fill="#ffffff"/>`;

const FISH_ORANGE = wrap(
  // body — slightly lumpy oval
  `<path d="M22 52 Q26 26 50 24 Q74 26 80 52 Q76 72 50 76 Q26 76 22 52 Z" fill="#ffb84d" stroke="#c95c00" stroke-width="4" stroke-linejoin="round"/>` +
    // tail — wavy
    `<path d="M22 52 L4 30 Q10 50 4 74 Z" fill="#ffd166" stroke="#c95c00" stroke-width="4" stroke-linejoin="round"/>` +
    // top fin
    `<path d="M40 26 Q50 12 58 28" fill="#ffd166" stroke="#c95c00" stroke-width="3.5" stroke-linejoin="round"/>` +
    // belly stripes (pink)
    `<path d="M40 36 Q42 52 38 70" stroke="#ef476f" stroke-width="4" fill="none" stroke-linecap="round"/>` +
    `<path d="M55 32 Q57 52 55 72" stroke="#ef476f" stroke-width="4" fill="none" stroke-linecap="round"/>` +
    eye(66, 44, 8) +
    // smile
    `<path d="M58 62 Q66 68 76 60" stroke="#3a2e2a" stroke-width="3" fill="none" stroke-linecap="round"/>`
);

const FISH_PINK = wrap(
  // mirrored body
  `<path d="M78 52 Q74 26 50 24 Q26 26 20 52 Q24 72 50 76 Q74 76 78 52 Z" fill="#ff7eb6" stroke="#b73478" stroke-width="4" stroke-linejoin="round"/>` +
    // tail right side
    `<path d="M78 52 L96 30 Q90 50 96 74 Z" fill="#ffc0d8" stroke="#b73478" stroke-width="4" stroke-linejoin="round"/>` +
    // top fin
    `<path d="M40 26 Q50 14 60 28" fill="#ffc0d8" stroke="#b73478" stroke-width="3.5" stroke-linejoin="round"/>` +
    // hearts on the body
    `<path d="M42 50 q-4 -6 -8 -2 q-2 4 8 10 q10 -6 8 -10 q-4 -4 -8 2 z" fill="#ef476f"/>` +
    `<path d="M62 56 q-3 -5 -6 -1 q-1.5 3 6 8 q7.5 -5 6 -8 q-3 -4 -6 1 z" fill="#ef476f"/>` +
    eye(34, 44, 8) +
    `<path d="M28 58 Q36 64 44 56" stroke="#3a2e2a" stroke-width="3" fill="none" stroke-linecap="round"/>`
);

const FISH_BLUE = wrap(
  `<path d="M22 50 Q28 24 50 24 Q74 26 80 50 Q76 72 50 74 Q26 74 22 50 Z" fill="#76c7ff" stroke="#0b5d8a" stroke-width="4" stroke-linejoin="round"/>` +
    `<path d="M22 50 L4 28 Q10 50 4 72 Z" fill="#a5dbff" stroke="#0b5d8a" stroke-width="4" stroke-linejoin="round"/>` +
    `<path d="M40 26 Q50 12 58 28" fill="#a5dbff" stroke="#0b5d8a" stroke-width="3.5" stroke-linejoin="round"/>` +
    // polka dots
    `<circle cx="40" cy="44" r="3.5" fill="#ffffff"/>` +
    `<circle cx="48" cy="56" r="3" fill="#ffffff"/>` +
    `<circle cx="58" cy="42" r="3" fill="#ffd166"/>` +
    `<circle cx="62" cy="60" r="3" fill="#ffd166"/>` +
    eye(70, 44, 7) +
    `<path d="M62 60 Q68 64 74 60" stroke="#3a2e2a" stroke-width="3" fill="none" stroke-linecap="round"/>`
);

const STARFISH = wrap(
  `<path d="M50 8 L62 36 L92 38 L68 56 L78 88 L50 70 L22 88 L32 56 L8 38 L38 36 Z" fill="#ffd166" stroke="#c98c00" stroke-width="4" stroke-linejoin="round"/>` +
    // polka dots in 3 colours
    `<circle cx="34" cy="44" r="3.5" fill="#ef476f"/>` +
    `<circle cx="66" cy="44" r="3.5" fill="#7b2cbf"/>` +
    `<circle cx="50" cy="60" r="3.5" fill="#06d6a0"/>` +
    `<circle cx="40" cy="74" r="3" fill="#ef476f"/>` +
    `<circle cx="62" cy="74" r="3" fill="#7b2cbf"/>` +
    eye(40, 50, 5) +
    eye(60, 50, 5) +
    `<path d="M40 60 Q50 66 60 60" stroke="#3a2e2a" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
);

const CRAB = wrap(
  // body
  `<path d="M14 60 Q14 36 50 36 Q86 36 86 60 Q86 80 50 80 Q14 80 14 60 Z" fill="#ef476f" stroke="#a3144a" stroke-width="4" stroke-linejoin="round"/>` +
    // claws
    `<circle cx="14" cy="46" r="11" fill="#ef476f" stroke="#a3144a" stroke-width="4"/>` +
    `<circle cx="86" cy="46" r="11" fill="#ef476f" stroke="#a3144a" stroke-width="4"/>` +
    `<path d="M9 41 L19 46 L9 51" fill="none" stroke="#a3144a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="M91 41 L81 46 L91 51" fill="none" stroke="#a3144a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>` +
    // legs
    `<path d="M22 76 L14 92" stroke="#a3144a" stroke-width="4" stroke-linecap="round"/>` +
    `<path d="M36 80 L30 94" stroke="#a3144a" stroke-width="4" stroke-linecap="round"/>` +
    `<path d="M64 80 L70 94" stroke="#a3144a" stroke-width="4" stroke-linecap="round"/>` +
    `<path d="M78 76 L86 92" stroke="#a3144a" stroke-width="4" stroke-linecap="round"/>` +
    // yellow polka dots
    `<circle cx="32" cy="58" r="3.5" fill="#ffd166"/>` +
    `<circle cx="50" cy="68" r="3.5" fill="#ffd166"/>` +
    `<circle cx="68" cy="58" r="3.5" fill="#ffd166"/>` +
    // eye stalks
    `<path d="M40 38 L38 26" stroke="#a3144a" stroke-width="3" stroke-linecap="round"/>` +
    `<path d="M60 38 L62 26" stroke="#a3144a" stroke-width="3" stroke-linecap="round"/>` +
    eye(38, 22, 6) +
    eye(62, 22, 6) +
    // smile
    `<path d="M40 60 Q50 70 60 60" stroke="#3a2e2a" stroke-width="3" fill="none" stroke-linecap="round"/>`
);

const SEAWEED = wrap(
  // wavy stem
  `<path d="M50 96 Q34 84 50 70 Q66 56 50 42 Q34 28 50 14 Q60 6 50 0" stroke="#56a44a" stroke-width="9" fill="none" stroke-linecap="round"/>` +
    // alternating leaves
    `<ellipse cx="38" cy="80" rx="9" ry="4" fill="#7ec850" transform="rotate(-25 38 80)"/>` +
    `<ellipse cx="62" cy="60" rx="9" ry="4" fill="#7ec850" transform="rotate(20 62 60)"/>` +
    `<ellipse cx="38" cy="40" rx="9" ry="4" fill="#7ec850" transform="rotate(-15 38 40)"/>` +
    `<ellipse cx="60" cy="22" rx="9" ry="4" fill="#7ec850" transform="rotate(15 60 22)"/>` +
    // little flowers
    `<circle cx="48" cy="6" r="6" fill="#ef476f" stroke="#a3144a" stroke-width="2"/>` +
    `<circle cx="48" cy="6" r="2" fill="#ffd166"/>` +
    `<circle cx="68" cy="68" r="5" fill="#ffd166" stroke="#c98c00" stroke-width="2"/>`
);

const BUBBLE = wrap(
  // base bubble
  `<circle cx="50" cy="50" r="34" fill="#cfe8ff" stroke="#0b5d8a" stroke-width="4"/>` +
    // big highlight
    `<path d="M32 36 Q40 28 52 32" stroke="#ffffff" stroke-width="6" fill="none" stroke-linecap="round"/>` +
    // small extra highlight
    `<circle cx="62" cy="62" r="3" fill="#ffffff" opacity="0.85"/>` +
    // tiny sparkle
    `<path d="M70 32 L74 36 M72 30 L72 38 M68 34 L76 34" stroke="#ffd166" stroke-width="2" stroke-linecap="round"/>`
);

export const SKETCHES: Sketch[] = [
  { id: "sk-fish-orange", name: "Fish", dataUrl: FISH_ORANGE },
  { id: "sk-fish-pink", name: "Fish", dataUrl: FISH_PINK },
  { id: "sk-fish-blue", name: "Fish", dataUrl: FISH_BLUE },
  { id: "sk-starfish", name: "Starfish", dataUrl: STARFISH },
  { id: "sk-crab", name: "Crab", dataUrl: CRAB },
  { id: "sk-seaweed", name: "Seaweed", dataUrl: SEAWEED },
  { id: "sk-bubble", name: "Bubble", dataUrl: BUBBLE }
];
