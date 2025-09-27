export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  verificationStatus: "verified" | "unverified";
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type SignupPayload = {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "donor" | "admin"; // adjust as needed
  verificationStatus?: "verified" | "unverified";
};

export type LoginPayload = {
  email: string;
  password: string;
};
