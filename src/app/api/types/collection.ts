export interface CollectionProduct {
  id: string;
  [key: string]: unknown;
}

export interface Collection {
  id: string;
  title: string;
  description: string;
  status: string;
  publishOnlineStore: boolean;
  publishPOS: boolean;
  image: string | null;
  themeTemplate: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  products: CollectionProduct[];
}

export interface UpdateCollectionRequest {
  title?: string;
  description?: string;
  status?: string;
  publishOnlineStore?: boolean;
  publishPOS?: boolean;
  image?: string;
  themeTemplate?: string;
  type?: string;
  productIds?: string[];
}
