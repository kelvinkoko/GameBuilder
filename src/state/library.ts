import { get, set, del, keys } from "idb-keyval";
import type { GameProject } from "../types";

// IndexedDB facade. Designed so the surface (list/load/save/delete)
// can later be backed by a remote service without touching callers.

const PREFIX = "game:";

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
