/** Request payload for POST /products */
export interface ProductMediaItem {
  url: string;
  type: string;
  alt?: string;
  order?: number;
}

export interface ProductVariantItem {
  optionName: string;
  optionValue: string;
  priceOverride?: number;
  skuOverride?: string;
}

export interface SizeMeasurementItem {
  key: string;
  value: string;
  unit: string;
}

export interface ProductSizeItem {
  sizeName: string;
  stockQuantity: number;
  measurements?: SizeMeasurementItem[];
}

export interface CreateProductRequest {
  title: string;
  shortDescription?: string;
  longDescription?: string;
  productDetails?: string;
  fitAndFabric?: string;
  shippingAndReturns?: string;
  status: string;
  publishOnlineStore?: boolean;
  publishPOS?: boolean;
  mrp: number;
  compareAtPrice?: number;
  discountType?: string;
  discountValue?: number;
  inventoryTracked?: boolean;
  quantity?: number;
  sku?: string;
  barcode?: string;
  shopLocation?: string;
  allowOutOfStockSales?: boolean;
  isPhysicalProduct?: boolean;
  packageType?: string;
  weight?: number;
  weightUnit?: string;
  countryOfOrigin?: string;
  hsCode?: string;
  categoryId?: string;
  collectionIds?: string[];
  media?: ProductMediaItem[];
  variants?: ProductVariantItem[];
  sizes?: ProductSizeItem[];
}

export type UpdateProductRequest = Partial<CreateProductRequest>;

/** Category relation in product response */
export interface ProductCategory {
  id: string;
  name: string;
  [key: string]: unknown;
}

/** Collection relation in product response */
export interface ProductCollectionRef {
  id: string;
  title: string;
  [key: string]: unknown;
}

/** Full product from GET (with relations) */
export interface Product {
  id: string;
  title: string;
  shortDescription?: string | null;
  longDescription?: string | null;
  productDetails?: string | null;
  fitAndFabric?: string | null;
  shippingAndReturns?: string | null;
  status: string;
  publishOnlineStore?: boolean;
  publishPOS?: boolean;
  mrp: number;
  compareAtPrice?: number | null;
  discountType?: string | null;
  discountValue?: number | null;
  inventoryTracked?: boolean;
  quantity?: number;
  sku?: string | null;
  barcode?: string | null;
  shopLocation?: string | null;
  allowOutOfStockSales?: boolean;
  isPhysicalProduct?: boolean;
  packageType?: string | null;
  weight?: number | null;
  weightUnit?: string | null;
  countryOfOrigin?: string | null;
  hsCode?: string | null;
  categoryId?: string | null;
  createdAt?: string;
  updatedAt?: string;
  category?: ProductCategory | null;
  collections?: ProductCollectionRef[];
  media?: { id?: string; url: string; type: string; alt?: string; order?: number }[];
  variants?: ProductVariantItem[];
  sizes?: ProductSizeItem[];
}
