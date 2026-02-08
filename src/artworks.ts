type Palette = {
  background: string;
  primary: string;
  secondary: string;
  accent: string;
};

type P5Instance = {
  createCanvas: (width: number, height: number) => void;
  resizeCanvas: (width: number, height: number) => void;
  colorMode: (mode: number, max1?: number, max2?: number, max3?: number, maxA?: number) => void;
  noStroke: () => void;
  background: (color: string) => void;
  millis: () => number;
  windowWidth: number;
  windowHeight: number;
  width: number;
  height: number;
  mouseIsPressed: boolean;
  mouseX: number;
  mouseY: number;
  frameCount: number;
  sin: (value: number) => number;
  cos: (value: number) => number;
  random: (value: number) => number;
  ellipse: (x: number, y: number, width: number, height?: number) => void;
  fill: (h: number, s: number, b: number, a?: number) => void;
  windowResized?: () => void;
  setup?: () => void;
  draw?: () => void;
  remove: () => void;
  HSB: number;
};

type P5Constructor = new (sketch: (instance: P5Instance) => void, node?: HTMLElement) => P5Instance;

declare global {
  interface Window {
    p5?: P5Constructor;
  }
}

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
      let instance: P5Instance | null = null;

      const start = async () => {
        const loadP5 = () =>
          new Promise<P5Constructor>((resolve, reject) => {
            if (window.p5) {
              resolve(window.p5);
              return;
            }
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/p5@1.9.4/lib/p5.min.js";
            script.async = true;
            script.onload = () => {
              if (window.p5) {
                resolve(window.p5);
              } else {
                reject(new Error("p5 failed to load."));
              }
            };
            script.onerror = () => reject(new Error("Failed to load p5 script."));
            document.body.appendChild(script);
          });

        const P5 = await loadP5();
        const sketch = (p5: P5Instance) => {
          const trails: { x: number; y: number; hue: number; size: number }[] = [];

          p5.setup = () => {
            p5.createCanvas(p5.windowWidth, p5.windowHeight);
            p5.colorMode(p5.HSB, 360, 100, 100, 100);
            p5.noStroke();
          };

          p5.windowResized = () => {
            p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
          };

          p5.draw = () => {
            p5.background(palette.background);
            const time = p5.millis() * 0.0005;

            for (let i = 0; i < 140; i += 1) {
              const angle = time + i * 0.12;
              const radius = 120 + 80 * p5.sin(time + i * 0.3);
              const x = p5.width / 2 + p5.cos(angle) * radius;
              const y = p5.height / 2 + p5.sin(angle * 1.3) * radius;
              const hue = (i * 4 + time * 120) % 360;
              p5.fill(hue, 80, 100, 65);
              p5.ellipse(x, y, 24 + p5.sin(time + i) * 10);
            }

            if (p5.mouseIsPressed) {
              trails.push({
                x: p5.mouseX,
                y: p5.mouseY,
                hue: (p5.frameCount * 6) % 360,
                size: 28 + p5.random(8),
              });
            }

            while (trails.length > 120) {
              trails.shift();
            }

            trails.forEach((trail, index) => {
              p5.fill(trail.hue, 70, 100, 80 - index * 0.4);
              p5.ellipse(trail.x, trail.y, trail.size * 0.8);
            });
          };
        };

        instance = new P5(sketch, container);
      };

      void start();

      return () => {
        if (instance) {
          instance.remove();
        }
      };
    },
  };
};

export const artworks: Artwork[] = [particleArtwork(), p5AuroraArtwork()];

export const getArtworkBySlug = (slug: string) =>
  artworks.find((artwork) => artwork.slug === slug);
