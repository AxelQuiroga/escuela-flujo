import {
  ConflictError,
  NotFoundError,
  ValidationError
} from "../../errors/domain.errors.js";

export const courseService = (courseRepository, gradeRepository) => {
  return {
    // Queries
    getAllCourses: async (pagination) => {
      return await courseRepository.findAll(pagination);
    },

    getCourseById: async (id) => {
      const course = await courseRepository.findById(id);
      if (!course) {
        throw new NotFoundError("COURSE_NOT_FOUND", "Course not found", { id });
      }
      return course;
    },

    getCoursesByProfesor: async (profesorId) => {
      return await courseRepository.findByProfesor(profesorId);
    },

    getCoursesByAlumno: async (alumnoId) => {
      return await courseRepository.findByAlumno(alumnoId);
    },

    /**
     * Caso de uso: listado de cursos según el usuario autenticado.
     * - DIRECTOR: todos
     * - PROFESOR: sus cursos
     * - ALUMNO: cursos donde está inscripto
     */
    getCoursesForUser: async ({ role, id }, pagination) => {
      if (role === "DIRECTOR") return await courseRepository.findAll(pagination);
      if (role === "PROFESOR") return await courseRepository.findByProfesor(id, pagination);
      return await courseRepository.findByAlumno(id, pagination);
    },

    // Commands
    createCourse: async (data) => {
      return await courseRepository.create(data);
    },

    updateCourse: async (id, data) => {
      const course = await courseRepository.update(id, data);
      if (!course) {
        throw new NotFoundError("COURSE_NOT_FOUND", "Course not found", { id });
      }
      return course;
    },

    deleteCourse: async (id) => {
      const course = await courseRepository.delete(id);
      if (!course) {
        throw new NotFoundError("COURSE_NOT_FOUND", "Course not found", { id });
      }
      return course;
    },

    addAlumno: async (courseId, alumnoId) => {
      const course = await courseRepository.findById(courseId);

      if (!course) {
        throw new NotFoundError("COURSE_NOT_FOUND", "Course not found", {
          id: courseId
        });
      }

      const yaInscripto = course.alumnos.some(
        (al) => al._id.toString() === alumnoId.toString()
      );
      if (yaInscripto) {
        throw new ConflictError(
          "ALUMNO_ALREADY_ENROLLED",
          "El alumno ya está inscrito en este curso",
          { courseId, alumnoId }
        );
      }

      // Validar prerequisito (best-effort; cupo es fuerte en DB)
      if (course.prerequisito) {
        const notasEnPrerequisito = await gradeRepository.findByAlumnoAndCurso(
          alumnoId,
          course.prerequisito
        );

        const aprobo = notasEnPrerequisito.some((n) => n.nota >= 6);

        if (!aprobo) {
          throw new ValidationError(
            "PREREQUISITE_NOT_PASSED",
            "El alumno no aprobó el curso prerequisito requerido",
            { courseId, alumnoId, prerequisito: course.prerequisito.toString() }
          );
        }
      }

      // Concurrencia: cupo garantizado con update atómico en repositorio
      const updated = await courseRepository.addAlumno(courseId, alumnoId);

      if (!updated) {
        // Puede fallar por cupo lleno o porque otro request inscribió al mismo alumno
        // entre nuestra lectura y el update atómico.
        const refreshed = await courseRepository.findById(courseId);
        const nowInscripto = refreshed?.alumnos?.some(
          (al) => al._id.toString() === alumnoId.toString()
        );

        if (nowInscripto) {
          throw new ConflictError(
            "ALUMNO_ALREADY_ENROLLED",
            "El alumno ya está inscrito en este curso",
            { courseId, alumnoId }
          );
        }

        throw new ConflictError(
          "COURSE_FULL",
          "El curso no tiene vacantes disponibles",
          { courseId, alumnoId }
        );
      }

      return updated;
    },

    removeAlumno: async (courseId, alumnoId) => {
      const course = await courseRepository.removeAlumno(courseId, alumnoId);

      if (!course) {
        throw new NotFoundError("COURSE_NOT_FOUND", "Course not found", {
          id: courseId
        });
      }

      return course;
    }
  };
};
