import { ROLES } from "../../constants/roles.js";
import { parsePagination, buildPaginatedResponse } from "../../utils/pagination.js";

// Campos permitidos para creación (solo DIRECTOR puede crear)
const CREATE_ALLOWED_FIELDS = ["name", "email", "password", "role"];

// Campos que cualquier usuario autenticado puede actualizar sobre sí mismo
const USER_UPDATABLE_FIELDS = ["name", "password"];

// Campos adicionales que sólo un DIRECTOR puede modificar
const DIRECTOR_ONLY_FIELDS = ["role", "email"];

export const createUserController = (userService) => {

  return {
    getUsers: async (req, res, next) => {
      try {
        const pagination = parsePagination(req.query);
        const { data, total } = await userService.getAllUsers(pagination);
        res.status(200).json(buildPaginatedResponse(data, total, pagination));
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
        const sanitizedData = Object.fromEntries(
          Object.entries(req.body).filter(([key]) => CREATE_ALLOWED_FIELDS.includes(key))
        );

        const user = await userService.createUser(sanitizedData);
        res.status(201).json(user);
      } catch (error) {
        next(error);
      }
    },

    updateUser: async (req, res, next) => {
      try {
        const isDirector = req.user?.role === ROLES.DIRECTOR;

        // Campos permitidos según el rol del que hace el request
        const allowedFields = isDirector
          ? [...USER_UPDATABLE_FIELDS, ...DIRECTOR_ONLY_FIELDS]
          : USER_UPDATABLE_FIELDS;

        // Whitelist explícita: sólo pasan los campos permitidos
        const sanitizedData = Object.fromEntries(
          Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
        );

        const user = await userService.updateUser(req.params.id, sanitizedData);
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
