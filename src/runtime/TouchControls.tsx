import { useEffect, useState } from "react";

type Key = "left" | "right" | "up" | "down" | "jump";

type Props = {
  showDpad: boolean;
  showJump: boolean;
  onChange: (key: Key, down: boolean) => void;
};

function Arrow({ dir }: { dir: "up" | "down" | "left" | "right" }) {
  const rot = dir === "up" ? 0 : dir === "right" ? 90 : dir === "down" ? 180 : 270;
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      style={{ transform: `rotate(${rot}deg)`, display: "block" }}
      aria-hidden
    >
      <polygon points="20,6 35,30 5,30" fill="currentColor" />
    </svg>
  );
}

function JumpIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" aria-hidden>
      <path
        d="M26 6 L42 26 L33 26 L33 44 L19 44 L19 26 L10 26 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function TouchControls({ showDpad, showJump, onChange }: Props) {
  const [held, setHeld] = useState<Set<Key>>(new Set());

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

  function bind(k: Key, extraClass = "") {
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
      className: `touch-btn ${extraClass} ${held.has(k) ? "held" : ""}`
    };
  }

  return (
    <div className="touch-controls">
      {showDpad ? (
        <div className="pad-cluster">
          <button {...bind("up", "pad-up")} aria-label="Up">
            <Arrow dir="up" />
          </button>
          <button {...bind("left", "pad-left")} aria-label="Left">
            <Arrow dir="left" />
          </button>
          <button {...bind("right", "pad-right")} aria-label="Right">
            <Arrow dir="right" />
          </button>
          <button {...bind("down", "pad-down")} aria-label="Down">
            <Arrow dir="down" />
          </button>
        </div>
      ) : (
        <div />
      )}
      {showJump && (
        <div className="jump-cluster">
          <button {...bind("jump", "jump")} aria-label="Jump">
            <JumpIcon />
          </button>
        </div>
      )}
    </div>
  );
}
