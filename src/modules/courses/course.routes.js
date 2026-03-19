import { Router } from "express";
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  addAlumno,
  removeAlumno
} from "./course.controller.js";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

const router = Router();

// 👑 DIRECTOR y PROFESOR pueden ver cursos
router.get(
  "/",
  authMiddleware,
  roleMiddleware("DIRECTOR", "PROFESOR"),
  getCourses
);

// 👑 DIRECTOR, PROFESOR, ALUMNO pueden ver (filtrado en controller)
router.get(
  "/:id",
  authMiddleware,
  getCourse
);

// 👑 DIRECTOR o PROFESOR crean
router.post(
  "/",
  authMiddleware,
  roleMiddleware("DIRECTOR", "PROFESOR"),
  createCourse
);

// 👑 DIRECTOR o PROFESOR (pero validamos ownership)
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("DIRECTOR", "PROFESOR"),
  updateCourse
);

// 👑 SOLO DIRECTOR elimina
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("DIRECTOR"),
  deleteCourse
);

// 👨‍🏫 agregar alumno (profesor del curso)
router.post(
  "/:courseId/alumnos",
  authMiddleware,
  roleMiddleware("DIRECTOR", "PROFESOR"),
  addAlumno
);

// 👨‍🏫 remover alumno
router.delete(
  "/:courseId/alumnos/:alumnoId",
  authMiddleware,
  roleMiddleware("DIRECTOR", "PROFESOR"),
  removeAlumno
);

export default router;