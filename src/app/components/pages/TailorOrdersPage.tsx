import { useState } from 'react';
import { Plus, Search, Calendar, FileText, IndianRupee, Eye, Download, Edit as EditIcon, ChevronDown } from 'lucide-react';
import { getStatusesForSubCategory, getStatusColorClasses, getStatusByName, STATUS_CATEGORIES, STATUS_SUBCATEGORIES } from '@/app/utils/statusData';

interface TailorOrder {
  id: string;
  customer: string;
  tailor: string;
  item: string;
  categoryId: number;
  subCategoryId: number;
  dueDate: string;
  status: string;
  priority: string;
  amount: number;
  paidAmount: number;
  invoiceNumber?: string;
  invoiceDate?: string;
}

export function TailorOrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<TailorOrder | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [editingStatus, setEditingStatus] = useState<string | null>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState<string | null>(null);

  const [orders, setOrders] = useState<TailorOrder[]>([
    { 
      id: 'TO-001', 
      customer: 'Rajesh Kumar', 
      tailor: 'Ramesh Tailors', 
      item: 'Hand Embroidered Sherwani Blouse', 
      categoryId: 1,
      subCategoryId: 1, // Hand Embroidery
      dueDate: '2026-01-20', 
      status: 'Hand Embroidery Work', 
      priority: 'High',
      amount: 8500,
      paidAmount: 3000,
      invoiceNumber: 'TLR-INV-2026-001',
      invoiceDate: '2026-01-10'
    },
    { 
      id: 'TO-002', 
      customer: 'Priya Sharma', 
      tailor: 'Lakshmi Boutique', 
      item: 'Wedding Gown', 
      categoryId: 2,
      subCategoryId: 8, // Gown
      dueDate: '2026-01-18', 
      status: 'Design Finalization', 
      priority: 'Urgent',
      amount: 25000,
      paidAmount: 10000,
      invoiceNumber: 'TLR-INV-2026-002',
      invoiceDate: '2026-01-08'
    },
    { 
      id: 'TO-003', 
      customer: 'Amit Patel', 
      tailor: 'Ramesh Tailors', 
      item: 'Casual Kurta', 
      categoryId: 2,
      subCategoryId: 9, // Kurta
      dueDate: '2026-01-15', 
      status: 'Fabric Cutting', 
      priority: 'Normal',
      amount: 800,
      paidAmount: 800,
      invoiceNumber: 'TLR-INV-2026-003',
      invoiceDate: '2026-01-12'
    },
    { 
      id: 'TO-004', 
      customer: 'Sneha Reddy', 
      tailor: 'Meena Fashions', 
      item: 'Plain Business Blouse', 
      categoryId: 1,
      subCategoryId: 7, // Plain Blouse
      dueDate: '2026-01-25', 
      status: 'Stitching in Progress', 
      priority: 'Normal',
      amount: 1500,
      paidAmount: 500,
      invoiceNumber: 'TLR-INV-2026-004',
      invoiceDate: '2026-01-11'
    },
    { 
      id: 'TO-005', 
      customer: 'Vikram Singh', 
      tailor: 'Lakshmi Boutique', 
      item: 'Straight Pant', 
      categoryId: 3,
      subCategoryId: 18, // Straight Pant
      dueDate: '2026-01-22', 
      status: 'Cutting & Stitching', 
      priority: 'Normal',
      amount: 2500,
      paidAmount: 2500,
      invoiceNumber: 'TLR-INV-2026-005',
      invoiceDate: '2026-01-09'
    },
    { 
      id: 'TO-006', 
      customer: 'Ananya Desai', 
      tailor: 'Meena Fashions', 
      item: 'Machine Embroidered Anarkali Blouse', 
      categoryId: 1,
      subCategoryId: 2, // Machine Embroidery
      dueDate: '2026-01-16', 
      status: 'Machine Embroidery', 
      priority: 'High',
      amount: 6500,
      paidAmount: 2000,
      invoiceNumber: 'TLR-INV-2026-006',
      invoiceDate: '2026-01-13'
    },
    { 
      id: 'TO-007', 
      customer: 'Arjun Mehta', 
      tailor: 'Ramesh Tailors', 
      item: 'Palazzo Pants', 
      categoryId: 3,
      subCategoryId: 17, // Palazzo
      dueDate: '2026-01-28', 
      status: 'Stitching in Progress', 
      priority: 'Normal',
      amount: 12000,
      paidAmount: 5000,
      invoiceNumber: 'TLR-INV-2026-007',
      invoiceDate: '2026-01-10'
    },
    { 
      id: 'TO-008', 
      customer: 'Kavya Iyer', 
      tailor: 'Lakshmi Boutique', 
      item: 'Saree Krosha Work', 
      categoryId: 4,
      subCategoryId: 20, // Saree Krosha
      dueDate: '2026-01-14', 
      status: 'Delivered', 
      priority: 'Normal',
      amount: 600,
      paidAmount: 600,
      invoiceNumber: 'TLR-INV-2026-008',
      invoiceDate: '2026-01-07'
    },
    { 
      id: 'TO-009', 
      customer: 'Rahul Verma', 
      tailor: 'Ramesh Tailors', 
      item: 'Patiala Salwar', 
      categoryId: 3,
      subCategoryId: 16, // Patiala
      dueDate: '2026-01-19', 
      status: 'Measurements Taken', 
      priority: 'High',
      amount: 4500,
      paidAmount: 1500,
      invoiceNumber: 'TLR-INV-2026-009',
      invoiceDate: '2026-01-11'
    },
    { 
      id: 'TO-010', 
      customer: 'Deepika Nair', 
      tailor: 'Meena Fashions', 
      item: 'Saree Zig-Zag & Falls', 
      categoryId: 4,
      subCategoryId: 21, // Saree Zig-Zag & Falls
      dueDate: '2026-01-17', 
      status: 'Zig-Zag & Falls Work', 
      priority: 'Normal',
      amount: 2000,
      paidAmount: 0,
      invoiceNumber: 'TLR-INV-2026-010',
      invoiceDate: '2026-01-12'
    },
  ]);

  const handleViewInvoice = (order: TailorOrder) => {
    setSelectedOrder(order);
    setShowInvoiceModal(true);
  };

  const handleDownloadInvoice = (order: TailorOrder) => {
    alert(`Downloading invoice ${order.invoiceNumber} for ${order.customer}`);
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    setShowStatusDropdown(null);
    setEditingStatus(null);
  };

  const getPaymentStatus = (order: TailorOrder) => {
    if (order.paidAmount === 0) return { text: 'Unpaid', color: 'bg-red-100 text-red-800' };
    if (order.paidAmount < order.amount) return { text: 'Partial', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Paid', color: 'bg-green-100 text-green-800' };
  };

  const getCategoryName = (categoryId: number) => {
    return STATUS_CATEGORIES.find(c => c.id === categoryId)?.name || 'Unknown';
  };

  const getSubCategoryName = (subCategoryId: number) => {
    return STATUS_SUBCATEGORIES.find(sc => sc.id === subCategoryId)?.name || 'Unknown';
  };

  // Filter logic - just show all orders for now
  const filteredOrders = orders;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Tailor Orders</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Track custom tailoring orders with dynamic status management</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" />
          New Order
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300">Dynamic Status Management</h3>
          <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
            Order statuses are automatically configured based on the item's category and sub-category from Status Management. 
            Click on any status to update it - only relevant statuses will be shown.
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-600" />
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredOrders.map((order) => {
                const statusInfo = getStatusByName(order.categoryId, order.subCategoryId, order.status);
                const availableStatuses = getStatusesForSubCategory(order.categoryId, order.subCategoryId);
                
                return (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{order.customer}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      <div className="max-w-xs">
                        <div className="font-medium">{order.item}</div>
                        <div className="text-xs text-gray-500">{getSubCategoryName(order.subCategoryId)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded dark:bg-gray-700 dark:text-gray-300">
                        {getCategoryName(order.categoryId)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-600" />
                        {order.dueDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap relative">
                      <button
                        onClick={() => setShowStatusDropdown(showStatusDropdown === order.id ? null : order.id)}
                        className={`px-2 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${
                          statusInfo ? getStatusColorClasses(statusInfo.color) : 'bg-gray-100 text-gray-800'
                        } hover:opacity-80 transition-opacity cursor-pointer`}
                      >
                        {order.status}
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      
                      {/* Status Dropdown */}
                      {showStatusDropdown === order.id && (
                        <div className="absolute z-10 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 max-h-80 overflow-y-auto">
                          <div className="px-3 py-2 border-b border-gray-200">
                            <p className="text-xs font-semibold text-gray-700 uppercase">Update Status</p>
                            <p className="text-xs text-gray-500 mt-1">{getSubCategoryName(order.subCategoryId)} workflow</p>
                          </div>
                          {availableStatuses
                            .sort((a, b) => a.order - b.order)
                            .filter(s => s.active)
                            .map((status) => (
                              <button
                                key={status.id}
                                onClick={() => handleStatusChange(order.id, status.name)}
                                className={`w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors ${
                                  order.status === status.name ? 'bg-blue-50' : ''
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColorClasses(status.color)}`}>
                                        {status.name}
                                      </span>
                                      {status.isDefault && (
                                        <span className="text-xs text-blue-600">●</span>
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{status.description}</p>
                                  </div>
                                  <div className="text-xs text-gray-400 ml-2">{status.order}</div>
                                </div>
                              </button>
                            ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.priority === 'Urgent' 
                          ? 'bg-red-100 text-red-800' 
                          : order.priority === 'High'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {order.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatus(order).color}`}>
                        {getPaymentStatus(order).text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button className="text-blue-600 hover:text-blue-900" title="View Order">View</button>
                        <button className="text-gray-600 hover:text-gray-900" title="Edit Order">Edit</button>
                        <button 
                          className="text-green-600 hover:text-green-900" 
                          onClick={() => handleViewInvoice(order)}
                          title="View Invoice"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-purple-600 hover:text-purple-900" 
                          onClick={() => handleDownloadInvoice(order)}
                          title="Download Invoice"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showInvoiceModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
              <div className="flex items-center gap-2">
                <FileText className="w-6 h-6" />
                <h3 className="text-xl font-semibold">Invoice Details</h3>
              </div>
              <button 
                className="text-white hover:text-gray-200 transition-colors" 
                onClick={() => setShowInvoiceModal(false)}
              >
                <Plus className="w-6 h-6 transform rotate-45" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="text-center border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-900">Wevraa</h2>
                <p className="text-sm text-gray-600">Premium Tailoring Services</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Invoice Details</h4>
                  <div className="space-y-1">
                    <p className="text-sm"><span className="font-medium">Invoice #:</span> {selectedOrder.invoiceNumber}</p>
                    <p className="text-sm"><span className="font-medium">Date:</span> {selectedOrder.invoiceDate}</p>
                    <p className="text-sm"><span className="font-medium">Order ID:</span> {selectedOrder.id}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Customer Details</h4>
                  <div className="space-y-1">
                    <p className="text-sm"><span className="font-medium">Name:</span> {selectedOrder.customer}</p>
                    <p className="text-sm"><span className="font-medium">Tailor:</span> {selectedOrder.tailor}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Order Details</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Item:</span>
                    <span className="text-sm text-gray-700">{selectedOrder.item}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Category:</span>
                    <span className="text-sm text-gray-700">
                      {getCategoryName(selectedOrder.categoryId)} - {getSubCategoryName(selectedOrder.subCategoryId)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Due Date:</span>
                    <span className="text-sm text-gray-700">{selectedOrder.dueDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      getStatusByName(selectedOrder.categoryId, selectedOrder.subCategoryId, selectedOrder.status)
                        ? getStatusColorClasses(getStatusByName(selectedOrder.categoryId, selectedOrder.subCategoryId, selectedOrder.status)!.color)
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Priority:</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedOrder.priority === 'Urgent' 
                        ? 'bg-red-100 text-red-800' 
                        : selectedOrder.priority === 'High'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedOrder.priority}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Payment Summary</h4>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Amount:</span>
                    <span className="text-lg font-bold text-gray-900 flex items-center">
                      <IndianRupee className="w-5 h-5" />
                      {selectedOrder.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Paid Amount:</span>
                    <span className="text-lg font-semibold text-green-600 flex items-center">
                      <IndianRupee className="w-5 h-5" />
                      {selectedOrder.paidAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="border-t border-blue-200 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold">Balance Due:</span>
                      <span className={`text-xl font-bold flex items-center ${
                        selectedOrder.amount - selectedOrder.paidAmount > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        <IndianRupee className="w-5 h-5" />
                        {(selectedOrder.amount - selectedOrder.paidAmount).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getPaymentStatus(selectedOrder).color}`}>
                      {getPaymentStatus(selectedOrder).text}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => handleDownloadInvoice(selectedOrder)}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <button
                  onClick={() => alert('Print functionality')}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Print Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}