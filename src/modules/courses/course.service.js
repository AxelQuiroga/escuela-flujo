export const courseService = (courseRepository, gradeRepository) => {

  return {

    getAllCourses: async () => {
      return await courseRepository.findAll();
    },

    getCourseById: async (id) => {

      const course = await courseRepository.findById(id);

      if (!course) {
        const error = new Error("Course not found");
        error.status = 404;
        throw error;
      }

      return course;
    },

    getCoursesByProfesor: async (profesorId) => {
      return await courseRepository.findByProfesor(profesorId);
    },

    createCourse: async (data) => {
      return await courseRepository.create(data);
    },

    updateCourse: async (id, data) => {

      const course = await courseRepository.update(id, data);

      if (!course) {
        const error = new Error("Course not found");
        error.status = 404;
        throw error;
      }

      return course;
    },

    deleteCourse: async (id) => {

      const course = await courseRepository.delete(id);

      if (!course) {
        const error = new Error("Course not found");
        error.status = 404;
        throw error;
      }

      return course;
    },

    addAlumno: async (courseId, alumnoId) => {

      const course = await courseRepository.findById(courseId);

      if (!course) {
        const error = new Error("Course not found");
        error.status = 404;
        throw error;
      }

      const yaInscripto = course.alumnos.some(
        (al) => al._id.toString() === alumnoId.toString()
      );
      if (yaInscripto) {
        const error = new Error("El alumno ya está inscrito en este curso");
        error.status = 400;
        throw error;
      }
      // Concurrencia: NO validar cupo con course.alumnos.length acá.
      // Esto es vulnerable a race conditions. El cupo se garantiza en el update atómico del repositorio.

      // 📚 Validar prerequisito si el curso lo requiere
      if (course.prerequisito) {
        const notasEnPrerequisito = await gradeRepository.findByAlumnoAndCurso(
          alumnoId,
          course.prerequisito
        );

        const aprobo = notasEnPrerequisito.some((n) => n.nota >= 6);

        if (!aprobo) {
          const error = new Error(
            "El alumno no aprobó el curso prerequisito requerido"
          );
          error.status = 400;
          throw error;
        }
      }

      const updated = await courseRepository.addAlumno(courseId, alumnoId);

      // Si el update atómico no matcheó, asumimos cupo lleno bajo concurrencia.
      if (!updated) {
        const error = new Error("El curso no tiene vacantes disponibles");
        error.status = 400;
        throw error;
      }

      return updated;
    },

    removeAlumno: async (courseId, alumnoId) => {

      const course = await courseRepository.removeAlumno(courseId, alumnoId);

      if (!course) {
        const error = new Error("Course not found");
        error.status = 404;
        throw error;
      }

      return course;
    }

  };
}
