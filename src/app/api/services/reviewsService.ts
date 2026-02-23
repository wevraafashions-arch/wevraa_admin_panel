import { apiClient } from '../client';
import type {
  ApiReview,
  ReviewStats,
  CreateReviewRequest,
  UpdateReviewRequest,
  ListReviewsParams,
  ListReviewsResponse,
} from '../types/review';

const REVIEWS_PATH = '/reviews';

function buildListQuery(params: ListReviewsParams): string {
  const search = new URLSearchParams();
  if (params.status) search.set('status', params.status);
  if (params.search) search.set('search', params.search);
  if (params.page != null) search.set('page', String(params.page));
  if (params.limit != null) search.set('limit', String(params.limit));
  const q = search.toString();
  return q ? `?${q}` : '';
}

export const reviewsService = {
  async getStats(): Promise<ReviewStats> {
    return apiClient<ReviewStats>(`${REVIEWS_PATH}/stats`, { method: 'GET' });
  },

  async getList(params: ListReviewsParams = {}): Promise<{ items: ApiReview[]; total?: number }> {
    const url = `${REVIEWS_PATH}${buildListQuery(params)}`;
    const raw = await apiClient<ApiReview[] | ListReviewsResponse>(url, { method: 'GET' });
    if (Array.isArray(raw)) {
      return { items: raw };
    }
    const items = raw.data ?? raw.items ?? [];
    return { items, total: raw.total };
  },

  async getById(id: string): Promise<ApiReview> {
    return apiClient<ApiReview>(`${REVIEWS_PATH}/${id}`, { method: 'GET' });
  },

  async create(body: CreateReviewRequest): Promise<ApiReview> {
    return apiClient<ApiReview>(REVIEWS_PATH, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  /** POST /reviews/with-image – form-data: customerImage (file), customerId, productId, rating, reviewText, status (optional) */
  async createWithImage(fields: {
    customerImage: File;
    customerId: string;
    productId: string;
    rating: number;
    reviewText: string;
    status?: string;
  }): Promise<ApiReview> {
    const formData = new FormData();
    formData.append('customerImage', fields.customerImage);
    formData.append('customerId', fields.customerId);
    formData.append('productId', fields.productId);
    formData.append('rating', String(fields.rating));
    formData.append('reviewText', fields.reviewText);
    if (fields.status) formData.append('status', fields.status);

    return apiClient<ApiReview>(`${REVIEWS_PATH}/with-image`, {
      method: 'POST',
      body: formData,
    });
  },

  async update(id: string, body: UpdateReviewRequest): Promise<ApiReview> {
    return apiClient<ApiReview>(`${REVIEWS_PATH}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  async publish(id: string): Promise<ApiReview> {
    return apiClient<ApiReview>(`${REVIEWS_PATH}/${id}/publish`, { method: 'PATCH' });
  },

  async hide(id: string): Promise<ApiReview> {
    return apiClient<ApiReview>(`${REVIEWS_PATH}/${id}/hide`, { method: 'PATCH' });
  },

  async delete(id: string): Promise<void> {
    await apiClient<void>(`${REVIEWS_PATH}/${id}`, { method: 'DELETE' });
  },
};
