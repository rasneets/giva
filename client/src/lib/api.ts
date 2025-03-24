import { apiRequest } from "./queryClient";

export interface UrlFormData {
  longUrl: string;
  customAlias?: string;
}

export interface ShortUrlResponse {
  id: number;
  shortCode: string;
  longUrl: string;
  shortUrl: string;
  createdAt: string;
  clicks: number;
}

export const shortenUrl = async (data: UrlFormData): Promise<ShortUrlResponse> => {
  const response = await apiRequest("POST", "/api/shorten", data);
  return response.json();
};

export const getRecentUrls = async (): Promise<ShortUrlResponse[]> => {
  const response = await apiRequest("GET", "/api/urls/recent");
  return response.json();
};

export const redirectUrl = async (shortCode: string): Promise<{ longUrl: string }> => {
  const response = await apiRequest("GET", `/api/redirect/${shortCode}`);
  return response.json();
};
