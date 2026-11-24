import type { CSSProperties, ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Spacing = "none" | "lg" | "xl";

const SPACING: Record<Spacing, string> = {
  none: "0px",
  lg: "var(--rds-section-lg)",
  xl: "var(--rds-section-xl)",
};

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
