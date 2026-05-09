// Bundled stock stickers as inline SVG data URLs.
// Keeping these inline avoids any asset-loading complexity for v1.

const svg = (body: string, viewBox = "0 0 100 100") =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='${viewBox}'>${body}</svg>`
  )}`;

import type { Tag } from "../types";

export type StockCategory =
  | "animals"
  | "food"
  | "faces"
  | "nature"
  | "things"
  | "symbols";

export type StockSticker = {
  id: string;
  name: string;
  emoji: string;
  defaultTag: Tag;
  category: StockCategory;
  dataUrl: string;
};

function make(
  id: string,
  name: string,
  emoji: string,
  category: StockCategory,
  defaultTag: Tag
): StockSticker {
  return {
    id,
    name,
    emoji,
    category,
    defaultTag,
    dataUrl: svg(
      `<text x='50' y='72' font-size='80' text-anchor='middle' font-family='Apple Color Emoji,Noto Color Emoji,Segoe UI Emoji,sans-serif'>${emoji}</text>`
    )
  };
}

// Tuples: [id, name, emoji, defaultTag]. id must be unique across all
// categories (saved games reference these by id).
const ANIMALS: [string, string, string, Tag][] = [
  ["dog", "Dog", "🐶", "player"],
  ["cat", "Cat", "🐱", "player"],
  ["mouse", "Mouse", "🐭", "player"],
  ["hamster", "Hamster", "🐹", "player"],
  ["rabbit", "Rabbit", "🐰", "player"],
  ["fox", "Fox", "🦊", "player"],
  ["bear", "Bear", "🐻", "player"],
  ["panda", "Panda", "🐼", "player"],
  ["koala", "Koala", "🐨", "player"],
  ["tiger", "Tiger", "🐯", "player"],
  ["lion", "Lion", "🦁", "player"],
  ["cow", "Cow", "🐮", "player"],
  ["pig", "Pig", "🐷", "player"],
  ["frog", "Frog", "🐸", "player"],
  ["monkey", "Monkey", "🐵", "player"],
  ["chicken", "Chick", "🐔", "player"],
  ["penguin", "Penguin", "🐧", "player"],
  ["bird", "Bird", "🐦", "player"],
  ["chick", "Chick", "🐤", "player"],
  ["duck", "Duck", "🦆", "player"],
  ["eagle", "Eagle", "🦅", "player"],
  ["owl", "Owl", "🦉", "player"],
  ["bat", "Bat", "🦇", "bug"],
  ["wolf", "Wolf", "🐺", "bug"],
  ["horse", "Horse", "🐴", "player"],
  ["unicorn", "Unicorn", "🦄", "player"],
  ["bee", "Bee", "🐝", "bug"],
  ["bug", "Bug", "🐛", "bug"],
  ["butterfly", "Butterfly", "🦋", "bug"],
  ["snail", "Snail", "🐌", "bug"],
  ["ladybug", "Ladybug", "🐞", "bug"],
  ["ant", "Ant", "🐜", "bug"],
  ["spider", "Spider", "🕷️", "bug"],
  ["turtle", "Turtle", "🐢", "player"],
  ["snake", "Snake", "🐍", "bug"],
  ["lizard", "Lizard", "🦎", "bug"],
  ["dinosaur", "Dino", "🦖", "player"],
  ["dragon", "Dragon", "🐉", "player"],
  ["octopus", "Octopus", "🐙", "player"],
  ["crab", "Crab", "🦀", "player"],
  ["shrimp", "Shrimp", "🦐", "player"],
  ["fish", "Fish", "🐟", "player"],
  ["dolphin", "Dolphin", "🐬", "player"],
  ["whale", "Whale", "🐋", "player"],
  ["shark", "Shark", "🦈", "bug"],
  ["elephant", "Elephant", "🐘", "player"],
  ["giraffe", "Giraffe", "🦒", "player"],
  ["zebra", "Zebra", "🦓", "player"],
  ["sheep", "Sheep", "🐑", "player"],
  ["sloth", "Sloth", "🦥", "player"]
];

