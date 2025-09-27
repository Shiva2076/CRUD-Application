import express from "express";
import {
  createJob,
  getJobs,
  getJob,
  deleteJob,
} from "../controllers/jobs.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getJobs);
router.get("/:id", getJob);

// Protected routes
router.post("/", protect, createJob);
router.delete("/:id", protect, deleteJob);

export default router;
