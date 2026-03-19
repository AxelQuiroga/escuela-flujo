import { Router } from "express";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} from "./user.controller.js";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import { isOwnerOrRole } from "../../middlewares/ownership.middleware.js";

const router = Router();

// SOLO DIRECTOR
router.get("/", authMiddleware, roleMiddleware("DIRECTOR"), getUsers);

// DIRECTOR o dueño
router.get("/:id", authMiddleware, isOwnerOrRole("DIRECTOR"), getUser);

// SOLO DIRECTOR
router.post("/", authMiddleware, roleMiddleware("DIRECTOR"), createUser);

// DIRECTOR o dueño
router.put("/:id", authMiddleware, isOwnerOrRole("DIRECTOR"), updateUser);

// SOLO DIRECTOR
router.delete("/:id", authMiddleware, roleMiddleware("DIRECTOR"), deleteUser);

export default router;