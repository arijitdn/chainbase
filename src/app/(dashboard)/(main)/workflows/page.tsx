import { requireAuth } from "@/lib/auth-utils";

export default async function Page() {
  await requireAuth();

  return (
    <div>
      <p>Workflows</p>
    </div>
  );
}
