import { Router } from "express";

export const createCourseRouter = ({
  controller,
  authMiddleware,
  roleMiddleware
}) => {
  const router = Router();

// 👑 DIRECTOR, PROFESOR y ALUMNO pueden listar cursos (filtrado real se hace en service)
router.get(
  "/",
  authMiddleware,
  roleMiddleware("DIRECTOR", "PROFESOR", "ALUMNO"),
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

  return router;
};
