import Phaser from "phaser";
import type { Actor, Asset, GameProject, TapAction } from "../types";
import { findStock } from "../assets/stock";
import { sounds } from "../audio/sounds";

const STAGE_W = 800;
const STAGE_H = 600;

export type GameCallbacks = {
  onScore: (score: number) => void;
  onEnd: (result: "win" | "lose") => void;
  onTime?: (secondsLeft: number) => void;
};

function srcOf(asset: Asset): string {
  if (asset.source.kind === "stock") return findStock(asset.source.stockId)?.dataUrl ?? "";
  return asset.source.dataUrl;
}

function bgColor(project: GameProject): number {
  if (project.background.kind === "color") {
    return Phaser.Display.Color.HexStringToColor(project.background.value).color;
  }
  switch (project.background.value) {
    case "sky": return 0xbde0fe;
    case "grass": return 0xcaffbf;
    case "sea": return 0x90e0ef;
    case "space": return 0x07071a;
  }
}

type TouchInput = {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  jump: boolean;
};

class GameScene extends Phaser.Scene {
  private project!: GameProject;
  private callbacks!: GameCallbacks;
  private actorSprites: Map<string, Phaser.Physics.Arcade.Sprite> = new Map();
  private spriteToActor: Map<Phaser.Physics.Arcade.Sprite, Actor> = new Map();
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private score = 0;
  private ended = false;
  private pointer: { x: number; y: number } | null = null;
  private touchInput: TouchInput = { left: false, right: false, up: false, down: false, jump: false };
  private timeRemaining: number | null = null;
  private lastReportedSeconds = -1;

  init(data: { project: GameProject; callbacks: GameCallbacks }) {
    this.project = data.project;
    this.callbacks = data.callbacks;
    this.score = 0;
    this.ended = false;
    this.actorSprites = new Map();
    this.spriteToActor = new Map();
    this.touchInput = { left: false, right: false, up: false, down: false, jump: false };
    const tl = this.project.rules.find((r) => r.kind === "timeLimit");
    this.timeRemaining = tl && tl.kind === "timeLimit" ? tl.seconds : null;
    this.lastReportedSeconds = -1;
  }

  preload() {
    for (const asset of this.project.assets) {
      this.load.image(asset.id, srcOf(asset));
    }
  }

  create() {
    this.cameras.main.setBackgroundColor(bgColor(this.project));
    this.physics.world.setBounds(0, 0, STAGE_W, STAGE_H);
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }

