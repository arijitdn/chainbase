import { polarClient } from "@polar-sh/better-auth";
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  plugins: [polarClient()],
});
