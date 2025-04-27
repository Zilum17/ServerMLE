import { Router } from "express";
import { get } from "../controllers/courses.controller.js";
import { auth } from "../middlewares/auth.middlewares.js";

const router = Router();

router.get("/get", auth, get);

export default router;