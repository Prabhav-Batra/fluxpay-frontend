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
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message || "Login failed");
  }

  const data = json.data;
  if (data && data.merchantId) {
    if (typeof window !== "undefined") {
      localStorage.setItem("fluxpay_merchant_id", data.merchantId);
    }
  }
  return data;
};

export const register = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message || "Registration failed");
  }

  const data = json.data;
  if (data && data.merchantId) {
    if (typeof window !== "undefined") {
      localStorage.setItem("fluxpay_merchant_id", data.merchantId);
    }
  }
  return data;
};

export const logout = async () => {
  await fetch("/api/auth/logout", { method: "POST" });
  if (typeof window !== "undefined") {
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
