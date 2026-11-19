import "dotenv/config";
import mongoose from "mongoose";
import { auth, closeAuthClient } from "../src/lib/auth.js";
import { connectMongoDB, disconnectMongoDB } from "../src/config/db.js";
import { requireEnv } from "../src/lib/require-env.js";
import Movie from "../src/models/Movie.js";
import type { UserRole } from "../src/types/auth.types.js";
import { SAMPLE_MOVIES } from "./sample-movies.js";

interface SeedUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

const seedUsers: SeedUser[] = [
  {
    name: "Admin Pelis",
    email: requireEnv("SEED_ADMIN_EMAIL"),
    password: requireEnv("SEED_ADMIN_PASSWORD"),
    role: "admin",
  },
  {
    name: "Usuario Pelis",
    email: requireEnv("SEED_USER_EMAIL"),
    password: requireEnv("SEED_USER_PASSWORD"),
    role: "user",
  },
];

function usersCollection() {
  return mongoose.connection.collection("user");
}

// Si el usuario ya existe, le pisa la contraseña con la del .env: asi el README y la base no se desincronizan.
async function resetPassword(userId: string, password: string): Promise<void> {
  const context = await auth.$context;
  await context.internalAdapter.updatePassword(userId, await context.password.hash(password));
}

async function ensureUser({ name, email, password, role }: SeedUser): Promise<void> {
  const existing = await usersCollection().findOne({ email });
  if (existing) {
    await resetPassword(existing._id.toString(), password);
    console.log(`[seed] ${email} already existed, password updated`);
  } else {
    await auth.api.signUpEmail({ body: { name, email, password } });
    console.log(`[seed] created ${email}`);
  }
  await usersCollection().updateOne({ email }, { $set: { role } });
  console.log(`[seed] ${email} -> role ${role}`);
}

async function ensureSampleMovies(): Promise<void> {
  if ((await Movie.countDocuments()) > 0) {
    console.log("[seed] movies already present, skipping");
    return;
  }
  await Movie.insertMany(SAMPLE_MOVIES);
  console.log(`[seed] inserted ${SAMPLE_MOVIES.length} movies`);
}

async function seed(): Promise<void> {
  await connectMongoDB();
  for (const user of seedUsers) await ensureUser(user);
  await ensureSampleMovies();
}

seed()
  .catch((error: unknown) => {
    console.error("[seed] failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectMongoDB();
    await closeAuthClient();
  });
