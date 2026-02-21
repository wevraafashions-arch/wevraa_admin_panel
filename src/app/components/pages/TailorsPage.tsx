import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Edit, Trash2, Phone, Mail, Star, X } from 'lucide-react';
import { ConfirmDeleteDialog } from '../ui/ConfirmDeleteDialog';
import { tailorService } from '../../api/services/tailorService';
import type { ApiTailor, CreateTailorRequest, UpdateTailorRequest } from '../../api/types/tailor';

/** UI tailor (mapped from API); id is string */
interface Tailor {
  id: string;
  name: string;
  phone: string;
  email: string;
  specialization: string[];
  categoryTags: string[];
  experience: string;
  rating: number;
  totalOrders: number;
  status: 'Active' | 'Inactive';
  joiningDate: string;
  addressLine1: string;
  addressLine2: string;
  pincode: string;
  hasGST: boolean;
  gstNumber?: string;
  gstPercentage?: number;
  hsnCode?: string;
}

function mapApiTailorToTailor(api: ApiTailor): Tailor {
  const status = (api.status || 'ACTIVE').toUpperCase() === 'ACTIVE' ? 'Active' : 'Inactive';
  return {
    id: api.id,
    name: api.name,
    phone: api.phone,
    email: api.email,
    specialization: api.specializations ?? [],
    categoryTags: api.categoryTags ?? [],
    experience: api.experience ?? '',
    rating: 0,
    totalOrders: 0,
    status,
    joiningDate: api.createdAt?.split('T')[0] ?? '',
    addressLine1: api.addressLine1 ?? '',
    addressLine2: api.addressLine2 ?? '',
    pincode: api.pincode ?? '',
    hasGST: api.hasGst ?? false,
    gstNumber: api.gstNumber,
    gstPercentage: api.gstPercentage,
    hsnCode: api.hsnCode,
  };
}

