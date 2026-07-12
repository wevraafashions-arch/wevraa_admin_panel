import { apiClient } from '../client';
import type {
  BulkDeleteReferenceImagesResponse,
  BulkUploadReferenceImagesResponse,
  CreateReferenceImageRequest,
  ReferenceImage,
  ReferenceImageType,
} from '../types/referenceImage';

const REFERENCE_IMAGES_PATH = '/reference-images';

function buildListUrl(type?: ReferenceImageType): string {
  if (!type) return REFERENCE_IMAGES_PATH;
  return `${REFERENCE_IMAGES_PATH}?type=${type}`;
}

export const referenceImagesService = {
  async getList(type?: ReferenceImageType): Promise<ReferenceImage[]> {
    return apiClient<ReferenceImage[]>(buildListUrl(type), { method: 'GET' });
  },

  async getById(id: string): Promise<ReferenceImage> {
    return apiClient<ReferenceImage>(`${REFERENCE_IMAGES_PATH}/${id}`, { method: 'GET' });
  },

  async createWithImage(formData: FormData): Promise<ReferenceImage> {
    return apiClient<ReferenceImage>(`${REFERENCE_IMAGES_PATH}/with-image`, {
      method: 'POST',
      body: formData,
    });
  },

  async bulkUploadWithImage(formData: FormData): Promise<BulkUploadReferenceImagesResponse> {
    return apiClient<BulkUploadReferenceImagesResponse>(`${REFERENCE_IMAGES_PATH}/bulk-with-image`, {
      method: 'POST',
      body: formData,
    });
  },

  async create(body: CreateReferenceImageRequest): Promise<ReferenceImage> {
    return apiClient<ReferenceImage>(REFERENCE_IMAGES_PATH, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async delete(id: string): Promise<void> {
    await apiClient<void>(`${REFERENCE_IMAGES_PATH}/${id}`, { method: 'DELETE' });
  },

  async bulkDelete(ids: string[]): Promise<BulkDeleteReferenceImagesResponse> {
    return apiClient<BulkDeleteReferenceImagesResponse>(`${REFERENCE_IMAGES_PATH}/bulk`, {
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
  },
};
