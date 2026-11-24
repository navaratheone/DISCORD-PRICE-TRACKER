import type { HTMLAttributes, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonTheme = "primary" | "secondary" | "tertiary";
export type ButtonSize = "sm" | "md" | "lg";

type Props = {
  children: ReactNode;
  theme?: ButtonTheme;
  size?: ButtonSize;
  
  arrow?: boolean;
  icon?: ReactNode;
  href?: string;
  external?: boolean;
  fullWidth?: boolean;
  className?: string;
} & Omit<HTMLAttributes<HTMLElement>, "children" | "className">;

export function Button({
  children,
  theme = "primary",
  size = "md",
  arrow,
  icon,
  href,
  external = false,
  fullWidth = false,
  className,
  ...rest
}: Props) {
  const classes = cn(
    "rds-btn",
    `rds-btn--${theme}`,
    theme !== "tertiary" && `rds-btn--${size}`,
    fullWidth && "rds-btn--full",
    className,
  );

  const content = (
    <>
      {icon ? (
        <span aria-hidden className="flex size-4 shrink-0 items-center justify-center">
          {icon}
        </span>
      ) : null}
      <span>{children}</span>
      {arrow ? (
        <span aria-hidden className="rds-arrows">
          <ArrowRight strokeWidth={1.5} />
          <ArrowRight strokeWidth={1.5} />
        </span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noreferrer noopener" } : null)}
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      {content}
    </button>
  );
}
