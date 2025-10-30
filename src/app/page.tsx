import { HomePage } from "@/features/HomePage";
import { requireAuth } from "@/lib/auth-utils";

export default async function Home() {
  await requireAuth();

  return <HomePage />;
}
