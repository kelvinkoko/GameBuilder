import { Modal } from "../ui/Modal";
import { BigButton } from "../ui/BigButton";
import { VoiceRecorder } from "./VoiceRecorder";
import { useProjectStore } from "../state/projectStore";
import type { Behavior, CollideEffect } from "../types";
import { TAG_OPTIONS } from "../types";
import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onAdd: (b: Behavior) => void;
};

type Card = {
  key: string;
  ico: string;
  name: string;
  build: () => Behavior;
};

const CARDS: Card[] = [
  { key: "left", ico: "⬅️", name: "Move left", build: () => ({ kind: "move", dir: "left", speed: 2 }) },
  { key: "right", ico: "➡️", name: "Move right", build: () => ({ kind: "move", dir: "right", speed: 2 }) },
  { key: "up", ico: "⬆️", name: "Move up", build: () => ({ kind: "move", dir: "up", speed: 2 }) },
  { key: "down", ico: "⬇️", name: "Move down", build: () => ({ kind: "move", dir: "down", speed: 2 }) },
  { key: "follow", ico: "👆", name: "Follow finger", build: () => ({ kind: "move", dir: "follow", speed: 3 }) },
  { key: "wander", ico: "🌀", name: "Wander", build: () => ({ kind: "move", dir: "wander", speed: 2 }) },
  { key: "bounce", ico: "↔️", name: "Bounce", build: () => ({ kind: "bounce" }) },
  { key: "spin", ico: "🔁", name: "Spin", build: () => ({ kind: "spin", speed: 2 }) },
  { key: "controllable", ico: "🎮", name: "Arrow keys", build: () => ({ kind: "controllable", speed: 2 }) },
  { key: "platformer", ico: "🦘", name: "Run & jump", build: () => ({ kind: "platformer", speed: 2, jump: 2 }) },
  { key: "gravity", ico: "🪨", name: "Falls", build: () => ({ kind: "gravity" }) },
  { key: "tap-sound", ico: "🔊", name: "Tap: sound", build: () => ({ kind: "onTap", action: "sound" }) },
  { key: "tap-vanish", ico: "💨", name: "Tap: gone", build: () => ({ kind: "onTap", action: "vanish" }) },
  { key: "tap-grow", ico: "🔼", name: "Tap: grow", build: () => ({ kind: "onTap", action: "grow" }) },
  { key: "tap-shrink", ico: "🔽", name: "Tap: shrink", build: () => ({ kind: "onTap", action: "shrink" }) },
  { key: "tap-score", ico: "⭐", name: "Tap: score", build: () => ({ kind: "onTap", action: "score" }) }
];

export function BehaviorPicker({ open, onClose, onAdd }: Props) {
  const addSound = useProjectStore((s) => s.addSound);
  const [collidePicker, setCollidePicker] = useState<null | {
    effect: CollideEffect;
    label: string;
    ico: string;
  }>(null);
  const [voiceOpen, setVoiceOpen] = useState(false);

  return (
    <Modal open={open} onClose={onClose}>
      <h2>Pick a power</h2>
      <div className="behavior-grid">
        {CARDS.map((c) => (
          <button
            key={c.key}
            className="behavior-card"
            onClick={() => {
              onAdd(c.build());
              onClose();
            }}
          >
            <span className="ico">{c.ico}</span>
            <span className="name">{c.name}</span>
          </button>
        ))}
        <button
          className="behavior-card"
          onClick={() => setVoiceOpen(true)}
        >
          <span className="ico">🎤</span>
          <span className="name">Tap: my voice</span>
        </button>
        <button
          className="behavior-card"
          onClick={() => setCollidePicker({ effect: "score", label: "Touch: score", ico: "⭐" })}
        >
          <span className="ico">⭐</span>
          <span className="name">Touch: score</span>
        </button>
        <button
          className="behavior-card"
          onClick={() => setCollidePicker({ effect: "win", label: "Touch: win", ico: "🏆" })}
        >
          <span className="ico">🏆</span>
          <span className="name">Touch: win</span>
        </button>
        <button
          className="behavior-card"
          onClick={() => setCollidePicker({ effect: "lose", label: "Touch: lose", ico: "💔" })}
        >
          <span className="ico">💔</span>
          <span className="name">Touch: lose</span>
        </button>
        <button
          className="behavior-card"
          onClick={() => setCollidePicker({ effect: "vanish", label: "Touch: gone", ico: "💥" })}
        >
          <span className="ico">💥</span>
          <span className="name">Touch: gone</span>
        </button>
        <button
          className="behavior-card"
          onClick={() => setCollidePicker({ effect: "block", label: "Touch: block", ico: "🧱" })}
        >
          <span className="ico">🧱</span>
          <span className="name">Stop them</span>
        </button>
      </div>
      <div className="modal-actions">
        <BigButton icon="✕" label="Cancel" variant="ghost" onClick={onClose} />
      </div>

      <VoiceRecorder
        open={voiceOpen}
        onClose={() => setVoiceOpen(false)}
        onSave={(dataUrl) => {
          const sound = addSound(dataUrl);
          onAdd({ kind: "onTap", action: "voice", soundId: sound.id });
          setVoiceOpen(false);
          onClose();
        }}
      />

      <Modal open={!!collidePicker} onClose={() => setCollidePicker(null)}>
        <h2>{collidePicker?.label}</h2>
        <p className="confirm-text">When this touches a…</p>
        <div className="behavior-grid">
          {TAG_OPTIONS.map((tag) => (
            <button
              key={tag}
              className="behavior-card"
              onClick={() => {
                if (collidePicker) {
                  onAdd({ kind: "collide", withTag: tag, effect: collidePicker.effect });
                  setCollidePicker(null);
                  onClose();
                }
              }}
            >
              <span className="ico">{tagEmoji(tag)}</span>
              <span className="name">{tag}</span>
            </button>
          ))}
        </div>
      </Modal>
    </Modal>
  );
}

function tagEmoji(tag: string): string {
  switch (tag) {
    case "star": return "⭐";
    case "bug": return "🐛";
    case "wall": return "🧱";
    case "player": return "🎮";
    case "treat": return "🍰";
    case "rock": return "🪨";
    default: return "🏷️";
  }
}

export { tagEmoji };
