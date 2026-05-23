import { Router } from "express";
import { Grade } from "./grade.model.js";
import { gradeService } from "./grade.service.js";
import { gradeRepository } from "./grade.repository.js"
import { createGradeController } from "./grade.controller.js";
import { Course } from "../courses/course.model.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

import { courseRepository } from "../courses/course.repository.js";
import { courseService } from "../courses/course.service.js"

const repoDeCursos = courseRepository(Course);
const repoDeNotas = gradeRepository(Grade);
const servicioDeNotas = gradeService(repoDeNotas, repoDeCursos);
const servicioDeCursos = courseService(repoDeCursos, repoDeNotas);
const controller = createGradeController(servicioDeNotas, servicioDeCursos);

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

export default router;