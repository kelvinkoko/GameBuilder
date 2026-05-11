import { useEffect, useState } from "react";
import { Home } from "./routes/Home";
import { Editor } from "./routes/Editor";
import { Play } from "./routes/Play";
import { SmallScreenPrompt } from "./ui/SmallScreenPrompt";
import { useProjectStore } from "./state/projectStore";
import type { GameProject } from "./types";

export type Route = "home" | "editor" | "play";

const MIN_W = 600;
const MIN_H = 450;

function isSmallScreen(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < MIN_W || window.innerHeight < MIN_H;
}

export function App() {
  const [route, setRoute] = useState<Route>("home");
  const [bypass, setBypass] = useState(false);
  const [small, setSmall] = useState(isSmallScreen);
  const load = useProjectStore((s) => s.load);
  const close = useProjectStore((s) => s.close);

  useEffect(() => {
    function check() {
      setSmall(isSmallScreen());
    }
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);
    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
    };
  }, []);

  function openProject(p: GameProject) {
    load(p);
    setRoute("editor");
  }

  function backHome() {
    close();
    setRoute("home");
  }

  if (small && !bypass) {
    return <SmallScreenPrompt onContinue={() => setBypass(true)} />;
  }

  return (
    <div className="app">
      {route === "home" && <Home onOpen={openProject} />}
      {route === "editor" && (
        <Editor onPlay={() => setRoute("play")} onHome={backHome} />
      )}
      {route === "play" && <Play onBack={() => setRoute("editor")} />}
    </div>
  );
}
