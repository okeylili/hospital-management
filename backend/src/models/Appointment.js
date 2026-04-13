import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "patient_id is required"],
    },
    doctor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: [true, "doctor_id is required"],
    },
    date: {
      type: Date,
      required: [true, "Appointment date is required"],
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: {
        values: ["scheduled", "completed", "cancelled", "no_show"],
        message: "{VALUE} is not a valid status",
      },
      default: "scheduled",
    },
    diagnosis: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

appointmentSchema.index({ patient_id: 1 });
appointmentSchema.index({ doctor_id: 1 });
appointmentSchema.index({ date: 1 });

export const Appointment = mongoose.model("Appointment", appointmentSchema);
