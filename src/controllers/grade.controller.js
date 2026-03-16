import { gradeService } from "../services/grade.service.js";

export const getGrades = async (req, res, next) => {
  try {

    const grades = await gradeService.getAllGrades();

    res.status(200).json(grades);

  } catch (error) {
    next(error);
  }
};

export const getGrade = async (req, res, next) => {
  try {

    const grade = await gradeService.getGradeById(req.params.id);

    res.status(200).json(grade);

  } catch (error) {
    next(error);
  }
};

export const getGradesByAlumno = async (req, res, next) => {
  try {

    const grades = await gradeService.getGradesByAlumno(req.params.alumnoId);

    res.status(200).json(grades);

  } catch (error) {
    next(error);
  }
};

export const createGrade = async (req, res, next) => {
  try {

    const grade = await gradeService.createGrade(req.body);

    res.status(201).json(grade);

  } catch (error) {
    next(error);
  }
};

export const updateGrade = async (req, res, next) => {
  try {

    const grade = await gradeService.updateGrade(req.params.id, req.body);

    res.status(200).json(grade);

  } catch (error) {
    next(error);
  }
};

export const deleteGrade = async (req, res, next) => {
  try {

    await gradeService.deleteGrade(req.params.id);

    res.status(204).send();

  } catch (error) {
    next(error);
  }
};