// Full-screen "rotate sideways" overlay shown only on small portrait
// screens (phones). Pure CSS visibility — no JS listeners needed; the
// browser swaps orientation media queries automatically.

export function RotatePrompt() {
  return (
    <div className="rotate-prompt" aria-hidden>
      <div className="rotate-prompt-card">
        <div className="rotate-emoji">📱</div>
        <h2>Turn me sideways!</h2>
        <p>Hold your phone like a little TV 📺</p>
      </div>
    </div>
  );
}
