import { apiClient } from '../client';
import type { DashboardOverviewResponse } from '../types/dashboard';

const DASHBOARD_PATH = '/dashboard';

export const dashboardService = {
  /** GET /dashboard/overview – overview metrics for admin dashboard */
  async getOverview(): Promise<DashboardOverviewResponse> {
    return apiClient<DashboardOverviewResponse>(`${DASHBOARD_PATH}/overview`, { method: 'GET' });
  },
};
