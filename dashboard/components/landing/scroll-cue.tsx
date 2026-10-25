"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowDown } from "lucide-react";
import { anchorY, glideToY, prefersReducedMotion } from "./anchors";

const GLIDE_MS = 1400;

function subscribeToVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

/** Bottom-left on a laptop, centred at the foot on a tall screen; it loops only while on screen. */
export function ScrollCue({ placement }: { placement: "corner" | "foot" }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [onScreen, setOnScreen] = useState(false);
  const pageShown = useSyncExternalStore(
    subscribeToVisibility,
    () => document.visibilityState === "visible",
    () => true,
  );

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const onClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById("features");
    if (!target || prefersReducedMotion()) return;
    event.preventDefault();
    glideToY(anchorY(target), GLIDE_MS);
    history.replaceState(null, "", "#features");
  };

  return (
    <a
      ref={ref}
      href="#features"
      onClick={onClick}
      data-placement={placement}
      data-running={onScreen && pageShown ? "true" : "false"}
      className="rds-cue"
    >
      <span className="rds-cue-label">Scroll down</span>
      <span aria-hidden className="rds-cue-mark">
        <span className="rds-cue-bob">
          <span className="rds-cue-flip">
            <ArrowDown className="rds-cue-light" />
            <ArrowDown />
            <ArrowDown className="rds-cue-hot" />
          </span>
        </span>
      </span>
    </a>
  );
}
