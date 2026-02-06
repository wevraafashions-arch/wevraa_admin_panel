import { X, ShoppingCart, Heart, Share2, Star, Package, TrendingUp, Settings } from 'lucide-react';
import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  stock: number;
  status: string;
  image: string;
  description?: string;
  rating?: number;
  reviews?: number;
  relatedProductIds?: number[];
}

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  allProducts: Product[];
  onProductClick: (product: Product) => void;
  onManageRelatedClick?: (product: Product) => void;
}

export function ProductDetailModal({ isOpen, onClose, product, allProducts, onProductClick, onManageRelatedClick }: ProductDetailModalProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!isOpen || !product) return null;

  // Get related products based on relatedProductIds if available, otherwise fallback to same category
  const relatedProducts = product.relatedProductIds && product.relatedProductIds.length > 0
    ? allProducts.filter(p => product.relatedProductIds!.includes(p.id))
    : allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  // Mock additional images (in real app, product would have multiple images)
  const productImages = [
    product.image,
    product.image,
    product.image,
  ];

  const handleRelatedProductClick = (relatedProduct: Product) => {
    onProductClick(relatedProduct);
    setSelectedImage(0); // Reset image selection
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Product Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Product Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Left: Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
                <img
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Image Thumbnails */}
              <div className="flex gap-3">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx
                        ? 'border-blue-600 dark:border-blue-500'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="space-y-6">
              {/* Category & Status */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  {product.category}
                </span>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  product.status === 'In Stock'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : product.status === 'Low Stock'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {product.status}
                </span>
              </div>

              {/* Product Name */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-5 h-5 ${
                          idx < (product.rating || 4)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {product.rating || 4.0} ({product.reviews || 128} reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white">
                  {product.price}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Inclusive of all taxes
                </p>
              </div>

              {/* Stock Info */}
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Package className="w-5 h-5" />
                <span className="text-sm">
                  <span className="font-semibold">{product.stock}</span> units available
                </span>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {product.description || 
                    `Premium quality ${product.name.toLowerCase()} crafted with attention to detail. Perfect for any occasion, this product combines traditional craftsmanship with modern design sensibilities.`}
                </p>
              </div>

              {/* Product Details */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Product Details</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Product ID:</span>
                    <p className="text-gray-900 dark:text-white font-medium">#{product.id.toString().padStart(4, '0')}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Category:</span>
                    <p className="text-gray-900 dark:text-white font-medium">{product.category}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Availability:</span>
                    <p className="text-gray-900 dark:text-white font-medium">{product.status}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Stock Units:</span>
                    <p className="text-gray-900 dark:text-white font-medium">{product.stock}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors">
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-4 rounded-lg transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-4 rounded-lg transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
                {onManageRelatedClick && (
                  <button
                    onClick={() => onManageRelatedClick(product)}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                    title="Manage Related Products"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Related Products
                  </h2>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-semibold rounded-full">
                    {relatedProducts.length}
                  </span>
                </div>
                {onManageRelatedClick && (
                  <button
                    onClick={() => onManageRelatedClick(product)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    <Settings className="w-4 h-4" />
                    Manage
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map((relatedProduct) => (
                  <button
                    key={relatedProduct.id}
                    onClick={() => handleRelatedProductClick(relatedProduct)}
                    className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all group text-left"
                  >
                    {/* Product Image */}
                    <div className="aspect-square bg-gray-100 dark:bg-gray-600 rounded-lg overflow-hidden mb-3">
                      <img
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {relatedProduct.name}
                      </h3>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          {relatedProduct.price}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          relatedProduct.status === 'In Stock'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : relatedProduct.status === 'Low Stock'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                            : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                        }`}>
                          {relatedProduct.stock}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, idx) => (
                          <Star
                            key={idx}
                            className={`w-3 h-3 ${
                              idx < (relatedProduct.rating || 4)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {relatedProducts.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No related products found in this category.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}