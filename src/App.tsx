import { useEffect, useRef, useState } from "react";
import { Home } from "./routes/Home";
import { Editor } from "./routes/Editor";
import { Play } from "./routes/Play";
import { useProjectStore } from "./state/projectStore";
import type { GameProject } from "./types";

export type Route = "home" | "editor" | "play";

// The entire app is laid out at a fixed "design" size, then a single
// CSS transform: scale fits it into the actual viewport. No media
// queries, no flex juggling. Touch targets, paddings, fonts — every
// pixel is proportional to the viewport.
const DESIGN_W = 1000;
const DESIGN_H = 800;

export function App() {
  const [route, setRoute] = useState<Route>("home");
  const load = useProjectStore((s) => s.load);
  const close = useProjectStore((s) => s.close);
  const stageRef = useRef<HTMLDivElement>(null);

  function openProject(p: GameProject) {
    load(p);
    setRoute("editor");
  }

  function backHome() {
    close();
    setRoute("home");
  }

  useEffect(() => {
    function fit() {
      const el = stageRef.current;
      if (!el) return;
      const sx = window.innerWidth / DESIGN_W;
      const sy = window.innerHeight / DESIGN_H;
      const s = Math.min(sx, sy);
      const tx = (window.innerWidth - DESIGN_W * s) / 2;
      const ty = (window.innerHeight - DESIGN_H * s) / 2;
      el.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
    }
    fit();
    window.addEventListener("resize", fit);
    window.addEventListener("orientationchange", fit);
    return () => {
      window.removeEventListener("resize", fit);
      window.removeEventListener("orientationchange", fit);
    };
  }, []);

  return (
    <div className="app">
      <div ref={stageRef} className="app-stage">
        {route === "home" && <Home onOpen={openProject} />}
        {route === "editor" && (
          <Editor onPlay={() => setRoute("play")} onHome={backHome} />
        )}
        {route === "play" && <Play onBack={() => setRoute("editor")} />}
      </div>
    </div>
  );
}
