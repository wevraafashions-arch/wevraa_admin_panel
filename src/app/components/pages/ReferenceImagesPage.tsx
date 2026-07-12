import { useCallback, useEffect, useState } from 'react';
import { Plus, Search, Trash2, Upload, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { referenceImagesService } from '../../api/services/referenceImagesService';
import type { ReferenceImage, ReferenceImageType } from '../../api/types/referenceImage';
import { ApiError } from '../../api/client';
import { ConfirmDeleteDialog } from '../ui/ConfirmDeleteDialog';

const MAX_IMAGE_SIZE_MB = 10;
const MAX_BULK_FILES = 50;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

type TabId = 'hangings' | 'drawings';

const TAB_CONFIG: Record<TabId, { type: ReferenceImageType; label: string; description: string }> = {
  hangings: {
    type: 'HANGING',
    label: 'Hangings',
    description: 'Upload and manage hanging reference images for add-ons.',
  },
  drawings: {
    type: 'DRAWING',
    label: 'Drawing Images',
    description: 'Upload and manage drawing pattern reference images.',
  },
};

function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return `${file.name}: please upload JPG, PNG, GIF, or WebP`;
  }
  if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
    return `${file.name}: must be under ${MAX_IMAGE_SIZE_MB}MB`;
  }
  return null;
}

interface ReferenceImageGalleryProps {
  type: ReferenceImageType;
  title: string;
  description: string;
}

