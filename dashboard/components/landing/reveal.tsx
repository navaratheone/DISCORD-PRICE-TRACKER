"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

const nodes = new Set<HTMLElement>();
const held = new Set<HTMLElement>();

let shower: IntersectionObserver | null = null;

const shown = (node: HTMLElement) => node.dataset.rdsShown === "true";

// An entrance plays once. Once shown, a node is let go, so scrolling back over it never replays it.
function show(node: HTMLElement) {
  node.dataset.rdsShown = "true";
  forget(node);
}

function observe(node: HTMLElement) {
  if (shown(node)) return;
  shower ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const target = entry.target as HTMLElement;
        if (entry.isIntersecting && !held.has(target)) show(target);
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );

  nodes.add(node);
  shower.observe(node);
}

function forget(node: HTMLElement) {
  nodes.delete(node);
  held.delete(node);
  shower?.unobserve(node);
}

/** An anchor glide holds the entrances it will fly past, so they play as it lands; ones already played stay put. */
export function holdEntrances(root: Element) {
  for (const node of nodes) {
    if (root.contains(node)) held.add(node);
  }
}

export function releaseEntrances() {
  const landed = [...held];
  held.clear();
  for (const node of landed) {
    const box = node.getBoundingClientRect();
    if (box.top < window.innerHeight * 0.92 && box.bottom > 0) show(node);
  }
}

export type RevealVariant = "wipe" | "settle" | "lift";

/**
 * Wipe for headings and statements, settle for words and actions, lift for
 * cards. Armed only once script has marked the document.
 */
export function Reveal({
  as: As = "div",
  variant = "settle",
  delay = 0,
  className,
  children,
}: {
  as?: ElementType;
  variant?: RevealVariant;
  /** Stagger delay in milliseconds. */
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    observe(node);
    return () => forget(node);
  }, []);

  return (
    <As
      ref={ref}
      data-rds-reveal={variant}
      className={className}
      style={delay ? ({ "--rds-reveal-delay": `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </As>
  );
}
