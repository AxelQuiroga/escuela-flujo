

export const gradeRepository = (GradeModel) => {

  return {
    findAll: async () => {
      return await GradeModel.find()
        .populate("alumno", "name email")
        .populate("curso", "name division");
    },

    findById: async (id) => {
      return await GradeModel.findById(id)
        .populate("alumno", "name email")
        .populate("curso", "name division");
    },

    findByAlumno: async (alumnoId) => {
      return await GradeModel.find({ alumno: alumnoId })
        .populate("curso", "name division");
    },

    findByCurso: async (cursoId) => {
      return await GradeModel.find({ curso: cursoId })
        .populate("alumno", "name email");
    },

    findByProfesor: async (profesorId) => {
      return await GradeModel.find()
        .populate({
          path: "curso",
          match: { profesor: profesorId }
        })
        .populate("alumno")
        .then(grades => grades.filter(g => g.curso !== null));
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