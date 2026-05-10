import { useState } from "react";
import { useProjectStore } from "../state/projectStore";
import { Toolbar } from "../editor/Toolbar";
import { SceneCanvas } from "../editor/SceneCanvas";
import { AssetTray, StockPicker } from "../editor/AssetTray";
import { DrawingPad } from "../editor/DrawingPad";
import { BehaviorPicker } from "../editor/BehaviorPicker";
import { Inspector } from "../editor/Inspector";

type Props = {
  onPlay: () => void;
  onHome: () => void;
};

export function Editor({ onPlay, onHome }: Props) {
  const addAsset = useProjectStore((s) => s.addAsset);
  const addBehavior = useProjectStore((s) => s.addBehavior);
  const selectedActorId = useProjectStore((s) => s.selectedActorId);
  const project = useProjectStore((s) => s.project);
  const [stockOpen, setStockOpen] = useState(false);
  const [drawOpen, setDrawOpen] = useState(false);
  const [behaviorOpen, setBehaviorOpen] = useState(false);

  return (
    <div className="editor">
      <Toolbar onPlay={onPlay} onHome={onHome} />
      <div className="stage-wrap">
        <SceneCanvas />
      </div>
      <Inspector onAddBehavior={() => setBehaviorOpen(true)} />
      <AssetTray
        onPickStock={() => setStockOpen(true)}
        onDraw={() => setDrawOpen(true)}
      />
      <StockPicker open={stockOpen} onClose={() => setStockOpen(false)} />
      <DrawingPad
        open={drawOpen}
        onClose={() => setDrawOpen(false)}
        onSave={(dataUrl) => {
          addAsset({
            name: "My drawing",
            source: { kind: "drawn", dataUrl },
            tag: "thing"
          });
          setDrawOpen(false);
        }}
      />
      <BehaviorPicker
        open={behaviorOpen}
        onClose={() => setBehaviorOpen(false)}
        onAdd={(b) => {
          if (selectedActorId) addBehavior(selectedActorId, b);
        }}
      />
      {project && project.actors.length === 0 && !selectedActorId && (
        <div
          style={{
            position: "fixed",
            bottom: 120,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 18,
            color: "#7a6960",
            pointerEvents: "none"
          }}
        >
          ⬇ Tap <b>Add</b> or <b>Draw</b> to start
        </div>
      )}
    </div>
  );
}
