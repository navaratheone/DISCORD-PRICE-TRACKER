"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { getServers, serverIconUrl, inviteUrl } from "@/lib/api";
import { useAsync } from "@/lib/use-async";
import { useMe } from "@/components/dashboard/me-context";
import { Button } from "@/components/landing/buttons";
import {
  EmptyState,
  ErrorPanel,
  Skeleton,
} from "@/components/dashboard/states";
import { AdminBadge, PageHeader } from "@/components/dashboard/page-header";

export default function DashboardPage() {
  const me = useMe();
  const { data, error, loading, reload } = useAsync(getServers, []);

  return (
    <>
      <PageHeader
        meta={`Signed in as ${me.username ?? "Discord user"}`}
        title="Your servers"
      />

      {loading ? (
        <div className="grid grid-cols-1 gap-rds-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[92px]" />
          ))}
        </div>
      ) : error ? (
        <ErrorPanel error={error} onRetry={reload} />
      ) : !data || data.length === 0 ? (
        <EmptyState title="Invite the bot to a server to get started.">
          <Button href={inviteUrl} theme="primary">
            Add to Discord
          </Button>
        </EmptyState>
      ) : (
        <div className="grid grid-cols-1 gap-rds-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((s) => {
            const icon = serverIconUrl(s);
            return (
              <Link
                key={s.guildId}
                href={`/dashboard/servers/${s.guildId}`}
                className="group rds-glass rds-stroke flex items-center gap-rds-4 rounded-rds-lg p-rds-5 hover:no-underline"
              >
                {icon ? (
                  <Image
                    src={icon}
                    alt=""
                    width={48}
                    height={48}
                    className="h-12 w-12 shrink-0 rounded-rds-md border border-rds-dusk"
                    unoptimized
                  />
                ) : (
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-rds-md border border-rds-dusk-90 bg-rds-dusk-09 font-rds-sans text-rds-body-sm font-medium uppercase text-rds-fg">
                    {(s.name ?? "?").slice(0, 2)}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-rds-2">
                    <p className="truncate font-rds-sans text-rds-body-md font-medium text-rds-fg">
                      {s.name ?? "Unknown server"}
                    </p>
                    <AdminBadge isAdmin={s.isAdmin} />
                  </div>
                  <p className="mt-rds-1 font-rds-mono text-rds-body-xs text-rds-dusk-30">
                    <span className="rds-tnum text-rds-dusk-10">{s.watchCount}</span>{" "}
                    {s.watchCount === 1 ? "watch" : "watches"}
                  </p>
                </div>
                <ChevronRight
                  className="h-4 w-4 shrink-0 text-rds-dusk-50 transition-colors duration-rds-fast group-hover:text-rds-red"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
