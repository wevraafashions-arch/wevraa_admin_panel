import { apiClient } from '../client';
import type { Design, CreateDesignRequest, UpdateDesignRequest } from '../types/design';

const DESIGNS_PATH = '/designs';

export interface ListDesignsParams {
  categoryId?: string;
  subcategoryId?: string;
}

function buildListUrl(params?: ListDesignsParams): string {
  if (!params?.categoryId && !params?.subcategoryId) return DESIGNS_PATH;
  const search = new URLSearchParams();
  if (params.categoryId) search.set('categoryId', params.categoryId);
  if (params.subcategoryId) search.set('subcategoryId', params.subcategoryId);
  return `${DESIGNS_PATH}?${search.toString()}`;
}

export const designsService = {
  async getList(params?: ListDesignsParams): Promise<Design[]> {
    return apiClient<Design[]>(buildListUrl(params), { method: 'GET' });
  },

  async getById(id: string): Promise<Design> {
    return apiClient<Design>(`${DESIGNS_PATH}/${id}`, { method: 'GET' });
  },

  /**
   * Create design with image upload. POST multipart/form-data to /designs/with-image.
   * Fields: image (file, required), designName (required), description, categoryId (required), subcategoryId (required).
   */
  async createWithImage(formData: FormData): Promise<Design> {
    return apiClient<Design>(`${DESIGNS_PATH}/with-image`, {
      method: 'POST',
      body: formData,
    });
  },

  /**
   * Create design with existing image URL (JSON).
   */
  async create(body: CreateDesignRequest): Promise<Design> {
    return apiClient<Design>(DESIGNS_PATH, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  /**
   * Update design with optional new image. PATCH multipart/form-data to /designs/:id/with-image.
   * Fields: image (file, optional), designName, description, categoryId, subcategoryId.
   */
  async updateWithImage(id: string, formData: FormData): Promise<Design> {
    return apiClient<Design>(`${DESIGNS_PATH}/${id}/with-image`, {
      method: 'PATCH',
      body: formData,
    });
  },

  /**
   * Update design (JSON). All fields optional.
   */
  async update(id: string, body: UpdateDesignRequest): Promise<Design> {
    return apiClient<Design>(`${DESIGNS_PATH}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  async delete(id: string): Promise<void> {
    await apiClient<void>(`${DESIGNS_PATH}/${id}`, { method: 'DELETE' });
  },
};
