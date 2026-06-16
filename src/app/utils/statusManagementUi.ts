import {
  AlertCircle,
  CheckCircle,
  Clock,
  Package,
  Ruler,
  Scissors,
  Sparkles,
  Truck,
  type LucideIcon,
} from 'lucide-react';
import type { WorkflowStatus } from '@/app/api/types/statusManagement';

export interface DisplayStatus {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  order: number;
  isDefault: boolean;
  notifyCustomer: boolean;
  active: boolean;
}

export function mapWorkflowStatus(s: WorkflowStatus): DisplayStatus {
  return {
    id: s.id,
    name: s.name,
    description: s.description ?? '',
    color: s.color,
    icon: s.icon,
    order: s.sortOrder,
    isDefault: s.isDefault,
    notifyCustomer: s.notifyCustomer,
    active: s.isActive,
  };
}

const ICON_MAP: Record<string, LucideIcon> = {
  Package,
  CheckCircle,
  Clock,
  AlertCircle,
  Truck,
  Scissors,
  Ruler,
  Sparkles,
  package: Package,
  check: CheckCircle,
  clock: Clock,
  alert: AlertCircle,
  truck: Truck,
};

export function getStatusColorClasses(color: string): string {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    orange: 'bg-orange-100 text-orange-800 border-orange-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    red: 'bg-red-100 text-red-800 border-red-200',
    gray: 'bg-gray-100 text-gray-800 border-gray-200',
  };
  return colorMap[color] ?? colorMap.blue;
}

export function getStatusIconComponent(iconName: string, className = 'w-4 h-4') {
  const Icon = ICON_MAP[iconName] ?? Package;
  return Icon;
}

export function formatCategoryStatus(status: string): 'Active' | 'Inactive' {
  return status === 'ACTIVE' ? 'Active' : 'Inactive';
}
