import type { ReactNode } from "react";
import { AppHeader } from "@/components/app-header";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <AppHeader />
      <main className="flex-1">{children}</main>
    </>
  );
}
