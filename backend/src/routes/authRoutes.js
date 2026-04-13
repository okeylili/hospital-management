import { Router } from "express";
import { register, login } from "../controllers/authController.js";
import { doctorOptionsForRegister } from "../controllers/publicAuthHelper.js";

const router = Router();
router.get("/doctor-options", doctorOptionsForRegister);
router.post("/register", register);
router.post("/login", login);

export default router;
