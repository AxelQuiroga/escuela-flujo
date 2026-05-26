import jwt from "jsonwebtoken";
import { AuthError } from "../errors/domain.errors.js";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(new AuthError("NO_TOKEN", "No autorizado (sin token)"));
    }

    // formato: "Bearer TOKEN"
    const token = authHeader.split(" ")[1];

    if (!token) {
      return next(new AuthError("INVALID_TOKEN", "Token inválido"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return next(new AuthError("INVALID_TOKEN", "Token inválido o expirado"));
  }
};

