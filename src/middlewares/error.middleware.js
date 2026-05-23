// error.middleware.js
export const errorHandler = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }

  if (err.message === "Credenciales inválidas") {
    return res.status(401).json({ message: err.message });
  }
  
  res.status(err.status || err.statusCode || 500).json({
    message: err.message || "Error interno del servidor"
  });
};