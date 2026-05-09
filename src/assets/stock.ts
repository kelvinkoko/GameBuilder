// Bundled stock stickers as inline SVG data URLs.
// Keeping these inline avoids any asset-loading complexity for v1.

const svg = (body: string, viewBox = "0 0 100 100") =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='${viewBox}'>${body}</svg>`
  )}`;

export type StockSticker = {
  id: string;
  name: string;
  emoji: string;
  defaultTag: string;
  dataUrl: string;
};

const make = (id: string, name: string, emoji: string, tag: string): StockSticker => ({
  id,
  name,
  emoji,
  defaultTag: tag,
  // Render the emoji at large size on a transparent background.
  dataUrl: svg(
    `<text x='50' y='72' font-size='80' text-anchor='middle' font-family='Apple Color Emoji,Segoe UI Emoji,Noto Color Emoji,sans-serif'>${emoji}</text>`
  )
});

export const STOCK_STICKERS: StockSticker[] = [
  make("star", "Star", "⭐", "star"),
  make("heart", "Heart", "❤️", "treat"),
  make("ball", "Ball", "🏀", "player"),
  make("apple", "Apple", "🍎", "treat"),
  make("banana", "Banana", "🍌", "treat"),
  make("cake", "Cake", "🍰", "treat"),
  make("cat", "Cat", "🐱", "player"),
  make("dog", "Dog", "🐶", "player"),
  make("frog", "Frog", "🐸", "player"),
  make("bee", "Bee", "🐝", "bug"),
  make("bug", "Bug", "🐛", "bug"),
  make("fish", "Fish", "🐟", "player"),
  make("rocket", "Rocket", "🚀", "player"),
  make("car", "Car", "🚗", "player"),
  make("balloon", "Balloon", "🎈", "treat"),
  make("flower", "Flower", "🌸", "treat"),
  make("tree", "Tree", "🌳", "wall"),
  make("rock", "Rock", "🪨", "rock"),
  make("brick", "Brick", "🧱", "wall"),
  make("cloud", "Cloud", "☁️", "wall"),
  make("sun", "Sun", "🌞", "treat"),
  make("moon", "Moon", "🌙", "treat"),
  make("snowflake", "Snow", "❄️", "treat"),
  make("ghost", "Ghost", "👻", "bug"),
  make("monster", "Monster", "👾", "bug"),
  make("crown", "Crown", "👑", "treat"),
  make("mushroom", "Mushroom", "🍄", "treat"),
  make("rainbow", "Rainbow", "🌈", "treat")
];

export function findStock(stockId: string): StockSticker | undefined {
  return STOCK_STICKERS.find((s) => s.id === stockId);
}
