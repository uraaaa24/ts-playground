import type { Artwork } from "./types";
import { auroraPulseArtwork } from "./aurora-pulse";
import { particleArtwork } from "./particle";

export { type Artwork } from "./types";

export const artworks: Artwork[] = [particleArtwork(), auroraPulseArtwork()];

export const getArtworkBySlug = (slug: string) =>
  artworks.find((artwork) => artwork.slug === slug);
