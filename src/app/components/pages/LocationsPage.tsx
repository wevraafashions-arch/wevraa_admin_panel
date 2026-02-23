import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, MapPin, Phone, Mail, Trash2, X, Users } from 'lucide-react';
import { ConfirmDeleteDialog } from '../ui/ConfirmDeleteDialog';
import { locationsService } from '@/app/api/services/locationsService';
import type { ApiLocation } from '@/app/api/types/location';

interface Location {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  status: 'Active' | 'Inactive';
  staff: number;
}

function apiToUi(api: ApiLocation): Location {
  return {
    id: api.id,
    name: api.name,
    address: api.address,
    phone: api.phone,
    email: api.email,
    status: api.status === 'ACTIVE' ? 'Active' : 'Inactive',
    staff: api.staffCount ?? 0,
  };
}

export function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDeleteLocationId, setPendingDeleteLocationId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [locationForm, setLocationForm] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    status: 'Active' as Location['status'],
    staff: 0,
  });

  const loadLocations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await locationsService.getList();
      setLocations(list.map(apiToUi));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load locations');
      setLocations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setLocationForm({
      name: '',
      address: '',
      phone: '',
      email: '',
      status: 'Active',
      staff: 0,
    });
    setIsEditMode(false);
    setEditingLocationId(null);
  };

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await locationsService.create({
        name: locationForm.name,
        address: locationForm.address,
        phone: locationForm.phone,
        email: locationForm.email,
        status: locationForm.status === 'Active' ? 'ACTIVE' : 'INACTIVE',
        staffCount: locationForm.staff,
      });
      await loadLocations();
      setShowAddModal(false);
      resetForm();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to add location');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLocationId) return;
    setSubmitting(true);
    try {
      await locationsService.update(editingLocationId, {
        name: locationForm.name,
        address: locationForm.address,
        phone: locationForm.phone,
        email: locationForm.email,
        status: locationForm.status === 'Active' ? 'ACTIVE' : 'INACTIVE',
        staffCount: locationForm.staff,
      });
      await loadLocations();
      setShowAddModal(false);
      resetForm();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update location');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (location: Location) => {
    setIsEditMode(true);
    setEditingLocationId(location.id);
    setLocationForm({
      name: location.name,
      address: location.address,
      phone: location.phone,
      email: location.email,
      status: location.status,
      staff: location.staff,
    });
    setShowAddModal(true);
  };

  const openDeleteDialog = (locationId: string) => {
    setPendingDeleteLocationId(locationId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDeleteLocation = async () => {
    if (pendingDeleteLocationId === null) return;
    setSubmitting(true);
    try {
      await locationsService.delete(pendingDeleteLocationId);
      setDeleteDialogOpen(false);
      setPendingDeleteLocationId(null);
      await loadLocations();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete location');
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewDetails = (location: Location) => {
    setSelectedLocation(location);
    setShowDetailsModal(true);
  };

  const totalStaff = locations.reduce((sum, loc) => sum + loc.staff, 0);
  const activeLocations = locations.filter(loc => loc.status === 'Active').length;
  const inactiveLocations = locations.filter(loc => loc.status === 'Inactive').length;

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-red-800 dark:text-red-200">
          {error}
        </div>
      )}
      {loading && !locations.length ? (
        <div className="flex items-center justify-center py-12 text-gray-500 dark:text-gray-400">
          Loading locations...
        </div>
      ) : (
        <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Locations</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage store locations and branches</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5" />
          Add Location
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Locations</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">{locations.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Active Locations</p>
          <p className="text-2xl font-semibold text-green-600 dark:text-green-400 mt-1">{activeLocations}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Staff</p>
          <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mt-1">{totalStaff}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Inactive</p>
          <p className="text-2xl font-semibold text-yellow-600 dark:text-yellow-400 mt-1">{inactiveLocations}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Locations List */}
        <div className="p-6 space-y-4">
          {filteredLocations.map((location) => (
            <div key={location.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                      <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{location.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{location.address}</p>
                        </div>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          location.status === 'Active'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400'
                        }`}>
                          {location.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Phone className="w-4 h-4" />
                          {location.phone}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Mail className="w-4 h-4" />
                          {location.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Users className="w-4 h-4" />
                          <span className="font-semibold">{location.staff}</span> staff members
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleViewDetails(location)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => openEditModal(location)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteDialog(location.id)}
                          className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredLocations.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">No locations found</p>
          </div>
        )}
      </div>
        </>
      )}

      {/* Add/Edit Location Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {isEditMode ? 'Edit Location' : 'Add New Location'}
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
            <form onSubmit={isEditMode ? handleEditLocation : handleAddLocation} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location Name *
                </label>
                <input
                  type="text"
                  required
                  value={locationForm.name}
                  onChange={(e) => setLocationForm({ ...locationForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Main Store"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <textarea
                  required
                  rows={3}
                  value={locationForm.address}
                  onChange={(e) => setLocationForm({ ...locationForm, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Complete address with pincode"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={locationForm.phone}
                    onChange={(e) => setLocationForm({ ...locationForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+91 80-2345-6789"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={locationForm.email}
                    onChange={(e) => setLocationForm({ ...locationForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="location@wevraa.in"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={locationForm.status}
                    onChange={(e) => setLocationForm({ ...locationForm, status: e.target.value as Location['status'] })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Staff Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={locationForm.staff}
                    onChange={(e) => setLocationForm({ ...locationForm, staff: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
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
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : isEditMode ? 'Update Location' : 'Add Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showDetailsModal && selectedLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">{selectedLocation.name}</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-gray-900">Location Details</h4>
                </div>
                <div className="space-y-3 ml-8">
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="text-gray-900">{selectedLocation.address}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="text-gray-900">{selectedLocation.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="text-gray-900">{selectedLocation.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                      <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mt-1 ${
                        selectedLocation.status === 'Active'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400'
                      }`}>
                        {selectedLocation.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Staff Count</p>
                      <p className="text-gray-900 font-semibold">{selectedLocation.staff} members</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3 bg-gray-50">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  openEditModal(selectedLocation);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Edit Location
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

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setPendingDeleteLocationId(null);
        }}
        title="Delete location"
        description="Are you sure you want to delete this location? This action cannot be undone."
        onConfirm={handleConfirmDeleteLocation}
        isLoading={submitting}
      />
    </div>
  );
}
