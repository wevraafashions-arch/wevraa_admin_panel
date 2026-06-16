export interface StatusManagementOverview {
  totalCategories: number;
  totalSubcategories: number;
  totalWorkflows: number;
  activeWorkflows: number;
}

export interface StatusManagementMeta {
  colors: string[];
  icons: string[];
}

export interface StatusManagementCategory {
  id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  sortOrder: number;
  subcategoryCount: number;
  workflowCount: number;
}

export interface StatusParentRef {
  id: string;
  name: string;
}

export interface StatusManagementSubcategory {
  id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  sortOrder: number;
  parent: StatusParentRef;
  orderCount: number;
  statusCount: number;
  hasWorkflow: boolean;
}

export interface WorkflowStatus {
  id: string;
  subcategoryId: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  sortOrder: number;
  notifyCustomer: boolean;
  isActive: boolean;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkflowStats {
  total: number;
  active: number;
  withNotifications: number;
  defaultStatusName: string | null;
}

export interface SubcategoryWorkflowResponse {
  subcategory: {
    id: string;
    name: string;
    parent: StatusParentRef;
  };
  statuses: WorkflowStatus[];
  stats: WorkflowStats;
}

export interface CreateWorkflowStatusRequest {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  sortOrder?: number;
  notifyCustomer?: boolean;
  isActive?: boolean;
  isDefault?: boolean;
}

export type UpdateWorkflowStatusRequest = Partial<CreateWorkflowStatusRequest>;

export interface ReorderStatusesRequest {
  items: { id: string; sortOrder: number }[];
}
