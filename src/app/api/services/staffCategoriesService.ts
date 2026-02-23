import { apiClient } from '../client';
import type {
  ApiStaffCategory,
  CreateStaffCategoryRequest,
  UpdateStaffCategoryRequest,
} from '../types/staffCategory';

const STAFF_CATEGORIES_PATH = '/staff-categories';

export const staffCategoriesService = {
  async getList(): Promise<ApiStaffCategory[]> {
    return apiClient<ApiStaffCategory[]>(STAFF_CATEGORIES_PATH, { method: 'GET' });
  },

  async getById(id: string): Promise<ApiStaffCategory> {
    return apiClient<ApiStaffCategory>(`${STAFF_CATEGORIES_PATH}/${id}`, { method: 'GET' });
  },

  async create(body: CreateStaffCategoryRequest): Promise<ApiStaffCategory> {
    return apiClient<ApiStaffCategory>(STAFF_CATEGORIES_PATH, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async update(id: string, body: UpdateStaffCategoryRequest): Promise<ApiStaffCategory> {
    return apiClient<ApiStaffCategory>(`${STAFF_CATEGORIES_PATH}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  async delete(id: string): Promise<void> {
    await apiClient<void>(`${STAFF_CATEGORIES_PATH}/${id}`, { method: 'DELETE' });
  },
};
