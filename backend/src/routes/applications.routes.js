import express from "express";
import { createApplication, getApplicationsByJob, deleteApplication } from "../controllers/applications.controller.js";

const router = express.Router();

// Anyone can apply
router.post("/", createApplication);

// Admin or job creator can fetch/delete (you can add auth middleware later if needed)
router.get("/:jobId", getApplicationsByJob);
router.delete("/:id", deleteApplication);

export default router;
