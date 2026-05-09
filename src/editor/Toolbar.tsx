import { useState } from "react";
import { BigButton } from "../ui/BigButton";
import { Modal } from "../ui/Modal";
import { useProjectStore } from "../state/projectStore";
import type { Background } from "../types";

const PRESETS: { value: "sky" | "grass" | "space" | "sea"; emoji: string; name: string }[] = [
  { value: "sky", emoji: "☀️", name: "Sky" },
  { value: "grass", emoji: "🌱", name: "Grass" },
  { value: "sea", emoji: "🌊", name: "Sea" },
  { value: "space", emoji: "🌌", name: "Space" }
];

type Props = {
  onPlay: () => void;
  onHome: () => void;
};

export function Toolbar({ onPlay, onHome }: Props) {
  const project = useProjectStore((s) => s.project);
  const setBackground = useProjectStore((s) => s.setBackground);
  const [bgOpen, setBgOpen] = useState(false);

  if (!project) return null;

  return (
    <div className="toolrow">
      <BigButton icon="🏠" label="Home" variant="ghost" onClick={onHome} />
      <BigButton icon="🎨" label="Background" variant="info" onClick={() => setBgOpen(true)} />
      <div className="spacer" style={{ flex: 1 }} />
      <span style={{ fontWeight: 700, fontSize: 18 }}>{project.name}</span>
      <div className="spacer" style={{ flex: 1 }} />
      <BigButton icon="▶️" label="Play" variant="good" onClick={onPlay} />

      <Modal open={bgOpen} onClose={() => setBgOpen(false)}>
        <h2>Pick a background</h2>
        <div className="behavior-grid">
          {PRESETS.map((p) => (
            <button
              key={p.value}
              className="behavior-card"
              onClick={() => {
                const bg: Background = { kind: "preset", value: p.value };
                setBackground(bg);
                setBgOpen(false);
              }}
            >
              <span className="ico">{p.emoji}</span>
              <span className="name">{p.name}</span>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}
