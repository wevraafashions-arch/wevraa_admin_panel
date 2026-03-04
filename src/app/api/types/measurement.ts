/** Measurement from GET /measurements or GET /measurements/:id. value is number from API. */
export interface ApiMeasurement {
  id: string;
  subcategoryId: string;
  name: string;
  value: number;
  unit: string;
  status: 'ENABLED' | 'DISABLED';
  imageUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
  /** Optional: from list when API includes subcategory/parent info */
  subcategory?: { id: string; name?: string; parentId?: string | null };
}

/** Request body for POST /measurements. subcategoryId and value (number) required. */
export interface CreateMeasurementRequest {
  subcategoryId: string;
  name: string;
  value: number;
  unit?: string;
  status?: 'ENABLED' | 'DISABLED';
  imageUrl?: string;
}

/** Request body for PATCH /measurements/:id (all fields optional) */
export type UpdateMeasurementRequest = Partial<Omit<CreateMeasurementRequest, 'subcategoryId'>>;
