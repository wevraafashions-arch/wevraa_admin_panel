import { useState } from 'react';
import { Plus, Search, Mail, Phone, Edit, Trash2, X, Eye, ShoppingBag, IndianRupee } from 'lucide-react';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: string;
  status: 'Active' | 'VIP' | 'New';
  address?: string;
  joinDate?: string;
}

export function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState<number | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const [customerForm, setCustomerForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'New' as Customer['status'],
  });

  const [customers, setCustomers] = useState<Customer[]>([
    { id: 1, name: 'Rajesh Kumar', email: 'rajesh.kumar@email.com', phone: '+91 98765-43210', orders: 12, totalSpent: '₹54,300', status: 'Active', address: 'T. Nagar, Chennai, Tamil Nadu', joinDate: '2023-06-15' },
    { id: 2, name: 'Priya Sharma', email: 'priya.sharma@email.com', phone: '+91 98765-43211', orders: 8, totalSpent: '₹32,100', status: 'Active', address: 'Adyar, Chennai, Tamil Nadu', joinDate: '2023-08-22' },
    { id: 3, name: 'Amit Patel', email: 'amit.patel@email.com', phone: '+91 98765-43212', orders: 5, totalSpent: '₹18,900', status: 'Active', address: 'Mylapore, Chennai, Tamil Nadu', joinDate: '2024-01-05' },
    { id: 4, name: 'Sneha Reddy', email: 'sneha.reddy@email.com', phone: '+91 98765-43213', orders: 15, totalSpent: '₹76,500', status: 'VIP', address: 'Velachery, Chennai, Tamil Nadu', joinDate: '2023-03-10' },
    { id: 5, name: 'Vikram Singh', email: 'v.singh@email.com', phone: '+91 98765-43214', orders: 3, totalSpent: '₹9,800', status: 'Active', address: 'Anna Nagar, Chennai, Tamil Nadu', joinDate: '2024-01-10' },
    { id: 6, name: 'Ananya Desai', email: 'ananya.d@email.com', phone: '+91 98765-43215', orders: 20, totalSpent: '₹93,400', status: 'VIP', address: 'Nungambakkam, Chennai, Tamil Nadu', joinDate: '2023-01-20' },
    { id: 7, name: 'Arjun Mehta', email: 'arjun.m@email.com', phone: '+91 98765-43216', orders: 1, totalSpent: '₹4,500', status: 'New', address: 'Porur, Chennai, Tamil Nadu', joinDate: '2024-01-12' },
    { id: 8, name: 'Kavya Iyer', email: 'kavya.iyer@email.com', phone: '+91 98765-43217', orders: 7, totalSpent: '₹27,800', status: 'Active', address: 'Guindy, Chennai, Tamil Nadu', joinDate: '2023-11-18' },
    { id: 9, name: 'Rahul Verma', email: 'rahul.v@email.com', phone: '+91 98765-43218', orders: 11, totalSpent: '₹48,200', status: 'Active', address: 'Tambaram, Chennai, Tamil Nadu', joinDate: '2023-07-05' },
    { id: 10, name: 'Deepika Nair', email: 'deepika.nair@email.com', phone: '+91 98765-43219', orders: 18, totalSpent: '₹82,600', status: 'VIP', address: 'Chromepet, Chennai, Tamil Nadu', joinDate: '2023-02-14' },
  ]);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const resetForm = () => {
    setCustomerForm({
      name: '',
      email: '',
      phone: '',
      address: '',
      status: 'New',
    });
    setIsEditMode(false);
    setEditingCustomerId(null);
  };

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const newCustomer: Customer = {
      id: Math.max(...customers.map(c => c.id)) + 1,
      name: customerForm.name,
      email: customerForm.email,
      phone: customerForm.phone,
      orders: 0,
      totalSpent: '₹0',
      status: customerForm.status,
      address: customerForm.address,
      joinDate: new Date().toISOString().split('T')[0],
    };
    setCustomers([...customers, newCustomer]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomerId) {
      setCustomers(customers.map(cust =>
        cust.id === editingCustomerId
          ? {
              ...cust,
              name: customerForm.name,
              email: customerForm.email,
              phone: customerForm.phone,
              status: customerForm.status,
              address: customerForm.address,
            }
          : cust
      ));
      setShowAddModal(false);
      resetForm();
    }
  };

  const openEditModal = (customer: Customer) => {
    setIsEditMode(true);
    setEditingCustomerId(customer.id);
    setCustomerForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address || '',
      status: customer.status,
    });
    setShowAddModal(true);
  };

  const handleDeleteCustomer = (customerId: number) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter(cust => cust.id !== customerId));
    }
  };

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDetailsModal(true);
  };

  const vipCustomers = customers.filter(c => c.status === 'VIP').length;
  const activeCustomers = customers.filter(c => c.status === 'Active').length;
  const newCustomers = customers.filter(c => c.status === 'New').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Customers</h2>
          <p className="text-sm text-gray-600 mt-1">Manage your customer relationships</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Customer
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Total Customers</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{customers.length}</p>
        </div>
        <div className="bg-purple-50 rounded-lg shadow p-6">
          <p className="text-sm text-purple-600">VIP Customers</p>
          <p className="text-2xl font-semibold text-purple-700 mt-1">{vipCustomers}</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-6">
          <p className="text-sm text-green-600">Active Customers</p>
          <p className="text-2xl font-semibold text-green-700 mt-1">{activeCustomers}</p>
        </div>
        <div className="bg-blue-50 rounded-lg shadow p-6">
          <p className="text-sm text-blue-600">New Customers</p>
          <p className="text-2xl font-semibold text-blue-700 mt-1">{newCustomers}</p>
        </div>
      </div>

      {/* Search and Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{customer.orders}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.totalSpent}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      customer.status === 'VIP' 
                        ? 'bg-purple-100 text-purple-800' 
                        : customer.status === 'New'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(customer)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(customer)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit customer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCustomer(customer.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete customer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-gray-500">No customers found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {isEditMode ? 'Edit Customer' : 'Add New Customer'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={isEditMode ? handleEditCustomer : handleAddCustomer} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerForm.name}
                  onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Rajesh Kumar"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerForm.email}
                    onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerForm.phone}
                    onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+91 98765-43210"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  rows={2}
                  value={customerForm.address}
                  onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Complete address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={customerForm.status}
                  onChange={(e) => setCustomerForm({ ...customerForm, status: e.target.value as Customer['status'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="New">New</option>
                  <option value="Active">Active</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {isEditMode ? 'Update Customer' : 'Add Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showDetailsModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Customer Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="text-gray-900 font-medium">{selectedCustomer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mt-1 ${
                      selectedCustomer.status === 'VIP' 
                        ? 'bg-purple-100 text-purple-800' 
                        : selectedCustomer.status === 'New'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {selectedCustomer.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-gray-900">{selectedCustomer.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="text-gray-900">{selectedCustomer.phone}</p>
                  </div>
                  {selectedCustomer.address && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="text-gray-900">{selectedCustomer.address}</p>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Order Statistics</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                      <ShoppingBag className="w-4 h-4" />
                      <p className="text-xs font-medium">Total Orders</p>
                    </div>
                    <p className="text-2xl font-semibold text-blue-700">{selectedCustomer.orders}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 text-green-600 mb-1">
                      <IndianRupee className="w-4 h-4" />
                      <p className="text-xs font-medium">Total Spent</p>
                    </div>
                    <p className="text-2xl font-semibold text-green-700">{selectedCustomer.totalSpent}</p>
                  </div>
                  {selectedCustomer.joinDate && (
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-xs font-medium text-purple-600 mb-1">Customer Since</p>
                      <p className="text-sm font-semibold text-purple-700">
                        {new Date(selectedCustomer.joinDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3 bg-gray-50">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  openEditModal(selectedCustomer);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Edit Customer
              </button>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
