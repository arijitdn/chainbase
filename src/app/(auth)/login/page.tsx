import { LoginForm } from "@/features/auth/components/login-form";
import { redirectIfAuthenticated } from "@/lib/auth-utils";

export default async function Page() {
  await redirectIfAuthenticated();

  return (
    <div>
      <LoginForm />
    </div>
  );
}
