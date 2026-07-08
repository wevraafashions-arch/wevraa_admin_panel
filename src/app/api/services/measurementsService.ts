import { apiClient } from '../client';
import type {
  ApiMeasurement,
  CreateMeasurementRequest,
  UpdateMeasurementRequest,
} from '../types/measurement';

const MEASUREMENTS_PATH = '/measurements';

function buildListQuery(params?: { subcategoryId?: string | null; presetId?: string | null }): string {
  if (!params) return '';
  const q = new URLSearchParams();
  if (params.subcategoryId) q.set('subcategoryId', params.subcategoryId);
  if (params.presetId) q.set('presetId', params.presetId);
  const s = q.toString();
  return s ? `?${s}` : '';
}

export const measurementsService = {
  /** GET /measurements?subcategoryId= or GET /measurements?presetId= */
  async getList(params?: { subcategoryId?: string | null; presetId?: string | null }): Promise<ApiMeasurement[]> {
    const url = `${MEASUREMENTS_PATH}${buildListQuery(params)}`;
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
