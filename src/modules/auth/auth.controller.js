export const authController = (authService) => {
  return {
    login: async (req, res, next) => {
      try {
        const data = await authService.login(req.body);
        res.status(200).json(data);
      } catch (error) {
        next(error);
      }
    }
  };
};

