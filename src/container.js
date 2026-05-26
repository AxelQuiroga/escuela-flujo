/**
 * Global Composition Root
 * -----------------------
 * Único lugar donde se "cablea" infraestructura + módulos:
 * Models -> Repos -> Services -> Controllers -> Routers
 *
 * Regla: el resto de capas NO instancia dependencias concretas.
 */

// Middlewares
import { authMiddleware } from "./middlewares/auth.middleware.js";
import roleMiddleware from "./middlewares/role.middleware.js";
import { isOwnerOrRole } from "./middlewares/ownership.middleware.js";

// Models
import { User } from "./modules/users/user.model.js";
import { Course } from "./modules/courses/course.model.js";
import { Grade } from "./modules/grades/grade.model.js";

// Repositories
import { userRepository } from "./modules/users/user.repository.js";
import { courseRepository } from "./modules/courses/course.repository.js";
import { gradeRepository } from "./modules/grades/grade.repository.js";

// Services
import { userService } from "./modules/users/user.service.js";
import { courseService } from "./modules/courses/course.service.js";
import { gradeService } from "./modules/grades/grade.service.js";
import { authService } from "./modules/auth/auth.service.js";

// Controllers
import { createUserController } from "./modules/users/user.controller.js";
import { courseController } from "./modules/courses/course.controller.js";
import { createGradeController } from "./modules/grades/grade.controller.js";
import { authController } from "./modules/auth/auth.controller.js";

// Routers (factories)
import { createAuthRouter } from "./modules/auth/auth.routes.js";
import { createUserRouter } from "./modules/users/user.routes.js";
import { createCourseRouter } from "./modules/courses/course.routes.js";
import { createGradeRouter } from "./modules/grades/grade.routes.js";

export const createContainer = () => {
  // Repos
  const userRepo = userRepository(User);
  const courseRepo = courseRepository(Course);
  const gradeRepo = gradeRepository(Grade);

  // Services
  const users = userService(userRepo);
  const courses = courseService(courseRepo, gradeRepo);
  const grades = gradeService(gradeRepo, courseRepo);
  const auth = authService(userRepo);

  // Controllers
  const userCtrl = createUserController(users);
  const courseCtrl = courseController(courses);
  const gradeCtrl = createGradeController(grades, courses);
  const authCtrl = authController(auth);

  // Routers
  const authRouter = createAuthRouter({ controller: authCtrl });

  const userRouter = createUserRouter({
    controller: userCtrl,
    authMiddleware,
    roleMiddleware,
    isOwnerOrRole
  });

  const courseRouter = createCourseRouter({
    controller: courseCtrl,
    authMiddleware,
    roleMiddleware
  });

  const gradeRouter = createGradeRouter({
    controller: gradeCtrl,
    authMiddleware,
    roleMiddleware
  });

  return {
    routers: {
      authRouter,
      userRouter,
      courseRouter,
      gradeRouter
    },
    services: { users, courses, grades, auth },
    repos: { userRepo, courseRepo, gradeRepo }
  };
};

