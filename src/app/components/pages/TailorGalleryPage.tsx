import { useState, useEffect } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Tag,
  Plus,
  Filter,
  Search,
  Grid3x3,
  List,
  Calendar,
  X,
} from 'lucide-react';
import { ConfirmDeleteDialog } from '../ui/ConfirmDeleteDialog';
import { galleryService } from '../../api/services/galleryService';
import { tailorCategoriesService } from '../../api/services/tailorCategoriesService';
import type { GalleryImage } from '../../api/types/gallery';
import type { ApiTailorCategory } from '../../api/types/tailorCategory';
import { ApiError } from '../../api/client';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
const MAX_IMAGE_SIZE_MB = 10;

export function TailorGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<ApiTailorCategory[]>([]);
  const [subcategories, setSubcategories] = useState<ApiTailorCategory[]>([]);
  const [filterSubcategories, setFilterSubcategories] = useState<ApiTailorCategory[]>([]);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategoryId, setFilterCategoryId] = useState<string>('');
  const [filterSubcategoryId, setFilterSubcategoryId] = useState<string>('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState<GalleryImage | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDeleteImage, setPendingDeleteImage] = useState<GalleryImage | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [newImage, setNewImage] = useState({
    imageFile: null as File | null,
    imagePreview: '',
    title: '',
    description: '',
    categoryId: '',
    subcategoryId: '',
    tags: '',
    isPublic: false,
  });

  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string>('');

  useEffect(() => {
    tailorCategoriesService.getList().then((list) => setCategories(list.filter((c) => !c.parentId)));
  }, []);

  useEffect(() => {
    if (!filterCategoryId) {
      setFilterSubcategories([]);
      setFilterSubcategoryId('');
      return;
    }
    tailorCategoriesService.getList(filterCategoryId).then(setFilterSubcategories);
  }, [filterCategoryId]);

  useEffect(() => {
    if (newImage.categoryId) {
      tailorCategoriesService.getList(newImage.categoryId).then(setSubcategories);
    } else {
      setSubcategories([]);
    }
  }, [newImage.categoryId]);

  const loadImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await galleryService.getList({
        categoryId: filterCategoryId || undefined,
        subcategoryId: filterSubcategoryId || undefined,
      });
      setImages(list);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load gallery');
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, [filterCategoryId, filterSubcategoryId]);

  const handleNewImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      alert('Please upload a JPG, PNG or GIF image');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      alert(`Image must be under ${MAX_IMAGE_SIZE_MB}MB`);
      return;
    }
    setNewImage((prev) => ({ ...prev, imageFile: file, imagePreview: '' }));
    const reader = new FileReader();
    reader.onloadend = () => setNewImage((prev) => ({ ...prev, imagePreview: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleAddImage = async () => {
    if (!newImage.title.trim()) {
      alert('Please enter a title');
      return;
    }
    if (!newImage.imageFile) {
      alert('Please upload an image');
      return;
    }
    if (!newImage.categoryId || !newImage.subcategoryId) {
      alert('Please select category and subcategory');
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('image', newImage.imageFile);
      formData.append('title', newImage.title);
      formData.append('description', newImage.description);
      formData.append('categoryId', newImage.categoryId);
      formData.append('subcategoryId', newImage.subcategoryId);
      formData.append('tags', newImage.tags.trim());
      formData.append('isPublic', String(newImage.isPublic));
      await galleryService.createWithImage(formData);
      await loadImages();
      setShowUploadModal(false);
      setNewImage({
        imageFile: null,
        imagePreview: '',
        title: '',
        description: '',
        categoryId: categories[0]?.id ?? '',
        subcategoryId: '',
        tags: '',
        isPublic: false,
      });
    } catch (e) {
      alert(e instanceof ApiError ? e.message : 'Failed to upload image');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (image: GalleryImage) => {
    setSelectedImage(image);
    setEditImageFile(null);
    setEditImagePreview(image.imageUrl);
    setShowEditModal(true);
    tailorCategoriesService.getList(image.categoryId).then(setSubcategories);
  };

  const handleUpdateImage = async () => {
    if (!selectedImage) return;
    if (!selectedImage.title.trim() || !selectedImage.categoryId || !selectedImage.subcategoryId) {
      alert('Please fill in title, category and subcategory');
      return;
    }
    setSubmitting(true);
    try {
      if (editImageFile) {
        const formData = new FormData();
        formData.append('image', editImageFile);
        formData.append('title', selectedImage.title);
        formData.append('description', selectedImage.description || '');
        formData.append('categoryId', selectedImage.categoryId);
        formData.append('subcategoryId', selectedImage.subcategoryId);
        formData.append('tags', (selectedImage.tags || []).join(', '));
        formData.append('isPublic', String(selectedImage.isPublic));
        await galleryService.updateWithImage(selectedImage.id, formData);
      } else {
        await galleryService.update(selectedImage.id, {
          title: selectedImage.title,
          description: selectedImage.description || undefined,
          categoryId: selectedImage.categoryId,
          subcategoryId: selectedImage.subcategoryId,
          tags: selectedImage.tags?.length ? selectedImage.tags : undefined,
          isPublic: selectedImage.isPublic,
        });
      }
      await loadImages();
      setShowEditModal(false);
      setSelectedImage(null);
    } catch (e) {
      alert(e instanceof ApiError ? e.message : 'Failed to update image');
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteImageDialog = (image: GalleryImage) => {
    setPendingDeleteImage(image);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDeleteImage = async () => {
    if (!pendingDeleteImage) return;
    setDeleting(true);
    try {
      await galleryService.delete(pendingDeleteImage.id);
      await loadImages();
      setDeleteDialogOpen(false);
      setPendingDeleteImage(null);
    } catch (e) {
      alert(e instanceof ApiError ? e.message : 'Failed to delete image');
    } finally {
      setDeleting(false);
    }
  };

  const togglePublicStatus = async (image: GalleryImage) => {
    try {
      await galleryService.update(image.id, { isPublic: !image.isPublic });
      await loadImages();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : 'Failed to update visibility');
    }
  };

  const filteredImages = images.filter((img) => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    const title = img.title.toLowerCase();
    const desc = (img.description || '').toLowerCase();
    const tagsStr = (img.tags || []).join(' ').toLowerCase();
    return title.includes(q) || desc.includes(q) || tagsStr.includes(q);
  });

  const stats = {
    total: images.length,
    public: images.filter((img) => img.isPublic).length,
    private: images.filter((img) => !img.isPublic).length,
  };

  const categoryName = (img: GalleryImage) => img.category?.name ?? img.categoryId;
  const subcategoryName = (img: GalleryImage) => img.subcategory?.name ?? img.subcategoryId;
  const uploadedDate = (img: GalleryImage) => img.createdAt ? new Date(img.createdAt).toISOString().split('T')[0] : '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">My Gallery</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Upload and manage your design images privately
          </p>
        </div>
        <button
          onClick={() => {
            setNewImage((p) => ({ ...p, categoryId: p.categoryId || (categories[0]?.id ?? ''), subcategoryId: p.subcategoryId || '' }));
            setShowUploadModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Upload Image
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Images</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Private Images</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.private}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <EyeOff className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Public Images</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.public}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            (Future feature - not yet visible to customers)
          </p>
        </div>
      </div>

      {/* Filters and View Options */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            <select
              value={filterCategoryId}
              onChange={(e) => { setFilterCategoryId(e.target.value); setFilterSubcategoryId(''); }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <select
              value={filterSubcategoryId}
              onChange={(e) => setFilterSubcategoryId(e.target.value)}
              disabled={!filterCategoryId}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
            >
              <option value="">All Subcategories</option>
              {filterSubcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Display */}
      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">Loading gallery…</p>
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-12 text-center">
          <ImageIcon className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No images found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchQuery || filterCategoryId || filterSubcategoryId
              ? 'Try adjusting your filters'
              : 'Start by uploading your first design image'}
          </p>
          {!searchQuery && !filterCategoryId && !filterSubcategoryId && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Upload Image
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-square">
                <img
                  src={image.imageUrl}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => togglePublicStatus(image)}
                    className={`p-2 rounded-lg backdrop-blur-sm transition-colors ${
                      image.isPublic
                        ? 'bg-green-500/80 text-white'
                        : 'bg-gray-900/60 text-white'
                    }`}
                    title={image.isPublic ? 'Public (Future feature)' : 'Private'}
                  >
                    {image.isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{image.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {image.description || ''}
                </p>

                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                    {categoryName(image)}
                  </span>
                  {subcategoryName(image) && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                      {subcategoryName(image)}
                    </span>
                  )}
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {uploadedDate(image) ? new Date(uploadedDate(image)).toLocaleDateString('en-IN') : ''}
                  </span>
                </div>

                {(image.tags?.length ?? 0) > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {(image.tags || []).map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => openEditModal(image)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteImageDialog(image)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm border border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredImages.map((image) => (
                <tr key={image.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4">
                    <img
                      src={image.imageUrl}
                      alt={image.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{image.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{image.description || ''}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 w-fit">
                        {categoryName(image)}
                      </span>
                      {subcategoryName(image) && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 w-fit">
                          {subcategoryName(image)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {uploadedDate(image) ? new Date(uploadedDate(image)).toLocaleDateString('en-IN') : ''}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => togglePublicStatus(image)}
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        image.isPublic
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {image.isPublic ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {image.isPublic ? 'Public' : 'Private'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(image)}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteImageDialog(image)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Upload New Image</h2>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setNewImage({
                    imageFile: null,
                    imagePreview: '',
                    title: '',
                    description: '',
                    categoryId: categories[0]?.id ?? '',
                    subcategoryId: '',
                    tags: '',
                    isPublic: false,
                  });
                }}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Image <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                  {newImage.imagePreview || newImage.imageFile ? (
                    <div className="relative">
                      <img src={newImage.imagePreview || (newImage.imageFile && URL.createObjectURL(newImage.imageFile))} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => setNewImage((p) => ({ ...p, imageFile: null, imagePreview: '' }))}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Click to upload image (JPG/PNG/GIF, max 10MB)</span>
                      <input type="file" accept="image/jpeg,image/jpg,image/png,image/gif" onChange={handleNewImageFile} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={newImage.title}
                  onChange={(e) => setNewImage((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g., Silk Lehenga - Red & Gold"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea
                  value={newImage.description}
                  onChange={(e) => setNewImage((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Describe the design, fabric, work details..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category <span className="text-red-500">*</span></label>
                <select
                  value={newImage.categoryId}
                  onChange={(e) => setNewImage((p) => ({ ...p, categoryId: e.target.value, subcategoryId: '' }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {newImage.categoryId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subcategory <span className="text-red-500">*</span></label>
                  <select
                    value={newImage.subcategoryId}
                    onChange={(e) => setNewImage((p) => ({ ...p, subcategoryId: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select Subcategory</option>
                    {subcategories.map((sub) => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  value={newImage.tags}
                  onChange={(e) => setNewImage((p) => ({ ...p, tags: e.target.value }))}
                  placeholder="Wedding, Silk, Embroidery"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={newImage.isPublic}
                  onChange={(e) => setNewImage((p) => ({ ...p, isPublic: e.target.checked }))}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                />
                <div>
                  <label htmlFor="isPublic" className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer block mb-1">Make this image public</label>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Images marked as public may be visible to customers in the design gallery.</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAddImage}
                disabled={submitting || !newImage.imageFile || !newImage.title.trim() || !newImage.categoryId || !newImage.subcategoryId}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? 'Uploading…' : 'Upload Image'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Image</h2>
              <button onClick={() => { setShowEditModal(false); setSelectedImage(null); }} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image (optional: choose new file to replace)</label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                  {editImagePreview ? (
                    <div className="relative">
                      <img src={editImagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                      <button type="button" onClick={() => { setEditImageFile(null); setEditImagePreview(selectedImage.imageUrl); }} className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <img src={selectedImage.imageUrl} alt={selectedImage.title} className="w-full h-48 object-cover rounded-lg" />
                    </div>
                  )}
                  <label className="mt-2 inline-block text-sm text-blue-600 dark:text-blue-400 cursor-pointer">
                    Change image
                    <input type="file" accept="image/jpeg,image/jpg,image/png,image/gif" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f && ALLOWED_IMAGE_TYPES.includes(f.type)) { setEditImageFile(f); const r = new FileReader(); r.onloadend = () => setEditImagePreview(r.result as string); r.readAsDataURL(f); } }} />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={selectedImage.title}
                  onChange={(e) => setSelectedImage({ ...selectedImage, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea
                  value={selectedImage.description || ''}
                  onChange={(e) => setSelectedImage({ ...selectedImage, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category <span className="text-red-500">*</span></label>
                <select
                  value={selectedImage.categoryId}
                  onChange={(e) => { const id = e.target.value; setSelectedImage({ ...selectedImage, categoryId: id, subcategoryId: '' }); tailorCategoriesService.getList(id).then(setSubcategories); }}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {selectedImage.categoryId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subcategory <span className="text-red-500">*</span></label>
                  <select
                    value={selectedImage.subcategoryId}
                    onChange={(e) => setSelectedImage({ ...selectedImage, subcategoryId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select Subcategory</option>
                    {subcategories.map((sub) => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  value={(selectedImage.tags || []).join(', ')}
                  onChange={(e) => setSelectedImage({ ...selectedImage, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <input
                  type="checkbox"
                  id="editIsPublic"
                  checked={selectedImage.isPublic}
                  onChange={(e) => setSelectedImage({ ...selectedImage, isPublic: e.target.checked })}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                />
                <div>
                  <label htmlFor="editIsPublic" className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer block mb-1">Make this image public</label>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Images marked as public may be visible to customers.</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-3">
              <button onClick={() => { setShowEditModal(false); setSelectedImage(null); }} className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                Cancel
              </button>
              <button onClick={handleUpdateImage} disabled={submitting} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {submitting ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {showImagePreview && previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Image Preview</h2>
              <button onClick={() => { setShowImagePreview(false); setPreviewImage(null); }} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div><img src={previewImage.imageUrl} alt={previewImage.title} className="w-full h-48 object-cover rounded-lg" /></div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                <p className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">{previewImage.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <p className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">{previewImage.description || ''}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                <p className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">{categoryName(previewImage)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subcategory</label>
                <p className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">{subcategoryName(previewImage)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</label>
                <p className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">{(previewImage.tags || []).join(', ')}</p>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <span className="text-sm font-medium text-gray-900 dark:text-white">{previewImage.isPublic ? 'Public' : 'Private'}</span>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end">
              <button onClick={() => { setShowImagePreview(false); setPreviewImage(null); }} className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">Close</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => { setDeleteDialogOpen(open); if (!open) setPendingDeleteImage(null); }}
        title="Delete image"
        description={pendingDeleteImage ? `Are you sure you want to delete "${pendingDeleteImage.title}"? This action cannot be undone.` : 'Are you sure you want to delete this image? This action cannot be undone.'}
        onConfirm={handleConfirmDeleteImage}
        isLoading={deleting}
      />
    </div>
  );
}