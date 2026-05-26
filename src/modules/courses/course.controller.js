import { ForbiddenError } from "../../errors/domain.errors.js";

// helpers
const getUserId = (userObjOrId) => {
  if (!userObjOrId) return "";
  return userObjOrId._id ? userObjOrId._id.toString() : userObjOrId.toString();
};

const isProfesorOwner = (course, userId) => getUserId(course.profesor) === userId;

const isAlumnoInCourse = (course, userId) =>
  course.alumnos.some((al) => getUserId(al) === userId);

export const courseController = (courseService) => {
  return {
    getCourses: async (req, res, next) => {
      try {
        const courses = await courseService.getCoursesForUser(req.user);
        res.status(200).json(courses);
      } catch (error) {
        next(error);
      }
    },

    getCourse: async (req, res, next) => {
      try {
        const { role, id } = req.user;
        const course = await courseService.getCourseById(req.params.id);

        const allowed =
          role === "DIRECTOR" ||
          (role === "PROFESOR" && isProfesorOwner(course, id)) ||
          (role === "ALUMNO" && isAlumnoInCourse(course, id));

        if (!allowed) {
          throw new ForbiddenError("FORBIDDEN", "No autorizado");
        }

        res.status(200).json(course);
      } catch (error) {
        next(error);
      }
    },

    createCourse: async (req, res, next) => {
      try {
        const { role, id } = req.user;

        // evitar manipulación desde frontend
        if (role === "PROFESOR") {
          req.body.profesor = id;
        }

        const course = await courseService.createCourse(req.body);
        res.status(201).json(course);
      } catch (error) {
        next(error);
      }
    },

    updateCourse: async (req, res, next) => {
      try {
        const { role, id } = req.user;
        const course = await courseService.getCourseById(req.params.id);

        if (role === "PROFESOR" && !isProfesorOwner(course, id)) {
          throw new ForbiddenError("FORBIDDEN", "No autorizado");
        }

        const updated = await courseService.updateCourse(req.params.id, req.body);
        res.status(200).json(updated);
      } catch (error) {
        next(error);
      }
    },

    deleteCourse: async (req, res, next) => {
      try {
        const { role, id } = req.user;
        const course = await courseService.getCourseById(req.params.id);

        if (role === "PROFESOR" && !isProfesorOwner(course, id)) {
          throw new ForbiddenError("FORBIDDEN", "No autorizado");
        }

        await courseService.deleteCourse(req.params.id);
        res.status(200).send();
      } catch (error) {
        next(error);
      }
    },

    addAlumno: async (req, res, next) => {
      try {
        const { role, id } = req.user;
        const course = await courseService.getCourseById(req.params.courseId);

        if (role === "PROFESOR" && !isProfesorOwner(course, id)) {
          throw new ForbiddenError("FORBIDDEN", "No autorizado");
        }

        const updated = await courseService.addAlumno(
          req.params.courseId,
          req.body.alumnoId
        );

        res.status(200).json(updated);
      } catch (error) {
        next(error);
      }
    },

    removeAlumno: async (req, res, next) => {
      try {
        const { role, id } = req.user;
        const course = await courseService.getCourseById(req.params.courseId);

        if (role === "PROFESOR" && !isProfesorOwner(course, id)) {
          throw new ForbiddenError("FORBIDDEN", "No autorizado");
        }

        const updated = await courseService.removeAlumno(
          req.params.courseId,
          req.params.alumnoId
        );

        res.status(200).json(updated);
      } catch (error) {
        next(error);
      }
    }
  };
};

