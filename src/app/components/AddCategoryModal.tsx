import { useState, useEffect } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import type { Category } from '../api/types/category';
import type { CreateCategoryRequest, UpdateCategoryRequest } from '../api/types/category';

export type SaveCategoryPayload =
  | CreateCategoryRequest
  | (UpdateCategoryRequest & { id: string });

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: SaveCategoryPayload) => void | Promise<void>;
  editingCategory: Category | null;
  isSaving?: boolean;
}

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'SERVICE', label: 'Service' },
] as const;

export function AddCategoryModal({
  isOpen,
  onClose,
  onSave,
  editingCategory,
  isSaving = false,
}: AddCategoryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    headline: '',
    shortDescription: '',
    status: 'ACTIVE',
  });
  const [thumbnailImage, setThumbnailImage] = useState<string>('');
  const [productIdsStr, setProductIdsStr] = useState('');

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        name: editingCategory.name,
        headline: editingCategory.headline || '',
        shortDescription: editingCategory.shortDescription || '',
        status: editingCategory.status || 'ACTIVE',
      });
      setThumbnailImage(editingCategory.thumbnailImage || '');
      setProductIdsStr(
        (editingCategory.products ?? [])
          .map((p) => p.id)
          .filter(Boolean)
          .join(', ')
      );
    } else {
      setFormData({
        name: '',
        headline: '',
        shortDescription: '',
        status: 'ACTIVE',
      });
      setThumbnailImage('');
      setProductIdsStr('');
    }
  }, [editingCategory, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const productIds = productIdsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const payload = {
      name: formData.name,
      headline: formData.headline || undefined,
      shortDescription: formData.shortDescription || undefined,
      status: formData.status,
      thumbnailImage: thumbnailImage || undefined,
      productIds: productIds.length ? productIds : undefined,
    };
    try {
      if (editingCategory) {
        await Promise.resolve(
          (onSave as (p: UpdateCategoryRequest & { id: string }) => void | Promise<void>)({
            ...payload,
            id: editingCategory.id,
          })
        );
      } else {
        await Promise.resolve(
          (onSave as (p: CreateCategoryRequest) => void | Promise<void>)(
            payload as CreateCategoryRequest
          )
        );
      }
    } catch {
      // Parent sets error; keep modal open
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center overflow-y-auto py-8">
      <div className="bg-gray-50 dark:bg-gray-900 w-full max-w-4xl mx-4 rounded-lg shadow-xl">
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10 rounded-t-lg">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {editingCategory ? 'Edit category' : 'Add category'}
            </h2>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSaving || !formData.name.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : editingCategory ? 'Update Category' : 'Save Category'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Basic Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Wedding Wear"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={formData.headline}
                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                    placeholder="e.g., Elegant Wedding Collection"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Short Description
                  </label>
                  <textarea
                    value={formData.shortDescription}
                    onChange={(e) =>
                      setFormData({ ...formData, shortDescription: e.target.value })
                    }
                    placeholder="Brief description of this category"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Thumbnail Image
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                URL or upload (recommended size: 800x600px)
              </p>

              {thumbnailImage ? (
                <div className="relative">
                  <img
                    src={thumbnailImage}
                    alt="Category thumbnail"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setThumbnailImage('')}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-3">
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    </div>
                    <label htmlFor="category-image" className="cursor-pointer">
                      <span className="text-blue-600 hover:text-blue-700 font-medium">
                        Click to upload
                      </span>
                      <span className="text-gray-500 dark:text-gray-400"> or drag and drop</span>
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      PNG, JPG up to 10MB
                    </p>
                    <input
                      id="category-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Product IDs (optional)
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Comma-separated product IDs to link to this category
              </p>
              <input
                type="text"
                value={productIdsStr}
                onChange={(e) => setProductIdsStr(e.target.value)}
                placeholder="e.g. product-uuid-1, product-uuid-2"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
