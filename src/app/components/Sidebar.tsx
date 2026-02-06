import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Logo } from './Logo';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Box,
  Users,
  FolderTree,
  Grid3x3,
  Scissors,
  ClipboardList,
  UserCircle,
  Ruler,
  Image,
  Receipt,
  UserCog,
  MapPin,
  Bell,
  FileText,
  Settings,
  ChevronDown,
  ChevronRight,
  UsersRound,
  Star,
  MessageCircle,
  ListChecks,
  Briefcase,
  ImageIcon,
  Store,
  Percent,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'ecommerce',
    label: 'E-commerce',
    icon: ShoppingCart,
    children: [
      { id: 'orders', label: 'Orders', icon: ShoppingCart },
      { id: 'products', label: 'Products', icon: Package },
      { id: 'inventory', label: 'Inventory', icon: Box },
      { id: 'customers', label: 'Customers', icon: Users },
      { id: 'reviews', label: 'Customer Reviews', icon: Star },
      { id: 'categories', label: 'Categories', icon: FolderTree },
      { id: 'collections', label: 'Collections', icon: Grid3x3 },
      { id: 'vendors', label: 'Vendors', icon: Store },
    ],
  },
  {
    id: 'tailoring',
    label: 'Tailoring',
    icon: Scissors,
    children: [
      { id: 'tailors-list', label: 'Tailors', icon: UsersRound },
      { id: 'tailor-orders', label: 'Tailor Orders', icon: ClipboardList },
      { id: 'tailor-customers', label: 'Tailor Customers', icon: UserCircle },
      { id: 'tailor-ratings', label: 'Tailor Ratings', icon: Star },
      { id: 'tailor-gallery', label: 'My Gallery', icon: ImageIcon },
      { id: 'tailor-chat', label: 'Customer Chat', icon: MessageCircle },
      { id: 'tailor-categories', label: 'Categories', icon: FolderTree },
      { id: 'status-management', label: 'Status Management', icon: ListChecks },
      { id: 'staffs', label: 'Staffs', icon: Briefcase },
      { id: 'measurements', label: 'Measurements', icon: Ruler },
      { id: 'design-gallery', label: 'Design Gallery', icon: Image },
      { id: 'add-ons', label: 'Add-Ons', icon: Package },
      { id: 'tax-settings', label: 'Tax Settings', icon: Percent },
    ],
  },
  {
    id: 'invoices',
    label: 'Invoices & Payments',
    icon: Receipt,
  },
  {
    id: 'users',
    label: 'Users & Roles',
    icon: UserCog,
  },
  {
    id: 'locations',
    label: 'Locations',
    icon: MapPin,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
  },
  {
    id: 'audit',
    label: 'Audit Logs',
    icon: FileText,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
  },
];

interface SidebarProps {
  onSidebarClose?: () => void;
}

export function Sidebar({ onSidebarClose }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(['ecommerce', 'tailoring'])
  );

  const toggleExpand = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const renderNavItem = (item: NavItem, level: number = 0) => {
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const path = item.id === 'dashboard' ? '/' : `/${item.id}`;
    const isIndex = item.id === 'dashboard';

    if (hasChildren) {
      return (
        <div key={item.id}>
          <button
            type="button"
            onClick={() => toggleExpand(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
              level > 0 ? 'pl-12' : ''
            } text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700`}
          >
            <item.icon className="w-5 h-5" />
            <span className="flex-1 text-left">{item.label}</span>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          {isExpanded && (
            <div>
              {item.children!.map((child) => renderNavItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div key={item.id}>
        <NavLink
          to={path}
          end={isIndex}
          onClick={onSidebarClose}
          className={({ isActive }) =>
            `w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
              level > 0 ? 'pl-12' : ''
            } ${
              isActive
                ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-r-2 border-blue-700 dark:border-blue-500'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`
          }
        >
          <item.icon className="w-5 h-5" />
          <span className="flex-1 text-left">{item.label}</span>
        </NavLink>
      </div>
    );
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen overflow-y-auto flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <Logo className="h-8 w-auto text-gray-900 dark:text-white" />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Management System
        </p>
      </div>
      <nav className="flex-1 py-4">
        {navItems.map((item) => renderNavItem(item))}
      </nav>
    </aside>
  );
}
