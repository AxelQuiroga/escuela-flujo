export const gradeRepository = (GradeModel) => {

  return {
    findAll: async ({ page, limit }) => {
      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
        GradeModel.find()
          .populate("alumno", "name email")
          .populate("curso", "name division profesor")
          .skip(skip).limit(limit),
        GradeModel.countDocuments()
      ]);
      return { data, total };
    },

    findById: async (id) => {
      return await GradeModel.findById(id)
        .populate("alumno", "name email")
        .populate("curso", "name division profesor");
    },

    findByAlumno: async (alumnoId) => {
      return await GradeModel.find({ alumno: alumnoId })
        .populate("curso", "name division");
    },

    findByAlumnoWithCurso: async (alumnoId) => {
      return await GradeModel.find({ alumno: alumnoId })
        .populate("alumno", "name email")
        .populate("curso", "name division");
    },

    findByAlumnoAndCurso: async (alumnoId, cursoId) => {
      return await GradeModel.find({ alumno: alumnoId, curso: cursoId });
    },

    findByCurso: async (cursoId) => {
      return await GradeModel.find({ curso: cursoId })
        .populate("alumno", "name email");
    },

    findByCursos: async (cursoIds, { page, limit }) => {
      const skip = (page - 1) * limit;
      const query = { curso: { $in: cursoIds } };

      const [data, total] = await Promise.all([
        GradeModel.find(query)
          .populate("alumno", "name email")
          .populate("curso", "name division")
          .skip(skip)
          .limit(limit),
        GradeModel.countDocuments(query)
      ]);

      return { data, total };
    },

    create: async (data) => {
      return await GradeModel.create(data);
    },

    update: async (id, data) => {
      return await GradeModel.findByIdAndUpdate(id, data, { returnDocument: "after" });
    },

    delete: async (id) => {
      return await GradeModel.findByIdAndDelete(id);
    }

  }
}