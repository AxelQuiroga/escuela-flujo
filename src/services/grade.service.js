import { gradeRepository } from "../repository/grade.repository.js";

export const gradeService = {

  getAllGrades: async () => {
    return await gradeRepository.findAll();
  },

  getGradeById: async (id) => {

    const grade = await gradeRepository.findById(id);

    if (!grade) {
      const error = new Error("Grade not found");
      error.status = 404;
      throw error;
    }

    return grade;
  },

  getGradesByAlumno: async (alumnoId) => {
    return await gradeRepository.findByAlumno(alumnoId);
  },

  getGradesByCurso: async (cursoId) => {
    return await gradeRepository.findByCurso(cursoId);
  },

  createGrade: async (data) => {
    return await gradeRepository.create(data);
  },

  updateGrade: async (id, data) => {

    const grade = await gradeRepository.update(id, data);

    if (!grade) {
      const error = new Error("Grade not found");
      error.status = 404;
      throw error;
    }

    return grade;
  },

  deleteGrade: async (id) => {

    const grade = await gradeRepository.delete(id);

    if (!grade) {
      const error = new Error("Grade not found");
      error.status = 404;
      throw error;
    }

    return grade;
  }

};