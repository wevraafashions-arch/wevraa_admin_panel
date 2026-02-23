/** Tailor category from API (category or subcategory). children present when from GET /:id */
export interface ApiTailorCategory {
  id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  sortOrder: number;
  parentId: string | null;
  children?: ApiTailorCategory[];
}

/** Request body for POST /tailor-categories. Omit parentId for top-level. */
export interface CreateTailorCategoryRequest {
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  sortOrder?: number;
  parentId?: string;
}

/** Request body for PATCH /tailor-categories/:id (all fields optional) */
export type UpdateTailorCategoryRequest = Partial<CreateTailorCategoryRequest>;

/** Request body for PATCH /tailor-categories/reorder */
export interface ReorderTailorCategoriesRequest {
  items: { id: string; sortOrder: number }[];
}