const FOOD: [string, string, string, Tag][] = [
  ["apple", "Apple", "🍎", "treat"],
  ["green-apple", "Green apple", "🍏", "treat"],
  ["pear", "Pear", "🍐", "treat"],
  ["orange", "Orange", "🍊", "treat"],
  ["lemon", "Lemon", "🍋", "treat"],
  ["banana", "Banana", "🍌", "treat"],
  ["watermelon", "Watermelon", "🍉", "treat"],
  ["grapes", "Grapes", "🍇", "treat"],
  ["strawberry", "Strawberry", "🍓", "treat"],
  ["blueberry", "Blueberry", "🫐", "treat"],
  ["cherries", "Cherries", "🍒", "treat"],
  ["peach", "Peach", "🍑", "treat"],
  ["mango", "Mango", "🥭", "treat"],
  ["pineapple", "Pineapple", "🍍", "treat"],
  ["kiwi", "Kiwi", "🥝", "treat"],
  ["coconut", "Coconut", "🥥", "treat"],
  ["tomato", "Tomato", "🍅", "treat"],
  ["avocado", "Avocado", "🥑", "treat"],
  ["broccoli", "Broccoli", "🥦", "treat"],
  ["carrot", "Carrot", "🥕", "treat"],
  ["corn", "Corn", "🌽", "treat"],
  ["pepper", "Pepper", "🫑", "treat"],
  ["mushroom", "Mushroom", "🍄", "treat"],
  ["bread", "Bread", "🍞", "treat"],
  ["cheese", "Cheese", "🧀", "treat"],
  ["egg", "Egg", "🥚", "treat"],
  ["pancakes", "Pancakes", "🥞", "treat"],
  ["bacon", "Bacon", "🥓", "treat"],
  ["burger", "Burger", "🍔", "treat"],
  ["fries", "Fries", "🍟", "treat"],
  ["pizza", "Pizza", "🍕", "treat"],
  ["hotdog", "Hotdog", "🌭", "treat"],
  ["taco", "Taco", "🌮", "treat"],
  ["popcorn", "Popcorn", "🍿", "treat"],
  ["donut", "Donut", "🍩", "treat"],
  ["cookie", "Cookie", "🍪", "treat"],
  ["cake", "Cake", "🎂", "treat"],
  ["cupcake", "Cupcake", "🧁", "treat"],
  ["pie", "Pie", "🥧", "treat"],
  ["chocolate", "Chocolate", "🍫", "treat"],
  ["candy", "Candy", "🍬", "treat"],
  ["lollipop", "Lollipop", "🍭", "treat"],
  ["icecream", "Ice cream", "🍦", "treat"],
  ["shavedice", "Shaved ice", "🍧", "treat"],
  ["coffee", "Coffee", "☕", "treat"],
  ["milk", "Milk", "🥛", "treat"],
  ["juice", "Juice", "🧃", "treat"]
];

const FACES: [string, string, string, Tag][] = [
  ["smile", "Smile", "😀", "player"],
  ["grin", "Grin", "😃", "player"],
  ["laugh", "Laugh", "😂", "player"],
  ["happy", "Happy", "😊", "player"],
  ["wink", "Wink", "😉", "player"],
  ["heart-eyes", "Love", "😍", "player"],
  ["kiss", "Kiss", "😘", "player"],
  ["yum", "Yum", "😋", "player"],
  ["tongue", "Tongue", "😛", "player"],
  ["crazy", "Crazy", "🤪", "player"],
  ["cool", "Cool", "😎", "player"],
  ["party", "Party", "🥳", "player"],
  ["thinking", "Thinking", "🤔", "player"],
  ["sleepy", "Sleepy", "😪", "player"],
  ["sleep", "Sleep", "😴", "player"],
  ["sad", "Sad", "😢", "player"],
  ["cry", "Cry", "😭", "player"],
  ["angry", "Angry", "😠", "bug"],
  ["scared", "Scared", "😱", "player"],
  ["sick", "Sick", "🤒", "player"],
  ["mask", "Mask", "😷", "player"],
  ["clown", "Clown", "🤡", "bug"],
  ["poop", "Poop", "💩", "bug"],
  ["ghost", "Ghost", "👻", "bug"],
  ["skull", "Skull", "💀", "bug"],
  ["alien", "Alien", "👽", "bug"],
  ["monster", "Monster", "👾", "bug"],
  ["robot", "Robot", "🤖", "player"],
  ["pumpkin", "Pumpkin", "🎃", "bug"],
  ["princess", "Princess", "👸", "player"],
  ["prince", "Prince", "🤴", "player"],
  ["wizard", "Wizard", "🧙", "player"],
  ["fairy", "Fairy", "🧚", "player"],
  ["mermaid", "Mermaid", "🧜", "player"],
  ["superhero", "Hero", "🦸", "player"],
  ["villain", "Villain", "🦹", "bug"],
  ["ninja", "Ninja", "🥷", "player"],
  ["santa", "Santa", "🎅", "player"],
  ["baby", "Baby", "👶", "player"]
];

