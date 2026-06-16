import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock,
  Package,
  X,
  GripVertical,
  Layers,
  FolderTree,
} from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { statusManagementService } from '@/app/api/services/statusManagementService';
import type {
  StatusManagementCategory,
  StatusManagementMeta,
  StatusManagementOverview,
  StatusManagementSubcategory,
  SubcategoryWorkflowResponse,
  WorkflowStatus,
} from '@/app/api/types/statusManagement';
import {
  formatCategoryStatus,
  getStatusColorClasses,
  getStatusIconComponent,
  mapWorkflowStatus,
  type DisplayStatus,
} from '@/app/utils/statusManagementUi';
import { ConfirmDeleteDialog } from '../ui/ConfirmDeleteDialog';

interface DraggableStatusRowProps {
  status: DisplayStatus;
  index: number;
  moveStatus: (dragIndex: number, hoverIndex: number) => void;
  onEdit: () => void;
  onDelete: () => void;
}

function DraggableStatusRow({ status, index, moveStatus, onEdit, onDelete }: DraggableStatusRowProps) {
  const ref = useRef<HTMLTableRowElement>(null);
  const Icon = getStatusIconComponent(status.icon);

  const [{ handlerId }, drop] = useDrop({
    accept: 'status',
    collect(monitor) {
      return { handlerId: monitor.getHandlerId() };
    },
    hover(item: { index: number }, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset?.y ?? 0) - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveStatus(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'status',
    item: () => ({ id: status.id, index }),
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  drag(drop(ref));

  return (
    <tr
      ref={ref}
      data-handler-id={handlerId}
      className="hover:bg-gray-50 cursor-move"
      style={{ opacity: isDragging ? 0.4 : 1 }}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-gray-400 cursor-grab active:cursor-grabbing" />
          <span className="text-sm font-medium text-gray-900">{status.order}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" />
          <span className="text-sm font-medium text-gray-900">{status.name}</span>
          {status.isDefault && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">Default</span>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-600 max-w-xs">{status.description}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColorClasses(status.color)}`}
        >
          {status.color}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {status.notifyCustomer ? (
          <CheckCircle className="w-5 h-5 text-green-600" />
        ) : (
          <X className="w-5 h-5 text-gray-400" />
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            status.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}
        >
          {status.active ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          {!status.isDefault && (
            <button
              type="button"
              onClick={onDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

const defaultForm = {
  name: '',
  description: '',
  color: 'blue',
  icon: 'Package',
  order: 1,
  notifyCustomer: true,
  active: true,
  isDefault: false,
};

export function StatusManagementPage() {
  const [overview, setOverview] = useState<StatusManagementOverview | null>(null);
  const [categories, setCategories] = useState<StatusManagementCategory[]>([]);
  const [subcategories, setSubcategories] = useState<StatusManagementSubcategory[]>([]);
  const [workflow, setWorkflow] = useState<SubcategoryWorkflowResponse | null>(null);
  const [meta, setMeta] = useState<StatusManagementMeta | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<StatusManagementCategory | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<StatusManagementSubcategory | null>(null);

  const [listLoading, setListLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(false);
  const [workflowLoading, setWorkflowLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [isAddingStatus, setIsAddingStatus] = useState(false);
  const [editingStatus, setEditingStatus] = useState<WorkflowStatus | null>(null);
  const [formData, setFormData] = useState(defaultForm);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDeleteStatusId, setPendingDeleteStatusId] = useState<string | null>(null);

  const loadHome = useCallback(async () => {
    setListLoading(true);
    setError(null);
    try {
      const [ov, cats] = await Promise.all([
        statusManagementService.getOverview(),
        statusManagementService.listCategories(),
      ]);
      setOverview(ov);
      setCategories(cats);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load status management data');
      setOverview(null);
      setCategories([]);
    } finally {
      setListLoading(false);
    }
  }, []);

  const loadSubcategories = useCallback(async (categoryId: string) => {
    setSubLoading(true);
    setError(null);
    try {
      const subs = await statusManagementService.listSubcategories(categoryId);
      setSubcategories(subs);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load subcategories');
      setSubcategories([]);
    } finally {
      setSubLoading(false);
    }
  }, []);

  const loadWorkflow = useCallback(async (subcategoryId: string) => {
    setWorkflowLoading(true);
    setError(null);
    try {
      const data = await statusManagementService.getWorkflow(subcategoryId);
      setWorkflow(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load workflow');
      setWorkflow(null);
    } finally {
      setWorkflowLoading(false);
    }
  }, []);

  const ensureMeta = useCallback(async () => {
    if (meta) return meta;
    const m = await statusManagementService.getMeta();
    setMeta(m);
    return m;
  }, [meta]);

  useEffect(() => {
    void loadHome();
  }, [loadHome]);

  useEffect(() => {
    if (!selectedCategory) {
      setSubcategories([]);
      return;
    }
    void loadSubcategories(selectedCategory.id);
  }, [selectedCategory, loadSubcategories]);

  useEffect(() => {
    if (!selectedSubCategory) {
      setWorkflow(null);
      return;
    }
    void loadWorkflow(selectedSubCategory.id);
  }, [selectedSubCategory, loadWorkflow]);

  const sortedStatuses = useMemo(() => {
    if (!workflow) return [];
    return [...workflow.statuses]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(mapWorkflowStatus);
  }, [workflow]);

  const openDeleteStatusDialog = (statusId: string) => {
    setPendingDeleteStatusId(statusId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDeleteStatus = async () => {
    if (!pendingDeleteStatusId || !selectedSubCategory) return;
    setSaving(true);
    setError(null);
    try {
      await statusManagementService.deleteStatus(pendingDeleteStatusId);
      setDeleteDialogOpen(false);
      setPendingDeleteStatusId(null);
      await loadWorkflow(selectedSubCategory.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete status');
    } finally {
      setSaving(false);
    }
  };

  const closeModal = () => {
    setIsAddingStatus(false);
    setEditingStatus(null);
    setFormData(defaultForm);
  };

  const openAddModal = async () => {
    if (!selectedSubCategory) return;
    try {
      const m = await ensureMeta();
      const maxOrder = sortedStatuses.length
        ? Math.max(...sortedStatuses.map((s) => s.order), 0)
        : 0;
      setFormData({
        ...defaultForm,
        color: m.colors[0] ?? 'blue',
        icon: m.icons[0] ?? 'Package',
        order: maxOrder + 1,
        isDefault: sortedStatuses.length === 0,
      });
      setIsAddingStatus(true);
      setEditingStatus(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load form options');
    }
  };

  const openEditModal = async (status: DisplayStatus) => {
    try {
      await ensureMeta();
      const full = await statusManagementService.getStatusById(status.id);
      setEditingStatus(full);
      setFormData({
        name: full.name,
        description: full.description ?? '',
        color: full.color,
        icon: full.icon,
        order: full.sortOrder,
        notifyCustomer: full.notifyCustomer,
        active: full.isActive,
        isDefault: full.isDefault,
      });
      setIsAddingStatus(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load status');
    }
  };

  const handleSaveStatus = async () => {
    if (!selectedSubCategory || !formData.name.trim()) {
      setError('Please fill in the status name');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (editingStatus) {
        await statusManagementService.updateStatus(editingStatus.id, {
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          color: formData.color,
          icon: formData.icon,
          sortOrder: formData.order,
          notifyCustomer: formData.notifyCustomer,
          isActive: formData.active,
          ...(formData.isDefault && !editingStatus.isDefault ? { isDefault: true } : {}),
        });
      } else {
        await statusManagementService.createStatus(selectedSubCategory.id, {
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          color: formData.color,
          icon: formData.icon,
          sortOrder: formData.order,
          notifyCustomer: formData.notifyCustomer,
          isActive: formData.active,
          isDefault: formData.isDefault,
        });
      }
      await loadWorkflow(selectedSubCategory.id);
      closeModal();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save status');
    } finally {
      setSaving(false);
    }
  };

  const moveStatus = async (dragIndex: number, hoverIndex: number) => {
    if (!selectedSubCategory || !workflow) return;

    const sorted = [...workflow.statuses].sort((a, b) => a.sortOrder - b.sortOrder);
    const dragged = sorted[dragIndex];
    const updated = [...sorted];
    updated.splice(dragIndex, 1);
    updated.splice(hoverIndex, 0, dragged);

    const reordered = updated.map((s, i) => ({ ...s, sortOrder: i + 1 }));
    setWorkflow({ ...workflow, statuses: reordered });

    try {
      const result = await statusManagementService.reorderStatuses(selectedSubCategory.id, {
        items: reordered.map((s) => ({ id: s.id, sortOrder: s.sortOrder })),
      });
      setWorkflow(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to reorder statuses');
      await loadWorkflow(selectedSubCategory.id);
    }
  };

  const errorBanner = error ? (
    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex justify-between items-center gap-4">
      <span>{error}</span>
      <button type="button" onClick={() => setError(null)} className="text-red-700 hover:underline shrink-0">
        Dismiss
      </button>
    </div>
  ) : null;

  const statusModal = (isAddingStatus || editingStatus) && (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 z-10">
          <h3 className="text-xl font-semibold text-gray-900">
            {editingStatus ? 'Edit Status' : 'Add New Status'}
          </h3>
          <button type="button" onClick={closeModal} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Stitching in Progress"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              placeholder="Brief description of this status stage"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <select
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {(meta?.colors ?? ['blue']).map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {(meta?.icons ?? ['Package']).map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Order Position</label>
            <input
              type="number"
              min={1}
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 1 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Lower numbers appear first in the workflow</p>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.notifyCustomer}
                onChange={(e) => setFormData({ ...formData, notifyCustomer: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">Notify Customer</span>
                <p className="text-xs text-gray-500">Send notification when order reaches this status</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">Active</span>
                <p className="text-xs text-gray-500">Only active statuses can be assigned to orders</p>
              </div>
            </label>

            {(!editingStatus || !editingStatus.isDefault) && (
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900">Set as Default Status</span>
                  <p className="text-xs text-gray-500">New orders will start with this status</p>
                </div>
              </label>
            )}
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 sticky bottom-0">
          <button
            type="button"
            onClick={closeModal}
            disabled={saving}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleSaveStatus()}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : editingStatus ? 'Update Status' : 'Add Status'}
          </button>
        </div>
      </div>
    </div>
  );

  let content: ReactNode;

  if (selectedCategory && selectedSubCategory) {
    const parentName = workflow?.subcategory.parent.name ?? selectedCategory.name;
    const subName = workflow?.subcategory.name ?? selectedSubCategory.name;
    const stats = workflow?.stats;

    content = (
      <div className="space-y-6">
        {errorBanner}

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory(null);
              setSelectedSubCategory(null);
            }}
            className="hover:text-blue-600 transition-colors"
          >
            Status Management
          </button>
          <ChevronRight className="w-4 h-4" />
          <button
            type="button"
            onClick={() => setSelectedSubCategory(null)}
            className="hover:text-blue-600 transition-colors"
          >
            {parentName}
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{subName}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FolderTree className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {parentName} - {subName}
              </h2>
              <p className="text-sm text-gray-600 mt-1">{selectedSubCategory.description}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => void openAddModal()}
            disabled={workflowLoading || saving}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
            Add Status
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-900">Status Workflow Configuration</h3>
            <p className="text-sm text-blue-700 mt-1">
              Drag and drop to reorder. Customers are notified when orders reach stages with &quot;Notify
              Customer&quot; enabled.
            </p>
          </div>
        </div>

        {workflowLoading ? (
          <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">Loading workflow…</div>
        ) : sortedStatuses.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">No statuses configured for this subcategory yet.</p>
            <button
              type="button"
              onClick={() => void openAddModal()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              Add first status
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Status Progression Timeline</h3>
              <div className="space-y-4">
                {sortedStatuses.map((status, index) => {
                  const Icon = getStatusIconComponent(status.icon);
                  return (
                    <div key={status.id} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full ${getStatusColorClasses(status.color)} border-2 flex items-center justify-center`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        {index < sortedStatuses.length - 1 && (
                          <div className="w-0.5 h-16 bg-gray-300 my-1" />
                        )}
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-base font-semibold text-gray-900">{status.name}</h4>
                              {status.isDefault && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                  Default
                                </span>
                              )}
                              {!status.active && (
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                                  Inactive
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{status.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>
                                <span className="font-medium">Order:</span> {status.order}
                              </span>
                              <span>
                                <span className="font-medium">Notify:</span>{' '}
                                {status.notifyCustomer ? 'Yes' : 'No'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <button
                              type="button"
                              onClick={() => void openEditModal(status)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            {!status.isDefault && (
                              <button
                                type="button"
                                onClick={() => openDeleteStatusDialog(status.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">All Statuses</h3>
                <p className="text-sm text-gray-500">Drag rows to reorder</p>
              </div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Color</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notify</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Active</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedStatuses.map((status, index) => (
                    <DraggableStatusRow
                      key={status.id}
                      status={status}
                      index={index}
                      moveStatus={(from, to) => void moveStatus(from, to)}
                      onEdit={() => void openEditModal(status)}
                      onDelete={() => openDeleteStatusDialog(status.id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Total Statuses</p>
            <p className="text-2xl font-semibold text-gray-900 mt-2">{stats?.total ?? sortedStatuses.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Active Statuses</p>
            <p className="text-2xl font-semibold text-green-600 mt-2">{stats?.active ?? 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">With Notifications</p>
            <p className="text-2xl font-semibold text-blue-600 mt-2">{stats?.withNotifications ?? 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Default Status</p>
            <p className="text-sm font-medium text-gray-900 mt-2">
              {stats?.defaultStatusName ?? sortedStatuses.find((s) => s.isDefault)?.name ?? 'None'}
            </p>
          </div>
        </div>

        {statusModal}
      </div>
    );
  } else if (selectedCategory) {
    content = (
      <div className="space-y-6">
        {errorBanner}

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <button
            type="button"
            onClick={() => setSelectedCategory(null)}
            className="flex items-center gap-2 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Categories
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{selectedCategory.name}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <FolderTree className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{selectedCategory.name} - Select Sub-Category</h2>
            <p className="text-sm text-gray-600 mt-1">Choose a sub-category to configure its status workflow</p>
          </div>
        </div>

        {subLoading ? (
          <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">Loading subcategories…</div>
        ) : subcategories.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
            No subcategories found. Add them under Tailor Categories first.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subcategories.map((sub) => {
              const label = formatCategoryStatus(sub.status);
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setSelectedSubCategory(sub)}
                  className="bg-white rounded-lg shadow hover:shadow-xl transition-all text-left overflow-hidden group"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{sub.name}</h3>
                        <p className="text-sm text-gray-600">{sub.description}</p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full shrink-0 ml-3 ${
                          label === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500">Orders</p>
                        <p className="text-lg font-semibold text-gray-900 mt-1">{sub.orderCount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Statuses</p>
                        <p className="text-lg font-semibold text-blue-600 mt-1">{sub.statusCount}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                      <span className="text-sm text-gray-600">
                        {sub.hasWorkflow ? 'Configure Workflow' : 'Set up Workflow'}
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Total Sub-Categories</p>
            <p className="text-2xl font-semibold text-gray-900 mt-2">{subcategories.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Total Orders</p>
            <p className="text-2xl font-semibold text-blue-600 mt-2">
              {subcategories.reduce((sum, s) => sum + s.orderCount, 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Active Sub-Categories</p>
            <p className="text-2xl font-semibold text-green-600 mt-2">
              {subcategories.filter((s) => s.status === 'ACTIVE').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Total Statuses</p>
            <p className="text-2xl font-semibold text-purple-600 mt-2">
              {subcategories.reduce((sum, s) => sum + s.statusCount, 0)}
            </p>
          </div>
        </div>
      </div>
    );
  } else {
    content = (
      <div className="space-y-6">
        {errorBanner}

        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Status Management</h2>
          <p className="text-sm text-gray-600 mt-1">
            Configure order status workflows for each tailoring category and sub-category
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Status Tracking & Customer Updates</h3>
              <p className="text-sm text-gray-700">
                Define custom status workflows per subcategory. Customers can be notified when orders move to stages
                with notifications enabled.
              </p>
            </div>
          </div>
        </div>

        {listLoading ? (
          <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">Loading categories…</div>
        ) : categories.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
            No categories found. Create tailor categories first.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className="bg-white rounded-lg shadow hover:shadow-xl transition-all text-left overflow-hidden group"
              >
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6">
                  <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-3">
                    <FolderTree className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 text-sm text-gray-600">
                    <span>
                      <span className="font-semibold text-gray-900">{category.subcategoryCount}</span> sub-categories
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Categories</p>
                <p className="text-2xl font-semibold text-gray-900">{overview?.totalCategories ?? categories.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Layers className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Sub-Categories</p>
                <p className="text-2xl font-semibold text-gray-900">{overview?.totalSubcategories ?? '—'}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Workflows</p>
                <p className="text-2xl font-semibold text-gray-900">{overview?.totalWorkflows ?? '—'}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Workflows</p>
                <p className="text-2xl font-semibold text-gray-900">{overview?.activeWorkflows ?? '—'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      {content}
      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setPendingDeleteStatusId(null);
        }}
        title="Delete status"
        description="Are you sure you want to delete this status? This action cannot be undone."
        onConfirm={handleConfirmDeleteStatus}
        isLoading={saving}
      />
    </DndProvider>
  );
}
