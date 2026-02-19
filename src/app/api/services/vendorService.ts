import { apiClient } from '../client';
import type {
  ApiVendor,
  CreateVendorRequest,
  UpdateVendorRequest,
} from '../types/vendor';

const VENDORS_PATH = '/vendors';

export const vendorService = {
  async getList(): Promise<ApiVendor[]> {
    return apiClient<ApiVendor[]>(VENDORS_PATH, { method: 'GET' });
  },

  async create(body: CreateVendorRequest): Promise<ApiVendor> {
    return apiClient<ApiVendor>(VENDORS_PATH, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async update(id: string, body: UpdateVendorRequest): Promise<ApiVendor> {
    return apiClient<ApiVendor>(`${VENDORS_PATH}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  async delete(id: string): Promise<void> {
    await apiClient<void>(`${VENDORS_PATH}/${id}`, { method: 'DELETE' });
  },
};
