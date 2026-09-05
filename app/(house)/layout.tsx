import { AppShell } from "@/components/house/app-shell";
import { LiveProvider } from "@/components/house/live-provider";

export default function HouseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LiveProvider>
      <AppShell>{children}</AppShell>
    </LiveProvider>
  );
}
