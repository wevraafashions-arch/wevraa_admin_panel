import { useState } from 'react';
import { Search, Download, Eye, IndianRupee, CheckCircle, Clock, CreditCard, X, Star } from 'lucide-react';
import { RatingModal } from '@/app/components/RatingModal';

interface PaymentRecord {
  id: string;
  invoiceNumber: string;
  customerName: string;
  tailorName: string;
  orderType: string;
  amount: number;
  paidAmount: number;
  paymentDate: string;
  paymentMethod: 'Cash' | 'UPI' | 'Card' | 'Net Banking';
  transactionId?: string;
  rating?: number;
  fitRating?: number;
  finishingRating?: number;
  review?: string;
  reviewImages?: string[];
  reviewDate?: string;
  hasGST?: boolean;
  gstNumber?: string;
  gstPercentage?: number;
  hsnCode?: string;
}

interface PendingPayment {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone: string;
  tailorName: string;
  orderType: string;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  orderDate: string;
  dueDate: string;
  status: 'Partially Paid' | 'Unpaid';
  hasGST?: boolean;
  gstNumber?: string;
  gstPercentage?: number;
  hsnCode?: string;
}

export function InvoicesPage() {
  const [activeTab, setActiveTab] = useState<'records' | 'pending'>('records');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingInvoice, setRatingInvoice] = useState<PaymentRecord | null>(null);

  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([
    {
      id: '1',
      invoiceNumber: 'TLR-INV-2024-001',
      customerName: 'Priya Sharma',
      tailorName: 'Lakshmi Iyer',
      orderType: 'Blouse Stitching',
      amount: 1200,
      paidAmount: 1200,
      paymentDate: '2024-01-10',
      paymentMethod: 'UPI',
      transactionId: 'UPI2024011012345678',
      hasGST: true,
      gstNumber: '27AABCU9603R1ZM',
      gstPercentage: 12,
      hsnCode: '6217',
    },
    {
      id: '2',
      invoiceNumber: 'TLR-INV-2024-002',
      customerName: 'Anita Desai',
      tailorName: 'Rajesh Kumar',
      orderType: 'Lehenga Stitching',
      amount: 4500,
      paidAmount: 4500,
      paymentDate: '2024-01-09',
      paymentMethod: 'Cash',
    },
    {
      id: '3',
      invoiceNumber: 'TLR-INV-2024-003',
      customerName: 'Deepika Menon',
      tailorName: 'Priya Sharma',
      orderType: 'Salwar Kameez',
      amount: 2800,
      paidAmount: 2800,
      paymentDate: '2024-01-08',
      paymentMethod: 'Card',
      transactionId: 'CARD2024010887654321',
      hasGST: true,
      gstNumber: '29AAACP1234N1ZR',
      gstPercentage: 18,
      hsnCode: '6204',
    },
    {
      id: '4',
      invoiceNumber: 'TLR-INV-2024-004',
      customerName: 'Rajesh Kumar',
      tailorName: 'Arjun Reddy',
      orderType: 'Sherwani Stitching',
      amount: 6500,
      paidAmount: 6500,
      paymentDate: '2024-01-07',
      paymentMethod: 'Net Banking',
      transactionId: 'NBK2024010765432109',
    },
    {
      id: '5',
      invoiceNumber: 'TLR-INV-2024-005',
      customerName: 'Meera Iyer',
      tailorName: 'Lakshmi Iyer',
      orderType: 'Saree Blouse',
      amount: 900,
      paidAmount: 900,
      paymentDate: '2024-01-06',
      paymentMethod: 'UPI',
      transactionId: 'UPI2024010698765432',
      hasGST: true,
      gstNumber: '27AABCU9603R1ZM',
      gstPercentage: 12,
      hsnCode: '6206',
    },
    {
      id: '6',
      invoiceNumber: 'TLR-INV-2024-006',
      customerName: 'Vikram Singh',
      tailorName: 'Suresh Patel',
      orderType: 'Kurta Pajama',
      amount: 1800,
      paidAmount: 1800,
      paymentDate: '2024-01-05',
      paymentMethod: 'Cash',
    },
    {
      id: '7',
      invoiceNumber: 'TLR-INV-2024-007',
      customerName: 'Kavya Reddy',
      tailorName: 'Anjali Desai',
      orderType: 'Anarkali Suit',
      amount: 3200,
      paidAmount: 3200,
      paymentDate: '2024-01-04',
      paymentMethod: 'UPI',
      transactionId: 'UPI2024010456789012',
      hasGST: true,
      gstNumber: '36AAACD5678P1ZT',
      gstPercentage: 12,
      hsnCode: '6204',
    },
    {
      id: '8',
      invoiceNumber: 'TLR-INV-2024-008',
      customerName: 'Arjun Mehta',
      tailorName: 'Rajesh Kumar',
      orderType: 'Wedding Suit',
      amount: 8500,
      paidAmount: 8500,
      paymentDate: '2024-01-03',
      paymentMethod: 'Card',
      transactionId: 'CARD2024010387654321',
    },
  ]);

  const [pendingPayments] = useState<PendingPayment[]>([
    {
      id: '1',
      invoiceNumber: 'TLR-INV-2024-009',
      customerName: 'Sneha Nair',
      customerPhone: '+91 98765 43210',
      tailorName: 'Priya Sharma',
      orderType: 'Designer Lehenga',
      totalAmount: 12000,
      paidAmount: 5000,
      pendingAmount: 7000,
      orderDate: '2024-01-08',
      dueDate: '2024-01-15',
      status: 'Partially Paid',
    },
    {
      id: '2',
      invoiceNumber: 'TLR-INV-2024-010',
      customerName: 'Rahul Verma',
      customerPhone: '+91 99876 54321',
      tailorName: 'Arjun Reddy',
      orderType: 'Indo-Western Suit',
      totalAmount: 5500,
      paidAmount: 0,
      pendingAmount: 5500,
      orderDate: '2024-01-10',
      dueDate: '2024-01-17',
      status: 'Unpaid',
    },
    {
      id: '3',
      invoiceNumber: 'TLR-INV-2024-011',
      customerName: 'Divya Krishnan',
      customerPhone: '+91 97654 32109',
      tailorName: 'Lakshmi Iyer',
      orderType: 'Blouse (Set of 3)',
      totalAmount: 2400,
      paidAmount: 1000,
      pendingAmount: 1400,
      orderDate: '2024-01-09',
      dueDate: '2024-01-16',
      status: 'Partially Paid',
    },
    {
      id: '4',
      invoiceNumber: 'TLR-INV-2024-012',
      customerName: 'Karthik Menon',
      customerPhone: '+91 96543 21098',
      tailorName: 'Suresh Patel',
      orderType: 'Pathani Suit',
      totalAmount: 3200,
      paidAmount: 0,
      pendingAmount: 3200,
      orderDate: '2024-01-11',
      dueDate: '2024-01-18',
      status: 'Unpaid',
    },
    {
      id: '5',
      invoiceNumber: 'TLR-INV-2024-013',
      customerName: 'Aishwarya Reddy',
      customerPhone: '+91 95432 10987',
      tailorName: 'Anjali Desai',
      orderType: 'Gown Stitching',
      totalAmount: 7800,
      paidAmount: 3000,
      pendingAmount: 4800,
      orderDate: '2024-01-07',
      dueDate: '2024-01-14',
      status: 'Partially Paid',
    },
    {
      id: '6',
      invoiceNumber: 'TLR-INV-2024-014',
      customerName: 'Suresh Kumar',
      customerPhone: '+91 94321 09876',
      tailorName: 'Rajesh Kumar',
      orderType: 'Churidar Set',
      totalAmount: 1800,
      paidAmount: 0,
      pendingAmount: 1800,
      orderDate: '2024-01-12',
      dueDate: '2024-01-19',
      status: 'Unpaid',
    },
  ]);

  const filteredRecords = paymentRecords.filter(record =>
    record.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.tailorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPending = pendingPayments.filter(payment =>
    payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.tailorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.customerPhone.includes(searchTerm)
  );

  const totalPaid = paymentRecords.reduce((sum, record) => sum + record.paidAmount, 0);
  const totalPending = pendingPayments.reduce((sum, payment) => sum + payment.pendingAmount, 0);
  const partiallyPaidCount = pendingPayments.filter(p => p.status === 'Partially Paid').length;
  const unpaidCount = pendingPayments.filter(p => p.status === 'Unpaid').length;

  const handleViewDetails = (record: PaymentRecord) => {
    setSelectedPayment(record);
    setShowDetailsModal(true);
  };

  const handleRatePayment = (record: PaymentRecord) => {
    setRatingInvoice(record);
    setShowRatingModal(true);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Tailor Payments</h1>
          <p className="text-sm text-gray-600 mt-1">Manage tailoring service payments and invoices</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Paid</p>
              <p className="text-2xl font-semibold text-green-600 mt-1">
                ₹{totalPaid.toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-gray-500 mt-1">{paymentRecords.length} payments</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Pending</p>
              <p className="text-2xl font-semibold text-red-600 mt-1">
                ₹{totalPending.toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-gray-500 mt-1">{pendingPayments.length} invoices</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Partially Paid</p>
              <p className="text-2xl font-semibold text-yellow-600 mt-1">{partiallyPaidCount}</p>
              <p className="text-xs text-gray-500 mt-1">Orders</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <IndianRupee className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unpaid Orders</p>
              <p className="text-2xl font-semibold text-orange-600 mt-1">{unpaidCount}</p>
              <p className="text-xs text-gray-500 mt-1">Needs attention</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <CreditCard className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('records')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'records'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Payment Records ({paymentRecords.length})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'pending'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Pending Payments ({pendingPayments.length})
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={activeTab === 'records' ? 'Search payment records...' : 'Search pending payments...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Payment Records Table */}
        {activeTab === 'records' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tailor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-900">{record.invoiceNumber}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {record.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {record.tailorName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {record.orderType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-green-600">
                        ₹{record.paidAmount.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {record.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(record.paymentDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewDetails(record)}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        <Eye className="w-4 h-4 inline mr-1" />
                        View
                      </button>
                      <button className="text-gray-600 hover:text-gray-800">
                        <Download className="w-4 h-4 inline mr-1" />
                        PDF
                      </button>
                      <button
                        onClick={() => handleRatePayment(record)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <Star className="w-4 h-4 inline mr-1" />
                        Rate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredRecords.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-gray-500">No payment records found</p>
              </div>
            )}
          </div>
        )}

        {/* Pending Payments Table */}
        {activeTab === 'pending' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tailor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paid
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pending
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPending.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-900">{payment.invoiceNumber}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{payment.customerName}</p>
                        <p className="text-sm text-gray-500">{payment.customerPhone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {payment.tailorName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {payment.orderType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-gray-900">
                        ₹{payment.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-green-600 font-medium">
                        ₹{payment.paidAmount.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-red-600 font-semibold">
                        ₹{payment.pendingAmount.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(payment.dueDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          payment.status === 'Partially Paid'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredPending.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-gray-500">No pending payments found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Payment Details Modal */}
      {showDetailsModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
              <h2 className="text-xl font-semibold text-gray-900">Payment Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Invoice Information</h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Invoice Number:</span> {selectedPayment.invoiceNumber}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Payment Date:</span>{' '}
                      {new Date(selectedPayment.paymentDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Order Type:</span> {selectedPayment.orderType}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Customer & Tailor</h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Customer:</span> {selectedPayment.customerName}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Tailor:</span> {selectedPayment.tailorName}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Payment Information</h3>
                <div className="space-y-2">
                  {selectedPayment.hasGST && selectedPayment.gstPercentage ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Base Amount:</span>
                        <span className="text-sm text-gray-900">
                          ₹{(selectedPayment.paidAmount / (1 + selectedPayment.gstPercentage / 100)).toFixed(2).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">GST ({selectedPayment.gstPercentage}%):</span>
                        <span className="text-sm text-gray-900">
                          ₹{(selectedPayment.paidAmount - (selectedPayment.paidAmount / (1 + selectedPayment.gstPercentage / 100))).toFixed(2).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                        <span className="text-sm font-medium">Total Amount:</span>
                        <span className="text-lg font-semibold text-gray-900">
                          ₹{selectedPayment.paidAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                      {selectedPayment.gstNumber && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">GST Number:</span>
                          <span className="text-sm text-gray-600 font-mono">{selectedPayment.gstNumber}</span>
                        </div>
                      )}
                      {selectedPayment.hsnCode && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">HSN Code:</span>
                          <span className="text-sm text-gray-600 font-mono">{selectedPayment.hsnCode}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Amount:</span>
                      <span className="text-lg font-semibold text-gray-900">
                        ₹{selectedPayment.paidAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Payment Method:</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {selectedPayment.paymentMethod}
                    </span>
                  </div>
                  {selectedPayment.transactionId && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Transaction ID:</span>
                      <span className="text-sm text-gray-600 font-mono">{selectedPayment.transactionId}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">Payment Completed Successfully</span>
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3 rounded-b-lg bg-gray-50">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && ratingInvoice && (
        <RatingModal
          invoice={ratingInvoice}
          onClose={() => setShowRatingModal(false)}
          onRatingSubmit={(rating, fitRating, finishingRating, review, reviewImages) => {
            setPaymentRecords(prevRecords =>
              prevRecords.map(record =>
                record.id === ratingInvoice.id
                  ? { ...record, rating, fitRating, finishingRating, review, reviewImages, reviewDate: new Date().toISOString() }
                  : record
              )
            );
            setShowRatingModal(false);
          }}
        />
      )}
    </div>
  );
}