import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/error.middleware.js';
import { requestLogger } from './middlewares/logger.middleware.js';
import { createContainer } from './container.js';

const app = express()

app.use(cors());
app.use(express.json());
app.use(requestLogger);

const { routers } = createContainer();

app.use("/api/auth", routers.authRouter);
app.use("/api/users", routers.userRouter);
app.use("/api/grades", routers.gradeRouter);
app.use("/api/courses", routers.courseRouter);


app.use(errorHandler)

export default app;
