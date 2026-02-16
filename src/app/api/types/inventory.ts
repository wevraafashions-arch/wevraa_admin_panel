/** Inventory item from GET /inventory */
export interface InventoryItem {
  id: string;
  itemName: string;
  sku: string;
  quantity: number;
  unit: string;
  reorderLevel: number;
  createdAt: string;
  updatedAt: string;
}

/** Request body for POST /inventory */
export interface CreateInventoryItemRequest {
  itemName: string;
  sku: string;
  quantity: number;
  unit: string;
  reorderLevel: number;
}
