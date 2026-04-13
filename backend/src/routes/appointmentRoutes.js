import { Router } from "express";
import { listAppointments, createAppointment } from "../controllers/appointmentController.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.get("/", authRequired, listAppointments);
router.post("/", authRequired, createAppointment);

export default router;
