import express from "express";

export const createAuthRouter = ({ controller }) => {
  const router = express.Router();

  router.post("/register", controller.register);
  router.post("/login", controller.login);

  return router;
};
