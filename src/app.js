import express from 'express';
import { errorHandler } from './middlewares/error.middleware.js';
import { createContainer } from './container.js';

const app = express()

app.use(express.json())

const { routers } = createContainer();

app.use("/auth", routers.authRouter);
app.use("/user", routers.userRouter);
app.use("/grade", routers.gradeRouter);
app.use("/course", routers.courseRouter);


app.use(errorHandler)

export default app;
