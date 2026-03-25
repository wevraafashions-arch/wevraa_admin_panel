import { useCallback, useEffect, useState } from 'react';
import { Layers, Plus, Pencil } from 'lucide-react';
import { addonService } from '@/app/api/services/addonService';
import type { AccessoryOption, AccessorySubOption } from '@/app/api/types/addon';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { cn } from '../ui/utils';

export function AddonAccessoryOptionsPage() {
  const sortedOptions = (list: AccessoryOption[]) =>
    [...list].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.name.localeCompare(b.name));

  const [options, setOptions] = useState<AccessoryOption[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [optionDetail, setOptionDetail] = useState<AccessoryOption | null>(null);
  const [subOptions, setSubOptions] = useState<AccessorySubOption[]>([]);
  const [panelLoading, setPanelLoading] = useState(false);
  const [panelError, setPanelError] = useState<string | null>(null);

  const [actionError, setActionError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [createOptionOpen, setCreateOptionOpen] = useState(false);
  const [newOptionName, setNewOptionName] = useState('');
  const [newOptionSort, setNewOptionSort] = useState<string>('');

  const [createSubOpen, setCreateSubOpen] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubSort, setNewSubSort] = useState<string>('');

  const [editSubOpen, setEditSubOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<AccessorySubOption | null>(null);
  const [editSubName, setEditSubName] = useState('');
  const [editSubSort, setEditSubSort] = useState<string>('');

  const loadOptions = useCallback(async () => {
    setListLoading(true);
    setListError(null);
    try {
      const list = await addonService.listAccessoryOptions();
      setOptions(sortedOptions(list));
    } catch (e) {
      setListError(e instanceof Error ? e.message : 'Failed to load accessory options');
      setOptions([]);
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOptions();
  }, [loadOptions]);

  const loadPanel = useCallback(async (optionId: string) => {
    setPanelLoading(true);
    setPanelError(null);
    try {
      const [detail, subs] = await Promise.all([
        addonService.getAccessoryOptionById(optionId),
        addonService.listSubOptions(optionId),
      ]);
      setOptionDetail(detail);
      setSubOptions(
        [...subs].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.name.localeCompare(b.name))
      );
    } catch (e) {
      setPanelError(e instanceof Error ? e.message : 'Failed to load option details');
      setOptionDetail(null);
      setSubOptions([]);
    } finally {
      setPanelLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setOptionDetail(null);
      setSubOptions([]);
      setPanelError(null);
      return;
    }
    void loadPanel(selectedId);
  }, [selectedId, loadPanel]);

  const parseSort = (raw: string): number | undefined => {
    if (raw.trim() === '') return undefined;
    const n = Number(raw);
    return Number.isFinite(n) ? n : undefined;
  };

  const handleCreateOption = async () => {
    const name = newOptionName.trim();
    if (!name) {
      setActionError('Name is required.');
      return;
    }
    setSaving(true);
    setActionError(null);
    try {
      const created = await addonService.createAccessoryOption({
        name,
        sortOrder: parseSort(newOptionSort),
      });
      setCreateOptionOpen(false);
      setNewOptionName('');
      setNewOptionSort('');
      await loadOptions();
      setSelectedId(created.id);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Failed to create option');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateSub = async () => {
    if (!selectedId) return;
    const name = newSubName.trim();
    if (!name) {
      setActionError('Name is required.');
      return;
    }
    setSaving(true);
    setActionError(null);
    try {
      await addonService.createAccessorySubOption({
        accessoryOptionId: selectedId,
        name,
        sortOrder: parseSort(newSubSort),
      });
      setCreateSubOpen(false);
      setNewSubName('');
      setNewSubSort('');
      await loadPanel(selectedId);
      await loadOptions();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Failed to create sub-option');
    } finally {
      setSaving(false);
    }
  };

  const openEditSub = (sub: AccessorySubOption) => {
    setEditingSub(sub);
    setEditSubName(sub.name);
    setEditSubSort(sub.sortOrder != null ? String(sub.sortOrder) : '');
    setEditSubOpen(true);
    setActionError(null);
  };

  const handleSaveSub = async () => {
    if (!editingSub) return;
    const name = editSubName.trim();
    if (!name) {
      setActionError('Name is required.');
      return;
    }
    setSaving(true);
    setActionError(null);
    try {
      const body: { name: string; sortOrder?: number } = { name };
      const sort = parseSort(editSubSort);
      if (sort !== undefined) body.sortOrder = sort;
      await addonService.updateAccessorySubOption(editingSub.id, body);
      setEditSubOpen(false);
      setEditingSub(null);
      if (selectedId) await loadPanel(selectedId);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Failed to update sub-option');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-0 min-h-[calc(100vh-8rem)] bg-gray-50/50 -m-6">
      {/* Left rail — accessory options */}
      <aside className="w-full lg:w-80 shrink-0 border-b lg:border-b-0 lg:border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-gray-900 truncate">Accessory options</h2>
              <p className="text-xs text-gray-500">Cups, piping, hooks…</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setActionError(null);
              setCreateOptionOpen(true);
            }}
            disabled={listLoading}
            className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </div>

        {listError && (
          <div className="m-3 text-xs text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{listError}</div>
        )}

        <div className="flex-1 overflow-y-auto p-2">
          {listLoading ? (
            <p className="text-sm text-gray-500 p-3">Loading…</p>
          ) : options.length === 0 ? (
            <p className="text-sm text-gray-500 p-3">No accessory options yet. Create one to add sub-options.</p>
          ) : (
            <ul className="space-y-1">
              {options.map((opt) => (
                <li key={opt.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setActionError(null);
                      setSelectedId(opt.id);
                    }}
                    className={cn(
                      'w-full text-left rounded-lg px-3 py-2.5 text-sm transition-colors',
                      selectedId === opt.id
                        ? 'bg-indigo-50 text-indigo-900 font-medium ring-1 ring-indigo-200'
                        : 'text-gray-800 hover:bg-gray-100'
                    )}
                  >
                    <span className="block truncate">{opt.name}</span>
                    {opt.sortOrder != null && (
                      <span className="text-xs text-gray-500">Order {opt.sortOrder}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      {/* Main — sub-options for selected option */}
      <main className="flex-1 min-w-0 p-6 bg-white lg:rounded-none">
        {!selectedId ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
            <Layers className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-sm">Select an accessory option to view and manage its sub-options.</p>
          </div>
        ) : panelLoading ? (
          <p className="text-sm text-gray-500">Loading details…</p>
        ) : panelError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{panelError}</div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{optionDetail?.name ?? '—'}</h1>
                <p className="text-xs text-gray-500 mt-1 font-mono break-all">{selectedId}</p>
                {optionDetail?.status && (
                  <span className="inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                    {optionDetail.status}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setActionError(null);
                  setNewSubName('');
                  setNewSubSort('');
                  setCreateSubOpen(true);
                }}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                Add sub-option
              </button>
            </div>

            {actionError && (
              <div className="mb-4 text-sm text-red-800 bg-red-50 border border-red-100 rounded-lg px-4 py-2">
                {actionError}
              </div>
            )}

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 w-28">Sort</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600 w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {subOptions.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                        No sub-options yet. Add entries like “Padded Cups” or “Non-Padded Cups”.
                      </td>
                    </tr>
                  ) : (
                    subOptions.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50/80">
                        <td className="px-4 py-3 font-medium text-gray-900">{row.name}</td>
                        <td className="px-4 py-3 text-gray-600">{row.sortOrder ?? '—'}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => openEditSub(row)}
                            disabled={saving}
                            className="text-indigo-600 hover:text-indigo-800 disabled:opacity-50 p-1"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>

      <Dialog open={createOptionOpen} onOpenChange={setCreateOptionOpen}>
        <DialogContent className="bg-white border-gray-200 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gray-900">New accessory option</DialogTitle>
            <DialogDescription className="text-gray-600">
              Creates a top-level option (e.g. Cups, Piping) for add-on configurations.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <label htmlFor="new-opt-name" className="block text-xs font-medium text-gray-600 mb-1">
                Name
              </label>
              <input
                id="new-opt-name"
                value={newOptionName}
                onChange={(e) => setNewOptionName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="e.g. Cups"
              />
            </div>
            <div>
              <label htmlFor="new-opt-sort" className="block text-xs font-medium text-gray-600 mb-1">
                Sort order (optional)
              </label>
              <input
                id="new-opt-sort"
                type="number"
                value={newOptionSort}
                onChange={(e) => setNewOptionSort(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="0"
              />
            </div>
            {actionError && createOptionOpen && (
              <p className="text-sm text-red-600">{actionError}</p>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <button
              type="button"
              onClick={() => setCreateOptionOpen(false)}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void handleCreateOption()}
              disabled={saving}
              className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Create'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={createSubOpen} onOpenChange={setCreateSubOpen}>
        <DialogContent className="bg-white border-gray-200 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gray-900">New sub-option</DialogTitle>
            <DialogDescription className="text-gray-600">
              For <span className="font-medium text-gray-800">{optionDetail?.name}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <label htmlFor="new-sub-name" className="block text-xs font-medium text-gray-600 mb-1">
                Name
              </label>
              <input
                id="new-sub-name"
                value={newSubName}
                onChange={(e) => setNewSubName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="e.g. Padded Cups"
              />
            </div>
            <div>
              <label htmlFor="new-sub-sort" className="block text-xs font-medium text-gray-600 mb-1">
                Sort order (optional)
              </label>
              <input
                id="new-sub-sort"
                type="number"
                value={newSubSort}
                onChange={(e) => setNewSubSort(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <button
              type="button"
              onClick={() => setCreateSubOpen(false)}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void handleCreateSub()}
              disabled={saving}
              className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Create'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={editSubOpen}
        onOpenChange={(open) => {
          setEditSubOpen(open);
          if (!open) setEditingSub(null);
        }}
      >
        <DialogContent className="bg-white border-gray-200 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Edit sub-option</DialogTitle>
            <DialogDescription className="text-gray-600">Update name and sort order.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <label htmlFor="edit-sub-name" className="block text-xs font-medium text-gray-600 mb-1">
                Name
              </label>
              <input
                id="edit-sub-name"
                value={editSubName}
                onChange={(e) => setEditSubName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="edit-sub-sort" className="block text-xs font-medium text-gray-600 mb-1">
                Sort order
              </label>
              <input
                id="edit-sub-sort"
                type="number"
                value={editSubSort}
                onChange={(e) => setEditSubSort(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            {actionError && editSubOpen && (
              <p className="text-sm text-red-600">{actionError}</p>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <button
              type="button"
              onClick={() => setEditSubOpen(false)}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void handleSaveSub()}
              disabled={saving}
              className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
