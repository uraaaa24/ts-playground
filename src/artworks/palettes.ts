import type { Palette } from "./types";

const palettes: Palette[] = [
  {
    background: "#0f172a",
    primary: "#38bdf8",
    secondary: "#f472b6",
    accent: "#facc15",
  },
  {
    background: "#111827",
    primary: "#34d399",
    secondary: "#60a5fa",
    accent: "#f59e0b",
  },
  {
    background: "#0b1120",
    primary: "#f43f5e",
    secondary: "#22d3ee",
    accent: "#a3e635",
  },
];

export const pickPalette = (index: number) => palettes[index % palettes.length];
