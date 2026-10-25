"use client";

import { useEffect } from "react";
import { ApiError, getMe, loginUrl } from "@/lib/api";
import { useAsync } from "@/lib/use-async";
import { MeProvider } from "@/components/dashboard/me-context";
import { AppBar } from "@/components/dashboard/app-bar";
import { ErrorPanel, Skeleton } from "@/components/dashboard/states";
import { Container } from "@/components/landing/section";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: me, error, loading, reload } = useAsync(getMe, []);

  useEffect(() => {
    if (error instanceof ApiError && error.status === 401) {
      window.location.href = loginUrl;
    }
  }, [error]);

  if (loading || (error instanceof ApiError && error.status === 401)) {
    return (
      <Container className="py-rds-6">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="mt-rds-6 h-64 w-full" />
      </Container>
    );
  }

  if (error || !me) {
    return (
      <Container className="py-rds-7">
        <ErrorPanel error={error} onRetry={reload} />
      </Container>
    );
  }

  return (
    <MeProvider me={me}>
      <AppBar />
      <main>
        <Container className="pt-rds-7 pb-rds-section-xl max-md:pt-rds-6">{children}</Container>
      </main>
    </MeProvider>
  );
}
