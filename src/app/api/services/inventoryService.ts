import { apiClient } from '../client';
import type { InventoryItem, CreateInventoryItemRequest } from '../types/inventory';

const INVENTORY_PATH = '/inventory';

export const inventoryService = {
  async getList(): Promise<InventoryItem[]> {
    return apiClient<InventoryItem[]>(INVENTORY_PATH, { method: 'GET' });
  },

  async create(body: CreateInventoryItemRequest): Promise<InventoryItem> {
    return apiClient<InventoryItem>(INVENTORY_PATH, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
};
