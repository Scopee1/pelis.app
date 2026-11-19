import axios from "axios";

// Ruta relativa: mismo origen que el front, el navegador manda la cookie de sesion solo.
// En local la resuelve el proxy de Vite; en Render, el rewrite /api/* del Static Site.
export const http = axios.create({ baseURL: "/api" });

export type FieldErrors = Record<string, string[] | undefined>;

export interface ApiError {
  status?: number;
  message: string;
  details?: FieldErrors;
}

interface ApiErrorBody {
  error?: string | { message?: string; details?: FieldErrors };
}

export function toApiError(err: unknown): ApiError {
  if (!axios.isAxiosError<ApiErrorBody>(err)) return { message: "Error desconocido" };

  const status = err.response?.status;
  const body = err.response?.data?.error;
  if (typeof body === "string") return { status, message: body };
  if (body?.message) return { status, message: body.message, details: body.details };
  if (!err.response) return { message: "No se pudo conectar con el servidor" };
  return { status, message: err.message };
}
