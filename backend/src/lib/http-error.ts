import { Response } from "express";

export function sendError(res: Response, status: number, message: string, details?: unknown): void {
  res.status(status).json({ success: false, error: details ? { message, details } : { message } });
}
