import { courseService } from "./course.service.js";

// helper 🔥
const isProfesorOwner = (course, userId) =>
  course.profesor.toString() === userId;

const isAlumnoInCourse = (course, userId) =>
  course.alumnos.some(al => al.toString() === userId);

// =======================

export const getCourses = async (req, res, next) => {
  try {
    const { role, id } = req.user;

    let courses;

    if (role === "DIRECTOR") {
      courses = await courseService.getAllCourses();
    } else if (role === "PROFESOR") {
      courses = await courseService.getCoursesByProfesor(id);
    } else {
      courses = await courseService.getCoursesByAlumno(id);
    }

    res.status(200).json(courses);
  } catch (error) {
    next(error);
  }
};

// =======================

export const getCourse = async (req, res, next) => {
  try {
    const { role, id } = req.user;
    const course = await courseService.getCourseById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    if (
      role === "DIRECTOR" ||
      (role === "PROFESOR" && isProfesorOwner(course, id)) ||
      (role === "ALUMNO" && isAlumnoInCourse(course, id))
    ) {
      return res.json(course);
    }

    return res.status(403).json({ message: "No autorizado" });

  } catch (error) {
    next(error);
  }
};

// =======================

export const createCourse = async (req, res, next) => {
  try {
    const { role, id } = req.user;

    // 🔐 evitar manipulación desde frontend
    if (role === "PROFESOR") {
      req.body.profesor = id;
    }

    const course = await courseService.createCourse(req.body);

    res.status(201).json(course);

  } catch (error) {
    next(error);
  }
};

// =======================

export const updateCourse = async (req, res, next) => {
  try {
    const { role, id } = req.user;

    const course = await courseService.getCourseById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    if (role === "PROFESOR" && !isProfesorOwner(course, id)) {
      return res.status(403).json({ message: "No autorizado" });
    }

    const updated = await courseService.updateCourse(req.params.id, req.body);

    res.status(200).json(updated);

  } catch (error) {
    next(error);
  }
};

// =======================

export const deleteCourse = async (req, res, next) => {
  try {
    const { role, id } = req.user;

    const course = await courseService.getCourseById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    // 🔥 ahora sí protegemos
    if (role === "PROFESOR" && !isProfesorOwner(course, id)) {
      return res.status(403).json({ message: "No autorizado" });
    }

    await courseService.deleteCourse(req.params.id);

    res.status(204).send();

  } catch (error) {
    next(error);
  }
};

// =======================

export const addAlumno = async (req, res, next) => {
  try {
    const { role, id } = req.user;

    const course = await courseService.getCourseById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    if (role === "PROFESOR" && !isProfesorOwner(course, id)) {
      return res.status(403).json({ message: "No autorizado" });
    }

    const updated = await courseService.addAlumno(
      req.params.courseId,
      req.body.alumnoId
    );

    res.status(200).json(updated);

  } catch (error) {
    next(error);
  }
};

// =======================

export const removeAlumno = async (req, res, next) => {
  try {
    const { role, id } = req.user;

    const course = await courseService.getCourseById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    if (role === "PROFESOR" && !isProfesorOwner(course, id)) {
      return res.status(403).json({ message: "No autorizado" });
    }

    const updated = await courseService.removeAlumno(
      req.params.courseId,
      req.params.alumnoId
    );

    res.status(200).json(updated);

  } catch (error) {
    next(error);
  }
};