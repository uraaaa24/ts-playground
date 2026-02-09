import type { Artwork } from "./core/types";
import { auroraPulseArtwork } from "./artworks/aurora-pulse";
import { particleArtwork } from "./artworks/particle";
import { solarSystemArtwork } from "./artworks/solar-system";

export { type Artwork } from "./core/types";

export const artworks: Artwork[] = [
  particleArtwork(),
  auroraPulseArtwork(),
  solarSystemArtwork(),
];

export const getArtworkBySlug = (slug: string) =>
  artworks.find((artwork) => artwork.slug === slug);
