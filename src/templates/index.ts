import { v4 as uuid } from "uuid";
import type { Asset, Actor, GameProject, Behavior } from "../types";
import { findStock, STOCK_STICKERS } from "../assets/stock";
import { SKETCHES } from "../assets/sketches";

function stockAsset(stockId: string, tag: string): Asset {
  const stock = findStock(stockId)!;
  return {
    id: uuid(),
    name: stock.name,
    source: { kind: "stock", stockId },
    tag
  };
}

function placeActor(asset: Asset, x: number, y: number, behaviors: Actor["behaviors"] = []): Actor {
  return {
    id: uuid(),
    assetId: asset.id,
    tag: asset.tag ?? "thing",
    x,
    y,
    scale: 1,
    rotation: 0,
    behaviors
  };
}

export function blankTemplate(): GameProject {
  return {
    id: uuid(),
    name: "My game",
    template: "blank",
    background: { kind: "preset", value: "sky" },
    assets: [],
    actors: [],
    rules: [],
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
}

export function mazeTemplate(): GameProject {
  // 10x7 cell maze on an 80px grid (origin 40,40 → fits 800x600 stage).
  // W = wall, . = corridor, P = player start, G = goal.
  // Multiple paths and dead-ends by design.
  const grid = [
    "WWWWWWWWWW",
    "WP..W....W",
    "W.W.W.WW.W",
    "W.W...W..W",
    "W.WWW.W.WW",
    "W........G",
    "WWWWWWWWWW"
  ];

  const player = stockAsset("frog", "player");
  const wall = stockAsset("brick", "wall");
  const goal = stockAsset("crown", "treat");
  const wallBehavior = [
    { kind: "collide" as const, withTag: "player", effect: "block" as const }
  ];

  const cell = 80;
  const ox = 40;
  const oy = 40;
  let playerActor: Actor | null = null;
  let goalActor: Actor | null = null;
  const walls: Actor[] = [];
  for (let r = 0; r < grid.length; r++) {
    const row = grid[r];
    for (let c = 0; c < row.length; c++) {
      const ch = row[c];
      const x = ox + c * cell;
      const y = oy + r * cell;
      if (ch === "W") {
        walls.push(placeActor(wall, x, y, wallBehavior));
      } else if (ch === "P") {
        playerActor = placeActor(player, x, y, [
          { kind: "controllable", speed: 2 }
        ]);
      } else if (ch === "G") {
        goalActor = placeActor(goal, x, y, [
          { kind: "collide", withTag: "player", effect: "win" }
        ]);
      }
    }
  }

  return {
    id: uuid(),
    name: "Maze",
    template: "maze",
    background: { kind: "preset", value: "grass" },
    assets: [player, wall, goal],
    actors: [playerActor!, ...walls, goalActor!],
    rules: [],
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
}

export function platformerTemplate(): GameProject {
  // Side-scrolling jump-and-run. Frog hops on bricks toward a crown,
  // avoiding a wandering bug.
  const player = stockAsset("frog", "player");
  const ground = stockAsset("brick", "wall");
  const goal = stockAsset("trophy", "treat");
  const enemy = stockAsset("bug", "bug");

  const blockOnPlayer = [
    { kind: "collide" as const, withTag: "player", effect: "block" as const }
  ];
  const platforms: Actor[] = [];
  // Ground row across the bottom.
  for (let x = 40; x <= 760; x += 80) {
    platforms.push(placeActor(ground, x, 560, blockOnPlayer));
  }
  // Floating platforms.
  platforms.push(placeActor(ground, 220, 440, blockOnPlayer));
  platforms.push(placeActor(ground, 300, 440, blockOnPlayer));
  platforms.push(placeActor(ground, 460, 360, blockOnPlayer));
  platforms.push(placeActor(ground, 540, 360, blockOnPlayer));
  platforms.push(placeActor(ground, 660, 260, blockOnPlayer));

  return {
    id: uuid(),
    name: "Jump & run",
    template: "platformer",
    background: { kind: "preset", value: "sky" },
    assets: [player, ground, goal, enemy],
    actors: [
      placeActor(player, 80, 480, [
        { kind: "platformer", speed: 2, jump: 3 }
      ]),
      ...platforms,
      placeActor(enemy, 380, 520, [
        { kind: "move", dir: "left", speed: 1 },
        { kind: "bounce" },
        { kind: "collide", withTag: "player", effect: "lose" }
      ]),
      placeActor(goal, 660, 200, [
        { kind: "collide", withTag: "player", effect: "win" }
      ])
    ],
    rules: [],
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
}

export function aquariumTemplate(): GameProject {
  // Sandbox / pet mode: no win, no lose. Pre-populated with hand-drawn
  // sketch creatures so the kid sees that drawn sprites belong here too.
  function sketchAsset(id: string): Asset {
    const s = SKETCHES.find((k) => k.id === id)!;
    return {
      id: uuid(),
      name: s.name,
      source: { kind: "drawn", dataUrl: s.dataUrl },
      tag: "player"
    };
  }

  const fishOrange = sketchAsset("sk-fish-orange");
  const fishPink = sketchAsset("sk-fish-pink");
  const fishBlue = sketchAsset("sk-fish-blue");
  const starfish = sketchAsset("sk-starfish");
  const crab = sketchAsset("sk-crab");
  const seaweed = { ...sketchAsset("sk-seaweed"), tag: "wall" };
  const bubble = { ...sketchAsset("sk-bubble"), tag: "treat" };

  const swim: Behavior[] = [
    { kind: "move", dir: "wander", speed: 1 },
    { kind: "bounce" },
    { kind: "onTap", action: "sound" }
  ];
  const float: Behavior[] = [
    { kind: "move", dir: "up", speed: 1 },
    { kind: "onTap", action: "sound" }
  ];

  function place(asset: Asset, x: number, y: number, scale: number, behaviors: Behavior[]): Actor {
    return {
      id: uuid(),
      assetId: asset.id,
      tag: asset.tag ?? "player",
      x,
      y,
      scale,
      rotation: 0,
      behaviors
    };
  }

  return {
    id: uuid(),
    name: "Aquarium",
    template: "aquarium",
    background: { kind: "preset", value: "sea" },
    assets: [fishOrange, fishPink, fishBlue, starfish, crab, seaweed, bubble],
    actors: [
      // Decorative seaweed first so it draws behind the swimmers.
      place(seaweed, 100, 480, 1.2, []),
      place(seaweed, 700, 470, 1, []),
      // Fish wandering around the middle.
      place(fishOrange, 200, 200, 1.1, swim),
      place(fishPink, 540, 280, 1, swim),
      place(fishBlue, 360, 380, 0.9, swim),
      place(fishOrange, 620, 160, 0.8, swim),
      // Sea floor friends.
      place(crab, 320, 520, 1, [
        { kind: "move", dir: "wander", speed: 1 },
        { kind: "bounce" },
        { kind: "onTap", action: "sound" }
      ]),
      place(starfish, 460, 530, 0.9, [
        { kind: "spin", speed: 1 },
        { kind: "onTap", action: "grow" }
      ]),
      // A few rising bubbles.
      place(bubble, 150, 540, 0.6, float),
      place(bubble, 420, 560, 0.5, float),
      place(bubble, 680, 560, 0.7, float)
    ],
    rules: [],
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
}

export function whackTemplate(): GameProject {
  // Many wandering moles bounce around the stage; tap to score.
  // Score-to-win + time-limit make it a satisfying skill challenge.
  const mole = stockAsset("hamster", "bug");
  const positions: [number, number][] = [
    [120, 130], [320, 130], [520, 130], [680, 130],
    [120, 300], [320, 300], [520, 300], [680, 300],
    [220, 470], [420, 470], [620, 470]
  ];
  const moles = positions.map(([x, y]) =>
    placeActor(mole, x, y, [
      { kind: "move", dir: "wander", speed: 1 },
      { kind: "bounce" },
      { kind: "onTap", action: "score" }
    ])
  );
  return {
    id: uuid(),
    name: "Whack-a-mole",
    template: "whackamole",
    background: { kind: "preset", value: "grass" },
    assets: [mole],
    actors: moles,
    rules: [
      { kind: "scoreToWin", target: 8 },
      { kind: "timeLimit", seconds: 30 }
    ],
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
}

export const TEMPLATES = [
  { id: "maze", name: "Maze", emoji: "🧩", build: mazeTemplate },
  { id: "platformer", name: "Jump & run", emoji: "🦘", build: platformerTemplate },
  { id: "aquarium", name: "Aquarium", emoji: "🐠", build: aquariumTemplate },
  { id: "whackamole", name: "Whack-a-mole", emoji: "🐹", build: whackTemplate },
  { id: "blank", name: "Blank", emoji: "🎨", build: blankTemplate }
];

// Bind unused export so tree-shaking does not complain about STOCK_STICKERS.
export const _stockCount = STOCK_STICKERS.length;
