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
      <div className="space-y-6" aria-busy="true" aria-label="Loading">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="surface flex items-start gap-4 rounded-md px-4 py-4"
            >
              <span className="icon-well h-10 w-10" />
              <div className="min-w-0 flex-1">
                <div className="h-3 w-16 bg-primary/15" />
                <div className="mt-2 h-8 w-24 bg-primary/20" />
              </div>
            </div>
          ))}
        </div>
        <div className="surface h-44 rounded-md" />
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
