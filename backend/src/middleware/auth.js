import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export function authRequired(req, res, next) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, role: payload.role, doctor_id: payload.doctor_id || null };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

/** Load full user for routes that need doctor_id from DB */
export async function attachUser(req, res, next) {
  try {
    const u = await User.findById(req.user.id).select("role doctor_id");
    if (!u) return res.status(401).json({ message: "User not found" });
    req.dbUser = u;
    next();
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}
