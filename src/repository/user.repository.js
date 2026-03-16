import { User } from "../models/user.model.js";

export const userRepository = {

  findAll: async () => {
    return await User.find();
  },

  findById: async (id) => {
    return await User.findById(id);
  },

  findByEmail: async (email) => {
    return await User.findOne({ email });
  },

  create: async (data) => {
    return await User.create(data);
  },

  update: async (id, data) => {
    return await User.findByIdAndUpdate(id, data, { returnDocument: "after" });
  },

  delete: async (id) => {
    return await User.findByIdAndDelete(id);
  }

};