# Game Builder

A web app where a young child can build their own little games — drag stickers
or draw their own, give them powers (move, bounce, follow finger, score, win),
then hit ▶ Play.

Built with React + TypeScript + Vite + Phaser. Saves locally in IndexedDB.

## Run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`. The dev server uses base path `/GameBuilder/` by
default to match GitHub Pages — open `http://localhost:5173/GameBuilder/`. To
serve from `/`, run with `VITE_BASE=/ npm run dev`.

## Build

```bash
npm run build
```

Output in `dist/`.

## Deploy

Pushes to `main` are auto-deployed to GitHub Pages by
`.github/workflows/deploy.yml`. Enable Pages in repo settings: **Source =
GitHub Actions**.