    this.input.on("pointermove", (p: Phaser.Input.Pointer) => {
      this.pointer = { x: p.worldX, y: p.worldY };
    });
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      this.pointer = { x: p.worldX, y: p.worldY };
    });

    for (const actor of this.project.actors) {
      this.spawn(actor);
    }

    if (this.timeRemaining !== null) {
      this.reportTime();
    }

    // Actors with a "block" collide behavior become the static surface
    // (platforms / walls) — make them immovable and gravity-free so the
    // player can land on them.
    for (const [, sprite] of this.actorSprites) {
      const actor = this.spriteToActor.get(sprite)!;
      const isBlocker = actor.behaviors.some(
        (b) => b.kind === "collide" && b.effect === "block"
      );
      if (isBlocker) {
        sprite.setImmovable(true);
        const body = sprite.body as Phaser.Physics.Arcade.Body | null;
        if (body) body.setAllowGravity(false);
      }
    }

    // Set up overlaps / colliders for collide behaviors.
    for (const [, sprite] of this.actorSprites) {
      const actor = this.spriteToActor.get(sprite)!;
      for (const b of actor.behaviors) {
        if (b.kind !== "collide") continue;
        for (const [, other] of this.actorSprites) {
          const otherActor = this.spriteToActor.get(other);
          if (!otherActor || otherActor.id === actor.id) continue;
          if (otherActor.tag !== b.withTag) continue;
          if (b.effect === "block") {
            this.physics.add.collider(sprite, other);
          } else {
            this.physics.add.overlap(sprite, other, () => {
              this.handleCollide(sprite, other, b.effect);
            });
          }
        }
      }
    }

    // World-bounds collision for bouncing/controllable/platformer actors.
    for (const [, sprite] of this.actorSprites) {
      const actor = this.spriteToActor.get(sprite)!;
      const bounce = actor.behaviors.some((b) => b.kind === "bounce");
      const controllable = actor.behaviors.some(
        (b) => b.kind === "controllable" || b.kind === "platformer"
      );
      if (bounce) {
        sprite.setCollideWorldBounds(true);
        sprite.setBounce(1, 1);
      } else if (controllable) {
        sprite.setCollideWorldBounds(true);
      } else {
        sprite.setCollideWorldBounds(false);
      }
    }
  }

  setTouchInput(input: Partial<TouchInput>) {
    Object.assign(this.touchInput, input);
  }

  spawn(actor: Actor) {
    const sprite = this.physics.add.sprite(actor.x, actor.y, actor.assetId);
    // Normalize sprite size — emoji SVGs come in various intrinsic sizes.
    const target = 80;
    const w = sprite.width || target;
    const h = sprite.height || target;
    const baseScale = target / Math.max(w, h);
    sprite.setScale(baseScale * actor.scale);
    sprite.setRotation(Phaser.Math.DegToRad(actor.rotation));
    sprite.setDataEnabled();
    sprite.setData("baseScale", baseScale);
    sprite.setData("actor", actor);
    sprite.setInteractive({ useHandCursor: true });
    // Tighter hitbox than the visual so kids don't lose to "almost" touches.
    // Body size is in texture-pixels; arcade scales it with the sprite.
    const hitFrac = 0.65;
    const bw = w * hitFrac;
    const bh = h * hitFrac;
    sprite.body.setSize(bw, bh);
    sprite.body.setOffset((w - bw) / 2, (h - bh) / 2);
    this.actorSprites.set(actor.id, sprite);
    this.spriteToActor.set(sprite, actor);

    sprite.on("pointerdown", () => {
      for (const b of actor.behaviors) {
        if (b.kind !== "onTap") continue;
        this.handleTap(sprite, b.action);
      }
    });

    if (
      actor.behaviors.some((b) => b.kind === "gravity") ||
      actor.behaviors.some((b) => b.kind === "platformer")
    ) {
      sprite.setGravityY(900);
    }

    // Initial velocity from move behavior.
    for (const b of actor.behaviors) {
      if (b.kind !== "move") continue;
      const v = speedToPx(b.speed);
      switch (b.dir) {
        case "left": sprite.setVelocityX(-v); break;
        case "right": sprite.setVelocityX(v); break;
        case "up": sprite.setVelocityY(-v); break;
        case "down": sprite.setVelocityY(v); break;
        case "wander":
          sprite.setVelocity(
            (Math.random() * 2 - 1) * v,
            (Math.random() * 2 - 1) * v
          );
          break;
        case "follow":
          // Velocity set per-frame in update.
          break;
      }
    }
  }

  handleTap(sprite: Phaser.Physics.Arcade.Sprite, action: TapAction) {
    if (this.ended) return;
    switch (action) {
      case "sound":
        sounds.boop();
        break;
      case "vanish":
        sounds.whoosh();
        sprite.disableBody(true, true);
        break;
      case "grow":
        sounds.ding();
        sprite.setScale(Math.min(sprite.scale * 1.25, sprite.getData("baseScale") * 4));
        break;
      case "shrink":
        sounds.ding();
        sprite.setScale(Math.max(sprite.scale * 0.8, sprite.getData("baseScale") * 0.25));
        break;
      case "score":
        sounds.ding();
        sprite.disableBody(true, true);
        this.score += 1;
        this.callbacks.onScore(this.score);
        this.checkScoreWin();
        break;
    }
  }

  handleCollide(self: Phaser.Physics.Arcade.Sprite, other: Phaser.Physics.Arcade.Sprite, effect: "score" | "vanish" | "win" | "lose" | "sound" | "block") {
    if (this.ended) return;
    if (!self.active || !other.active) return;
    switch (effect) {
      case "block":
        // Handled via add.collider during scene setup; nothing to do here.
        return;
      case "sound":
        sounds.ding();
        break;
      case "vanish":
        sounds.whoosh();
        self.disableBody(true, true);
        break;
      case "score": {
        sounds.ding();
        // The "self" actor is the one that scored — typically a treat hit by the player.
        self.disableBody(true, true);
        this.score += 1;
        this.callbacks.onScore(this.score);
        this.checkScoreWin();
        break;
      }
      case "win":
        this.endGame("win");
        break;
      case "lose":
        this.endGame("lose");
        break;
    }
  }

  checkScoreWin() {
    const target = this.project.rules.find((r) => r.kind === "scoreToWin");
    if (target && target.kind === "scoreToWin" && this.score >= target.target) {
      this.endGame("win");
    }
  }

  reportTime() {
    if (this.timeRemaining === null) return;
    const seconds = Math.max(0, Math.ceil(this.timeRemaining));
    if (seconds !== this.lastReportedSeconds) {
      this.lastReportedSeconds = seconds;
      this.callbacks.onTime?.(seconds);
    }
  }

  endTimedGame() {
    // Time ran out. If a score goal exists and wasn't met it's a loss;
    // otherwise the player survived → win.
    const goal = this.project.rules.find((r) => r.kind === "scoreToWin");
    if (goal && goal.kind === "scoreToWin" && this.score < goal.target) {
      this.endGame("lose");
    } else {
      this.endGame("win");
    }
  }

  endGame(result: "win" | "lose") {
    if (this.ended) return;
    this.ended = true;
    if (result === "win") sounds.yay();
    else sounds.buzz();
    this.physics.pause();
    this.callbacks.onEnd(result);
  }

  update(_time: number, delta: number) {
    if (this.ended) return;
    const dt = delta / 1000;
    if (this.timeRemaining !== null) {
      this.timeRemaining -= dt;
      this.reportTime();
      if (this.timeRemaining <= 0) {
        this.endTimedGame();
        return;
      }
    }
    for (const [, sprite] of this.actorSprites) {
      if (!sprite.active) continue;
      const actor = this.spriteToActor.get(sprite)!;
      for (const b of actor.behaviors) {
        if (b.kind === "spin") {
          sprite.rotation += b.speed * 2 * dt;
        }
        if (b.kind === "move" && b.dir === "follow" && this.pointer) {
          const dx = this.pointer.x - sprite.x;
          const dy = this.pointer.y - sprite.y;
          const dist = Math.hypot(dx, dy);
          if (dist > 4) {
            const v = speedToPx(b.speed);
            sprite.setVelocity((dx / dist) * v, (dy / dist) * v);
          } else {
            sprite.setVelocity(0, 0);
          }
        }
        if (b.kind === "controllable") {
          const v = speedToPx(b.speed);
          let vx = 0, vy = 0;
          if (this.cursors?.left?.isDown || this.touchInput.left) vx = -v;
          if (this.cursors?.right?.isDown || this.touchInput.right) vx = v;
          if (this.cursors?.up?.isDown || this.touchInput.up) vy = -v;
          if (this.cursors?.down?.isDown || this.touchInput.down) vy = v;
          sprite.setVelocity(vx, vy);
        }
        if (b.kind === "platformer") {
          const v = speedToPx(b.speed);
          let vx = 0;
          if (this.cursors?.left?.isDown || this.touchInput.left) vx = -v;
          if (this.cursors?.right?.isDown || this.touchInput.right) vx = v;
          sprite.setVelocityX(vx);
          const wantsJump =
            this.cursors?.up?.isDown ||
            this.cursors?.space?.isDown ||
            this.touchInput.jump;
          const body = sprite.body as Phaser.Physics.Arcade.Body;
          const onGround = body.blocked.down || body.touching.down;
          if (wantsJump && onGround) {
            const jv = b.jump === 1 ? 380 : b.jump === 2 ? 560 : 720;
            sprite.setVelocityY(-jv);
          }
        }
      }
      // Recycle off-screen "down"-mover treats so the catch game keeps going.
      if (sprite.y > STAGE_H + 60 && actor.behaviors.some((bb) => bb.kind === "move" && bb.dir === "down")) {
        sprite.y = -40;
        sprite.x = Phaser.Math.Between(60, STAGE_W - 60);
        if (!sprite.active) sprite.enableBody(true, sprite.x, sprite.y, true, true);
      }
    }
  }
}

function speedToPx(speed: 1 | 2 | 3): number {
  return speed === 1 ? 80 : speed === 2 ? 160 : 280;
}

export type GameHandle = {
  destroy: () => void;
  setTouch: (input: Partial<TouchInput>) => void;
};

export function startGame(
  parent: HTMLElement,
  project: GameProject,
  callbacks: GameCallbacks
): GameHandle {
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: STAGE_W,
    height: STAGE_H,
    backgroundColor: "#000",
    physics: {
      default: "arcade",
      arcade: { gravity: { x: 0, y: 0 }, debug: false }
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    }
  });
  game.events.once(Phaser.Core.Events.READY, () => {
    game.scene.add("main", GameScene, true, { project, callbacks });
  });
  return {
    destroy: () => game.destroy(true),
    setTouch: (input) => {
      const scene = game.scene.getScene("main") as GameScene | undefined;
      scene?.setTouchInput(input);
    }
  };
}
