import { useEffect, useState } from "react";

type Key = "left" | "right" | "up" | "down" | "jump";

type Props = {
  showDpad: boolean;
  showJump: boolean;
  onChange: (key: Key, down: boolean) => void;
};

export function TouchControls({ showDpad, showJump, onChange }: Props) {
  const [held, setHeld] = useState<Set<Key>>(new Set());

  // Release everything if the component unmounts mid-press.
  useEffect(() => {
    return () => {
      for (const k of held) onChange(k, false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function press(k: Key, down: boolean) {
    setHeld((prev) => {
      const next = new Set(prev);
      if (down) next.add(k);
      else next.delete(k);
      return next;
    });
    onChange(k, down);
  }

  function bind(k: Key) {
    return {
      onPointerDown: (e: React.PointerEvent) => {
        e.preventDefault();
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        press(k, true);
      },
      onPointerUp: (e: React.PointerEvent) => {
        e.preventDefault();
        press(k, false);
      },
      onPointerCancel: () => press(k, false),
      onPointerLeave: (e: React.PointerEvent) => {
        if ((e.buttons & 1) === 0) return;
        press(k, false);
      },
      className: `touch-btn ${held.has(k) ? "held" : ""}`
    };
  }

  return (
    <div className="touch-controls">
      {showDpad ? (
        <div className="pad-cluster">
          <button {...bind("up")} className={`touch-btn pad-up ${held.has("up") ? "held" : ""}`}>⬆</button>
          <button {...bind("left")} className={`touch-btn pad-left ${held.has("left") ? "held" : ""}`}>⬅</button>
          <button {...bind("right")} className={`touch-btn pad-right ${held.has("right") ? "held" : ""}`}>➡</button>
          <button {...bind("down")} className={`touch-btn pad-down ${held.has("down") ? "held" : ""}`}>⬇</button>
        </div>
      ) : (
        <div />
      )}
      {showJump && (
        <div className="jump-cluster">
          <button {...bind("jump")} className={`touch-btn jump ${held.has("jump") ? "held" : ""}`}>⤴</button>
        </div>
      )}
    </div>
  );
}
