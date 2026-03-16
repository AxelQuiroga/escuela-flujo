import express from 'express';
import { errorHandler } from './middlewares/error.middleware.js';
import userRouter from './routes/user.routes.js'
import gradeRouter from './routes/grade.routes.js'
import courseRouter from './routes/course.routes.js'

const app = express()

app.use(express.json())

app.use("/user",userRouter)
app.use("/grade",gradeRouter)
app.use("/course",courseRouter)


app.use(errorHandler)

export default app;