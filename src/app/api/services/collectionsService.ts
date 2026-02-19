import { apiClient } from '../client';
import type {
  Collection,
  CreateCollectionRequest,
  UpdateCollectionRequest,
} from '../types/collection';

const COLLECTIONS_PATH = '/collections';

export const collectionsService = {
  /** GET /collections */
  async getList(): Promise<Collection[]> {
    return apiClient<Collection[]>(COLLECTIONS_PATH, { method: 'GET' });
  },

  /** GET /collections/:id */
  async getById(id: string): Promise<Collection> {
    return apiClient<Collection>(`${COLLECTIONS_PATH}/${id}`, { method: 'GET' });
  },

  /** POST /collections (JSON) */
  async create(body: CreateCollectionRequest): Promise<Collection> {
    return apiClient<Collection>(COLLECTIONS_PATH, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  /** POST /collections/with-image (multipart/form-data) */
  async createWithImage(data: {
    image?: File;
    title: string;
    description?: string;
    themeTemplate?: string;
    type?: 'MANUAL' | 'SMART';
    publishOnlineStore?: boolean;
    publishPOS?: boolean;
    productIds?: string[];
  }): Promise<Collection> {
    const formData = new FormData();
    formData.append('title', data.title);
    if (data.image) formData.append('image', data.image);
    if (data.description) formData.append('description', data.description);
    if (data.themeTemplate) formData.append('themeTemplate', data.themeTemplate);
    if (data.type) formData.append('type', data.type);
    if (data.publishOnlineStore !== undefined)
      formData.append('publishOnlineStore', String(data.publishOnlineStore));
    if (data.publishPOS !== undefined)
      formData.append('publishPOS', String(data.publishPOS));
    if (data.productIds && data.productIds.length > 0)
      formData.append('productIds', JSON.stringify(data.productIds));

    return apiClient<Collection>(`${COLLECTIONS_PATH}/with-image`, {
      method: 'POST',
      body: formData,
    });
  },

  /** PATCH /collections/:id (JSON) */
  async update(id: string, body: UpdateCollectionRequest): Promise<Collection> {
    return apiClient<Collection>(`${COLLECTIONS_PATH}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  /** PATCH /collections/:id/with-image (multipart/form-data) */
  async updateWithImage(
    id: string,
    data: {
      image?: File;
      title?: string;
      description?: string;
      themeTemplate?: string;
      type?: string;
      publishOnlineStore?: boolean;
      publishPOS?: boolean;
      productIds?: string[];
    }
  ): Promise<Collection> {
    const formData = new FormData();
    if (data.image) formData.append('image', data.image);
    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.themeTemplate) formData.append('themeTemplate', data.themeTemplate);
    if (data.type) formData.append('type', data.type);
    if (data.publishOnlineStore !== undefined)
      formData.append('publishOnlineStore', String(data.publishOnlineStore));
    if (data.publishPOS !== undefined)
      formData.append('publishPOS', String(data.publishPOS));
    if (data.productIds && data.productIds.length > 0)
      formData.append('productIds', JSON.stringify(data.productIds));

    return apiClient<Collection>(`${COLLECTIONS_PATH}/${id}/with-image`, {
      method: 'PATCH',
      body: formData,
    });
  },

  /** DELETE /collections/:id */
  async delete(id: string): Promise<void> {
    await apiClient<void>(`${COLLECTIONS_PATH}/${id}`, { method: 'DELETE' });
  },
};
