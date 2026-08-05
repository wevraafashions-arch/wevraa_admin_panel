import { useState, useEffect, useRef } from 'react';
import { Plus, Search, Heart, X, Upload, Copy, Filter, Trash2, Edit, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { designsService } from '../../api/services/designsService';
import { tailorCategoriesService } from '../../api/services/tailorCategoriesService';
import type { Design } from '../../api/types/design';
import { showCreateDesignsToast } from '../../api/types/design';
import type { ApiTailorCategory } from '../../api/types/tailorCategory';
import { ApiError } from '../../api/client';
import { ConfirmDeleteDialog } from '../ui/ConfirmDeleteDialog';
import { convertImageFileToWebP } from '../../utils/convertImageToWebP';

const MAX_IMAGE_SIZE_MB = 10;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50, 100] as const;
const TAG_FILTER_OPTIONS = ['All', 'Back', 'Front', 'Sleeves'] as const;

/** Send common case variants so backend `hasSome` matches case-insensitively. */
function tagFilterQueryValues(tag: string): string[] {
  const trimmed = tag.trim();
  if (!trimmed || trimmed.toLowerCase() === 'all') return [];
  const lower = trimmed.toLowerCase();
  const title = lower.charAt(0).toUpperCase() + lower.slice(1);
  const upper = trimmed.toUpperCase();
  return Array.from(new Set([trimmed, lower, title, upper]));
}

