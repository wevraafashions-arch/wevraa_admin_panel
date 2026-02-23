import { apiClient } from '../client';
import type {
  ApiTailorCategory,
  CreateTailorCategoryRequest,
  UpdateTailorCategoryRequest,
  ReorderTailorCategoriesRequest,
} from '../types/tailorCategory';

const TAILOR_CATEGORIES_PATH = '/tailor-categories';

function buildListUrl(parentId?: string | null): string {
  if (parentId) {
    return `${TAILOR_CATEGORIES_PATH}?parentId=${encodeURIComponent(parentId)}`;
  }
  return TAILOR_CATEGORIES_PATH;
}

export const tailorCategoriesService = {
  /** List top-level categories (no parentId) or subcategories (parentId = uuid). */
  async getList(parentId?: string | null): Promise<ApiTailorCategory[]> {
    return apiClient<ApiTailorCategory[]>(buildListUrl(parentId), { method: 'GET' });
  },

  /** Get one category with children. */
  async getById(id: string): Promise<ApiTailorCategory> {
    return apiClient<ApiTailorCategory>(`${TAILOR_CATEGORIES_PATH}/${id}`, { method: 'GET' });
  },

  async create(body: CreateTailorCategoryRequest): Promise<ApiTailorCategory> {
    return apiClient<ApiTailorCategory>(TAILOR_CATEGORIES_PATH, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async update(id: string, body: UpdateTailorCategoryRequest): Promise<ApiTailorCategory> {
    return apiClient<ApiTailorCategory>(`${TAILOR_CATEGORIES_PATH}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  async reorder(body: ReorderTailorCategoriesRequest): Promise<void> {
    await apiClient<void>(`${TAILOR_CATEGORIES_PATH}/reorder`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  async delete(id: string): Promise<void> {
    await apiClient<void>(`${TAILOR_CATEGORIES_PATH}/${id}`, { method: 'DELETE' });
  },
};
