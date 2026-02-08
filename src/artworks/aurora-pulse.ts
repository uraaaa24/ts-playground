import type { Artwork } from "../core/types";
import { pickPalette } from "../core/palettes";
import { loadP5, type P5Instance } from "../core/p5-loader";

export const auroraPulseArtwork = (): Artwork => {
  const palette = pickPalette(2);

  return {
    title: "Aurora Pulse",
    slug: "aurora-pulse",
    description: "p5.jsで描くマルチカラーのインタラクティブ作品。",
    mount: (container) => {
      let instance: P5Instance | null = null;

      const start = async () => {
        // p5 は CDN からロードするため、最初の呼び出し時に非同期で読み込みます。
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
            // 背景を塗り直して、光の粒の軌跡が残らないようにする
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
              // マウス押下中だけ軌跡を追加して、インタラクティブに反応させる
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
