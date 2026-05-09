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

function formatSeconds(s: number): string {
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return r === 0 ? `${m}m` : `${m}m${r}s`;
}

const GOAL_OPTIONS: { target: number | null; label: string; emoji: string }[] = [
  { target: null, label: "No goal", emoji: "🚫" },
  { target: 3, label: "3", emoji: "3️⃣" },
  { target: 5, label: "5", emoji: "5️⃣" },
  { target: 10, label: "10", emoji: "🔟" },
  { target: 20, label: "20", emoji: "💯" }
];

const TIME_OPTIONS: { seconds: number | null; label: string; emoji: string }[] = [
  { seconds: null, label: "No timer", emoji: "🚫" },
  { seconds: 30, label: "30 sec", emoji: "⏱️" },
  { seconds: 60, label: "1 min", emoji: "⏱️" },
  { seconds: 120, label: "2 min", emoji: "⏲️" },
  { seconds: 300, label: "5 min", emoji: "⏲️" }
];

export function Toolbar({ onPlay, onHome }: Props) {
  const project = useProjectStore((s) => s.project);
  const setBackground = useProjectStore((s) => s.setBackground);
  const setName = useProjectStore((s) => s.setName);
  const setRules = useProjectStore((s) => s.setRules);
  const [bgOpen, setBgOpen] = useState(false);
  const [goalOpen, setGoalOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
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

  const currentGoal = project.rules.find((r) => r.kind === "scoreToWin");
  const goalLabel =
    currentGoal && currentGoal.kind === "scoreToWin"
      ? `Goal ⭐${currentGoal.target}`
      : "Goal";
  const currentTime = project.rules.find((r) => r.kind === "timeLimit");
  const timeLabel =
    currentTime && currentTime.kind === "timeLimit"
      ? `Time ${formatSeconds(currentTime.seconds)}`
      : "Time";

  function commit() {
    const trimmed = draftName.trim();
    if (trimmed) setName(trimmed);
    setRenameOpen(false);
  }

  function setGoal(target: number | null) {
    const remaining = project!.rules.filter((r) => r.kind !== "scoreToWin");
    if (target === null) {
      setRules(remaining);
    } else {
      setRules([...remaining, { kind: "scoreToWin", target }]);
    }
    setGoalOpen(false);
  }

  function setTime(seconds: number | null) {
    const remaining = project!.rules.filter((r) => r.kind !== "timeLimit");
    if (seconds === null) {
      setRules(remaining);
    } else {
      setRules([...remaining, { kind: "timeLimit", seconds }]);
    }
    setTimeOpen(false);
  }

  return (
    <div className="toolrow">
      <BigButton icon="🏠" label="Home" variant="ghost" onClick={onHome} />
      <BigButton icon="🎨" label="Background" variant="info" onClick={() => setBgOpen(true)} />
      <BigButton icon="🎯" label={goalLabel} variant="info" onClick={() => setGoalOpen(true)} />
      <BigButton icon="⏱️" label={timeLabel} variant="info" onClick={() => setTimeOpen(true)} />
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

      <Modal open={goalOpen} onClose={() => setGoalOpen(false)}>
        <h2>Score to win</h2>
        <p className="confirm-text">
          Reach this many ⭐ and the game is won!
        </p>
        <div className="behavior-grid">
          {GOAL_OPTIONS.map((g) => {
            const active =
              (g.target === null && !currentGoal) ||
              (currentGoal &&
                currentGoal.kind === "scoreToWin" &&
                currentGoal.target === g.target);
            return (
              <button
                key={String(g.target)}
                className="behavior-card"
                style={active ? { outline: "4px solid var(--accent)" } : undefined}
                onClick={() => setGoal(g.target)}
              >
                <span className="ico">{g.emoji}</span>
                <span className="name">{g.label}</span>
              </button>
            );
          })}
        </div>
      </Modal>

      <Modal open={timeOpen} onClose={() => setTimeOpen(false)}>
        <h2>Time limit</h2>
        <p className="confirm-text">
          When time runs out, the game ends.
        </p>
        <div className="behavior-grid">
          {TIME_OPTIONS.map((t) => {
            const active =
              (t.seconds === null && !currentTime) ||
              (currentTime &&
                currentTime.kind === "timeLimit" &&
                currentTime.seconds === t.seconds);
            return (
              <button
                key={String(t.seconds)}
                className="behavior-card"
                style={active ? { outline: "4px solid var(--accent)" } : undefined}
                onClick={() => setTime(t.seconds)}
              >
                <span className="ico">{t.emoji}</span>
                <span className="name">{t.label}</span>
              </button>
            );
          })}
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
