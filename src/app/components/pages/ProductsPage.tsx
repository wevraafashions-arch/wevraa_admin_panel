import { Plus, Search, Filter, Copy, Edit, Trash2 } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { AddProductModal } from '../AddProductModal';
import { ProductDetailModal } from '../ProductDetailModal';
import { ManageRelatedProductsModal } from '../ManageRelatedProductsModal';
import { ConfirmDeleteDialog } from '../ui/ConfirmDeleteDialog';
import { productsService } from '../../api/services/productsService';
import { ApiError } from '../../api/client';
import type { Product } from '../../api/types/product';
import type { CreateProductRequest, UpdateProductRequest } from '../../api/types/product';

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isManageRelatedOpen, setIsManageRelatedOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await productsService.getList();
      setProducts(Array.isArray(list) ? list : []);
    } catch (e) {
      const message =
        e instanceof ApiError ? e.message : 'Failed to load products';
      setError(message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDuplicate = (product: Product) => {
    setEditingProduct({ ...product, id: '' });
    setIsAddModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = async (
    payload: CreateProductRequest | (UpdateProductRequest & { id?: string })
  ) => {
    setActionLoading(true);
    setError(null);
    try {
      if (editingProduct?.id && 'id' in payload && payload.id) {
        const { id, ...body } = payload as UpdateProductRequest & { id: string };
        await productsService.update(id, body);
      } else {
        const { id: _id, ...body } = payload as CreateProductRequest & { id?: string };
        await productsService.create(body as CreateProductRequest);
      }
      await fetchProducts();
      handleCloseModal();
    } catch (e) {
      const message =
        e instanceof ApiError ? e.message : 'Failed to save product';
      setError(message);
      throw e;
    } finally {
      setActionLoading(false);
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedProduct(null);
  };

  const handleManageRelatedClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(false);
    setIsManageRelatedOpen(true);
  };

  const handleCloseManageRelatedModal = () => {
    setIsManageRelatedOpen(false);
  };

  const handleSaveRelatedProducts = (
    _productId: string,
    _relatedIds: string[]
  ) => {
    fetchProducts();
    setSelectedProduct(null);
    setIsManageRelatedOpen(false);
  };

  const handleDeleteClick = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    setProductToDelete(product);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setActionLoading(true);
    setError(null);
    try {
      await productsService.delete(productToDelete.id);
      await fetchProducts();
      if (selectedProduct?.id === productToDelete.id) {
        handleCloseDetailModal();
      }
      setProductToDelete(null);
    } catch (e) {
      const message =
        e instanceof ApiError ? e.message : 'Failed to delete product';
      setError(message);
    } finally {
      setActionLoading(false);
    }
  };

  const productImage = (p: Product) =>
    p.media?.[0]?.url ?? 'https://via.placeholder.com/100';
  const productPrice = (p: Product) =>
    p.mrp != null ? `₹${Number(p.mrp).toLocaleString()}` : '—';
  const productStock = (p: Product) =>
    p.quantity != null ? String(p.quantity) : '—';
  const stockStatus = (p: Product) => {
    const q = p.quantity ?? 0;
    if (q === 0) return 'Out of Stock';
    if (q <= 10) return 'Low Stock';
    return 'In Stock';
  };

  return (
    <div className="space-y-6">
      <ConfirmDeleteDialog
        open={!!productToDelete}
        onOpenChange={(open) => !open && setProductToDelete(null)}
        title="Delete product"
        description={
          productToDelete
            ? `Are you sure you want to delete "${productToDelete.title}"? This action cannot be undone.`
            : undefined
        }
        onConfirm={handleConfirmDelete}
        isLoading={actionLoading}
      />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Products
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage your product catalog
          </p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          Tip: Click on any product name to view full details and related
          products.
        </p>
      </div>

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
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Filter className="w-5 h-5" />
              Filter
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-200 dark:bg-gray-700 rounded"
                />
              ))}
            </div>
          </div>
        ) : (
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
                          src={productImage(product)}
                          alt={product.title}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-gray-600 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-colors"
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:underline transition-all">
                          {product.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 dark:text-gray-300">
                        {product.category?.name ?? '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {productPrice(product)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 dark:text-gray-300">
                        {productStock(product)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${stockStatus(product) === 'In Stock'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : stockStatus(product) === 'Low Stock'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}
                      >
                        {stockStatus(product)}
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
                        onClick={(e) => handleDeleteClick(e, product)}
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
        )}

        {!loading && products.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No products yet. Add your first product.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          </div>
        )}
      </div>

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        editingProduct={editingProduct}
        onSave={handleSaveProduct}
        isSaving={actionLoading}
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
