import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Upload, Image as ImageIcon, Plus, GripVertical, Info, Search } from 'lucide-react';
import 'react-quill/dist/quill.snow.css';
import { useVendors } from '@/contexts/VendorContext';
import { categoriesService } from '../api/services/categoriesService';
import { collectionsService } from '../api/services/collectionsService';
import type { Category } from '../api/types/category';
import type { Collection } from '../api/types/collection';

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
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
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

import type { Product, CreateProductRequest, UpdateProductRequest, ProductMediaItem } from '../api/types/product';
import { uploadFile } from '../api/services/uploadService';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct?: Product | null;
  onSave?: (payload: CreateProductRequest | (UpdateProductRequest & { id: string })) => void | Promise<void>;
  isSaving?: boolean;
}

export function AddProductModal({ isOpen, onClose, editingProduct, onSave, isSaving = false }: AddProductModalProps) {
  const { vendors } = useVendors();

  // Fetch categories and collections from API
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingCollections, setLoadingCollections] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoadingCategories(true);
    try {
      const list = await categoriesService.getList();
      setCategories(Array.isArray(list) ? list : []);
    } catch {
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  const fetchCollections = useCallback(async () => {
    setLoadingCollections(true);
    try {
      const list = await collectionsService.getList();
      setCollections(Array.isArray(list) ? list : []);
    } catch {
      setCollections([]);
    } finally {
      setLoadingCollections(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      fetchCollections();
    }
  }, [isOpen, fetchCategories, fetchCollections]);

  // Selected collection IDs (multi-select)
  const [selectedCollectionIds, setSelectedCollectionIds] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    productDetails: '',
    category: '',
    price: '',
    compareAtPrice: '',
    discountType: 'percentage',
    discountValue: '',
    status: 'DRAFT',
    publishOnline: false,
    publishPOS: false,
    productType: 'PHYSICAL',
    vendor: '',
    tags: '',
    template: 'DEFAULT_PRODUCT',
    inventoryTracked: true,
    quantity: '0',
    shopLocation: '',
    sku: '',
    barcode: '',
    sellOutOfStock: false,
    physicalProduct: true,
    weight: '0.0',
    weightUnit: 'KG',
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

  // Product media: file (for new) or url (when editing / after upload), preview, alt, order
  type MediaEntry = { id: string; file?: File; url?: string; preview: string; alt: string; order: number };
  const [productMedia, setProductMedia] = useState<MediaEntry[]>([]);
  const productMediaInputRef = useRef<HTMLInputElement>(null);

  // Pre-fill form when editing (API Product type)
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        title: editingProduct.title ?? '',
        description: editingProduct.productDescription ?? '',
        productDetails: editingProduct.productDetails ?? '',
        category: editingProduct.categoryId ?? editingProduct.category?.id ?? '',
        price: String(editingProduct.mrp ?? ''),
        compareAtPrice: editingProduct.compareAtPrice != null ? String(editingProduct.compareAtPrice) : '',
        discountType: (editingProduct.discountType ?? 'PERCENTAGE').toUpperCase().startsWith('PERC') ? 'percentage' : 'fixed',
        discountValue: editingProduct.discountValue != null ? String(editingProduct.discountValue) : '',
        status: editingProduct.status ?? 'DRAFT',
        publishOnline: editingProduct.publishOnlineStore ?? false,
        publishPOS: editingProduct.publishPOS ?? false,
        productType: editingProduct.productType ?? 'PHYSICAL',
        vendor: editingProduct.vendorId ?? editingProduct.vendor?.id ?? '',
        tags: (editingProduct.tags ?? []).join(', '),
        template: editingProduct.themeTemplate ?? 'DEFAULT_PRODUCT',
        inventoryTracked: editingProduct.inventoryTracked ?? true,
        quantity: String(editingProduct.quantity ?? 0),
        shopLocation: '',
        sku: editingProduct.sku ?? '',
        barcode: editingProduct.barcode ?? '',
        sellOutOfStock: editingProduct.allowOutOfStockSales ?? false,
        physicalProduct: editingProduct.isPhysicalProduct ?? true,
        weight: editingProduct.weight != null ? String(editingProduct.weight) : '0.0',
        weightUnit: (editingProduct.weightUnit ?? 'KG').toUpperCase(),
        countryOfOrigin: editingProduct.countryOfOrigin ?? '',
        hsCode: '',
        details: '',
        fitAndFabric: editingProduct.fitAndFabric ?? '',
        shippingAndReturn: editingProduct.shippingAndReturns ?? '',
      });
      setSelectedCollectionIds((editingProduct.collections ?? []).map((c) => c.id));
      const media = editingProduct.media ?? [];
      setProductMedia(
        media.map((m, i) => ({
          id: `existing-${i}-${m.url}`,
          url: m.url,
          preview: m.url,
          alt: m.alt ?? '',
          order: m.order ?? i,
        }))
      );
    } else if (!editingProduct) {
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
        status: 'DRAFT',
        publishOnline: false,
        publishPOS: false,
        productType: 'PHYSICAL',
        vendor: '',
        tags: '',
        template: 'DEFAULT_PRODUCT',
        inventoryTracked: true,
        quantity: '0',
        shopLocation: '',
        sku: '',
        barcode: '',
        sellOutOfStock: false,
        physicalProduct: true,
        weight: '0.0',
        weightUnit: 'KG',
        countryOfOrigin: '',
        hsCode: '',
        details: '',
        fitAndFabric: '',
        shippingAndReturn: '',
      });
      setSelectedCollectionIds([]);
      setProductMedia([]);
    }
  }, [editingProduct]);

  const handleMediaFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const newEntries: MediaEntry[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;
      newEntries.push({
        id: `file-${Date.now()}-${i}`,
        file,
        preview: URL.createObjectURL(file),
        alt: '',
        order: productMedia.length + i,
      });
    }
    setProductMedia((prev) => [...prev, ...newEntries]);
    e.target.value = '';
  };

  const removeMedia = (id: string) => {
    setProductMedia((prev) => {
      const item = prev.find((m) => m.id === id);
      if (item?.file && item.preview.startsWith('blob:')) URL.revokeObjectURL(item.preview);
      return prev.filter((m) => m.id !== id);
    });
  };

  const updateMediaAlt = (id: string, alt: string) => {
    setProductMedia((prev) => prev.map((m) => (m.id === id ? { ...m, alt } : m)));
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const mrp = Number(formData.price) || 0;
    const compareAtPrice = formData.compareAtPrice ? Number(formData.compareAtPrice) : undefined;
    const discountValue = formData.discountValue ? Number(formData.discountValue) : undefined;

    // Parse tags from comma-separated string
    const tags = formData.tags
      ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    // Build sizes from selected sizes + measurements
    const sizesPayload = selectedSizes.map((sizeName) => {
      const m = sizeMeasurements[sizeName];
      const measurements: { key: string; value: number; unit: string }[] = [];
      if (m?.bust) measurements.push({ key: 'Bust', value: parseFloat(m.bust) || 0, unit: 'inches' });
      if (m?.waist) measurements.push({ key: 'Waist', value: parseFloat(m.waist) || 0, unit: 'inches' });
      if (m?.hips) measurements.push({ key: 'Hips', value: parseFloat(m.hips) || 0, unit: 'inches' });
      if (m?.additional) {
        m.additional.forEach((a) => {
          if (a.name && a.value) measurements.push({ key: a.name, value: parseFloat(a.value) || 0, unit: 'inches' });
        });
      }
      return {
        sizeName,
        stockQuantity: parseInt(m?.stock || '0', 10),
        measurements: measurements.length > 0 ? measurements : undefined,
      };
    });

    // Build variants payload
    const variantsPayload = variants
      .filter((v) => v.name.trim())
      .flatMap((v) =>
        v.values.filter((val) => val.trim()).map((val) => ({
          optionName: v.name,
          optionValue: val,
          priceOverride: null,
          skuOverride: undefined,
        }))
      );

    // Upload new media files and build media array
    let mediaPayload: ProductMediaItem[] = [];
    if (productMedia.length > 0) {
      const uploaded: ProductMediaItem[] = [];
      for (let i = 0; i < productMedia.length; i++) {
        const m = productMedia[i];
        if (m.url && !m.file) {
          uploaded.push({ url: m.url, type: 'image', alt: m.alt, order: i });
        } else if (m.file) {
          try {
            const url = await uploadFile(m.file);
            uploaded.push({ url, type: 'image', alt: m.alt || undefined, order: i });
          } catch (err) {
            if (onSave) throw err;
            return;
          }
        }
      }
      mediaPayload = uploaded;
    }

    const payload: CreateProductRequest = {
      title: formData.title,
      productDescription: formData.description || undefined,
      productDetails: formData.productDetails || undefined,
      fitAndFabric: formData.fitAndFabric || undefined,
      shippingAndReturns: formData.shippingAndReturn || undefined,
      status: formData.status,
      publishOnlineStore: formData.publishOnline,
      publishPOS: formData.publishPOS,
      mrp,
      compareAtPrice,
      discountType: formData.discountType === 'percentage' ? 'PERCENTAGE' : 'FLAT',
      discountValue,
      inventoryTracked: formData.inventoryTracked,
      quantity: parseInt(formData.quantity, 10) || 0,
      sku: formData.sku || undefined,
      barcode: formData.barcode || undefined,
      allowOutOfStockSales: formData.sellOutOfStock,
      isPhysicalProduct: formData.physicalProduct,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      weightUnit: formData.weightUnit === 'KG' ? 'KG' : 'GRAM',
      countryOfOrigin: formData.countryOfOrigin || undefined,
      categoryId: formData.category || undefined,
      vendorId: formData.vendor || undefined,
      productType: formData.productType as 'PHYSICAL' | 'DIGITAL',
      themeTemplate: formData.template as 'DEFAULT_PRODUCT' | 'FEATURED_PRODUCT' | 'CUSTOM_PRODUCT',
      tags,
      collectionIds: selectedCollectionIds.length > 0 ? selectedCollectionIds : undefined,
      media: mediaPayload.length > 0 ? mediaPayload : undefined,
      variants: variantsPayload.length > 0 ? variantsPayload : [],
      sizes: sizesPayload.length > 0 ? sizesPayload : [],
    };
    if (onSave) {
      try {
        if (editingProduct?.id) {
          await Promise.resolve(onSave({ ...payload, id: editingProduct.id }));
        } else {
          await Promise.resolve(onSave(payload));
        }
        onClose();
      } catch {
        // Parent sets error
      }
    } else {
      onClose();
    }
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
              disabled={isSaving || !formData.title.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : editingProduct ? 'Update Product' : 'Save Product'}
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
                <input
                  ref={productMediaInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleMediaFileSelect}
                />
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-gray-50 transition-colors"
                  onClick={() => productMediaInputRef.current?.click()}
                >
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-blue-600 hover:text-blue-700 font-medium">Upload images</p>
                  <p className="text-sm text-gray-500 mt-1">Click or drop images here. Accepted: JPG, PNG, WebP, GIF</p>
                </div>
                {productMedia.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {productMedia.map((m) => (
                      <div key={m.id} className="relative group border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                        <img
                          src={m.preview}
                          alt={m.alt || 'Product'}
                          className="w-full aspect-square object-cover"
                        />
                        <div className="p-2">
                          <input
                            type="text"
                            value={m.alt}
                            onChange={(e) => updateMediaAlt(m.id, e.target.value)}
                            placeholder="Alt text"
                            className="w-full text-xs px-2 py-1 border border-gray-200 rounded"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeMedia(m.id)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Remove"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
                    <option value="">{loadingCategories ? 'Loading categories...' : 'Choose a product category'}</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {categories.length} categories available. Determines tax rates and adds metafields.
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
                        <option value="KG">kg</option>
                        <option value="GRAM">g</option>
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
                          className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${selectedSizes.includes(size)
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
                                        newMeasurements[size].additional = newMeasurements[size].additional?.filter((_, i) => i !== index);
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
                  <option value="DRAFT">Draft</option>
                  <option value="ACTIVE">Active</option>
                  <option value="ARCHIVED">Archived</option>
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
                    <label className="block text-sm text-gray-600 mb-2">Product Type</label>
                    <select
                      value={formData.productType}
                      onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="PHYSICAL">Physical</option>
                      <option value="DIGITAL">Digital</option>
                    </select>
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
                    <div className="border border-gray-300 dark:border-gray-600 rounded-lg max-h-40 overflow-y-auto">
                      {loadingCollections ? (
                        <p className="p-3 text-sm text-gray-400">Loading collections...</p>
                      ) : collections.length === 0 ? (
                        <p className="p-3 text-sm text-gray-400">No collections available</p>
                      ) : (
                        collections.map(collection => (
                          <label
                            key={collection.id}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedCollectionIds.includes(collection.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedCollectionIds([...selectedCollectionIds, collection.id]);
                                } else {
                                  setSelectedCollectionIds(selectedCollectionIds.filter(id => id !== collection.id));
                                }
                              }}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{collection.title}</span>
                          </label>
                        ))
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {selectedCollectionIds.length} of {collections.length} collections selected
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Tags</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="cotton, summer, casual (comma-separated)"
                    />
                    {formData.tags && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {formData.tags.split(',').map((tag, i) => tag.trim() && (
                          <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Theme Template */}
              <div className="bg-white rounded-lg shadow p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Theme template</label>
                <select
                  value={formData.template}
                  onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="DEFAULT_PRODUCT">Default product</option>
                  <option value="FEATURED_PRODUCT">Featured product</option>
                  <option value="CUSTOM_PRODUCT">Custom template</option>
                </select>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}