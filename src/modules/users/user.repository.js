import { User } from "./user.model.js"; 

export const userRepository = {

  findAll: async () => {
    return await User.find().select("-password");
  },

  findById: async (id) => {
    return await User.findById(id).select("-password");
  },

  findByEmail: async (email) => {
    // acá SÍ necesitamos el password (para login)
    return await User.findOne({ email });
  },

  create: async (data) => {
    const user = await User.create(data);

    // devolver sin password
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  },

  update: async (id, data) => {
    const user = await User.findByIdAndUpdate(id, data, {
      new: true
    });

    if (!user) return null;

    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  },

  delete: async (id) => {
    return await User.findByIdAndDelete(id);
  }

};