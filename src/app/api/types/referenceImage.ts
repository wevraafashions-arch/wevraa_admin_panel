export type ReferenceImageType = 'HANGING' | 'DRAWING';

export interface ReferenceImage {
  id: string;
  type: ReferenceImageType;
  imageUrl: string;
  label?: string | null;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateReferenceImageRequest {
  type: ReferenceImageType;
  imageUrl: string;
  label?: string;
}

export interface BulkUploadReferenceImagesResponse {
  created: number;
  failed: number;
  images: ReferenceImage[];
}

export interface BulkDeleteReferenceImagesResponse {
  deleted: number;
  notFound: string[];
  message: string;
}
