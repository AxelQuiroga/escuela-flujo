import { Router } from "express";

export const createGradeRouter = ({
  controller,
  authMiddleware,
  roleMiddleware
}) => {
  const router = Router();

// 👑 DIRECTOR y PROFESOR
router.get("/", authMiddleware, roleMiddleware("DIRECTOR", "PROFESOR"), controller.getGrades);

// 📋 Boletín académico del alumno (ALUMNO ve el suyo, DIRECTOR ve cualquiera)
router.get("/alumno/:alumnoId/boletin", authMiddleware, controller.getBoletinByAlumno);

// 👨‍🎓 ver sus notas
router.get("/alumno/:alumnoId", authMiddleware, controller.getGradesByAlumno);

// 👑 + 👨‍🏫 + 👨‍🎓 (validación interna)
router.get("/:id", authMiddleware, controller.getGrade);

// 👨‍🏫 crear
router.post("/", authMiddleware, roleMiddleware("PROFESOR"), controller.createGrade);

// 👨‍🏫 editar
router.put("/:id", authMiddleware, roleMiddleware("PROFESOR"), controller.updateGrade);

// 👨‍🏫 eliminar (opcional)
router.delete("/:id", authMiddleware, roleMiddleware("PROFESOR"), controller.deleteGrade);

  return router;
};
