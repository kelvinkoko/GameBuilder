import { useState } from "react";
import { Home } from "./routes/Home";
import { Editor } from "./routes/Editor";
import { Play } from "./routes/Play";
import { useProjectStore } from "./state/projectStore";
import type { GameProject } from "./types";

export type Route = "home" | "editor" | "play";

export function App() {
  const [route, setRoute] = useState<Route>("home");
  const load = useProjectStore((s) => s.load);
  const close = useProjectStore((s) => s.close);

  function openProject(p: GameProject) {
    load(p);
    setRoute("editor");
  }

  function backHome() {
    close();
    setRoute("home");
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
