import axios, { AxiosError, AxiosResponse } from "axios";
import { AppConfig } from "@/config";

// Server-side axios uses direct backend URL (no mixed content issues server-to-server)
export const serverApi = axios.create({
  baseURL: `${AppConfig.directBackendUrl}/api/v1`,
  withCredentials: true,
});

// Response interceptor to handle token/session expiration
serverApi.interceptors.response.use(
  (response: AxiosResponse) => {
    // You can also handle success globally if needed
    return response;
  },
  async (error: AxiosError) => {
    // Check if response exists and has your session-expired flag
    const responseData = error.response?.data as any;

    if (responseData?.data?.signOut) {
    }

    // Reject promise so the error propagates to your catch
    return Promise.reject(error);
  },
);
