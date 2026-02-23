import { useState } from 'react';
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
  Download
} from 'lucide-react';
import { useTailorCategories } from '@/contexts/TailorCategoriesContext';
import { ConfirmDeleteDialog } from '../ui/ConfirmDeleteDialog';

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  tags: string[];
  uploadedDate: string;
  isPublic: boolean;
  tailorId: string;
  tailorName: string;
  views: number;
  likes: number;
}

// Mock current tailor (in real app, this would come from auth context)
const CURRENT_TAILOR = {
  id: 'T001',
  name: 'Rajesh Kumar',
};

export function TailorGalleryPage() {
  const { getActiveCategories, getActiveCategoriesWithSubs, subCategoriesData, loadSubCategories } = useTailorCategories();
  const activeCategories = getActiveCategories();
  const categoriesWithSubs = getActiveCategoriesWithSubs();
  
  const [images, setImages] = useState<GalleryImage[]>([
    {
      id: 'IMG001',
      url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800',
      title: 'Silk Lehenga - Red & Gold',
      description: 'Beautiful red silk lehenga with golden embroidery work',
      category: 'Topwear',
      subcategory: 'Ghagra',
      tags: ['Wedding', 'Silk', 'Embroidery'],
      uploadedDate: '2025-01-10',
      isPublic: false,
      tailorId: 'T001',
      tailorName: 'Rajesh Kumar',
      views: 0,
      likes: 0,
    },
    {
      id: 'IMG002',
      url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800',
      title: 'Designer Blouse - Green',
      description: 'Elegant green designer blouse with mirror work',
      category: 'Blouse',
      subcategory: 'Katori Blouse',
      tags: ['Designer', 'Mirror Work', 'Festive'],
      uploadedDate: '2025-01-12',
      isPublic: false,
      tailorId: 'T001',
      tailorName: 'Rajesh Kumar',
      views: 0,
      likes: 0,
    },
    {
      id: 'IMG003',
      url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e9?w=800',
      title: 'Anarkali Suit - Pink',
      description: 'Pink anarkali suit with pearl detailing',
      category: 'Topwear',
      subcategory: 'Gown',
      tags: ['Party Wear', 'Pearl Work'],
      uploadedDate: '2025-01-14',
      isPublic: false,
      tailorId: 'T001',
      tailorName: 'Rajesh Kumar',
      views: 0,
      likes: 0,
    },
  ]);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState<GalleryImage | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDeleteImageId, setPendingDeleteImageId] = useState<string | null>(null);

  // Get first category for default
  const defaultCategory = activeCategories.length > 0 ? activeCategories[0].name : '';
  
  // Form states for new upload
  const [newImage, setNewImage] = useState({
    url: '',
    title: '',
    description: '',
    category: defaultCategory,
    subcategory: '',
    tags: '',
    isPublic: false,
  });

  // Get subcategories for selected category
  const getSubcategoriesForCategory = (categoryName: string) => {
    const category = activeCategories.find(cat => cat.name === categoryName);
    if (!category) return [];
    return (subCategoriesData[category.id] || []).filter(sub => sub.status === 'Active');
  };

  // Update subcategories when category changes in new image form
  const handleCategoryChange = (categoryName: string) => {
    const cat = activeCategories.find(c => c.name === categoryName);
    if (cat) loadSubCategories(cat.id);
    setNewImage({ ...newImage, category: categoryName, subcategory: '' });
  };

  // Update subcategories when category changes in edit form
  const handleEditCategoryChange = (categoryName: string) => {
    const cat = activeCategories.find(c => c.name === categoryName);
    if (cat) loadSubCategories(cat.id);
    if (selectedImage) {
      setSelectedImage({ ...selectedImage, category: categoryName, subcategory: '' });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage({ ...newImage, url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImage = () => {
    if (!newImage.url || !newImage.title) {
      alert('Please provide at least an image and title');
      return;
    }

    const image: GalleryImage = {
      id: `IMG${String(images.length + 1).padStart(3, '0')}`,
      url: newImage.url,
      title: newImage.title,
      description: newImage.description,
      category: newImage.category,
      subcategory: newImage.subcategory,
      tags: newImage.tags.split(',').map(t => t.trim()).filter(t => t),
      uploadedDate: new Date().toISOString().split('T')[0],
      isPublic: newImage.isPublic,
      tailorId: CURRENT_TAILOR.id,
      tailorName: CURRENT_TAILOR.name,
      views: 0,
      likes: 0,
    };

    setImages([image, ...images]);
    setShowUploadModal(false);
    setNewImage({
      url: '',
      title: '',
      description: '',
      category: defaultCategory,
      subcategory: '',
      tags: '',
      isPublic: false,
    });
  };

  const handleUpdateImage = () => {
    if (!selectedImage) return;

    setImages(images.map(img => 
      img.id === selectedImage.id ? selectedImage : img
    ));
    setShowEditModal(false);
    setSelectedImage(null);
  };

  const openDeleteImageDialog = (imageId: string) => {
    setPendingDeleteImageId(imageId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDeleteImage = () => {
    if (pendingDeleteImageId) {
      setImages(images.filter(img => img.id !== pendingDeleteImageId));
      setDeleteDialogOpen(false);
      setPendingDeleteImageId(null);
    }
  };

  const togglePublicStatus = (imageId: string) => {
    setImages(images.map(img =>
      img.id === imageId ? { ...img, isPublic: !img.isPublic } : img
    ));
  };

  // Filter images
  const filteredImages = images.filter(img => {
    const matchesSearch = img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         img.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         img.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || img.category === selectedCategory;
    const isMine = img.tailorId === CURRENT_TAILOR.id;
    
    return matchesSearch && matchesCategory && isMine;
  });

  const stats = {
    total: images.filter(img => img.tailorId === CURRENT_TAILOR.id).length,
    public: images.filter(img => img.tailorId === CURRENT_TAILOR.id && img.isPublic).length,
    private: images.filter(img => img.tailorId === CURRENT_TAILOR.id && !img.isPublic).length,
  };

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
          onClick={() => setShowUploadModal(true)}
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
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Categories</option>
              {activeCategories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
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
      {filteredImages.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-12 text-center">
          <ImageIcon className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No images found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchQuery || selectedCategory !== 'all'
              ? 'Try adjusting your filters'
              : 'Start by uploading your first design image'}
          </p>
          {!searchQuery && selectedCategory === 'all' && (
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
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => togglePublicStatus(image.id)}
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
                  {image.description}
                </p>

                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                    {image.category}
                  </span>
                  {image.subcategory && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                      {image.subcategory}
                    </span>
                  )}
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(image.uploadedDate).toLocaleDateString('en-IN')}
                  </span>
                </div>

                {image.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {image.tags.map((tag, idx) => (
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
                    onClick={() => {
                      setSelectedImage(image);
                      setShowEditModal(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteImageDialog(image.id)}
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
                      src={image.url}
                      alt={image.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{image.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{image.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 w-fit">
                        {image.category}
                      </span>
                      {image.subcategory && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 w-fit">
                          {image.subcategory}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(image.uploadedDate).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => togglePublicStatus(image.id)}
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
                        onClick={() => {
                          setSelectedImage(image);
                          setShowEditModal(true);
                        }}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteImageDialog(image.id)}
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
                    url: '',
                    title: '',
                    description: '',
                    category: defaultCategory,
                    subcategory: '',
                    tags: '',
                    isPublic: false,
                  });
                }}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <Upload className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Image <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                  {newImage.url ? (
                    <div className="relative">
                      <img src={newImage.url} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                      <button
                        onClick={() => setNewImage({ ...newImage, url: '' })}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Click to upload image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newImage.title}
                  onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                  placeholder="e.g., Silk Lehenga - Red & Gold"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newImage.description}
                  onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                  placeholder="Describe the design, fabric, work details..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={newImage.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {activeCategories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Subcategory */}
              {newImage.category && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subcategory
                  </label>
                  <select
                    value={newImage.subcategory}
                    onChange={(e) => setNewImage({ ...newImage, subcategory: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select Subcategory</option>
                    {getSubcategoriesForCategory(newImage.category).map(sub => (
                      <option key={sub.id} value={sub.name}>{sub.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newImage.tags}
                  onChange={(e) => setNewImage({ ...newImage, tags: e.target.value })}
                  placeholder="Wedding, Silk, Embroidery"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Public/Private */}
              <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={newImage.isPublic}
                  onChange={(e) => setNewImage({ ...newImage, isPublic: e.target.checked })}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                />
                <div>
                  <label htmlFor="isPublic" className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer block mb-1">
                    Make this image public
                  </label>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    (Future feature - images marked as public will be visible to customers in the design gallery)
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setNewImage({
                    url: '',
                    title: '',
                    description: '',
                    category: defaultCategory,
                    subcategory: '',
                    tags: '',
                    isPublic: false,
                  });
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddImage}
                disabled={!newImage.url || !newImage.title}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                Upload Image
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
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedImage(null);
                }}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <Upload className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <img src={selectedImage.url} alt={selectedImage.title} className="w-full h-48 object-cover rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={selectedImage.title}
                  onChange={(e) => setSelectedImage({ ...selectedImage, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea
                  value={selectedImage.description}
                  onChange={(e) => setSelectedImage({ ...selectedImage, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                <select
                  value={selectedImage.category}
                  onChange={(e) => handleEditCategoryChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {activeCategories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Subcategory */}
              {selectedImage.category && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subcategory
                  </label>
                  <select
                    value={selectedImage.subcategory}
                    onChange={(e) => setSelectedImage({ ...selectedImage, subcategory: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select Subcategory</option>
                    {getSubcategoriesForCategory(selectedImage.category).map(sub => (
                      <option key={sub.id} value={sub.name}>{sub.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</label>
                <input
                  type="text"
                  value={selectedImage.tags.join(', ')}
                  onChange={(e) => setSelectedImage({ 
                    ...selectedImage, 
                    tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                  })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                  <label htmlFor="editIsPublic" className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer block mb-1">
                    Make this image public
                  </label>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    (Future feature - images marked as public will be visible to customers)
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedImage(null);
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateImage}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
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
              <button
                onClick={() => {
                  setShowImagePreview(false);
                  setPreviewImage(null);
                }}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <Upload className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <img src={previewImage.url} alt={previewImage.title} className="w-full h-48 object-cover rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                <p className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  {previewImage.title}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <p className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  {previewImage.description}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                <p className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  {previewImage.category}
                </p>
              </div>

              {/* Subcategory */}
              {previewImage.subcategory && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subcategory
                  </label>
                  <p className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    {previewImage.subcategory}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</label>
                <p className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  {previewImage.tags.join(', ')}
                </p>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <input
                  type="checkbox"
                  id="previewIsPublic"
                  checked={previewImage.isPublic}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                />
                <div>
                  <label htmlFor="previewIsPublic" className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer block mb-1">
                    Make this image public
                  </label>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    (Future feature - images marked as public will be visible to customers)
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowImagePreview(false);
                  setPreviewImage(null);
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setPendingDeleteImageId(null);
        }}
        title="Delete image"
        description="Are you sure you want to delete this image? This action cannot be undone."
        onConfirm={handleConfirmDeleteImage}
      />
    </div>
  );
}