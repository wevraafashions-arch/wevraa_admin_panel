export interface GalleryImage {
  id: string;
  imageUrl: string;
  title: string;
  description: string | null;
  categoryId: string;
  subcategoryId: string;
  tags: string[];
  isPublic: boolean;
  createdAt?: string;
  updatedAt?: string;
  category?: { id: string; name: string };
  subcategory?: { id: string; name: string };
}

export interface CreateGalleryRequest {
  imageUrl: string;
  title: string;
  description?: string;
  categoryId: string;
  subcategoryId: string;
  tags?: string[];
  isPublic?: boolean;
}

export type UpdateGalleryRequest = Partial<
  Omit<CreateGalleryRequest, 'imageUrl'> & { imageUrl?: string }
>;
