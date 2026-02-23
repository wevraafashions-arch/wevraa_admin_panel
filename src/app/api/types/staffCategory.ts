/** Required field item from API (label, type, required) */
export interface ApiRequiredField {
  label: string;
  type: string; // e.g. Text, Phone, Number, Email
  required: boolean;
}

/** Staff category from GET /staff-categories or GET /staff-categories/:id */
export interface ApiStaffCategory {
  id: string;
  name: string;
  description: string;
  colorTheme: string; // e.g. blue, purple, pink, green, orange, red, indigo, teal
  status: 'ACTIVE' | 'INACTIVE';
  requiredFields: ApiRequiredField[];
  createdAt?: string;
  updatedAt?: string;
}

/** Request body for POST /staff-categories. Required: name, description. */
export interface CreateStaffCategoryRequest {
  name: string;
  description: string;
  colorTheme?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  requiredFields?: ApiRequiredField[];
}

/** Request body for PATCH /staff-categories/:id (all fields optional) */
export type UpdateStaffCategoryRequest = Partial<CreateStaffCategoryRequest>;
