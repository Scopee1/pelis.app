import "dotenv/config";
import "./lib/zod-locale.js";
import express, { NextFunction, Request, Response } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import apiRouter from "./routes/index.js";
import { connectMongoDB } from "./config/db.js";
import { sendError } from "./lib/http-error.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Sin CORS: el front llama a /api en su mismo origen (proxy de Vite / rewrite de Render).
// Better Auth va ANTES de express.json() porque lee el body crudo.
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", uptimeSeconds: process.uptime(), timestamp: new Date().toISOString() });
});

app.use("/api", apiRouter);

app.use("/api", (_req: Request, res: Response) => {
  sendError(res, 404, "Ruta no encontrada");
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof SyntaxError && "body" in error) {
    sendError(res, 400, "El body no es un JSON válido");
    return;
  }
  console.error("[server] unhandled error:", error);
  sendError(res, 500, "Error interno del servidor");
});

async function startServer(): Promise<void> {
  await connectMongoDB();
  app.listen(PORT, () => console.log(`[server] listening on port ${PORT}`));
}

startServer().catch((error: unknown) => {
  console.error("[server] failed to start:", error);
  process.exit(1);
});
