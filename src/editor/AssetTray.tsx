import { useState } from "react";
import { Modal } from "../ui/Modal";
import { BigButton } from "../ui/BigButton";
import { useProjectStore } from "../state/projectStore";
import { findStock, STOCK_STICKERS } from "../assets/stock";
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

export function StockPicker({ open, onClose }: StockPickerProps) {
  const addAsset = useProjectStore((s) => s.addAsset);
  const project = useProjectStore((s) => s.project);
  const [filter] = useState("");

  return (
    <Modal open={open} onClose={onClose}>
      <h2>Pick a sticker</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))",
          gap: 8,
          maxWidth: 480,
          maxHeight: "60vh",
          overflowY: "auto"
        }}
      >
        {STOCK_STICKERS.filter((s) =>
          s.name.toLowerCase().includes(filter.toLowerCase())
        ).map((s) => (
          <button
            key={s.id}
            className="sticker"
            onClick={() => {
              if (!project) return;
              // Avoid duplicate stock-asset entries in the project.
              const existing = project.assets.find(
                (a) => a.source.kind === "stock" && a.source.stockId === s.id
              );
              if (!existing) {
                addAsset({
                  name: s.name,
                  source: { kind: "stock", stockId: s.id },
                  tag: s.defaultTag
                });
              }
              onClose();
            }}
            aria-label={s.name}
          >
            <img src={s.dataUrl} alt={s.name} />
          </button>
        ))}
      </div>
      <div className="modal-actions">
        <BigButton icon="✓" label="Done" variant="good" onClick={onClose} />
      </div>
    </Modal>
  );
}
