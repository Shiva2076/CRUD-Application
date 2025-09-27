// src/lib/auth.ts
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
const API_URL = `${API_BASE_URL}/auth`;

// src/lib/auth.ts
export async function loginUser(email: string, password: string) {
  const res = await axios.post(`${API_URL}/login`, { email, password });

  const { token, user } = res.data;

  // ✅ Save token and user separately
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  return { token, user };
}

export async function registerUser(name: string, email: string, password: string) {
  const res = await axios.post(
    `${API_URL}/register`,
    { name, email, password },
    { withCredentials: true }
  );
  return res.data;
}

export async function logoutUser() {
  const res = await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
  return res.data;
}
