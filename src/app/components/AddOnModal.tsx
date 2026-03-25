import { useState, useEffect, useMemo } from 'react';
import { X, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useTailorCategories } from '@/contexts/TailorCategoriesContext';
import type { AccessoryOption, AccessorySelectionState, AccessorySubOption } from '@/app/api/types/addon';

type ImageRequiredFields = {
  fabricImage: boolean;
  designImages: boolean;
  drawingImage: boolean;
  hangings: boolean;
};

const defaultImageRequired: ImageRequiredFields = {
  fabricImage: true,
  designImages: true,
  drawingImage: false,
  hangings: false,
};

function sanitizeImageRequired(raw: unknown): ImageRequiredFields {
  const o = raw && typeof raw === 'object' ? (raw as Record<string, boolean>) : {};
  return {
    fabricImage: o.fabricImage !== undefined ? !!o.fabricImage : defaultImageRequired.fabricImage,
    designImages: o.designImages !== undefined ? !!o.designImages : defaultImageRequired.designImages,
    drawingImage: !!o.drawingImage,
    hangings: !!o.hangings,
  };
}

interface AddOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (addOn: any) => void | Promise<void>;
  onOpenGallery: (callback: (images: string[]) => void) => void;
  editingAddOn?: any | null;
  accessoryOptions: AccessoryOption[];
  optionIdToSubOptions: Record<string, AccessorySubOption[]>;
}

function subsForOption(
  opt: AccessoryOption,
  optionIdToSubOptions: Record<string, AccessorySubOption[]>
): AccessorySubOption[] {
  const list = optionIdToSubOptions[opt.id] ?? opt.subOptions ?? [];
  return [...list].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.name.localeCompare(b.name));
}

