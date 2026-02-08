export type P5Instance = {
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

export type P5Constructor = new (sketch: (instance: P5Instance) => void, node?: HTMLElement) => P5Instance;

declare global {
  interface Window {
    p5?: P5Constructor;
  }
}

export const loadP5 = () =>
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
