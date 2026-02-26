import { useState, useEffect, useRef } from 'react';
import { X, Image as ImageIcon, Loader2 } from 'lucide-react';
import type { Category } from '../api/types/category';
import type { CreateCategoryRequest, UpdateCategoryRequest } from '../api/types/category';
import { uploadFile } from '../api/services/uploadService';

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
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [thumbnailUploadError, setThumbnailUploadError] = useState<string | null>(null);
  const [productIdsStr, setProductIdsStr] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setThumbnailUploadError('Please select an image file (PNG, JPG, etc.)');
      return;
    }
    setThumbnailUploadError(null);
    setThumbnailUploading(true);
    try {
      const url = await uploadFile(file);
      setThumbnailImage(url);
    } catch (err) {
      setThumbnailUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setThumbnailUploading(false);
      e.target.value = '';
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
                Upload image via API (recommended size: 800x600px). Same endpoint as product images.
              </p>

              {thumbnailUploadError && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
                  {thumbnailUploadError}
                </div>
              )}

              {thumbnailImage ? (
                <div className="relative">
                  <img
                    src={thumbnailImage}
                    alt="Category thumbnail"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => { setThumbnailImage(''); setThumbnailUploadError(null); }}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => !thumbnailUploading && fileInputRef.current?.click()}
                  onKeyDown={(e) => e.key === 'Enter' && !thumbnailUploading && fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 cursor-pointer hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  <input
                    ref={fileInputRef}
                    id="category-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="sr-only"
                    aria-hidden
                  />
                  <div className="flex flex-col items-center justify-center text-center pointer-events-none">
                    {thumbnailUploading ? (
                      <>
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-3" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Uploading…</p>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-3">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                        <span className="text-blue-600 hover:text-blue-700 font-medium">
                          Click to upload
                        </span>
                        <span className="text-gray-500 dark:text-gray-400"> or drag and drop</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          PNG, JPG up to 10MB
                        </p>
                      </>
                    )}
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
