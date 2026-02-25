import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';
import { ConfirmDeleteDialog } from '../ui/ConfirmDeleteDialog';
import { gstRatesService } from '../../api/services/gstRatesService';
import type { GSTRate } from '../../api/types/gstRate';
import type { HSNCodeItem } from '../../api/types/gstRate';
import { ApiError } from '../../api/client';

export function TaxSettingsPage() {
  const [gstRates, setGstRates] = useState<GSTRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showGSTModal, setShowGSTModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formRate, setFormRate] = useState({
    name: '',
    percentage: 0,
    isDefault: false,
  });
  const [formHsnCodes, setFormHsnCodes] = useState<HSNCodeItem[]>([]);

  const loadRates = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await gstRatesService.getList();
      setGstRates(list);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load GST rates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRates();
  }, []);

  const handleAddGSTRate = async () => {
    if (!formRate.name || formRate.percentage <= 0) {
      alert('Please fill in name and percentage');
      return;
    }
    setSubmitting(true);
    try {
      await gstRatesService.create({
        name: formRate.name,
        percentage: formRate.percentage,
        isDefault: formRate.isDefault || undefined,
        hsnCodes: formHsnCodes.length > 0 ? formHsnCodes : undefined,
      });
      await loadRates();
      resetGSTModal();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : 'Failed to add GST rate');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateGSTRate = async () => {
    if (!formRate.name || formRate.percentage <= 0 || editingId == null) return;
    setSubmitting(true);
    try {
      await gstRatesService.update(editingId, {
        name: formRate.name,
        percentage: formRate.percentage,
        isDefault: formRate.isDefault || undefined,
        hsnCodes: formHsnCodes,
      });
      await loadRates();
      resetGSTModal();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : 'Failed to update GST rate');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditGSTRate = (rate: GSTRate) => {
    setIsEditMode(true);
    setEditingId(rate.id);
    setFormRate({
      name: rate.name,
      percentage: rate.percentage,
      isDefault: rate.isDefault,
    });
    setFormHsnCodes(
      (rate.hsnCodes || []).map((h) => ({ code: h.code, description: h.description }))
    );
    setShowGSTModal(true);
  };

  const openDeleteGSTRateDialog = (rateId: string | number) => {
    setPendingDelete(rateId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDeleteTax = async () => {
    if (pendingDelete == null) return;
    try {
      await gstRatesService.delete(pendingDelete);
      await loadRates();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : 'Failed to delete GST rate');
    }
    setDeleteDialogOpen(false);
    setPendingDelete(null);
  };

  const resetGSTModal = () => {
    setShowGSTModal(false);
    setIsEditMode(false);
    setEditingId(null);
    setFormRate({ name: '', percentage: 0, isDefault: false });
    setFormHsnCodes([]);
  };

  const addHsnRow = () => {
    setFormHsnCodes([...formHsnCodes, { code: '', description: '' }]);
  };

  const updateHsnRow = (index: number, field: 'code' | 'description', value: string) => {
    const next = [...formHsnCodes];
    next[index] = { ...next[index], [field]: value };
    setFormHsnCodes(next);
  };

  const removeHsnRow = (index: number) => {
    setFormHsnCodes(formHsnCodes.filter((_, i) => i !== index));
  };

  const formatHsnColumn = (rate: GSTRate) => {
    const list = rate.hsnCodes || [];
    const count = rate._count?.hsnCodes ?? list.length;
    if (count === 0) return '—';
    const codes = list.slice(0, 2).map((h) => h.code).join(', ');
    return count <= 2 ? codes : `${codes} (+${count - 2} more)`;
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Tax Settings</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Manage GST rates and optional HSN codes for your business
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">GST Rates</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Configure GST rates and optional HSN codes for your tailoring services
              </p>
            </div>
            <button
              onClick={() => {
                resetGSTModal();
                setShowGSTModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add GST Rate
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-sm text-gray-500 dark:text-gray-400">Loading GST rates…</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                      Percentage
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                      Default
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                      HSN
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {gstRates.map((rate) => (
                    <tr
                      key={String(rate.id)}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                        {rate.name}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                        {rate.percentage}%
                      </td>
                      <td className="py-3 px-4">
                        {rate.isDefault && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            Default
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                        {formatHsnColumn(rate)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditGSTRate(rate)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDeleteGSTRateDialog(rate.id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {gstRates.length === 0 && !loading && (
                <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  No GST rates yet. Add one to get started.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* GST Rate Modal (Add / Edit with optional HSN) */}
      {showGSTModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between shrink-0">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {isEditMode ? 'Edit GST Rate' : 'Add GST Rate'}
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={resetGSTModal}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formRate.name}
                  onChange={(e) => setFormRate({ ...formRate, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., GST 18%"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Percentage <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formRate.percentage || ''}
                  onChange={(e) =>
                    setFormRate({
                      ...formRate,
                      percentage: e.target.value ? parseFloat(e.target.value) : 0,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="0–100"
                  min={0}
                  max={100}
                  step={0.01}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formRate.isDefault}
                  onChange={(e) => setFormRate({ ...formRate, isDefault: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label className="text-sm text-gray-700 dark:text-gray-300">Set as default rate</label>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    HSN codes (optional)
                  </label>
                  <button
                    type="button"
                    onClick={addHsnRow}
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    + Add HSN
                  </button>
                </div>
                {formHsnCodes.length > 0 && (
                  <div className="space-y-2">
                    {formHsnCodes.map((row, index) => (
                      <div
                        key={index}
                        className="flex gap-2 items-start p-2 rounded border border-gray-200 dark:border-gray-600"
                      >
                        <input
                          type="text"
                          value={row.code}
                          onChange={(e) => updateHsnRow(index, 'code', e.target.value)}
                          className="flex-1 min-w-0 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white text-sm"
                          placeholder="Code (e.g. 6217)"
                        />
                        <input
                          type="text"
                          value={row.description}
                          onChange={(e) => updateHsnRow(index, 'description', e.target.value)}
                          className="flex-1 min-w-0 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white text-sm"
                          placeholder="Description"
                        />
                        <button
                          type="button"
                          onClick={() => removeHsnRow(index)}
                          className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-3 shrink-0">
              <button
                onClick={resetGSTModal}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={isEditMode ? handleUpdateGSTRate : handleAddGSTRate}
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {submitting ? 'Saving…' : isEditMode ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setPendingDelete(null);
        }}
        title="Delete GST rate"
        description="Are you sure you want to delete this GST rate? This action cannot be undone."
        onConfirm={handleConfirmDeleteTax}
      />
    </div>
  );
}
