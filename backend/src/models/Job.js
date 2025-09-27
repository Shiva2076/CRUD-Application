import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  company: String,
  location: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // <-- who created it
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Job", jobSchema);
