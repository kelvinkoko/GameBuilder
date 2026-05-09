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
  // Walls + arrow-key player + a goal.
  const player = stockAsset("frog", "player");
  const wall = stockAsset("brick", "wall");
  const goal = stockAsset("crown", "treat");
  const walls: Actor[] = [];
  // Build a rough box of walls.
  for (let x = 80; x <= 720; x += 80) {
    walls.push(placeActor(wall, x, 60, [{ kind: "collide", withTag: "player", effect: "lose" }]));
    walls.push(placeActor(wall, x, 540, [{ kind: "collide", withTag: "player", effect: "lose" }]));
  }
  for (let y = 140; y <= 460; y += 80) {
    walls.push(placeActor(wall, 80, y, [{ kind: "collide", withTag: "player", effect: "lose" }]));
    walls.push(placeActor(wall, 720, y, [{ kind: "collide", withTag: "player", effect: "lose" }]));
  }
  // A few inside obstacles.
  walls.push(placeActor(wall, 240, 220, [{ kind: "collide", withTag: "player", effect: "lose" }]));
  walls.push(placeActor(wall, 320, 220, [{ kind: "collide", withTag: "player", effect: "lose" }]));
  walls.push(placeActor(wall, 480, 380, [{ kind: "collide", withTag: "player", effect: "lose" }]));
  walls.push(placeActor(wall, 560, 380, [{ kind: "collide", withTag: "player", effect: "lose" }]));

  return {
    id: uuid(),
    name: "Maze",
    template: "maze",
    background: { kind: "preset", value: "grass" },
    assets: [player, wall, goal],
    actors: [
      placeActor(player, 160, 480, [{ kind: "controllable", speed: 2 }]),
      ...walls,
      placeActor(goal, 660, 120, [{ kind: "collide", withTag: "player", effect: "win" }])
    ],
    rules: [],
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
}

export const TEMPLATES = [
  { id: "blank", name: "Blank", emoji: "🎨", build: blankTemplate },
  { id: "catch", name: "Catch", emoji: "⭐", build: catchTemplate },
  { id: "maze", name: "Maze", emoji: "🧩", build: mazeTemplate }
];

// Bind unused export so tree-shaking does not complain about STOCK_STICKERS.
export const _stockCount = STOCK_STICKERS.length;
