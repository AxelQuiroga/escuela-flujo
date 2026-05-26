import bcrypt from "bcryptjs";
import { ConflictError, NotFoundError } from "../../errors/domain.errors.js";

const SALT_ROUNDS = 10;

export const userService = (userRepository) => {
  
  return {
    getAllUsers: async () => {
      return await userRepository.findAll();
    },

    getUserById: async (id) => {
      const user = await userRepository.findById(id);

      if (!user) {
        throw new NotFoundError("USER_NOT_FOUND", "User not found", { id });
      }

      return user;
    },

    createUser: async (data) => {

      const existingUser = await userRepository.findByEmail(data.email);

      if (existingUser) {
        throw new ConflictError("EMAIL_IN_USE", "Email already in use", {
          email: data.email
        });
      }

      // 🔐 HASH PASSWORD
      const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
      data.password = hashedPassword;

      return await userRepository.create(data);
    },

    updateUser: async (id, data) => {

      //  Si actualizan password → hashear
      if (data.password) {
        const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
        data.password = hashedPassword;
      }

      const user = await userRepository.update(id, data);

      if (!user) {
        throw new NotFoundError("USER_NOT_FOUND", "User not found", { id });
      }

      return user;
    },

    deleteUser: async (id) => {

      const user = await userRepository.delete(id);

      if (!user) {
        throw new NotFoundError("USER_NOT_FOUND", "User not found", { id });
      }

      return user;
    }
  }
};
