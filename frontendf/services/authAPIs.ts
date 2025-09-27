// /services/authService.ts
import axiosInstance from "../lib/axiosInstance";
import { AuthResponse, LoginPayload, SignupPayload } from "../types/auth";

// ✅ signup API
export const signupUser = async (userData: SignupPayload): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<AuthResponse>(
      "/api/v1/user/signup",
      userData
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

// ✅ login API
export const loginUser = async (loginData: LoginPayload): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<AuthResponse>(
      "/api/v1/user/login",
      loginData
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};
