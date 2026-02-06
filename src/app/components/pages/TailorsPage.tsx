import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Phone, Mail, Star, X } from 'lucide-react';

interface Tailor {
  id: number;
  name: string;
  phone: string;
  email: string;
  specialization: string[];
  experience: string;
  rating: number;
  totalOrders: number;
  status: 'Active' | 'Inactive' | 'On Leave';
  joiningDate: string;
  addressLine1: string;
  addressLine2: string;
  pincode: string;
  hasGST: boolean;
  gstNumber?: string;
  gstPercentage?: number;
  hsnCode?: string;
}

export function TailorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTailorId, setEditingTailorId] = useState<number | null>(null);
  const [newTailor, setNewTailor] = useState({
    name: '',
    phone: '',
    email: '',
    specialization: [] as string[],
    experience: '',
    addressLine1: '',
    addressLine2: '',
    pincode: '',
    status: 'Active' as 'Active' | 'Inactive' | 'On Leave',
    hasGST: false,
    gstNumber: '',
    gstPercentage: 0,
    hsnCode: '',
  });

  const [tailors, setTailors] = useState<Tailor[]>([
    {
      id: 1,
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      email: 'rajesh.kumar@wevraa.com',
      specialization: ['Blouse', 'Saree Stitching'],
      experience: '12 years',
      rating: 4.8,
      totalOrders: 1248,
      status: 'Active',
      joiningDate: '2018-03-15',
      addressLine1: 'T. Nagar, Chennai, Tamil Nadu',
      addressLine2: '',
      pincode: '600017',
      hasGST: true,
      gstNumber: '123456789012345',
      gstPercentage: 18,
      hsnCode: '12345678',
    },
    {
      id: 2,
      name: 'Priya Sharma',
      phone: '+91 99876 54321',
      email: 'priya.sharma@wevraa.com',
      specialization: ['Lehenga', 'Anarkali', 'Salwar Kameez'],
      experience: '8 years',
      rating: 4.9,
      totalOrders: 892,
      status: 'Active',
      joiningDate: '2020-01-10',
      addressLine1: 'Mylapore, Chennai, Tamil Nadu',
      addressLine2: '',
      pincode: '600004',
      hasGST: false,
    },
    {
      id: 3,
      name: 'Arjun Reddy',
      phone: '+91 97654 32109',
      email: 'arjun.reddy@wevraa.com',
      specialization: ['Men\'s Suits', 'Sherwani', 'Kurta'],
      experience: '15 years',
      rating: 4.7,
      totalOrders: 1567,
      status: 'Active',
      joiningDate: '2016-07-22',
      addressLine1: 'Anna Nagar, Chennai, Tamil Nadu',
      addressLine2: '',
      pincode: '600040',
      hasGST: true,
      gstNumber: '123456789012346',
      gstPercentage: 18,
      hsnCode: '12345679',
    },
    {
      id: 4,
      name: 'Lakshmi Iyer',
      phone: '+91 96543 21098',
      email: 'lakshmi.iyer@wevraa.com',
      specialization: ['Blouse', 'Petticoat', 'Alterations'],
      experience: '20 years',
      rating: 5.0,
      totalOrders: 2134,
      status: 'Active',
      joiningDate: '2014-02-01',
      addressLine1: 'Adyar, Chennai, Tamil Nadu',
      addressLine2: '',
      pincode: '600020',
      hasGST: false,
    },
    {
      id: 5,
      name: 'Vikram Singh',
      phone: '+91 95432 10987',
      email: 'vikram.singh@wevraa.com',
      specialization: ['Churidar', 'Palazzo', 'Pants'],
      experience: '6 years',
      rating: 4.5,
      totalOrders: 445,
      status: 'On Leave',
      joiningDate: '2021-05-18',
      addressLine1: 'Velachery, Chennai, Tamil Nadu',
      addressLine2: '',
      pincode: '600042',
      hasGST: true,
      gstNumber: '123456789012347',
      gstPercentage: 18,
      hsnCode: '12345680',
    },
    {
      id: 6,
      name: 'Anjali Desai',
      phone: '+91 94321 09876',
      email: 'anjali.desai@wevraa.com',
      specialization: ['Saree Stitching', 'Lehenga', 'Gown'],
      experience: '10 years',
      rating: 4.6,
      totalOrders: 978,
      status: 'Active',
      joiningDate: '2019-09-12',
      addressLine1: 'Nungambakkam, Chennai, Tamil Nadu',
      addressLine2: '',
      pincode: '600034',
      hasGST: false,
    },
    {
      id: 7,
      name: 'Suresh Patel',
      phone: '+91 93210 98765',
      email: 'suresh.patel@wevraa.com',
      specialization: ['Men\'s Shirts', 'Pants', 'Alterations'],
      experience: '18 years',
      rating: 4.8,
      totalOrders: 1823,
      status: 'Active',
      joiningDate: '2015-11-30',
      addressLine1: 'Porur, Chennai, Tamil Nadu',
      addressLine2: '',
      pincode: '600116',
      hasGST: true,
      gstNumber: '123456789012348',
      gstPercentage: 18,
      hsnCode: '12345681',
    },
    {
      id: 8,
      name: 'Meera Krishnan',
      phone: '+91 92109 87654',
      email: 'meera.krishnan@wevraa.com',
      specialization: ['Blouse', 'Churidar', 'Kids Wear'],
      experience: '5 years',
      rating: 4.4,
      totalOrders: 312,
      status: 'Inactive',
      joiningDate: '2022-03-25',
      addressLine1: 'Tambaram, Chennai, Tamil Nadu',
      addressLine2: '',
      pincode: '600045',
      hasGST: false,
    },
  ]);

  const specializations = [
    'Blouse',
    'Saree Stitching',
    'Lehenga',
    'Anarkali',
    'Salwar Kameez',
    'Men\'s Suits',
    'Sherwani',
    'Kurta',
    'Churidar',
    'Palazzo',
    'Pants',
    'Gown',
    'Alterations',
    'Kids Wear',
    'Petticoat',
    'Men\'s Shirts',
  ];

  const filteredTailors = tailors.filter(tailor => {
    const matchesSearch = tailor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tailor.phone.includes(searchTerm) ||
                         tailor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || tailor.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddTailor = () => {
    if (!newTailor.name || !newTailor.phone || !newTailor.email) {
      alert('Please fill in all required fields');
      return;
    }

    const tailorData: Tailor = {
      id: Math.max(...tailors.map(t => t.id)) + 1,
      ...newTailor,
      rating: 0,
      totalOrders: 0,
      joiningDate: new Date().toISOString().split('T')[0],
    };

    setTailors([...tailors, tailorData]);
    resetModal();
  };

  const handleUpdateTailor = () => {
    if (!newTailor.name || !newTailor.phone || !newTailor.email) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingTailorId !== null) {
      const updatedTailors = tailors.map(tailor =>
        tailor.id === editingTailorId
          ? { ...tailor, ...newTailor }
          : tailor
      );
      setTailors(updatedTailors);
    }

    resetModal();
  };

  const handleEditTailor = (tailorId: number) => {
    const tailorToEdit = tailors.find(t => t.id === tailorId);
    if (tailorToEdit) {
      setIsEditMode(true);
      setEditingTailorId(tailorId);
      setNewTailor({
        name: tailorToEdit.name,
        phone: tailorToEdit.phone,
        email: tailorToEdit.email,
        specialization: tailorToEdit.specialization,
        experience: tailorToEdit.experience,
        addressLine1: tailorToEdit.addressLine1,
        addressLine2: tailorToEdit.addressLine2,
        pincode: tailorToEdit.pincode,
        status: tailorToEdit.status,
        hasGST: tailorToEdit.hasGST,
        gstNumber: tailorToEdit.gstNumber,
        gstPercentage: tailorToEdit.gstPercentage,
        hsnCode: tailorToEdit.hsnCode,
      });
      setShowAddModal(true);
    }
  };

  const handleDeleteTailor = (tailorId: number) => {
    if (window.confirm('Are you sure you want to delete this tailor?')) {
      setTailors(tailors.filter(t => t.id !== tailorId));
    }
  };

  const resetModal = () => {
    setShowAddModal(false);
    setIsEditMode(false);
    setEditingTailorId(null);
    setNewTailor({
      name: '',
      phone: '',
      email: '',
      specialization: [],
      experience: '',
      addressLine1: '',
      addressLine2: '',
      pincode: '',
      status: 'Active',
      hasGST: false,
      gstNumber: '',
      gstPercentage: 0,
      hsnCode: '',
    });
  };

  const toggleSpecialization = (spec: string) => {
    if (newTailor.specialization.includes(spec)) {
      setNewTailor({
        ...newTailor,
        specialization: newTailor.specialization.filter(s => s !== spec),
      });
    } else {
      setNewTailor({
        ...newTailor,
        specialization: [...newTailor.specialization, spec],
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      case 'On Leave':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Tailors</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your tailoring team</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Tailor
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="On Leave">On Leave</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Tailors</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{tailors.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Active Tailors</p>
          <p className="text-2xl font-semibold text-green-600 mt-1">
            {tailors.filter(t => t.status === 'Active').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Average Rating</p>
          <p className="text-2xl font-semibold text-yellow-600 mt-1">
            {(tailors.reduce((sum, t) => sum + t.rating, 0) / tailors.length).toFixed(1)}
          </p>
        </div>
      </div>

      {/* Tailors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTailors.map((tailor) => (
          <div key={tailor.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{tailor.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tailor.status)}`}>
                      {tailor.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium text-gray-700">{tailor.rating}</span>
                    <span className="text-sm text-gray-500">({tailor.totalOrders} orders)</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEditTailor(tailor.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteTailor(tailor.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{tailor.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{tailor.email}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Experience:</span> {tailor.experience}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Address:</span> {tailor.addressLine1}, {tailor.addressLine2}, {tailor.pincode}
                </div>
                {tailor.hasGST && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">GST:</span> {tailor.gstNumber} ({tailor.gstPercentage}%)
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-xs text-gray-500 mb-2">Specializations:</p>
                <div className="flex flex-wrap gap-2">
                  {tailor.specialization.map((spec, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Joined on {new Date(tailor.joiningDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTailors.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500">No tailors found</p>
        </div>
      )}

      {/* Add/Edit Tailor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {isEditMode ? 'Edit Tailor' : 'Add New Tailor'}
              </h2>
              <button 
                className="text-gray-500 hover:text-gray-700" 
                onClick={resetModal}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTailor.name}
                  onChange={(e) => setNewTailor({ ...newTailor, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter tailor name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={newTailor.phone}
                    onChange={(e) => setNewTailor({ ...newTailor, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={newTailor.email}
                    onChange={(e) => setNewTailor({ ...newTailor, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="tailor@wevraa.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience
                  </label>
                  <input
                    type="text"
                    value={newTailor.experience}
                    onChange={(e) => setNewTailor({ ...newTailor, experience: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 5 years"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={newTailor.status}
                    onChange={(e) => setNewTailor({ ...newTailor, status: e.target.value as 'Active' | 'Inactive' | 'On Leave' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 1
                </label>
                <input
                  type="text"
                  value={newTailor.addressLine1}
                  onChange={(e) => setNewTailor({ ...newTailor, addressLine1: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter address line 1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 2
                </label>
                <input
                  type="text"
                  value={newTailor.addressLine2}
                  onChange={(e) => setNewTailor({ ...newTailor, addressLine2: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter address line 2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  value={newTailor.pincode}
                  onChange={(e) => setNewTailor({ ...newTailor, pincode: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter pincode"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specializations
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {specializations.map((spec) => (
                    <label
                      key={spec}
                      className="flex items-center gap-2 p-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={newTailor.specialization.includes(spec)}
                        onChange={() => toggleSpecialization(spec)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{spec}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GST Details
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newTailor.hasGST}
                    onChange={(e) => setNewTailor({ ...newTailor, hasGST: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Has GST</span>
                </div>
                {newTailor.hasGST && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        GST Number
                      </label>
                      <input
                        type="text"
                        value={newTailor.gstNumber}
                        onChange={(e) => setNewTailor({ ...newTailor, gstNumber: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter GST number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        GST Percentage
                      </label>
                      <input
                        type="number"
                        value={newTailor.gstPercentage}
                        onChange={(e) => setNewTailor({ ...newTailor, gstPercentage: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter GST percentage"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        HSN Code
                      </label>
                      <input
                        type="text"
                        value={newTailor.hsnCode}
                        onChange={(e) => setNewTailor({ ...newTailor, hsnCode: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter HSN code"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={resetModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={isEditMode ? handleUpdateTailor : handleAddTailor}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isEditMode ? 'Update Tailor' : 'Add Tailor'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}