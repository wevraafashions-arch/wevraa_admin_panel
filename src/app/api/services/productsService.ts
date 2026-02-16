import { apiClient } from '../client';
import type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
} from '../types/product';

const PRODUCTS_PATH = '/products';

export const productsService = {
  async getList(): Promise<Product[]> {
    return apiClient<Product[]>(PRODUCTS_PATH, { method: 'GET' });
  },

  async getById(id: string): Promise<Product> {
    return apiClient<Product>(`${PRODUCTS_PATH}/${id}`, { method: 'GET' });
  },

  async create(body: CreateProductRequest): Promise<Product> {
    return apiClient<Product>(PRODUCTS_PATH, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async update(id: string, body: UpdateProductRequest): Promise<Product> {
    return apiClient<Product>(`${PRODUCTS_PATH}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  async delete(id: string): Promise<void> {
    await apiClient<void>(`${PRODUCTS_PATH}/${id}`, { method: 'DELETE' });
  },
};
