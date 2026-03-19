import express from 'express';
import { errorHandler } from './middlewares/error.middleware.js';
import userRouter from './modules/users/user.routes.js'
import gradeRouter from './modules/grades/grade.routes.js'
import courseRouter from './modules/courses/course.routes.js'
import authRoutes from './modules/auth/auth.routes.js'

const app = express()

app.use(express.json())

app.use("/auth", authRoutes);
app.use("/user",userRouter)
app.use("/grade",gradeRouter)
app.use("/course",courseRouter)


app.use(errorHandler)

export default app;