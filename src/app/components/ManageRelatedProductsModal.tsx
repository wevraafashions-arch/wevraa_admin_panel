import { X, Search, Plus, Trash2, Package, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  stock: number;
  status: string;
  image?: string;
  relatedProductIds?: number[];
}

interface ManageRelatedProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  allProducts: Product[];
  onSave: (productId: number, relatedIds: number[]) => void;
}

export function ManageRelatedProductsModal({
  isOpen,
  onClose,
  product,
  allProducts,
  onSave
}: ManageRelatedProductsModalProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'category'>('all');

  // Update selectedIds when product changes or modal opens
  useEffect(() => {
    if (isOpen && product) {
      setSelectedIds(product.relatedProductIds || []);
      setSearchTerm('');
      setFilterMode('all');
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  // Get available products to add (excluding current product and already selected ones)
  const availableProducts = allProducts.filter(p => {
    if (p.id === product.id) return false;
    if (selectedIds.includes(p.id)) return false;
    if (filterMode === 'category' && p.category !== product.category) return false;
    if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Get currently selected related products
  const selectedProducts = allProducts.filter(p => selectedIds.includes(p.id));

  const handleAddProduct = (productId: number) => {
    setSelectedIds([...selectedIds, productId]);
  };

  const handleRemoveProduct = (productId: number) => {
    setSelectedIds(selectedIds.filter(id => id !== productId));
  };

  const handleSave = () => {
    onSave(product.id, selectedIds);
    onClose();
  };

  const handleAutoSelect = () => {
    // Auto-select products from same category
    const categoryProducts = allProducts
      .filter(p => p.id !== product.id && p.category === product.category)
      .slice(0, 4)
      .map(p => p.id);
    setSelectedIds(categoryProducts);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Manage Related Products</h2>
            <p className="text-sm text-purple-100 mt-1">for: {product.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Current Product Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-center gap-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 rounded-lg object-cover border-2 border-blue-400"
            />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{product.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{product.category} • {product.price}</p>
            </div>
          </div>

          {/* Selected Related Products */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Selected Related Products ({selectedIds.length})
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  These products will be shown as related to this product
                </p>
              </div>
              <button
                onClick={handleAutoSelect}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                Auto-select by Category
              </button>
            </div>

            {selectedProducts.length === 0 ? (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                <Package className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No related products selected</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Add products from the list below
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 hover:shadow-md transition-shadow"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                        {p.name}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {p.category} • {p.price}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveProduct(p.id)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Products Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add Related Products
            </h3>

            {/* Search and Filter */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterMode('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterMode === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  All Products
                </button>
                <button
                  onClick={() => setFilterMode('category')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterMode === 'category'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Same Category
                </button>
              </div>
            </div>

            {/* Available Products */}
            {availableProducts.length === 0 ? (
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-8 text-center">
                <Package className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No products available to add</p>
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto space-y-2 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                {availableProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                        {p.name}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {p.category} • {p.price}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAddProduct(p.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between bg-gray-50 dark:bg-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {selectedIds.length} related product{selectedIds.length !== 1 ? 's' : ''} selected
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Check className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}