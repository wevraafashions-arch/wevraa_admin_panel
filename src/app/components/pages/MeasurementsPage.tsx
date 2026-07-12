import { useState, useEffect, useCallback } from 'react';
import { Plus, ArrowLeft, ChevronRight, Ruler, ToggleLeft, ToggleRight, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { tailorCategoriesService } from '../../api/services/tailorCategoriesService';
import { measurementsService } from '../../api/services/measurementsService';
import { measurementPresetsService } from '../../api/services/measurementPresetsService';
import type { ApiTailorCategory } from '../../api/types/tailorCategory';
import type { ApiMeasurement } from '../../api/types/measurement';
import type { ApiMeasurementPreset } from '../../api/types/measurementPreset';
import { ConfirmDeleteDialog } from '../ui/ConfirmDeleteDialog';
import { SortablePresetChips } from '../measurements/SortablePresetChips';
import { SortableMeasurementsTable } from '../measurements/SortableMeasurementsTable';

function sortMeasurements(items: ApiMeasurement[]): ApiMeasurement[] {
  return [...items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

function sortPresets(items: ApiMeasurementPreset[]): ApiMeasurementPreset[] {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder);
}

function findDefaultPreset(items: ApiMeasurementPreset[]): ApiMeasurementPreset | undefined {
  return items.find((p) => p.label.toLowerCase() === 'default');
}

function orderKey<T extends { id: string }>(items: T[]): string {
  return items.map((item) => item.id).join('|');
}

export function MeasurementsPage() {
  const [tree, setTree] = useState<ApiTailorCategory[]>([]);
  const [treeLoading, setTreeLoading] = useState(true);
  const [treeError, setTreeError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<ApiTailorCategory | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<ApiTailorCategory | null>(null);

  const [presets, setPresets] = useState<ApiMeasurementPreset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<ApiMeasurementPreset | null>(null);
  const [presetsLoading, setPresetsLoading] = useState(false);
  const [presetsError, setPresetsError] = useState<string | null>(null);
  const [savedPresetOrderKey, setSavedPresetOrderKey] = useState('');
  const [savingPresetOrder, setSavingPresetOrder] = useState(false);
  const [savedMeasurementOrderKey, setSavedMeasurementOrderKey] = useState('');
  const [savingMeasurementOrder, setSavingMeasurementOrder] = useState(false);

  const [measurements, setMeasurements] = useState<ApiMeasurement[]>([]);
  const [measurementsLoading, setMeasurementsLoading] = useState(false);
  const [measurementsError, setMeasurementsError] = useState<string | null>(null);

  const [showCreatePresetModal, setShowCreatePresetModal] = useState(false);
  const [newPresetLabel, setNewPresetLabel] = useState('');
  const [createPresetError, setCreatePresetError] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMeasurement, setEditingMeasurement] = useState<ApiMeasurement | null>(null);
  const [selectedMeasurement, setSelectedMeasurement] = useState<ApiMeasurement | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [presetDeleteDialogOpen, setPresetDeleteDialogOpen] = useState(false);
  const [pendingDeletePreset, setPendingDeletePreset] = useState<ApiMeasurementPreset | null>(null);
  const [deletingPreset, setDeletingPreset] = useState(false);

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

  const loadMeasurementsForPreset = useCallback(async (preset: ApiMeasurementPreset) => {
    setSelectedPreset(preset);
    setMeasurementsLoading(true);
    setMeasurementsError(null);
    try {
      const list = await measurementsService.getList({ presetId: preset.id });
      const sorted = sortMeasurements(list);
      setMeasurements(sorted);
      setSavedMeasurementOrderKey(orderKey(sorted));
      setPresets((prev) =>
        prev.map((p) => (p.id === preset.id ? { ...p, measurements: sorted } : p))
      );
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to load measurements';
      setMeasurementsError(message);
      setMeasurements([]);
    } finally {
      setMeasurementsLoading(false);
    }
  }, []);

  const loadPresets = useCallback(
    async (subcategoryId: string, keepPresetId?: string | null) => {
      setPresetsLoading(true);
      setMeasurementsLoading(true);
      setPresetsError(null);
      setMeasurementsError(null);
      try {
        const list = await measurementPresetsService.getList(subcategoryId, true);
        const sorted = sortPresets(list);
        setPresets(sorted);
        setSavedPresetOrderKey(orderKey(sorted));
        const defaultPreset = findDefaultPreset(sorted);
        const nextPreset = keepPresetId
          ? sorted.find((p) => p.id === keepPresetId) ?? defaultPreset ?? sorted[0] ?? null
          : defaultPreset ?? sorted[0] ?? null;

        if (nextPreset) {
          await loadMeasurementsForPreset(nextPreset);
        } else {
          setSelectedPreset(null);
          setMeasurements([]);
          setMeasurementsLoading(false);
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Failed to load size presets';
        setPresetsError(message);
        setMeasurementsError(message);
        setPresets([]);
        setSelectedPreset(null);
        setMeasurements([]);
        setMeasurementsLoading(false);
      } finally {
        setPresetsLoading(false);
      }
    },
    [loadMeasurementsForPreset]
  );

  useEffect(() => {
    if (selectedSubCategory?.id) loadPresets(selectedSubCategory.id);
    else {
      setPresets([]);
      setSelectedPreset(null);
      setMeasurements([]);
    }
  }, [selectedSubCategory?.id, loadPresets]);

  const handleSelectPreset = (preset: ApiMeasurementPreset) => {
    if (selectedPreset?.id === preset.id && !measurementsLoading) return;
    loadMeasurementsForPreset(preset);
  };

  const openPresetDeleteDialog = (preset: ApiMeasurementPreset) => {
    if (preset.label.toLowerCase() === 'default') return;
    setPendingDeletePreset(preset);
    setPresetDeleteDialogOpen(true);
  };

  const handleConfirmDeletePreset = async () => {
    if (!pendingDeletePreset || !selectedSubCategory) return;
    setDeletingPreset(true);
    try {
      const result = await measurementPresetsService.delete(pendingDeletePreset.id);
      const wasSelected = selectedPreset?.id === pendingDeletePreset.id;
      setPresetDeleteDialogOpen(false);
      setPendingDeletePreset(null);
      toast.success(`Size ${result.label} deleted`);
      loadPresets(selectedSubCategory.id, wasSelected ? null : selectedPreset?.id);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to delete size preset';
      setPresetsError(message);
      toast.error(message);
    } finally {
      setDeletingPreset(false);
    }
  };

  const hasUnsavedPresetOrder = presets.length > 0 && orderKey(presets) !== savedPresetOrderKey;
  const hasUnsavedMeasurementOrder =
    measurements.length > 0 && orderKey(measurements) !== savedMeasurementOrderKey;

  const handlePresetReorder = useCallback((reordered: ApiMeasurementPreset[]) => {
    setPresets(reordered.map((preset, index) => ({ ...preset, sortOrder: index })));
  }, []);

  const handleSavePresetOrder = async () => {
    if (!selectedSubCategory || !hasUnsavedPresetOrder) return;
    setSavingPresetOrder(true);
    setPresetsError(null);
    try {
      await Promise.all(
        presets.map((preset, index) =>
          measurementPresetsService.update(preset.id, { sortOrder: index })
        )
      );
      setSavedPresetOrderKey(orderKey(presets));
      toast.success('Preset order updated');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to save preset order';
      setPresetsError(message);
      toast.error(message);
      loadPresets(selectedSubCategory.id, selectedPreset?.id);
    } finally {
      setSavingPresetOrder(false);
    }
  };

  const handleCreatePreset = async () => {
    if (!selectedSubCategory || !newPresetLabel.trim()) return;
    setSubmitting(true);
    setMeasurementsLoading(true);
    setCreatePresetError(null);
    try {
      const created = await measurementPresetsService.create({
        subcategoryId: selectedSubCategory.id,
        label: newPresetLabel.trim(),
        sortOrder: presets.length,
      });

      const sourceMeasurements =
        measurements.length > 0
          ? measurements
          : selectedPreset?.measurements
            ? sortMeasurements(selectedPreset.measurements)
            : sortMeasurements(findDefaultPreset(presets)?.measurements ?? []);

      if (sourceMeasurements.length > 0) {
        await measurementPresetsService.bulkSaveMeasurements(created.id, {
          items: sourceMeasurements.map((m, index) => ({
            name: m.name,
            value: String(m.value),
            unit: m.unit || 'inches',
            status: m.status,
            imageUrl: m.imageUrl ?? null,
            sortOrder: m.sortOrder ?? index,
          })),
        });
      }

      setShowCreatePresetModal(false);
      setNewPresetLabel('');
      loadPresets(selectedSubCategory.id, created.id);
    } catch (e) {
      setMeasurementsLoading(false);
      setCreatePresetError(e instanceof Error ? e.message : 'Failed to create size preset');
    } finally {
      setSubmitting(false);
    }
  };

  const reloadCurrentPreset = () => {
    if (selectedSubCategory?.id) {
      loadPresets(selectedSubCategory.id, selectedPreset?.id);
    }
  };

  const handleMeasurementReorder = useCallback((reordered: ApiMeasurement[]) => {
    setMeasurements(
      reordered.map((measurement, index) => ({
        ...measurement,
        sortOrder: index,
      }))
    );
  }, []);

  const handleSaveMeasurementOrder = async () => {
    if (!selectedPreset || !hasUnsavedMeasurementOrder) return;
    setSavingMeasurementOrder(true);
    setMeasurementsError(null);
    try {
      await measurementPresetsService.bulkSaveMeasurements(selectedPreset.id, {
        items: measurements.map((measurement, index) => ({
          name: measurement.name,
          value: String(measurement.value),
          unit: measurement.unit || 'inches',
          status: measurement.status,
          imageUrl: measurement.imageUrl ?? null,
          sortOrder: index,
        })),
      });
      setSavedMeasurementOrderKey(orderKey(measurements));
      toast.success('Measurement order updated');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to save measurement order';
      setMeasurementsError(message);
      toast.error(message);
      if (selectedSubCategory?.id) {
        loadMeasurementsForPreset(selectedPreset);
      }
    } finally {
      setSavingMeasurementOrder(false);
    }
  };

  const handleAddMeasurement = async () => {
    if (!selectedSubCategory || !selectedPreset || !newMeasurement.name.trim()) return;
    const valueNum = Number(newMeasurement.value);
    if (Number.isNaN(valueNum)) return;
    setSubmitting(true);
    try {
      await measurementsService.create({
        subcategoryId: selectedSubCategory.id,
        presetId: selectedPreset.id,
        name: newMeasurement.name.trim(),
        value: valueNum,
        unit: newMeasurement.unit || 'inches',
        status: newMeasurement.status,
        imageUrl: newMeasurement.imageUrl.trim() || undefined,
      });
      reloadCurrentPreset();
      setShowAddModal(false);
      setNewMeasurement({ name: '', value: '', unit: 'inches', status: 'ENABLED', imageUrl: '' });
    } catch (e) {
      setMeasurementsError(e instanceof Error ? e.message : 'Failed to add measurement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditMeasurement = async () => {
    if (!editingMeasurement || !selectedPreset || !newMeasurement.name.trim()) return;
    if (editingMeasurement.presetId && editingMeasurement.presetId !== selectedPreset.id) return;
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
      if (selectedSubCategory) reloadCurrentPreset();
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
      if (selectedSubCategory) reloadCurrentPreset();
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
      if (selectedSubCategory) reloadCurrentPreset();
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
        {presetsError && !measurementsError && (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-red-800 dark:text-red-200">
            {presetsError}
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <button
            onClick={() => {
              setSelectedSubCategory(null);
              setSelectedPreset(null);
              setPresets([]);
              setMeasurements([]);
            }}
            className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {selectedCategory.name} Sub-categories
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 dark:text-white font-medium">{selectedSubCategory.name}</span>
        </div>

        <div className="flex flex-col gap-3 pb-4 border-b border-gray-200 dark:border-gray-700 sm:flex-row sm:items-center">
          <span className="text-xs font-semibold tracking-wide text-blue-900 dark:text-blue-300 uppercase shrink-0">
            Quick Load Size Presets:
          </span>
          <div className="flex flex-1 items-center gap-2 min-w-0">
            {presetsLoading && !presets.length ? (
              <span className="text-sm text-gray-500 dark:text-gray-400">Loading presets...</span>
            ) : (
              <div className="flex-1 min-w-0">
                <SortablePresetChips
                  presets={presets}
                  selectedPresetId={selectedPreset?.id ?? null}
                  onSelect={handleSelectPreset}
                  onReorder={handlePresetReorder}
                  onDelete={openPresetDeleteDialog}
                  disabled={savingPresetOrder || presetsLoading || deletingPreset}
                />
              </div>
            )}
            {hasUnsavedPresetOrder && (
              <button
                type="button"
                onClick={handleSavePresetOrder}
                disabled={savingPresetOrder || presetsLoading}
                className="flex items-center gap-1.5 px-4 py-2 h-11 rounded-full border border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-600 text-sm font-medium hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors shrink-0 disabled:opacity-50"
              >
                {savingPresetOrder ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : null}
                Update adjustment
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setCreatePresetError(null);
                setNewPresetLabel('');
                setShowCreatePresetModal(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 h-11 rounded-full border border-dashed border-blue-500 text-blue-600 dark:text-blue-400 text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              Create New
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{selectedSubCategory.name} - Measurements</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{selectedSubCategory.description}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {hasUnsavedMeasurementOrder && (
              <button
                type="button"
                onClick={handleSaveMeasurementOrder}
                disabled={savingMeasurementOrder || measurementsLoading || !selectedPreset}
                className="flex items-center gap-2 border border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-600 px-4 py-2 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors disabled:opacity-50 text-sm font-medium"
              >
                {savingMeasurementOrder ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : null}
                Update adjustment
              </button>
            )}
            <button
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              onClick={() => setShowAddModal(true)}
              disabled={measurementsLoading || presetsLoading || !selectedPreset || savingMeasurementOrder}
              title={!selectedPreset ? 'Create or select a size preset first' : undefined}
            >
              <Plus className="w-5 h-5" />
              Add Measurement
            </button>
          </div>
        </div>

        {measurementsLoading && !measurements.length ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center text-gray-500 dark:text-gray-400">
            Loading measurements...
          </div>
        ) : (
          <SortableMeasurementsTable
            measurements={measurements}
            submitting={submitting}
            reordering={savingMeasurementOrder}
            onReorder={handleMeasurementReorder}
            onSelectMeasurement={setSelectedMeasurement}
            onToggleStatus={handleToggleStatus}
            onEdit={openEdit}
            onDelete={openDeleteDialog}
            emptyMessage={
              selectedPreset
                ? `No measurements for size ${selectedPreset.label} yet. Add one to get started.`
                : 'Create a size preset to start adding measurements.'
            }
          />
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

        {/* Create Size Preset Modal */}
        {showCreatePresetModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Create Size Preset</h3>
                <button
                  onClick={() => {
                    setShowCreatePresetModal(false);
                    setNewPresetLabel('');
                    setCreatePresetError(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {createPresetError && (
                  <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-800 dark:text-red-200">
                    {createPresetError}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Size Label <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newPresetLabel}
                    onChange={(e) => setNewPresetLabel(e.target.value)}
                    placeholder="e.g., 32, 34, 36"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newPresetLabel.trim() && !submitting) handleCreatePreset();
                    }}
                  />
                  {selectedPreset && measurements.length > 0 && (
                    <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                      Measurements from size <span className="font-medium">{selectedPreset.label}</span> will be copied to the new preset.
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    setShowCreatePresetModal(false);
                    setNewPresetLabel('');
                    setCreatePresetError(null);
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePreset}
                  disabled={submitting || !newPresetLabel.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? 'Creating…' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        )}

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
          open={presetDeleteDialogOpen}
          onOpenChange={(open) => {
            setPresetDeleteDialogOpen(open);
            if (!open) setPendingDeletePreset(null);
          }}
          title={`Delete size ${pendingDeletePreset?.label ?? ''}`}
          description={
            pendingDeletePreset
              ? `Delete size ${pendingDeletePreset.label} and all its measurements? This action cannot be undone.`
              : 'Delete this size preset and all its measurements?'
          }
          onConfirm={handleConfirmDeletePreset}
          isLoading={deletingPreset}
        />

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
