import { authService } from "./auth.service.js";

export const login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body);

    res.json(data);
  } catch (error) {
    next(error);
  }
};