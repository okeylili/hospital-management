import { Router } from "express";
import { listBilling, createBilling } from "../controllers/billingController.js";
import { authRequired, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", authRequired, listBilling);
router.post("/", authRequired, requireAdmin, createBilling);

export default router;
