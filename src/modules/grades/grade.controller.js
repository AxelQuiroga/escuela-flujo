const getUserId = (userObjOrId) => {
  if (!userObjOrId) return "";
  return userObjOrId._id ? userObjOrId._id.toString() : userObjOrId.toString();
};

export const createGradeController = (gradeService, courseService) => {

  return {
    getGrades: async (req, res, next) => {
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
    },


    getGradesByAlumno: async (req, res, next) => {
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
    },

    getGrade: async (req, res, next) => {
      try {
        const { role, id } = req.user;

        const grade = await gradeService.getGradeById(req.params.id);

        if (!grade) {
          return res.status(404).json({ message: "Nota no encontrada" });
        }

        // 👑 Director
        if (role === "DIRECTOR") {
          return res.json(grade);
        }

        // 👨‍🎓 Alumno
        if (role === "ALUMNO" && getUserId(grade.alumno) === id) {
          return res.json(grade);
        }

        // 👨‍🏫 Profesor → validar curso
        if (
          role === "PROFESOR" &&
          getUserId(grade.curso.profesor) === id
        ) {
          return res.json(grade);
        }

        return res.status(403).json({ message: "No autorizado" });

      } catch (error) {
        next(error);
      }
    },

    createGrade: async (req, res, next) => {
      try {
        const { id } = req.user;

        if (!req.body.curso) {
          return res.status(400).json({ message: "El curso es requerido" });
        }

        const course = await courseService.getCourseById(req.body.curso);

        if (!course) {
          return res.status(404).json({ message: "Curso no encontrado" });
        }

        if (getUserId(course.profesor) !== id) {
          return res.status(403).json({ message: "No autorizado" });
        }

        const grade = await gradeService.createGrade(req.body);

        res.status(201).json(grade);

      } catch (error) {
        next(error);
      }
    },

    updateGrade: async (req, res, next) => {
      try {
        const { id } = req.user;

        const grade = await gradeService.getGradeById(req.params.id);

        if (!grade) {
          return res.status(404).json({ message: "Nota no encontrada" });
        }

        if (getUserId(grade.curso.profesor) !== id) {
          return res.status(403).json({ message: "No autorizado" });
        }

        const updated = await gradeService.updateGrade(req.params.id, req.body);

        res.status(200).json(updated);

      } catch (error) {
        next(error);
      }
    },

    deleteGrade: async (req, res, next) => {
      try {
        const { id } = req.user;

        const grade = await gradeService.getGradeById(req.params.id);

        if (!grade) {
          return res.status(404).json({ message: "Nota no encontrada" });
        }

        if (getUserId(grade.curso.profesor) !== id) {
          return res.status(403).json({ message: "No autorizado" });
        }

        await gradeService.deleteGrade(req.params.id);

        res.status(200).send();

      } catch (error) {
        next(error);
      }
    },
  }
}
