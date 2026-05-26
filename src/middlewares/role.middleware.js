import { ForbiddenError } from "../errors/domain.errors.js";

const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError("FORBIDDEN", "No autorizado"));
    }
    next();
  };
};

export default roleMiddleware;
