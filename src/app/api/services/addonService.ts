import { apiClient } from '../client';
import type {
  AccessoryOption,
  AccessorySubOption,
  AddonConfiguration,
  CreateAccessoryOptionRequest,
  CreateAccessorySubOptionRequest,
  CreateAddonConfigurationRequest,
  ListAddonConfigurationsParams,
  UpdateAddonConfigurationRequest,
  UpdateAccessorySubOptionRequest,
} from '../types/addon';

const ADDON_PATH = '/addon';

function buildConfigQuery(params: ListAddonConfigurationsParams = {}): string {
  const q = new URLSearchParams();
  if (params.categoryId) q.set('categoryId', params.categoryId);
  if (params.status) q.set('status', params.status);
  const s = q.toString();
  return s ? `?${s}` : '';
}

export const addonService = {
  async listConfigurations(params: ListAddonConfigurationsParams = {}): Promise<AddonConfiguration[]> {
    return apiClient<AddonConfiguration[]>(`${ADDON_PATH}/configurations${buildConfigQuery(params)}`, {
      method: 'GET',
    });
  },

  async getConfigurationById(id: string): Promise<AddonConfiguration> {
    return apiClient<AddonConfiguration>(`${ADDON_PATH}/configurations/${id}`, { method: 'GET' });
  },

  async createConfiguration(body: CreateAddonConfigurationRequest): Promise<AddonConfiguration> {
    return apiClient<AddonConfiguration>(`${ADDON_PATH}/configurations`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  /** PATCH /addon/configurations/:id — partial body; accessories / selectedSubOptionIds replace when sent. */
  async updateConfiguration(id: string, body: UpdateAddonConfigurationRequest): Promise<AddonConfiguration> {
    return apiClient<AddonConfiguration>(`${ADDON_PATH}/configurations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  /** DELETE /addon/configurations/:id */
  async deleteConfiguration(id: string): Promise<void> {
    await apiClient<void>(`${ADDON_PATH}/configurations/${id}`, { method: 'DELETE' });
  },

  async listAccessoryOptions(): Promise<AccessoryOption[]> {
    return apiClient<AccessoryOption[]>(`${ADDON_PATH}/accessory-options`, { method: 'GET' });
  },

  /** GET /addon/accessory-options/:id */
  async getAccessoryOptionById(id: string): Promise<AccessoryOption> {
    return apiClient<AccessoryOption>(`${ADDON_PATH}/accessory-options/${id}`, { method: 'GET' });
  },

  async createAccessoryOption(body: CreateAccessoryOptionRequest): Promise<AccessoryOption> {
    return apiClient<AccessoryOption>(`${ADDON_PATH}/accessory-options`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async listSubOptions(accessoryOptionId: string): Promise<AccessorySubOption[]> {
    return apiClient<AccessorySubOption[]>(
      `${ADDON_PATH}/accessory-options/${accessoryOptionId}/sub-options`,
      { method: 'GET' }
    );
  },

  async createAccessorySubOption(body: CreateAccessorySubOptionRequest): Promise<AccessorySubOption> {
    return apiClient<AccessorySubOption>(`${ADDON_PATH}/accessory-sub-options`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async updateAccessorySubOption(id: string, body: UpdateAccessorySubOptionRequest): Promise<AccessorySubOption> {
    return apiClient<AccessorySubOption>(`${ADDON_PATH}/accessory-sub-options/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  async deleteAccessorySubOption(id: string): Promise<void> {
    await apiClient<void>(`${ADDON_PATH}/accessory-sub-options/${id}`, { method: 'DELETE' });
  },
};
