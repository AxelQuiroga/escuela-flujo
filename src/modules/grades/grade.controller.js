import { ForbiddenError, ValidationError } from "../../errors/domain.errors.js";
import { parsePagination, buildPaginatedResponse } from "../../utils/pagination.js";

const getUserId = (userObjOrId) => {
  if (!userObjOrId) return "";
  return userObjOrId._id ? userObjOrId._id.toString() : userObjOrId.toString();
};

export const createGradeController = (gradeService, courseService) => {
  return {
    getGrades: async (req, res, next) => {
      try {
        const { role, id } = req.user;
        const pagination = parsePagination(req.query);

        let result;

        if (role === "DIRECTOR") {
          result = await gradeService.getAllGrades(pagination);
        } else {
          // PROFESOR
          result = await gradeService.getGradesByProfesor(id, pagination);
        }

        res.status(200).json(buildPaginatedResponse(result.data, result.total, pagination));
      } catch (error) {
        next(error);
      }
    },

    getGradesByAlumno: async (req, res, next) => {
      try {
        const { role, id } = req.user;
        const { alumnoId } = req.params;

        if (role === "ALUMNO" && alumnoId !== id) {
          throw new ForbiddenError("FORBIDDEN", "No autorizado");
        }

        const grades = await gradeService.getGradesByAlumno(alumnoId);
        res.status(200).json(grades);
      } catch (error) {
        next(error);
      }
    },

    getBoletinByAlumno: async (req, res, next) => {
      try {
        const { role, id } = req.user;
        const { alumnoId } = req.params;

        if (role === "ALUMNO" && alumnoId !== id) {
          throw new ForbiddenError("FORBIDDEN", "No autorizado");
        }

        const boletin = await gradeService.getBoletinByAlumno(alumnoId);
        res.status(200).json(boletin);
      } catch (error) {
        next(error);
      }
    },

    getGrade: async (req, res, next) => {
      try {
        const { role, id } = req.user;
        const grade = await gradeService.getGradeById(req.params.id);

        if (role === "DIRECTOR") {
          return res.status(200).json(grade);
        }

        if (role === "ALUMNO" && getUserId(grade.alumno) === id) {
          return res.status(200).json(grade);
        }

        if (role === "PROFESOR" && getUserId(grade.curso.profesor) === id) {
          return res.status(200).json(grade);
        }

        throw new ForbiddenError("FORBIDDEN", "No autorizado");
      } catch (error) {
        next(error);
      }
    },

    createGrade: async (req, res, next) => {
      try {
        const { id } = req.user;

        if (!req.body.curso) {
          throw new ValidationError("COURSE_REQUIRED", "El curso es requerido");
        }

        // Verificar que el profesor es dueño del curso
        const course = await courseService.getCourseById(req.body.curso);

        if (getUserId(course.profesor) !== id) {
          throw new ForbiddenError("FORBIDDEN", "No autorizado");
        }

        // La validación de alumno inscripto se hace en gradeService.createGrade
        const grade = await gradeService.createGrade(req.body, id);
        res.status(201).json(grade);
      } catch (error) {
        next(error);
      }
    },

    updateGrade: async (req, res, next) => {
      try {
        const { id } = req.user;
        const grade = await gradeService.getGradeById(req.params.id);

        if (getUserId(grade.curso.profesor) !== id) {
          throw new ForbiddenError("FORBIDDEN", "No autorizado");
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

        if (getUserId(grade.curso.profesor) !== id) {
          throw new ForbiddenError("FORBIDDEN", "No autorizado");
        }

        await gradeService.deleteGrade(req.params.id);
        res.status(200).send();
      } catch (error) {
        next(error);
      }
    }
  };
};

