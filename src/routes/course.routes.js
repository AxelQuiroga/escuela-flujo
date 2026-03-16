import { Router } from "express";
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  addAlumno,
  removeAlumno
} from "../controllers/course.controller.js";

const router = Router();

router.get("/", getCourses);
router.get("/:id", getCourse);

router.post("/", createCourse);

router.put("/:id", updateCourse);

router.delete("/:id", deleteCourse);

router.post("/:courseId/alumnos", addAlumno);

router.delete("/:courseId/alumnos/:alumnoId", removeAlumno);

export default router;