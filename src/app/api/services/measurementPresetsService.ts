import { apiClient } from '../client';
import type {
  ApiMeasurementPreset,
  BulkSavePresetMeasurementsRequest,
  CreateMeasurementPresetRequest,
  UpdateMeasurementPresetRequest,
} from '../types/measurementPreset';
import type { ApiMeasurement } from '../types/measurement';

const MEASUREMENT_PRESETS_PATH = '/measurement-presets';

function buildListQuery(subcategoryId: string, includeMeasurements?: boolean): string {
  const q = new URLSearchParams({ subcategoryId });
  if (includeMeasurements) q.set('includeMeasurements', 'true');
  return `?${q.toString()}`;
}

export const measurementPresetsService = {
  /** GET /measurement-presets?subcategoryId=<uuid>&includeMeasurements=true */
  async getList(subcategoryId: string, includeMeasurements = false): Promise<ApiMeasurementPreset[]> {
    const url = `${MEASUREMENT_PRESETS_PATH}${buildListQuery(subcategoryId, includeMeasurements)}`;
    return apiClient<ApiMeasurementPreset[]>(url, { method: 'GET' });
  },

  async create(body: CreateMeasurementPresetRequest): Promise<ApiMeasurementPreset> {
    return apiClient<ApiMeasurementPreset>(MEASUREMENT_PRESETS_PATH, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async update(id: string, body: UpdateMeasurementPresetRequest): Promise<ApiMeasurementPreset> {
    return apiClient<ApiMeasurementPreset>(`${MEASUREMENT_PRESETS_PATH}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  async delete(id: string): Promise<void> {
    await apiClient<void>(`${MEASUREMENT_PRESETS_PATH}/${id}`, { method: 'DELETE' });
  },

  /** PUT /measurement-presets/:id/measurements — replaces all rows for the preset. */
  async bulkSaveMeasurements(
    presetId: string,
    body: BulkSavePresetMeasurementsRequest
  ): Promise<ApiMeasurement[]> {
    return apiClient<ApiMeasurement[]>(`${MEASUREMENT_PRESETS_PATH}/${presetId}/measurements`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },
};
