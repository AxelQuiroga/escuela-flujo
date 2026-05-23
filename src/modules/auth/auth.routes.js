import express from "express";
import { User } from "../users/user.model.js";
import { userRepository } from "../users/user.repository.js";
import { authService } from "./auth.service.js";
import { authController } from "./auth.controller.js";

const repoDeUsuarios = userRepository(User);
const servicioDeAuth = authService(repoDeUsuarios);
const controller = authController(servicioDeAuth);

const router = express.Router();

router.post("/login", controller.login);

export default router;