import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./index.css";

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

if (!isApplePlatform()) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap";
  document.head.appendChild(link);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
