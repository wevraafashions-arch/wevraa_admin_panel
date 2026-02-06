import { Plus, Search, Filter, Copy } from 'lucide-react';
import { useState } from 'react';
import { AddProductModal } from '../AddProductModal';
import { ProductDetailModal } from '../ProductDetailModal';
import { ManageRelatedProductsModal } from '../ManageRelatedProductsModal';

export function ProductsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<typeof products[0] | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isManageRelatedOpen, setIsManageRelatedOpen] = useState(false);

  const [products, setProducts] = useState([
    { id: 1, name: 'Classic Sherwani', category: 'Wedding Wear', price: '₹25,999', stock: 24, status: 'In Stock', image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=100', rating: 4.5, reviews: 89, relatedProductIds: [2, 9] },
    { id: 2, name: 'Bridal Lehenga', category: 'Wedding Wear', price: '₹45,999', stock: 8, status: 'In Stock', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=100', rating: 4.8, reviews: 142, relatedProductIds: [1, 9] },
    { id: 3, name: 'Cotton Kurta', category: 'Casual Wear', price: '₹1,499', stock: 156, status: 'In Stock', image: 'https://images.unsplash.com/photo-1617210933620-8b0ec4e1c6e8?w=100', rating: 4.2, reviews: 256, relatedProductIds: [6] },
    { id: 4, name: 'Designer Blazer', category: 'Formal Wear', price: '₹12,999', stock: 3, status: 'Low Stock', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=100', rating: 4.6, reviews: 67, relatedProductIds: [8] },
    { id: 5, name: 'Silk Saree', category: 'Traditional Wear', price: '₹8,999', stock: 0, status: 'Out of Stock', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=100', rating: 4.9, reviews: 203, relatedProductIds: [10] },
    { id: 6, name: 'Casual Chinos', category: 'Casual Wear', price: '₹2,499', stock: 67, status: 'In Stock', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=100', rating: 4.0, reviews: 112, relatedProductIds: [3] },
    { id: 7, name: 'Nehru Jacket', category: 'Ethnic Wear', price: '₹5,999', stock: 15, status: 'In Stock', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=100', rating: 4.4, reviews: 78, relatedProductIds: [] },
    { id: 8, name: 'Formal Shirt', category: 'Formal Wear', price: '₹1,899', stock: 89, status: 'In Stock', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=100', rating: 4.3, reviews: 189, relatedProductIds: [4] },
    { id: 9, name: 'Bandhgala Suit', category: 'Wedding Wear', price: '₹18,999', stock: 12, status: 'In Stock', image: 'https://images.unsplash.com/photo-1594938328870-f9dd22e4345a?w=100', rating: 4.7, reviews: 95, relatedProductIds: [1, 2] },
    { id: 10, name: 'Cotton Salwar Suit', category: 'Traditional Wear', price: '₹3,999', stock: 45, status: 'In Stock', image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e6?w=100', rating: 4.1, reviews: 134, relatedProductIds: [5] },
  ]);

  const handleDuplicate = (product: typeof products[0]) => {
    alert(`Duplicating product: ${product.name}`);
    // In a real app, this would create a copy of the product
  };

  const handleEdit = (product: typeof products[0]) => {
    setEditingProduct(product);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingProduct(null);
  };

  const handleProductClick = (product: typeof products[0]) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedProduct(null);
  };

  const handleManageRelatedClick = (product: typeof products[0]) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(false); // Close detail modal
    setIsManageRelatedOpen(true);
  };

  const handleCloseManageRelatedModal = () => {
    setIsManageRelatedOpen(false);
    // Don't clear selectedProduct - keep it for reopening detail modal
  };

  const handleSaveRelatedProducts = (productId: number, relatedIds: number[]) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, relatedProductIds: relatedIds } : p
    ));
    
    // Update the selectedProduct to reflect changes
    const updatedProduct = products.find(p => p.id === productId);
    if (updatedProduct) {
      setSelectedProduct({ ...updatedProduct, relatedProductIds: relatedIds });
      setIsDetailModalOpen(true); // Reopen detail modal with updated data
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Products</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage your product catalog</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          💡 <strong>Tip:</strong> Click on any product name to view full details and related products
        </p>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Filter className="w-5 h-5" />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {products.map((product) => (
                <tr 
                  key={product.id} 
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td 
                    className="px-6 py-4 whitespace-nowrap cursor-pointer group"
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-gray-600 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-colors"
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:underline transition-all">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-gray-300">{product.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{product.price}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-gray-300">{product.stock}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      product.status === 'In Stock'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : product.status === 'Low Stock'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(product);
                      }}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-4"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicate(product);
                      }}
                      className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 mr-4 inline-flex items-center gap-1"
                    >
                      <Copy className="w-4 h-4" />
                      Duplicate
                    </button>
                    <button 
                      onClick={(e) => e.stopPropagation()}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddProductModal 
        isOpen={isAddModalOpen} 
        onClose={handleCloseModal}
        editingProduct={editingProduct}
      />

      <ProductDetailModal 
        isOpen={isDetailModalOpen} 
        onClose={handleCloseDetailModal}
        product={selectedProduct}
        allProducts={products}
        onProductClick={handleProductClick}
        onManageRelatedClick={handleManageRelatedClick}
      />

      <ManageRelatedProductsModal 
        isOpen={isManageRelatedOpen} 
        onClose={handleCloseManageRelatedModal}
        product={selectedProduct}
        allProducts={products}
        onSave={handleSaveRelatedProducts}
      />
    </div>
  );
}