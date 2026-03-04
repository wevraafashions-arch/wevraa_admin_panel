import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, ArrowLeft, ChevronRight, Ruler, ToggleLeft, ToggleRight, X, Image as ImageIcon } from 'lucide-react';
import { tailorCategoriesService } from '../../api/services/tailorCategoriesService';
import { measurementsService } from '../../api/services/measurementsService';
import type { ApiTailorCategory } from '../../api/types/tailorCategory';
import type { ApiMeasurement } from '../../api/types/measurement';
import { ConfirmDeleteDialog } from '../ui/ConfirmDeleteDialog';

export function MeasurementsPage() {
  const [tree, setTree] = useState<ApiTailorCategory[]>([]);
  const [treeLoading, setTreeLoading] = useState(true);
  const [treeError, setTreeError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<ApiTailorCategory | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<ApiTailorCategory | null>(null);

  const [measurements, setMeasurements] = useState<ApiMeasurement[]>([]);
  const [measurementsLoading, setMeasurementsLoading] = useState(false);
  const [measurementsError, setMeasurementsError] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMeasurement, setEditingMeasurement] = useState<ApiMeasurement | null>(null);
  const [selectedMeasurement, setSelectedMeasurement] = useState<ApiMeasurement | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const [newMeasurement, setNewMeasurement] = useState({
    name: '',
    value: '',
    unit: 'inches',
    status: 'ENABLED' as 'ENABLED' | 'DISABLED',
    imageUrl: '',
  });

  const categories = tree.filter((c) => !c.parentId || c.parentId === null);
  const subCategories = selectedCategory?.children ?? [];

  useEffect(() => {
    setTreeLoading(true);
    setTreeError(null);
    tailorCategoriesService
      .getTree()
      .then(setTree)
      .catch((e) => setTreeError(e instanceof Error ? e.message : 'Failed to load categories'))
      .finally(() => setTreeLoading(false));
  }, []);

  const loadMeasurements = useCallback((subcategoryId: string) => {
    setMeasurementsLoading(true);
    setMeasurementsError(null);
    measurementsService
      .getList(subcategoryId)
      .then(setMeasurements)
      .catch((e) => {
        setMeasurementsError(e instanceof Error ? e.message : 'Failed to load measurements');
        setMeasurements([]);
      })
      .finally(() => setMeasurementsLoading(false));
  }, []);

  useEffect(() => {
    if (selectedSubCategory?.id) loadMeasurements(selectedSubCategory.id);
    else setMeasurements([]);
  }, [selectedSubCategory?.id, loadMeasurements]);

  const handleAddMeasurement = async () => {
    if (!selectedSubCategory || !newMeasurement.name.trim()) return;
    const valueNum = Number(newMeasurement.value);
    if (Number.isNaN(valueNum)) return;
    setSubmitting(true);
    try {
      await measurementsService.create({
        subcategoryId: selectedSubCategory.id,
        name: newMeasurement.name.trim(),
        value: valueNum,
        unit: newMeasurement.unit || 'inches',
        status: newMeasurement.status,
        imageUrl: newMeasurement.imageUrl.trim() || undefined,
      });
      loadMeasurements(selectedSubCategory.id);
      setShowAddModal(false);
      setNewMeasurement({ name: '', value: '', unit: 'inches', status: 'ENABLED', imageUrl: '' });
    } catch (e) {
      setMeasurementsError(e instanceof Error ? e.message : 'Failed to add measurement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditMeasurement = async () => {
    if (!editingMeasurement || !newMeasurement.name.trim()) return;
    const valueNum = Number(newMeasurement.value);
    if (Number.isNaN(valueNum)) return;
    setSubmitting(true);
    try {
      await measurementsService.update(editingMeasurement.id, {
        name: newMeasurement.name.trim(),
        value: valueNum,
        unit: newMeasurement.unit || 'inches',
        status: newMeasurement.status,
        imageUrl: newMeasurement.imageUrl.trim() || undefined,
      });
      if (selectedSubCategory) loadMeasurements(selectedSubCategory.id);
      setShowEditModal(false);
      setEditingMeasurement(null);
      setNewMeasurement({ name: '', value: '', unit: 'inches', status: 'ENABLED', imageUrl: '' });
    } catch (e) {
      setMeasurementsError(e instanceof Error ? e.message : 'Failed to update measurement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (m: ApiMeasurement) => {
    const nextStatus = m.status === 'ENABLED' ? 'DISABLED' : 'ENABLED';
    setSubmitting(true);
    try {
      await measurementsService.update(m.id, { status: nextStatus });
      if (selectedSubCategory) loadMeasurements(selectedSubCategory.id);
    } catch (e) {
      setMeasurementsError(e instanceof Error ? e.message : 'Failed to update status');
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteDialog = (id: string) => {
    setPendingDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) return;
    setSubmitting(true);
    try {
      await measurementsService.delete(pendingDeleteId);
      setDeleteDialogOpen(false);
      setPendingDeleteId(null);
      if (selectedSubCategory) loadMeasurements(selectedSubCategory.id);
    } catch (e) {
      setMeasurementsError(e instanceof Error ? e.message : 'Failed to delete measurement');
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (m: ApiMeasurement) => {
    setEditingMeasurement(m);
    setNewMeasurement({
      name: m.name,
      value: String(m.value),
      unit: m.unit || 'inches',
      status: m.status,
      imageUrl: m.imageUrl ?? '',
    });
    setShowEditModal(true);
  };

  if (treeLoading && !tree.length) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Measurements</h2>
        <div className="flex items-center justify-center py-12 text-gray-500 dark:text-gray-400">
          Loading categories...
        </div>
      </div>
    );
  }

  if (treeError && !tree.length) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Measurements</h2>
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-red-800 dark:text-red-200">
          {treeError}
        </div>
      </div>
    );
  }

  if (selectedSubCategory && selectedCategory) {
    return (
      <div className="space-y-6">
        {measurementsError && (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-red-800 dark:text-red-200">
            {measurementsError}
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <button
            onClick={() => setSelectedSubCategory(null)}
            className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {selectedCategory.name} Sub-categories
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 dark:text-white font-medium">{selectedSubCategory.name}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{selectedSubCategory.name} - Measurements</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{selectedSubCategory.description}</p>
          </div>
          <button
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            onClick={() => setShowAddModal(true)}
            disabled={measurementsLoading}
          >
            <Plus className="w-5 h-5" />
            Add Measurement
          </button>
        </div>

        {measurementsLoading && !measurements.length ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center text-gray-500 dark:text-gray-400">
            Loading measurements...
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Measurement Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Unit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {measurements.map((measurement) => (
                  <tr key={measurement.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 ${measurement.status === 'DISABLED' ? 'opacity-60' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedMeasurement(measurement)}
                        className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left"
                      >
                        <ImageIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <Ruler className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{measurement.name}</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">{measurement.value}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{measurement.unit}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(measurement)}
                        disabled={submitting}
                        className="flex items-center gap-2 text-sm disabled:opacity-50"
                      >
                        {measurement.status === 'ENABLED' ? (
                          <>
                            <ToggleRight className="w-6 h-6 text-green-600 dark:text-green-400" />
                            <span className="text-green-700 dark:text-green-400 font-medium">Enabled</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-6 h-6 text-gray-400" />
                            <span className="text-gray-500 dark:text-gray-400 font-medium">Disabled</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => openEdit(measurement)}
                          disabled={submitting}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteDialog(measurement.id)}
                          disabled={submitting}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!measurements.length && !measurementsLoading && (
              <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                No measurements yet. Add one to get started.
              </div>
            )}
          </div>
        )}

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3">
          <Ruler className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-200">Measurement Guidelines</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              All measurements should be taken with a flexible measuring tape. Record measurements accurately for best fitting results.
              Toggle measurements to enable or disable them for this sub-category.
            </p>
          </div>
        </div>

        {/* Add Measurement Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Measurement</h3>
                <button onClick={() => { setShowAddModal(false); setNewMeasurement({ name: '', value: '', unit: 'inches', status: 'ENABLED', imageUrl: '' }); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Measurement Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={newMeasurement.name}
                    onChange={(e) => setNewMeasurement({ ...newMeasurement, name: e.target.value })}
                    placeholder="e.g., Full Length, Bust"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Value <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={newMeasurement.value}
                    onChange={(e) => setNewMeasurement({ ...newMeasurement, value: e.target.value })}
                    placeholder="e.g., 36"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unit</label>
                  <select
                    value={newMeasurement.unit}
                    onChange={(e) => setNewMeasurement({ ...newMeasurement, unit: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="inches">inches</option>
                    <option value="cm">cm</option>
                    <option value="yards">yards</option>
                    <option value="meters">meters</option>
                    <option value="pieces">pieces</option>
                    <option value="threads">threads</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                  <button
                    onClick={() => setNewMeasurement({ ...newMeasurement, status: newMeasurement.status === 'ENABLED' ? 'DISABLED' : 'ENABLED' })}
                    className="flex items-center gap-2 text-sm"
                  >
                    {newMeasurement.status === 'ENABLED' ? (
                      <><ToggleRight className="w-6 h-6 text-green-600" /><span className="text-green-700 dark:text-green-400 font-medium">Enabled</span></>
                    ) : (
                      <><ToggleLeft className="w-6 h-6 text-gray-400" /><span className="text-gray-500 dark:text-gray-400 font-medium">Disabled</span></>
                    )}
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image URL</label>
                  <input
                    type="text"
                    value={newMeasurement.imageUrl}
                    onChange={(e) => setNewMeasurement({ ...newMeasurement, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button onClick={() => { setShowAddModal(false); setNewMeasurement({ name: '', value: '', unit: 'inches', status: 'ENABLED', imageUrl: '' }); }} className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Cancel</button>
                <button onClick={handleAddMeasurement} disabled={submitting || !newMeasurement.name.trim() || newMeasurement.value === ''} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">Add Measurement</button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Measurement Modal */}
        {showEditModal && editingMeasurement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Measurement</h3>
                <button onClick={() => { setShowEditModal(false); setEditingMeasurement(null); setNewMeasurement({ name: '', value: '', unit: 'inches', status: 'ENABLED', imageUrl: '' }); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Measurement Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={newMeasurement.name}
                    onChange={(e) => setNewMeasurement({ ...newMeasurement, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Value <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={newMeasurement.value}
                    onChange={(e) => setNewMeasurement({ ...newMeasurement, value: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unit</label>
                  <select
                    value={newMeasurement.unit}
                    onChange={(e) => setNewMeasurement({ ...newMeasurement, unit: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="inches">inches</option>
                    <option value="cm">cm</option>
                    <option value="yards">yards</option>
                    <option value="meters">meters</option>
                    <option value="pieces">pieces</option>
                    <option value="threads">threads</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                  <button
                    onClick={() => setNewMeasurement({ ...newMeasurement, status: newMeasurement.status === 'ENABLED' ? 'DISABLED' : 'ENABLED' })}
                    className="flex items-center gap-2 text-sm"
                  >
                    {newMeasurement.status === 'ENABLED' ? (
                      <><ToggleRight className="w-6 h-6 text-green-600" /><span className="text-green-700 dark:text-green-400 font-medium">Enabled</span></>
                    ) : (
                      <><ToggleLeft className="w-6 h-6 text-gray-400" /><span className="text-gray-500 dark:text-gray-400 font-medium">Disabled</span></>
                    )}
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image URL</label>
                  <input
                    type="text"
                    value={newMeasurement.imageUrl}
                    onChange={(e) => setNewMeasurement({ ...newMeasurement, imageUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button onClick={() => { setShowEditModal(false); setEditingMeasurement(null); setNewMeasurement({ name: '', value: '', unit: 'inches', status: 'ENABLED', imageUrl: '' }); }} className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Cancel</button>
                <button onClick={handleEditMeasurement} disabled={submitting || !newMeasurement.name.trim() || newMeasurement.value === ''} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">Update Measurement</button>
              </div>
            </div>
          </div>
        )}

        {selectedMeasurement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedMeasurement.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{selectedMeasurement.value} {selectedMeasurement.unit}</p>
                </div>
                <button onClick={() => setSelectedMeasurement(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><X className="w-6 h-6" /></button>
              </div>
              <div className="p-6">
                {selectedMeasurement.imageUrl ? (
                  <div className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img src={selectedMeasurement.imageUrl} alt={selectedMeasurement.name} className="w-full h-auto max-h-96 object-contain" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <ImageIcon className="w-16 h-16 text-gray-300 dark:text-gray-500 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No image available for this measurement</p>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button onClick={() => setSelectedMeasurement(null)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Close</button>
              </div>
            </div>
          </div>
        )}

        <ConfirmDeleteDialog
          open={deleteDialogOpen}
          onOpenChange={(open) => { setDeleteDialogOpen(open); if (!open) setPendingDeleteId(null); }}
          title="Delete measurement"
          description="Are you sure you want to delete this measurement? This action cannot be undone."
          onConfirm={handleConfirmDelete}
          isLoading={submitting}
        />
      </div>
    );
  }

  if (selectedCategory) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <button onClick={() => setSelectedCategory(null)} className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Categories
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 dark:text-white font-medium">{selectedCategory.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{selectedCategory.name} - Sub-categories</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{selectedCategory.description}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subCategories.map((sub) => (
            <div
              key={sub.id}
              onClick={() => setSelectedSubCategory(sub)}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{sub.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{sub.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">View measurements</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Measurements</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage measurement specifications for all garment types</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => setSelectedCategory(category)}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{category.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-white">{category.children?.length ?? 0}</span> sub-categories
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3">
        <Ruler className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
        <div>
          <h4 className="font-medium text-blue-900 dark:text-blue-200">Measurement System</h4>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
            Browse by category to view specific measurement requirements for each garment type. All measurements are standardized for consistency.
          </p>
        </div>
      </div>
    </div>
  );
}
