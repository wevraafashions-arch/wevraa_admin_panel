import { apiClient } from '../client';
import type {
  ApiLocation,
  CreateLocationRequest,
  UpdateLocationRequest,
} from '../types/location';

const LOCATIONS_PATH = '/locations';

export const locationsService = {
  async getList(): Promise<ApiLocation[]> {
    return apiClient<ApiLocation[]>(LOCATIONS_PATH, { method: 'GET' });
  },

  async getById(id: string): Promise<ApiLocation> {
    return apiClient<ApiLocation>(`${LOCATIONS_PATH}/${id}`, { method: 'GET' });
  },

  async create(body: CreateLocationRequest): Promise<ApiLocation> {
    return apiClient<ApiLocation>(LOCATIONS_PATH, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async update(id: string, body: UpdateLocationRequest): Promise<ApiLocation> {
    return apiClient<ApiLocation>(`${LOCATIONS_PATH}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  async delete(id: string): Promise<void> {
    await apiClient<void>(`${LOCATIONS_PATH}/${id}`, { method: 'DELETE' });
  },
};
