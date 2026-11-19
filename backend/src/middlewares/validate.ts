import { Request, Response, NextFunction } from "express";
import { z, ZodError, ZodType } from "zod";
import { sendError } from "../lib/http-error.js";

function sendValidationError(res: Response, fallbackMessage: string, error: ZodError): void {
  const { formErrors, fieldErrors } = z.flattenError(error);
  const message = formErrors.length > 0 ? formErrors.join(". ") : fallbackMessage;
  sendError(res, 400, message, fieldErrors);
}

export function validateBody(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body ?? {});

    if (!result.success) {
      sendValidationError(res, "Los datos enviados no son validos", result.error);
      return;
    }

    req.body = result.data;
    next();
  };
}

// En Express 5 req.query es de solo lectura: el resultado parseado va a res.locals.query.
export function validateQuery(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      sendValidationError(res, "Los filtros enviados no son validos", result.error);
      return;
    }

    res.locals.query = result.data;
    next();
  };
}
