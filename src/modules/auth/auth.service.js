import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { AuthError } from "../../errors/domain.errors.js";

export const authService = (userRepository) => {
  return {
    register: async (data) => {
      const existingUser = await userRepository.findByEmail(data.email);
      if (existingUser) {
        throw new AuthError("EMAIL_IN_USE", "El email ya está registrado");
      }
      
      const role = data.role || "ALUMNO"; 
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const newUser = await userRepository.create({ ...data, password: hashedPassword, role });
      
      const token = jwt.sign(
        { id: newUser._id || newUser.id, role: newUser.role, email: newUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      
      return { token, user: newUser };
    },
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

