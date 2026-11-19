import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";
import { requireEnv } from "./require-env.js";

// Better Auth usa el driver nativo; pasar `client` habilita transacciones (Atlas es replica set).
const client = new MongoClient(requireEnv("MONGODB_URI"));

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
  },
  account: {
    accountLinking: { trustedProviders: ["github"] },
  },
  // admin(): agrega user.role ("user" por defecto) y los endpoints /api/auth/admin/*.
  plugins: [admin({ defaultRole: "user", adminRoles: ["admin"] })],
});

export async function closeAuthClient(): Promise<void> {
  await client.close();
}
