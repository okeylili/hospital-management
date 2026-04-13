import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Doctor name is required"],
      trim: true,
    },
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
      trim: true,
    },
    available_slots: {
      type: [String],
      required: [true, "At least one available slot is required"],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "available_slots must be a non-empty array",
      },
    },
  },
  { timestamps: true }
);

export const Doctor = mongoose.model("Doctor", doctorSchema);
