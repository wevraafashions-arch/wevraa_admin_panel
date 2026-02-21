/** Tailor from GET /tailors or GET /tailors/:id */
export interface ApiTailor {
  id: string;
  name: string;
  phone: string;
  email: string;
  experience?: string;
  status: 'ACTIVE' | 'INACTIVE';
  addressLine1?: string;
  addressLine2?: string;
  pincode?: string;
  specializations?: string[];
  categoryTags?: string[];
  hasGst?: boolean;
  gstNumber?: string;
  gstPercentage?: number;
  hsnCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Request body for POST /tailors. Required: name, phone, email. status: ACTIVE | INACTIVE */
export interface CreateTailorRequest {
  name: string;
  phone: string;
  email: string;
  experience?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  addressLine1?: string;
  addressLine2?: string;
  pincode?: string;
  specializations?: string[];
  categoryTags?: string[];
  hasGst?: boolean;
  gstNumber?: string;
  gstPercentage?: number;
  hsnCode?: string;
}

/** Request body for PATCH /tailors/:id (all fields optional) */
export type UpdateTailorRequest = Partial<CreateTailorRequest>;
