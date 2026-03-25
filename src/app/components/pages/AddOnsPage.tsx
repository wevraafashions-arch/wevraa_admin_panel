import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, Edit, Trash2, Eye, Image as ImageIcon, Tag, Package } from 'lucide-react';
import { useTailorCategories } from '@/contexts/TailorCategoriesContext';
import { AddonConfigurationDetailDialog } from '../AddonConfigurationDetailDialog';
import { AddOnModal } from '../AddOnModal';
import { DesignGalleryModal } from '../DesignGalleryModal';
import { ConfirmDeleteDialog } from '../ui/ConfirmDeleteDialog';
import { addonService } from '@/app/api/services/addonService';
import type {
  AccessoryOption,
  AccessorySubOption,
  AddonConfiguration,
  AddonConfigurationAccessory,
  CreateAddonConfigurationRequest,
} from '@/app/api/types/addon';

type ModalAccessoryKey = 'cups' | 'piping' | 'zipType' | 'hooks';

const ACCESSORY_KEY_HINTS: Record<ModalAccessoryKey, string[]> = {
  cups: ['cup'],
  piping: ['pip'],
  zipType: ['zip'],
  hooks: ['hook'],
};

function findAccessoryOption(options: AccessoryOption[], key: ModalAccessoryKey): AccessoryOption | undefined {
  const hints = ACCESSORY_KEY_HINTS[key];
  return options.find((o) => hints.some((h) => o.name.toLowerCase().includes(h)));
}

function modalDataToCreatePayload(
  data: Record<string, unknown>,
  categoryId: string,
  subCategoryId: string,
  accessoryOptions: AccessoryOption[],
  optionIdToSubOptions: Record<string, AccessorySubOption[]>,
  /** When true (PATCH), send [] for empty accessories/sub-options so the API replaces/clears. */
  forUpdate = false
): CreateAddonConfigurationRequest {
  const status: 'ACTIVE' | 'INACTIVE' = data.status === 'Active' ? 'ACTIVE' : 'INACTIVE';
  const accessories: AddonConfigurationAccessory[] = [];
  const requiredFields = (data.requiredFields as Record<string, boolean> | undefined) ?? {};
  for (const key of Object.keys(ACCESSORY_KEY_HINTS) as ModalAccessoryKey[]) {
    if (!data[key]) continue;
    const opt = findAccessoryOption(accessoryOptions, key);
    if (!opt) continue;
    accessories.push({
      accessoryOptionId: opt.id,
      isRequired: !!requiredFields[key],
    });
  }

  const selectedSubOptionIds: string[] = [];
  const subNameBuckets = {
    cups: (data.cupsSubOptions as string[]) ?? [],
    piping: (data.pipingSubOptions as string[]) ?? [],
    zipType: (data.zipTypeSubOptions as string[]) ?? [],
    hooks: (data.hooksSubOptions as string[]) ?? [],
  } as Record<ModalAccessoryKey, string[]>;

  for (const key of Object.keys(ACCESSORY_KEY_HINTS) as ModalAccessoryKey[]) {
    const opt = findAccessoryOption(accessoryOptions, key);
    if (!opt) continue;
    const subs = optionIdToSubOptions[opt.id] ?? opt.subOptions ?? [];
    for (const n of subNameBuckets[key]) {
      const sub = subs.find(
        (s) => s.name.toLowerCase() === n.toLowerCase() || s.name.toLowerCase().includes(n.toLowerCase())
      );
      if (sub) selectedSubOptionIds.push(sub.id);
    }
  }

  const fabricImage = data.fabricImage as string | null | undefined;
  const drawingImage = data.drawingImage as string | null | undefined;
  const designImages = (data.designImages as string[]) ?? [];
  const hangings = (data.hangings as string[]) ?? [];

  const accessoriesOut =
    accessories.length > 0 ? accessories : forUpdate ? ([] as AddonConfigurationAccessory[]) : undefined;
  const selectedSubsOut =
    selectedSubOptionIds.length > 0
      ? selectedSubOptionIds
      : forUpdate
        ? ([] as string[])
        : undefined;

  return {
    name: String(data.name ?? '').trim(),
    categoryId,
    subCategoryId,
    status,
    fabricImageUrl: fabricImage || undefined,
    drawingImageUrl: drawingImage || undefined,
    designImageUrls: designImages.length ? designImages : undefined,
    hangingImageUrls: hangings.length ? hangings : undefined,
    accessories: accessoriesOut,
    selectedSubOptionIds: selectedSubsOut,
  };
}

