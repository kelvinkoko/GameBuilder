import { useEffect, useMemo, useRef, useState } from "react";
import { Modal } from "../ui/Modal";
import { BigButton } from "../ui/BigButton";
import { useProjectStore } from "../state/projectStore";
import { CATEGORIES, findStock, STOCK_STICKERS, type StockCategory } from "../assets/stock";
import { getRecentStickers, pushRecentSticker } from "../state/library";
import { STAGE_SIZE } from "./SceneCanvas";
import type { Asset } from "../types";

type Props = {
  onPickStock: () => void;
  onDraw: () => void;
};

function srcOf(asset: Asset): string {
  if (asset.source.kind === "stock") return findStock(asset.source.stockId)?.dataUrl ?? "";
  return asset.source.dataUrl;
}

const DRAG_THRESHOLD_PX = 8;

export function AssetTray({ onPickStock, onDraw }: Props) {
  const project = useProjectStore((s) => s.project);
  const addActor = useProjectStore((s) => s.addActor);
  const [ghost, setGhost] = useState<{ asset: Asset; x: number; y: number } | null>(null);
  const dragState = useRef<{
    asset: Asset;
    startX: number;
    startY: number;
    started: boolean;
  } | null>(null);

  if (!project) return null;

  function onPointerDown(e: React.PointerEvent<HTMLButtonElement>, asset: Asset) {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragState.current = {
      asset,
      startX: e.clientX,
      startY: e.clientY,
      started: false
    };
  }

  function onPointerMove(e: React.PointerEvent<HTMLButtonElement>) {
    const d = dragState.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!d.started && Math.hypot(dx, dy) > DRAG_THRESHOLD_PX) {
      d.started = true;
    }
    if (d.started) {
      setGhost({ asset: d.asset, x: e.clientX, y: e.clientY });
    }
  }

  function onPointerUp(e: React.PointerEvent<HTMLButtonElement>) {
    const d = dragState.current;
    dragState.current = null;
    setGhost(null);
    if (!d) return;
    if (!d.started) {
      // Treat as a tap → drop at stage centre, like before.
      addActor(d.asset.id, STAGE_SIZE.w / 2, STAGE_SIZE.h / 2, d.asset.tag ?? "thing");
      return;
    }
    // Drag end: drop on the stage if cursor is over it.
    const stage = document.querySelector(".stage") as HTMLElement | null;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    if (
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    ) {
      const x = ((e.clientX - rect.left) / rect.width) * STAGE_SIZE.w;
      const y = ((e.clientY - rect.top) / rect.height) * STAGE_SIZE.h;
      addActor(d.asset.id, x, y, d.asset.tag ?? "thing");
    }
    // Dropped outside the stage: do nothing.
  }

  function onPointerCancel() {
    dragState.current = null;
    setGhost(null);
  }

  return (
    <>
      <div className="tray">
        <BigButton icon="✏️" label="Draw" variant="good" onClick={onDraw} />
        <BigButton icon="🧸" label="Add" variant="info" onClick={onPickStock} />
        {project.assets.map((asset) => (
          <button
            key={asset.id}
            className="sticker"
            onPointerDown={(e) => onPointerDown(e, asset)}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
            aria-label={`Place ${asset.name}`}
            title={`Tap or drag onto the stage`}
          >
            <img src={srcOf(asset)} alt={asset.name} draggable={false} />
          </button>
        ))}
      </div>
      {ghost && (
        <img
          src={srcOf(ghost.asset)}
          alt=""
          style={{
            position: "fixed",
            left: ghost.x - 40,
            top: ghost.y - 40,
            width: 80,
            height: 80,
            pointerEvents: "none",
            opacity: 0.85,
            zIndex: 1000,
            filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.25))"
          }}
        />
      )}
    </>
  );
}

type StockPickerProps = {
  open: boolean;
  onClose: () => void;
};

type Tab = "recent" | StockCategory;

export function StockPicker({ open, onClose }: StockPickerProps) {
  const addAsset = useProjectStore((s) => s.addAsset);
  const project = useProjectStore((s) => s.project);
  const [recent, setRecent] = useState<string[]>([]);
  const [tab, setTab] = useState<Tab>("animals");

  useEffect(() => {
    if (!open) return;
    void getRecentStickers().then((ids) => {
      setRecent(ids);
      setTab((cur) => (ids.length > 0 && cur === "animals" ? "recent" : cur));
    });
  }, [open]);

  const visible = useMemo(() => {
    if (tab === "recent") {
      return recent
        .map((id) => findStock(id))
        .filter((s): s is NonNullable<typeof s> => !!s);
    }
    return STOCK_STICKERS.filter((s) => s.category === tab);
  }, [tab, recent]);

  function pick(stockId: string) {
    if (!project) return;
    const stock = findStock(stockId);
    if (!stock) return;
    const existing = project.assets.find(
      (a) => a.source.kind === "stock" && a.source.stockId === stockId
    );
    if (!existing) {
      addAsset({
        name: stock.name,
        source: { kind: "stock", stockId },
        tag: stock.defaultTag
      });
    }
    void pushRecentSticker(stockId).then(() =>
      getRecentStickers().then(setRecent)
    );
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="picker-tabs">
        <button
          className={`picker-tab ${tab === "recent" ? "active" : ""}`}
          onClick={() => setTab("recent")}
          aria-label="Recent"
          title="Recent"
        >
          🕘
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            className={`picker-tab ${tab === c.id ? "active" : ""}`}
            onClick={() => setTab(c.id)}
            aria-label={c.label}
            title={c.label}
          >
            {c.emoji}
          </button>
        ))}
      </div>
      <div className="picker-grid">
        {visible.length === 0 && tab === "recent" ? (
          <div className="picker-empty">
            Nothing here yet — pick a sticker and it will show up.
          </div>
        ) : (
          visible.map((s) => (
            <button
              key={s.id}
              className="sticker"
              onClick={() => pick(s.id)}
              aria-label={s.name}
              title={s.name}
            >
              <img src={s.dataUrl} alt={s.name} />
            </button>
          ))
        )}
      </div>
      <div className="modal-actions">
        <BigButton icon="✓" label="Done" variant="good" onClick={onClose} />
      </div>
    </Modal>
  );
}
