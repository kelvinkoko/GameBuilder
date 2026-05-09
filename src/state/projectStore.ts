import { create } from "zustand";
import { v4 as uuid } from "uuid";
import type {
  Actor,
  Asset,
  Behavior,
  Background,
  GameProject,
  Rule
} from "../types";
import { saveGame } from "./library";

type State = {
  project: GameProject | null;
  selectedActorId: string | null;
  load: (project: GameProject) => void;
  close: () => void;
  setName: (name: string) => void;
  setBackground: (bg: Background) => void;
  addAsset: (asset: Omit<Asset, "id">) => Asset;
  addActor: (assetId: string, x: number, y: number, tag: string) => Actor;
  removeActor: (id: string) => void;
  selectActor: (id: string | null) => void;
  updateActor: (id: string, patch: Partial<Actor>) => void;
  addBehavior: (actorId: string, b: Behavior) => void;
  removeBehavior: (actorId: string, index: number) => void;
  setRules: (rules: Rule[]) => void;
};

let saveTimer: ReturnType<typeof setTimeout> | null = null;
function scheduleSave(p: GameProject | null) {
  if (!p) return;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    void saveGame(p);
  }, 400);
}

function patchProject(s: State, mut: (p: GameProject) => GameProject): Partial<State> {
  if (!s.project) return {};
  const next = mut(s.project);
  scheduleSave(next);
  return { project: next };
}

export const useProjectStore = create<State>((set) => ({
  project: null,
  selectedActorId: null,

  load: (project) => set({ project, selectedActorId: null }),
  close: () => set({ project: null, selectedActorId: null }),

  setName: (name) =>
    set((s) => patchProject(s, (p) => ({ ...p, name }))),

  setBackground: (background) =>
    set((s) => patchProject(s, (p) => ({ ...p, background }))),

  addAsset: (asset) => {
    const full: Asset = { ...asset, id: uuid() };
    set((s) => patchProject(s, (p) => ({ ...p, assets: [...p.assets, full] })));
    return full;
  },

  addActor: (assetId, x, y, tag) => {
    const actor: Actor = {
      id: uuid(),
      assetId,
      tag,
      x,
      y,
      scale: 1,
      rotation: 0,
      behaviors: []
    };
    set((s) =>
      s.project
        ? {
            ...patchProject(s, (p) => ({ ...p, actors: [...p.actors, actor] })),
            selectedActorId: actor.id
          }
        : {}
    );
    return actor;
  },

  removeActor: (id) =>
    set((s) => ({
      ...patchProject(s, (p) => ({
        ...p,
        actors: p.actors.filter((a) => a.id !== id)
      })),
      selectedActorId: s.selectedActorId === id ? null : s.selectedActorId
    })),

  selectActor: (id) => set({ selectedActorId: id }),

  updateActor: (id, patch) =>
    set((s) =>
      patchProject(s, (p) => ({
        ...p,
        actors: p.actors.map((a) => (a.id === id ? { ...a, ...patch } : a))
      }))
    ),

  addBehavior: (actorId, b) =>
    set((s) =>
      patchProject(s, (p) => ({
        ...p,
        actors: p.actors.map((a) =>
          a.id === actorId ? { ...a, behaviors: [...a.behaviors, b] } : a
        )
      }))
    ),

  removeBehavior: (actorId, index) =>
    set((s) =>
      patchProject(s, (p) => ({
        ...p,
        actors: p.actors.map((a) =>
          a.id === actorId
            ? { ...a, behaviors: a.behaviors.filter((_, i) => i !== index) }
            : a
        )
      }))
    ),

  setRules: (rules) =>
    set((s) => patchProject(s, (p) => ({ ...p, rules })))
}));

export function newBlankProject(name = "My game"): GameProject {
  return {
    id: uuid(),
    name,
    template: "blank",
    background: { kind: "preset", value: "sky" },
    assets: [],
    actors: [],
    rules: [],
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
}
