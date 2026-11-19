import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

// Sin baseURL: front y API comparten origen (proxy de Vite en local, rewrite de Render en produccion).
export const authClient = createAuthClient({
  plugins: [adminClient()],
});

export const { useSession, signIn, signUp, signOut } = authClient;
