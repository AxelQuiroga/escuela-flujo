import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { userRepository } from "../users/user.repository.js";

export const authService = {
  login: async ({ email, password }) => {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Credenciales inválidas");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Credenciales inválidas");
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