export function DesignGalleryPage() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<ApiTailorCategory[]>([]);
  const [subcategories, setSubcategories] = useState<ApiTailorCategory[]>([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingDesignId, setEditingDesignId] = useState<string | null>(null);
  const [filterCategoryId, setFilterCategoryId] = useState('');
  const [filterSubcategoryId, setFilterSubcategoryId] = useState('');
  const [filterSubcategories, setFilterSubcategories] = useState<ApiTailorCategory[]>([]);
  const [filterTag, setFilterTag] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(50);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const previewBlobUrlRef = useRef<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [convertingImage, setConvertingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [syncingPinterest, setSyncingPinterest] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDeleteDesign, setPendingDeleteDesign] = useState<Design | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const [formDesign, setFormDesign] = useState({
    designName: '',
    description: '',
    tags: '',
    categoryId: '',
    subcategoryId: '',
    pinterestBoardUrl: '',
  });

  const parseTags = (tags: string): string[] =>
    tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

  const hasPinterestSource = Boolean(formDesign.pinterestBoardUrl.trim());
  const hasImageSource = Boolean(imageFile || (isEditMode && imagePreview && !imageFile));

  const notifyCreateResult = (result: { created: number; skipped: number }) => {
    const message = showCreateDesignsToast(result);
    if (result.created === 0 && result.skipped > 0) {
      toast.info(message);
    } else {
      toast.success(message);
    }
  };

  const revokePreviewBlobUrl = () => {
    if (previewBlobUrlRef.current) {
      URL.revokeObjectURL(previewBlobUrlRef.current);
      previewBlobUrlRef.current = null;
    }
  };

  const setPreviewFromUploadFile = (file: File) => {
    revokePreviewBlobUrl();
    const url = URL.createObjectURL(file);
    previewBlobUrlRef.current = url;
    setImagePreview(url);
  };

  const clearImageSource = () => {
    revokePreviewBlobUrl();
    setImageFile(null);
    setImagePreview('');
  };

  const clearPinterestSource = () => {
    setFormDesign((prev) => ({ ...prev, pinterestBoardUrl: '' }));
  };

  const loadCategories = async () => {
    try {
      const list = await tailorCategoriesService.getList();
      setCategories(list.filter((c) => !c.parentId));
    } catch {
      setCategories([]);
    }
  };

  const loadSubcategories = async (parentId: string | null) => {
    if (!parentId) {
      setSubcategories([]);
      return;
    }
    try {
      const list = await tailorCategoriesService.getList(parentId);
      setSubcategories(list);
    } catch {
      setSubcategories([]);
    }
  };

  const loadDesigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const tagValues = tagFilterQueryValues(filterTag);
      const result = await designsService.getList({
        categoryId: filterCategoryId || undefined,
        subcategoryId: filterSubcategoryId || undefined,
        tags: tagValues.length ? tagValues : undefined,
        page,
        limit,
      });
      const list = Array.isArray(result.data) ? result.data : [];
      setDesigns(list);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load designs');
      setDesigns([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadDesigns();
  }, [filterCategoryId, filterSubcategoryId, filterTag, page, limit]);

  useEffect(() => {
    loadSubcategories(formDesign.categoryId || null);
  }, [formDesign.categoryId]);

  useEffect(() => {
    if (!filterCategoryId) {
      setFilterSubcategories([]);
      setFilterSubcategoryId('');
      return;
    }
    tailorCategoriesService.getList(filterCategoryId).then(setFilterSubcategories);
  }, [filterCategoryId]);

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
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  const handleFile = async (file: File) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error('Please upload a JPG, PNG, GIF, or WebP image');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      toast.error(`Image must be under ${MAX_IMAGE_SIZE_MB}MB`);
      return;
    }
    clearPinterestSource();
    setConvertingImage(true);
    try {
      const webpFile = await convertImageFileToWebP(file);
      setImageFile(webpFile);
      setPreviewFromUploadFile(webpFile);
    } catch {
      toast.error('Could not convert image to WebP. Try another file.');
      clearImageSource();
    } finally {
      setConvertingImage(false);
    }
  };

  const buildImageFormData = (): FormData => {
    const fd = new FormData();
    if (imageFile) fd.append('image', imageFile, imageFile.name);
    fd.append('designName', formDesign.designName.trim());
    fd.append('description', formDesign.description);
    fd.append('categoryId', formDesign.categoryId.trim());
    fd.append('subcategoryId', formDesign.subcategoryId.trim());
    if (formDesign.tags.trim()) fd.append('tags', formDesign.tags.trim());
    return fd;
  };

  const buildPinterestPayload = () => {
    const tags = parseTags(formDesign.tags);
    return {
      designName: formDesign.designName.trim(),
      description: formDesign.description.trim() || undefined,
      categoryId: formDesign.categoryId.trim(),
      subcategoryId: formDesign.subcategoryId.trim(),
      tags: tags.length ? tags : undefined,
      pinterestBoardUrl: formDesign.pinterestBoardUrl.trim(),
    };
  };

  const handleAddDesign = async () => {
    if (!formDesign.designName.trim() || !formDesign.categoryId || !formDesign.subcategoryId) {
      toast.error('Please fill in design name, category and subcategory');
      return;
    }

    const boardUrl = formDesign.pinterestBoardUrl.trim();
    if (!imageFile && !boardUrl) {
      toast.error('Please upload one image or provide a Pinterest board URL');
      return;
    }
    if (imageFile && boardUrl) {
      toast.error('Please use either an image upload or a Pinterest board URL, not both');
      return;
    }

    setSubmitting(true);
    if (boardUrl) setSyncingPinterest(true);

    try {
      const result = imageFile
        ? await designsService.createWithImage(buildImageFormData())
        : await designsService.create(buildPinterestPayload());

      notifyCreateResult(result);
      await loadDesigns();
      resetModal();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Failed to add design');
    } finally {
      setSubmitting(false);
      setSyncingPinterest(false);
    }
  };

  const handleUpdateDesign = async () => {
    if (!editingDesignId || !formDesign.designName.trim() || !formDesign.categoryId || !formDesign.subcategoryId) {
      toast.error('Please fill in design name, category and subcategory');
      return;
    }

    setSubmitting(true);
    try {
      if (imageFile) {
        await designsService.updateWithImage(editingDesignId, buildImageFormData());
      } else {
        await designsService.update(editingDesignId, {
          designName: formDesign.designName,
          description: formDesign.description || undefined,
          categoryId: formDesign.categoryId,
          subcategoryId: formDesign.subcategoryId,
          tags: parseTags(formDesign.tags),
        });
      }
      toast.success('Design updated successfully');
      await loadDesigns();
      resetModal();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Failed to update design');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditDesign = (design: Design) => {
    setIsEditMode(true);
    setEditingDesignId(design.id);
    setFormDesign({
      designName: design.designName,
      description: design.description || '',
      tags: (design.tags ?? []).join(', '),
      categoryId: design.categoryId,
      subcategoryId: design.subcategoryId,
      pinterestBoardUrl: '',
    });
    setImageFile(null);
    revokePreviewBlobUrl();
    setImagePreview(design.imageUrl);
    setShowAddModal(true);
    loadSubcategories(design.categoryId);
  };

  const handleDuplicateDesign = async (design: Design) => {
    try {
      const result = await designsService.create({
        designName: `${design.designName} (Copy)`,
        description: design.description || undefined,
        categoryId: design.categoryId,
        subcategoryId: design.subcategoryId,
        imageUrl: design.imageUrl,
        tags: design.tags?.length ? design.tags : undefined,
      });
      notifyCreateResult(result);
      await loadDesigns();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Failed to duplicate design');
    }
  };

  const openDeleteDialog = (design: Design) => {
    setPendingDeleteDesign(design);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDeleteDesign = async () => {
    if (!pendingDeleteDesign) return;
    setDeleting(true);
    try {
      await designsService.delete(pendingDeleteDesign.id);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(pendingDeleteDesign.id);
        return next;
      });
      await loadDesigns();
      setDeleteDialogOpen(false);
      setPendingDeleteDesign(null);
      toast.success('Design deleted');
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Failed to delete design');
    } finally {
      setDeleting(false);
    }
  };

  const handleConfirmBulkDelete = async () => {
    const ids = Array.from(selectedIds);
    if (!ids.length) return;
    setBulkDeleting(true);
    try {
      const result = await designsService.bulkDelete(ids);
      if (result.deleted > 0) {
        toast.success(result.message);
      } else {
        toast.info(result.message);
      }
      if (result.notFound.length > 0) {
        toast.warning('Some designs were already removed or could not be deleted');
      }
      clearSelection();
      setBulkDeleteDialogOpen(false);
      await loadDesigns();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Failed to delete designs');
    } finally {
      setBulkDeleting(false);
    }
  };

  const resetModal = () => {
    setShowAddModal(false);
    setIsEditMode(false);
    setEditingDesignId(null);
    setFormDesign({
      designName: '',
      description: '',
      tags: '',
      categoryId: '',
      subcategoryId: '',
      pinterestBoardUrl: '',
    });
    revokePreviewBlobUrl();
    setImageFile(null);
    setImagePreview('');
    setConvertingImage(false);
    setSyncingPinterest(false);
  };

  // Frontend-only: case-insensitive search on the current page of API results.
  // Category, subcategory, tags dropdown, page, and limit are filtered by the backend.
  const filteredDesigns = designs.filter((d) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      d.designName.toLowerCase().includes(q) ||
      (d.description || '').toLowerCase().includes(q) ||
      (d.category?.name ?? '').toLowerCase().includes(q) ||
      (d.subcategory?.name ?? '').toLowerCase().includes(q) ||
      (d.tags ?? []).some((tag) => tag.toLowerCase().includes(q))
    );
  });

  const selectedCount = selectedIds.size;
  const allPageSelected =
    filteredDesigns.length > 0 && filteredDesigns.every((d) => selectedIds.has(d.id));
  const somePageSelected = filteredDesigns.some((d) => selectedIds.has(d.id));

  const toggleSelectDesign = (id: string) => {
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
        filteredDesigns.forEach((d) => next.delete(d.id));
      } else {
        filteredDesigns.forEach((d) => next.add(d.id));
      }
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  useEffect(() => {
    clearSelection();
  }, [filterCategoryId, filterSubcategoryId, filterTag, page, limit]);

  return (
    <div className="space-y-6 dark:bg-gray-900">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Design Gallery</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Browse and showcase design inspirations</p>
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
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => {
              resetModal();
              setShowAddModal(true);
            }}
          >
            <Plus className="w-5 h-5" />
            Add Design
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search this page by name, category, subcategory, or tags..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={filterCategoryId}
            onChange={(e) => {
              setFilterCategoryId(e.target.value);
              setFilterSubcategoryId('');
              setPage(1);
            }}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed"
            value={filterSubcategoryId}
            onChange={(e) => {
              setFilterSubcategoryId(e.target.value);
              setPage(1);
            }}
            disabled={!filterCategoryId}
          >
            <option value="">All Sub-Categories</option>
            {filterSubcategories.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <select
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={filterTag || 'All'}
            onChange={(e) => {
              const value = e.target.value;
              setFilterTag(value === 'All' ? '' : value);
              setPage(1);
            }}
            aria-label="Filter by tag"
          >
            {TAG_FILTER_OPTIONS.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
        {(filterCategoryId || filterSubcategoryId || filterTag || searchQuery) && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Filter className="w-4 h-4" />
            <span>
              Showing {filteredDesigns.length} on this page
              {total > 0 ? ` · ${total} total` : ''}
              {filterTag ? ` · tag: ${filterTag}` : ''}
            </span>
            <button
              onClick={() => {
                setFilterCategoryId('');
                setFilterSubcategoryId('');
                setFilterTag('');
                setSearchQuery('');
                setPage(1);
              }}
              className="text-blue-600 dark:text-blue-400 hover:underline ml-2"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-sm text-gray-500 dark:text-gray-400">Loading designs…</div>
      ) : (
        <>
          {filteredDesigns.length > 0 && (
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
                  Select all on this page ({filteredDesigns.length})
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDesigns.map((design) => {
            const isSelected = selectedIds.has(design.id);
            return (
            <div
              key={design.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow group ${
                isSelected ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900' : ''
              }`}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-700">
                <label
                  className="absolute top-3 left-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white/95 dark:bg-gray-800/95 shadow-md cursor-pointer hover:bg-white dark:hover:bg-gray-800 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelectDesign(design.id)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
                    aria-label={`Select ${design.designName}`}
                  />
                </label>
                <img
                  src={design.imageUrl}
                  alt={design.designName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditDesign(design);
                    }}
                    className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
                    title="Edit Design"
                  >
                    <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicateDesign(design);
                    }}
                    className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
                    title="Duplicate Design"
                  >
                    <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteDialog(design);
                    }}
                    className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
                    title="Delete Design"
                  >
                    <Trash2 className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400" />
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
                    title="Like Design"
                  >
                    <Heart className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400" />
                  </button>
                </div>
                <div className="absolute bottom-3 left-3 flex gap-2">
                  <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                    {design.subcategory?.name ?? design.subcategoryId}
                  </span>
                  {design.pinterestBoardUrl && (
                    <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full">Pinterest</span>
                  )}
                </div>
              </div>
              <div
                className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                onClick={() => handleEditDesign(design)}
              >
                <h3 className="font-semibold text-gray-900 dark:text-white flex-1">{design.designName}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {design.category?.name ?? design.categoryId}
                </p>
              </div>
            </div>
            );
          })}
          </div>
        </>
      )}

      {!loading && filteredDesigns.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">No designs found</p>
        </div>
      )}

      {!loading && (total > 0 || totalPages > 1) && (
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Per page</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
          {totalPages > 1 && (
            <>
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {page} of {totalPages}
                {total > 0 ? ` · ${total} designs` : ''}
              </span>
              <button
                type="button"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                Next
              </button>
            </>
          )}
          {totalPages <= 1 && total > 0 && (
            <span className="text-sm text-gray-600 dark:text-gray-400">{total} designs</span>
          )}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {isEditMode ? 'Edit Design' : 'Add New Design'}
              </h2>
              <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" onClick={resetModal}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Design Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formDesign.designName}
                  onChange={(e) => setFormDesign({ ...formDesign, designName: e.target.value })}
                  placeholder="e.g., Elegant Bridal Blouse"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea
                  value={formDesign.description}
                  onChange={(e) => setFormDesign({ ...formDesign, description: e.target.value })}
                  placeholder="Describe the design details, fabric, embellishments, etc."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  value={formDesign.tags}
                  onChange={(e) => setFormDesign({ ...formDesign, tags: e.target.value })}
                  placeholder="Wedding, Silk, Embroidery"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formDesign.categoryId}
                    onChange={(e) => setFormDesign({ ...formDesign, categoryId: e.target.value, subcategoryId: '' })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sub-Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formDesign.subcategoryId}
                    onChange={(e) => setFormDesign({ ...formDesign, subcategoryId: e.target.value })}
                    disabled={!formDesign.categoryId}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed"
                  >
                    <option value="">{formDesign.categoryId ? 'Select Sub-Category' : 'Select a category first'}</option>
                    {subcategories.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {!isEditMode && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Upload One Image {!hasPinterestSource && <span className="text-red-500">*</span>}
                    </label>
                    <div
                      className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        hasPinterestSource
                          ? 'opacity-50 pointer-events-none border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                          : dragActive
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 cursor-pointer'
                            : imagePreview
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20 cursor-pointer'
                              : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer'
                      }`}
                      onDragEnter={hasPinterestSource ? undefined : handleDrag}
                      onDragLeave={hasPinterestSource ? undefined : handleDrag}
                      onDragOver={hasPinterestSource ? undefined : handleDrag}
                      onDrop={hasPinterestSource ? undefined : handleDrop}
                      onClick={() => !hasPinterestSource && !convertingImage && document.getElementById('designFileInput')?.click()}
                    >
                      {convertingImage && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 rounded-lg bg-white/90 dark:bg-gray-900/90">
                          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Converting to WebP…</span>
                        </div>
                      )}
                      {imagePreview ? (
                        <div className="space-y-4">
                          <div className="relative w-full h-64 rounded-lg overflow-hidden">
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                clearImageSource();
                              }}
                              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-sm text-green-700 dark:text-green-400 font-medium">✓ Image ready</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            One image — JPG, PNG, GIF, or WebP (max {MAX_IMAGE_SIZE_MB}MB), saved as WebP
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex justify-center">
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/50 rounded-full">
                              <Upload className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                            </div>
                          </div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Drop one image here or click to browse</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">JPG, PNG, GIF, or WebP — saved as WebP</p>
                        </div>
                      )}
                    </div>
                    <input
                      id="designFileInput"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleFileInput}
                      className="hidden"
                      disabled={convertingImage}
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">or</span>
                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Pinterest Board URL {!hasImageSource && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="url"
                      value={formDesign.pinterestBoardUrl}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.trim()) clearImageSource();
                        setFormDesign({ ...formDesign, pinterestBoardUrl: value });
                      }}
                      disabled={Boolean(imageFile)}
                      placeholder="https://in.pinterest.com/username/board-name/"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                      Imports one design per pin with the same name and metadata. Re-submitting the same board adds only new pins.
                    </p>
                  </div>
                </>
              )}

              {isEditMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Design Image <span className="text-gray-500 dark:text-gray-400 font-normal">(optional — replace current)</span>
                  </label>
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                      dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : imagePreview ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => !convertingImage && document.getElementById('designEditFileInput')?.click()}
                  >
                    {convertingImage && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 rounded-lg bg-white/90 dark:bg-gray-900/90">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Converting to WebP…</span>
                      </div>
                    )}
                    {imagePreview ? (
                      <div className="space-y-4">
                        <div className="relative w-full h-64 rounded-lg overflow-hidden">
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                          {imageFile && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                revokePreviewBlobUrl();
                                setImageFile(null);
                                setImagePreview(designs.find((d) => d.id === editingDesignId)?.imageUrl ?? '');
                              }}
                              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {imageFile
                            ? 'New WebP image will replace the current one'
                            : 'Current design image — upload JPG, PNG, GIF, or WebP to replace'}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-sm text-gray-500 dark:text-gray-400">No image preview</p>
                      </div>
                    )}
                  </div>
                  <input
                    id="designEditFileInput"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleFileInput}
                    className="hidden"
                    disabled={convertingImage}
                  />
                </div>
              )}
            </div>

            {syncingPinterest && (
              <div className="mx-6 mb-4 flex items-center gap-3 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 px-4 py-3 text-sm text-blue-800 dark:text-blue-200">
                <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                <span>Syncing Pinterest board… This may take 30–90 seconds.</span>
              </div>
            )}

            <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={resetModal}
                disabled={submitting || convertingImage}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={isEditMode ? handleUpdateDesign : handleAddDesign}
                disabled={
                  submitting ||
                  convertingImage ||
                  !formDesign.designName.trim() ||
                  !formDesign.categoryId ||
                  !formDesign.subcategoryId ||
                  (!isEditMode && !imageFile && !formDesign.pinterestBoardUrl.trim())
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {(submitting || convertingImage) && <Loader2 className="w-4 h-4 animate-spin" />}
                {convertingImage
                  ? 'Converting…'
                  : submitting
                    ? syncingPinterest
                      ? 'Syncing…'
                      : 'Saving…'
                    : isEditMode
                      ? 'Update Design'
                      : 'Add Design'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDeleteDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={(open) => setBulkDeleteDialogOpen(open)}
        title="Delete selected designs"
        description={`Delete ${selectedCount} design(s)? This action cannot be undone.`}
        onConfirm={handleConfirmBulkDelete}
        isLoading={bulkDeleting}
      />

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setPendingDeleteDesign(null);
        }}
        title="Delete design"
        description={
          pendingDeleteDesign
            ? `Are you sure you want to delete "${pendingDeleteDesign.designName}"? This action cannot be undone.`
            : 'Are you sure you want to delete this design? This action cannot be undone.'
        }
        onConfirm={handleConfirmDeleteDesign}
        isLoading={deleting}
      />
    </div>
  );
}

