import { useState, useRef } from 'react';
import { Plus, Edit, Trash2, ArrowLeft, ChevronRight, AlertCircle, CheckCircle, Clock, Package, Truck, X, GripVertical, Layers } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface OrderStatus {
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

interface SubCategory {
  id: number;
  name: string;
  description: string;
  orders: number;
  status: 'Active' | 'Inactive';
  statusCount: number;
}

interface StatusCategory {
  id: number;
  name: string;
  description: string;
  statusCount: number;
  icon: string;
  subCategories: SubCategory[];
}

interface DraggableStatusRowProps {
  status: OrderStatus;
  index: number;
  moveStatus: (dragIndex: number, hoverIndex: number) => void;
  onEdit: () => void;
  onDelete: () => void;
  getColorClasses: (color: string) => string;
  getIconComponent: (icon: string) => JSX.Element;
}

const DraggableStatusRow = ({ 
  status, 
  index, 
  moveStatus, 
  onEdit, 
  onDelete,
  getColorClasses,
  getIconComponent 
}: DraggableStatusRowProps) => {
  const ref = useRef<HTMLTableRowElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: 'status',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: { index: number }, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset?.y || 0) - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveStatus(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'status',
    item: () => {
      return { id: status.id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;
  drag(drop(ref));

  return (
    <tr 
      ref={ref} 
      data-handler-id={handlerId}
      className="hover:bg-gray-50 cursor-move" 
      style={{ opacity }}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-gray-400 cursor-grab active:cursor-grabbing" />
          <span className="text-sm font-medium text-gray-900">{status.order}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          {getIconComponent(status.icon)}
          <span className="text-sm font-medium text-gray-900">{status.name}</span>
          {status.isDefault && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
              Default
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-600 max-w-xs">{status.description}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getColorClasses(status.color)}`}>
          {status.color}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {status.notifyCustomer ? (
          <CheckCircle className="w-5 h-5 text-green-600" />
        ) : (
          <X className="w-5 h-5 text-gray-400" />
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          status.active
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {status.active ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex gap-2 justify-end">
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          {!status.isDefault && (
            <button
              onClick={onDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export function StatusManagementPage() {
  const [selectedCategory, setSelectedCategory] = useState<StatusCategory | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [isAddingStatus, setIsAddingStatus] = useState(false);
  const [editingStatus, setEditingStatus] = useState<OrderStatus | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: 'blue',
    icon: 'package',
    order: 1,
    notifyCustomer: true,
    active: true,
    isDefault: false,
  });

  const statusCategories: StatusCategory[] = [
    { 
      id: 1, 
      name: 'Blouse', 
      description: 'Status workflow for blouse orders', 
      statusCount: 7, 
      icon: '👚',
      subCategories: [
        { id: 1, name: 'Hand Embroidery', description: 'Blouse with hand embroidery work', orders: 45, status: 'Active', statusCount: 8 },
        { id: 2, name: 'Machine Embroidery', description: 'Blouse with machine embroidery', orders: 38, status: 'Active', statusCount: 7 },
        { id: 3, name: 'Princess Cut Blouse', description: 'Princess cut style blouse design', orders: 32, status: 'Active', statusCount: 7 },
        { id: 4, name: 'Katori Blouse', description: 'Katori style blouse stitching', orders: 28, status: 'Active', statusCount: 7 },
        { id: 5, name: 'Lining Blouse', description: 'Blouse with lining work', orders: 24, status: 'Active', statusCount: 7 },
        { id: 6, name: 'Lehenga Blouse', description: 'Blouse for lehenga outfit', orders: 20, status: 'Active', statusCount: 7 },
        { id: 7, name: 'Plain Blouse', description: 'Simple plain blouse stitching', orders: 18, status: 'Active', statusCount: 6 },
      ]
    },
    { 
      id: 2, 
      name: 'Topwear', 
      description: 'Status workflow for topwear orders', 
      statusCount: 7, 
      icon: '👗',
      subCategories: [
        { id: 1, name: 'Gown', description: 'Gown stitching and designing', orders: 56, status: 'Active', statusCount: 8 },
        { id: 2, name: 'Kurta', description: 'Kurta stitching service', orders: 48, status: 'Active', statusCount: 7 },
        { id: 3, name: 'Salwar', description: 'Salwar stitching service', orders: 42, status: 'Active', statusCount: 7 },
        { id: 4, name: 'Ghagra', description: 'Ghagra stitching and designing', orders: 35, status: 'Active', statusCount: 7 },
        { id: 5, name: 'Lehenga Top', description: 'Lehenga top stitching', orders: 28, status: 'Active', statusCount: 7 },
        { id: 6, name: 'Churidar', description: 'Churidar stitching service', orders: 25, status: 'Active', statusCount: 7 },
      ]
    },
    { 
      id: 3, 
      name: 'Bottomwear', 
      description: 'Status workflow for bottomwear orders', 
      statusCount: 7, 
      icon: '👖',
      subCategories: [
        { id: 1, name: 'Chudi Bottom', description: 'Chudi bottom stitching', orders: 52, status: 'Active', statusCount: 7 },
        { id: 2, name: 'Salwar Bottom', description: 'Salwar bottom stitching', orders: 48, status: 'Active', statusCount: 7 },
        { id: 3, name: 'Patiala', description: 'Patiala pants stitching', orders: 42, status: 'Active', statusCount: 7 },
        { id: 4, name: 'Palazzo', description: 'Palazzo pants stitching', orders: 38, status: 'Active', statusCount: 7 },
        { id: 5, name: 'Straight Pant', description: 'Straight pant stitching', orders: 32, status: 'Active', statusCount: 6 },
        { id: 6, name: 'Lehenga Bottom', description: 'Lehenga bottom stitching', orders: 27, status: 'Active', statusCount: 7 },
      ]
    },
    { 
      id: 4, 
      name: 'Others', 
      description: 'Status workflow for other tailoring services', 
      statusCount: 7, 
      icon: '✂️',
      subCategories: [
        { id: 1, name: 'Saree Krosha', description: 'Saree krosha work and finishing', orders: 45, status: 'Active', statusCount: 6 },
        { id: 2, name: 'Saree Zig-Zag & Falls', description: 'Saree zig-zag stitching and falls work', orders: 22, status: 'Active', statusCount: 5 },
      ]
    },
  ];

  // Default statuses - now organized by category and subcategory
  const statusesDataInitial: { [categoryId: number]: { [subCategoryId: number]: OrderStatus[] } } = {
    1: { // Blouse
      1: [ // Hand Embroidery - has extra embroidery stage
        { id: 1, name: 'Order Received', description: 'Order has been received and confirmed', color: 'blue', icon: 'package', order: 1, isDefault: true, notifyCustomer: true, active: true },
        { id: 2, name: 'Measurements Taken', description: 'Customer measurements have been recorded', color: 'indigo', icon: 'check', order: 2, notifyCustomer: true, active: true },
        { id: 3, name: 'Fabric Cutting', description: 'Fabric is being cut as per measurements', color: 'purple', icon: 'clock', order: 3, notifyCustomer: false, active: true },
        { id: 4, name: 'Embroidery Design Approval', description: 'Waiting for customer approval on embroidery design', color: 'yellow', icon: 'alert', order: 4, notifyCustomer: true, active: true },
        { id: 5, name: 'Hand Embroidery Work', description: 'Hand embroidery work is in progress', color: 'yellow', icon: 'clock', order: 5, notifyCustomer: true, active: true },
        { id: 6, name: 'Stitching in Progress', description: 'Final stitching work is in progress', color: 'orange', icon: 'clock', order: 6, notifyCustomer: false, active: true },
        { id: 7, name: 'Ready for Delivery', description: 'Order is ready for pickup/delivery', color: 'green', icon: 'truck', order: 7, notifyCustomer: true, active: true },
        { id: 8, name: 'Delivered', description: 'Order has been delivered to customer', color: 'emerald', icon: 'check', order: 8, notifyCustomer: true, active: true },
      ],
      2: [ // Machine Embroidery
        { id: 1, name: 'Order Received', description: 'Order has been received and confirmed', color: 'blue', icon: 'package', order: 1, isDefault: true, notifyCustomer: true, active: true },
        { id: 2, name: 'Measurements Taken', description: 'Customer measurements have been recorded', color: 'indigo', icon: 'check', order: 2, notifyCustomer: true, active: true },
        { id: 3, name: 'Fabric Cutting', description: 'Fabric is being cut as per measurements', color: 'purple', icon: 'clock', order: 3, notifyCustomer: false, active: true },
        { id: 4, name: 'Machine Embroidery', description: 'Machine embroidery work in progress', color: 'yellow', icon: 'clock', order: 4, notifyCustomer: true, active: true },
        { id: 5, name: 'Stitching in Progress', description: 'Stitching work is in progress', color: 'orange', icon: 'clock', order: 5, notifyCustomer: false, active: true },
        { id: 6, name: 'Ready for Delivery', description: 'Order is ready for pickup/delivery', color: 'green', icon: 'truck', order: 6, notifyCustomer: true, active: true },
        { id: 7, name: 'Delivered', description: 'Order has been delivered to customer', color: 'emerald', icon: 'check', order: 7, notifyCustomer: true, active: true },
      ],
      7: [ // Plain Blouse - simpler workflow
        { id: 1, name: 'Order Received', description: 'Order has been received and confirmed', color: 'blue', icon: 'package', order: 1, isDefault: true, notifyCustomer: true, active: true },
        { id: 2, name: 'Measurements Taken', description: 'Customer measurements have been recorded', color: 'indigo', icon: 'check', order: 2, notifyCustomer: true, active: true },
        { id: 3, name: 'Stitching in Progress', description: 'Stitching work is in progress', color: 'yellow', icon: 'clock', order: 3, notifyCustomer: true, active: true },
        { id: 4, name: 'Quality Check', description: 'Final quality inspection being done', color: 'orange', icon: 'alert', order: 4, notifyCustomer: false, active: true },
        { id: 5, name: 'Ready for Delivery', description: 'Order is ready for pickup/delivery', color: 'green', icon: 'truck', order: 5, notifyCustomer: true, active: true },
        { id: 6, name: 'Delivered', description: 'Order has been delivered to customer', color: 'emerald', icon: 'check', order: 6, notifyCustomer: true, active: true },
      ],
    },
    2: { // Topwear
      1: [ // Gown - complex workflow
        { id: 1, name: 'Order Received', description: 'Order has been received and confirmed', color: 'blue', icon: 'package', order: 1, isDefault: true, notifyCustomer: true, active: true },
        { id: 2, name: 'Measurements Taken', description: 'Customer measurements have been recorded', color: 'indigo', icon: 'check', order: 2, notifyCustomer: true, active: true },
        { id: 3, name: 'Design Finalization', description: 'Finalizing gown design with customer', color: 'purple', icon: 'alert', order: 3, notifyCustomer: true, active: true },
        { id: 4, name: 'Fabric Cutting', description: 'Fabric is being cut as per measurements', color: 'purple', icon: 'clock', order: 4, notifyCustomer: false, active: true },
        { id: 5, name: 'Stitching in Progress', description: 'Stitching work is in progress', color: 'yellow', icon: 'clock', order: 5, notifyCustomer: true, active: true },
        { id: 6, name: 'First Fitting', description: 'First fitting scheduled with customer', color: 'orange', icon: 'alert', order: 6, notifyCustomer: true, active: true },
        { id: 7, name: 'Ready for Delivery', description: 'Order is ready for pickup/delivery', color: 'green', icon: 'truck', order: 7, notifyCustomer: true, active: true },
        { id: 8, name: 'Delivered', description: 'Order has been delivered to customer', color: 'emerald', icon: 'check', order: 8, notifyCustomer: true, active: true },
      ],
    },
    3: { // Bottomwear
      5: [ // Straight Pant - simpler workflow
        { id: 1, name: 'Order Received', description: 'Order has been received and confirmed', color: 'blue', icon: 'package', order: 1, isDefault: true, notifyCustomer: true, active: true },
        { id: 2, name: 'Measurements Taken', description: 'Customer measurements have been recorded', color: 'indigo', icon: 'check', order: 2, notifyCustomer: true, active: true },
        { id: 3, name: 'Cutting & Stitching', description: 'Cutting and stitching in progress', color: 'yellow', icon: 'clock', order: 3, notifyCustomer: true, active: true },
        { id: 4, name: 'Finishing Work', description: 'Final finishing touches', color: 'orange', icon: 'clock', order: 4, notifyCustomer: false, active: true },
        { id: 5, name: 'Ready for Delivery', description: 'Order is ready for pickup/delivery', color: 'green', icon: 'truck', order: 5, notifyCustomer: true, active: true },
        { id: 6, name: 'Delivered', description: 'Order has been delivered to customer', color: 'emerald', icon: 'check', order: 6, notifyCustomer: true, active: true },
      ],
    },
    4: { // Others
      1: [ // Saree Krosha
        { id: 1, name: 'Order Received', description: 'Order has been received and confirmed', color: 'blue', icon: 'package', order: 1, isDefault: true, notifyCustomer: true, active: true },
        { id: 2, name: 'Krosha Work Started', description: 'Krosha work in progress', color: 'yellow', icon: 'clock', order: 2, notifyCustomer: true, active: true },
        { id: 3, name: 'Finishing Work', description: 'Final finishing and pressing', color: 'orange', icon: 'clock', order: 3, notifyCustomer: false, active: true },
        { id: 4, name: 'Quality Check', description: 'Final quality inspection being done', color: 'orange', icon: 'alert', order: 4, notifyCustomer: false, active: true },
        { id: 5, name: 'Ready for Delivery', description: 'Order is ready for pickup/delivery', color: 'green', icon: 'truck', order: 5, notifyCustomer: true, active: true },
        { id: 6, name: 'Delivered', description: 'Order has been delivered to customer', color: 'emerald', icon: 'check', order: 6, notifyCustomer: true, active: true },
      ],
      2: [ // Saree Zig-Zag & Falls
        { id: 1, name: 'Order Received', description: 'Order has been received and confirmed', color: 'blue', icon: 'package', order: 1, isDefault: true, notifyCustomer: true, active: true },
        { id: 2, name: 'Zig-Zag & Falls Work', description: 'Zig-zag stitching and falls attachment', color: 'yellow', icon: 'clock', order: 2, notifyCustomer: true, active: true },
        { id: 3, name: 'Quality Check', description: 'Final quality inspection being done', color: 'orange', icon: 'alert', order: 3, notifyCustomer: false, active: true },
        { id: 4, name: 'Ready for Delivery', description: 'Order is ready for pickup/delivery', color: 'green', icon: 'truck', order: 4, notifyCustomer: true, active: true },
        { id: 5, name: 'Delivered', description: 'Order has been delivered to customer', color: 'emerald', icon: 'check', order: 5, notifyCustomer: true, active: true },
      ],
    },
  };

  // Default statuses for categories/subcategories without specific workflows
  const getDefaultStatuses = (): OrderStatus[] => [
    { id: 1, name: 'Order Received', description: 'Order has been received and confirmed', color: 'blue', icon: 'package', order: 1, isDefault: true, notifyCustomer: true, active: true },
    { id: 2, name: 'Measurements Taken', description: 'Customer measurements have been recorded', color: 'indigo', icon: 'check', order: 2, notifyCustomer: true, active: true },
    { id: 3, name: 'Fabric Cutting', description: 'Fabric is being cut as per measurements', color: 'purple', icon: 'clock', order: 3, notifyCustomer: false, active: true },
    { id: 4, name: 'Stitching in Progress', description: 'Stitching work is in progress', color: 'yellow', icon: 'clock', order: 4, notifyCustomer: true, active: true },
    { id: 5, name: 'Quality Check', description: 'Final quality inspection being done', color: 'orange', icon: 'alert', order: 5, notifyCustomer: false, active: true },
    { id: 6, name: 'Ready for Delivery', description: 'Order is ready for pickup/delivery', color: 'green', icon: 'truck', order: 6, notifyCustomer: true, active: true },
    { id: 7, name: 'Delivered', description: 'Order has been delivered to customer', color: 'emerald', icon: 'check', order: 7, notifyCustomer: true, active: true },
  ];

  const [statuses, setStatuses] = useState(statusesDataInitial);

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
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
    return colorMap[color] || colorMap.blue;
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      package: Package,
      check: CheckCircle,
      clock: Clock,
      alert: AlertCircle,
      truck: Truck,
    };
    const Icon = iconMap[iconName] || Package;
    return <Icon className="w-4 h-4" />;
  };

  const handleDeleteStatus = (statusId: number) => {
    if (selectedCategory && selectedSubCategory && confirm('Are you sure you want to delete this status?')) {
      const categoryStatuses = statuses[selectedCategory.id] || {};
      const subCategoryStatuses = categoryStatuses[selectedSubCategory.id] || getDefaultStatuses();
      
      setStatuses({
        ...statuses,
        [selectedCategory.id]: {
          ...categoryStatuses,
          [selectedSubCategory.id]: subCategoryStatuses.filter(s => s.id !== statusId)
        }
      });
    }
  };

  const handleSaveStatus = () => {
    if (!selectedCategory || !selectedSubCategory || !formData.name.trim()) {
      alert('Please fill in the status name');
      return;
    }

    const categoryStatuses = statuses[selectedCategory.id] || {};
    const subCategoryStatuses = categoryStatuses[selectedSubCategory.id] || getDefaultStatuses();

    if (editingStatus) {
      // Update existing status
      const updatedStatuses = subCategoryStatuses.map(s =>
        s.id === editingStatus.id
          ? {
              ...s,
              name: formData.name,
              description: formData.description,
              color: formData.color,
              icon: formData.icon,
              order: formData.order,
              notifyCustomer: formData.notifyCustomer,
              active: formData.active,
            }
          : s
      );

      setStatuses({
        ...statuses,
        [selectedCategory.id]: {
          ...categoryStatuses,
          [selectedSubCategory.id]: updatedStatuses
        }
      });
    } else {
      // Add new status
      const newId = Math.max(...subCategoryStatuses.map(s => s.id), 0) + 1;
      const newStatus: OrderStatus = {
        id: newId,
        name: formData.name,
        description: formData.description,
        color: formData.color,
        icon: formData.icon,
        order: formData.order,
        notifyCustomer: formData.notifyCustomer,
        active: formData.active,
        isDefault: formData.isDefault && subCategoryStatuses.filter(s => s.isDefault).length === 0,
      };

      // If setting as default, remove default from others
      let updatedStatuses = subCategoryStatuses;
      if (newStatus.isDefault) {
        updatedStatuses = subCategoryStatuses.map(s => ({ ...s, isDefault: false }));
      }

      setStatuses({
        ...statuses,
        [selectedCategory.id]: {
          ...categoryStatuses,
          [selectedSubCategory.id]: [...updatedStatuses, newStatus]
        }
      });
    }

    // Reset form and close modal
    setIsAddingStatus(false);
    setEditingStatus(null);
    setFormData({
      name: '',
      description: '',
      color: 'blue',
      icon: 'package',
      order: 1,
      notifyCustomer: true,
      active: true,
      isDefault: false,
    });
  };

  const openAddModal = () => {
    if (!selectedCategory || !selectedSubCategory) return;
    
    const categoryStatuses = statuses[selectedCategory.id] || {};
    const subCategoryStatuses = categoryStatuses[selectedSubCategory.id] || getDefaultStatuses();
    const maxOrder = Math.max(...subCategoryStatuses.map(s => s.order), 0);

    setFormData({
      name: '',
      description: '',
      color: 'blue',
      icon: 'package',
      order: maxOrder + 1,
      notifyCustomer: true,
      active: true,
      isDefault: false,
    });
    setIsAddingStatus(true);
  };

  const openEditModal = (status: OrderStatus) => {
    setFormData({
      name: status.name,
      description: status.description,
      color: status.color,
      icon: status.icon,
      order: status.order,
      notifyCustomer: status.notifyCustomer,
      active: status.active,
      isDefault: status.isDefault || false,
    });
    setEditingStatus(status);
  };

  const closeModal = () => {
    setIsAddingStatus(false);
    setEditingStatus(null);
    setFormData({
      name: '',
      description: '',
      color: 'blue',
      icon: 'package',
      order: 1,
      notifyCustomer: true,
      active: true,
      isDefault: false,
    });
  };

  const moveStatus = (dragIndex: number, hoverIndex: number) => {
    if (!selectedCategory || !selectedSubCategory) return;

    const categoryStatuses = statuses[selectedCategory.id] || {};
    const subCategoryStatuses = categoryStatuses[selectedSubCategory.id] || getDefaultStatuses();
    
    const sortedStatuses = [...subCategoryStatuses].sort((a, b) => a.order - b.order);
    const draggedStatus = sortedStatuses[dragIndex];
    const updatedStatuses = [...sortedStatuses];
    
    updatedStatuses.splice(dragIndex, 1);
    updatedStatuses.splice(hoverIndex, 0, draggedStatus);
    
    // Recalculate order numbers
    const reorderedStatuses = updatedStatuses.map((status, index) => ({
      ...status,
      order: index + 1
    }));

    setStatuses({
      ...statuses,
      [selectedCategory.id]: {
        ...categoryStatuses,
        [selectedSubCategory.id]: reorderedStatuses
      }
    });
  };

  // Sub-Category Selection View
  if (selectedCategory && !selectedSubCategory) {
    return (
      <DndProvider backend={HTML5Backend}>
        <div className="space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-2 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Categories
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{selectedCategory.name}</span>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-2xl">
                {selectedCategory.icon}
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{selectedCategory.name} - Select Sub-Category</h2>
                <p className="text-sm text-gray-600 mt-1">Choose a sub-category to configure its status workflow</p>
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <Layers className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-900">Sub-Category Specific Workflows</h3>
              <p className="text-sm text-blue-700 mt-1">
                Each sub-category can have its own unique status workflow. For example, "Hand Embroidery" blouses may require additional approval stages compared to "Plain Blouse".
              </p>
            </div>
          </div>

          {/* Sub-Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedCategory.subCategories.map((subCategory) => (
              <div
                key={subCategory.id}
                onClick={() => setSelectedSubCategory(subCategory)}
                className="bg-white rounded-lg shadow hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{subCategory.name}</h3>
                      <p className="text-sm text-gray-600">{subCategory.description}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ml-3 ${
                      subCategory.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {subCategory.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500">Orders</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">{subCategory.orders}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Statuses</p>
                      <p className="text-lg font-semibold text-blue-600 mt-1">{subCategory.statusCount}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Configure Workflow</span>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600">Total Sub-Categories</p>
              <p className="text-2xl font-semibold text-gray-900 mt-2">{selectedCategory.subCategories.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-semibold text-blue-600 mt-2">
                {selectedCategory.subCategories.reduce((sum, sub) => sum + sub.orders, 0)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600">Active Sub-Categories</p>
              <p className="text-2xl font-semibold text-green-600 mt-2">
                {selectedCategory.subCategories.filter(sub => sub.status === 'Active').length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600">Total Statuses</p>
              <p className="text-2xl font-semibold text-purple-600 mt-2">
                {selectedCategory.subCategories.reduce((sum, sub) => sum + sub.statusCount, 0)}
              </p>
            </div>
          </div>
        </div>
      </DndProvider>
    );
  }

  // Status Workflow Detail View
  if (selectedCategory && selectedSubCategory) {
    const categoryStatuses = statuses[selectedCategory.id] || {};
    const subCategoryStatuses = categoryStatuses[selectedSubCategory.id] || getDefaultStatuses();
    const sortedStatuses = [...subCategoryStatuses].sort((a, b) => a.order - b.order);

    return (
      <DndProvider backend={HTML5Backend}>
        <div className="space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSelectedSubCategory(null);
              }}
              className="hover:text-blue-600 transition-colors"
            >
              Status Management
            </button>
            <ChevronRight className="w-4 h-4" />
            <button
              onClick={() => setSelectedSubCategory(null)}
              className="hover:text-blue-600 transition-colors"
            >
              {selectedCategory.name}
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{selectedSubCategory.name}</span>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-2xl">
                {selectedCategory.icon}
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {selectedCategory.name} - {selectedSubCategory.name}
                </h2>
                <p className="text-sm text-gray-600 mt-1">{selectedSubCategory.description}</p>
              </div>
            </div>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Status
            </button>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-900">Status Workflow Configuration</h3>
              <p className="text-sm text-blue-700 mt-1">
                Define the status stages for {selectedSubCategory.name.toLowerCase()} orders. Drag and drop to reorder statuses. Customers will be notified automatically when orders move to stages with "Notify Customer" enabled.
              </p>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Status Progression Timeline</h3>
            <div className="space-y-4">
              {sortedStatuses.map((status, index) => (
                <div key={status.id} className="flex items-start gap-4">
                  {/* Timeline Line */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full ${getColorClasses(status.color)} border-2 flex items-center justify-center`}>
                      {getIconComponent(status.icon)}
                    </div>
                    {index < sortedStatuses.length - 1 && (
                      <div className="w-0.5 h-16 bg-gray-300 my-1"></div>
                    )}
                  </div>

                  {/* Status Details Card */}
                  <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-base font-semibold text-gray-900">{status.name}</h4>
                          {status.isDefault && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                              Default
                            </span>
                          )}
                          {!status.active && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                              Inactive
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{status.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Order:</span>
                            <span>{status.order}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Notify Customer:</span>
                            <span className={status.notifyCustomer ? 'text-green-600 font-medium' : 'text-gray-500'}>
                              {status.notifyCustomer ? 'Yes' : 'No'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => openEditModal(status)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit status"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {!status.isDefault && (
                          <button
                            onClick={() => handleDeleteStatus(status.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete status"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Table with Drag & Drop */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">All Statuses</h3>
              <p className="text-sm text-gray-500">💡 Drag rows to reorder</p>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notify</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedStatuses.map((status, index) => (
                  <DraggableStatusRow
                    key={status.id}
                    status={status}
                    index={index}
                    moveStatus={moveStatus}
                    onEdit={() => openEditModal(status)}
                    onDelete={() => handleDeleteStatus(status.id)}
                    getColorClasses={getColorClasses}
                    getIconComponent={getIconComponent}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600">Total Statuses</p>
              <p className="text-2xl font-semibold text-gray-900 mt-2">{sortedStatuses.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600">Active Statuses</p>
              <p className="text-2xl font-semibold text-green-600 mt-2">
                {sortedStatuses.filter(s => s.active).length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600">With Notifications</p>
              <p className="text-2xl font-semibold text-blue-600 mt-2">
                {sortedStatuses.filter(s => s.notifyCustomer).length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600">Default Status</p>
              <p className="text-sm font-medium text-gray-900 mt-2">
                {sortedStatuses.find(s => s.isDefault)?.name || 'None'}
              </p>
            </div>
          </div>

          {/* Add/Edit Status Modal */}
          {(isAddingStatus || editingStatus) && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 z-10">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {editingStatus ? 'Edit Status' : 'Add New Status'}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Stitching in Progress"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      placeholder="Brief description of this status stage"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color
                      </label>
                      <select
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="blue">Blue</option>
                        <option value="indigo">Indigo</option>
                        <option value="purple">Purple</option>
                        <option value="yellow">Yellow</option>
                        <option value="orange">Orange</option>
                        <option value="green">Green</option>
                        <option value="emerald">Emerald</option>
                        <option value="red">Red</option>
                        <option value="gray">Gray</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Icon
                      </label>
                      <select
                        value={formData.icon}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="package">Package</option>
                        <option value="check">Check Circle</option>
                        <option value="clock">Clock</option>
                        <option value="alert">Alert Circle</option>
                        <option value="truck">Truck</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order Position
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g., 1"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Lower numbers appear first in the workflow</p>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.notifyCustomer}
                        onChange={(e) => setFormData({ ...formData, notifyCustomer: e.target.checked })}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-900">Notify Customer</span>
                        <p className="text-xs text-gray-500">Send automatic notification when order reaches this status</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.active}
                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-900">Active</span>
                        <p className="text-xs text-gray-500">Only active statuses can be assigned to orders</p>
                      </div>
                    </label>

                    {!editingStatus && (
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isDefault}
                          onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-900">Set as Default Status</span>
                          <p className="text-xs text-gray-500">New orders will automatically get this status</p>
                        </div>
                      </label>
                    )}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 sticky bottom-0">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveStatus}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingStatus ? 'Update Status' : 'Add Status'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DndProvider>
    );
  }

  // Main Categories Grid View
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Status Management</h2>
            <p className="text-sm text-gray-600 mt-1">
              Configure order status workflows for each tailoring category and sub-category
            </p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Status Tracking & Customer Updates</h3>
              <p className="text-sm text-gray-700 mb-3">
                Define custom status workflows for each category and sub-category to track order progress from received to delivered. 
                Customers will automatically receive notifications via SMS/Email when their order status changes.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-gray-900">Automatic Notifications</span>
                    <p className="text-gray-600">Customers get real-time updates</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Layers className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-gray-900">Sub-Category Workflows</span>
                    <p className="text-gray-600">Unique stages per sub-category</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <GripVertical className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-gray-900">Drag & Drop Reorder</span>
                    <p className="text-gray-600">Easily rearrange status order</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statusCategories.map((category) => (
            <div
              key={category.id}
              onClick={() => setSelectedCategory(category)}
              className="bg-white rounded-lg shadow hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
            >
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6">
                <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg flex items-center justify-center text-4xl mb-3">
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold text-white">{category.name}</h3>
              </div>
              
              <div className="p-6">
                <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">{category.subCategories.length}</span> sub-categories
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Categories</p>
                <p className="text-2xl font-semibold text-gray-900">{statusCategories.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Layers className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Sub-Categories</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {statusCategories.reduce((sum, cat) => sum + cat.subCategories.length, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Workflows</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {Object.values(statuses).reduce((sum, cat) => sum + Object.keys(cat).length, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Workflows</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {Object.values(statuses).reduce((sum, cat) => sum + Object.keys(cat).length, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
