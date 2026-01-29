const mongoose = require("mongoose");

/**
 * Counter schema (reuse pattern you already have)
 */
const stageCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const StageCounter =
  mongoose.models.StageCounter ||
  mongoose.model("StageCounter", stageCounterSchema);

/**
 * Stage Master Schema
 */
const stageSchema = new mongoose.Schema({
  stage_id: {
    type: Number,
    unique: true
  },

  stage_name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  created_at: {
    type: Date,
    default: Date.now
  },

  updated_at: {
    type: Date
  }
});

/**
 * Auto-increment stage_id
 */
stageSchema.pre("save", async function (next) {
  if (!this.isNew) return next();

  try {
    const counter = await StageCounter.findOneAndUpdate(
      { _id: "stage_id" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    this.stage_id = counter.seq;
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Stage", stageSchema);
