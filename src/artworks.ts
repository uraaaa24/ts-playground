import p5 from "p5";

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
  {
    background: "#0b1120",
    primary: "#f43f5e",
    secondary: "#22d3ee",
    accent: "#a3e635",
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

const p5AuroraArtwork = (): Artwork => {
  const palette = pickPalette(2);

  return {
    title: "Aurora Pulse",
    slug: "aurora-pulse",
    description: "p5.jsで描くマルチカラーのインタラクティブ作品。",
    mount: (container) => {
      const sketch = (instance: p5) => {
        const trails: { x: number; y: number; hue: number; size: number }[] = [];

        instance.setup = () => {
          instance.createCanvas(instance.windowWidth, instance.windowHeight);
          instance.colorMode(instance.HSB, 360, 100, 100, 100);
          instance.noStroke();
        };

        instance.windowResized = () => {
          instance.resizeCanvas(instance.windowWidth, instance.windowHeight);
        };

        instance.draw = () => {
          instance.background(palette.background);
          const time = instance.millis() * 0.0005;

          for (let i = 0; i < 140; i += 1) {
            const angle = time + i * 0.12;
            const radius = 120 + 80 * instance.sin(time + i * 0.3);
            const x = instance.width / 2 + instance.cos(angle) * radius;
            const y = instance.height / 2 + instance.sin(angle * 1.3) * radius;
            const hue = (i * 4 + time * 120) % 360;
            instance.fill(hue, 80, 100, 65);
            instance.ellipse(x, y, 24 + instance.sin(time + i) * 10);
          }

          if (instance.mouseIsPressed) {
            trails.push({
              x: instance.mouseX,
              y: instance.mouseY,
              hue: (instance.frameCount * 6) % 360,
              size: 28 + instance.random(8),
            });
          }

          while (trails.length > 120) {
            trails.shift();
          }

          trails.forEach((trail, index) => {
            instance.fill(trail.hue, 70, 100, 80 - index * 0.4);
            instance.ellipse(trail.x, trail.y, trail.size * 0.8);
          });
        };
      };

      const instance = new p5(sketch, container);
      return () => {
        instance.remove();
      };
    },
  };
};

export const artworks: Artwork[] = [particleArtwork(), p5AuroraArtwork()];

export const getArtworkBySlug = (slug: string) =>
  artworks.find((artwork) => artwork.slug === slug);
