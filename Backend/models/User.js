import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  role: {
    type: String,
    enum: [
      "admin",
      "management",
      "telecaller",
      "executive",
      "manager",
      "legal",
      "liaison",
      "finance"
    ],
    required: true
  },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, default: "active" }

}, { timestamps: true });

export default mongoose.model("User", userSchema);
