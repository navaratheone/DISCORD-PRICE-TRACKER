"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Renders the track twice and moves it by half its width, so the loop is
 * seamless at a constant rate whatever the content measures. Under reduced
 * motion the copy is dropped and the track wraps.
 */
export function Marquee({
  speed = 50,
  label,
  className,
  children,
}: {
  /** Pixels per second. */
  speed?: number;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState<number | null>(null);

  useEffect(() => {
    const node = trackRef.current;
    if (!node) return;

    const measure = () => {
      const half = node.scrollWidth / 2;
      if (half > 0) setDuration(half / speed);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [speed]);

  const style = duration ? ({ "--rds-marquee-duration": `${duration}s` } as CSSProperties) : undefined;

  return (
    <div className={cn("rds-marquee-viewport", className)} role="group" aria-label={label}>
      <div ref={trackRef} className="rds-marquee" style={style}>
        <div className="rds-marquee-track">{children}</div>
        <div aria-hidden className="rds-marquee-track">
          {children}
        </div>
      </div>
    </div>
  );
}
