import { Router } from "express";
import { User } from "./user.model.js";
import { userRepository } from "./user.repository.js";
import { userService } from "./user.service.js";
import { createUserController } from "./user.controller.js";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import { isOwnerOrRole } from "../../middlewares/ownership.middleware.js";

// Wiring
const repoDeUsuarios = userRepository(User);
const servicioDeUsuarios = userService(repoDeUsuarios);
const controller = createUserController(servicioDeUsuarios);

const router = Router();

// SOLO DIRECTOR
router.get("/", authMiddleware, roleMiddleware("DIRECTOR"), controller.getUsers);

// DIRECTOR o dueño
router.get("/:id", authMiddleware, isOwnerOrRole("DIRECTOR"), controller.getUser);

// SOLO DIRECTOR
router.post("/", authMiddleware, roleMiddleware("DIRECTOR"), controller.createUser);

// DIRECTOR o dueño
router.put("/:id", authMiddleware, isOwnerOrRole("DIRECTOR"), controller.updateUser);

// SOLO DIRECTOR
router.delete("/:id", authMiddleware, roleMiddleware("DIRECTOR"), controller.deleteUser);

export default router;