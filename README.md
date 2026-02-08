# pg.js + TypeScript Canvas

A tiny TypeScript "artwork" that uses **pg.js** (node-postgres) to store stars in Postgres and paint a `PG.js` constellation in the terminal.

## Setup

```bash
npm install
```

## Environment

Set a Postgres connection string before running:

```bash
export DATABASE_URL="postgres://user:password@localhost:5432/yourdb"
```

## Run

```bash
npm run dev
```

Use `--reset` if you want to clear and reseed the stars:

```bash
npm run dev -- --reset
```
