import { apiClient } from '../client';
import type {
  CreateWorkflowStatusRequest,
  ReorderStatusesRequest,
  StatusManagementCategory,
  StatusManagementMeta,
  StatusManagementOverview,
  StatusManagementSubcategory,
  SubcategoryWorkflowResponse,
  UpdateWorkflowStatusRequest,
  WorkflowStatus,
} from '../types/statusManagement';

const PATH = '/status-management';

export const statusManagementService = {
  async getOverview(): Promise<StatusManagementOverview> {
    return apiClient<StatusManagementOverview>(`${PATH}/overview`, { method: 'GET' });
  },

  async getMeta(): Promise<StatusManagementMeta> {
    return apiClient<StatusManagementMeta>(`${PATH}/meta`, { method: 'GET' });
  },

  async listCategories(): Promise<StatusManagementCategory[]> {
    return apiClient<StatusManagementCategory[]>(`${PATH}/categories`, { method: 'GET' });
  },

  async listSubcategories(categoryId: string): Promise<StatusManagementSubcategory[]> {
    return apiClient<StatusManagementSubcategory[]>(
      `${PATH}/categories/${categoryId}/subcategories`,
      { method: 'GET' }
    );
  },

  async getWorkflow(subcategoryId: string): Promise<SubcategoryWorkflowResponse> {
    return apiClient<SubcategoryWorkflowResponse>(
      `${PATH}/subcategories/${subcategoryId}/statuses`,
      { method: 'GET' }
    );
  },

  async getStatusById(id: string): Promise<WorkflowStatus> {
    return apiClient<WorkflowStatus>(`${PATH}/statuses/${id}`, { method: 'GET' });
  },

  async createStatus(
    subcategoryId: string,
    body: CreateWorkflowStatusRequest
  ): Promise<WorkflowStatus> {
    return apiClient<WorkflowStatus>(`${PATH}/subcategories/${subcategoryId}/statuses`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async updateStatus(id: string, body: UpdateWorkflowStatusRequest): Promise<WorkflowStatus> {
    return apiClient<WorkflowStatus>(`${PATH}/statuses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  async reorderStatuses(
    subcategoryId: string,
    body: ReorderStatusesRequest
  ): Promise<SubcategoryWorkflowResponse> {
    return apiClient<SubcategoryWorkflowResponse>(
      `${PATH}/subcategories/${subcategoryId}/statuses/reorder`,
      {
        method: 'PATCH',
        body: JSON.stringify(body),
      }
    );
  },

  async deleteStatus(id: string): Promise<{ message?: string }> {
    return apiClient<{ message?: string }>(`${PATH}/statuses/${id}`, { method: 'DELETE' });
  },
};
