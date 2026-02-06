import { useState } from 'react';
import { Plus, Search, Heart, X, Upload, Copy, Filter, Eye } from 'lucide-react';

interface Design {
  id: number;
  name: string;
  category: string;
  subCategory: string;
  designer: string;
  likes: number;
  image: string;
  description?: string;
}

export function DesignGalleryPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingDesignId, setEditingDesignId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSubCategory, setFilterSubCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const [newDesign, setNewDesign] = useState({
    name: '',
    description: '',
  });

  const [designs, setDesigns] = useState<Design[]>([
    { id: 1, name: 'Hand Embroidered Party Blouse', category: 'Blouse', subCategory: 'Hand Embroidery', designer: 'Priya Sharma', likes: 145, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400', description: 'Elegant hand embroidered blouse with golden thread work' },
    { id: 2, name: 'Designer Wedding Gown', category: 'Topwear', subCategory: 'Gown', designer: 'Lakshmi Boutique', likes: 289, image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400', description: 'Luxury bridal gown with intricate lace details' },
    { id: 3, name: 'Traditional Silk Kurta', category: 'Topwear', subCategory: 'Kurta', designer: 'Ramesh Tailors', likes: 167, image: 'https://images.unsplash.com/photo-1617210933620-8b0ec4e1c6e8?w=400', description: 'Pure silk kurta with traditional motifs' },
    { id: 4, name: 'Katori Blouse Design', category: 'Blouse', subCategory: 'Katori Blouse', designer: 'Meena Fashions', likes: 223, image: 'https://images.unsplash.com/photo-1509319117902-e1dbeac7f11a?w=400', description: 'Modern katori blouse with zardozi work' },
    { id: 5, name: 'Palazzo Set', category: 'Bottomwear', subCategory: 'Palazzo', designer: 'Anita Creations', likes: 134, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400', description: 'Comfortable palazzo with matching dupatta' },
    { id: 6, name: 'Lehenga Blouse', category: 'Blouse', subCategory: 'Lehenga Blouse', designer: 'Rajesh Kumar', likes: 256, image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400', description: 'Heavy embellished lehenga blouse' },
    { id: 7, name: 'Straight Pant - Formal', category: 'Bottomwear', subCategory: 'Straight Pant', designer: 'Vikram Singh', likes: 98, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400', description: 'Professional straight pant for office wear' },
    { id: 8, name: 'Saree Krosha Work', category: 'Others', subCategory: 'Saree Krosha', designer: 'Priya Sharma', likes: 187, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400', description: 'Intricate krosha work on saree border' },
    { id: 9, name: 'Machine Embroidery Blouse', category: 'Blouse', subCategory: 'Machine Embroidery', designer: 'Lakshmi Boutique', likes: 176, image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400', description: 'Contemporary machine embroidered design' },
    { id: 10, name: 'Churidar Set', category: 'Topwear', subCategory: 'Churidar', designer: 'Meena Fashions', likes: 145, image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e6?w=400', description: 'Elegant churidar with dupatta' },
  ]);

  // Categories from Tailor Categories
  const categories = [
    { id: 1, name: 'Blouse' },
    { id: 2, name: 'Topwear' },
    { id: 3, name: 'Bottomwear' },
    { id: 4, name: 'Others' },
  ];

  // Sub-categories based on selected category
  const subCategoriesData: { [key: string]: { id: number; name: string }[] } = {
    'Blouse': [
      { id: 1, name: 'Hand Embroidery' },
      { id: 2, name: 'Machine Embroidery' },
      { id: 3, name: 'Princes Cut Blouse' },
      { id: 4, name: 'Katori Blouse' },
      { id: 5, name: 'Lining Blouse' },
      { id: 6, name: 'Lehenga Blouse' },
      { id: 7, name: 'Plain Blouse' },
    ],
    'Topwear': [
      { id: 8, name: 'Gown' },
      { id: 9, name: 'Kurta' },
      { id: 10, name: 'Salwar' },
      { id: 11, name: 'Ghagra' },
      { id: 12, name: 'Lehenga Blouse' },
      { id: 13, name: 'Churidar' },
    ],
    'Bottomwear': [
      { id: 14, name: 'Chudi Bottom' },
      { id: 15, name: 'Salwar Bottom' },
      { id: 16, name: 'Patiala' },
      { id: 17, name: 'Palazzo' },
      { id: 18, name: 'Straight Pant' },
      { id: 19, name: 'Lehenga Bottom' },
    ],
    'Others': [
      { id: 20, name: 'Saree Krosha' },
      { id: 21, name: 'Saree Zig-Zag & Falls' },
    ],
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload an image file');
    }
  };

  const handleAddDesign = () => {
    if (!newDesign.name || !selectedCategory || !selectedSubCategory || !imageFile) {
      alert('Please fill in all required fields and upload an image');
      return;
    }

    const newId = Math.max(...designs.map(d => d.id)) + 1;
    const addedDesign: Design = {
      id: newId,
      name: newDesign.name,
      category: selectedCategory,
      subCategory: selectedSubCategory,
      designer: 'Admin User',
      likes: 0,
      image: imagePreview,
      description: newDesign.description,
    };

    setDesigns([...designs, addedDesign]);
    resetModal();
    alert('Design added successfully!');
  };

  const handleUpdateDesign = () => {
    if (!newDesign.name || !selectedCategory || !selectedSubCategory) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingDesignId !== null) {
      const updatedDesigns = designs.map(design => 
        design.id === editingDesignId 
          ? { 
              ...design, 
              name: newDesign.name,
              description: newDesign.description,
              category: selectedCategory,
              subCategory: selectedSubCategory,
              image: imagePreview || design.image 
            }
          : design
      );
      setDesigns(updatedDesigns);
    }

    resetModal();
    alert('Design updated successfully!');
  };

  const handleEditDesign = (designId: number) => {
    const designToEdit = designs.find(d => d.id === designId);
    if (designToEdit) {
      setIsEditMode(true);
      setEditingDesignId(designId);
      setNewDesign({ 
        name: designToEdit.name, 
        description: designToEdit.description || '',
      });
      setSelectedCategory(designToEdit.category);
      setSelectedSubCategory(designToEdit.subCategory);
      setImagePreview(designToEdit.image);
      setShowAddModal(true);
    }
  };

  const resetModal = () => {
    setShowAddModal(false);
    setIsEditMode(false);
    setEditingDesignId(null);
    setNewDesign({ name: '', description: '' });
    setSelectedCategory('');
    setSelectedSubCategory('');
    setImageFile(null);
    setImagePreview('');
  };

  const handleDuplicateDesign = (designId: number) => {
    const designToDuplicate = designs.find(d => d.id === designId);
    if (designToDuplicate) {
      const newId = Math.max(...designs.map(d => d.id)) + 1;
      const duplicatedDesign: Design = {
        ...designToDuplicate,
        id: newId,
        name: `${designToDuplicate.name} (Copy)`,
        likes: 0,
      };
      setDesigns([...designs, duplicatedDesign]);
      alert('Design duplicated successfully!');
    }
  };

  // Filter designs
  const filteredDesigns = designs.filter(design => {
    const matchesSearch = design.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         design.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         design.subCategory.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === '' || design.category === filterCategory;
    const matchesSubCategory = filterSubCategory === '' || design.subCategory === filterSubCategory;
    
    return matchesSearch && matchesCategory && matchesSubCategory;
  });

  return (
    <div className="space-y-6 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Design Gallery</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Browse and showcase design inspirations</p>
        </div>
        <button 
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors" 
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-5 h-5" />
          Add Design
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search designs by name, category, or subcategory..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={filterCategory}
            onChange={(e) => {
              setFilterCategory(e.target.value);
              setFilterSubCategory('');
            }}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          <select 
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed"
            value={filterSubCategory}
            onChange={(e) => setFilterSubCategory(e.target.value)}
            disabled={!filterCategory}
          >
            <option value="">All Sub-Categories</option>
            {filterCategory && subCategoriesData[filterCategory]?.map(subCat => (
              <option key={subCat.id} value={subCat.name}>{subCat.name}</option>
            ))}
          </select>
        </div>
        {(filterCategory || filterSubCategory || searchQuery) && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Filter className="w-4 h-4" />
            <span>Showing {filteredDesigns.length} of {designs.length} designs</span>
            <button 
              onClick={() => {
                setFilterCategory('');
                setFilterSubCategory('');
                setSearchQuery('');
              }}
              className="text-blue-600 dark:text-blue-400 hover:underline ml-2"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Designs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredDesigns.map((design) => (
          <div key={design.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow group">
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-700">
              <img 
                src={design.image} 
                alt={design.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3 flex gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDuplicateDesign(design.id);
                  }}
                  className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
                  title="Duplicate Design"
                >
                  <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400" />
                </button>
                <button 
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
                  title="Like Design"
                >
                  <Heart className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400" />
                </button>
              </div>
              <div className="absolute bottom-3 left-3">
                <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                  {design.subCategory}
                </span>
              </div>
            </div>
            <div 
              className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              onClick={() => handleEditDesign(design.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white flex-1">{design.name}</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{design.category}</p>
              <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">by {design.designer}</p>
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                  <Heart className="w-4 h-4" />
                  {design.likes}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDesigns.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">No designs found matching your criteria</p>
        </div>
      )}

      {/* Add/Edit Design Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {isEditMode ? 'Edit Design' : 'Add New Design'}
              </h2>
              <button 
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" 
                onClick={resetModal}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Design Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Design Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newDesign.name}
                  onChange={(e) => setNewDesign({ ...newDesign, name: e.target.value })}
                  placeholder="e.g., Elegant Bridal Blouse"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newDesign.description}
                  onChange={(e) => setNewDesign({ ...newDesign, description: e.target.value })}
                  placeholder="Describe the design details, fabric, embellishments, etc."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setSelectedSubCategory('');
                    }}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>{category.name}</option>
                    ))}
                  </select>
                </div>

                {/* Sub-Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sub-Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedSubCategory}
                    onChange={(e) => setSelectedSubCategory(e.target.value)}
                    disabled={!selectedCategory}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {selectedCategory ? 'Select Sub-Category' : 'Select a category first'}
                    </option>
                    {subCategoriesData[selectedCategory]?.map((subCategory) => (
                      <option key={subCategory.id} value={subCategory.name}>{subCategory.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Upload Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload Design Image <span className="text-red-500">*</span>
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                    dragActive 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : imagePreview 
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                      : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('fileInput')?.click()}
                >
                  {imagePreview ? (
                    <div className="space-y-4">
                      <div className="relative w-full h-64 rounded-lg overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setImagePreview('');
                            setImageFile(null);
                          }}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                        ✓ Image uploaded successfully
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Click to change image or drag & drop a new one
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-center">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/50 rounded-full">
                          <Upload className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Drop your image here, or click to browse
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Supports: JPG, PNG, GIF (Max 10MB)
                        </p>
                      </div>
                      <div className="pt-2">
                        <span className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
                          Select File
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={resetModal}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={isEditMode ? handleUpdateDesign : handleAddDesign}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isEditMode ? 'Update Design' : 'Add Design'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
