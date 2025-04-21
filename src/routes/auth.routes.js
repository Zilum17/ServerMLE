import { Router } from "express";
import { login, register, verifyToken} from "../controllers/auth.controller.js"


const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/verify", verifyToken);
// router.post("/logout", logout);

export default router;