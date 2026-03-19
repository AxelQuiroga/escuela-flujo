import { courseRepository } from "./course.repository.js";

export const courseService = {

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

    const course = await courseRepository.addAlumno(courseId, alumnoId);

    if (!course) {
      const error = new Error("Course not found");
      error.status = 404;
      throw error;
    }

    return course;
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