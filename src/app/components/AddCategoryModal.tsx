import { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Search, Package } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  stock: number;
  image?: string;
}

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: any) => void;
  availableProducts: Product[];
  editingCategory?: {
    id: number;
    name: string;
    headline: string;
    description: string;
    thumbnail?: string;
    products: number;
    status: string;
    selectedProductIds?: number[];
  } | null;
}

export function AddCategoryModal({ isOpen, onClose, onSave, availableProducts, editingCategory }: AddCategoryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    headline: '',
    description: '',
    status: 'Active',
  });
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Pre-fill form when editing
  useEffect(() => {
    if (editingCategory) {
      setFormData({
        name: editingCategory.name,
        headline: editingCategory.headline || '',
        description: editingCategory.description,
        status: editingCategory.status,
      });
      setThumbnail(editingCategory.thumbnail || null);
      setSelectedProductIds(editingCategory.selectedProductIds || []);
    } else {
      // Reset form when not editing
      setFormData({
        name: '',
        headline: '',
        description: '',
        status: 'Active',
      });
      setThumbnail(null);
      setSelectedProductIds([]);
    }
  }, [editingCategory, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const categoryData = {
      ...formData,
      thumbnail,
      id: editingCategory?.id || Date.now(),
      products: selectedProductIds.length,
      selectedProductIds,
    };
    onSave(categoryData);
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductSelection = (productId: number) => {
    if (selectedProductIds.includes(productId)) {
      setSelectedProductIds(selectedProductIds.filter(id => id !== productId));
    } else {
      setSelectedProductIds([...selectedProductIds, productId]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center overflow-y-auto py-8">
      <div className="bg-gray-50 w-full max-w-4xl mx-4 rounded-lg shadow-xl">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 rounded-t-lg">
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold text-gray-900">
              {editingCategory ? 'Edit category' : 'Add category'}
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
              {editingCategory ? 'Update Category' : 'Save Category'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Wedding Wear"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={formData.headline}
                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                    placeholder="e.g., Elegant Wedding Collection"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">A catchy headline to display for this category</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of this category"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
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
                    <option value="Service">Service</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Thumbnail Image */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Thumbnail Image</h3>
              <p className="text-xs text-gray-500 mb-4">Add a category thumbnail image (recommended size: 800x600px)</p>
              
              {thumbnail ? (
                <div className="relative">
                  <img
                    src={thumbnail}
                    alt="Category thumbnail"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setThumbnail(null)}
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
                    <label htmlFor="category-image" className="cursor-pointer">
                      <span className="text-blue-600 hover:text-blue-700 font-medium">
                        Click to upload
                      </span>
                      <span className="text-gray-500"> or drag and drop</span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
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

            {/* Product Selection */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Product Selection</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                  {selectedProductIds.length} selected
                </span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Search className="w-5 h-5 text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Search products"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {availableProducts
                    .filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(product => (
                      <div
                        key={product.id}
                        className={`border-2 rounded-lg p-2 cursor-pointer ${
                          selectedProductIds.includes(product.id) ? 'border-blue-500' : 'border-gray-300'
                        }`}
                        onClick={() => handleProductSelection(product.id)}
                      >
                        <div className="relative">
                          <img
                            src={product.image || 'https://via.placeholder.com/150'}
                            alt={product.name}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          {selectedProductIds.includes(product.id) && (
                            <div className="absolute top-2 right-2 p-2 bg-blue-500 text-white rounded-lg">
                              <Package className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mt-2">{product.name}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}