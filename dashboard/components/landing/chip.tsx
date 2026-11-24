import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type DotTone = "yellow" | "sky" | "red" | "grey";

export function Chip({
  dot,
  icon,
  size,
  className,
  children,
}: {
  dot?: DotTone;
  icon?: ReactNode;
  size?: "sm";
  className?: string;
  children: ReactNode;
}) {
  return (
    <span className={cn("rds-chip", size === "sm" && "rds-chip--sm", className)}>
      {dot ? <span aria-hidden className="rds-dot" data-tone={dot} /> : null}
      {icon ? (
        <span aria-hidden className="flex size-[14px] shrink-0 items-center justify-center">
          {icon}
        </span>
      ) : null}
      {children}
    </span>
  );
}
