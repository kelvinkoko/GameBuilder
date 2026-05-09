# 🎮 Game Builder

A tiny web app where a young child can **make their own games** — not just play them.

## Why this exists

Built for my five-year-old daughter. The plan was to find her a toy that lets kids build games, but everything felt either too grown-up (Scratch needs reading), too restricted (kid game makers that only let you change colours), or too "watch this video and tap when prompted" (most app-store creativity apps).

So I sat down with her, asked what she'd want, and we made it together. She picks a template or starts blank, drops in a few stickers — or draws her own with a finger — gives each one a "power" (move, bounce, follow my finger, jump, score on tap, win on touch…), and hits ▶. The thing she just made plays as a real game.

The whole thing is designed around what a 5-year-old can actually do, not what an adult thinks a 5-year-old should be able to do.

## What's in it

### Templates to start with

- 🧩 **Maze** — a mouse chasing some cheese through corridors. Arrow keys / on-screen pad.
- 🦘 **Jump & run** — a frog jumps across platforms toward a trophy, dodging a wandering bug. Tap-or-hold to jump variable heights.
- 🐠 **Aquarium** — a peaceful sandbox seeded with hand-drawn fish, a crab, a starfish, seaweed, and bubbles. No goal, no timer — just a living scene she can keep adding to.
- 🐹 **Whack-a-mole** — eleven hamsters bounce around the grass; tap them before the timer runs out.
- 🎨 **Blank** — start with nothing.

### What she can do in the editor

- **Drop stickers** — ~280 emoji organised like a phone keyboard (Animals / Food / Faces / Nature / Things / Symbols, plus a Recent tab seeded with kid favourites). Tap or drag onto the stage.
- **Draw her own** — a finger-painting pad with bright colours and three brush sizes; the result becomes a sticker she can place and animate, exactly like a stock one.
- **Give things "powers"** — icon-tile menu: move (left/right/up/down/follow finger/wander), bounce, spin, falls (gravity), arrow-key control, run-and-jump (platformer), tap reactions (sound / vanish / grow / shrink / score), and collision rules (touch → score / win / lose / vanish / sound / block).
- **Pick a goal** — score-to-win (3 / 5 / 10 / 20) and a timer (30 s / 1 m / 2 m / 5 m).
- **Pick a background** — sky / grass / sea / space.
- **Resize, copy, delete** any sticker with one tap.
- **Rename the game** by tapping its name.

### What she sees when she plays

Full-screen Phaser scene. On-screen d-pad and jump button if her game uses arrow controls. Score and timer in the HUD. Win / lose card at the end. Restart in one tap.

## Design principles for a 5-year-old

- **Icons + short words, never text input** (except the one optional "rename" field for parents).
- **Big tap targets** (≥ 56 px) sized for a child's finger.
- **Audio "pop" on every press** — covers her not reading every label.
- **No destructive action without a friendly confirm** ("Throw away? 🗑️ / Keep ❤️").
- **Auto-save on every edit** — she never has to remember to save.
- **Auto-named games** ("Maze 1", "My game 3") so she never has to type.
- **Touch first, mouse-friendly**.
- **Apple emoji on Apple devices, Noto Color Emoji elsewhere** — so the stickers and UI look the same across phones and laptops.

## What the templates teach without saying it

- **Maze** — "things can stop me; goals are reachable through paths."
- **Jump & run** — "gravity, jumping, dodging enemies."
- **Aquarium** — "I can make a world for things to live in." Also the sneakiest one: the starter creatures are obviously hand-drawn, so the kid sees that her drawings belong here too.
- **Whack-a-mole** — "score within a time limit."
- **Blank** — "now do whatever you want."

## Run it

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Build

```bash
npm run build
```

Output in `dist/`. Static files, no server needed.

## Deploy

Two routes already wired:
- **Cloudflare Pages** — connect the GitHub repo, framework preset *Vite*, build command `npm run build`, output `dist`. That's it.
- **GitHub Pages** — `.github/workflows/deploy.yml` auto-deploys on push to `main`. Enable Pages in repo settings → *Source: GitHub Actions*. The workflow sets `VITE_BASE=/GameBuilder/` so assets resolve under `/<repo>/`.

## Tech, briefly

React + TypeScript + Vite + Phaser 3 (arcade physics). Zustand for editor state. IndexedDB (via `idb-keyval`) for local saves. Stock stickers are inline-SVG `<text>` data URLs; the seeded aquarium creatures are hand-authored multi-colour SVGs. Sound effects are tiny WebAudio blips — no audio files to download.

The data model is one self-contained JSON `GameProject` per game (assets embedded as data URLs, no external files), which is also why future "share a game with grandma" can be a URL or a single file with no backend needed.

## Status

Personal project, kid-driven roadmap. Built in evenings by following her around with "what's missing?". Adding things she asks for; pruning things she doesn't touch.
