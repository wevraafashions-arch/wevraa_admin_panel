export interface OrderStatus {
  id: number;
  name: string;
  description: string;
  color: string;
  icon: string;
  order: number;
  isDefault?: boolean;
  notifyCustomer: boolean;
  active: boolean;
}

export interface StatusCategory {
  id: number;
  name: string;
}

export interface StatusSubCategory {
  id: number;
  categoryId: number;
  name: string;
}

// Status categories
export const STATUS_CATEGORIES: StatusCategory[] = [
  { id: 1, name: 'Blouse' },
  { id: 2, name: 'Topwear' },
  { id: 3, name: 'Bottomwear' },
  { id: 4, name: 'Others' },
];

// Status sub-categories
export const STATUS_SUBCATEGORIES: StatusSubCategory[] = [
  // Blouse
  { id: 1, categoryId: 1, name: 'Hand Embroidery' },
  { id: 2, categoryId: 1, name: 'Machine Embroidery' },
  { id: 3, categoryId: 1, name: 'Princess Cut Blouse' },
  { id: 4, categoryId: 1, name: 'Katori Blouse' },
  { id: 5, categoryId: 1, name: 'Lining Blouse' },
  { id: 6, categoryId: 1, name: 'Lehenga Blouse' },
  { id: 7, categoryId: 1, name: 'Plain Blouse' },
  // Topwear
  { id: 8, categoryId: 2, name: 'Gown' },
  { id: 9, categoryId: 2, name: 'Kurta' },
  { id: 10, categoryId: 2, name: 'Salwar' },
  { id: 11, categoryId: 2, name: 'Ghagra' },
  { id: 12, categoryId: 2, name: 'Lehenga Top' },
  { id: 13, categoryId: 2, name: 'Churidar' },
  // Bottomwear
  { id: 14, categoryId: 3, name: 'Chudi Bottom' },
  { id: 15, categoryId: 3, name: 'Salwar Bottom' },
  { id: 16, categoryId: 3, name: 'Patiala' },
  { id: 17, categoryId: 3, name: 'Palazzo' },
  { id: 18, categoryId: 3, name: 'Straight Pant' },
  { id: 19, categoryId: 3, name: 'Lehenga Bottom' },
  // Others
  { id: 20, categoryId: 4, name: 'Saree Krosha' },
  { id: 21, categoryId: 4, name: 'Saree Zig-Zag & Falls' },
];

// Default statuses for all categories/subcategories
export const DEFAULT_STATUSES: OrderStatus[] = [
  { id: 1, name: 'Order Received', description: 'Order has been received and confirmed', color: 'blue', icon: 'package', order: 1, isDefault: true, notifyCustomer: true, active: true },
  { id: 2, name: 'Measurements Taken', description: 'Customer measurements have been recorded', color: 'indigo', icon: 'check', order: 2, notifyCustomer: true, active: true },
  { id: 3, name: 'Fabric Cutting', description: 'Fabric is being cut as per measurements', color: 'purple', icon: 'clock', order: 3, notifyCustomer: false, active: true },
  { id: 4, name: 'Stitching in Progress', description: 'Stitching work is in progress', color: 'yellow', icon: 'clock', order: 4, notifyCustomer: true, active: true },
  { id: 5, name: 'Quality Check', description: 'Final quality inspection being done', color: 'orange', icon: 'alert', order: 5, notifyCustomer: false, active: true },
  { id: 6, name: 'Ready for Delivery', description: 'Order is ready for pickup/delivery', color: 'green', icon: 'truck', order: 6, notifyCustomer: true, active: true },
  { id: 7, name: 'Delivered', description: 'Order has been delivered to customer', color: 'emerald', icon: 'check', order: 7, notifyCustomer: true, active: true },
];

