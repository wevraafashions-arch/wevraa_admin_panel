import { apiClient } from '../client';
import type {
  ApiCustomer,
  CreateCustomerRequest,
  UpdateCustomerRequest,
} from '../types/customer';

const CUSTOMERS_PATH = '/customers';

export const customerService = {
  async getList(): Promise<ApiCustomer[]> {
    return apiClient<ApiCustomer[]>(CUSTOMERS_PATH, { method: 'GET' });
  },

  async create(body: CreateCustomerRequest): Promise<ApiCustomer> {
    return apiClient<ApiCustomer>(CUSTOMERS_PATH, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async update(id: string, body: UpdateCustomerRequest): Promise<ApiCustomer> {
    return apiClient<ApiCustomer>(`${CUSTOMERS_PATH}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },
};
