import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { AuthError } from "../../errors/domain.errors.js";

export const authService = (userRepository) => {
  return {
    login: async ({ email, password }) => {
      const user = await userRepository.findByEmail(email);

      if (!user) {
        throw new AuthError("INVALID_CREDENTIALS", "Credenciales inválidas");
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw new AuthError("INVALID_CREDENTIALS", "Credenciales inválidas");
      }

      const token = jwt.sign(
        {
          id: user._id,
          role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return {
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role
        }
      };
    }
  };
};

