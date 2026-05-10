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

  // Fit the 800x600 stage into the available space, while never
  // letting the page overflow.
  // - In a portrait-shaped viewport, prefer a 4:3 box at full viewport
  //   width (height = width × 3/4). Toolbar / inspector / tray sit
  //   above and below at their natural heights.
  // - When chrome is tall enough that the desired stage would push
  //   the layout past the viewport, shrink the stage so it fits.
  //   Stage stays 4:3 (we shrink width too).
  // - Landscape viewports keep the original flex behavior.
  useEffect(() => {
    function fit() {
      const stage = stageRef.current;
      if (!stage) return;
      const wrap = stage.parentElement as HTMLElement | null;
      if (!wrap) return;
      const editor = wrap.parentElement as HTMLElement | null;
      const winW = window.innerWidth;
      const winH = window.innerHeight;
      const stageAspect = STAGE_W / STAGE_H;

      if (winW / winH < stageAspect && editor) {
        // Sum the heights of every editor child that ISN'T the stage
        // wrap — that's how much chrome wants. The remainder is what
        // we have to spend on the stage.
        let chromeH = 0;
        for (const el of Array.from(editor.children)) {
          if (el === wrap) continue;
          chromeH += (el as HTMLElement).offsetHeight;
        }
        const desiredH = (winW * STAGE_H) / STAGE_W; // full-width 4:3
        const availH = Math.max(0, winH - chromeH);
        const stageH = Math.min(desiredH, availH);
        const stageW = (stageH * STAGE_W) / STAGE_H;

        wrap.style.flex = "0 0 auto";
        wrap.style.width = `${stageW}px`;
        wrap.style.height = `${stageH}px`;
        wrap.style.maxWidth = "100vw";
        wrap.style.padding = "0";
      } else {
        wrap.style.flex = "";
        wrap.style.width = "";
        wrap.style.height = "";
        wrap.style.maxWidth = "";
        wrap.style.padding = "";
      }
      const rect = wrap.getBoundingClientRect();
      const padding = 4;
      const sx = (rect.width - padding) / STAGE_W;
      const sy = (rect.height - padding) / STAGE_H;
      setScale(Math.min(sx, sy, 1.5));
    }
    fit();
    const ro = new ResizeObserver(fit);
    const editor = stageRef.current?.parentElement?.parentElement;
    if (stageRef.current?.parentElement) ro.observe(stageRef.current.parentElement);
    if (editor) ro.observe(editor);
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
        width: STAGE_W,
        height: STAGE_H,
        transform: `scale(${scale})`,
        transformOrigin: "center",
        ...bgStyle(project.background)
      }}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) selectActor(null);
      }}
    >
      {project.actors.map((actor) => {
        const asset = project.assets.find((a) => a.id === actor.assetId);
        return (
          <div
            key={actor.id}
            className={`actor ${selectedActorId === actor.id ? "selected" : ""}`}
            style={{
              left: actor.x - 40,
              top: actor.y - 40,
              transform: `scale(${actor.scale}) rotate(${actor.rotation}deg)`
            }}
            onPointerDown={(e) => drag(actor.id, e)}
          >
            <img src={assetSrc(asset)} alt={asset?.name ?? ""} draggable={false} />
          </div>
        );
      })}
    </div>
  );
}

export const STAGE_SIZE = { w: STAGE_W, h: STAGE_H };
