import { Router } from "express";

import { courseService } from "./course.service.js";
import { courseRepository } from "./course.repository.js"
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import { courseController } from "./course.controller.js"
import { Course } from "./course.model.js";

const courseModel = Course;
const service = courseService(courseRepository(courseModel));
const controller = courseController(service);

const router = Router();

// 👑 DIRECTOR y PROFESOR pueden ver cursos
router.get(
  "/",
  authMiddleware,
  roleMiddleware("DIRECTOR", "PROFESOR"),
  controller.getCourses
);

// 👑 DIRECTOR, PROFESOR, ALUMNO pueden ver (filtrado en controller)
router.get(
  "/:id",
  authMiddleware,
  controller.getCourse
);

// 👑 DIRECTOR o PROFESOR crean
router.post(
  "/",
  authMiddleware,
  roleMiddleware("DIRECTOR", "PROFESOR"),
  controller.createCourse
);

// 👑 DIRECTOR o PROFESOR (pero validamos ownership)
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("DIRECTOR", "PROFESOR"),
  controller.updateCourse
);

// 👑 SOLO DIRECTOR elimina
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("DIRECTOR"),
  controller.deleteCourse
);

// 👨‍🏫 agregar alumno (profesor del curso)
router.post(
  "/:courseId/alumnos",
  authMiddleware,
  roleMiddleware("DIRECTOR", "PROFESOR"),
  controller.addAlumno
);

// 👨‍🏫 remover alumno
router.delete(
  "/:courseId/alumnos/:alumnoId",
  authMiddleware,
  roleMiddleware("DIRECTOR", "PROFESOR"),
  controller.removeAlumno
);

export default router;