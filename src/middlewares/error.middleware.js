import {
  DomainError,
  NotFoundError,
  ConflictError,
  ValidationError,
  AuthError,
  ForbiddenError
} from "../errors/domain.errors.js";
import { logger } from "../utils/logger.js";

const toHttpStatus = (err) => {
  if (err instanceof NotFoundError) return 404;
  if (err instanceof ValidationError) return 400;
  if (err instanceof ConflictError) return 409;
  if (err instanceof AuthError) return 401;
  if (err instanceof ForbiddenError) return 403;
  return 500;
};

const domainPayload = (err) => ({
  error: {
    code: err.code,
    message: err.message,
    details: err.details
  }
});

export const errorHandler = (err, req, res, next) => {
  // 1) Domain errors (source of truth)
  if (err instanceof DomainError) {
    return res.status(toHttpStatus(err)).json(domainPayload(err));
  }

  // 2) Mongoose schema validation
  if (err?.name === "ValidationError") {
    return res.status(400).json({
      error: {
        code: "MONGOOSE_VALIDATION",
        message: err.message,
        details: Object.keys(err.errors || {})
      }
    });
  }

  // 3) Mongo unique constraint
  if (err?.name === "MongoServerError" && err?.code === 11000) {
    return res.status(409).json({
      error: {
        code: "DUPLICATE_KEY",
        message: "Duplicate key",
        details: err.keyValue
      }
    });
  }

  // 4) Fallback (unexpected errors)
  logger.error({ err }, "Unhandled Server Error");

  return res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: err?.message || "Error interno del servidor",
      details: undefined
    }
  });
};

