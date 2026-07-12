export interface Design {
  id: string;
  designName: string;
  description: string | null;
  categoryId: string;
  subcategoryId: string;
  imageUrl: string;
  imageUrls?: string[];
  pinSourceUrls?: string[];
  pinterestBoardUrl?: string | null;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  category?: { id: string; name: string };
  subcategory?: { id: string; name: string };
}

/** Response from POST /designs and POST /designs/with-image */
export interface CreateDesignsResponse {
  created: number;
  skipped: number;
  failed: number;
  scraped: number;
  designs: Design[];
}

export interface CreateDesignRequest {
  designName: string;
  description?: string;
  categoryId: string;
  subcategoryId: string;
  imageUrl?: string;
  pinterestBoardUrl?: string;
  tags?: string[];
}

export type UpdateDesignRequest = Partial<
  Omit<CreateDesignRequest, 'imageUrl'> & { imageUrl?: string }
>;

/** Response from DELETE /designs/bulk */
export interface BulkDeleteDesignsResponse {
  deleted: number;
  notFound: string[];
  message: string;
}

export function showCreateDesignsToast(result: CreateDesignsResponse) {
  const { created, skipped } = result;
  if (created === 1) {
    return 'Design created';
  }
  if (created === 0 && skipped > 0) {
    return `All ${skipped} pins already imported`;
  }
  return `${created} designs created${skipped ? `, ${skipped} pins already imported` : ''}`;
}
