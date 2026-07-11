import { apiClient } from '../client';
import type {
  Design,
  CreateDesignRequest,
  CreateDesignsResponse,
  UpdateDesignRequest,
} from '../types/design';

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
   * Single image upload. POST multipart/form-data to /designs/with-image.
   * Fields: image (required), designName, categoryId, subcategoryId, description, tags.
   * pinterestBoardUrl is ignored when image is sent.
   */
  async createWithImage(formData: FormData): Promise<CreateDesignsResponse> {
    return apiClient<CreateDesignsResponse>(`${DESIGNS_PATH}/with-image`, {
      method: 'POST',
      body: formData,
    });
  },

  /**
   * Pinterest board import or duplicate by imageUrl. POST /designs (JSON).
   * Board URL only → one design per scraped pin. Re-sync skips existing pins.
   */
  async create(body: CreateDesignRequest): Promise<CreateDesignsResponse> {
    return apiClient<CreateDesignsResponse>(DESIGNS_PATH, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async updateWithImage(id: string, formData: FormData): Promise<Design> {
    return apiClient<Design>(`${DESIGNS_PATH}/${id}/with-image`, {
      method: 'PATCH',
      body: formData,
    });
  },

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
