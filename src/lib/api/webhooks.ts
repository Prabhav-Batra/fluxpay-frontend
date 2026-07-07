import { apiClient } from "./axios";
import { ApiResponse } from "./types";

export interface WebhookEndpointDto {
  id: string;
  url: string;
  merchantId: string;
  secretKey: string;
  events?: string[];
  active: boolean;
  createdAt: string;
}

export const getWebhooks = async (merchantId: string): Promise<WebhookEndpointDto[]> => {
  const response = await apiClient.get<ApiResponse<WebhookEndpointDto[]>>(`/webhooks/merchant/${merchantId}`);
  return response.data.data;
};

export const createWebhook = async (
  merchantId: string,
  url: string,
  events: string[]
): Promise<WebhookEndpointDto> => {
  const response = await apiClient.post<ApiResponse<WebhookEndpointDto>>("/webhooks", {
    merchantId,
    url,
    events,
  });
  return response.data.data;
};

export const deactivateWebhook = async (id: string): Promise<void> => {
  await apiClient.delete(`/webhooks/${id}`);
};
