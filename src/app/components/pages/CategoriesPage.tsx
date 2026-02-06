import { useState } from 'react';
import { Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import { AddCategoryModal } from '../AddCategoryModal';

interface Category {
  id: number;
  name: string;
  headline: string;
  description: string;
  thumbnail?: string;
  products: number;
  status: string;
  selectedProductIds?: number[];
}

interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  stock: number;
  image?: string;
}

export function CategoriesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  // Sample products data
  const availableProducts: Product[] = [
    { id: 1, name: 'Royal Sherwani', price: '₹45,000', category: 'wedding-wear', stock: 12, image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400' },
    { id: 2, name: 'Designer Lehenga', price: '₹65,000', category: 'wedding-wear', stock: 8, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400' },
    { id: 3, name: 'Silk Kurta Set', price: '₹8,500', category: 'ethnic-wear', stock: 25, image: 'https://images.unsplash.com/photo-1622124358717-e0b1a3cf5c61?w=400' },
    { id: 4, name: 'Embroidered Saree', price: '₹15,000', category: 'traditional-sarees', stock: 18, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400' },
    { id: 5, name: 'Business Suit', price: '₹22,000', category: 'formal-wear', stock: 15, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400' },
    { id: 6, name: 'Cotton Kurta', price: '₹3,200', category: 'casual-wear', stock: 40, image: 'https://images.unsplash.com/photo-1583391733981-e99d4b4e2b40?w=400' },
    { id: 7, name: 'Banarasi Saree', price: '₹28,000', category: 'traditional-sarees', stock: 10, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400' },
    { id: 8, name: 'Wedding Dupatta', price: '₹5,500', category: 'accessories', stock: 22, image: 'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=400' },
  ];
  
  const [categories, setCategories] = useState<Category[]>([
    { 
      id: 1, 
      name: 'Wedding Wear', 
      headline: 'Elegant Wedding Collection',
      description: 'Sherwanis, lehengas, bridal sarees', 
      products: 145, 
      status: 'Active',
      selectedProductIds: [1, 2]
    },
    { 
      id: 2, 
      name: 'Ethnic Wear', 
      headline: 'Traditional Indian Attire',
      description: 'Kurtas, salwar suits, traditional attire', 
      products: 234, 
      status: 'Active',
      selectedProductIds: [3]
    },
    { 
      id: 3, 
      name: 'Formal Wear', 
      headline: 'Professional Business Attire',
      description: 'Business suits, formal shirts, blazers', 
      products: 67, 
      status: 'Active',
      selectedProductIds: [5]
    },
    { 
      id: 4, 
      name: 'Casual Wear', 
      headline: 'Comfortable Everyday Wear',
      description: 'Casual kurtas, chinos, everyday wear', 
      products: 189, 
      status: 'Active',
      selectedProductIds: [6]
    },
    { 
      id: 5, 
      name: 'Traditional Sarees', 
      headline: 'Premium Saree Collection',
      description: 'Silk sarees, cotton sarees, designer sarees', 
      products: 312, 
      status: 'Active',
      selectedProductIds: [4, 7]
    },
    { 
      id: 6, 
      name: 'Alterations', 
      headline: 'Professional Tailoring Services',
      description: 'Hemming, repairs, adjustments', 
      products: 0, 
      status: 'Service',
      selectedProductIds: []
    },
    { 
      id: 7, 
      name: 'Accessories', 
      headline: 'Complete Your Look',
      description: 'Dupattas, stoles, belts', 
      products: 98, 
      status: 'Active',
      selectedProductIds: [8]
    },
  ]);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingCategory(null);
  };

  const handleSaveCategory = (categoryData: any) => {
    if (editingCategory) {
      // Update existing category
      setCategories(categories.map(cat => 
        cat.id === categoryData.id ? categoryData : cat
      ));
    } else {
      // Add new category
      setCategories([...categories, categoryData]);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Category Modal */}
      <AddCategoryModal 
        isOpen={isAddModalOpen} 
        onClose={handleCloseModal}
        onSave={handleSaveCategory}
        availableProducts={availableProducts}
        editingCategory={editingCategory}
      />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Categories</h2>
          <p className="text-sm text-gray-600 mt-1">Organize your products and services</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
            {/* Thumbnail */}
            {category.thumbnail ? (
              <img 
                src={category.thumbnail} 
                alt={category.name}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-blue-300" />
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  {category.headline && (
                    <p className="text-sm text-blue-600 font-medium mt-1">{category.headline}</p>
                  )}
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ml-2 ${
                  category.status === 'Active' 
                    ? 'bg-green-100 text-green-800' 
                    : category.status === 'Service'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {category.status}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{category.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{category.products}</span> products
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(category)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit category"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(category.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {categories.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No categories yet</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first category</p>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Category
          </button>
        </div>
      )}
    </div>
  );
}