// Tiny WebAudio sound bank — no asset files needed.
// Each sound is a short synthesized blip. Good enough for a kid's sandbox.

let ctx: AudioContext | null = null;

function ac(): AudioContext {
  if (!ctx) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new Ctor();
  }
  return ctx;
}

function blip(freq: number, dur: number, type: OscillatorType = "sine", vol = 0.2) {
  try {
    const a = ac();
    if (a.state === "suspended") void a.resume();
    const osc = a.createOscillator();
    const gain = a.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = vol;
    gain.gain.exponentialRampToValueAtTime(0.001, a.currentTime + dur);
    osc.connect(gain).connect(a.destination);
    osc.start();
    osc.stop(a.currentTime + dur);
  } catch {
    // Audio is best-effort; never break the app over a sound.
  }
}

export const sounds = {
  pop: () => blip(660, 0.08, "sine", 0.15),
  yay: () => {
    blip(523, 0.12, "triangle", 0.2);
    setTimeout(() => blip(659, 0.12, "triangle", 0.2), 100);
    setTimeout(() => blip(784, 0.18, "triangle", 0.2), 220);
  },
  ding: () => blip(1000, 0.18, "triangle", 0.2),
  buzz: () => blip(120, 0.2, "sawtooth", 0.18),
  boop: () => blip(330, 0.1, "square", 0.15),
  whoosh: () => blip(220, 0.25, "sine", 0.18)
};
