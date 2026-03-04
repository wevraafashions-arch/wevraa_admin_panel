/** Single metric from GET /dashboard/overview */
export interface DashboardMetric {
  value: number;
  changePercent: number;
  label: string;
  description: string;
}

/** Response from GET /dashboard/overview */
export interface DashboardOverviewResponse {
  eCommerceCustomers: DashboardMetric;
  tailorCustomers: DashboardMetric;
  activeTailors: DashboardMetric;
  eCommerceOrders: DashboardMetric;
}
