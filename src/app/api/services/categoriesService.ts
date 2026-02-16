import { apiClient } from '../client';
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../types/category';

const CATEGORIES_PATH = '/categories';

export const categoriesService = {
  async getList(): Promise<Category[]> {
    return apiClient<Category[]>(CATEGORIES_PATH, { method: 'GET' });
  },

  async getById(id: string): Promise<Category> {
    return apiClient<Category>(`${CATEGORIES_PATH}/${id}`, { method: 'GET' });
  },

  async create(body: CreateCategoryRequest): Promise<Category> {
    return apiClient<Category>(CATEGORIES_PATH, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async update(id: string, body: UpdateCategoryRequest): Promise<Category> {
    return apiClient<Category>(`${CATEGORIES_PATH}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  async delete(id: string): Promise<void> {
    await apiClient<void>(`${CATEGORIES_PATH}/${id}`, { method: 'DELETE' });
  },
};
