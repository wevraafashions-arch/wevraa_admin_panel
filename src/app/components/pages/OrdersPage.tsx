import { useState } from 'react';
import { Search, Filter, Eye, Package, Truck, CheckCircle, XCircle, RotateCcw, Clock } from 'lucide-react';

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'Received' | 'Processing' | 'Shipped' | 'Delivered' | 'Returned' | 'Cancelled';
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  orderDate: string;
  shippingAddress: string;
  trackingNumber?: string;
}

export function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [orders] = useState<Order[]>([
    {
      id: 'ORD-2024-001',
      customerName: 'Priya Sharma',
      customerEmail: 'priya.sharma@email.com',
      customerPhone: '+91 98765 43210',
      items: [
        { productName: 'Silk Saree - Royal Blue', quantity: 1, price: 4500 },
        { productName: 'Matching Blouse Piece', quantity: 1, price: 800 },
      ],
      totalAmount: 5300,
      status: 'Delivered',
      paymentStatus: 'Paid',
      orderDate: '2024-01-08',
      shippingAddress: '45, Anna Nagar, Chennai, Tamil Nadu - 600040',
      trackingNumber: 'TRK-458796321',
    },
    {
      id: 'ORD-2024-002',
      customerName: 'Rajesh Kumar',
      customerEmail: 'rajesh.kumar@email.com',
      customerPhone: '+91 99876 54321',
      items: [
        { productName: 'Cotton Kurta Set', quantity: 2, price: 1800 },
        { productName: 'Ethnic Jacket', quantity: 1, price: 2200 },
      ],
      totalAmount: 5800,
      status: 'Shipped',
      paymentStatus: 'Paid',
      orderDate: '2024-01-10',
      shippingAddress: '12, T. Nagar, Chennai, Tamil Nadu - 600017',
      trackingNumber: 'TRK-458796322',
    },
    {
      id: 'ORD-2024-003',
      customerName: 'Anita Desai',
      customerEmail: 'anita.desai@email.com',
      customerPhone: '+91 97654 32109',
      items: [
        { productName: 'Designer Lehenga', quantity: 1, price: 12500 },
        { productName: 'Dupatta - Embroidered', quantity: 1, price: 2500 },
      ],
      totalAmount: 15000,
      status: 'Received',
      paymentStatus: 'Paid',
      orderDate: '2024-01-12',
      shippingAddress: '78, Mylapore, Chennai, Tamil Nadu - 600004',
    },
    {
      id: 'ORD-2024-004',
      customerName: 'Vikram Singh',
      customerEmail: 'vikram.singh@email.com',
      customerPhone: '+91 96543 21098',
      items: [
        { productName: 'Men\'s Formal Shirt', quantity: 3, price: 1200 },
        { productName: 'Trousers - Black', quantity: 2, price: 1500 },
      ],
      totalAmount: 6600,
      status: 'Processing',
      paymentStatus: 'Paid',
      orderDate: '2024-01-11',
      shippingAddress: '23, Adyar, Chennai, Tamil Nadu - 600020',
    },
    {
      id: 'ORD-2024-005',
      customerName: 'Lakshmi Iyer',
      customerEmail: 'lakshmi.iyer@email.com',
      customerPhone: '+91 95432 10987',
      items: [
        { productName: 'Traditional Saree - Kanjivaram', quantity: 1, price: 8500 },
      ],
      totalAmount: 8500,
      status: 'Returned',
      paymentStatus: 'Paid',
      orderDate: '2024-01-05',
      shippingAddress: '56, Velachery, Chennai, Tamil Nadu - 600042',
      trackingNumber: 'TRK-458796323',
    },
    {
      id: 'ORD-2024-006',
      customerName: 'Arjun Reddy',
      customerEmail: 'arjun.reddy@email.com',
      customerPhone: '+91 94321 09876',
      items: [
        { productName: 'Wedding Sherwani', quantity: 1, price: 15000 },
        { productName: 'Turban - Silk', quantity: 1, price: 1500 },
        { productName: 'Mojari - Embroidered', quantity: 1, price: 2500 },
      ],
      totalAmount: 19000,
      status: 'Shipped',
      paymentStatus: 'Paid',
      orderDate: '2024-01-09',
      shippingAddress: '89, Nungambakkam, Chennai, Tamil Nadu - 600034',
      trackingNumber: 'TRK-458796324',
    },
    {
      id: 'ORD-2024-007',
      customerName: 'Meera Krishnan',
      customerEmail: 'meera.krishnan@email.com',
      customerPhone: '+91 93210 98765',
      items: [
        { productName: 'Churidar Set', quantity: 2, price: 2200 },
      ],
      totalAmount: 4400,
      status: 'Cancelled',
      paymentStatus: 'Failed',
      orderDate: '2024-01-11',
      shippingAddress: '34, Porur, Chennai, Tamil Nadu - 600116',
    },
    {
      id: 'ORD-2024-008',
      customerName: 'Suresh Patel',
      customerEmail: 'suresh.patel@email.com',
      customerPhone: '+91 92109 87654',
      items: [
        { productName: 'Casual Shirt - Cotton', quantity: 4, price: 900 },
        { productName: 'Jeans - Blue', quantity: 2, price: 1800 },
      ],
      totalAmount: 7200,
      status: 'Delivered',
      paymentStatus: 'Paid',
      orderDate: '2024-01-07',
      shippingAddress: '67, Tambaram, Chennai, Tamil Nadu - 600045',
      trackingNumber: 'TRK-458796325',
    },
    {
      id: 'ORD-2024-009',
      customerName: 'Divya Nair',
      customerEmail: 'divya.nair@email.com',
      customerPhone: '+91 91098 76543',
      items: [
        { productName: 'Anarkali Suit', quantity: 1, price: 3500 },
        { productName: 'Palazzo Pants', quantity: 2, price: 1200 },
      ],
      totalAmount: 5900,
      status: 'Received',
      paymentStatus: 'Pending',
      orderDate: '2024-01-12',
      shippingAddress: '90, Guindy, Chennai, Tamil Nadu - 600032',
    },
    {
      id: 'ORD-2024-010',
      customerName: 'Karthik Menon',
      customerEmail: 'karthik.menon@email.com',
      customerPhone: '+91 90987 65432',
      items: [
        { productName: 'Designer Kurta', quantity: 1, price: 2800 },
      ],
      totalAmount: 2800,
      status: 'Processing',
      paymentStatus: 'Paid',
      orderDate: '2024-01-11',
      shippingAddress: '12, Chromepet, Chennai, Tamil Nadu - 600044',
    },
  ]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Received':
        return 'bg-purple-100 text-purple-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Shipped':
        return 'bg-yellow-100 text-yellow-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Returned':
        return 'bg-orange-100 text-orange-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Received':
        return <Clock className="w-4 h-4" />;
      case 'Processing':
        return <Package className="w-4 h-4" />;
      case 'Shipped':
        return <Truck className="w-4 h-4" />;
      case 'Delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'Returned':
        return <RotateCcw className="w-4 h-4" />;
      case 'Cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'text-green-600';
      case 'Pending':
        return 'text-yellow-600';
      case 'Failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const stats = {
    total: orders.length,
    received: orders.filter(o => o.status === 'Received').length,
    processing: orders.filter(o => o.status === 'Processing').length,
    shipped: orders.filter(o => o.status === 'Shipped').length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
    returned: orders.filter(o => o.status === 'Returned').length,
    cancelled: orders.filter(o => o.status === 'Cancelled').length,
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-600 mt-1">Manage all e-commerce orders</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-600">Total Orders</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-purple-50 rounded-lg shadow p-4">
          <div className="flex items-center gap-2 text-purple-600 mb-1">
            <Clock className="w-4 h-4" />
            <p className="text-xs font-medium">Received</p>
          </div>
          <p className="text-2xl font-semibold text-purple-700">{stats.received}</p>
        </div>
        <div className="bg-blue-50 rounded-lg shadow p-4">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Package className="w-4 h-4" />
            <p className="text-xs font-medium">Processing</p>
          </div>
          <p className="text-2xl font-semibold text-blue-700">{stats.processing}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow p-4">
          <div className="flex items-center gap-2 text-yellow-600 mb-1">
            <Truck className="w-4 h-4" />
            <p className="text-xs font-medium">Shipped</p>
          </div>
          <p className="text-2xl font-semibold text-yellow-700">{stats.shipped}</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-4">
          <div className="flex items-center gap-2 text-green-600 mb-1">
            <CheckCircle className="w-4 h-4" />
            <p className="text-xs font-medium">Delivered</p>
          </div>
          <p className="text-2xl font-semibold text-green-700">{stats.delivered}</p>
        </div>
        <div className="bg-orange-50 rounded-lg shadow p-4">
          <div className="flex items-center gap-2 text-orange-600 mb-1">
            <RotateCcw className="w-4 h-4" />
            <p className="text-xs font-medium">Returned</p>
          </div>
          <p className="text-2xl font-semibold text-orange-700">{stats.returned}</p>
        </div>
        <div className="bg-red-50 rounded-lg shadow p-4">
          <div className="flex items-center gap-2 text-red-600 mb-1">
            <XCircle className="w-4 h-4" />
            <p className="text-xs font-medium">Cancelled</p>
          </div>
          <p className="text-2xl font-semibold text-red-700">{stats.cancelled}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by order ID, customer name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Received">Received</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Returned">Returned</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-gray-900">{order.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{order.customerName}</p>
                      <p className="text-sm text-gray-500">{order.customerPhone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(order.orderDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {order.items.length} item{order.items.length > 1 ? 's' : ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-semibold text-gray-900">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleViewDetails(order)}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Order Information</h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Order ID:</span> {selectedOrder.id}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Order Date:</span>{' '}
                      {new Date(selectedOrder.orderDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Status:</span>{' '}
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                        {getStatusIcon(selectedOrder.status)}
                        {selectedOrder.status}
                      </span>
                    </p>
                    {selectedOrder.trackingNumber && (
                      <p className="text-sm">
                        <span className="font-medium">Tracking Number:</span> {selectedOrder.trackingNumber}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Customer Information</h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Name:</span> {selectedOrder.customerName}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Phone:</span> {selectedOrder.customerPhone}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Email:</span> {selectedOrder.customerEmail}
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Shipping Address</h3>
                <p className="text-sm text-gray-700">{selectedOrder.shippingAddress}</p>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">Order Items</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Product</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Quantity</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Price</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.productName}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 text-center">{item.quantity}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 text-right">
                            ₹{item.price.toLocaleString('en-IN')}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                            ₹{(item.quantity * item.price).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                          Total Amount:
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                          ₹{selectedOrder.totalAmount.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Payment Status */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Payment Status:</span>
                <span className={`text-sm font-semibold ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                  {selectedOrder.paymentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}