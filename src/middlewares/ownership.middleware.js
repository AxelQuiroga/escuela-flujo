// ownership.middleware.js

export const isOwnerOrRole = (...roles) => {
  return (req, res, next) => {
    const isOwner = req.user.id === req.params.id;
    const hasRole = roles.includes(req.user.role);

    if (!isOwner && !hasRole) {
      return res.status(403).json({ message: "No autorizado" });
    }

    next();
  };
};