const NATURE: [string, string, string, Tag][] = [
  ["flower", "Flower", "🌸", "treat"],
  ["rose", "Rose", "🌹", "treat"],
  ["tulip", "Tulip", "🌷", "treat"],
  ["sunflower", "Sunflower", "🌻", "treat"],
  ["daisy", "Daisy", "🌼", "treat"],
  ["bouquet", "Bouquet", "💐", "treat"],
  ["seedling", "Seedling", "🌱", "treat"],
  ["herb", "Herb", "🌿", "treat"],
  ["clover", "Clover", "🍀", "treat"],
  ["leaf", "Leaf", "🍃", "treat"],
  ["maple", "Maple", "🍁", "treat"],
  ["tree", "Tree", "🌳", "wall"],
  ["pine", "Pine", "🌲", "wall"],
  ["palm", "Palm", "🌴", "wall"],
  ["cactus", "Cactus", "🌵", "wall"],
  ["earth", "Earth", "🌍", "treat"],
  ["volcano", "Volcano", "🌋", "wall"],
  ["mountain", "Mountain", "⛰️", "wall"],
  ["desert", "Desert", "🏜️", "wall"],
  ["beach", "Beach", "🏖️", "wall"],
  ["camping", "Camping", "🏕️", "wall"],
  ["sun", "Sun", "🌞", "treat"],
  ["partly", "Partly cloudy", "⛅", "treat"],
  ["cloud", "Cloud", "☁️", "wall"],
  ["rain", "Rain", "🌧️", "wall"],
  ["thunder", "Thunder", "⛈️", "wall"],
  ["snow", "Snow", "❄️", "treat"],
  ["snowman", "Snowman", "⛄", "wall"],
  ["wind", "Wind", "💨", "wall"],
  ["water", "Water", "💧", "treat"],
  ["fire", "Fire", "🔥", "bug"],
  ["wave", "Wave", "🌊", "wall"],
  ["rainbow", "Rainbow", "🌈", "treat"],
  ["moon", "Moon", "🌙", "treat"],
  ["star-night", "Star", "🌟", "star"],
  ["sparkle", "Sparkle", "✨", "treat"],
  ["comet", "Comet", "☄️", "star"]
];

const THINGS: [string, string, string, Tag][] = [
  ["ball", "Ball", "🏀", "player"],
  ["soccer", "Soccer", "⚽", "player"],
  ["football", "Football", "🏈", "player"],
  ["baseball", "Baseball", "⚾", "player"],
  ["tennis", "Tennis", "🎾", "player"],
  ["volleyball", "Volleyball", "🏐", "player"],
  ["bowling", "Bowling", "🎳", "player"],
  ["yoyo", "Yoyo", "🪀", "player"],
  ["kite", "Kite", "🪁", "player"],
  ["dart", "Dart", "🎯", "player"],
  ["car", "Car", "🚗", "player"],
  ["taxi", "Taxi", "🚕", "player"],
  ["bus", "Bus", "🚌", "player"],
  ["racecar", "Race car", "🏎️", "player"],
  ["police", "Police", "🚓", "player"],
  ["ambulance", "Ambulance", "🚑", "player"],
  ["firetruck", "Fire truck", "🚒", "player"],
  ["truck", "Truck", "🚚", "player"],
  ["tractor", "Tractor", "🚜", "player"],
  ["scooter", "Scooter", "🛵", "player"],
  ["bike", "Bike", "🚲", "player"],
  ["rocket", "Rocket", "🚀", "player"],
  ["ufo", "UFO", "🛸", "bug"],
  ["helicopter", "Helicopter", "🚁", "player"],
  ["sailboat", "Sailboat", "⛵", "player"],
  ["speedboat", "Speedboat", "🚤", "player"],
  ["ship", "Ship", "🚢", "player"],
  ["train", "Train", "🚂", "player"],
  ["plane", "Plane", "✈️", "player"],
  ["balloon", "Balloon", "🎈", "treat"],
  ["gift", "Gift", "🎁", "treat"],
  ["crown", "Crown", "👑", "treat"],
  ["trophy", "Trophy", "🏆", "treat"],
  ["medal", "Medal", "🏅", "treat"],
  ["gem", "Gem", "💎", "treat"],
  ["coin", "Coin", "🪙", "treat"],
  ["money", "Money", "💰", "treat"],
  ["key", "Key", "🔑", "treat"],
  ["lock", "Lock", "🔒", "wall"],
  ["bomb", "Bomb", "💣", "bug"],
  ["dynamite", "Dynamite", "🧨", "bug"],
  ["sword", "Sword", "🗡️", "bug"],
  ["shield", "Shield", "🛡️", "wall"],
  ["magicwand", "Magic wand", "🪄", "player"],
  ["potion", "Potion", "🧪", "treat"],
  ["bell", "Bell", "🔔", "treat"],
  ["drum", "Drum", "🥁", "player"],
  ["guitar", "Guitar", "🎸", "player"],
  ["trumpet", "Trumpet", "🎺", "player"],
  ["telescope", "Telescope", "🔭", "player"],
  ["camera", "Camera", "📷", "player"],
  ["phone", "Phone", "📱", "player"],
  ["umbrella", "Umbrella", "☂️", "wall"],
  ["brick", "Brick", "🧱", "wall"],
  ["rock", "Rock", "🪨", "rock"],
  ["log", "Log", "🪵", "wall"]
];

