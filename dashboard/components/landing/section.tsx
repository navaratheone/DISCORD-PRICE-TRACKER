import type { CSSProperties, ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Spacing = "none" | "lg" | "xl";

const SPACING: Record<Spacing, string> = {
  none: "0px",
  lg: "var(--rds-section-lg)",
  xl: "var(--rds-section-xl)",
};

/** One midnight ground under every section; rhythm comes from the section spacing scale, never a band. */
export function Section({
  as: As = "section",
  spacingTop = "xl",
  spacingBottom = "xl",
  id,
  labelledBy,
  className,
  children,
}: {
  as?: ElementType;
  spacingTop?: Spacing;
  spacingBottom?: Spacing;
  id?: string;
  labelledBy?: string;
  className?: string;
  children: ReactNode;
}) {
  const style = {
    "--rds-pt": SPACING[spacingTop],
    "--rds-pb": SPACING[spacingBottom],
  } as CSSProperties;

  return (
    <As id={id} aria-labelledby={labelledBy} className={cn("rds-section", className)} style={style}>
      {children}
    </As>
  );
}

/** 1390px max with 24px gutters, narrowing to 1280px with 80px between 1260 and 1599px. */
export function Container({
  as: As = "div",
  className,
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return (
    <As className={cn("mx-auto box-border w-full max-w-rds px-rds-container-pad", className)}>
      {children}
    </As>
  );
}
