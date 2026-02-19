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
  priceOverride?: number | null;
  skuOverride?: string;
}

export interface SizeMeasurementItem {
  key: string;
  value: number;
  unit: string;
}

export interface ProductSizeItem {
  sizeName: string;
  stockQuantity: number;
  measurements?: SizeMeasurementItem[];
}

export interface CreateProductRequest {
  title: string;
  productDescription?: string;
  productDetails?: string;
  fitAndFabric?: string;
  shippingAndReturns?: string;
  status?: string;
  publishOnlineStore?: boolean;
  publishPOS?: boolean;
  mrp: number;
  compareAtPrice?: number;
  discountType?: 'PERCENTAGE' | 'FLAT';
  discountValue?: number;
  inventoryTracked?: boolean;
  quantity?: number;
  sku?: string;
  barcode?: string;
  allowOutOfStockSales?: boolean;
  isPhysicalProduct?: boolean;
  weight?: number;
  weightUnit?: 'GRAM' | 'KG';
  countryOfOrigin?: string;
  categoryId?: string;
  vendorId?: string;
  productType?: 'PHYSICAL' | 'DIGITAL';
  themeTemplate?: 'DEFAULT_PRODUCT' | 'FEATURED_PRODUCT' | 'CUSTOM_PRODUCT';
  tags?: string[];
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
  productDescription?: string | null;
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
  allowOutOfStockSales?: boolean;
  isPhysicalProduct?: boolean;
  weight?: number | null;
  weightUnit?: string | null;
  countryOfOrigin?: string | null;
  categoryId?: string | null;
  vendorId?: string | null;
  productType?: string | null;
  themeTemplate?: string | null;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  category?: ProductCategory | null;
  vendor?: { id: string; companyName: string; contactPersonName: string } | null;
  collections?: ProductCollectionRef[];
  media?: { id?: string; url: string; type: string; alt?: string; order?: number }[];
  variants?: ProductVariantItem[];
  sizes?: ProductSizeItem[];
}
