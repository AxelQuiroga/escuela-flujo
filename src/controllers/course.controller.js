import { courseService } from "../services/course.service.js";

export const getCourses = async (req, res, next) => {
  try {

    const courses = await courseService.getAllCourses();

    res.status(200).json(courses);

  } catch (error) {
    next(error);
  }
};

export const getCourse = async (req, res, next) => {
  try {

    const course = await courseService.getCourseById(req.params.id);

    res.status(200).json(course);

  } catch (error) {
    next(error);
  }
};

export const createCourse = async (req, res, next) => {
  try {

    const course = await courseService.createCourse(req.body);

    res.status(201).json(course);

  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (req, res, next) => {
  try {

    const course = await courseService.updateCourse(req.params.id, req.body);

    res.status(200).json(course);

  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {

    await courseService.deleteCourse(req.params.id);

    res.status(204).send();

  } catch (error) {
    next(error);
  }
};

export const addAlumno = async (req, res, next) => {
  try {

    const course = await courseService.addAlumno(
      req.params.courseId,
      req.body.alumnoId
    );

    res.status(200).json(course);

  } catch (error) {
    next(error);
  }
};

export const removeAlumno = async (req, res, next) => {
  try {

    const course = await courseService.removeAlumno(
      req.params.courseId,
      req.params.alumnoId
    );

    res.status(200).json(course);

  } catch (error) {
    next(error);
  }
};