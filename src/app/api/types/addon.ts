/** Accessory line item on create/update configuration */
export interface AddonConfigurationAccessory {
  accessoryOptionId: string;
  isRequired: boolean;
}

/** POST /addon/configurations */
export interface CreateAddonConfigurationRequest {
  name: string;
  categoryId: string;
  subCategoryId: string;
  status: 'ACTIVE' | 'INACTIVE';
  fabricImageUrl?: string;
  drawingImageUrl?: string;
  designImageUrls?: string[];
  hangingImageUrls?: string[];
  accessories?: AddonConfigurationAccessory[];
  selectedSubOptionIds?: string[];
}

/**
 * PATCH /addon/configurations/:id — same shape as create; every field optional.
 * If `accessories` or `selectedSubOptionIds` is present, it replaces the existing
 * list on the server (use `[]` to clear).
 */
export type UpdateAddonConfigurationRequest = Partial<CreateAddonConfigurationRequest>;

export interface AddonConfiguration extends CreateAddonConfigurationRequest {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AccessorySubOption {
  id: string;
  accessoryOptionId: string;
  name: string;
  sortOrder: number;
}

export interface AccessoryOption {
  id: string;
  name: string;
  sortOrder: number;
  status?: 'ACTIVE' | 'INACTIVE';
  subOptions?: AccessorySubOption[];
}

export interface CreateAccessoryOptionRequest {
  name: string;
  sortOrder?: number;
}

export interface CreateAccessorySubOptionRequest {
  accessoryOptionId: string;
  name: string;
  sortOrder?: number;
}

export interface ListAddonConfigurationsParams {
  categoryId?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}
