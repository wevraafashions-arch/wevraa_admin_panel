import { useState, useEffect, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Plus, GripVertical, Info, Search } from 'lucide-react';
import 'react-quill/dist/quill.snow.css';
import { useVendors } from '@/contexts/VendorContext';

// Dynamic wrapper for ReactQuill with StrictMode compatibility
const QuillEditor = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const [ReactQuill, setReactQuill] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Dynamically import react-quill
    import('react-quill').then((mod) => {
      setReactQuill(() => mod.default);
    });
    
    // Suppress findDOMNode warning in console
    const originalError = console.error;
    console.error = (...args) => {
      if (typeof args[0] === 'string' && args[0].includes('findDOMNode')) {
        return;
      }
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link'],
      ['clean']
    ]
  };

  if (!ReactQuill || !isMounted) {
    return (
      <div className="w-full h-[200px] border border-gray-300 rounded-lg flex items-center justify-center bg-gray-50" style={{ marginBottom: '42px' }}>
        <span className="text-gray-400">Loading editor...</span>
      </div>
    );
  }

  return (
    <div>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        className="bg-white"
        style={{ height: '200px', marginBottom: '42px' }}
        modules={modules}
      />
    </div>
  );
};

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct?: {
    id: number;
    name: string;
    category: string;
    price: string;
    stock: number;
    status: string;
  } | null;
}