function ReferenceImageGallery({ type, title, description }: ReferenceImageGalleryProps) {
  const [images, setImages] = useState<ReferenceImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadLabel, setUploadLabel] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDeleteImage, setPendingDeleteImage] = useState<ReferenceImage | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const loadImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await referenceImagesService.getList(type);
      setImages(list);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load reference images');
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    loadImages();
    setSelectedIds(new Set());
    setSearchQuery('');
  }, [loadImages]);

  const filteredImages = images.filter((image) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (image.label ?? '').toLowerCase().includes(q);
  });

  const selectedCount = selectedIds.size;
  const allPageSelected =
    filteredImages.length > 0 && filteredImages.every((image) => selectedIds.has(image.id));
  const somePageSelected = filteredImages.some((image) => selectedIds.has(image.id));

  const toggleSelectImage = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAllPage = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allPageSelected) {
        filteredImages.forEach((image) => next.delete(image.id));
      } else {
        filteredImages.forEach((image) => next.add(image.id));
      }
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const resetUploadModal = () => {
    setShowUploadModal(false);
    setUploadFiles([]);
    setUploadLabel('');
    setDragActive(false);
  };

  const addFiles = (incoming: FileList | File[]) => {
    const fileArray = Array.from(incoming);
    if (!fileArray.length) return;

    const errors: string[] = [];
    const valid: File[] = [];

    for (const file of fileArray) {
      const validationError = validateImageFile(file);
      if (validationError) errors.push(validationError);
      else valid.push(file);
    }

    if (errors.length) {
      toast.error(errors[0]);
      if (errors.length > 1) {
        toast.error(`${errors.length - 1} more file(s) were skipped`);
      }
    }

    if (!valid.length) return;

    setUploadFiles((prev) => {
      const combined = [...prev, ...valid];
      if (combined.length > MAX_BULK_FILES) {
        toast.error(`You can upload up to ${MAX_BULK_FILES} images at once`);
        return combined.slice(0, MAX_BULK_FILES);
      }
      return combined;
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) addFiles(e.target.files);
    e.target.value = '';
  };

  const removeUploadFile = (index: number) => {
    setUploadFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!uploadFiles.length) {
      toast.error('Please select at least one image');
      return;
    }

    setUploading(true);
    try {
      if (uploadFiles.length === 1) {
        const formData = new FormData();
        formData.append('image', uploadFiles[0]);
        formData.append('type', type);
        if (uploadLabel.trim()) formData.append('label', uploadLabel.trim());
        await referenceImagesService.createWithImage(formData);
        toast.success('Image uploaded');
      } else {
        const formData = new FormData();
        formData.append('type', type);
        uploadFiles.forEach((file) => formData.append('images', file));
        const result = await referenceImagesService.bulkUploadWithImage(formData);
        if (result.created > 0) {
          toast.success(`${result.created} image(s) uploaded`);
        }
        if (result.failed > 0) {
          toast.warning(`${result.failed} image(s) failed to upload`);
        }
      }
      await loadImages();
      resetUploadModal();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const openDeleteDialog = (image: ReferenceImage) => {
    setPendingDeleteImage(image);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteImage) return;
    setDeleting(true);
    try {
      await referenceImagesService.delete(pendingDeleteImage.id);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(pendingDeleteImage.id);
        return next;
      });
      await loadImages();
      setDeleteDialogOpen(false);
      setPendingDeleteImage(null);
      toast.success('Image deleted');
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Failed to delete image');
    } finally {
      setDeleting(false);
    }
  };

  const handleConfirmBulkDelete = async () => {
    const ids = Array.from(selectedIds);
    if (!ids.length) return;
    setBulkDeleting(true);
    try {
      const result = await referenceImagesService.bulkDelete(ids);
      if (result.deleted > 0) {
        toast.success(result.message);
      } else {
        toast.info(result.message);
      }
      if (result.notFound.length > 0) {
        toast.warning('Some images were already removed or could not be deleted');
      }
      clearSelection();
      setBulkDeleteDialogOpen(false);
      await loadImages();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Failed to delete images');
    } finally {
      setBulkDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {selectedCount > 0 && (
            <button
              type="button"
              onClick={() => setBulkDeleteDialogOpen(true)}
              disabled={bulkDeleting}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              Delete selected ({selectedCount})
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              resetUploadModal();
              setShowUploadModal(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Upload Images
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search by label..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {searchQuery && (
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredImages.length} of {images.length} images
          </p>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading images…
        </div>
      ) : (
        <>
          {filteredImages.length > 0 && (
            <div className="flex items-center justify-between gap-4 flex-wrap bg-white dark:bg-gray-800 rounded-lg shadow px-4 py-3 border border-gray-200 dark:border-gray-700">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={allPageSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = somePageSelected && !allPageSelected;
                  }}
                  onChange={toggleSelectAllPage}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Select all ({filteredImages.length})
                </span>
              </label>
              {selectedCount > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    {selectedCount} selected
                  </span>
                  <button
                    type="button"
                    onClick={clearSelection}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          )}

          {filteredImages.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center border border-gray-200 dark:border-gray-700">
              <Upload className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery ? 'No images match your search.' : 'No images yet. Upload your first reference image.'}
              </p>
              {!searchQuery && (
                <button
                  type="button"
                  onClick={() => setShowUploadModal(true)}
                  className="mt-4 inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <Plus className="w-4 h-4" />
                  Upload images
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredImages.map((image) => {
                const isSelected = selectedIds.has(image.id);
                return (
                  <div
                    key={image.id}
                    className={`bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow group border border-gray-200 dark:border-gray-700 ${
                      isSelected ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900' : ''
                    }`}
                  >
                    <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <label
                        className="absolute top-2 left-2 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white/95 dark:bg-gray-800/95 shadow-md cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectImage(image.id)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
                          aria-label={`Select ${image.label || 'image'}`}
                        />
                      </label>
                      <img
                        src={image.imageUrl}
                        alt={image.label || 'Reference image'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        type="button"
                        onClick={() => openDeleteDialog(image)}
                        className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-red-50 dark:hover:bg-red-900 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete image"
                      >
                        <Trash2 className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400" />
                      </button>
                    </div>
                    {image.label && (
                      <div className="px-3 py-2 border-t border-gray-100 dark:border-gray-700">
                        <p className="text-sm text-gray-900 dark:text-white truncate" title={image.label}>
                          {image.label}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upload Images</h3>
              <button
                type="button"
                onClick={resetUploadModal}
                className="p-1 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Drag and drop images here, or click to browse
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
                  JPG, PNG, GIF, WebP — up to {MAX_BULK_FILES} files, {MAX_IMAGE_SIZE_MB}MB each
                </p>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                  <Plus className="w-4 h-4" />
                  Select files
                  <input
                    type="file"
                    accept={ALLOWED_IMAGE_TYPES.join(',')}
                    multiple
                    className="hidden"
                    onChange={handleFileInput}
                  />
                </label>
              </div>

              {uploadFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {uploadFiles.length} file(s) selected
                  </p>
                  <ul className="max-h-40 overflow-y-auto space-y-2">
                    {uploadFiles.map((file, index) => (
                      <li
                        key={`${file.name}-${index}`}
                        className="flex items-center justify-between gap-2 text-sm bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2"
                      >
                        <span className="truncate text-gray-700 dark:text-gray-300">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeUploadFile(index)}
                          className="shrink-0 text-gray-500 hover:text-red-600"
                          aria-label={`Remove ${file.name}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {uploadFiles.length === 1 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Label (optional)
                  </label>
                  <input
                    type="text"
                    value={uploadLabel}
                    onChange={(e) => setUploadLabel(e.target.value)}
                    placeholder="e.g. Blue tassel"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={resetUploadModal}
                disabled={uploading}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpload}
                disabled={uploading || uploadFiles.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                Upload {uploadFiles.length > 1 ? `(${uploadFiles.length})` : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete reference image"
        description={
          pendingDeleteImage?.label
            ? `Delete "${pendingDeleteImage.label}"? This cannot be undone.`
            : 'Delete this reference image? This cannot be undone.'
        }
        onConfirm={handleConfirmDelete}
        isLoading={deleting}
      />

      <ConfirmDeleteDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        title="Delete selected images"
        description={`Delete ${selectedCount} selected image(s)? This cannot be undone.`}
        onConfirm={handleConfirmBulkDelete}
        isLoading={bulkDeleting}
      />
    </div>
  );
}

export function ReferenceImagesPage() {
  const [activeTab, setActiveTab] = useState<TabId>('hangings');
  const activeConfig = TAB_CONFIG[activeTab];

  return (
    <div className="space-y-6 dark:bg-gray-900">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Reference Images</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Manage hanging and drawing reference assets for add-ons
        </p>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-1">
          {(Object.keys(TAB_CONFIG) as TabId[]).map((tabId) => (
            <button
              key={tabId}
              type="button"
              onClick={() => setActiveTab(tabId)}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tabId
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {TAB_CONFIG[tabId].label}
            </button>
          ))}
        </div>
      </div>

      <ReferenceImageGallery
        key={activeTab}
        type={activeConfig.type}
        title={activeConfig.label}
        description={activeConfig.description}
      />
    </div>
  );
}
