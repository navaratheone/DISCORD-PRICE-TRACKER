"use client";

import Link from "next/link";
import { use } from "react";
import { ChevronRight } from "lucide-react";
import { getServer, getWatches } from "@/lib/api";
import { useAsync } from "@/lib/use-async";
import { Chip } from "@/components/landing/chip";
import {
  EmptyState,
  ErrorPanel,
  Skeleton,
} from "@/components/dashboard/states";
import {
  AdminBadge,
  formatPrice,
  PageHeader,
  StatusPill,
  StockPill,
} from "@/components/dashboard/page-header";

export default function ServerPage({
  params,
}: {
  params: Promise<{ guildId: string }>;
}) {
  const { guildId } = use(params);
  const server = useAsync(() => getServer(guildId), [guildId]);
  const watches = useAsync(() => getWatches(guildId), [guildId]);

  if (server.error) {
    return (
      <>
        <PageHeader
          meta="Server"
          title="Dashboard"
          back={{ href: "/dashboard", label: "All servers" }}
        />
        <ErrorPanel error={server.error} onRetry={server.reload} />
      </>
    );
  }

  return (
    <>
      <PageHeader
        meta="Server overview"
        title={server.data?.name ?? (server.loading ? "Loading…" : "Server")}
        back={{ href: "/dashboard", label: "All servers" }}
      >
        {server.data && (
          <>
            <AdminBadge isAdmin={server.data.isAdmin} />
            {server.data.regionDefault && (
              <Chip size="sm">{server.data.regionDefault}</Chip>
            )}
            <Chip size="sm">
              <span className="rds-tnum text-rds-fg">{server.data.watchCount}</span>
              watches
            </Chip>
          </>
        )}
      </PageHeader>

      {watches.loading ? (
        <Skeleton className="h-64 w-full" />
      ) : watches.error ? (
        <ErrorPanel error={watches.error} onRetry={watches.reload} />
      ) : !watches.data || watches.data.length === 0 ? (
        <EmptyState title="No watches yet. Use /track <url> in Discord." />
      ) : (
        <div className="rds-glass overflow-x-auto rounded-rds-lg">
          <table className="rds-ledger min-w-[640px]">
            <thead>
              <tr>
                {["Product", "Price", "Stock", "Status", ""].map((h, i) => (
                  <th key={i} scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {watches.data.map((w) => (
                <tr key={w.id} className="group">
                  <td>
                    <Link
                      href={`/dashboard/watches/${w.id}`}
                      className="block min-w-0 hover:no-underline"
                    >
                      <p className="truncate font-rds-sans text-rds-body-sm font-medium text-rds-fg">
                        {w.title ?? w.sourceUrl}
                      </p>
                      <p className="mt-0.5 font-rds-mono text-rds-body-xs text-rds-dusk-30">
                        {w.domain}
                      </p>
                    </Link>
                  </td>
                  <td>
                    <span className="rds-tnum font-rds-mono text-rds-body-sm text-rds-dusk-10">
                      {formatPrice(w.lastPrice, w.currency)}
                    </span>
                  </td>
                  <td>
                    <StockPill inStock={w.inStock} />
                  </td>
                  <td>
                    <StatusPill isActive={w.isActive} paused={w.paused} />
                  </td>
                  <td className="text-right">
                    <Link
                      href={`/dashboard/watches/${w.id}`}
                      aria-label="Open watch"
                      className="inline-flex text-rds-dusk-50 transition-colors duration-rds-fast group-hover:text-rds-red"
                    >
                      <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
