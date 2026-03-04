import { apiClient } from '../client';
import type { Banner, CreateBannerRequest, UpdateBannerRequest } from '../types/banner';

const BANNERS_PATH = '/banners';

export interface ListBannersParams {
  activeOnly?: boolean;
}

function buildListUrl(params?: ListBannersParams): string {
  if (!params?.activeOnly) return BANNERS_PATH;
  return `${BANNERS_PATH}?activeOnly=true`;
}

export const bannersService = {
  async getList(params?: ListBannersParams): Promise<Banner[]> {
    return apiClient<Banner[]>(buildListUrl(params), { method: 'GET' });
  },

  async getById(id: string): Promise<Banner> {
    return apiClient<Banner>(`${BANNERS_PATH}/${id}`, { method: 'GET' });
  },

  async create(body: CreateBannerRequest): Promise<Banner> {
    return apiClient<Banner>(BANNERS_PATH, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async createWithImage(formData: FormData): Promise<Banner> {
    return apiClient<Banner>(`${BANNERS_PATH}/with-image`, {
      method: 'POST',
      body: formData,
    });
  },

  async update(id: string, body: UpdateBannerRequest): Promise<Banner> {
    return apiClient<Banner>(`${BANNERS_PATH}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  async updateWithImage(id: string, formData: FormData): Promise<Banner> {
    return apiClient<Banner>(`${BANNERS_PATH}/${id}/with-image`, {
      method: 'PATCH',
      body: formData,
    });
  },

  async delete(id: string): Promise<void> {
    await apiClient<void>(`${BANNERS_PATH}/${id}`, { method: 'DELETE' });
  },
};
