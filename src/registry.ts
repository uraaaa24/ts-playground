import type { Artwork } from "./core/types";
import { auroraPulseArtwork } from "./artworks/aurora-pulse";
import { particleArtwork } from "./artworks/particle";

export { type Artwork } from "./core/types";

export const artworks: Artwork[] = [particleArtwork(), auroraPulseArtwork()];

export const getArtworkBySlug = (slug: string) =>
  artworks.find((artwork) => artwork.slug === slug);
