import Job from "../models/Job.js";


export const createJob = async (req, res) => {
  try {
    const { title, description, company, location } = req.body;

    // only these two are required
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const newJob = new Job({
      title,
      description,
      company: company || "",
      location: location || "",
      createdBy: req.user?.id || null, // attach only if logged in
    });

    await newJob.save();
    res.status(201).json(newJob);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getJobs = async (_req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
