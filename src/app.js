import express from 'express';
import morgan from 'morgan';
import authRoutes from "./routes/auth.routes.js";
import coursesRoutes from "./routes/courses.routes.js";
import lessonsRoutes from "./routes/lessons.routes.js"
const app = express()


app.use(express.json());
app.use(morgan('dev'));
app.use("/api/auth", authRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/lessons", lessonsRoutes);
export default app;