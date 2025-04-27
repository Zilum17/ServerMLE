import express from 'express';
import morgan from 'morgan';
import authRoutes from "./routes/auth.routes.js";
import coursesRoutes from "./routes/courses.routes.js";
const app = express()


app.use(express.json());
app.use(morgan('dev'));
app.use("/api/auth", authRoutes);
app.use("/api/courses", coursesRoutes);
export default app;