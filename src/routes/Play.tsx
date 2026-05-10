import { useEffect, useMemo, useRef, useState } from "react";
import { BigButton } from "../ui/BigButton";
import { useProjectStore } from "../state/projectStore";
import { startGame, type GameHandle } from "../runtime/PhaserGame";
import { TouchControls } from "../runtime/TouchControls";
import { RotatePrompt } from "../ui/RotatePrompt";

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
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [end, setEnd] = useState<"win" | "lose" | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!project || !hostRef.current) return;
    setScore(0);
    setSecondsLeft(null);
    setEnd(null);
    const handle = startGame(hostRef.current, project, {
      onScore: (s) => setScore(s),
      onEnd: (r) => setEnd(r),
      onTime: (s) => setSecondsLeft(s)
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

  const controls = useMemo(() => {
    if (!project) return { dpad: false, jump: false };
    let dpad = false;
    let jump = false;
    for (const a of project.actors) {
      for (const b of a.behaviors) {
        if (b.kind === "controllable") dpad = true;
        if (b.kind === "platformer") {
          dpad = true;
          jump = true;
        }
      }
    }
    return { dpad, jump };
  }, [project]);

  const hasScore = useMemo(() => {
    if (!project) return false;
    if (project.rules.some((r) => r.kind === "scoreToWin")) return true;
    for (const a of project.actors) {
      for (const b of a.behaviors) {
        if (b.kind === "collide" && b.effect === "score") return true;
        if (b.kind === "onTap" && b.action === "score") return true;
      }
    }
    return false;
  }, [project]);

  const goalTarget = useMemo(() => {
    const r = project?.rules.find((r) => r.kind === "scoreToWin");
    return r && r.kind === "scoreToWin" ? r.target : null;
  }, [project]);

  if (!project) return null;

  return (
    <div ref={rootRef} className="play">
      <RotatePrompt />
      <div className="play-topbar">
        <BigButton icon="↩️" label="Edit" variant="ghost" onClick={onBack} />
        <div className="score">
          {hasScore && (goalTarget ? `⭐ ${score} / ${goalTarget}` : `⭐ ${score}`)}
          {hasScore && secondsLeft !== null && "  "}
          {secondsLeft !== null && (
            <span style={{ color: secondsLeft <= 5 ? "#ef476f" : undefined }}>
              ⏱️ {secondsLeft}
            </span>
          )}
        </div>
        <BigButton
          icon="🔄"
          label="Restart"
          variant="info"
          onClick={() => setTick((t) => t + 1)}
        />
      </div>
      <div ref={hostRef} className="game-host">
        {(controls.dpad || controls.jump) && (
          <TouchControls
            showDpad={controls.dpad}
            showJump={controls.jump}
            onChange={(key, down) => {
              handleRef.current?.setTouch({ [key]: down });
            }}
          />
        )}
      </div>
      {end && (
        <div className="endcard">
          <span className="big-emoji">{end === "win" ? "🏆" : "😿"}</span>
          <h1>{end === "win" ? "You win!" : "Try again!"}</h1>
          {score > 0 && (
            <div style={{ fontSize: 28, fontWeight: 800 }}>⭐ {score}</div>
          )}
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
