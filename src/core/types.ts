export type Artwork = {
  title: string;
  slug: string;
  description: string;
  mount: (container: HTMLElement) => () => void;
};

export type Palette = {
  background: string;
  primary: string;
  secondary: string;
  accent: string;
};
