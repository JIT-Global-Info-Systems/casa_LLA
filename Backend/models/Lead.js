import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
  customerName: String,
  phone: String,
  region: String,
  area: String,
  zone: String,

  currentStep: { type: Number, default: 1 },
  currentRole: String,

  createdByMediatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mediator"
  },

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

}, { timestamps: true });

export default mongoose.model("Lead", leadSchema);
