import { get, set, del, keys } from "idb-keyval";
import type { GameProject } from "../types";

// IndexedDB facade. Designed so the surface (list/load/save/delete)
// can later be backed by a remote service without touching callers.

const PREFIX = "game:";
const RECENT_KEY = "recent-stickers";
const RECENT_MAX = 24;

// Pre-fills the Recent tab on first use so it never shows an empty state.
// These IDs reference STOCK_STICKERS in src/assets/stock.ts.
const STARTER_RECENTS = [
  "star-yellow",
  "heart-red",
  "smile",
  "rainbow",
  "flower",
  "dog",
  "cat",
  "frog",
  "unicorn",
  "bee",
  "apple",
  "cake",
  "pizza",
  "cookie",
  "ball",
  "rocket",
  "crown",
  "balloon",
  "brick",
  "rock"
];

export async function listGames(): Promise<GameProject[]> {
  const allKeys = await keys();
  const gameKeys = allKeys.filter(
    (k): k is string => typeof k === "string" && k.startsWith(PREFIX)
  );
  const games = await Promise.all(gameKeys.map((k) => get<GameProject>(k)));
  return games
    .filter((g): g is GameProject => !!g)
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function loadGame(id: string): Promise<GameProject | undefined> {
  return get<GameProject>(PREFIX + id);
}

export async function saveGame(game: GameProject): Promise<void> {
  await set(PREFIX + game.id, { ...game, updatedAt: Date.now() });
}

export async function deleteGame(id: string): Promise<void> {
  await del(PREFIX + id);
}

export async function getRecentStickers(): Promise<string[]> {
  const v = await get<string[]>(RECENT_KEY);
  if (Array.isArray(v)) return v;
  // First use: seed the Recent tab with a representative set so it isn't empty.
  await set(RECENT_KEY, STARTER_RECENTS);
  return STARTER_RECENTS;
}

export async function pushRecentSticker(stockId: string): Promise<void> {
  const cur = await getRecentStickers();
  const next = [stockId, ...cur.filter((id) => id !== stockId)].slice(0, RECENT_MAX);
  await set(RECENT_KEY, next);
}
