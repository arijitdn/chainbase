import { SubscriptionTestButton } from "@/components/test-subscription-button";
import { requireAuth } from "@/lib/auth-utils";

export default async function Page() {
  await requireAuth();

  return (
    <div>
      <p>Workflows</p>
      <SubscriptionTestButton />
    </div>
  );
}
