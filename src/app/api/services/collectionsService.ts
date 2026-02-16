import { apiClient } from '../client';
import type { Collection, UpdateCollectionRequest } from '../types/collection';

const COLLECTIONS_PATH = '/collections';

export const collectionsService = {
  async getList(): Promise<Collection[]> {
    return apiClient<Collection[]>(COLLECTIONS_PATH, { method: 'GET' });
  },

  async getById(id: string): Promise<Collection> {
    return apiClient<Collection>(`${COLLECTIONS_PATH}/${id}`, { method: 'GET' });
  },

  async update(id: string, body: UpdateCollectionRequest): Promise<Collection> {
    return apiClient<Collection>(`${COLLECTIONS_PATH}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  async delete(id: string): Promise<void> {
    await apiClient<void>(`${COLLECTIONS_PATH}/${id}`, { method: 'DELETE' });
  },
};
