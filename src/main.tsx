import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./index.css";
import { rasterizeStockStickers } from "./assets/stock";

// On non-Apple devices, load Google's Noto Color Emoji webfont as a
// fallback so emoji glyphs render consistently. On Apple devices we
// keep using the native Apple Color Emoji which is already what the
// user prefers.
function isApplePlatform(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  const platform =
    (navigator as Navigator & { userAgentData?: { platform?: string } })
      .userAgentData?.platform ?? navigator.platform ?? "";
  return /Mac|iPhone|iPad|iPod/i.test(platform) || /Macintosh|iPhone|iPad|iPod/i.test(ua);
}

function loadEmojiFont(): Promise<void> {
  if (isApplePlatform()) return Promise.resolve();
  return new Promise<void>((resolve) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap";
    link.onload = () => resolve();
    link.onerror = () => resolve(); // fail open — fall back to system fonts
    document.head.appendChild(link);
    // Defensive timeout: never block boot more than 1.5 s on the font.
    setTimeout(() => resolve(), 1500);
  });
}

async function bootstrap() {
  await loadEmojiFont();
  if (typeof document !== "undefined" && document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // ignore — proceed even if fonts API is unavailable
    }
  }
  rasterizeStockStickers();
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

void bootstrap();
