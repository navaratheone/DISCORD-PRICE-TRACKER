import { holdEntrances, releaseEntrances } from "./reveal";

const MIN_MS = 700;
const MAX_MS = 1500;

const easeInOutQuint = (t: number) => (t < 0.5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2);

let cancelGlide: (() => void) | null = null;

export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function anchorY(target: HTMLElement) {
  const root = document.documentElement;
  const padding = parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
  const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  return target.getBoundingClientRect().top + window.scrollY - padding - margin;
}

export function glideToY(y: number, duration: number, onDone?: () => void) {
  cancelGlide?.();

  const from = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const to = Math.min(max, Math.max(0, y));
  const start = performance.now();
  let frame = 0;

  const stop = () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("wheel", stop);
    window.removeEventListener("touchstart", stop);
    window.removeEventListener("keydown", stop);
    if (cancelGlide === stop) cancelGlide = null;
    onDone?.();
  };

  const step = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    window.scrollTo(0, from + (to - from) * easeInOutQuint(t));
    if (t < 1) frame = requestAnimationFrame(step);
    else stop();
  };

  window.addEventListener("wheel", stop, { passive: true });
  window.addEventListener("touchstart", stop, { passive: true });
  window.addEventListener("keydown", stop);
  cancelGlide = stop;
  frame = requestAnimationFrame(step);
}

function focusWithoutScroll(target: HTMLElement) {
  if (!target.matches("a[href], button, input, select, textarea, [tabindex]")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
}

export function goToHash(hash: string) {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  const target = id ? document.getElementById(id) : null;
  if (!target) return false;

  const reduced = prefersReducedMotion();
  const block = target.closest<HTMLElement>("section, footer");
  if (!reduced && block) holdEntrances(block);
  if (window.location.hash !== `#${id}`) window.history.pushState(null, "", `#${id}`);

  const land = () => {
    releaseEntrances();
    focusWithoutScroll(target);
  };

  // Wait two frames for a closed menu to release its scroll lock.
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      const y = anchorY(target);
      const distance = Math.abs(y - window.scrollY);
      if (reduced || distance < 4) {
        window.scrollTo(0, y);
        land();
        return;
      }
      glideToY(y, Math.min(MAX_MS, Math.max(MIN_MS, 450 + distance * 0.12)), land);
    }),
  );
  return true;
}
