import { Router } from "express";
import {
  getGrades,
  getGrade,
  getGradesByAlumno,
  createGrade,
  updateGrade,
  deleteGrade
} from "./grade.controller.js";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

const router = Router();

// 👑 DIRECTOR y PROFESOR
router.get("/", authMiddleware, roleMiddleware("DIRECTOR", "PROFESOR"), getGrades);

// 👨‍🎓 ver sus notas
router.get("/alumno/:alumnoId", authMiddleware, getGradesByAlumno);

// 👑 + 👨‍🏫 + 👨‍🎓 (validación interna)
router.get("/:id", authMiddleware, getGrade);

// 👨‍🏫 crear
router.post("/", authMiddleware, roleMiddleware("PROFESOR"), createGrade);

// 👨‍🏫 editar
router.put("/:id", authMiddleware, roleMiddleware("PROFESOR"), updateGrade);

// 👨‍🏫 eliminar (opcional)
router.delete("/:id", authMiddleware, roleMiddleware("PROFESOR"), deleteGrade);

export default router;