const SYMBOLS: [string, string, string, Tag][] = [
  ["heart-red", "Red heart", "❤️", "treat"],
  ["heart-orange", "Orange heart", "🧡", "treat"],
  ["heart-yellow", "Yellow heart", "💛", "treat"],
  ["heart-green", "Green heart", "💚", "treat"],
  ["heart-blue", "Blue heart", "💙", "treat"],
  ["heart-purple", "Purple heart", "💜", "treat"],
  ["sparkling-heart", "Sparkle heart", "💖", "treat"],
  ["broken-heart", "Broken heart", "💔", "bug"],
  ["star-yellow", "Star", "⭐", "star"],
  ["bigstar", "Big star", "🌟", "star"],
  ["dizzy", "Dizzy", "💫", "star"],
  ["circle-red", "Red circle", "🔴", "treat"],
  ["circle-orange", "Orange circle", "🟠", "treat"],
  ["circle-yellow", "Yellow circle", "🟡", "treat"],
  ["circle-green", "Green circle", "🟢", "treat"],
  ["circle-blue", "Blue circle", "🔵", "treat"],
  ["circle-purple", "Purple circle", "🟣", "treat"],
  ["square-red", "Red square", "🟥", "wall"],
  ["square-blue", "Blue square", "🟦", "wall"],
  ["square-green", "Green square", "🟩", "wall"],
  ["square-yellow", "Yellow square", "🟨", "wall"],
  ["arrow-up", "Arrow up", "⬆️", "treat"],
  ["arrow-down", "Arrow down", "⬇️", "treat"],
  ["arrow-left", "Arrow left", "⬅️", "treat"],
  ["arrow-right", "Arrow right", "➡️", "treat"],
  ["check", "Check", "✅", "treat"],
  ["cross", "Cross", "❌", "bug"],
  ["question", "Question", "❓", "treat"],
  ["bang", "Exclamation", "❗", "treat"],
  ["zzz", "Zzz", "💤", "treat"],
  ["boom", "Boom", "💥", "bug"],
  ["splash", "Splash", "💦", "treat"],
  ["sweat", "Sweat", "💧", "treat"],
  ["zap", "Zap", "⚡", "bug"],
  ["snow-flake", "Snowflake", "❄️", "treat"],
  ["music", "Music", "🎵", "treat"]
];

const ALL: [string, string, string, StockCategory, Tag][] = [
  ...ANIMALS.map(([id, n, e, t]) => [id, n, e, "animals" as StockCategory, t] as const),
  ...FOOD.map(([id, n, e, t]) => [id, n, e, "food" as StockCategory, t] as const),
  ...FACES.map(([id, n, e, t]) => [id, n, e, "faces" as StockCategory, t] as const),
  ...NATURE.map(([id, n, e, t]) => [id, n, e, "nature" as StockCategory, t] as const),
  ...THINGS.map(([id, n, e, t]) => [id, n, e, "things" as StockCategory, t] as const),
  ...SYMBOLS.map(([id, n, e, t]) => [id, n, e, "symbols" as StockCategory, t] as const)
].map((tuple) => [...tuple] as [string, string, string, StockCategory, Tag]);

export const STOCK_STICKERS: StockSticker[] = ALL.map(([id, name, emoji, category, tag]) =>
  make(id, name, emoji, category, tag)
);

export const CATEGORIES: { id: StockCategory; label: string; emoji: string }[] = [
  { id: "animals", label: "Animals", emoji: "🐶" },
  { id: "food", label: "Food", emoji: "🍎" },
  { id: "faces", label: "Faces", emoji: "😀" },
  { id: "nature", label: "Nature", emoji: "🌸" },
  { id: "things", label: "Things", emoji: "⚽" },
  { id: "symbols", label: "Symbols", emoji: "❤️" }
];

const stockById = new Map(STOCK_STICKERS.map((s) => [s.id, s]));
export function findStock(stockId: string): StockSticker | undefined {
  return stockById.get(stockId);
}
