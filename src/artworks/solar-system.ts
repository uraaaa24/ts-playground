import type { Artwork } from "../core/types";

const createCanvas = (container: HTMLElement) => {
  const canvas = document.createElement("canvas");
  canvas.className = "artwork";
  container.appendChild(canvas);
  return canvas;
};

const resizeCanvas = (canvas: HTMLCanvasElement) => {
  const { innerWidth, innerHeight, devicePixelRatio } = window;
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  canvas.style.width = `${innerWidth}px`;
  canvas.style.height = `${innerHeight}px`;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
};

type Star = {
  x: number;
  y: number;
  radius: number;
  alpha: number;
};

type Planet = {
  name: string;
  radius: number;
  orbitRadius: number;
  orbitPeriodDays: number;
  rotationSpeed: number;
  baseAngle: number;
  color: string;
  glow: string;
  hasRing?: boolean;
};

const buildStars = (count: number, width: number, height: number): Star[] =>
  Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: 0.6 + Math.random() * 1.6,
    alpha: 0.4 + Math.random() * 0.6,
  }));

export const solarSystemArtwork = (): Artwork => {
  return {
    title: "Solar System",
    slug: "solar-system",
    description: "太陽系の自転と公転を描く作品。",
    mount: (container) => {
      const canvas = createCanvas(container);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Failed to get canvas context.");
      }

      let animationId = 0;
      let stars: Star[] = [];
      const epoch = Date.UTC(2000, 0, 1, 12, 0, 0);
      const dayMs = 1000 * 60 * 60 * 24;

      const planets: Planet[] = [
        {
          name: "Mercury",
          radius: 4,
          orbitRadius: 45,
          orbitPeriodDays: 87.969,
          rotationSpeed: 2.4,
          baseAngle: 4.4,
          color: "#c0b5a9",
          glow: "rgba(255, 236, 214, 0.25)",
        },
        {
          name: "Venus",
          radius: 7,
          orbitRadius: 70,
          orbitPeriodDays: 224.701,
          rotationSpeed: 1.6,
          baseAngle: 1.8,
          color: "#d9b47a",
          glow: "rgba(255, 214, 160, 0.25)",
        },
        {
          name: "Earth",
          radius: 8,
          orbitRadius: 95,
          orbitPeriodDays: 365.256,
          rotationSpeed: 2.2,
          baseAngle: 1.2,
          color: "#4c8bd7",
          glow: "rgba(144, 196, 255, 0.28)",
        },
        {
          name: "Mars",
          radius: 6,
          orbitRadius: 125,
          orbitPeriodDays: 686.98,
          rotationSpeed: 2.4,
          baseAngle: 0.6,
          color: "#c8704a",
          glow: "rgba(255, 172, 140, 0.26)",
        },
        {
          name: "Jupiter",
          radius: 14,
          orbitRadius: 160,
          orbitPeriodDays: 4332.589,
          rotationSpeed: 3.2,
          baseAngle: 1.9,
          color: "#d1a67f",
          glow: "rgba(255, 214, 170, 0.24)",
        },
        {
          name: "Saturn",
          radius: 12,
          orbitRadius: 200,
          orbitPeriodDays: 10759.22,
          rotationSpeed: 3,
          baseAngle: 2.5,
          color: "#d9c28f",
          glow: "rgba(255, 230, 190, 0.24)",
          hasRing: true,
        },
      ];

      const handleResize = () => {
        resizeCanvas(canvas);
        stars = buildStars(220, window.innerWidth, window.innerHeight);
      };

      const drawBackground = () => {
        const gradient = ctx.createRadialGradient(
          window.innerWidth * 0.4,
          window.innerHeight * 0.3,
          20,
          window.innerWidth * 0.4,
          window.innerHeight * 0.3,
          Math.max(window.innerWidth, window.innerHeight)
        );
        gradient.addColorStop(0, "#0f1834");
        gradient.addColorStop(0.5, "#070b1f");
        gradient.addColorStop(1, "#04050f");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

        stars.forEach((star) => {
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      };

      const drawPlanet = (
        planet: Planet,
        centerX: number,
        centerY: number,
        orbitScale: number,
        orbitAngle: number,
        rotationAngle: number
      ) => {
        const orbitRadius = planet.orbitRadius * orbitScale;
        const x = centerX + Math.cos(orbitAngle) * orbitRadius;
        const y = centerY + Math.sin(orbitAngle) * orbitRadius * 0.85;
        const size = planet.radius * orbitScale * 0.9;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotationAngle);

        ctx.beginPath();
        ctx.fillStyle = planet.glow;
        ctx.arc(0, 0, size * 1.6, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = planet.color;
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
        ctx.lineWidth = Math.max(1, size * 0.18);
        ctx.arc(0, 0, size * 0.5, -0.6, 0.6);
        ctx.stroke();

        if (planet.hasRing) {
          ctx.beginPath();
          ctx.strokeStyle = "rgba(234, 216, 170, 0.75)";
          ctx.lineWidth = Math.max(1, size * 0.25);
          ctx.ellipse(0, 0, size * 1.6, size * 0.55, 0.3, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();

        return { x, y, size };
      };

      const drawMoon = (
        host: { x: number; y: number; size: number },
        time: number,
        orbitScale: number
      ) => {
        const moonOrbit = 18 * orbitScale;
        const angle = time * 2.8;
        const mx = host.x + Math.cos(angle) * moonOrbit;
        const my = host.y + Math.sin(angle) * moonOrbit * 0.7;
        ctx.beginPath();
        ctx.fillStyle = "#d9dce6";
        ctx.arc(mx, my, host.size * 0.35, 0, Math.PI * 2);
        ctx.fill();
      };

      const render = () => {
        const rotationTime = performance.now() * 0.0004;
        const daysSinceEpoch = (Date.now() - epoch) / dayMs;
        drawBackground();

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const maxOrbit = Math.max(...planets.map((planet) => planet.orbitRadius));
        const orbitScale =
          (Math.min(window.innerWidth, window.innerHeight) * 0.38) / maxOrbit;

        ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
        ctx.lineWidth = 1;
        planets.forEach((planet) => {
          const orbitRadius = planet.orbitRadius * orbitScale;
          ctx.beginPath();
          ctx.ellipse(
            centerX,
            centerY,
            orbitRadius,
            orbitRadius * 0.85,
            0,
            0,
            Math.PI * 2
          );
          ctx.stroke();
        });

        const sunRadius = 22 * orbitScale * 1.6;
        const sunGlow = ctx.createRadialGradient(
          centerX,
          centerY,
          sunRadius * 0.2,
          centerX,
          centerY,
          sunRadius * 2.6
        );
        sunGlow.addColorStop(0, "rgba(255, 231, 169, 0.9)");
        sunGlow.addColorStop(0.45, "rgba(255, 197, 104, 0.45)");
        sunGlow.addColorStop(1, "rgba(255, 159, 64, 0)");
        ctx.fillStyle = sunGlow;
        ctx.beginPath();
        ctx.arc(centerX, centerY, sunRadius * 2.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = "#f6c760";
        ctx.arc(centerX, centerY, sunRadius, 0, Math.PI * 2);
        ctx.fill();

        const earthOrbitAngle =
          planets[2].baseAngle +
          (daysSinceEpoch / planets[2].orbitPeriodDays) * Math.PI * 2;
        const earth = drawPlanet(
          planets[2],
          centerX,
          centerY,
          orbitScale,
          earthOrbitAngle,
          rotationTime * planets[2].rotationSpeed
        );
        planets
          .filter((planet) => planet.name !== "Earth")
          .forEach((planet) => {
            const orbitAngle =
              planet.baseAngle +
              (daysSinceEpoch / planet.orbitPeriodDays) * Math.PI * 2;
            drawPlanet(
              planet,
              centerX,
              centerY,
              orbitScale,
              orbitAngle,
              rotationTime * planet.rotationSpeed
            );
          });
        drawMoon(earth, rotationTime, orbitScale);

        animationId = window.requestAnimationFrame(render);
      };

      handleResize();
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
