import { useEffect, useRef, useState } from "react";
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
  const setName = useProjectStore((s) => s.setName);
  const [bgOpen, setBgOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [draftName, setDraftName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (renameOpen) {
      setDraftName(project?.name ?? "");
      // Wait for the modal to mount before focusing.
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 0);
    }
  }, [renameOpen, project?.name]);

  if (!project) return null;

  function commit() {
    const trimmed = draftName.trim();
    if (trimmed) setName(trimmed);
    setRenameOpen(false);
  }

  return (
    <div className="toolrow">
      <BigButton icon="🏠" label="Home" variant="ghost" onClick={onHome} />
      <BigButton icon="🎨" label="Background" variant="info" onClick={() => setBgOpen(true)} />
      <div className="spacer" style={{ flex: 1 }} />
      <button
        className="game-name-btn"
        onClick={() => setRenameOpen(true)}
        aria-label="Rename game"
        title="Tap to rename"
      >
        ✏️ {project.name}
      </button>
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

      <Modal open={renameOpen} onClose={() => setRenameOpen(false)}>
        <h2>Game name</h2>
        <input
          ref={inputRef}
          className="rename-input"
          type="text"
          value={draftName}
          maxLength={40}
          onChange={(e) => setDraftName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") setRenameOpen(false);
          }}
        />
        <div className="modal-actions">
          <BigButton
            icon="✕"
            label="Cancel"
            variant="ghost"
            onClick={() => setRenameOpen(false)}
          />
          <BigButton icon="✓" label="Save" variant="good" onClick={commit} />
        </div>
      </Modal>
    </div>
  );
}
