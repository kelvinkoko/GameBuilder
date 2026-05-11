import { useState } from "react";
import { useProjectStore } from "../state/projectStore";
import { BigButton } from "../ui/BigButton";
import { Modal } from "../ui/Modal";
import { tagEmoji } from "./BehaviorPicker";
import { TAG_OPTIONS, type Behavior } from "../types";

function describe(b: Behavior): { ico: string; name: string } {
  switch (b.kind) {
    case "move":
      switch (b.dir) {
        case "left": return { ico: "⬅️", name: "Move left" };
        case "right": return { ico: "➡️", name: "Move right" };
        case "up": return { ico: "⬆️", name: "Move up" };
        case "down": return { ico: "⬇️", name: "Move down" };
        case "follow": return { ico: "👆", name: "Follow" };
        case "wander": return { ico: "🌀", name: "Wander" };
      }
      return { ico: "➡️", name: "Move" };
    case "bounce": return { ico: "↔️", name: "Bounce" };
    case "spin": return { ico: "🔁", name: "Spin" };
    case "controllable": return { ico: "🎮", name: "Arrows" };
    case "platformer": return { ico: "🦘", name: "Run & jump" };
    case "gravity": return { ico: "🪨", name: "Falls" };
    case "onTap":
      switch (b.action) {
        case "sound": return { ico: "🔊", name: "Tap: sound" };
        case "vanish": return { ico: "💨", name: "Tap: gone" };
        case "grow": return { ico: "🔼", name: "Tap: grow" };
        case "shrink": return { ico: "🔽", name: "Tap: shrink" };
        case "score": return { ico: "⭐", name: "Tap: score" };
      }
      break;
    case "collide":
      return {
        ico:
          b.effect === "win" ? "🏆" :
          b.effect === "lose" ? "💔" :
          b.effect === "score" ? "⭐" :
          b.effect === "vanish" ? "💥" :
          b.effect === "block" ? "🧱" : "🔊",
        name: `${b.effect} on ${b.withTag}`
      };
  }
}

export function Inspector({ onAddBehavior }: { onAddBehavior: () => void }) {
  const project = useProjectStore((s) => s.project);
  const id = useProjectStore((s) => s.selectedActorId);
  const removeBehavior = useProjectStore((s) => s.removeBehavior);
  const removeActor = useProjectStore((s) => s.removeActor);
  const copyActor = useProjectStore((s) => s.copyActor);
  const updateActor = useProjectStore((s) => s.updateActor);
  const [tagOpen, setTagOpen] = useState(false);

  if (!project) return null;
  const actor = id ? project.actors.find((a) => a.id === id) : undefined;
  const asset = actor ? project.assets.find((a) => a.id === actor.assetId) : undefined;

  // Empty state — keep the inspector strip in the layout so selecting
  // an actor doesn't resize the stage. Skip the "tap a sticker" hint
  // when the stage has no stickers yet (the Editor shows its own
  // "Tap Add or Draw to start" prompt in that case).
  if (!actor) {
    const hasActors = project.actors.length > 0;
    return (
      <div className="inspector inspector-empty">
        {hasActors && (
          <span className="hint">👆 Tap a sticker on the stage to edit it</span>
        )}
      </div>
    );
  }

  return (
    <div className="inspector">
      <div className="header">
        <span style={{ fontSize: 28 }}>{asset?.name}</span>
        <span className="chip" onClick={() => setTagOpen(true)} style={{ cursor: "pointer" }}>
          {tagEmoji(actor.tag)} {actor.tag}
        </span>
        <div className="spacer" />
        <BigButton
          icon="🔼"
          label="Bigger"
          variant="ghost"
          onClick={() => updateActor(actor.id, { scale: Math.min(3, actor.scale + 0.2) })}
        />
        <BigButton
          icon="🔽"
          label="Smaller"
          variant="ghost"
          onClick={() => updateActor(actor.id, { scale: Math.max(0.4, actor.scale - 0.2) })}
        />
        <BigButton
          icon="➕"
          label="Copy"
          variant="good"
          onClick={() => copyActor(actor.id)}
        />
        <BigButton
          icon="🗑️"
          label="Delete"
          variant="accent"
          onClick={() => removeActor(actor.id)}
        />
      </div>
      <div className="chips">
        {actor.behaviors.map((b, i) => {
          const d = describe(b);
          return (
            <span key={i} className="chip">
              <span style={{ fontSize: 20 }}>{d.ico}</span>
              {d.name}
              <span className="x" onClick={() => removeBehavior(actor.id, i)}>✕</span>
            </span>
          );
        })}
        <BigButton icon="➕" label="Add power" variant="good" onClick={onAddBehavior} />
      </div>

      <Modal open={tagOpen} onClose={() => setTagOpen(false)}>
        <h2>Tag</h2>
        <p className="confirm-text">Other things will know this by its tag.</p>
        <div className="behavior-grid">
          {TAG_OPTIONS.map((t) => (
            <button
              key={t}
              className="behavior-card"
              onClick={() => {
                updateActor(actor.id, { tag: t });
                setTagOpen(false);
              }}
            >
              <span className="ico">{tagEmoji(t)}</span>
              <span className="name">{t}</span>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}
