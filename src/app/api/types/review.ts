/** Review from GET /reviews or GET /reviews/:id */
export interface ApiReview {
  id: string;
  customerId: string;
  productId: string;
  rating: number;
  reviewText: string;
  status: 'PUBLISHED' | 'PENDING' | 'HIDDEN';
  customerImageUrl?: string | null;
  /** Optional: may be returned by list for display */
  customerName?: string;
  /** Optional: may be returned by list for display */
  productName?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Stats from GET /reviews/stats */
export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  published: number;
  pending: number;
  hidden: number;
  ratingDistribution: {
    5?: number;
    4?: number;
    3?: number;
    2?: number;
    1?: number;
  };
}

/** Request body for POST /reviews (JSON). Required: customerId, productId, rating (1–5), reviewText. */
export interface CreateReviewRequest {
  customerId: string;
  productId: string;
  rating: number;
  reviewText: string;
  status?: 'PUBLISHED' | 'PENDING' | 'HIDDEN';
  customerImageUrl?: string;
}

/** Request body for PATCH /reviews/:id (all fields optional) */
export type UpdateReviewRequest = Partial<Omit<CreateReviewRequest, 'customerId' | 'productId'>>;

/** Query params for GET /reviews */
export interface ListReviewsParams {
  status?: 'PUBLISHED' | 'PENDING' | 'HIDDEN';
  search?: string;
  page?: number;
  limit?: number;
}

/** Paginated list response (if API returns one; otherwise we assume array) */
export interface ListReviewsResponse {
  data?: ApiReview[];
  items?: ApiReview[];
  total?: number;
}
