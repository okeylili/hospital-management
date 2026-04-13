import { Router } from "express";
import {
  diseases,
  peakHours,
  revenue,
  doctorPerformance,
} from "../controllers/analyticsController.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.get("/diseases", authRequired, diseases);
router.get("/peak-hours", authRequired, peakHours);
router.get("/revenue", authRequired, revenue);
router.get("/doctor-performance", authRequired, doctorPerformance);

export default router;
