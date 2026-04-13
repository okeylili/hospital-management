import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { Doctor } from "../models/Doctor.js";

function signToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      doctor_id: user.doctor_id ? user.doctor_id.toString() : null,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export async function register(req, res) {
  try {
    const { email, password, name, role, doctor_id } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: "email, password, and name are required" });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const userRole = role === "admin" ? "admin" : "doctor";
    let docRef = null;
    if (userRole === "doctor") {
      if (!doctor_id) return res.status(400).json({ message: "doctor_id is required for doctor role" });
      const d = await Doctor.findById(doctor_id);
      if (!d) return res.status(400).json({ message: "Invalid doctor_id" });
      docRef = d._id;
    }
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashed,
      name,
      role: userRole,
      doctor_id: docRef,
    });
    const token = signToken(user);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        doctor_id: user.doctor_id,
      },
    });
  } catch (e) {
    if (e.name === "ValidationError") {
      return res.status(400).json({ message: Object.values(e.errors).map((x) => x.message).join(", ") });
    }
    res.status(500).json({ message: e.message || "Registration failed" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = signToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        doctor_id: user.doctor_id,
      },
    });
  } catch (e) {
    res.status(500).json({ message: e.message || "Login failed" });
  }
}
