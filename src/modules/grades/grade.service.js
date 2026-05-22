export const gradeService = (gradeRepository) => {

  return {
    getAllGrades: async () => {
      return await gradeRepository.findAll()
    },

    getGradeById: async (id) => {
      return await gradeRepository.findById(id)
    },

    getGradesByAlumno: async (alumnoId) => {
      return await gradeRepository.findByAlumno(alumnoId)
    },

    getGradesByProfesor: async (profesorId) => {
      return await gradeRepository.findByProfesor(profesorId)
    },

    createGrade: async (data) => {
      return await gradeRepository.create(data);
    },

    updateGrade: async (id, data) => {
      return await gradeRepository.update(id, data);
    },

    deleteGrade: async (id) => {
      return await gradeRepository.delete(id);
    }

  }
}