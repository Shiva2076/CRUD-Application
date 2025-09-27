// src/lib/applications.ts
import axios from "axios";

const APPLICATIONS_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
const API_URL = `${APPLICATIONS_API_URL}/applications`;

export async function getApplicationsByJob(jobId: string) {
  const res = await axios.get(`${API_URL}/${jobId}`);
  return res.data; // array of applications
}

export async function applyToJob(data: {
  jobId: string;
  jobTitle: string;
  fullName: string;
  email: string;
  resumeUrl: string;
  coverLetter?: string;
}) {
  const res = await axios.post(API_URL, data);
  return res.data;
}

export async function deleteApplication(id: string) {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
}
