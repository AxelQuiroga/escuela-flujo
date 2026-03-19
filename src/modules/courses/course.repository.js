import { Course } from "./course.model.js";

export const courseRepository = {

  findAll: async () => {
    return await Course.find()
      .populate("profesor", "name email")
      .populate("alumnos", "name email");
  },

  findById: async (id) => {
    return await Course.findById(id)
      .populate("profesor", "name email")
      .populate("alumnos", "name email");
  },

  findByProfesor: async (profesorId) => {
    return await Course.find({ profesor: profesorId })
      .populate("alumnos", "name email");
  },

  create: async (data) => {
    return await Course.create(data);
  },

  update: async (id, data) => {
    return await Course.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });
  },

  delete: async (id) => {
    return await Course.findByIdAndDelete(id);
  },

  addAlumno: async (courseId, alumnoId) => {
    return await Course.findByIdAndUpdate(
      courseId,
      { $addToSet: { alumnos: alumnoId } },
      { new: true }
    );
  },

  removeAlumno: async (courseId, alumnoId) => {
    return await Course.findByIdAndUpdate(
      courseId,
      { $pull: { alumnos: alumnoId } },
      { new: true }
    );
  }

};