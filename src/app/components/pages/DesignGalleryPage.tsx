import { useState, useEffect } from 'react';
import { Plus, Search, Heart, X, Upload, Copy, Filter, Trash2, Edit } from 'lucide-react';
import { designsService } from '../../api/services/designsService';
import { tailorCategoriesService } from '../../api/services/tailorCategoriesService';
import type { Design } from '../../api/types/design';
import type { ApiTailorCategory } from '../../api/types/tailorCategory';
import { ApiError } from '../../api/client';
import { ConfirmDeleteDialog } from '../ui/ConfirmDeleteDialog';

const MAX_IMAGE_SIZE_MB = 10;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

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
  const [searchQuery, setSearchQuery] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDeleteDesign, setPendingDeleteDesign] = useState<Design | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [formDesign, setFormDesign] = useState({
    designName: '',
    description: '',
    categoryId: '',
    subcategoryId: '',
  });

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
      const list = await designsService.getList({
        categoryId: filterCategoryId || undefined,
        subcategoryId: filterSubcategoryId || undefined,
      });
      setDesigns(list);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load designs');
      setDesigns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadDesigns();
  }, [filterCategoryId, filterSubcategoryId]);

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

  const handleFile = (file: File) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      alert('Please upload a JPG, PNG or GIF image');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      alert(`Image must be under ${MAX_IMAGE_SIZE_MB}MB`);
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const buildFormData = (includeImage: boolean): FormData => {
    const fd = new FormData();
    if (includeImage && imageFile) fd.append('image', imageFile);
    fd.append('designName', formDesign.designName);
    fd.append('description', formDesign.description);
    fd.append('categoryId', formDesign.categoryId);
    fd.append('subcategoryId', formDesign.subcategoryId);
    return fd;
  };

  const handleAddDesign = async () => {
    if (!formDesign.designName.trim() || !formDesign.categoryId || !formDesign.subcategoryId) {
      alert('Please fill in design name, category and subcategory');
      return;
    }
    if (!imageFile) {
      alert('Please upload an image');
      return;
    }
    setSubmitting(true);
    try {
      const formData = buildFormData(true);
      await designsService.createWithImage(formData);
      await loadDesigns();
      resetModal();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : 'Failed to add design');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateDesign = async () => {
    if (!editingDesignId || !formDesign.designName.trim() || !formDesign.categoryId || !formDesign.subcategoryId) {
      alert('Please fill in design name, category and subcategory');
      return;
    }
    setSubmitting(true);
    try {
      if (imageFile) {
        const formData = buildFormData(true);
        await designsService.updateWithImage(editingDesignId, formData);
      } else {
        await designsService.update(editingDesignId, {
          designName: formDesign.designName,
          description: formDesign.description || undefined,
          categoryId: formDesign.categoryId,
          subcategoryId: formDesign.subcategoryId,
        });
      }
      await loadDesigns();
      resetModal();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : 'Failed to update design');
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
      categoryId: design.categoryId,
      subcategoryId: design.subcategoryId,
    });
    setImageFile(null);
    setImagePreview(design.imageUrl);
    setShowAddModal(true);
    loadSubcategories(design.categoryId);
  };

  const handleDuplicateDesign = async (design: Design) => {
    try {
      await designsService.create({
        designName: `${design.designName} (Copy)`,
        description: design.description || undefined,
        categoryId: design.categoryId,
        subcategoryId: design.subcategoryId,
        imageUrl: design.imageUrl,
      });
      await loadDesigns();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : 'Failed to duplicate design');
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
      await loadDesigns();
      setDeleteDialogOpen(false);
      setPendingDeleteDesign(null);
    } catch (e) {
      alert(e instanceof ApiError ? e.message : 'Failed to delete design');
    } finally {
      setDeleting(false);
    }
  };

  const resetModal = () => {
    setShowAddModal(false);
    setIsEditMode(false);
    setEditingDesignId(null);
    setFormDesign({ designName: '', description: '', categoryId: '', subcategoryId: '' });
    setImageFile(null);
    setImagePreview('');
  };

  const filteredDesigns = designs.filter((d) => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    const name = d.designName.toLowerCase();
    const desc = (d.description || '').toLowerCase();
    const cat = (d.category?.name ?? '').toLowerCase();
    const sub = (d.subcategory?.name ?? '').toLowerCase();
    return name.includes(q) || desc.includes(q) || cat.includes(q) || sub.includes(q);
  });

  return (
    <div className="space-y-6 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Design Gallery</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Browse and showcase design inspirations</p>
        </div>
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

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search by name, category, or subcategory..."
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
            onChange={(e) => setFilterSubcategoryId(e.target.value)}
            disabled={!filterCategoryId}
          >
            <option value="">All Sub-Categories</option>
            {filterSubcategories.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        {(filterCategoryId || filterSubcategoryId || searchQuery) && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Filter className="w-4 h-4" />
            <span>Showing {filteredDesigns.length} of {designs.length} designs</span>
            <button
              onClick={() => {
                setFilterCategoryId('');
                setFilterSubcategoryId('');
                setSearchQuery('');
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDesigns.map((design) => (
            <div key={design.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-700">
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
                <div className="absolute bottom-3 left-3">
                  <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                    {design.subcategory?.name ?? design.subcategoryId}
                  </span>
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
          ))}
        </div>
      )}

      {!loading && filteredDesigns.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">No designs found</p>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Design Image {!isEditMode && <span className="text-red-500">*</span>}
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                    dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : imagePreview ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('designFileInput')?.click()}
                >
                  {imagePreview ? (
                    <div className="space-y-4">
                      <div className="relative w-full h-64 rounded-lg overflow-hidden">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setImagePreview('');
                            setImageFile(null);
                          }}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-green-700 dark:text-green-400 font-medium">✓ Image uploaded</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Click or drag to change (JPG/PNG/GIF, max 10MB)</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-center">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/50 rounded-full">
                          <Upload className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Drop image here or click to browse</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">JPG, PNG, GIF — max 10MB</p>
                    </div>
                  )}
                </div>
                <input
                  id="designFileInput"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-end gap-3">
              <button onClick={resetModal} className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Cancel
              </button>
              <button
                onClick={isEditMode ? handleUpdateDesign : handleAddDesign}
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Saving…' : isEditMode ? 'Update Design' : 'Add Design'}
              </button>
            </div>
          </div>
        </div>
      )}

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

