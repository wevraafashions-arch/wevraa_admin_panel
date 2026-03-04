import { apiClient } from '../client';
import type {
  ApiMeasurement,
  CreateMeasurementRequest,
  UpdateMeasurementRequest,
} from '../types/measurement';

const MEASUREMENTS_PATH = '/measurements';

function buildListQuery(subcategoryId?: string | null): string {
  if (!subcategoryId) return '';
  return `?subcategoryId=${encodeURIComponent(subcategoryId)}`;
}

export const measurementsService = {
  /** GET /measurements or GET /measurements?subcategoryId=<uuid> */
  async getList(subcategoryId?: string | null): Promise<ApiMeasurement[]> {
    const url = `${MEASUREMENTS_PATH}${buildListQuery(subcategoryId)}`;
    return apiClient<ApiMeasurement[]>(url, { method: 'GET' });
  },

  async getById(id: string): Promise<ApiMeasurement> {
    return apiClient<ApiMeasurement>(`${MEASUREMENTS_PATH}/${id}`, { method: 'GET' });
  },

  async create(body: CreateMeasurementRequest): Promise<ApiMeasurement> {
    return apiClient<ApiMeasurement>(MEASUREMENTS_PATH, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async update(id: string, body: UpdateMeasurementRequest): Promise<ApiMeasurement> {
    return apiClient<ApiMeasurement>(`${MEASUREMENTS_PATH}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  async delete(id: string): Promise<void> {
    await apiClient<void>(`${MEASUREMENTS_PATH}/${id}`, { method: 'DELETE' });
  },
};
