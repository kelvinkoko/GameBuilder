import { useEffect, useRef, useState } from "react";
import { BigButton } from "../ui/BigButton";
import { useProjectStore } from "../state/projectStore";
import { startGame, type GameHandle } from "../runtime/PhaserGame";

type Props = {
  onBack: () => void;
};

type FsElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};
type FsDoc = Document & {
  webkitExitFullscreen?: () => Promise<void> | void;
  webkitFullscreenElement?: Element | null;
};

function enterFullscreen(el: HTMLElement) {
  const e = el as FsElement;
  const req = e.requestFullscreen ?? e.webkitRequestFullscreen;
  if (!req) return;
  try {
    const r = req.call(e);
    if (r && typeof (r as Promise<void>).catch === "function") {
      (r as Promise<void>).catch(() => {});
    }
  } catch {
    // Fullscreen requires a user gesture in some browsers; safely ignore.
  }
}

function exitFullscreen() {
  const d = document as FsDoc;
  const active = d.fullscreenElement ?? d.webkitFullscreenElement;
  if (!active) return;
  const exit = d.exitFullscreen ?? d.webkitExitFullscreen;
  if (!exit) return;
  try {
    const r = exit.call(d);
    if (r && typeof (r as Promise<void>).catch === "function") {
      (r as Promise<void>).catch(() => {});
    }
  } catch {
    // ignore
  }
}

export function Play({ onBack }: Props) {
  const project = useProjectStore((s) => s.project);
  const rootRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<GameHandle | null>(null);
  const [score, setScore] = useState(0);
  const [end, setEnd] = useState<"win" | "lose" | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!project || !hostRef.current) return;
    setScore(0);
    setEnd(null);
    const handle = startGame(hostRef.current, project, {
      onScore: (s) => setScore(s),
      onEnd: (r) => setEnd(r)
    });
    handleRef.current = handle;
    return () => {
      handle.destroy();
      handleRef.current = null;
    };
  }, [project, tick]);

  // Request fullscreen on mount, exit on unmount. Also treat the user
  // pressing Escape (which exits fullscreen) as a "go back to editor".
  useEffect(() => {
    if (rootRef.current) enterFullscreen(rootRef.current);
    const onChange = () => {
      const active =
        document.fullscreenElement ??
        (document as FsDoc).webkitFullscreenElement;
      if (!active) {
        // Exited fullscreen (user hit Esc or browser exited) — return to editor.
        onBack();
      }
    };
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
      exitFullscreen();
    };
  }, [onBack]);

  if (!project) return null;

  return (
    <div ref={rootRef} className="play">
      <div className="play-topbar">
        <BigButton icon="↩️" label="Edit" variant="ghost" onClick={onBack} />
        <div className="score">⭐ {score}</div>
        <BigButton
          icon="🔄"
          label="Restart"
          variant="info"
          onClick={() => setTick((t) => t + 1)}
        />
      </div>
      <div ref={hostRef} className="game-host" />
      {end && (
        <div className="endcard">
          <span className="big-emoji">{end === "win" ? "🏆" : "😿"}</span>
          <h1>{end === "win" ? "You win!" : "Try again!"}</h1>
          <div className="row" style={{ justifyContent: "center" }}>
            <BigButton
              icon="🔄"
              label="Play again"
              variant="good"
              onClick={() => setTick((t) => t + 1)}
            />
            <BigButton icon="↩️" label="Edit" variant="ghost" onClick={onBack} />
          </div>
        </div>
      )}
    </div>
  );
}
