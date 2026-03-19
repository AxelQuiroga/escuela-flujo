import { Grade } from "./grade.model.js";

export const gradeRepository = {

  findAll: async () => {
    return await Grade.find()
      .populate("alumno", "name email")
      .populate("curso", "name division");
  },

  findById: async (id) => {
    return await Grade.findById(id)
      .populate("alumno", "name email")
      .populate("curso", "name division");
  },

  findByAlumno: async (alumnoId) => {
    return await Grade.find({ alumno: alumnoId })
      .populate("curso", "name division");
  },

  findByCurso: async (cursoId) => {
    return await Grade.find({ curso: cursoId })
      .populate("alumno", "name email");
  },

  create: async (data) => {
    return await Grade.create(data);
  },

  update: async (id, data) => {
    return await Grade.findByIdAndUpdate(id, data, { returnDocument: "after" });
  },

  delete: async (id) => {
    return await Grade.findByIdAndDelete(id);
  }

};