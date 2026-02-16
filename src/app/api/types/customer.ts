/** Address nested in customer GET response */
export interface CustomerAddress {
  id: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  createdAt: string;
  updatedAt: string;
}

/** Customer from GET /customers */
export interface ApiCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  addressId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  address: CustomerAddress | null;
}

/** Request body for POST /customers */
export interface CreateCustomerRequest {
  name: string;
  email: string;
  phone: string;
  status?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

/** Request body for PATCH /customers/:id (partial) */
export type UpdateCustomerRequest = Partial<CreateCustomerRequest>;
