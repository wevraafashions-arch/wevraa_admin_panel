import { apiClient } from '../client';
import type {
  GSTRate,
  CreateGSTRateRequest,
  UpdateGSTRateRequest,
} from '../types/gstRate';

const GST_RATES_PATH = '/gst-rates';

export const gstRatesService = {
  async getList(): Promise<GSTRate[]> {
    return apiClient<GSTRate[]>(GST_RATES_PATH, { method: 'GET' });
  },

  async getById(id: string | number): Promise<GSTRate> {
    return apiClient<GSTRate>(`${GST_RATES_PATH}/${id}`, { method: 'GET' });
  },

  async create(body: CreateGSTRateRequest): Promise<GSTRate> {
    return apiClient<GSTRate>(GST_RATES_PATH, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async update(id: string | number, body: UpdateGSTRateRequest): Promise<GSTRate> {
    return apiClient<GSTRate>(`${GST_RATES_PATH}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  async delete(id: string | number): Promise<void> {
    await apiClient<void>(`${GST_RATES_PATH}/${id}`, { method: 'DELETE' });
  },
};
