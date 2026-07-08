/** Measurement from GET /measurements or GET /measurements/:id. */
export interface ApiMeasurement {
  id: string;
  subcategoryId: string;
  presetId?: string | null;
  name: string;
  value: number | string;
  unit: string;
  status: 'ENABLED' | 'DISABLED';
  imageUrl?: string | null;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
  /** Optional: from list when API includes subcategory/parent info */
  subcategory?: { id: string; name?: string; parentId?: string | null };
}

/** Request body for POST /measurements. subcategoryId and value required. */
export interface CreateMeasurementRequest {
  subcategoryId: string;
  presetId?: string;
  name: string;
  value: number | string;
  unit?: string;
  status?: 'ENABLED' | 'DISABLED';
  imageUrl?: string;
}

/** Request body for PATCH /measurements/:id (all fields optional) */
export type UpdateMeasurementRequest = Partial<Omit<CreateMeasurementRequest, 'subcategoryId'>>;
