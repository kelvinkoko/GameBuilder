import { useEffect, useRef, useState } from "react";
import { Modal } from "../ui/Modal";
import { BigButton } from "../ui/BigButton";

const W = 320;
const H = 320;
const COLORS = [
  "#000000",
  "#ef476f",
  "#ffd166",
  "#06d6a0",
  "#118ab2",
  "#7b2cbf",
  "#fb8500",
  "#ffffff"
];
const SIZES = [4, 10, 18];

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (dataUrl: string) => void;
};

export function DrawingPad({ open, onClose, onSave }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState(COLORS[0]);
  const [size, setSize] = useState(10);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  // Reset canvas every time the modal opens.
  useEffect(() => {
    if (!open) return;
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, W, H);
  }, [open]);

  function pos(e: React.PointerEvent<HTMLCanvasElement>) {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * W,
      y: ((e.clientY - rect.top) / rect.height) * H
    };
  }

  function start(e: React.PointerEvent<HTMLCanvasElement>) {
    e.preventDefault();
    drawing.current = true;
    last.current = pos(e);
    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(last.current.x, last.current.y, size / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  function move(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const p = pos(e);
    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(last.current!.x, last.current!.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
  }

  function end() {
    drawing.current = false;
    last.current = null;
  }

  function clear() {
    canvasRef.current!.getContext("2d")!.clearRect(0, 0, W, H);
  }

  function save() {
    const c = canvasRef.current!;
    // Trim transparent space so the sprite scales nicely.
    const ctx = c.getContext("2d")!;
    const data = ctx.getImageData(0, 0, W, H);
    let minX = W, minY = H, maxX = 0, maxY = 0, has = false;
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        if (data.data[(y * W + x) * 4 + 3] > 8) {
          has = true;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    if (!has) {
      onClose();
      return;
    }
    const pad = 8;
    minX = Math.max(0, minX - pad);
    minY = Math.max(0, minY - pad);
    maxX = Math.min(W - 1, maxX + pad);
    maxY = Math.min(H - 1, maxY + pad);
    const sw = maxX - minX + 1;
    const sh = maxY - minY + 1;
    const out = document.createElement("canvas");
    out.width = sw;
    out.height = sh;
    out.getContext("2d")!.drawImage(c, minX, minY, sw, sh, 0, 0, sw, sh);
    onSave(out.toDataURL("image/png"));
  }

  return (
    <Modal open={open} onClose={onClose}>
      <h2>Draw something</h2>
      <canvas
        ref={canvasRef}
        className="draw-pad"
        width={W}
        height={H}
        style={{ width: Math.min(W, window.innerWidth - 80), height: "auto" }}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerLeave={end}
      />
      <div className="draw-tools">
        {COLORS.map((c) => (
          <button
            key={c}
            className={`color-swatch ${color === c ? "active" : ""}`}
            style={{ background: c }}
            aria-label={`Color ${c}`}
            onClick={() => setColor(c)}
          />
        ))}
      </div>
      <div className="draw-tools">
        {SIZES.map((s) => (
          <BigButton
            key={s}
            icon={s === 4 ? "•" : s === 10 ? "●" : "⬤"}
            label={s === 4 ? "Thin" : s === 10 ? "Med" : "Thick"}
            variant={size === s ? "good" : "ghost"}
            onClick={() => setSize(s)}
          />
        ))}
        <BigButton icon="🧽" label="Clear" variant="ghost" onClick={clear} />
      </div>
      <div className="modal-actions">
        <BigButton icon="✕" label="Cancel" variant="ghost" onClick={onClose} />
        <BigButton icon="✓" label="Done" variant="good" onClick={save} />
      </div>
    </Modal>
  );
}
