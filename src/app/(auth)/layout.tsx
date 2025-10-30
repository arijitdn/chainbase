import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthLayout } from "@/features/auth/components/auth-layout";

export const metadata: Metadata = {
  title: "Chainbase - Get Started",
  description: "Get started with Chainbase",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
