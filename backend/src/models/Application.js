import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  jobTitle: String,
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  resumeUrl: { type: String, required: true },
  coverLetter: String,
  submittedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Application", applicationSchema);