export function AddProductModal({ isOpen, onClose, editingProduct }: AddProductModalProps) {
  const { vendors } = useVendors();
  
  // Mock collections data (in real app, this would come from a CollectionsContext)
  const collections = [
    { id: 1, title: 'Summer Collections' },
    { id: 2, title: 'Wedding Special' },
    { id: 3, title: 'Festive Wear' },
    { id: 4, title: 'Ethnic Collections' },
    { id: 5, title: 'Bridal Lehenga Collection' },
    { id: 6, title: 'Men\'s Sherwanis' },
    { id: 7, title: 'Designer Sarees' },
    { id: 8, title: 'Casual Kurtas' },
    { id: 9, title: 'Diwali Special' },
    { id: 10, title: 'Office Wear' },
  ];
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    productDetails: '',
    category: '',
    price: '',
    compareAtPrice: '',
    discountType: 'percentage',
    discountValue: '',
    status: 'Active',
    publishOnline: true,
    publishPOS: false,
    type: '',
    vendor: '',
    collections: '',
    tags: '',
    template: 'Default product',
    inventoryTracked: true,
    quantity: '0',
    shopLocation: '',
    sku: '',
    barcode: '',
    sellOutOfStock: false,
    physicalProduct: true,
    weight: '0.0',
    weightUnit: 'kg',
    countryOfOrigin: '',
    hsCode: '',
    details: '',
    fitAndFabric: '',
    shippingAndReturn: '',
  });

  const [variants, setVariants] = useState<Array<{ name: string; values: string[] }>>([
    { name: 'Small', values: ['1200'] }
  ]);

  const [showSKUField, setShowSKUField] = useState(false);
  const [showBarcodeField, setShowBarcodeField] = useState(false);

  // Size management
  const predefinedSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL'];
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [customSize, setCustomSize] = useState('');
  const [sizeMeasurements, setSizeMeasurements] = useState<{ 
    [key: string]: { 
      bust?: string; 
      waist?: string; 
      hips?: string;
      stock?: string;
      additional?: { name: string; value: string }[];
    } 
  }>({});
  const [showMeasurementFields, setShowMeasurementFields] = useState(false);
  const [newMeasurementName, setNewMeasurementName] = useState<{ [key: string]: string }>({});

  // Pre-fill form when editing
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        ...formData,
        title: editingProduct.name,
        category: editingProduct.category.toLowerCase().replace(/ /g, '-'),
        price: editingProduct.price.replace('₹', '').replace(',', ''),
        quantity: editingProduct.stock.toString(),
        status: editingProduct.status === 'In Stock' ? 'Active' : 
                editingProduct.status === 'Low Stock' ? 'Active' : 'Draft',
      });
    } else {
      // Reset form when not editing
      setFormData({
        title: '',
        description: '',
        productDetails: '',
        category: '',
        price: '',
        compareAtPrice: '',
        discountType: 'percentage',
        discountValue: '',
        status: 'Active',
        publishOnline: true,
        publishPOS: false,
        type: '',
        vendor: '',
        collections: '',
        tags: '',
        template: 'Default product',
        inventoryTracked: true,
        quantity: '0',
        shopLocation: '',
        sku: '',
        barcode: '',
        sellOutOfStock: false,
        physicalProduct: true,
        weight: '0.0',
        weightUnit: 'kg',
        countryOfOrigin: '',
        hsCode: '',
        details: '',
        fitAndFabric: '',
        shippingAndReturn: '',
      });
    }
  }, [editingProduct]);

  // Predefined shop locations for dropdown
  const shopLocations = [
    'Mumbai Main Store',
    'Delhi Boutique',
    'Bangalore Showroom',
    'Chennai Store',
    'Kolkata Branch',
    'Pune Outlet',
    'Hyderabad Store',
  ];

  // Predefined SKU patterns for suggestions
  const skuSuggestions = [
    'SKU-2024-',
    'PROD-',
    'ITEM-',
    'WED-',
    'ETH-',
  ];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Product data:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center overflow-y-auto py-8">
      <div className="bg-gray-50 w-full max-w-6xl mx-4 rounded-lg shadow-xl">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 rounded-t-lg">
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold text-gray-900">
              {editingProduct ? 'Edit product' : 'Add product'}
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
              {editingProduct ? 'Update Product' : 'Save Product'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Short sleeve t-shirt"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Product Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Description
                    </label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief one-line description of the product"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Product Details */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Details
                    </label>
                    <QuillEditor
                      value={formData.productDetails}
                      onChange={(value) => setFormData({ ...formData, productDetails: value })}
                    />
                  </div>
                </div>
              </div>

              {/* Media */}
              <div className="bg-white rounded-lg shadow p-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Media</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Upload new
                      </button>
                      <span className="text-gray-500">or</span>
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Select existing
                      </button>
                    </div>
                    <p className="text-sm text-gray-500">Accepts images, videos, or 3D models</p>
                  </div>
                </div>
              </div>

              {/* Category & Price */}
              <div className="bg-white rounded-lg shadow p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose a product category</option>
                    <option value="wedding-wear">Wedding Wear</option>
                    <option value="ethnic-wear">Ethnic Wear</option>
                    <option value="formal-wear">Formal Wear</option>
                    <option value="casual-wear">Casual Wear</option>
                    <option value="traditional-sarees">Traditional Sarees</option>
                    <option value="accessories">Accessories</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Determines tax rates and adds metafields to improve search, filters, and cross-channel sales
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Pricing</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (MRP)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                        <input
                          type="text"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          placeholder="0.00"
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Maximum Retail Price</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Compare at price (Original price)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                        <input
                          type="text"
                          value={formData.compareAtPrice}
                          onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                          placeholder="0.00"
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Show customers the original price before discount</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discount
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={formData.discountType}
                          onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                          className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="percentage">%</option>
                          <option value="fixed">₹</option>
                        </select>
                        <input
                          type="text"
                          value={formData.discountValue}
                          onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                          placeholder="0"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.discountType === 'percentage' ? 'Percentage off the original price' : 'Fixed amount off the original price'}
                      </p>
                    </div>

                    {/* Calculated Offer Price Preview */}
                    {(formData.price || formData.compareAtPrice || formData.discountValue) && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Final Selling Price:</span>
                          <span className="text-2xl font-bold text-green-600">
                            ₹{(() => {
                              const price = parseFloat(formData.price) || 0;
                              const comparePrice = parseFloat(formData.compareAtPrice) || price;
                              const discountValue = parseFloat(formData.discountValue) || 0;
                              
                              if (formData.discountType === 'percentage') {
                                const finalPrice = comparePrice - (comparePrice * discountValue / 100);
                                return finalPrice.toFixed(2);
                              } else {
                                const finalPrice = comparePrice - discountValue;
                                return finalPrice.toFixed(2);
                              }
                            })()}
                          </span>
                        </div>
                        
                        {formData.discountValue && parseFloat(formData.discountValue) > 0 && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              {formData.compareAtPrice && (
                                <span className="line-through mr-2">₹{formData.compareAtPrice}</span>
                              )}
                            </span>
                            <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
                              {formData.discountType === 'percentage' 
                                ? `${formData.discountValue}% OFF` 
                                : `₹${formData.discountValue} OFF`}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 text-xs text-gray-600">
                    <button type="button" className="hover:text-gray-900">Charge tax</button>
                    <button type="button" className="px-2 py-0.5 bg-gray-100 rounded">Yes</button>
                    <button type="button" className="hover:text-gray-900">Cost per item</button>
                  </div>
                </div>
              </div>

              {/* Inventory */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-gray-900">Inventory</h3>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-sm text-gray-600">Inventory tracked</span>
                    <input
                      type="checkbox"
                      checked={formData.inventoryTracked}
                      onChange={(e) => setFormData({ ...formData, inventoryTracked: e.target.checked })}
                      className="w-11 h-6 bg-gray-200 rounded-full appearance-none cursor-pointer relative
                        checked:bg-blue-600 transition-colors
                        before:content-[''] before:absolute before:w-5 before:h-5 before:rounded-full 
                        before:bg-white before:top-0.5 before:left-0.5 before:transition-transform
                        checked:before:translate-x-5"
                    />
                  </label>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                    <input
                      type="text"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Shop location</label>
                    <input
                      type="text"
                      list="shop-locations"
                      value={formData.shopLocation}
                      onChange={(e) => setFormData({ ...formData, shopLocation: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Select or type location"
                    />
                    <datalist id="shop-locations">
                      {shopLocations.map((location) => (
                        <option key={location} value={location} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SKU (Stock Keeping Unit)</label>
                    <input
                      type="text"
                      list="sku-suggestions"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter or select SKU pattern"
                    />
                    <datalist id="sku-suggestions">
                      {skuSuggestions.map((suggestion) => (
                        <option key={suggestion} value={suggestion} />
                      ))}
                    </datalist>
                  </div>

                  {showBarcodeField && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Barcode</label>
                      <input
                        type="text"
                        value={formData.barcode}
                        onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter barcode"
                      />
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 flex flex-wrap gap-3">
                  {!showBarcodeField && (
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                      onClick={() => setShowBarcodeField(true)}
                    >
                      + Add Barcode
                    </button>
                  )}
                  <button 
                    type="button" 
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    Sell when out of stock
                    <span className="px-2 py-0.5 bg-white border border-gray-300 text-gray-600 rounded text-xs font-semibold">Off</span>
                  </button>
                </div>
              </div>

              {/* Shipping */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Shipping</h3>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-sm text-gray-600">Physical product</span>
                    <input
                      type="checkbox"
                      checked={formData.physicalProduct}
                      onChange={(e) => setFormData({ ...formData, physicalProduct: e.target.checked })}
                      className="w-11 h-6 bg-gray-200 rounded-full appearance-none cursor-pointer relative
                        checked:bg-blue-600 transition-colors
                        before:content-[''] before:absolute before:w-5 before:h-5 before:rounded-full 
                        before:bg-white before:top-0.5 before:left-0.5 before:transition-transform
                        checked:before:translate-x-5"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                      Package <Info className="w-4 h-4 text-gray-400" />
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Store default • Sample box - 22 × 13.7 × 4.2 cm, 0 kg</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-700 mb-2 block">Product weight</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="0.0"
                      />
                      <select
                        value={formData.weightUnit}
                        onChange={(e) => setFormData({ ...formData, weightUnit: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-4 text-sm">
                  <button type="button" className="text-gray-600 hover:text-gray-900">Country of origin</button>
                  <button type="button" className="text-gray-600 hover:text-gray-900">HS Code</button>
                </div>
              </div>

              {/* Size & Measurements */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Size & Measurements</h3>
                  <button
                    type="button"
                    onClick={() => setShowMeasurementFields(!showMeasurementFields)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {showMeasurementFields ? 'Hide' : 'Add'} Measurements
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Available Sizes</label>
                    <div className="flex flex-wrap gap-2">
                      {predefinedSizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => {
                            if (selectedSizes.includes(size)) {
                              setSelectedSizes(selectedSizes.filter(s => s !== size));
                              const newMeasurements = { ...sizeMeasurements };
                              delete newMeasurements[size];
                              setSizeMeasurements(newMeasurements);
                            } else {
                              setSelectedSizes([...selectedSizes, size]);
                            }
                          }}
                          className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                            selectedSizes.includes(size)
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Add Custom Size</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customSize}
                        onChange={(e) => setCustomSize(e.target.value)}
                        placeholder="Enter custom size (e.g., 6XL, 32, 34)"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customSize.trim() && !selectedSizes.includes(customSize.trim())) {
                            setSelectedSizes([...selectedSizes, customSize.trim()]);
                            setCustomSize('');
                          }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {selectedSizes.length > 0 && (
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">
                          Selected Sizes: {selectedSizes.join(', ')}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSizes([]);
                            setSizeMeasurements({});
                          }}
                          className="text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          Clear All
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">
                        {selectedSizes.length} size{selectedSizes.length !== 1 ? 's' : ''} selected
                      </p>
                    </div>
                  )}

                  {showMeasurementFields && selectedSizes.length > 0 && (
                    <div className="pt-4 border-t border-gray-200 space-y-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800 font-medium mb-1">💡 Stock & Measurement Guide</p>
                        <p className="text-xs text-blue-700">
                          <strong>Stock Quantity is required</strong> for each size - products with 0 stock won't be shown to customers.<br />
                          Add measurements in inches or centimeters for each size. Measurement fields are optional.
                        </p>
                      </div>

                      {selectedSizes.map((size) => (
                        <div key={size} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-gray-900">Size: {size}</h4>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const newMeasurements = { ...sizeMeasurements };
                                  newMeasurements[size] = {};
                                  setSizeMeasurements(newMeasurements);
                                }}
                                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                              >
                                Clear Measurements
                              </button>
                              <span className="text-gray-300">|</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedSizes(selectedSizes.filter(s => s !== size));
                                  const newMeasurements = { ...sizeMeasurements };
                                  delete newMeasurements[size];
                                  setSizeMeasurements(newMeasurements);
                                }}
                                className="text-sm text-red-600 hover:text-red-700 font-medium"
                              >
                                Remove Size
                              </button>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {/* Stock Field - Always visible */}
                            <div className="flex items-start gap-2">
                              <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                                <input
                                  type="number"
                                  value={sizeMeasurements[size]?.stock || ''}
                                  onChange={(e) => {
                                    setSizeMeasurements({
                                      ...sizeMeasurements,
                                      [size]: { ...sizeMeasurements[size], stock: e.target.value }
                                    });
                                  }}
                                  placeholder="Enter stock quantity"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                  min="0"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                  {sizeMeasurements[size]?.stock && parseInt(sizeMeasurements[size]?.stock || '0') === 0 
                                    ? '⚠️ Out of stock - Will not be shown to customers' 
                                    : sizeMeasurements[size]?.stock && parseInt(sizeMeasurements[size]?.stock || '0') < 5
                                    ? '⚠️ Low stock'
                                    : 'Number of items available'}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-2">
                              <div className="flex-1">
                                <label className="block text-sm text-gray-700 mb-1">Bust (in)</label>
                                <input
                                  type="text"
                                  value={sizeMeasurements[size]?.bust || ''}
                                  onChange={(e) => {
                                    setSizeMeasurements({
                                      ...sizeMeasurements,
                                      [size]: { ...sizeMeasurements[size], bust: e.target.value }
                                    });
                                  }}
                                  placeholder="e.g., 36"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const newMeasurements = { ...sizeMeasurements };
                                  if (newMeasurements[size]) {
                                    delete newMeasurements[size].bust;
                                    setSizeMeasurements(newMeasurements);
                                  }
                                }}
                                className="mt-7 text-red-600 hover:text-red-700 p-2"
                                title="Remove Bust measurement"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="flex items-start gap-2">
                              <div className="flex-1">
                                <label className="block text-sm text-gray-700 mb-1">Waist (in)</label>
                                <input
                                  type="text"
                                  value={sizeMeasurements[size]?.waist || ''}
                                  onChange={(e) => {
                                    setSizeMeasurements({
                                      ...sizeMeasurements,
                                      [size]: { ...sizeMeasurements[size], waist: e.target.value }
                                    });
                                  }}
                                  placeholder="e.g., 30"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const newMeasurements = { ...sizeMeasurements };
                                  if (newMeasurements[size]) {
                                    delete newMeasurements[size].waist;
                                    setSizeMeasurements(newMeasurements);
                                  }
                                }}
                                className="mt-7 text-red-600 hover:text-red-700 p-2"
                                title="Remove Waist measurement"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="flex items-start gap-2">
                              <div className="flex-1">
                                <label className="block text-sm text-gray-700 mb-1">Hips (in)</label>
                                <input
                                  type="text"
                                  value={sizeMeasurements[size]?.hips || ''}
                                  onChange={(e) => {
                                    setSizeMeasurements({
                                      ...sizeMeasurements,
                                      [size]: { ...sizeMeasurements[size], hips: e.target.value }
                                    });
                                  }}
                                  placeholder="e.g., 34"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const newMeasurements = { ...sizeMeasurements };
                                  if (newMeasurements[size]) {
                                    delete newMeasurements[size].hips;
                                    setSizeMeasurements(newMeasurements);
                                  }
                                }}
                                className="mt-7 text-red-600 hover:text-red-700 p-2"
                                title="Remove Hips measurement"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Additional Measurements */}
                          {sizeMeasurements[size]?.additional && sizeMeasurements[size].additional.length > 0 && (
                            <div className="mt-4 space-y-3 pt-4 border-t border-gray-200">
                              <p className="text-xs font-medium text-gray-700">Additional Measurements</p>
                              {sizeMeasurements[size].additional.map((additional, index) => (
                                <div key={index} className="grid grid-cols-2 gap-2">
                                  <input
                                    type="text"
                                    value={additional.name}
                                    onChange={(e) => {
                                      const newMeasurements = { ...sizeMeasurements };
                                      if (!newMeasurements[size].additional) {
                                        newMeasurements[size].additional = [];
                                      }
                                      newMeasurements[size].additional[index].name = e.target.value;
                                      setSizeMeasurements(newMeasurements);
                                    }}
                                    placeholder="Name (e.g., Shoulder)"
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                  />
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      value={additional.value}
                                      onChange={(e) => {
                                        const newMeasurements = { ...sizeMeasurements };
                                        if (!newMeasurements[size].additional) {
                                          newMeasurements[size].additional = [];
                                        }
                                        newMeasurements[size].additional[index].value = e.target.value;
                                        setSizeMeasurements(newMeasurements);
                                      }}
                                      placeholder="Value (e.g., 16)"
                                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newMeasurements = { ...sizeMeasurements };
                                        newMeasurements[size].additional = newMeasurements[size].additional.filter((_, i) => i !== index);
                                        setSizeMeasurements(newMeasurements);
                                      }}
                                      className="text-red-600 hover:text-red-700 p-2"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Add New Additional Measurement */}
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <button
                              type="button"
                              onClick={() => {
                                const newMeasurements = { ...sizeMeasurements };
                                if (!newMeasurements[size]) {
                                  newMeasurements[size] = {};
                                }
                                if (!newMeasurements[size].additional) {
                                  newMeasurements[size].additional = [];
                                }
                                newMeasurements[size].additional.push({ name: '', value: '' });
                                setSizeMeasurements(newMeasurements);
                              }}
                              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                              <Plus className="w-4 h-4" />
                              Add Additional Measurement
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Variants */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Variants</h3>
                
                {variants.map((variant, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Option name
                        </label>
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={variant.name}
                            onChange={(e) => {
                              const newVariants = [...variants];
                              newVariants[index].name = e.target.value;
                              setVariants(newVariants);
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Option values
                        </label>
                        <div className="space-y-2">
                          {variant.values.map((value, valueIndex) => (
                            <div key={valueIndex} className="flex items-center gap-2">
                              <GripVertical className="w-4 h-4 text-gray-400" />
                              <input
                                type="text"
                                value={value}
                                onChange={(e) => {
                                  const newVariants = [...variants];
                                  newVariants[index].values[valueIndex] = e.target.value;
                                  setVariants(newVariants);
                                }}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                              />
                            </div>
                          ))}
                          <input
                            type="text"
                            placeholder="Add another value"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-500"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const newVariants = [...variants];
                                newVariants[index].values.push('');
                                setVariants(newVariants);
                              }
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <button type="button" className="text-red-600 hover:text-red-700 text-sm font-medium">
                          Delete
                        </button>
                        <button type="button" className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
                          Done
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => setVariants([...variants, { name: '', values: [''] }])}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add another option
                </button>
              </div>

              {/* Details */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Details</h3>
                <p className="text-xs text-gray-500 mb-4">Add detailed information about this product</p>
                <QuillEditor
                  value={formData.details}
                  onChange={(value) => setFormData({ ...formData, details: value })}
                />
              </div>

              {/* Fit & Fabric */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Fit & Fabric</h3>
                <p className="text-xs text-gray-500 mb-4">Describe the fit and fabric details for this product</p>
                <QuillEditor
                  value={formData.fitAndFabric}
                  onChange={(value) => setFormData({ ...formData, fitAndFabric: value })}
                />
              </div>

              {/* Shipping and Return */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Shipping and Return</h3>
                <p className="text-xs text-gray-500 mb-4">Add shipping and return policy information for this product</p>
                <QuillEditor
                  value={formData.shippingAndReturn}
                  onChange={(value) => setFormData({ ...formData, shippingAndReturn: value })}
                />
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Status */}
              <div className="bg-white rounded-lg shadow p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Active</option>
                  <option>Draft</option>
                  <option>Archived</option>
                </select>
              </div>

              {/* Publishing */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Publishing</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.publishOnline}
                      onChange={(e) => setFormData({ ...formData, publishOnline: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Online Store</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.publishPOS}
                      onChange={(e) => setFormData({ ...formData, publishPOS: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Point of Sale</span>
                  </label>
                </div>
              </div>

              {/* Product Organization */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-sm font-medium text-gray-700">Product organization</h3>
                  <Info className="w-4 h-4 text-gray-400" />
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Type</label>
                    <input
                      type="text"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Vendor</label>
                    <select
                      value={formData.vendor}
                      onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a vendor</option>
                      {vendors
                        .filter(v => v.status === 'Active')
                        .map(vendor => (
                          <option key={vendor.id} value={vendor.id}>
                            {vendor.companyName} ({vendor.name})
                          </option>
                        ))
                      }
                    </select>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {vendors.filter(v => v.status === 'Active').length} active vendors available
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Collections</label>
                    <select
                      value={formData.collections}
                      onChange={(e) => setFormData({ ...formData, collections: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a collection</option>
                      {collections.map(collection => (
                        <option key={collection.id} value={collection.id}>
                          {collection.title}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {collections.length} collections available
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Tags</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Theme Template */}
              <div className="bg-white rounded-lg shadow p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Theme template</label>
                <select
                  value={formData.template}
                  onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option>Default product</option>
                  <option>Featured product</option>
                  <option>Custom template</option>
                </select>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}