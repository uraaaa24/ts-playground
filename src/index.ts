type Star = {
  x: number;
  y: number;
  symbol: string;
};

const CANVAS_WIDTH = 36;
const CANVAS_HEIGHT = 12;
const DEFAULT_SYMBOL = "·";

const seedStars: Star[] = [
  // P
  { x: 1, y: 1, symbol: "✦" },
  { x: 1, y: 2, symbol: "✦" },
  { x: 1, y: 3, symbol: "✦" },
  { x: 1, y: 4, symbol: "✦" },
  { x: 2, y: 1, symbol: "✦" },
  { x: 3, y: 1, symbol: "✦" },
  { x: 4, y: 2, symbol: "✦" },
  { x: 3, y: 3, symbol: "✦" },
  { x: 2, y: 3, symbol: "✦" },
  // G
  { x: 8, y: 1, symbol: "✦" },
  { x: 9, y: 1, symbol: "✦" },
  { x: 10, y: 1, symbol: "✦" },
  { x: 8, y: 2, symbol: "✦" },
  { x: 8, y: 3, symbol: "✦" },
  { x: 8, y: 4, symbol: "✦" },
  { x: 9, y: 4, symbol: "✦" },
  { x: 10, y: 4, symbol: "✦" },
  { x: 10, y: 3, symbol: "✦" },
  // .js
  { x: 15, y: 4, symbol: "✦" },
  { x: 18, y: 2, symbol: "✦" },
  { x: 18, y: 3, symbol: "✦" },
  { x: 18, y: 4, symbol: "✦" },
  { x: 19, y: 4, symbol: "✦" },
  { x: 20, y: 4, symbol: "✦" },
  { x: 20, y: 3, symbol: "✦" },
  { x: 20, y: 2, symbol: "✦" },
  { x: 22, y: 1, symbol: "✦" },
  { x: 23, y: 1, symbol: "✦" },
  { x: 24, y: 1, symbol: "✦" },
  { x: 24, y: 2, symbol: "✦" },
  { x: 24, y: 3, symbol: "✦" },
  { x: 23, y: 4, symbol: "✦" },
  { x: 22, y: 4, symbol: "✦" },
];

const render = (stars: Star[]) => {
  const canvas = Array.from({ length: CANVAS_HEIGHT }, () =>
    Array.from({ length: CANVAS_WIDTH }, () => DEFAULT_SYMBOL)
  );

  stars.forEach((star) => {
    if (star.y >= 0 && star.y < CANVAS_HEIGHT && star.x >= 0 && star.x < CANVAS_WIDTH) {
      canvas[star.y][star.x] = star.symbol;
    }
  });

  const lines = canvas.map((row) => row.join(" "));
  console.log(lines.join("\n"));
};

const run = () => {
  render(seedStars);
};

run();
