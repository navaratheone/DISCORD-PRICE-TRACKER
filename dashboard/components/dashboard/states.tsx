import { AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ApiError } from "@/lib/api";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("rds-skeleton", className)} aria-hidden />;
}

export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <div role="status" className="rds-label flex items-center gap-rds-3">
      <Loader2 className="h-4 w-4 animate-spin text-rds-dusk-50" strokeWidth={1.5} aria-hidden />
      {label}
    </div>
  );
}

export function ErrorPanel({
  error,
  onRetry,
}: {
  error: unknown;
  onRetry?: () => void;
}) {
  const status = error instanceof ApiError ? error.status : undefined;
  const message =
    status === 403
      ? "You don't have access to this server's dashboard."
      : status === 404
        ? "We couldn't find what you were looking for."
        : "Something went wrong while loading this view.";

  return (
    <div role="alert" data-tone="error" className="rds-message px-rds-5 py-rds-4">
      <AlertTriangle strokeWidth={1.5} aria-hidden />
      <div className="min-w-0">
        <p className="font-medium text-rds-fg">{status ? `Error ${status}` : "Error"}</p>
        <p className="mt-rds-1 text-rds-dusk-10">{message}</p>
        {onRetry && (
          <button type="button" onClick={onRetry} className="rds-btn rds-btn--secondary rds-btn--sm mt-rds-4">
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rds-glass flex flex-col items-start gap-rds-4 rounded-rds-lg p-rds-6 max-md:p-rds-5">
      <span className="rds-label">No data</span>
      <p className="font-rds-sans text-rds-body-md text-balance text-rds-dusk-10">{title}</p>
      {children}
    </div>
  );
}
