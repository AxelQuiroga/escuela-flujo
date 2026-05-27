import { ForbiddenError, NotFoundError, ValidationError } from "../../errors/domain.errors.js";

export const gradeService = (gradeRepository, courseRepository) => {
  return {
    getAllGrades: async (pagination) => {
      return await gradeRepository.findAll(pagination);
    },

    getGradeById: async (id) => {
      const grade = await gradeRepository.findById(id);
      if (!grade) {
        throw new NotFoundError("GRADE_NOT_FOUND", "Nota no encontrada", { id });
      }
      return grade;
    },

    getGradesByAlumno: async (alumnoId) => {
      return await gradeRepository.findByAlumno(alumnoId);
    },

    getGradesByProfesor: async (profesorId, pagination) => {
      // 1. Obtenemos los cursos del profesor (usamos el repo de cursos)
      const cursos = await courseRepository.findByProfesor(profesorId);
      const cursoIds = cursos.map((c) => c._id);

      // 2. Si no tiene cursos, retornamos vacío enseguida para ahorrar viaje a BD
      if (cursoIds.length === 0) {
        return { data: [], total: 0 };
      }

      // 3. Obtenemos las notas de esos cursos, ya paginadas
      return await gradeRepository.findByCursos(cursoIds, pagination);
    },

    createGrade: async (data, professorId) => {
      // Regla de negocio: el alumno debe estar inscripto en el curso
      const course = await courseRepository.findById(data.curso);

      if (!course) {
        throw new NotFoundError("COURSE_NOT_FOUND", "Curso no encontrado", {
          id: data.curso
        });
      }

      // Regla de negocio: solo el profesor asignado al curso puede calificar
      if (course.profesor._id.toString() !== professorId.toString()) {
        throw new ForbiddenError(
          "FORBIDDEN_GRADE_ACTION",
          "Solo el profesor asignado al curso puede calificar",
          { cursoId: data.curso, profesorId }
        );
      }


      const alumnoEnCurso = course.alumnos.some(
        (al) => al._id.toString() === data.alumno.toString()
      );

      if (!alumnoEnCurso) {
        throw new ValidationError(
          "ALUMNO_NOT_IN_COURSE",
          "El alumno no pertenece a este curso",
          { curso: data.curso, alumno: data.alumno }
        );
      }

      return await gradeRepository.create(data);
    },

    updateGrade: async (id, data) => {
      const updated = await gradeRepository.update(id, data);
      if (!updated) {
        throw new NotFoundError("GRADE_NOT_FOUND", "Nota no encontrada", { id });
      }
      return updated;
    },

    deleteGrade: async (id) => {
      const deleted = await gradeRepository.delete(id);
      if (!deleted) {
        throw new NotFoundError("GRADE_NOT_FOUND", "Nota no encontrada", { id });
      }
      return deleted;
    },

    getBoletinByAlumno: async (alumnoId) => {
      const notas = await gradeRepository.findByAlumnoWithCurso(alumnoId);

      if (notas.length === 0) {
        return { boletin: [], promedioGeneral: 0 };
      }

      // Agrupar notas por curso (JS puro, sin aggregation pipeline)
      const porCurso = {};

      for (const nota of notas) {
        const cursoId = nota.curso._id.toString();

        if (!porCurso[cursoId]) {
          porCurso[cursoId] = {
            curso: nota.curso.name,
            division: nota.curso.division,
            notas: []
          };
        }

        porCurso[cursoId].notas.push(nota.nota);
      }

      // Calcular promedio y estado por cada curso
      const boletin = Object.values(porCurso).map(({ curso, division, notas }) => {
        if (notas.length === 0) {
          return {
            curso,
            division,
            notas: [],
            promedio: null,
            estado: "SIN CALIFICACIONES"
          };
        }

        const promedio = parseFloat(
          (notas.reduce((sum, n) => sum + n, 0) / notas.length).toFixed(2)
        );

        return {
          curso,
          division,
          notas,
          promedio,
          estado: promedio >= 6 ? "APROBADO" : "EN RIESGO"
        };
      });

      // Promedio general (solo de cursos con calificaciones)
      const conNotas = boletin.filter((b) => b.promedio !== null);
      const promedioGeneral = conNotas.length
        ? parseFloat(
            (
              conNotas.reduce((sum, b) => sum + b.promedio, 0) / conNotas.length
            ).toFixed(2)
          )
        : 0;

      return {
        alumno: notas[0].alumno,
        boletin,
        promedioGeneral
      };
    }
  };
};

