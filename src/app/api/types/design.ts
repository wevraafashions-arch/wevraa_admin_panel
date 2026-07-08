export interface Design {
  id: string;
  designName: string;
  description: string | null;
  categoryId: string;
  subcategoryId: string;
  imageUrl: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  category?: { id: string; name: string };
  subcategory?: { id: string; name: string };
}

export interface CreateDesignRequest {
  designName: string;
  description?: string;
  categoryId: string;
  subcategoryId: string;
  imageUrl: string;
  tags?: string[];
}

export type UpdateDesignRequest = Partial<
  Omit<CreateDesignRequest, 'imageUrl'> & { imageUrl?: string }
>;
