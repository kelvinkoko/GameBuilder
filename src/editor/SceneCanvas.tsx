import { useEffect, useRef, useState } from "react";
import { useProjectStore } from "../state/projectStore";
import { findStock } from "../assets/stock";
import type { Asset, Background } from "../types";

const STAGE_W = 800;
const STAGE_H = 600;

function bgClass(bg: Background): string {
  if (bg.kind === "preset") return `bg-${bg.value}`;
  return "";
}

function bgStyle(bg: Background) {
  if (bg.kind === "color") return { background: bg.value };
  return undefined;
}

function assetSrc(asset: Asset | undefined): string {
  if (!asset) return "";
  if (asset.source.kind === "stock") {
    return findStock(asset.source.stockId)?.dataUrl ?? "";
  }
  return asset.source.dataUrl;
}

export function SceneCanvas() {
  const project = useProjectStore((s) => s.project);
  const selectedActorId = useProjectStore((s) => s.selectedActorId);
  const selectActor = useProjectStore((s) => s.selectActor);
  const updateActor = useProjectStore((s) => s.updateActor);
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Fit the 800x600 stage into the available space.
  useEffect(() => {
    function fit() {
      const stage = stageRef.current;
      if (!stage) return;
      const wrap = stage.parentElement as HTMLElement | null;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const padding = 4;
      const sx = (rect.width - padding) / STAGE_W;
      const sy = (rect.height - padding) / STAGE_H;
      // Max 4:3 fit within the wrap. Scale freely beyond 1 so the
      // stage takes the most space the wrap can offer.
      setScale(Math.min(sx, sy));
    }
    fit();
    const ro = new ResizeObserver(fit);
    if (stageRef.current?.parentElement) ro.observe(stageRef.current.parentElement);
    window.addEventListener("resize", fit);
    window.addEventListener("orientationchange", fit);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fit);
      window.removeEventListener("orientationchange", fit);
    };
  }, []);

  if (!project) return null;

  const drag = (actorId: string, e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    selectActor(actorId);
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    const startX = e.clientX;
    const startY = e.clientY;
    const actor = project.actors.find((a) => a.id === actorId);
    if (!actor) return;
    const startActorX = actor.x;
    const startActorY = actor.y;

    const move = (ev: PointerEvent) => {
      const dx = (ev.clientX - startX) / scale;
      const dy = (ev.clientY - startY) / scale;
      updateActor(actorId, {
        x: Math.max(0, Math.min(STAGE_W, startActorX + dx)),
        y: Math.max(0, Math.min(STAGE_H, startActorY + dy))
      });
    };
    const up = () => {
      target.removeEventListener("pointermove", move);
      target.removeEventListener("pointerup", up);
      target.removeEventListener("pointercancel", up);
    };
    target.addEventListener("pointermove", move);
    target.addEventListener("pointerup", up);
    target.addEventListener("pointercancel", up);
  };

  return (
    <div
      ref={stageRef}
      className={`stage ${bgClass(project.background)}`}
      style={{
        width: STAGE_W * scale,
        height: STAGE_H * scale,
        ...bgStyle(project.background)
      }}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) selectActor(null);
      }}
    >
      {project.actors.map((actor) => {
        const asset = project.assets.find((a) => a.id === actor.assetId);
        const tile = 80 * scale;
        return (
          <div
            key={actor.id}
            className={`actor ${selectedActorId === actor.id ? "selected" : ""}`}
            style={{
              left: (actor.x - 40) * scale,
              top: (actor.y - 40) * scale,
              width: tile,
              height: tile,
              transform: `scale(${actor.scale}) rotate(${actor.rotation}deg)`
            }}
            onPointerDown={(e) => drag(actor.id, e)}
          >
            <img
              src={assetSrc(asset)}
              alt={asset?.name ?? ""}
              draggable={false}
              style={{ width: tile, height: tile }}
            />
          </div>
        );
      })}
    </div>
  );
}

export const STAGE_SIZE = { w: STAGE_W, h: STAGE_H };
