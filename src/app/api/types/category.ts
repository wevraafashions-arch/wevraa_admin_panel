export interface CategoryProduct {
  id: string;
  [key: string]: unknown;
}

export interface Category {
  id: string;
  name: string;
  headline: string;
  shortDescription: string;
  status: string;
  thumbnailImage: string | null;
  createdAt: string;
  updatedAt: string;
  products: CategoryProduct[];
}

export interface CreateCategoryRequest {
  name: string;
  headline: string;
  shortDescription: string;
  status: string;
  thumbnailImage?: string;
  productIds?: string[];
}

export type UpdateCategoryRequest = Partial<CreateCategoryRequest>;
