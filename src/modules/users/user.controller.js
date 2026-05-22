export const createUserController = (userService) => {

  return {
    getUsers: async (req, res, next) => {
      try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
      } catch (error) {
        next(error);
      }
    },

    getUser: async (req, res, next) => {
      try {
        const { id } = req.params;
        const user = await userService.getUserById(id);

        res.status(200).json(user);
      } catch (error) {
        next(error);
      }
    },

    createUser: async (req, res, next) => {
      try {
        const user = await userService.createUser(req.body);
        res.status(201).json(user);
      } catch (error) {
        next(error);
      }
    },

    updateUser: async (req, res, next) => {
      try {
        const user = await userService.updateUser(req.params.id, req.body);
        res.status(200).json(user);
      } catch (error) {
        next(error);
      }
    },

    deleteUser: async (req, res, next) => {
      try {
        await userService.deleteUser(req.params.id);
        res.status(204).send();
      } catch (error) {
        next(error);
      }
    }
  }
};
