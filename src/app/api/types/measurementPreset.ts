import type { ApiMeasurement } from './measurement';

export interface ApiMeasurementPreset {
  id: string;
  subcategoryId: string;
  label: string;
  sortOrder: number;
  subcategory?: {
    id: string;
    name: string;
    parent?: { id: string; name: string };
  };
  measurements?: ApiMeasurement[];
}

export interface CreateMeasurementPresetRequest {
  subcategoryId: string;
  label: string;
  sortOrder?: number;
}

export interface UpdateMeasurementPresetRequest {
  label?: string;
  sortOrder?: number;
}

export interface BulkSavePresetMeasurementItem {
  name: string;
  value: string;
  unit?: string;
  status?: 'ENABLED' | 'DISABLED';
  imageUrl?: string | null;
  sortOrder?: number;
}

export interface BulkSavePresetMeasurementsRequest {
  items: BulkSavePresetMeasurementItem[];
}

export interface DeleteMeasurementPresetResponse {
  message: string;
  id: string;
  label: string;
  subcategoryId: string;
}
