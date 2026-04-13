import { Router } from "express";
import {
  listPatients,
  createPatient,
  updatePatient,
  deletePatient,
} from "../controllers/patientController.js";
import { authRequired, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", authRequired, listPatients);
router.post("/", authRequired, requireAdmin, createPatient);
router.put("/:id", authRequired, requireAdmin, updatePatient);
router.delete("/:id", authRequired, requireAdmin, deletePatient);

export default router;
