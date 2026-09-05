import type { ReactNode } from "react";
import { EmptyState } from "@/components/house/empty-state";
import { friendlyError } from "@/lib/copy";

export function LoadState({
  loading,
  error,
  children,
}: {
  loading: boolean;
  error: string | null;
  children: ReactNode;
}) {
  if (loading) {
    return (
      <div className="grid gap-6 py-10" aria-busy="true" aria-label="Loading">
        <div className="h-10 w-48 bg-primary/15" />
        <div className="h-24 w-full max-w-xl bg-primary/10" />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        title="This page could not load"
        body={friendlyError(error) ?? "Please try again in a moment."}
      />
    );
  }

  return <>{children}</>;
}
