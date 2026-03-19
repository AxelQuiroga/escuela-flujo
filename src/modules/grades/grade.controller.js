import { gradeService } from "./grade.service.js";

const isProfesorOwner = (course, userId) =>
  course.profesor.toString() === userId;

const isAlumnoOwner = (alumnoId, userId) =>
  alumnoId.toString() === userId;

export const getGrades = async (req, res, next) => {
  try {
    const { role, id } = req.user;

    let grades;

    if (role === "DIRECTOR") {
      grades = await gradeService.getAllGrades();
    } else {
      // PROFESOR → solo sus cursos
      grades = await gradeService.getGradesByProfesor(id);
    }

    res.status(200).json(grades);
  } catch (error) {
    next(error);
  }
};


export const getGradesByAlumno = async (req, res, next) => {
  try {
    const { role, id } = req.user;
    const { alumnoId } = req.params;

    // 👨‍🎓 solo puede ver lo suyo
    if (role === "ALUMNO" && alumnoId !== id) {
      return res.status(403).json({ message: "No autorizado" });
    }

    const grades = await gradeService.getGradesByAlumno(alumnoId);

    res.status(200).json(grades);

  } catch (error) {
    next(error);
  }
};

export const getGrade = async (req, res, next) => {
  try {
    const { role, id } = req.user;

    const grade = await gradeService.getGradeById(req.params.id);

    if (!grade) {
      return res.status(404).json({ message: "Nota no encontrada" });
    }

    // 👑
    if (role === "DIRECTOR") {
      return res.json(grade);
    }

    // 👨‍🎓
    if (role === "ALUMNO" && grade.alumno.toString() === id) {
      return res.json(grade);
    }

    // 👨‍🏫 → validar curso
    if (
      role === "PROFESOR" &&
      grade.curso.profesor.toString() === id
    ) {
      return res.json(grade);
    }

    return res.status(403).json({ message: "No autorizado" });

  } catch (error) {
    next(error);
  }
};

export const createGrade = async (req, res, next) => {
  try {
    const { id } = req.user;

    const course = await courseService.getCourseById(req.body.curso);

    if (!course) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    if (course.profesor.toString() !== id) {
      return res.status(403).json({ message: "No autorizado" });
    }

    const grade = await gradeService.createGrade(req.body);

    res.status(201).json(grade);

  } catch (error) {
    next(error);
  }
};

export const updateGrade = async (req, res, next) => {
  try {
    const { id } = req.user;

    const grade = await gradeService.getGradeById(req.params.id);

    if (!grade) {
      return res.status(404).json({ message: "Nota no encontrada" });
    }

    if (grade.curso.profesor.toString() !== id) {
      return res.status(403).json({ message: "No autorizado" });
    }

    const updated = await gradeService.updateGrade(req.params.id, req.body);

    res.status(200).json(updated);

  } catch (error) {
    next(error);
  }
};

export const deleteGrade = async (req, res, next) => {
  try {
    const { id } = req.user;

    const grade = await gradeService.getGradeById(req.params.id);

    if (!grade) {
      return res.status(404).json({ message: "Nota no encontrada" });
    }

    // ⚠️ asegurate que curso esté poblado o manejarlo en service
    if (grade.curso.profesor.toString() !== id) {
      return res.status(403).json({ message: "No autorizado" });
    }

    await gradeService.deleteGrade(req.params.id);

    res.status(204).send();

  } catch (error) {
    next(error);
  }
};