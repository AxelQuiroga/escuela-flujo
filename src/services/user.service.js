import { userRepository } from "../repository/user.repository.js";

export const userService = {

  getAllUsers: async () => {
    return await userRepository.findAll();
  },

  getUserById: async (id) => {
    const user = await userRepository.findById(id);

    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    return user;
  },

  createUser: async (data) => {

    const existingUser = await userRepository.findByEmail(data.email);

    if (existingUser) {
      const error = new Error("Email already in use");
      error.status = 400;
      throw error;
    }

    return await userRepository.create(data);
  },

  updateUser: async (id, data) => {

    const user = await userRepository.update(id, data);

    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    return user;
  },

  deleteUser: async (id) => {

    const user = await userRepository.delete(id);

    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    return user;
  }

};