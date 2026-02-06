import { Plus, Search, Filter, Star, TrendingUp, DollarSign, Package, Eye } from 'lucide-react';
import { useState } from 'react';
import { useVendors } from '@/contexts/VendorContext';
import { AddVendorModal } from '../AddVendorModal';

export function VendorsPage() {
  const { vendors, addVendor, updateVendor, deleteVendor } = useVendors();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<typeof vendors[0] | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<typeof vendors[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Inactive'>('All');

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vendor.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vendor.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || vendor.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (vendor: typeof vendors[0]) => {
    setEditingVendor(vendor);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingVendor(null);
  };

  const handleSave = (vendorData: Omit<typeof vendors[0], 'id'>) => {
    if (editingVendor) {
      updateVendor(editingVendor.id, vendorData);
    } else {
      addVendor(vendorData);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this vendor?')) {
      deleteVendor(id);
    }
  };

  const totalActiveVendors = vendors.filter(v => v.status === 'Active').length;
  const totalOrders = vendors.reduce((sum, v) => sum + (v.totalOrders || 0), 0);
  const totalAmount = vendors.reduce((sum, v) => sum + (v.totalAmount || 0), 0);
  const avgRating = vendors.length > 0 
    ? vendors.reduce((sum, v) => sum + v.rating, 0) / vendors.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Vendor Management</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage your supplier network</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Vendor
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Vendors</div>
            <Package className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-semibold text-gray-900 dark:text-white">{vendors.length}</div>
          <div className="text-xs text-green-600 dark:text-green-400 mt-1">
            {totalActiveVendors} Active
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Orders</div>
            <TrendingUp className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-2xl font-semibold text-gray-900 dark:text-white">
            {totalOrders.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">All time</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Amount</div>
            <DollarSign className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-semibold text-gray-900 dark:text-white">
            ₹{(totalAmount / 100000).toFixed(1)}L
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">All time</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-500 dark:text-gray-400">Avg Rating</div>
            <Star className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="text-2xl font-semibold text-gray-900 dark:text-white">
            {avgRating.toFixed(1)}
          </div>
          <div className="flex items-center mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.round(avgRating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search vendors by name, company, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <div className="flex gap-2">
            {(['All', 'Active', 'Inactive'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Vendors Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredVendors.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No vendors found</p>
                  </td>
                </tr>
              ) : (
                filteredVendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {vendor.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {vendor.companyName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        {vendor.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">{vendor.phone}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{vendor.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">{vendor.city}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{vendor.state}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {vendor.rating.toFixed(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {vendor.totalOrders?.toLocaleString('en-IN')}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        ₹{((vendor.totalAmount || 0) / 1000).toFixed(0)}K
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        vendor.status === 'Active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {vendor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => setSelectedVendor(vendor)}
                        className="text-purple-600 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 mr-3"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => handleEdit(vendor)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(vendor.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vendor Detail Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Vendor Details</h2>
              <button
                onClick={() => setSelectedVendor(null)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Company Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Company Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Company Name</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedVendor.companyName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Contact Person</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedVendor.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedVendor.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">GSTIN</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedVendor.gstin || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedVendor.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedVendor.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedVendor.address}, {selectedVendor.city}, {selectedVendor.state} - {selectedVendor.pincode}
                    </p>
                  </div>
                </div>
              </div>

              {/* Business Stats */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Business Statistics</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {selectedVendor.totalOrders?.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ₹{((selectedVendor.totalAmount || 0) / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Rating</p>
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {selectedVendor.rating.toFixed(1)} ⭐
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <AddVendorModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        editingVendor={editingVendor}
      />
    </div>
  );
}
