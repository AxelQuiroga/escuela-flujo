export const authController = (authService) => {

  return {
    login: async (req, res, next) => {
      try {
        const data = await authService.login(req.body);

        res.json(data);
      } catch (error) {
        if (error.message === "Credenciales inválidas") {
          return res.status(401).json({ message: error.message });
        }
        next(error);
      }
    }
  }
};