import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./axios";
import { ApiResponse } from "./types";
import { Product } from "@/app/(dashboard)/products/columns";
import { Subscription } from "@/app/(dashboard)/subscriptions/columns";
import { Order } from "@/app/(dashboard)/orders/columns";
import { Payment } from "@/app/(dashboard)/payments/columns";
import { Customer } from "@/app/(dashboard)/customers/columns";
import { Invoice } from "@/app/(dashboard)/invoices/columns";
import { Webhook } from "@/app/(dashboard)/developers/webhooks/columns";
import { ApiKey } from "@/app/(dashboard)/developers/api-keys/columns";
import { ApiLog } from "@/app/(dashboard)/developers/logs/columns";
import { Coupon } from "@/app/(dashboard)/coupons/columns";
import { Asset } from "@/app/(dashboard)/assets/columns";

import { getMerchantId } from "./auth";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      // In production, this would use a generic /products endpoint that infers merchant from token
      // or we pass the current user's merchant ID. Using fallback for now.
      const res = await apiClient.get<ApiResponse<Product[]>>(`/products/merchant/${getMerchantId()}`);
      return res.data.data;
    },
  });
}

export function useSubscriptions() {
  return useQuery({
    queryKey: ["subscriptions"],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Subscription[]>>(`/subscriptions/merchant/${getMerchantId()}`);
      return res.data.data;
    },
  });
}

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Order[]>>(`/orders/merchant/${getMerchantId()}`);
      return res.data.data;
    },
  });
}

export function usePayments() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Payment[]>>(`/payments/merchant/${getMerchantId()}`);
      return res.data.data;
    },
  });
}

export function useCustomers() {
  return useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Customer[]>>(`/customers/merchant/${getMerchantId()}`);
      return res.data.data;
    },
  });
}

export function useInvoices() {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Invoice[]>>(`/invoices/merchant/${getMerchantId()}`);
      return res.data.data;
    },
  });
}

export function useApiKeys() {
  return useQuery({
    queryKey: ["api-keys"],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<ApiKey[]>>(`/api-keys/merchant/${getMerchantId()}`);
      return res.data.data;
    },
  });
}

export function useWebhooks() {
  return useQuery({
    queryKey: ["webhooks"],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Webhook[]>>(`/webhooks/merchant/${getMerchantId()}`);
      return res.data.data;
    },
  });
}

export function useApiLogs() {
  return useQuery({
    queryKey: ["audit-logs"],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<ApiLog[]>>(`/audit-logs/merchant/${getMerchantId()}`);
      return res.data.data;
    },
  });
}

export function useCoupons() {
  return useQuery({
    queryKey: ["coupons"],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Coupon[]>>(`/coupons/merchant/${getMerchantId()}`);
      return res.data.data;
    },
  });
}

export function useAssets() {
  return useQuery({
    queryKey: ["assets"],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Asset[]>>(`/assets/merchant/${getMerchantId()}`);
      return res.data.data;
    },
  });
}
