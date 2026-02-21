import { apiClient } from '../client';
import type { ApiTailor, CreateTailorRequest, UpdateTailorRequest } from '../types/tailor';

const TAILORS_PATH = '/tailors';

export const tailorService = {
  async getList(): Promise<ApiTailor[]> {
    return apiClient<ApiTailor[]>(TAILORS_PATH, { method: 'GET' });
  },

  async getById(id: string): Promise<ApiTailor> {
    return apiClient<ApiTailor>(`${TAILORS_PATH}/${id}`, { method: 'GET' });
  },

  async create(body: CreateTailorRequest): Promise<ApiTailor> {
    return apiClient<ApiTailor>(TAILORS_PATH, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async update(id: string, body: UpdateTailorRequest): Promise<ApiTailor> {
    return apiClient<ApiTailor>(`${TAILORS_PATH}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  async delete(id: string): Promise<void> {
    return apiClient<void>(`${TAILORS_PATH}/${id}`, { method: 'DELETE' });
  },
};
