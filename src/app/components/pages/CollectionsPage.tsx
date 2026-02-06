import { Plus, Search, SlidersHorizontal, Grid3x3, ArrowUpDown, ArrowLeft, X, Package } from 'lucide-react';
import { useState } from 'react';
import { AddCollectionModal } from '../AddCollectionModal';

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  stock: number;
  status: string;
  image?: string;
}

interface Collection {
  id: number;
  title: string;
  products: number;
  conditions: string;
  icon: string;
  productIds: number[];
}

export function CollectionsPage() {
  const [selectedCollections, setSelectedCollections] = useState<number[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewingCollection, setViewingCollection] = useState<Collection | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddProducts, setShowAddProducts] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  // Available products (from ProductsPage structure)
  const allProducts: Product[] = [
    { id: 1, name: 'Classic Sherwani', category: 'Wedding Wear', price: '₹25,999', stock: 24, status: 'In Stock' },
    { id: 2, name: 'Bridal Lehenga', category: 'Wedding Wear', price: '₹45,999', stock: 8, status: 'In Stock' },
    { id: 3, name: 'Cotton Kurta', category: 'Casual Wear', price: '₹1,499', stock: 156, status: 'In Stock' },
    { id: 4, name: 'Designer Blazer', category: 'Formal Wear', price: '₹12,999', stock: 3, status: 'Low Stock' },
    { id: 5, name: 'Silk Saree', category: 'Traditional Wear', price: '₹8,999', stock: 45, status: 'In Stock' },
    { id: 6, name: 'Embroidered Kurta', category: 'Festive Wear', price: '₹3,499', stock: 67, status: 'In Stock' },
    { id: 7, name: 'Patola Saree', category: 'Traditional Wear', price: '₹15,999', stock: 12, status: 'In Stock' },
    { id: 8, name: 'Men\'s Kurta Pajama', category: 'Festive Wear', price: '₹2,999', stock: 89, status: 'In Stock' },
    { id: 9, name: 'Designer Anarkali', category: 'Wedding Wear', price: '₹18,999', stock: 15, status: 'In Stock' },
    { id: 10, name: 'Formal Shirt', category: 'Formal Wear', price: '₹1,999', stock: 120, status: 'In Stock' },
    { id: 11, name: 'Palazzo Suit', category: 'Casual Wear', price: '₹2,499', stock: 56, status: 'In Stock' },
    { id: 12, name: 'Wedding Sherwani Set', category: 'Wedding Wear', price: '₹35,999', stock: 6, status: 'In Stock' },
  ];

  const [collections, setCollections] = useState<Collection[]>([
    { id: 1, title: 'Summer Collections', products: 45, conditions: 'All products', icon: '📦', productIds: [1, 3, 6] },
    { id: 2, title: 'Wedding Special', products: 128, conditions: 'Category: Wedding Wear', icon: '💍', productIds: [1, 2, 9, 12] },
    { id: 3, title: 'Festive Wear', products: 89, conditions: 'Tag: Festival', icon: '🎊', productIds: [6, 8] },
    { id: 4, title: 'Ethnic Collections', products: 156, conditions: 'Category: Ethnic Wear', icon: '🪔', productIds: [5, 7] },
    { id: 5, title: 'Bridal Lehenga Collection', products: 67, conditions: 'Type: Lehenga', icon: '👰', productIds: [2] },
    { id: 6, title: 'Men\'s Sherwanis', products: 92, conditions: 'Category: Wedding Wear, Gender: Male', icon: '🤵', productIds: [1, 12] },
    { id: 7, title: 'Designer Sarees', products: 134, conditions: 'Type: Saree', icon: '🥻', productIds: [5, 7] },
    { id: 8, title: 'Casual Kurtas', products: 201, conditions: 'Category: Casual Wear', icon: '👔', productIds: [3, 11] },
    { id: 9, title: 'Diwali Special', products: 78, conditions: 'Tag: Diwali', icon: '🪔', productIds: [6, 8] },
    { id: 10, title: 'Office Wear', products: 43, conditions: 'Category: Formal Wear', icon: '💼', productIds: [4, 10] },
  ]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCollections(collections.map(c => c.id));
    } else {
      setSelectedCollections([]);
    }
  };

  const handleSelectCollection = (id: number) => {
    if (selectedCollections.includes(id)) {
      setSelectedCollections(selectedCollections.filter(cId => cId !== id));
    } else {
      setSelectedCollections([...selectedCollections, id]);
    }
  };

  const handleAddProducts = () => {
    if (viewingCollection && selectedProducts.length > 0) {
      setCollections(collections.map(c => {
        if (c.id === viewingCollection.id) {
          const newProductIds = [...new Set([...c.productIds, ...selectedProducts])];
          return { ...c, productIds: newProductIds, products: newProductIds.length };
        }
        return c;
      }));
      setSelectedProducts([]);
      setShowAddProducts(false);
    }
  };

  const handleRemoveProduct = (productId: number) => {
    if (viewingCollection) {
      setCollections(collections.map(c => {
        if (c.id === viewingCollection.id) {
          const newProductIds = c.productIds.filter(id => id !== productId);
          return { ...c, productIds: newProductIds, products: newProductIds.length };
        }
        return c;
      }));
      // Update viewingCollection state
      const updatedCollection = collections.find(c => c.id === viewingCollection.id);
      if (updatedCollection) {
        setViewingCollection({
          ...updatedCollection,
          productIds: updatedCollection.productIds.filter(id => id !== productId)
        });
      }
    }
  };

  const toggleProductSelection = (productId: number) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const allSelected = selectedCollections.length === collections.length;
  const someSelected = selectedCollections.length > 0 && selectedCollections.length < collections.length;

  // Get products for current collection
  const getCollectionProducts = (collection: Collection): Product[] => {
    return allProducts.filter(p => collection.productIds.includes(p.id));
  };

  // Get available products (not in current collection)
  const getAvailableProducts = (): Product[] => {
    if (!viewingCollection) return allProducts;
    return allProducts.filter(p => !viewingCollection.productIds.includes(p.id));
  };

  const filteredAvailableProducts = getAvailableProducts().filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Collection Detail View
  if (viewingCollection) {
    const collectionProducts = getCollectionProducts(viewingCollection);

    return (
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => setViewingCollection(null)}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Collections
          </button>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">{viewingCollection.title}</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
              {viewingCollection.icon}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{viewingCollection.title}</h2>
              <p className="text-sm text-gray-600 mt-1">{collectionProducts.length} products</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddProducts(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Products
          </button>
        </div>

        {/* Products Grid */}
        <div className="bg-white rounded-lg shadow">
          {collectionProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Package className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-900 font-medium mb-1">No products in this collection</p>
              <p className="text-gray-600 text-sm mb-4">Add products to get started</p>
              <button
                onClick={() => setShowAddProducts(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Products
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {collectionProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-gray-400" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{product.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.stock}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.status === 'In Stock'
                            ? 'bg-green-100 text-green-800'
                            : product.status === 'Low Stock'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          onClick={() => handleRemoveProduct(product.id)}
                          className="text-red-600 hover:text-red-900 font-medium"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Products Modal */}
        {showAddProducts && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 z-10">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Add Products to Collection</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowAddProducts(false);
                    setSelectedProducts([]);
                    setSearchTerm('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Search */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Products List */}
              <div className="p-6">
                {filteredAvailableProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">
                      {searchTerm ? 'No products found matching your search' : 'All products are already in this collection'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {filteredAvailableProducts.map((product) => (
                      <label
                        key={product.id}
                        className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => toggleProductSelection(product.id)}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.category}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-medium text-gray-900">{product.price}</p>
                          <p className="text-sm text-gray-600">{product.stock} in stock</p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 sticky bottom-0">
                <button
                  onClick={() => {
                    setShowAddProducts(false);
                    setSelectedProducts([]);
                    setSearchTerm('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProducts}
                  disabled={selectedProducts.length === 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add {selectedProducts.length} Product{selectedProducts.length !== 1 ? 's' : ''}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Collections List View
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Grid3x3 className="w-6 h-6 text-gray-700" />
          <h2 className="text-2xl font-semibold text-gray-900">Collections</h2>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Add collection
        </button>
      </div>

      {/* Tabs and Filters */}
      <div className="bg-white rounded-lg shadow">
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm font-medium text-gray-900 bg-gray-100 rounded-md">
              All
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-md">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-md">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-md">
              <SlidersHorizontal className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-md">
              <ArrowUpDown className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-12 px-6 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(input) => {
                      if (input) {
                        input.indeterminate = someSelected;
                      }
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product conditions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {collections.map((collection) => (
                <tr 
                  key={collection.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setViewingCollection(collection)}
                >
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedCollections.includes(collection.id)}
                      onChange={() => handleSelectCollection(collection.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                        {collection.icon}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{collection.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {collection.productIds.length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {collection.conditions}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Learn more about collections
          </button>
        </div>
      </div>

      {/* Add Collection Modal */}
      <AddCollectionModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}