/** Shape expected by AddOnModal when editing */
function mapApiConfigToModalEditShape(
  config: AddonConfiguration,
  categoryName: string,
  subCategoryName: string,
  accessoryOptions: AccessoryOption[],
  optionIdToSubOptions: Record<string, AccessorySubOption[]>
): Record<string, unknown> {
  const status = config.status === 'ACTIVE' ? 'Active' : 'Inactive';
  const accessoriesState = { cups: false, piping: false, zipType: false, hooks: false };
  const requiredFields = {
    fabricImage: true,
    designImages: true,
    drawingImage: false,
    cups: false,
    piping: false,
    zipType: false,
    hooks: false,
    hangings: false,
  };
  const cupsSubOptions: string[] = [];
  const pipingSubOptions: string[] = [];
  const zipTypeSubOptions: string[] = [];
  const hooksSubOptions: string[] = [];

  const accList = config.accessories ?? [];
  for (const a of accList) {
    const opt = accessoryOptions.find((o) => o.id === a.accessoryOptionId);
    if (!opt) continue;
    const key = (Object.keys(ACCESSORY_KEY_HINTS) as ModalAccessoryKey[]).find((k) =>
      ACCESSORY_KEY_HINTS[k].some((h) => opt.name.toLowerCase().includes(h))
    );
    if (!key) continue;
    accessoriesState[key] = true;
    (requiredFields as Record<string, boolean>)[key] = a.isRequired;
  }

  const addSubNamesForKey = (key: ModalAccessoryKey, ids: string[]) => {
    const opt = findAccessoryOption(accessoryOptions, key);
    if (!opt) return;
    const subs = optionIdToSubOptions[opt.id] ?? [];
    const bucket =
      key === 'cups'
        ? cupsSubOptions
        : key === 'piping'
          ? pipingSubOptions
          : key === 'zipType'
            ? zipTypeSubOptions
            : hooksSubOptions;
    for (const id of ids) {
      const s = subs.find((x) => x.id === id);
      if (s) bucket.push(s.name);
    }
  };

  for (const id of config.selectedSubOptionIds ?? []) {
    for (const key of Object.keys(ACCESSORY_KEY_HINTS) as ModalAccessoryKey[]) {
      const opt = findAccessoryOption(accessoryOptions, key);
      if (!opt) continue;
      const subs = optionIdToSubOptions[opt.id] ?? [];
      if (subs.some((s) => s.id === id)) {
        addSubNamesForKey(key, [id]);
        break;
      }
    }
  }

  return {
    id: config.id,
    name: config.name ?? '',
    category: categoryName,
    subCategory: subCategoryName,
    status,
    fabricImage: config.fabricImageUrl ?? null,
    designImages: config.designImageUrls ?? [],
    drawingImage: config.drawingImageUrl ?? null,
    hangings: config.hangingImageUrls ?? [],
    requiredFields,
    cups: accessoriesState.cups,
    piping: accessoriesState.piping,
    zipType: accessoriesState.zipType,
    hooks: accessoriesState.hooks,
    cupsSubOptions,
    pipingSubOptions,
    zipTypeSubOptions,
    hooksSubOptions,
  };
}

