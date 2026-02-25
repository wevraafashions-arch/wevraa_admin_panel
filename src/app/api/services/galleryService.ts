import { apiClient } from '../client';
import type {
  GalleryImage,
  CreateGalleryRequest,
  UpdateGalleryRequest,
} from '../types/gallery';

const GALLERY_PATH = '/gallery';

export interface ListGalleryParams {
  categoryId?: string;
  subcategoryId?: string;
  isPublic?: boolean;
}

function buildListUrl(params?: ListGalleryParams): string {
  if (!params?.categoryId && params?.subcategoryId == null && params?.isPublic == null) {
    return GALLERY_PATH;
  }
  const search = new URLSearchParams();
  if (params?.categoryId) search.set('categoryId', params.categoryId);
  if (params?.subcategoryId) search.set('subcategoryId', params.subcategoryId);
  if (params?.isPublic !== undefined) search.set('isPublic', String(params.isPublic));
  return `${GALLERY_PATH}?${search.toString()}`;
}

export const galleryService = {
  async getList(params?: ListGalleryParams): Promise<GalleryImage[]> {
    return apiClient<GalleryImage[]>(buildListUrl(params), { method: 'GET' });
  },

  async getById(id: string): Promise<GalleryImage> {
    return apiClient<GalleryImage>(`${GALLERY_PATH}/${id}`, { method: 'GET' });
  },

  /**
   * Add image to gallery with file upload. POST multipart/form-data to /gallery/with-image.
   * Fields: image (file, required), title (required), description, categoryId, subcategoryId,
   * tags (comma-separated, e.g. "Wedding, Silk, Embroidery"), isPublic (true/false).
   */
  async createWithImage(formData: FormData): Promise<GalleryImage> {
    return apiClient<GalleryImage>(`${GALLERY_PATH}/with-image`, {
      method: 'POST',
      body: formData,
    });
  },

  /**
   * Create gallery image with existing image URL (JSON).
   */
  async create(body: CreateGalleryRequest): Promise<GalleryImage> {
    return apiClient<GalleryImage>(GALLERY_PATH, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  /**
   * Update gallery image with optional new image. PATCH multipart/form-data to /gallery/:id/with-image.
   * Fields: image (file, optional), title, description, categoryId, subcategoryId, tags, isPublic.
   */
  async updateWithImage(id: string, formData: FormData): Promise<GalleryImage> {
    return apiClient<GalleryImage>(`${GALLERY_PATH}/${id}/with-image`, {
      method: 'PATCH',
      body: formData,
    });
  },

  /**
   * Update gallery image (JSON). All fields optional.
   */
  async update(id: string, body: UpdateGalleryRequest): Promise<GalleryImage> {
    return apiClient<GalleryImage>(`${GALLERY_PATH}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  async delete(id: string): Promise<void> {
    await apiClient<void>(`${GALLERY_PATH}/${id}`, { method: 'DELETE' });
  },
};
