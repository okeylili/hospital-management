import mongoose from "mongoose";

const billingSchema = new mongoose.Schema(
  {
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "patient_id is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    payment_status: {
      type: String,
      required: [true, "Payment status is required"],
      enum: {
        values: ["pending", "paid", "partial", "refunded"],
        message: "{VALUE} is not valid",
      },
      default: "pending",
    },
    insurance_claimed: {
      type: Boolean,
      required: [true, "insurance_claimed is required"],
      default: false,
    },
    date: {
      type: Date,
      required: [true, "Bill date is required"],
    },
  },
  { timestamps: true }
);

billingSchema.index({ patient_id: 1 });
billingSchema.index({ date: 1 });

export const Billing = mongoose.model("Billing", billingSchema);