export function TailorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTailorId, setEditingTailorId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDeleteTailorId, setPendingDeleteTailorId] = useState<string | null>(null);
  const [tailors, setTailors] = useState<Tailor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [newTailor, setNewTailor] = useState({
    name: '',
    phone: '',
    email: '',
    specialization: [] as string[],
    categoryTags: [] as string[],
    experience: '',
    addressLine1: '',
    addressLine2: '',
    pincode: '',
    status: 'Active' as 'Active' | 'Inactive',
    hasGST: false,
    gstNumber: '',
    gstPercentage: 0,
    hsnCode: '',
  });

  const fetchTailors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await tailorService.getList();
      setTailors(list.map(mapApiTailorToTailor));
    } catch (e) {
      const message =
        e && typeof e === 'object' && 'message' in e ? String((e as { message: string }).message) : 'Failed to load tailors';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTailors();
  }, [fetchTailors]);

  const specializations = [
    'Blouse',
    'Saree Stitching',
    'Lehenga',
    'Anarkali',
    'Salwar Kameez',
    "Men's Suits",
    'Sherwani',
    'Kurta',
    'Churidar',
    'Palazzo',
    'Pants',
    'Gown',
    'Alterations',
    'Kids Wear',
    'Petticoat',
    "Men's Shirts",
  ];

  const categoryTagOptions = ["Men's Shirts", 'Alterations', 'Kids Wear', 'Petticoat'];

  const buildCreatePayload = (): CreateTailorRequest => ({
    name: newTailor.name.trim(),
    phone: newTailor.phone.trim(),
    email: newTailor.email.trim(),
    experience: newTailor.experience.trim() || undefined,
    status: newTailor.status === 'Active' ? 'ACTIVE' : 'INACTIVE',
    addressLine1: newTailor.addressLine1.trim() || undefined,
    addressLine2: newTailor.addressLine2.trim() || undefined,
    pincode: newTailor.pincode.trim() || undefined,
    specializations: newTailor.specialization.length ? newTailor.specialization : undefined,
    categoryTags: newTailor.categoryTags.length ? newTailor.categoryTags : undefined,
    hasGst: newTailor.hasGST,
    gstNumber: newTailor.hasGST && newTailor.gstNumber.trim() ? newTailor.gstNumber.trim() : undefined,
    gstPercentage: newTailor.hasGST ? newTailor.gstPercentage : undefined,
    hsnCode: newTailor.hasGST && newTailor.hsnCode.trim() ? newTailor.hsnCode.trim() : undefined,
  });

  const filteredTailors = tailors.filter(tailor => {
    const matchesSearch = tailor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tailor.phone.includes(searchTerm) ||
                         tailor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || tailor.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddTailor = async () => {
    if (!newTailor.name.trim() || !newTailor.phone.trim() || !newTailor.email.trim()) {
      alert('Please fill in all required fields (name, phone, email)');
      return;
    }
    setSubmitting(true);
    try {
      await tailorService.create(buildCreatePayload());
      await fetchTailors();
      resetModal();
    } catch (e) {
      const message =
        e && typeof e === 'object' && 'message' in e ? String((e as { message: string }).message) : 'Failed to create tailor';
      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateTailor = async () => {
    if (!newTailor.name.trim() || !newTailor.phone.trim() || !newTailor.email.trim()) {
      alert('Please fill in all required fields (name, phone, email)');
      return;
    }
    if (!editingTailorId) return;
    setSubmitting(true);
    try {
      const body: UpdateTailorRequest = buildCreatePayload();
      await tailorService.update(editingTailorId, body);
      await fetchTailors();
      resetModal();
    } catch (e) {
      const message =
        e && typeof e === 'object' && 'message' in e ? String((e as { message: string }).message) : 'Failed to update tailor';
      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditTailor = (tailorId: string) => {
    const tailorToEdit = tailors.find(t => t.id === tailorId);
    if (tailorToEdit) {
      setIsEditMode(true);
      setEditingTailorId(tailorId);
      setNewTailor({
        name: tailorToEdit.name,
        phone: tailorToEdit.phone,
        email: tailorToEdit.email,
        specialization: tailorToEdit.specialization,
        categoryTags: tailorToEdit.categoryTags,
        experience: tailorToEdit.experience,
        addressLine1: tailorToEdit.addressLine1,
        addressLine2: tailorToEdit.addressLine2,
        pincode: tailorToEdit.pincode,
        status: tailorToEdit.status,
        hasGST: tailorToEdit.hasGST,
        gstNumber: tailorToEdit.gstNumber ?? '',
        gstPercentage: tailorToEdit.gstPercentage ?? 0,
        hsnCode: tailorToEdit.hsnCode ?? '',
      });
      setShowAddModal(true);
    }
  };

  const openDeleteTailorDialog = (tailorId: string) => {
    setPendingDeleteTailorId(tailorId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDeleteTailor = async () => {
    if (!pendingDeleteTailorId) return;
    setDeleteLoading(true);
    try {
      await tailorService.delete(pendingDeleteTailorId);
      setDeleteDialogOpen(false);
      setPendingDeleteTailorId(null);
      await fetchTailors();
    } catch (e) {
      const message =
        e && typeof e === 'object' && 'message' in e ? String((e as { message: string }).message) : 'Failed to delete tailor';
      alert(message);
    } finally {
      setDeleteLoading(false);
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
      categoryTags: [],
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

  const toggleCategoryTag = (tag: string) => {
    if (newTailor.categoryTags.includes(tag)) {
      setNewTailor({
        ...newTailor,
        categoryTags: newTailor.categoryTags.filter(t => t !== tag),
      });
    } else {
      setNewTailor({
        ...newTailor,
        categoryTags: [...newTailor.categoryTags, tag],
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
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500">Loading tailors...</p>
        </div>
      ) : (
        <>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
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
                  {(tailor.rating > 0 || tailor.totalOrders > 0) && (
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-700">{tailor.rating || '—'}</span>
                      <span className="text-sm text-gray-500">({tailor.totalOrders || 0} orders)</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEditTailor(tailor.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => openDeleteTailorDialog(tailor.id)}
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
                  {tailor.specialization.length
                    ? tailor.specialization.map((spec, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                        >
                          {spec}
                        </span>
                      ))
                    : <span className="text-sm text-gray-400">—</span>}
                </div>
              </div>
              {tailor.categoryTags.length > 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-xs text-gray-500 mb-2">Category tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {tailor.categoryTags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {tailor.joiningDate && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Joined on {new Date(tailor.joiningDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredTailors.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500">No tailors found</p>
        </div>
      )}
        </>
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
                    onChange={(e) => setNewTailor({ ...newTailor, status: e.target.value as 'Active' | 'Inactive' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
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
                  Category tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {categoryTagOptions.map((tag) => (
                    <label
                      key={tag}
                      className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={newTailor.categoryTags.includes(tag)}
                        onChange={() => toggleCategoryTag(tag)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{tag}</span>
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
                disabled={submitting}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={isEditMode ? handleUpdateTailor : handleAddTailor}
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Saving...' : isEditMode ? 'Update Tailor' : 'Add Tailor'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setPendingDeleteTailorId(null);
        }}
        title="Delete tailor"
        description="Are you sure you want to delete this tailor? This action cannot be undone."
        onConfirm={handleConfirmDeleteTailor}
        isLoading={deleteLoading}
      />
    </div>
  );
}