import { apiClient } from "./axios";
import { ApiResponse } from "./types";

export interface OrganizationDto {
  id: string;
  name: string;
  merchantId: string;
}

export interface ApplicationDto {
  id: string;
  name: string;
  organizationId: string;
}

export const createOrganization = async (name: string, merchantId: string): Promise<OrganizationDto> => {
  const response = await apiClient.post<ApiResponse<OrganizationDto>>("/organizations", {
    name,
    merchantId,
  });
  return response.data.data;
};

export const createApplication = async (name: string, organizationId: string): Promise<ApplicationDto> => {
  const response = await apiClient.post<ApiResponse<ApplicationDto>>("/organizations/applications", {
    name,
    organizationId,
  });
  return response.data.data;
};
