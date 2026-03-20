import { Grade } from "./grade.model.js";

export const gradeService = {

  getAllGrades: async () => {
    return await Grade.find()
      .populate("alumno", "-password")
      .populate({
        path: "curso",
        populate: { path: "profesor", select: "-password" }
      });
  },

  getGradeById: async (id) => {
    return await Grade.findById(id)
      .populate("alumno", "-password")
      .populate({
        path: "curso",
        populate: { path: "profesor", select: "-password" }
      });
  },

  getGradesByAlumno: async (alumnoId) => {
    return await Grade.find({ alumno: alumnoId })
      .populate("curso");
  },

  //  CLAVE para profesor
  getGradesByProfesor: async (profesorId) => {
    return await Grade.find()
      .populate({
        path: "curso",
        match: { profesor: profesorId }
      })
      .populate("alumno")
      .then(grades => grades.filter(g => g.curso !== null));
  },

  createGrade: async (data) => {
    return await Grade.create(data);
  },

  updateGrade: async (id, data) => {
    return await Grade.findByIdAndUpdate(id, data, {
      returnDocument: 'after'
    });
  },

  deleteGrade: async (id) => {
    return await Grade.findByIdAndDelete(id);
  }

};