export function AddOnModal({
  isOpen,
  onClose,
  onSave,
  onOpenGallery,
  editingAddOn,
  accessoryOptions,
  optionIdToSubOptions,
}: AddOnModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subCategory: '',
    status: 'Active',
  });

  const [fabricImage, setFabricImage] = useState<string | null>(null);
  const [designImages, setDesignImages] = useState<string[]>([]);
  const [drawingImage, setDrawingImage] = useState<string | null>(null);
  const [hangingImages, setHangingImages] = useState<string[]>([]);

  const [requiredFields, setRequiredFields] = useState<ImageRequiredFields>(defaultImageRequired);

  const [accessorySelection, setAccessorySelection] = useState<AccessorySelectionState>({});
  const [selectedSubOptionIds, setSelectedSubOptionIds] = useState<string[]>([]);

  const { categories: allCategories, subCategoriesData, loadSubCategories } = useTailorCategories();
  const categories = useMemo(
    () => allCategories.filter((cat) => cat.status === 'Active'),
    [allCategories]
  );

  const visibleAccessoryOptions = useMemo(
    () =>
      [...accessoryOptions]
        .filter((o) => !o.status || o.status === 'ACTIVE')
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.name.localeCompare(b.name)),
    [accessoryOptions]
  );

  const getCategoryIdByName = (name: string): string | undefined => {
    return categories.find((cat) => cat.name === name)?.id;
  };

  const getSubCategoriesForCategory = (categoryName: string): string[] => {
    const categoryId = getCategoryIdByName(categoryName);
    if (!categoryId) return [];
    const subs = (subCategoriesData[categoryId] || []).filter((s) => s.status === 'Active');
    return subs.map((sub) => sub.name);
  };

  useEffect(() => {
    if (!isOpen || !formData.category) return;
    const cat = categories.find((c) => c.name === formData.category);
    if (cat) void loadSubCategories(cat.id);
  }, [isOpen, formData.category, categories, loadSubCategories]);

  useEffect(() => {
    if (!isOpen) return;

    const mergeSelection = (base: AccessorySelectionState): AccessorySelectionState => {
      const m = { ...base };
      for (const o of visibleAccessoryOptions) {
        if (!(o.id in m)) m[o.id] = { enabled: false, isRequired: false };
      }
      return m;
    };

    if (editingAddOn) {
      setFormData({
        name: editingAddOn.name,
        category: editingAddOn.category,
        subCategory: editingAddOn.subCategory,
        status: editingAddOn.status,
      });
      setFabricImage(editingAddOn.fabricImage || null);
      setDesignImages(editingAddOn.designImages || []);
      setDrawingImage(editingAddOn.drawingImage || null);
      setHangingImages(editingAddOn.hangings || []);
      setRequiredFields(sanitizeImageRequired(editingAddOn.requiredFields));
      const fromEdit = (editingAddOn.accessorySelection as AccessorySelectionState) ?? {};
      setAccessorySelection(mergeSelection(fromEdit));
      setSelectedSubOptionIds([...(editingAddOn.selectedSubOptionIds ?? [])]);
    } else {
      setFormData({
        name: '',
        category: '',
        subCategory: '',
        status: 'Active',
      });
      setFabricImage(null);
      setDesignImages([]);
      setDrawingImage(null);
      setHangingImages([]);
      setRequiredFields(defaultImageRequired);
      const empty: AccessorySelectionState = {};
      for (const o of visibleAccessoryOptions) {
        empty[o.id] = { enabled: false, isRequired: false };
      }
      setAccessorySelection(empty);
      setSelectedSubOptionIds([]);
    }
  }, [editingAddOn, isOpen, visibleAccessoryOptions]);

  if (!isOpen) return null;

  const setAccessoryEnabled = (optId: string, enabled: boolean) => {
    setAccessorySelection((prev) => ({
      ...prev,
      [optId]: {
        enabled,
        isRequired: enabled ? !!prev[optId]?.isRequired : false,
      },
    }));
    if (!enabled) {
      const opt = accessoryOptions.find((o) => o.id === optId);
      const subs = opt ? subsForOption(opt, optionIdToSubOptions) : [];
      const drop = new Set(subs.map((s) => s.id));
      setSelectedSubOptionIds((ids) => ids.filter((id) => !drop.has(id)));
    }
  };

  const toggleAccessoryRequired = (optId: string) => {
    setAccessorySelection((prev) => {
      const cur = prev[optId] ?? { enabled: false, isRequired: false };
      if (!cur.enabled) return prev;
      return {
        ...prev,
        [optId]: { ...cur, isRequired: !cur.isRequired },
      };
    });
  };

  const toggleSubOption = (subId: string) => {
    setSelectedSubOptionIds((prev) =>
      prev.includes(subId) ? prev.filter((x) => x !== subId) : [...prev, subId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const addOnData = {
      ...formData,
      fabricImage,
      designImages,
      drawingImage,
      hangings: hangingImages,
      requiredFields,
      accessorySelection,
      selectedSubOptionIds,
      id: editingAddOn?.id || Date.now(),
    };
    await Promise.resolve(onSave(addOnData));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'fabric' | 'drawing') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'fabric') {
          setFabricImage(reader.result as string);
        } else {
          setDrawingImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDesignImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && designImages.length < 3) {
      const remainingSlots = 3 - designImages.length;
      const filesToProcess = Array.from(files).slice(0, remainingSlots);

      filesToProcess.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setDesignImages((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleHangingImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setHangingImages((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeDesignImage = (index: number) => {
    setDesignImages(designImages.filter((_, i) => i !== index));
  };

  const removeHangingImage = (index: number) => {
    setHangingImages(hangingImages.filter((_, i) => i !== index));
  };

  const toggleImageRequired = (field: keyof ImageRequiredFields) => {
    setRequiredFields({ ...requiredFields, [field]: !requiredFields[field] });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center overflow-y-auto py-8">
      <div className="bg-gray-50 w-full max-w-6xl mx-4 rounded-lg shadow-xl">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 rounded-t-lg">
          <div className="flex items-center gap-2">
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold text-gray-900">
              {editingAddOn ? 'Edit Add-On Configuration' : 'Add Add-On Configuration'}
            </h2>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-on-config-form"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {editingAddOn ? 'Update Configuration' : 'Save Configuration'}
            </button>
          </div>
        </div>

        <form id="add-on-config-form" onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Configuration Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Bridal Lehenga Add-Ons"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value, subCategory: '' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.name} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sub Category *</label>
                    <select
                      value={formData.subCategory}
                      onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      disabled={!formData.category}
                    >
                      <option value="">Select Sub Category</option>
                      {formData.category &&
                        getSubCategoriesForCategory(formData.category)?.map((subCat) => (
                          <option key={subCat} value={subCat}>
                            {subCat}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Accessory Options</h3>
                {visibleAccessoryOptions.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No accessory options in the system. Add them under{' '}
                    <span className="font-medium text-gray-700">Tailoring → Add-On accessories</span>.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {visibleAccessoryOptions.map((opt) => {
                      const sel = accessorySelection[opt.id] ?? { enabled: false, isRequired: false };
                      return (
                        <div key={opt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg gap-2">
                          <div className="flex items-center gap-3 min-w-0">
                            <input
                              type="checkbox"
                              checked={sel.enabled}
                              onChange={(e) => setAccessoryEnabled(opt.id, e.target.checked)}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 shrink-0"
                            />
                            <label className="text-sm font-medium text-gray-700 truncate">{opt.name}</label>
                          </div>
                          <label className="flex items-center gap-2 text-xs text-gray-500 shrink-0">
                            <input
                              type="checkbox"
                              checked={sel.isRequired}
                              disabled={!sel.enabled}
                              onChange={() => toggleAccessoryRequired(opt.id)}
                              className="w-3 h-3 text-blue-600 rounded disabled:opacity-40"
                            />
                            Required
                          </label>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Accessory Sub-Options</h3>
                <p className="text-xs text-gray-500 mb-3">
                  Choose sub-options (from the API) for each enabled accessory.
                </p>
                {visibleAccessoryOptions.length === 0 ? null : (
                  <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
                    {visibleAccessoryOptions.map((opt) => {
                      const sel = accessorySelection[opt.id] ?? { enabled: false, isRequired: false };
                      const subs = subsForOption(opt, optionIdToSubOptions);
                      return (
                        <div key={opt.id}>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">{opt.name}</label>
                          {!sel.enabled ? (
                            <p className="text-xs text-gray-400 italic p-3 bg-gray-50 rounded-lg">
                              Enable &quot;{opt.name}&quot; above to choose sub-options.
                            </p>
                          ) : subs.length === 0 ? (
                            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                              No sub-options for this accessory yet. Add them under Add-On accessories.
                            </p>
                          ) : (
                            <div className="grid grid-cols-1 gap-2">
                              {subs.map((sub) => (
                                <label
                                  key={sub.id}
                                  className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedSubOptionIds.includes(sub.id)}
                                    onChange={() => toggleSubOption(sub.id)}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                  />
                                  <span className="text-sm text-gray-700">{sub.name}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Fabric Image</h3>
                  <label className="flex items-center gap-2 text-xs text-gray-500">
                    <input
                      type="checkbox"
                      checked={requiredFields.fabricImage}
                      onChange={() => toggleImageRequired('fabricImage')}
                      className="w-3 h-3 text-blue-600 rounded"
                    />
                    Required
                  </label>
                </div>
                {fabricImage ? (
                  <div className="relative">
                    <img src={fabricImage} alt="Fabric" className="w-full h-48 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => setFabricImage(null)}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      </div>
                      <label htmlFor="fabric-image" className="cursor-pointer">
                        <span className="text-blue-600 hover:text-blue-700 font-medium">Click to upload</span>
                        <span className="text-gray-500"> or drag and drop</span>
                      </label>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                      <input
                        id="fabric-image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'fabric')}
                        className="hidden"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Drawing Image</h3>
                  <label className="flex items-center gap-2 text-xs text-gray-500">
                    <input
                      type="checkbox"
                      checked={requiredFields.drawingImage}
                      onChange={() => toggleImageRequired('drawingImage')}
                      className="w-3 h-3 text-blue-600 rounded"
                    />
                    Required
                  </label>
                </div>
                {drawingImage ? (
                  <div className="relative">
                    <img src={drawingImage} alt="Drawing" className="w-full h-48 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => setDrawingImage(null)}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      </div>
                      <label htmlFor="drawing-image" className="cursor-pointer">
                        <span className="text-blue-600 hover:text-blue-700 font-medium">Click to upload</span>
                        <span className="text-gray-500"> or drag and drop</span>
                      </label>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                      <input
                        id="drawing-image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'drawing')}
                        className="hidden"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">Design Images</h3>
                    <p className="text-xs text-gray-500 mt-1">Upload up to 3 design images</p>
                  </div>
                  <label className="flex items-center gap-2 text-xs text-gray-500">
                    <input
                      type="checkbox"
                      checked={requiredFields.designImages}
                      onChange={() => toggleImageRequired('designImages')}
                      className="w-3 h-3 text-blue-600 rounded"
                    />
                    Required
                  </label>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    {designImages.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={img}
                          alt={`Design ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeDesignImage(index)}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  {designImages.length < 3 && (
                    <div className="flex gap-2">
                      <label className="flex-1 cursor-pointer">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
                          <div className="flex items-center justify-center gap-2">
                            <Upload className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">Upload ({3 - designImages.length} left)</span>
                          </div>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleDesignImagesUpload}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          onOpenGallery((images) => {
                            const remainingSlots = 3 - designImages.length;
                            setDesignImages((prev) => [...prev, ...images.slice(0, remainingSlots)]);
                          })
                        }
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Gallery
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">Hanging Images</h3>
                    <p className="text-xs text-gray-500 mt-1">Upload multiple hanging images</p>
                  </div>
                  <label className="flex items-center gap-2 text-xs text-gray-500">
                    <input
                      type="checkbox"
                      checked={requiredFields.hangings}
                      onChange={() => toggleImageRequired('hangings')}
                      className="w-3 h-3 text-blue-600 rounded"
                    />
                    Required
                  </label>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    {hangingImages.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={img}
                          alt={`Hanging ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeHangingImage(index)}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <label className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
                        <div className="flex items-center justify-center gap-2">
                          <Upload className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">Upload</span>
                        </div>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleHangingImagesUpload}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        onOpenGallery((images) => {
                          setHangingImages((prev) => [...prev, ...images]);
                        })
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Gallery
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
