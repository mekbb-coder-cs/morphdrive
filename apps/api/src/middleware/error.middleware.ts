import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Validation failed",
      issues: err.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),
    });
  }

  const status = (err as { status?: number }).status || 500;
  const message = (err as Error).message || "Internal server error";

  console.error(`[Error] ${req.method} ${req.path} -> ${message}`, err);

  return res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === "development" ? { stack: (err as Error).stack } : {}),
  });
}