// Specific statuses by category and subcategory
export const STATUSES_BY_SUBCATEGORY: { [key: string]: OrderStatus[] } = {
  // Blouse - Hand Embroidery (1-1)
  '1-1': [
    { id: 1, name: 'Order Received', description: 'Order has been received and confirmed', color: 'blue', icon: 'package', order: 1, isDefault: true, notifyCustomer: true, active: true },
    { id: 2, name: 'Measurements Taken', description: 'Customer measurements have been recorded', color: 'indigo', icon: 'check', order: 2, notifyCustomer: true, active: true },
    { id: 3, name: 'Fabric Cutting', description: 'Fabric is being cut as per measurements', color: 'purple', icon: 'clock', order: 3, notifyCustomer: false, active: true },
    { id: 4, name: 'Embroidery Design Approval', description: 'Waiting for customer approval on embroidery design', color: 'yellow', icon: 'alert', order: 4, notifyCustomer: true, active: true },
    { id: 5, name: 'Hand Embroidery Work', description: 'Hand embroidery work is in progress', color: 'yellow', icon: 'clock', order: 5, notifyCustomer: true, active: true },
    { id: 6, name: 'Stitching in Progress', description: 'Final stitching work is in progress', color: 'orange', icon: 'clock', order: 6, notifyCustomer: false, active: true },
    { id: 7, name: 'Ready for Delivery', description: 'Order is ready for pickup/delivery', color: 'green', icon: 'truck', order: 7, notifyCustomer: true, active: true },
    { id: 8, name: 'Delivered', description: 'Order has been delivered to customer', color: 'emerald', icon: 'check', order: 8, notifyCustomer: true, active: true },
  ],
  // Blouse - Machine Embroidery (1-2)
  '1-2': [
    { id: 1, name: 'Order Received', description: 'Order has been received and confirmed', color: 'blue', icon: 'package', order: 1, isDefault: true, notifyCustomer: true, active: true },
    { id: 2, name: 'Measurements Taken', description: 'Customer measurements have been recorded', color: 'indigo', icon: 'check', order: 2, notifyCustomer: true, active: true },
    { id: 3, name: 'Fabric Cutting', description: 'Fabric is being cut as per measurements', color: 'purple', icon: 'clock', order: 3, notifyCustomer: false, active: true },
    { id: 4, name: 'Machine Embroidery', description: 'Machine embroidery work in progress', color: 'yellow', icon: 'clock', order: 4, notifyCustomer: true, active: true },
    { id: 5, name: 'Stitching in Progress', description: 'Stitching work is in progress', color: 'orange', icon: 'clock', order: 5, notifyCustomer: false, active: true },
    { id: 6, name: 'Ready for Delivery', description: 'Order is ready for pickup/delivery', color: 'green', icon: 'truck', order: 6, notifyCustomer: true, active: true },
    { id: 7, name: 'Delivered', description: 'Order has been delivered to customer', color: 'emerald', icon: 'check', order: 7, notifyCustomer: true, active: true },
  ],
  // Blouse - Plain Blouse (1-7)
  '1-7': [
    { id: 1, name: 'Order Received', description: 'Order has been received and confirmed', color: 'blue', icon: 'package', order: 1, isDefault: true, notifyCustomer: true, active: true },
    { id: 2, name: 'Measurements Taken', description: 'Customer measurements have been recorded', color: 'indigo', icon: 'check', order: 2, notifyCustomer: true, active: true },
    { id: 3, name: 'Stitching in Progress', description: 'Stitching work is in progress', color: 'yellow', icon: 'clock', order: 3, notifyCustomer: true, active: true },
    { id: 4, name: 'Quality Check', description: 'Final quality inspection being done', color: 'orange', icon: 'alert', order: 4, notifyCustomer: false, active: true },
    { id: 5, name: 'Ready for Delivery', description: 'Order is ready for pickup/delivery', color: 'green', icon: 'truck', order: 5, notifyCustomer: true, active: true },
    { id: 6, name: 'Delivered', description: 'Order has been delivered to customer', color: 'emerald', icon: 'check', order: 6, notifyCustomer: true, active: true },
  ],
  // Topwear - Gown (2-8)
  '2-8': [
    { id: 1, name: 'Order Received', description: 'Order has been received and confirmed', color: 'blue', icon: 'package', order: 1, isDefault: true, notifyCustomer: true, active: true },
    { id: 2, name: 'Measurements Taken', description: 'Customer measurements have been recorded', color: 'indigo', icon: 'check', order: 2, notifyCustomer: true, active: true },
    { id: 3, name: 'Design Finalization', description: 'Finalizing gown design with customer', color: 'purple', icon: 'alert', order: 3, notifyCustomer: true, active: true },
    { id: 4, name: 'Fabric Cutting', description: 'Fabric is being cut as per measurements', color: 'purple', icon: 'clock', order: 4, notifyCustomer: false, active: true },
    { id: 5, name: 'Stitching in Progress', description: 'Stitching work is in progress', color: 'yellow', icon: 'clock', order: 5, notifyCustomer: true, active: true },
    { id: 6, name: 'First Fitting', description: 'First fitting scheduled with customer', color: 'orange', icon: 'alert', order: 6, notifyCustomer: true, active: true },
    { id: 7, name: 'Ready for Delivery', description: 'Order is ready for pickup/delivery', color: 'green', icon: 'truck', order: 7, notifyCustomer: true, active: true },
    { id: 8, name: 'Delivered', description: 'Order has been delivered to customer', color: 'emerald', icon: 'check', order: 8, notifyCustomer: true, active: true },
  ],
  // Bottomwear - Straight Pant (3-18)
  '3-18': [
    { id: 1, name: 'Order Received', description: 'Order has been received and confirmed', color: 'blue', icon: 'package', order: 1, isDefault: true, notifyCustomer: true, active: true },
    { id: 2, name: 'Measurements Taken', description: 'Customer measurements have been recorded', color: 'indigo', icon: 'check', order: 2, notifyCustomer: true, active: true },
    { id: 3, name: 'Cutting & Stitching', description: 'Cutting and stitching in progress', color: 'yellow', icon: 'clock', order: 3, notifyCustomer: true, active: true },
    { id: 4, name: 'Finishing Work', description: 'Final finishing touches', color: 'orange', icon: 'clock', order: 4, notifyCustomer: false, active: true },
    { id: 5, name: 'Ready for Delivery', description: 'Order is ready for pickup/delivery', color: 'green', icon: 'truck', order: 5, notifyCustomer: true, active: true },
    { id: 6, name: 'Delivered', description: 'Order has been delivered to customer', color: 'emerald', icon: 'check', order: 6, notifyCustomer: true, active: true },
  ],
  // Others - Saree Krosha (4-20)
  '4-20': [
    { id: 1, name: 'Order Received', description: 'Order has been received and confirmed', color: 'blue', icon: 'package', order: 1, isDefault: true, notifyCustomer: true, active: true },
    { id: 2, name: 'Krosha Work Started', description: 'Krosha work in progress', color: 'yellow', icon: 'clock', order: 2, notifyCustomer: true, active: true },
    { id: 3, name: 'Finishing Work', description: 'Final finishing and pressing', color: 'orange', icon: 'clock', order: 3, notifyCustomer: false, active: true },
    { id: 4, name: 'Quality Check', description: 'Final quality inspection being done', color: 'orange', icon: 'alert', order: 4, notifyCustomer: false, active: true },
    { id: 5, name: 'Ready for Delivery', description: 'Order is ready for pickup/delivery', color: 'green', icon: 'truck', order: 5, notifyCustomer: true, active: true },
    { id: 6, name: 'Delivered', description: 'Order has been delivered to customer', color: 'emerald', icon: 'check', order: 6, notifyCustomer: true, active: true },
  ],
  // Others - Saree Zig-Zag & Falls (4-21)
  '4-21': [
    { id: 1, name: 'Order Received', description: 'Order has been received and confirmed', color: 'blue', icon: 'package', order: 1, isDefault: true, notifyCustomer: true, active: true },
    { id: 2, name: 'Zig-Zag & Falls Work', description: 'Zig-zag stitching and falls attachment', color: 'yellow', icon: 'clock', order: 2, notifyCustomer: true, active: true },
    { id: 3, name: 'Quality Check', description: 'Final quality inspection being done', color: 'orange', icon: 'alert', order: 3, notifyCustomer: false, active: true },
    { id: 4, name: 'Ready for Delivery', description: 'Order is ready for pickup/delivery', color: 'green', icon: 'truck', order: 4, notifyCustomer: true, active: true },
    { id: 5, name: 'Delivered', description: 'Order has been delivered to customer', color: 'emerald', icon: 'check', order: 5, notifyCustomer: true, active: true },
  ],
};

// Utility function to get statuses for a specific category and subcategory
export const getStatusesForSubCategory = (categoryId: number, subCategoryId: number): OrderStatus[] => {
  const key = `${categoryId}-${subCategoryId}`;
  return STATUSES_BY_SUBCATEGORY[key] || DEFAULT_STATUSES;
};

// Utility function to get color classes for status
export const getStatusColorClasses = (color: string): string => {
  const colorMap: { [key: string]: string } = {
    blue: 'bg-blue-100 text-blue-800',
    indigo: 'bg-indigo-100 text-indigo-800',
    purple: 'bg-purple-100 text-purple-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    orange: 'bg-orange-100 text-orange-800',
    green: 'bg-green-100 text-green-800',
    emerald: 'bg-emerald-100 text-emerald-800',
    red: 'bg-red-100 text-red-800',
    gray: 'bg-gray-100 text-gray-800',
  };
  return colorMap[color] || colorMap.blue;
};

// Utility function to get status by name from a specific subcategory
export const getStatusByName = (categoryId: number, subCategoryId: number, statusName: string): OrderStatus | undefined => {
  const statuses = getStatusesForSubCategory(categoryId, subCategoryId);
  return statuses.find(s => s.name === statusName);
};
