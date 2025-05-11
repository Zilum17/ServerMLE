import { Router } from "express";
import { get } from "../controllers/lessons.controller.js";
import { auth } from "../middlewares/auth.middlewares.js";

const router = Router();

router.post("/get", auth, get);

export default router;