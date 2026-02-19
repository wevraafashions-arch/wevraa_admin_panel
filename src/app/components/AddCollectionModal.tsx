import { X, Bold, Italic, Underline, ChevronDown, Search, Image as ImageIcon, Tag, Loader2 } from 'lucide-react';
import { useState, useRef } from 'react';
import { collectionsService } from '../api/services/collectionsService';
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

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCollectionType('MANUAL');
    setThemeTemplate('default');
    setSalesChannels({ onlineStore: false, pointOfSale: false });
    removeImage();
    setError(null);
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
      if (imageFile) {
        // Use multipart endpoint
        await collectionsService.createWithImage({
          title: title.trim(),
          description: description.trim() || undefined,
          type: collectionType,
          themeTemplate: themeTemplate || undefined,
          publishOnlineStore: salesChannels.onlineStore,
          publishPOS: salesChannels.pointOfSale,
          image: imageFile,
        });
      } else {
        // Use JSON endpoint
        await collectionsService.create({
          title: title.trim(),
          description: description.trim() || undefined,
          type: collectionType,
          themeTemplate: themeTemplate || undefined,
          publishOnlineStore: salesChannels.onlineStore,
          publishPOS: salesChannels.pointOfSale,
        });
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
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Products</h3>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search products"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
                  Browse
                </button>
                <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[160px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>Sort: Best selling</option>
                  <option>Sort: Newest</option>
                  <option>Sort: Price (Low to High)</option>
                  <option>Sort: Price (High to Low)</option>
                </select>
              </div>

              {/* Empty State */}
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Tag className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-900 dark:text-white font-medium mb-1">There are no products in this collection.</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Search or browse to add products.</p>
              </div>
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
