import { Router } from "express";
import {
  getGrades,
  getGrade,
  getGradesByAlumno,
  createGrade,
  updateGrade,
  deleteGrade
} from "../controllers/grade.controller.js";

const router = Router();

router.get("/", getGrades);
router.get("/:id", getGrade);

router.get("/alumno/:alumnoId", getGradesByAlumno);

router.post("/", createGrade);

router.put("/:id", updateGrade);

router.delete("/:id", deleteGrade);

export default router;