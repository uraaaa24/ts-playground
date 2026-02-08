type Palette = {
  background: string;
  primary: string;
  secondary: string;
  accent: string;
};

export type Artwork = {
  title: string;
  slug: string;
  description: string;
  mount: (container: HTMLElement) => () => void;
};

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
];

const pickPalette = (index: number) => palettes[index % palettes.length];

const createCanvas = (container: HTMLElement) => {
  const canvas = document.createElement("canvas");
  canvas.className = "artwork";
  container.appendChild(canvas);
  return canvas;
};

const resizeCanvas = (canvas: HTMLCanvasElement) => {
  const { innerWidth, innerHeight } = window;
  canvas.width = innerWidth * window.devicePixelRatio;
  canvas.height = innerHeight * window.devicePixelRatio;
  canvas.style.width = `${innerWidth}px`;
  canvas.style.height = `${innerHeight}px`;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
};

const particleArtwork = (): Artwork => {
  const palette = pickPalette(0);

  return {
    title: "Particle",
    slug: "particle",
    description: "粒子がゆらぐ夜空の作品。",
    mount: (container) => {
      const canvas = createCanvas(container);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Failed to get canvas context.");
      }

      let animationId = 0;
      const particleCount = 160;
      const particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: 1.2 + Math.random() * 2.8,
        vx: -0.6 + Math.random() * 1.2,
        vy: -0.6 + Math.random() * 1.2,
        color: [palette.primary, palette.secondary, palette.accent][
          Math.floor(Math.random() * 3)
        ],
      }));

      const render = () => {
        ctx.fillStyle = palette.background;
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

        particles.forEach((particle) => {
          particle.x += particle.vx;
          particle.y += particle.vy;

          if (particle.x < 0 || particle.x > window.innerWidth) {
            particle.vx *= -1;
          }
          if (particle.y < 0 || particle.y > window.innerHeight) {
            particle.vy *= -1;
          }

          ctx.beginPath();
          ctx.fillStyle = particle.color;
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          ctx.fill();
        });

        animationId = window.requestAnimationFrame(render);
      };

      const handleResize = () => {
        resizeCanvas(canvas);
      };

      resizeCanvas(canvas);
      window.addEventListener("resize", handleResize);
      render();

      return () => {
        window.cancelAnimationFrame(animationId);
        window.removeEventListener("resize", handleResize);
        canvas.remove();
      };
    },
  };
};

type Point = {
  x: number;
  y: number;
};

type Circle = {
  x: number;
  y: number;
  radius: number;
};

const isInsideQuad = (point: Point, quad: Point[]) => {
  let sign = 0;
  for (let i = 0; i < quad.length; i += 1) {
    const current = quad[i];
    const next = quad[(i + 1) % quad.length];
    const cross = (next.x - current.x) * (point.y - current.y) -
      (next.y - current.y) * (point.x - current.x);
    if (cross !== 0) {
      const currentSign = Math.sign(cross);
      if (sign === 0) {
        sign = currentSign;
      } else if (sign !== currentSign) {
        return false;
      }
    }
  }
  return true;
};

const quadFillArtwork = (): Artwork => {
  const palette = pickPalette(1);

  return {
    title: "Quad Fill",
    slug: "quad-fill",
    description: "ランダムな四角形を円で充填する作品。",
    mount: (container) => {
      const canvas = createCanvas(container);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Failed to get canvas context.");
      }

      const draw = () => {
        ctx.fillStyle = palette.background;
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

        const quads = Array.from({ length: 5 }, () => {
          const centerX = Math.random() * window.innerWidth;
          const centerY = Math.random() * window.innerHeight;
          const width = 120 + Math.random() * 220;
          const height = 100 + Math.random() * 180;
          return [
            { x: centerX - width * 0.5, y: centerY - height * 0.5 },
            { x: centerX + width * 0.5, y: centerY - height * 0.4 },
            { x: centerX + width * 0.4, y: centerY + height * 0.5 },
            { x: centerX - width * 0.6, y: centerY + height * 0.4 },
          ];
        });

        quads.forEach((quad) => {
          const circles: Circle[] = [];
          const paletteOrder = [palette.primary, palette.secondary, palette.accent];
          let attempts = 0;

          while (circles.length < 120 && attempts < 2000) {
            attempts += 1;
            const minX = Math.min(...quad.map((point) => point.x));
            const maxX = Math.max(...quad.map((point) => point.x));
            const minY = Math.min(...quad.map((point) => point.y));
            const maxY = Math.max(...quad.map((point) => point.y));
            const candidate: Circle = {
              x: minX + Math.random() * (maxX - minX),
              y: minY + Math.random() * (maxY - minY),
              radius: 6 + Math.random() * 18,
            };

            if (!isInsideQuad(candidate, quad)) {
              continue;
            }

            const overlaps = circles.some((circle) => {
              const distance = Math.hypot(circle.x - candidate.x, circle.y - candidate.y);
              return distance < circle.radius + candidate.radius * 0.9;
            });

            if (!overlaps) {
              circles.push(candidate);
            }
          }

          circles.forEach((circle, index) => {
            ctx.beginPath();
            ctx.fillStyle = paletteOrder[index % paletteOrder.length];
            ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
            ctx.fill();
          });
        });
      };

      const handleResize = () => {
        resizeCanvas(canvas);
        draw();
      };

      resizeCanvas(canvas);
      draw();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        canvas.remove();
      };
    },
  };
};

export const artworks: Artwork[] = [particleArtwork(), quadFillArtwork()];

export const getArtworkBySlug = (slug: string) =>
  artworks.find((artwork) => artwork.slug === slug);
