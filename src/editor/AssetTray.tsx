import { useEffect, useMemo, useState } from "react";
import { Modal } from "../ui/Modal";
import { BigButton } from "../ui/BigButton";
import { useProjectStore } from "../state/projectStore";
import { CATEGORIES, findStock, STOCK_STICKERS, type StockCategory } from "../assets/stock";
import { getRecentStickers, pushRecentSticker } from "../state/library";
import type { Asset } from "../types";

type Props = {
  onPickStock: () => void;
  onDraw: () => void;
};

function srcOf(asset: Asset): string {
  if (asset.source.kind === "stock") return findStock(asset.source.stockId)?.dataUrl ?? "";
  return asset.source.dataUrl;
}

export function AssetTray({ onPickStock, onDraw }: Props) {
  const project = useProjectStore((s) => s.project);
  const addActor = useProjectStore((s) => s.addActor);

  if (!project) return null;
  return (
    <div className="tray">
      <BigButton icon="✏️" label="Draw" variant="good" onClick={onDraw} />
      <BigButton icon="🧸" label="Add" variant="info" onClick={onPickStock} />
      {project.assets.map((asset) => (
        <button
          key={asset.id}
          className="sticker"
          onClick={() => addActor(asset.id, 400, 300, asset.tag ?? "thing")}
          aria-label={`Place ${asset.name}`}
          title={`Place ${asset.name}`}
        >
          <img src={srcOf(asset)} alt={asset.name} />
        </button>
      ))}
    </div>
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
