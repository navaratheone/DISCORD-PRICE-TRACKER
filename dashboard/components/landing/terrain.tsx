"use client";

import { useEffect, useRef } from "react";

/* A landscape made of price lines, seen in perspective: every ridge is a curve flowing toward the viewer, nearer
   ridges hide farther ones, a red trench winds through it where prices plummet, and one yellow crest travels in
   from the horizon. Drawn on a 2D canvas with its own projection at 30 frames a second and one device pixel per CSS
   pixel; it runs only while on screen and holds one still frame under reduced motion. */

type Variant = "hero" | "close";

const SETTINGS: Record<Variant, { horizon: number; camH: number; amp: number; speed: number }> = {
  hero: { horizon: 0.4, camH: 1, amp: 0.55, speed: 0.34 },
  close: { horizon: 0.57, camH: 1.3, amp: 0.62, speed: 0.26 },
};

const Z_NEAR = 1.2;
const Z_FAR = 15;
const GROUND = "#091a23";
const FRAME_MS = 1000 / 30;
// The lowest the ground can reach (the trench floor under the deepest swell), so each ridge's fill stops just below it.
const lowest = (amp: number) => -amp - 1.1;

function trenchX(zw: number) {
  return 1.5 * Math.sin(0.16 * zw) + 0.45 * Math.sin(0.41 * zw + 1.1);
}

/** Ground height at world x and world depth zw: layered swells, sharper crests to the sides, and the trench. */
function height(x: number, zw: number, amp: number) {
  const swell =
    0.5 * Math.sin(0.9 * x + 0.55 * zw) +
    0.28 * Math.sin(1.9 * x - 0.8 * zw + 1.3) +
    0.15 * Math.sin(4.1 * x + 1.7 * zw + 0.4) +
    0.07 * Math.sin(8.3 * x - 2.3 * zw);
  const crest = 0.35 * (1 - Math.abs(Math.sin(0.6 * x - 0.35 * zw)));
  const sides = 0.55 + 0.45 * Math.min(1, Math.abs(x) / 3);
  const dx = (x - trenchX(zw)) / 0.55;
  const trench = 1.05 * Math.exp(-dx * dx);
  return amp * (swell * sides + crest) - trench;
}

export function TerrainField({ variant = "hero" }: { variant?: Variant }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const set = SETTINGS[variant];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let rows = 44;
    let cols = 120;
    let frame = 0;
    let onScreen = false;
    let started = performance.now();
    let elapsed = 0;
    let drawn = 0;

    const resize = () => {
      const box = canvas.getBoundingClientRect();
      // A soft background needs no retina pixels: one per CSS pixel keeps the fill cost down.
      const dpr = 1;
      w = box.width;
      h = box.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const small = w < 769;
      rows = small ? 28 : 40;
      cols = small ? 56 : 96;
      draw(elapsed);
    };

    const draw = (t: number) => {
      if (!w || !h) return;
      ctx.clearRect(0, 0, w, h);
      const horizonY = h * set.horizon;
      const f = ((h * 1.03 - horizonY) * Z_NEAR) / set.camH;
      const travel = t * set.speed;
      const span = Z_FAR - Z_NEAR;
      // The yellow crest rides the ground in from the horizon, once every span of travel.
      const crestZ = Z_FAR - (travel % span);
      const xs: number[] = new Array(cols + 1);
      const ys: number[] = new Array(cols + 1);
      const floor = set.camH - lowest(set.amp);

      for (let r = rows - 1; r >= 0; r--) {
        const k = r / (rows - 1);
        const z = Z_NEAR + span * k * k;
        const zw = z + travel;
        const depth = (z - Z_NEAR) / span;
        const near = Math.pow(1 - depth, 1.6);

        for (let c = 0; c <= cols; c++) {
          const sx = -40 + (c * (w + 80)) / cols;
          const x = ((sx - w / 2) * z) / f;
          xs[c] = sx;
          ys[c] = horizonY + ((set.camH - height(x, zw, set.amp)) * f) / z;
        }

        // Nearer ground hides what lies behind it. Every farther ridge sits above this one's lowest possible point,
        // so the fill only needs to reach there rather than the foot of the canvas.
        const base = Math.min(h + 2, horizonY + (floor * f) / z);
        ctx.beginPath();
        ctx.moveTo(xs[0], ys[0]);
        for (let c = 1; c <= cols; c++) ctx.lineTo(xs[c], ys[c]);
        ctx.lineTo(xs[cols], base);
        ctx.lineTo(xs[0], base);
        ctx.closePath();
        ctx.fillStyle = GROUND;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(xs[0], ys[0]);
        for (let c = 1; c <= cols; c++) ctx.lineTo(xs[c], ys[c]);
        ctx.lineWidth = 0.8 + near * 0.6;
        ctx.strokeStyle = `rgba(138, 153, 160, ${(0.07 + 0.5 * near).toFixed(3)})`;
        ctx.stroke();

        // The trench floor, in red: where every line falls away.
        const tx = trenchX(zw);
        const lo = ((tx - 0.42) * f) / z + w / 2;
        const hi = ((tx + 0.42) * f) / z + w / 2;
        ctx.beginPath();
        let open = false;
        for (let c = 0; c <= cols; c++) {
          if (xs[c] < lo || xs[c] > hi) {
            open = false;
            continue;
          }
          if (!open) ctx.moveTo(xs[c], ys[c]);
          else ctx.lineTo(xs[c], ys[c]);
          open = true;
        }
        ctx.strokeStyle = `rgba(255, 68, 56, ${(0.1 + 0.6 * near).toFixed(3)})`;
        ctx.lineWidth = 1 + near;
        ctx.stroke();

        // One yellow crest, brightest mid-way and gone before it reaches the viewer.
        const pass = Math.abs(z - crestZ) / (span / rows) / (1 + 3 * k);
        if (pass < 1) {
          const life = Math.sin(Math.PI * Math.min(1, Math.max(0, 1 - (crestZ - Z_NEAR) / span)));
          ctx.beginPath();
          ctx.moveTo(xs[0], ys[0]);
          for (let c = 1; c <= cols; c++) ctx.lineTo(xs[c], ys[c]);
          ctx.strokeStyle = `rgba(220, 255, 30, ${((1 - pass) * (0.25 + 0.6 * life)).toFixed(3)})`;
          ctx.lineWidth = 1.2 + near;
          ctx.stroke();
        }
      }
    };

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (now - drawn < FRAME_MS) return;
      drawn = now;
      elapsed = (now - started) / 1000;
      draw(elapsed);
    };

    const play = () => {
      if (reduced || frame || !onScreen || document.visibilityState !== "visible") return;
      started = performance.now() - elapsed * 1000;
      frame = requestAnimationFrame(loop);
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const sized = new ResizeObserver(resize);
    sized.observe(canvas);
    const seen = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) play();
      else stop();
    });
    seen.observe(canvas);
    const onVisibility = () => (document.visibilityState === "visible" ? play() : stop());
    document.addEventListener("visibilitychange", onVisibility);

    elapsed = reduced ? 9 : 0;
    resize();
    canvas.dataset.ready = "true";

    return () => {
      stop();
      sized.disconnect();
      seen.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [variant]);

  return <canvas ref={ref} aria-hidden className="rds-terrain" data-variant={variant} />;
}
