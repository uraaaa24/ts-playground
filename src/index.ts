import pg from "pg";

const { Pool } = pg;

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

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const ensureSchema = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS stars (
      id SERIAL PRIMARY KEY,
      x INTEGER NOT NULL,
      y INTEGER NOT NULL,
      symbol TEXT NOT NULL
    );
  `);
};

const resetStars = async () => {
  await pool.query("TRUNCATE TABLE stars;");
};

const seedIfEmpty = async () => {
  const { rows } = await pool.query<{ count: string }>(
    "SELECT COUNT(*) as count FROM stars;"
  );
  if (Number(rows[0]?.count ?? 0) > 0) {
    return;
  }

  const insertValues = seedStars
    .map((_, index) => `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`)
    .join(", ");
  const insertParams = seedStars.flatMap((star) => [star.x, star.y, star.symbol]);

  await pool.query(`INSERT INTO stars (x, y, symbol) VALUES ${insertValues};`, insertParams);
};

const fetchStars = async (): Promise<Star[]> => {
  const { rows } = await pool.query<Star>(
    "SELECT x, y, symbol FROM stars ORDER BY y, x;"
  );
  return rows;
};

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

const run = async () => {
  const shouldReset = process.argv.includes("--reset");

  await ensureSchema();
  if (shouldReset) {
    await resetStars();
  }
  await seedIfEmpty();
  const stars = await fetchStars();
  render(stars);

  await pool.end();
};

run().catch((error) => {
  console.error("Failed to paint the pg.js constellations:", error);
  process.exitCode = 1;
});
