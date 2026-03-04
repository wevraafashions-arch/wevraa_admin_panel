export interface Banner {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  linkUrl: string;
  targetPage: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBannerRequest {
  imageUrl: string;
  title: string;
  description: string;
  linkUrl: string;
  targetPage?: string;
  startDate: string;
  endDate: string;
  isActive?: boolean;
}

export type UpdateBannerRequest = Partial<CreateBannerRequest>;