export function AddOnsPage() {
  const { categories: allCategories, subCategoriesData, loadSubCategories } = useTailorCategories();
  /** Memoized so useEffect deps are stable — getActiveCategories() returns a new array every render. */
  const categories = useMemo(
    () => allCategories.filter((cat) => cat.status === 'Active'),
    [allCategories]
  );

  const [configs, setConfigs] = useState<AddonConfiguration[]>([]);
  const [configsLoading, setConfigsLoading] = useState(true);
  const [configsError, setConfigsError] = useState<string | null>(null);

  const [accessoryOptions, setAccessoryOptions] = useState<AccessoryOption[]>([]);
  const [optionIdToSubOptions, setOptionIdToSubOptions] = useState<Record<string, AccessorySubOption[]>>({});

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [galleryCallback, setGalleryCallback] = useState<((images: string[]) => void) | null>(null);
  const [editingAddOn, setEditingAddOn] = useState<Record<string, unknown> | null>(null);
  const [editingConfigId, setEditingConfigId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDeleteConfigId, setPendingDeleteConfigId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailConfig, setDetailConfig] = useState<AddonConfiguration | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const loadConfigs = useCallback(async () => {
    setConfigsLoading(true);
    setConfigsError(null);
    try {
      const list = await addonService.listConfigurations();
      setConfigs(list);
    } catch (e) {
      setConfigsError(e instanceof Error ? e.message : 'Failed to load configurations');
      setConfigs([]);
    } finally {
      setConfigsLoading(false);
    }
  }, []);

  const loadAccessoryTree = useCallback(async () => {
    try {
      const options = await addonService.listAccessoryOptions();
      setAccessoryOptions(options);
      const subsEntries = await Promise.all(
        options.map(async (o) => {
          try {
            const subs = o.subOptions?.length ? o.subOptions : await addonService.listSubOptions(o.id);
            return [o.id, subs] as const;
          } catch {
            return [o.id, o.subOptions ?? []] as const;
          }
        })
      );
      const map: Record<string, AccessorySubOption[]> = {};
      for (const [id, subs] of subsEntries) map[id] = subs;
      setOptionIdToSubOptions(map);
    } catch {
      setAccessoryOptions([]);
      setOptionIdToSubOptions({});
    }
  }, []);

  useEffect(() => {
    loadConfigs();
    loadAccessoryTree();
  }, [loadConfigs, loadAccessoryTree]);

  useEffect(() => {
    for (const c of categories) {
      void loadSubCategories(c.id);
    }
  }, [categories, loadSubCategories]);

  const getCategoryIdByName = (name: string) => categories.find((cat) => cat.name === name)?.id;
  const getSubIdByNames = (categoryName: string, subName: string): string | undefined => {
    const categoryId = getCategoryIdByName(categoryName);
    if (!categoryId) return undefined;
    return (subCategoriesData[categoryId] ?? []).find((s) => s.name === subName)?.id;
  };

  const getCategoryName = (id?: string) => (id ? categories.find((c) => c.id === id)?.name ?? id : '—');
  const getSubName = (categoryId: string | undefined, subId?: string) => {
    if (!categoryId || !subId) return '—';
    return (subCategoriesData[categoryId] ?? []).find((s) => s.id === subId)?.name ?? subId;
  };

  const totals = useMemo(() => {
    const total = configs.length;
    const active = configs.filter((c) => (c.status || '').toUpperCase() === 'ACTIVE').length;
    return { total, active };
  }, [configs]);

  const handleViewDetails = async (config: AddonConfiguration) => {
    setDetailOpen(true);
    setDetailConfig(null);
    setDetailError(null);
    setDetailLoading(true);
    try {
      const full = await addonService.getConfigurationById(config.id);
      setDetailConfig(full);
    } catch (e) {
      setDetailError(e instanceof Error ? e.message : 'Failed to load configuration');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDetailOpenChange = (open: boolean) => {
    setDetailOpen(open);
    if (!open) {
      setDetailConfig(null);
      setDetailError(null);
      setDetailLoading(false);
    }
  };

  const handleEdit = async (config: AddonConfiguration) => {
    setConfigsError(null);
    try {
      const full = await addonService.getConfigurationById(config.id);
      const catName = getCategoryName(full.categoryId);
      const subName = getSubName(full.categoryId, full.subCategoryId);
      const modalShape = mapApiConfigToModalEditShape(
        full,
        catName,
        subName,
        accessoryOptions,
        optionIdToSubOptions
      );
      setEditingAddOn(modalShape);
      setEditingConfigId(full.id);
      setIsAddModalOpen(true);
    } catch (e) {
      setConfigsError(e instanceof Error ? e.message : 'Failed to load configuration');
    }
  };

  const openDeleteDialog = (id: string) => {
    setPendingDeleteConfigId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteConfigId) return;
    setSaving(true);
    try {
      await addonService.deleteConfiguration(pendingDeleteConfigId);
      setDeleteDialogOpen(false);
      setPendingDeleteConfigId(null);
      await loadConfigs();
    } catch (e) {
      setConfigsError(e instanceof Error ? e.message : 'Failed to delete');
    } finally {
      setSaving(false);
    }
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingAddOn(null);
    setEditingConfigId(null);
  };

  const handleSaveAddOn = async (addOnData: Record<string, unknown>) => {
    const categoryId = getCategoryIdByName(String(addOnData.category ?? ''));
    const subCategoryId = getSubIdByNames(String(addOnData.category ?? ''), String(addOnData.subCategory ?? ''));
    if (!categoryId || !subCategoryId) {
      setConfigsError('Please select a valid category and sub-category.');
      return;
    }
    const isEdit = !!editingConfigId;
    const payload = modalDataToCreatePayload(
      addOnData,
      categoryId,
      subCategoryId,
      accessoryOptions,
      optionIdToSubOptions,
      isEdit
    );
    if (!payload.name) {
      setConfigsError('Configuration name is required.');
      return;
    }
    setSaving(true);
    setConfigsError(null);
    try {
      if (editingConfigId) {
        await addonService.updateConfiguration(editingConfigId, payload);
      } else {
        await addonService.createConfiguration(payload);
      }
      await loadConfigs();
      handleCloseModal();
    } catch (e) {
      setConfigsError(e instanceof Error ? e.message : 'Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const getRequiredFieldsCountFromConfig = (c: AddonConfiguration) => {
    let n = 0;
    if (c.fabricImageUrl) n++;
    if (c.designImageUrls?.length) n++;
    if (c.drawingImageUrl) n++;
    const acc = c.accessories ?? [];
    for (const _ of acc) n++;
    if (c.hangingImageUrls?.length) n++;
    return n;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Add-Ons Configuration</h1>
          <p className="text-gray-600 mt-1">Manage tailoring add-ons and customization options for products</p>
        </div>
        <button
          onClick={() => {
            setEditingAddOn(null);
            setEditingConfigId(null);
            setIsAddModalOpen(true);
          }}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Plus className="w-5 h-5" />
          Add Configuration
        </button>
      </div>

      {configsError && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex justify-between items-center">
          <span>{configsError}</span>
          <button type="button" onClick={() => setConfigsError(null)} className="text-red-700 hover:underline font-medium">
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Configurations</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{totals.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{totals.active}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Tag className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {configsLoading ? (
          <div className="p-12 text-center text-gray-500">Loading configurations...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Configuration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sub-category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Design Images
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fields
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {configs.map((cfg) => {
                  const designs = cfg.designImageUrls ?? [];
                  return (
                    <tr key={cfg.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {cfg.fabricImageUrl ? (
                            <img
                              src={cfg.fabricImageUrl}
                              alt={cfg.name ?? ''}
                              className="w-10 h-10 rounded-lg object-cover mr-3"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3 flex items-center justify-center">
                              <ImageIcon className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                          <div className="text-sm font-medium text-gray-900">{cfg.name ?? cfg.id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getCategoryName(cfg.categoryId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getSubName(cfg.categoryId, cfg.subCategoryId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex -space-x-2">
                          {designs.slice(0, 3).map((img, index) => (
                            <img
                              key={index}
                              src={img}
                              alt=""
                              className="w-8 h-8 rounded-full border-2 border-white object-cover"
                            />
                          ))}
                          {designs.length > 3 && (
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                              +{designs.length - 3}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {getRequiredFieldsCountFromConfig(cfg)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            (cfg.status || '').toUpperCase() === 'ACTIVE'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {cfg.status ?? '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleViewDetails(cfg)}
                            disabled={saving || configsLoading}
                            className="text-gray-700 hover:text-gray-900 disabled:opacity-50"
                            title="View details"
                            aria-label="View configuration details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEdit(cfg)}
                            disabled={saving}
                            className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openDeleteDialog(cfg.id)}
                            disabled={saving}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!configsLoading && configs.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No add-on configurations</h3>
          <p className="text-gray-500 mb-6">Create a configuration with the API-backed form.</p>
          <button
            type="button"
            onClick={() => {
              setEditingAddOn(null);
              setEditingConfigId(null);
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Add Configuration
          </button>
        </div>
      )}

      <AddonConfigurationDetailDialog
        open={detailOpen}
        onOpenChange={handleDetailOpenChange}
        config={detailConfig}
        loading={detailLoading}
        error={detailError}
        categoryLabel={detailConfig ? getCategoryName(detailConfig.categoryId) : '—'}
        subCategoryLabel={
          detailConfig ? getSubName(detailConfig.categoryId, detailConfig.subCategoryId) : '—'
        }
        accessoryOptions={accessoryOptions}
        optionIdToSubOptions={optionIdToSubOptions}
      />

      <AddOnModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveAddOn}
        editingAddOn={editingAddOn}
        onOpenGallery={(callback) => {
          setGalleryCallback(() => callback);
          setIsGalleryModalOpen(true);
        }}
      />

      <DesignGalleryModal
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        onSelect={(images) => {
          if (galleryCallback) galleryCallback(images);
          setIsGalleryModalOpen(false);
        }}
      />

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setPendingDeleteConfigId(null);
        }}
        title="Delete add-on configuration"
        description="Are you sure you want to delete this add-on configuration? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        isLoading={saving}
      />
    </div>
  );
}
