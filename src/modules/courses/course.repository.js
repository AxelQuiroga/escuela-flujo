export const courseRepository = (CourseModel) => {

  return {

  findAll: async ({ page, limit }) => {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      CourseModel.find()
        .populate("profesor", "name email")
        .populate("alumnos", "name email")
        .skip(skip).limit(limit),
      CourseModel.countDocuments()
    ]);
    return { data, total };
  },

  findById: async (id) => {
    return await CourseModel.findById(id)
      .populate("profesor", "name email")
      .populate("alumnos", "name email");
  },

  findByProfesor: async (profesorId, { page, limit } = {}) => {
    // Sin paginación: devuelve array plano (usado internamente por otros services)
    if (!page) {
      return await CourseModel.find({ profesor: profesorId })
        .populate("alumnos", "name email");
    }

    const skip = (page - 1) * limit;
    const query = { profesor: profesorId };
    const [data, total] = await Promise.all([
      CourseModel.find(query)
        .populate("alumnos", "name email")
        .skip(skip).limit(limit),
      CourseModel.countDocuments(query)
    ]);
    return { data, total };
  },

  findByAlumno: async (alumnoId, { page, limit } = {}) => {
    if (!page) {
      return await CourseModel.find({ alumnos: alumnoId })
        .populate("profesor", "name email")
        .populate("alumnos", "name email");
    }

    const skip = (page - 1) * limit;
    const query = { alumnos: alumnoId };
    const [data, total] = await Promise.all([
      CourseModel.find(query)
        .populate("profesor", "name email")
        .populate("alumnos", "name email")
        .skip(skip).limit(limit),
      CourseModel.countDocuments(query)
    ]);
    return { data, total };
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
