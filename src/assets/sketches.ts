// Pre-bundled "hand-drawn" sketches used to seed the Aquarium template.
// They are deliberately chunky and imperfect so the kid recognises that
// what's on screen could have come from her own DrawingPad. Each is
// marked with `source.kind === "drawn"` (not "stock") so it appears
// indistinguishable from sprites she draws herself.

const wrap = (body: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>${body}</svg>`
  )}`;

export type Sketch = {
  id: string;
  name: string;
  dataUrl: string;
};

const FISH_ORANGE = wrap(
  `<path d='M22 50 Q35 24 64 30 Q86 35 80 50 Q86 65 64 70 Q35 76 22 50 Z' fill='%23ffb84d' stroke='%233a2e2a' stroke-width='4' stroke-linejoin='round'/>` +
    `<path d='M22 50 L4 32 L9 50 L4 68 Z' fill='%23ffb84d' stroke='%233a2e2a' stroke-width='4' stroke-linejoin='round'/>` +
    `<circle cx='68' cy='44' r='4' fill='%233a2e2a'/>` +
    `<path d='M58 60 Q66 64 74 60' stroke='%233a2e2a' stroke-width='3' fill='none' stroke-linecap='round'/>`
);

const FISH_PINK = wrap(
  `<path d='M78 50 Q65 28 38 32 Q18 36 22 50 Q18 64 38 68 Q65 72 78 50 Z' fill='%23ff7eb6' stroke='%233a2e2a' stroke-width='4' stroke-linejoin='round'/>` +
    `<path d='M78 50 L96 34 L91 50 L96 66 Z' fill='%23ff7eb6' stroke='%233a2e2a' stroke-width='4' stroke-linejoin='round'/>` +
    `<circle cx='34' cy='46' r='4' fill='%233a2e2a'/>` +
    `<path d='M28 58 Q36 62 44 58' stroke='%233a2e2a' stroke-width='3' fill='none' stroke-linecap='round'/>`
);

const FISH_BLUE = wrap(
  `<path d='M22 50 Q35 26 64 32 Q84 38 78 50 Q84 62 64 68 Q35 74 22 50 Z' fill='%2376c7ff' stroke='%233a2e2a' stroke-width='4' stroke-linejoin='round'/>` +
    `<path d='M22 50 L6 36 L11 50 L6 64 Z' fill='%2376c7ff' stroke='%233a2e2a' stroke-width='4' stroke-linejoin='round'/>` +
    `<circle cx='66' cy='46' r='4' fill='%233a2e2a'/>`
);

const STARFISH = wrap(
  `<path d='M50 8 L60 38 L92 38 L66 56 L76 88 L50 70 L24 88 L34 56 L8 38 L40 38 Z' fill='%23ef476f' stroke='%233a2e2a' stroke-width='4' stroke-linejoin='round'/>` +
    `<circle cx='40' cy='52' r='3' fill='%233a2e2a'/>` +
    `<circle cx='60' cy='52' r='3' fill='%233a2e2a'/>` +
    `<path d='M44 62 Q50 66 56 62' stroke='%233a2e2a' stroke-width='3' fill='none' stroke-linecap='round'/>`
);

const CRAB = wrap(
  `<ellipse cx='50' cy='58' rx='30' ry='20' fill='%23ef476f' stroke='%233a2e2a' stroke-width='4'/>` +
    `<circle cx='20' cy='48' r='10' fill='%23ef476f' stroke='%233a2e2a' stroke-width='4'/>` +
    `<circle cx='80' cy='48' r='10' fill='%23ef476f' stroke='%233a2e2a' stroke-width='4'/>` +
    `<line x1='28' y1='72' x2='18' y2='88' stroke='%233a2e2a' stroke-width='4' stroke-linecap='round'/>` +
    `<line x1='38' y1='76' x2='32' y2='92' stroke='%233a2e2a' stroke-width='4' stroke-linecap='round'/>` +
    `<line x1='62' y1='76' x2='68' y2='92' stroke='%233a2e2a' stroke-width='4' stroke-linecap='round'/>` +
    `<line x1='72' y1='72' x2='82' y2='88' stroke='%233a2e2a' stroke-width='4' stroke-linecap='round'/>` +
    `<circle cx='42' cy='48' r='3' fill='%233a2e2a'/>` +
    `<circle cx='58' cy='48' r='3' fill='%233a2e2a'/>` +
    `<path d='M40 60 Q50 65 60 60' stroke='%233a2e2a' stroke-width='3' fill='none' stroke-linecap='round'/>`
);

const SEAWEED = wrap(
  `<path d='M50 96 Q30 78 50 60 Q70 44 50 28 Q34 14 50 4' stroke='%2356a44a' stroke-width='8' fill='none' stroke-linecap='round'/>` +
    `<ellipse cx='40' cy='72' rx='8' ry='4' fill='%2356a44a' transform='rotate(-25 40 72)'/>` +
    `<ellipse cx='60' cy='44' rx='8' ry='4' fill='%2356a44a' transform='rotate(20 60 44)'/>` +
    `<ellipse cx='40' cy='20' rx='8' ry='4' fill='%2356a44a' transform='rotate(-15 40 20)'/>`
);

const BUBBLE = wrap(
  `<circle cx='50' cy='50' r='32' fill='%23cfe8ff' stroke='%23467a9e' stroke-width='4'/>` +
    `<path d='M34 36 Q40 30 50 32' stroke='%23ffffff' stroke-width='5' fill='none' stroke-linecap='round'/>`
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
