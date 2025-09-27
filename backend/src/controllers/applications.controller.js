import Application from "../models/Application.js";

// applications controller
export const createApplication = async (req, res) => {
  try {
    const { jobId, jobTitle, fullName, email, resumeUrl, coverLetter } = req.body;

    if (!jobId || !fullName || !email || !resumeUrl) {
      return res.status(400).json({ message: "All fields (jobId, fullName, email, resumeUrl) are required" });
    }

    // prevent duplicate applications by same email for same job
    const exists = await Application.findOne({ jobId, email });
    if (exists) {
      return res.status(400).json({ 
        message: "You have already applied to this job",
        code: "DUPLICATE_APPLICATION" // Add specific error code
      });
    }

    const app = await Application.create({
      jobId,
      jobTitle,
      fullName,
      email,
      resumeUrl,
      coverLetter
    });

    res.status(201).json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getApplicationsByJob = async (req, res) => {
  try {
    const apps = await Application.find({ jobId: req.params.jobId }).sort({ submittedAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: "Application deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
