import { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useTailorCategories } from '@/contexts/TailorCategoriesContext';

interface AddOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (addOn: any) => void;
  onOpenGallery: (callback: (images: string[]) => void) => void;
  editingAddOn?: any | null;
}

export function AddOnModal({ isOpen, onClose, onSave, onOpenGallery, editingAddOn }: AddOnModalProps) {
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

  // Required fields toggles
  const [requiredFields, setRequiredFields] = useState({
    fabricImage: true,
    designImages: true,
    drawingImage: false,
    cups: false,
    piping: false,
    zipType: false,
    hooks: false,
    hangings: false,
  });

  // Accessory options
  const [accessories, setAccessories] = useState({
    cups: false,
    piping: false,
    zipType: false,
    hooks: false,
  });

  // Accessory sub-options
  const [accessorySubOptions, setAccessorySubOptions] = useState({
    cups: [] as string[],
    piping: [] as string[],
    zipType: [] as string[],
    hooks: [] as string[],
  });

  const accessoryOptions = {
    cups: ['Padded Cups', 'Non-Padded Cups', 'Removable Cups', 'Built-in Cups'],
    piping: ['Contrast Piping', 'Matching Piping', 'Gold Piping', 'Silver Piping', 'Designer Piping'],
    zipType: ['Front Zip', 'Back Zip', 'Side Zip', 'Hidden Zip', 'Exposed Zip'],
    hooks: ['Front Hooks', 'Back Hooks', 'Side Hooks', 'Hidden Hooks', 'Designer Hooks'],
  };

  const { getActiveCategories, subCategoriesData, loadSubCategories } = useTailorCategories();
  const categories = getActiveCategories();

  const getCategoryIdByName = (name: string): string | undefined => {
    return categories.find(cat => cat.name === name)?.id;
  };

  const getSubCategoriesForCategory = (categoryName: string): string[] => {
    const categoryId = getCategoryIdByName(categoryName);
    if (!categoryId) return [];
    const subs = (subCategoriesData[categoryId] || []).filter(s => s.status === 'Active');
    return subs.map(sub => sub.name);
  };

  useEffect(() => {
    if (!formData.category) return;
    const cat = categories.find(c => c.name === formData.category);
    if (cat) loadSubCategories(cat.id);
  }, [formData.category, categories, loadSubCategories]);

  // Pre-fill form when editing
  useEffect(() => {
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
      setRequiredFields(editingAddOn.requiredFields || requiredFields);
      setAccessories({
        cups: editingAddOn.cups || false,
        piping: editingAddOn.piping || false,
        zipType: editingAddOn.zipType || false,
        hooks: editingAddOn.hooks || false,
      });
      setAccessorySubOptions({
        cups: editingAddOn.cupsSubOptions || [],
        piping: editingAddOn.pipingSubOptions || [],
        zipType: editingAddOn.zipTypeSubOptions || [],
        hooks: editingAddOn.hooksSubOptions || [],
      });
    } else {
      // Reset form
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
      setRequiredFields({
        fabricImage: true,
        designImages: true,
        drawingImage: false,
        cups: false,
        piping: false,
        zipType: false,
        hooks: false,
        hangings: false,
      });
      setAccessories({
        cups: false,
        piping: false,
        zipType: false,
        hooks: false,
      });
      setAccessorySubOptions({
        cups: [],
        piping: [],
        zipType: [],
        hooks: [],
      });
    }
  }, [editingAddOn, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const addOnData = {
      ...formData,
      fabricImage,
      designImages,
      drawingImage,
      hangings: hangingImages,
      ...accessories,
      requiredFields,
      id: editingAddOn?.id || Date.now(),
      cupsSubOptions: accessorySubOptions.cups,
      pipingSubOptions: accessorySubOptions.piping,
      zipTypeSubOptions: accessorySubOptions.zipType,
      hooksSubOptions: accessorySubOptions.hooks,
    };
    onSave(addOnData);
    onClose();
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
      
      filesToProcess.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setDesignImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleHangingImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setHangingImages(prev => [...prev, reader.result as string]);
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

  const toggleRequiredField = (field: keyof typeof requiredFields) => {
    setRequiredFields({ ...requiredFields, [field]: !requiredFields[field] });
  };

  const handleAccessorySubOptionChange = (accessory: keyof typeof accessorySubOptions, value: string) => {
    const currentOptions = accessorySubOptions[accessory];
    if (currentOptions.includes(value)) {
      setAccessorySubOptions({
        ...accessorySubOptions,
        [accessory]: currentOptions.filter(opt => opt !== value),
      });
    } else {
      setAccessorySubOptions({
        ...accessorySubOptions,
        [accessory]: [...currentOptions, value],
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center overflow-y-auto py-8">
      <div className="bg-gray-50 w-full max-w-6xl mx-4 rounded-lg shadow-xl">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 rounded-t-lg">
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
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
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {editingAddOn ? 'Update Configuration' : 'Save Configuration'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Configuration Name *
                    </label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value, subCategory: '' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.name} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sub Category *
                    </label>
                    <select
                      value={formData.subCategory}
                      onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      disabled={!formData.category}
                    >
                      <option value="">Select Sub Category</option>
                      {formData.category && getSubCategoriesForCategory(formData.category)?.map(subCat => (
                        <option key={subCat} value={subCat}>{subCat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
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

              {/* Accessory Options */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Accessory Options</h3>
                <div className="space-y-3">
                  {[
                    { key: 'cups', label: 'Cups' },
                    { key: 'piping', label: 'Piping' },
                    { key: 'zipType', label: 'Zip Type' },
                    { key: 'hooks', label: 'Hooks' },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={accessories[key as keyof typeof accessories]}
                          onChange={(e) => setAccessories({ ...accessories, [key]: e.target.checked })}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <label className="text-sm font-medium text-gray-700">{label}</label>
                      </div>
                      <label className="flex items-center gap-2 text-xs text-gray-500">
                        <input
                          type="checkbox"
                          checked={requiredFields[key as keyof typeof requiredFields]}
                          onChange={() => toggleRequiredField(key as keyof typeof requiredFields)}
                          className="w-3 h-3 text-blue-600 rounded"
                        />
                        Required
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accessory Sub-Options */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Accessory Sub-Options</h3>
                <p className="text-xs text-gray-500 mb-3">Select specific options for each enabled accessory</p>
                <div className="space-y-4">
                  {[
                    { key: 'cups', label: 'Cups' },
                    { key: 'piping', label: 'Piping' },
                    { key: 'zipType', label: 'Zip Type' },
                    { key: 'hooks', label: 'Hooks' },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        {label} Options
                      </label>
                      {!accessories[key as keyof typeof accessories] ? (
                        <p className="text-xs text-gray-400 italic p-3 bg-gray-50 rounded-lg">
                          Enable {label} above to configure options
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 gap-2">
                          {accessoryOptions[key as keyof typeof accessoryOptions]?.map(option => (
                            <label key={option} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                              <input
                                type="checkbox"
                                checked={accessorySubOptions[key as keyof typeof accessorySubOptions].includes(option)}
                                onChange={() => handleAccessorySubOptionChange(key as keyof typeof accessorySubOptions, option)}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Middle Column - Images */}
            <div className="space-y-6">
              {/* Fabric Image */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Fabric Image</h3>
                  <label className="flex items-center gap-2 text-xs text-gray-500">
                    <input
                      type="checkbox"
                      checked={requiredFields.fabricImage}
                      onChange={() => toggleRequiredField('fabricImage')}
                      className="w-3 h-3 text-blue-600 rounded"
                    />
                    Required
                  </label>
                </div>
                {fabricImage ? (
                  <div className="relative">
                    <img
                      src={fabricImage}
                      alt="Fabric"
                      className="w-full h-48 object-cover rounded-lg"
                    />
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
                        <span className="text-blue-600 hover:text-blue-700 font-medium">
                          Click to upload
                        </span>
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

              {/* Drawing Image */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Drawing Image</h3>
                  <label className="flex items-center gap-2 text-xs text-gray-500">
                    <input
                      type="checkbox"
                      checked={requiredFields.drawingImage}
                      onChange={() => toggleRequiredField('drawingImage')}
                      className="w-3 h-3 text-blue-600 rounded"
                    />
                    Required
                  </label>
                </div>
                {drawingImage ? (
                  <div className="relative">
                    <img
                      src={drawingImage}
                      alt="Drawing"
                      className="w-full h-48 object-cover rounded-lg"
                    />
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
                        <span className="text-blue-600 hover:text-blue-700 font-medium">
                          Click to upload
                        </span>
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

            {/* Right Column - Design & Hanging Images */}
            <div className="space-y-6">
              {/* Design Images (3 max) */}
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
                      onChange={() => toggleRequiredField('designImages')}
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
                        onClick={() => onOpenGallery((images) => {
                          const remainingSlots = 3 - designImages.length;
                          setDesignImages([...designImages, ...images.slice(0, remainingSlots)]);
                        })}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Gallery
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Hanging Images */}
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
                      onChange={() => toggleRequiredField('hangings')}
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
                      onClick={() => onOpenGallery((images) => {
                        setHangingImages([...hangingImages, ...images]);
                      })}
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