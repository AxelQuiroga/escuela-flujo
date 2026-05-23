export const courseRepository = (CourseModel) => {

  return {

  findAll: async () => {
    return await CourseModel.find()
      .populate("profesor", "name email")
      .populate("alumnos", "name email");
  },

  findById: async (id) => {
    return await CourseModel.findById(id)
      .populate("profesor", "name email")
      .populate("alumnos", "name email");
  },

  findByProfesor: async (profesorId) => {
    return await CourseModel.find({ profesor: profesorId })
      .populate("alumnos", "name email");
  },

  create: async (data) => {
    return await CourseModel.create(data);
  },

  update: async (id, data) => {
    return await CourseModel.findByIdAndUpdate(id, data, {
       returnDocument: 'after',
      runValidators: true
    });
  },

  delete: async (id) => {
    return await CourseModel.findByIdAndDelete(id);
  },

  addAlumno: async (courseId, alumnoId) => {
    // Concurrencia: asegurar cupo máximo a nivel DB.
    // Solo agrega si:
    // - el alumno NO estaba ya en el array (evita duplicados)
    // - la cantidad de alumnos actual es menor al cupoMaximo
    return await CourseModel.findOneAndUpdate(
      {
        _id: courseId,
        alumnos: { $ne: alumnoId },
        $expr: { $lt: [{ $size: "$alumnos" }, "$cupoMaximo"] }
      },
      { $addToSet: { alumnos: alumnoId } },
      { returnDocument: "after" }
    );
  },

  removeAlumno: async (courseId, alumnoId) => {
    return await CourseModel.findByIdAndUpdate(
      courseId,
      { $pull: { alumnos: alumnoId } },
      {  returnDocument: 'after'}
    );
  }

}
};
