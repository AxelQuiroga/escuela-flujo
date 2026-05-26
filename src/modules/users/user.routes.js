import { Router } from "express";

export const createUserRouter = ({
  controller,
  authMiddleware,
  roleMiddleware,
  isOwnerOrRole
}) => {
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

  return router;
};
