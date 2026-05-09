import { useEffect, useRef, useState } from "react";
import { BigButton } from "../ui/BigButton";
import { useProjectStore } from "../state/projectStore";
import { startGame, type GameHandle } from "../runtime/PhaserGame";

type Props = {
  onBack: () => void;
};

export function Play({ onBack }: Props) {
  const project = useProjectStore((s) => s.project);
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

  if (!project) return null;

  return (
    <div className="play">
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
