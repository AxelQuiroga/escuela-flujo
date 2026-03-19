import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    //  No hay token
    if (!authHeader) {
      return res.status(401).json({ message: "No autorizado (sin token)" });
    }

    // formato: "Bearer TOKEN"
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token inválido" });
    }

    // 🔐 verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // guardar usuario en request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};