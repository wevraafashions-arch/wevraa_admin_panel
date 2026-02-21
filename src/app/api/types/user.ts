/** User from GET /users or GET /users/:id */
export interface ApiUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** Allowed role values for users */
export type UserRole = 'ADMIN' | 'SELLER' | 'CUSTOMER';

/** Request body for POST /users */
export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
}

/** Request body for PATCH /users/:id (all optional) */
export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: UserRole;
  isActive?: boolean;
}
