import { Router } from "express";
import { listDoctors, createDoctor } from "../controllers/doctorController.js";
import { authRequired, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", authRequired, listDoctors);
router.post("/", authRequired, requireAdmin, createDoctor);

export default router;
