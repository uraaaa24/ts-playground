import type { Artwork } from "./types";
import { pickPalette } from "./palettes";

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

export const particleArtwork = (): Artwork => {
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
