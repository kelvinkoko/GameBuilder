import { v4 as uuid } from "uuid";
import type { Asset, Actor, GameProject } from "../types";
import { findStock, STOCK_STICKERS } from "../assets/stock";

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

export function catchTemplate(): GameProject {
  // Falling treats, follow-pointer player, score on collide.
  const player = stockAsset("ball", "player");
  const treat = stockAsset("star", "treat");
  return {
    id: uuid(),
    name: "Catch the stars",
    template: "catch",
    background: { kind: "preset", value: "sky" },
    assets: [player, treat],
    actors: [
      placeActor(player, 400, 520, [
        { kind: "move", dir: "follow", speed: 3 }
      ]),
      placeActor(treat, 120, 60, [
        { kind: "move", dir: "down", speed: 2 },
        { kind: "collide", withTag: "player", effect: "score" }
      ]),
      placeActor(treat, 320, 60, [
        { kind: "move", dir: "down", speed: 2 },
        { kind: "collide", withTag: "player", effect: "score" }
      ]),
      placeActor(treat, 520, 60, [
        { kind: "move", dir: "down", speed: 2 },
        { kind: "collide", withTag: "player", effect: "score" }
      ]),
      placeActor(treat, 680, 60, [
        { kind: "move", dir: "down", speed: 2 },
        { kind: "collide", withTag: "player", effect: "score" }
      ])
    ],
    rules: [{ kind: "scoreToWin", target: 3 }],
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
}

export function mazeTemplate(): GameProject {
  // Walls block the player; touching the goal wins.
  const player = stockAsset("frog", "player");
  const wall = stockAsset("brick", "wall");
  const goal = stockAsset("crown", "treat");
  const wallBehavior = [
    { kind: "collide" as const, withTag: "player", effect: "block" as const }
  ];
  const walls: Actor[] = [];
  for (let x = 80; x <= 720; x += 80) {
    walls.push(placeActor(wall, x, 60, wallBehavior));
    walls.push(placeActor(wall, x, 540, wallBehavior));
  }
  for (let y = 140; y <= 460; y += 80) {
    walls.push(placeActor(wall, 80, y, wallBehavior));
    walls.push(placeActor(wall, 720, y, wallBehavior));
  }
  // A few inside obstacles.
  walls.push(placeActor(wall, 240, 220, wallBehavior));
  walls.push(placeActor(wall, 320, 220, wallBehavior));
  walls.push(placeActor(wall, 480, 380, wallBehavior));
  walls.push(placeActor(wall, 560, 380, wallBehavior));

  return {
    id: uuid(),
    name: "Maze",
    template: "maze",
    background: { kind: "preset", value: "grass" },
    assets: [player, wall, goal],
    actors: [
      placeActor(player, 200, 460, [{ kind: "controllable", speed: 2 }]),
      ...walls,
      placeActor(goal, 660, 140, [
        { kind: "collide", withTag: "player", effect: "win" }
      ])
    ],
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
  const goal = stockAsset("crown", "treat");
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
        { kind: "platformer", speed: 2, jump: 2 }
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

export const TEMPLATES = [
  { id: "blank", name: "Blank", emoji: "🎨", build: blankTemplate },
  { id: "catch", name: "Catch", emoji: "⭐", build: catchTemplate },
  { id: "maze", name: "Maze", emoji: "🧩", build: mazeTemplate },
  { id: "platformer", name: "Jump & run", emoji: "🦘", build: platformerTemplate }
];

// Bind unused export so tree-shaking does not complain about STOCK_STICKERS.
export const _stockCount = STOCK_STICKERS.length;
