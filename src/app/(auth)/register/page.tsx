import { RegisterForm } from "@/features/auth/components/register-form";
import { redirectIfAuthenticated } from "@/lib/auth-utils";

export default async function Page() {
  await redirectIfAuthenticated();

  return (
    <div>
      <RegisterForm />
    </div>
  );
}
