import { apiClient } from "./axios";
import { ApiResponse } from "./types";

export interface LoginResponse {
  token: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
    merchantId?: string;
  };
  merchantId?: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await apiClient.post<ApiResponse<LoginResponse>>("/auth/login", {
    email,
    password,
  });
  
  const data = response.data.data;
  if (data && data.token) {
    if (typeof window !== "undefined") {
      localStorage.setItem("fluxpay_token", data.token);
      if (data.user?.merchantId) {
        localStorage.setItem("fluxpay_merchant_id", data.user.merchantId);
      }
    }
  }
  return data;
};

export const register = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await apiClient.post<ApiResponse<LoginResponse>>("/auth/register", {
    email,
    password,
  });
  
  const data = response.data.data;
  if (data && data.token) {
    if (typeof window !== "undefined") {
      localStorage.setItem("fluxpay_token", data.token);
      if (data.merchantId) {
        localStorage.setItem("fluxpay_merchant_id", data.merchantId);
      }
    }
  }
  return data;
};

export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("fluxpay_token");
    localStorage.removeItem("fluxpay_merchant_id");
    window.location.href = "/login";
  }
};

export const getMerchantId = (): string => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("fluxpay_merchant_id") || "00000000-0000-0000-0000-000000000000";
  }
  return "00000000-0000-0000-0000-000000000000";
};
