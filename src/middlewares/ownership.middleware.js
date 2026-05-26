// ownership.middleware.js

import { ForbiddenError } from "../errors/domain.errors.js";

export const isOwnerOrRole = (...roles) => {
  return (req, res, next) => {
    const isOwner = req.user.id === req.params.id;
    const hasRole = roles.includes(req.user.role);

    if (!isOwner && !hasRole) {
      return next(new ForbiddenError("FORBIDDEN", "No autorizado"));
    }

    next();
  };
};
