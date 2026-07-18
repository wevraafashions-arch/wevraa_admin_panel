import { apiClient } from '../client';
import type {
  Design,
  BulkDeleteDesignsResponse,
  CreateDesignRequest,
  CreateDesignsResponse,
  ListDesignsParams,
  PaginatedDesigns,
  UpdateDesignRequest,
} from '../types/design';

const DESIGNS_PATH = '/designs';
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

type ListDesignsRaw =
  | Design[]
  | {
      data?: Design[];
      items?: Design[];
      designs?: Design[];
      total?: number;
      page?: number;
      limit?: number;
      totalPages?: number;
    };

function buildListUrl(params: ListDesignsParams = {}): string {
  const search = new URLSearchParams();
  if (params.categoryId) search.set('categoryId', params.categoryId);
  if (params.subcategoryId) search.set('subcategoryId', params.subcategoryId);
  if (params.page != null) search.set('page', String(params.page));
  if (params.limit != null) search.set('limit', String(Math.min(params.limit, MAX_LIMIT)));

  if (params.tags != null) {
    const tags = Array.isArray(params.tags)
      ? params.tags.map((t) => t.trim()).filter(Boolean)
      : params.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
    if (tags.length === 1) {
      search.set('tags', tags[0]);
    } else if (tags.length > 1) {
      tags.forEach((tag) => search.append('tags', tag));
    }
  }

  const q = search.toString();
  return q ? `${DESIGNS_PATH}?${q}` : DESIGNS_PATH;
}

function normalizePaginated(raw: ListDesignsRaw, params: ListDesignsParams = {}): PaginatedDesigns {
  const page = params.page ?? 1;
  const limit = Math.min(params.limit ?? DEFAULT_LIMIT, MAX_LIMIT);

  if (Array.isArray(raw)) {
    return {
      data: raw,
      total: raw.length,
      page: 1,
      limit: raw.length || limit,
      totalPages: 1,
    };
  }

  const data = Array.isArray(raw.data)
    ? raw.data
    : Array.isArray(raw.items)
      ? raw.items
      : Array.isArray(raw.designs)
        ? raw.designs
        : [];

  const total = typeof raw.total === 'number' ? raw.total : data.length;
  const resolvedLimit = typeof raw.limit === 'number' ? raw.limit : limit;
  const resolvedPage = typeof raw.page === 'number' ? raw.page : page;
  const totalPages =
    typeof raw.totalPages === 'number'
      ? raw.totalPages
      : Math.max(1, Math.ceil(total / (resolvedLimit || 1)));

  return {
    data,
    total,
    page: resolvedPage,
    limit: resolvedLimit,
    totalPages,
  };
}

export const designsService = {
  async getList(params: ListDesignsParams = {}): Promise<PaginatedDesigns> {
    const raw = await apiClient<ListDesignsRaw>(buildListUrl(params), { method: 'GET' });
    return normalizePaginated(raw, params);
  },

  async getById(id: string): Promise<Design> {
    return apiClient<Design>(`${DESIGNS_PATH}/${id}`, { method: 'GET' });
  },

  /**
   * Single image upload. POST multipart/form-data to /designs/with-image.
   * Fields: image (required), designName, categoryId, subcategoryId, description, tags.
   * pinterestBoardUrl is ignored when image is sent.
   */
  async createWithImage(formData: FormData): Promise<CreateDesignsResponse> {
    return apiClient<CreateDesignsResponse>(`${DESIGNS_PATH}/with-image`, {
      method: 'POST',
      body: formData,
    });
  },

  /**
   * Pinterest board import or duplicate by imageUrl. POST /designs (JSON).
   * Board URL only → one design per scraped pin. Re-sync skips existing pins.
   */
  async create(body: CreateDesignRequest): Promise<CreateDesignsResponse> {
    return apiClient<CreateDesignsResponse>(DESIGNS_PATH, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async updateWithImage(id: string, formData: FormData): Promise<Design> {
    return apiClient<Design>(`${DESIGNS_PATH}/${id}/with-image`, {
      method: 'PATCH',
      body: formData,
    });
  },

  async update(id: string, body: UpdateDesignRequest): Promise<Design> {
    return apiClient<Design>(`${DESIGNS_PATH}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  async delete(id: string): Promise<void> {
    await apiClient<void>(`${DESIGNS_PATH}/${id}`, { method: 'DELETE' });
  },

  /** DELETE /designs/bulk — delete multiple admin designs by id. */
  async bulkDelete(ids: string[]): Promise<BulkDeleteDesignsResponse> {
    return apiClient<BulkDeleteDesignsResponse>(`${DESIGNS_PATH}/bulk`, {
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
  },
};
