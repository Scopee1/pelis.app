import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";
import { sendError } from "../lib/http-error.js";
import { UserRole } from "../types/auth.types.js";

export async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });

    if (!session) {
      sendError(res, 401, "Sesion requerida");
      return;
    }

    req.user = session.user;
    next();
  } catch (error) {
    console.error("[auth] error reading session:", error);
    sendError(res, 500, "No se pudo verificar la sesion");
  }
}

// Siempre despues de authMiddleware: asume que req.user ya esta seteado.
export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 401, "Sesion requerida");
      return;
    }

    if (!allowedRoles.includes(req.user.role as UserRole)) {
      sendError(res, 403, "No tenes permisos para realizar esta accion");
      return;
    }

    next();
  };
}
