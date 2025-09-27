// src/lib/jobs.ts
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
const API_URL = `${API_BASE_URL}/jobs`;

export async function getJobs() {
  const res = await axios.get(API_URL);
  return res.data; // array of jobs
}

export async function getJob(id: string) {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
}

export async function createJob(jobData: any, token: string) {
  const res = await axios.post(API_URL, jobData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function deleteJob(id: string, token: string) {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
