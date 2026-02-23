/** Location from GET /locations or GET /locations/:id */
export interface ApiLocation {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE';
  staffCount: number;
  createdAt?: string;
  updatedAt?: string;
}

/** Request body for POST /locations. Required: name, address, phone, email. */
export interface CreateLocationRequest {
  name: string;
  address: string;
  phone: string;
  email: string;
  status?: 'ACTIVE' | 'INACTIVE';
  staffCount?: number;
}

/** Request body for PATCH /locations/:id (all fields optional) */
export type UpdateLocationRequest = Partial<CreateLocationRequest>;
