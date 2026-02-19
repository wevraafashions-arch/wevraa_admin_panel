import { X, Bold, Italic, Underline, ChevronDown, Search, Image as ImageIcon, Tag, Loader2, Package } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { collectionsService } from '../api/services/collectionsService';
import { productsService } from '../api/services/productsService';
import type { Product } from '../api/types/product';
import { ApiError } from '../api/client';

interface AddCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export function AddCollectionModal({ isOpen, onClose, onCreated }: AddCollectionModalProps) {
  const [collectionType, setCollectionType] = useState<'MANUAL' | 'SMART'>('MANUAL');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [themeTemplate, setThemeTemplate] = useState('default');
  const [salesChannels, setSalesChannels] = useState({
    onlineStore: false,
    pointOfSale: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Products: fetch list, search, sort, selected for collection
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [productSort, setProductSort] = useState<'title' | 'mrp' | 'newest'>('title');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      const list = await productsService.getList();
      setProducts(Array.isArray(list) ? list : []);
    } catch {
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen, fetchProducts]);

  const filteredAndSortedProducts = products
    .filter(
      (p) =>
        !productSearch.trim() ||
        p.title?.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.sku?.toLowerCase().includes(productSearch.toLowerCase())
    )
    .sort((a, b) => {
      if (productSort === 'title') return (a.title ?? '').localeCompare(b.title ?? '');
      if (productSort === 'mrp') return (a.mrp ?? 0) - (b.mrp ?? 0);
      return (new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());
    });

  const toggleProduct = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCollectionType('MANUAL');
    setThemeTemplate('default');
    setSalesChannels({ onlineStore: false, pointOfSale: false });
    setProductSearch('');
    setProductSort('title');
    setSelectedProductIds([]);
    removeImage();
    setError(null);
  };

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be under 5 MB');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDiscard = () => {
    resetForm();
    onClose();
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const common = {
        title: title.trim(),
        description: description.trim() || undefined,
        type: collectionType,
        themeTemplate: themeTemplate || undefined,
        publishOnlineStore: salesChannels.onlineStore,
        publishPOS: salesChannels.pointOfSale,
        productIds: selectedProductIds.length > 0 ? selectedProductIds : undefined,
      };
      if (imageFile) {
        await collectionsService.createWithImage({
          ...common,
          image: imageFile,
        });
      } else {
        await collectionsService.create(common);
      }

      resetForm();
      onCreated?.();
      onClose();
    } catch (e) {
      const message =
        e instanceof ApiError ? e.message : 'Failed to create collection';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center overflow-y-auto">
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen w-full py-4 px-4 md:px-6">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleDiscard}
                disabled={saving}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add collection</h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDiscard}
                disabled={saving}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Discard
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !title.trim()}
                className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg flex justify-between items-center">
              <span>{error}</span>
              <button type="button" onClick={() => setError(null)} className="text-red-600 dark:text-red-400 hover:underline font-medium text-sm">
                Dismiss
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Summer collection, Under ₹100, Staff picks"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Description
              </label>
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg">
                {/* Rich Text Toolbar */}
                <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <select className="px-2 py-1 text-sm border-none bg-transparent text-gray-700 dark:text-gray-300">
                    <option>Paragraph</option>
                    <option>Heading 1</option>
                    <option>Heading 2</option>
                  </select>
                  <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                  <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
                    <Bold className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
                    <Italic className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
                    <Underline className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded flex items-center gap-1">
                    <span className="text-sm text-gray-700 dark:text-gray-300">A</span>
                    <ChevronDown className="w-3 h-3 text-gray-700 dark:text-gray-300" />
                  </button>
                </div>
                {/* Text Area */}
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-3 min-h-[120px] focus:outline-none resize-none bg-transparent text-gray-900 dark:text-white"
                  placeholder="Start typing..."
                />
              </div>
            </div>

            {/* Collection Type */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Collection type</h3>

              <div className="space-y-4">
                {/* Manual */}
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    id="manual"
                    name="collectionType"
                    checked={collectionType === 'MANUAL'}
                    onChange={() => setCollectionType('MANUAL')}
                    className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <label htmlFor="manual" className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                      Manual
                    </label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Add products to this collection one by one. Learn more about{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-700">manual collections</a>.
                    </p>
                  </div>
                </div>

                {/* Smart */}
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    id="smart"
                    name="collectionType"
                    checked={collectionType === 'SMART'}
                    onChange={() => setCollectionType('SMART')}
                    className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <label htmlFor="smart" className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                      Smart
                    </label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Existing and future products that match the conditions you set will automatically be added to this collection. Learn more about{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-700">smart collections</a>.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                Products {selectedProductIds.length > 0 && `(${selectedProductIds.length} selected)`}
              </h3>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by title or SKU..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <select
                  value={productSort}
                  onChange={(e) => setProductSort(e.target.value as 'title' | 'mrp' | 'newest')}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[160px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="title">Sort: Title A–Z</option>
                  <option value="mrp">Sort: Price (Low to High)</option>
                  <option value="newest">Sort: Newest</option>
                </select>
              </div>

              {productsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              ) : filteredAndSortedProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Tag className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-gray-900 dark:text-white font-medium mb-1">
                    {products.length === 0 ? 'No products in store yet.' : 'No products match your search.'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {products.length === 0 ? 'Add products first, then they will appear here.' : 'Try a different search or sort.'}
                  </p>
                </div>
              ) : (
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg divide-y divide-gray-200 dark:divide-gray-600 max-h-[320px] overflow-y-auto">
                  {filteredAndSortedProducts.map((product) => {
                    const isSelected = selectedProductIds.includes(product.id);
                    const thumb = product.media?.[0]?.url;
                    return (
                      <label
                        key={product.id}
                        className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleProduct(product.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="w-10 h-10 rounded bg-gray-200 dark:bg-gray-600 flex-shrink-0 overflow-hidden">
                          {thumb ? (
                            <img src={thumb} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {product.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {product.sku && `SKU: ${product.sku}`}
                            {product.sku && product.mrp != null && ' · '}
                            {product.mrp != null && `₹${product.mrp}`}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Publishing */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Publishing</h3>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">Sales channels</p>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={salesChannels.onlineStore}
                      onChange={(e) => setSalesChannels({ ...salesChannels, onlineStore: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Online Store</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={salesChannels.pointOfSale}
                      onChange={(e) => setSalesChannels({ ...salesChannels, pointOfSale: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Point of Sale</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Image</h3>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Collection preview"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1 bg-white dark:bg-gray-800 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const file = e.dataTransfer.files?.[0];
                    if (file && file.type.startsWith('image/')) {
                      if (file.size > 5 * 1024 * 1024) {
                        setError('Image must be under 5 MB');
                        return;
                      }
                      setImageFile(file);
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors cursor-pointer"
                >
                  <button
                    type="button"
                    className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors mb-2 text-gray-700 dark:text-gray-300"
                  >
                    Add image
                  </button>
                  <p className="text-sm text-gray-500 dark:text-gray-400">or drop an image to upload</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Max 5 MB</p>
                </div>
              )}
            </div>

            {/* Theme Template */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Theme template</h3>

              <select
                value={themeTemplate}
                onChange={(e) => setThemeTemplate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="default">Default collection</option>
                <option value="featured">Featured collection</option>
                <option value="grid">Grid collection</option>
                <option value="list">List collection</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
