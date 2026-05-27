export const userRepository = (UserModel) => {

  return {
    findAll: async ({ page, limit }) => {
      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
        UserModel.find().select("-password").skip(skip).limit(limit),
        UserModel.countDocuments()
      ]);
      return { data, total };
    },

    findById: async (id) => {
      return await UserModel.findById(id).select("-password");
    },

    findByEmail: async (email) => {
      // acá SÍ necesitamos el password (para login)
      return await UserModel.findOne({ email });
    },

    create: async (data) => {
      const user = await UserModel.create(data);

      // devolver sin password
      const { password, ...userWithoutPassword } = user.toObject();
      return userWithoutPassword;
    },

    update: async (id, data) => {
      const user = await UserModel.findByIdAndUpdate(id, data, {
         returnDocument: 'after'
      });

      if (!user) return null;

      const { password, ...userWithoutPassword } = user.toObject();
      return userWithoutPassword;
    },

    delete: async (id) => {
      return await UserModel.findByIdAndDelete(id);
    }
  }
};