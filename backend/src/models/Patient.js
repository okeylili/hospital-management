import mongoose from "mongoose";

const medicalHistoryEntrySchema = new mongoose.Schema(
  {
    condition: {
      type: String,
      required: [true, "Condition is required"],
      trim: true,
    },
    diagnosed_at: { type: Date, default: null },
    notes: { type: String, trim: true, default: "" },
  },
  { _id: true }
);

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Patient name is required"],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [0, "Age cannot be negative"],
      max: [150, "Age is invalid"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: {
        values: ["male", "female", "other"],
        message: "{VALUE} is not valid",
      },
    },
    contact: {
      phone: {
        type: String,
        required: [true, "Phone is required"],
        trim: true,
      },
      email: {
        type: String,
        trim: true,
        default: "",
      },
    },
    medical_history: {
      type: [medicalHistoryEntrySchema],
      default: [],
    },
  },
  { timestamps: true }
);

export const Patient = mongoose.model("Patient", patientSchema);
