import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";
import { requireEnv } from "./require-env.js";

// Better Auth usa el driver nativo; pasar `client` habilita transacciones (Atlas es replica set).
const client = new MongoClient(requireEnv("MONGODB_URI"));

// Google es opcional: si faltan sus variables el back arranca igual, solo sin ese proveedor.
function googleProvider() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    console.warn("[auth] GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET missing: Google sign-in disabled");
    return {};
  }
  return { google: { clientId, clientSecret, prompt: "select_account" as const } };
}

export const auth = betterAuth({
  // La URL del FRONT: /api llega al back a traves del proxy de Vite o del rewrite de Render.
  baseURL: requireEnv("BETTER_AUTH_URL"),
  database: mongodbAdapter(client.db(), { client }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: requireEnv("GITHUB_CLIENT_ID"),
      clientSecret: requireEnv("GITHUB_CLIENT_SECRET"),
    },
    ...googleProvider(),
  },
  // Si alguien ya tiene cuenta con email y entra con GitHub o Google (mismo email verificado),
  // se unen las cuentas en vez de tirar account_not_linked.
  account: {
    accountLinking: { trustedProviders: ["github", "google"] },
  },
  // admin(): agrega user.role ("user" por defecto) y los endpoints /api/auth/admin/*.
  plugins: [admin({ defaultRole: "user", adminRoles: ["admin"] })],
});

export async function closeAuthClient(): Promise<void> {
  await client.close();
}
