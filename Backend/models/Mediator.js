import mongoose from "mongoose";

const mediatorSchema = new mongoose.Schema({
  mediatorName: { type: String, required: true },
  phonePrimary: { type: String, required: true },
  email: String,
  category: String,
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: "MasterLocation" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, default: "active" }
}, { timestamps: true });

export default mongoose.model("Mediator", mediatorSchema);
