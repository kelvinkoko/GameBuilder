export type AssetSource =
  | { kind: "stock"; stockId: string }
  | { kind: "drawn"; dataUrl: string };

export type Asset = {
  id: string;
  name: string;
  source: AssetSource;
  tag?: string;
};

export type MoveDir = "left" | "right" | "up" | "down" | "follow" | "wander";
export type Speed = 1 | 2 | 3;

export type TapAction = "sound" | "vanish" | "grow" | "shrink" | "score";
export type CollideEffect = "score" | "vanish" | "win" | "lose" | "sound" | "block";

export type Behavior =
  | { kind: "move"; dir: MoveDir; speed: Speed }
  | { kind: "bounce" }
  | { kind: "spin"; speed: Speed }
  | { kind: "onTap"; action: TapAction }
  | { kind: "collide"; withTag: string; effect: CollideEffect }
  | { kind: "controllable"; speed: Speed }
  | { kind: "platformer"; speed: Speed; jump: Speed }
  | { kind: "gravity" };

export type Actor = {
  id: string;
  assetId: string;
  tag: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  behaviors: Behavior[];
};

export type Rule =
  | { kind: "scoreToWin"; target: number }
  | { kind: "timeLimit"; seconds: number };

export type Background =
  | { kind: "color"; value: string }
  | { kind: "preset"; value: "sky" | "grass" | "space" | "sea" };

export type GameProject = {
  id: string;
  name: string;
  template: "blank" | "maze" | "catch" | "platformer" | "aquarium";
  background: Background;
  assets: Asset[];
  actors: Actor[];
  rules: Rule[];
  createdAt: number;
  updatedAt: number;
};

export const TAG_OPTIONS = ["star", "bug", "wall", "player", "treat", "rock"] as const;
export type Tag = typeof TAG_OPTIONS[number];
