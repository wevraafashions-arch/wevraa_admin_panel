import { X, Bold, Italic, Underline, ChevronDown, Search, Image as ImageIcon, Tag } from 'lucide-react';
import { useState } from 'react';

interface AddCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddCollectionModal({ isOpen, onClose }: AddCollectionModalProps) {
  const [collectionType, setCollectionType] = useState<'manual' | 'smart'>('manual');
  const [salesChannels, setSalesChannels] = useState({
    onlineStore: false,
    pointOfSale: false,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center overflow-y-auto">
      <div className="bg-gray-50 min-h-screen w-full py-4 px-4 md:px-6">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="text-xl font-semibold text-gray-900">Add collection</h2>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
                Discard
              </button>
              <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white rounded-lg shadow p-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Title
              </label>
              <input
                type="text"
                placeholder="e.g., Summer collection, Under ₹100, Staff picks"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow p-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Description
              </label>
              <div className="border border-gray-300 rounded-lg">
                {/* Rich Text Toolbar */}
                <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-200 bg-gray-50">
                  <select className="px-2 py-1 text-sm border-none bg-transparent text-gray-700">
                    <option>Paragraph</option>
                    <option>Heading 1</option>
                    <option>Heading 2</option>
                  </select>
                  <div className="w-px h-6 bg-gray-300 mx-1"></div>
                  <button className="p-1.5 hover:bg-gray-200 rounded">
                    <Bold className="w-4 h-4 text-gray-700" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-200 rounded">
                    <Italic className="w-4 h-4 text-gray-700" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-200 rounded">
                    <Underline className="w-4 h-4 text-gray-700" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-200 rounded flex items-center gap-1">
                    <span className="text-sm text-gray-700">A</span>
                    <ChevronDown className="w-3 h-3 text-gray-700" />
                  </button>
                  <div className="w-px h-6 bg-gray-300 mx-1"></div>
                  <button className="p-1.5 hover:bg-gray-200 rounded flex items-center gap-1">
                    <div className="flex flex-col gap-0.5">
                      <div className="h-0.5 w-3 bg-gray-700"></div>
                      <div className="h-0.5 w-3 bg-gray-700"></div>
                      <div className="h-0.5 w-3 bg-gray-700"></div>
                    </div>
                    <ChevronDown className="w-3 h-3 text-gray-700" />
                  </button>
                  <div className="w-px h-6 bg-gray-300 mx-1"></div>
                  <button className="p-1.5 hover:bg-gray-200 rounded">
                    <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 16 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8h10M8 3l5 5-5 5" />
                    </svg>
                  </button>
                  <button className="p-1.5 hover:bg-gray-200 rounded">
                    <ImageIcon className="w-4 h-4 text-gray-700" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-200 rounded">
                    <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 16 16">
                      <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.5" />
                      <path stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="M8 5v3.5M8 11v.5" />
                    </svg>
                  </button>
                  <button className="p-1.5 hover:bg-gray-200 rounded">
                    <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 16 16">
                      <rect width="12" height="10" x="2" y="3" stroke="currentColor" strokeWidth="1.5" rx="1" />
                      <path stroke="currentColor" strokeWidth="1.5" d="M5 6h6M5 9h4" />
                    </svg>
                  </button>
                  <button className="p-1.5 hover:bg-gray-200 rounded">
                    <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 16 16">
                      <circle cx="5" cy="5" r="1" fill="currentColor" />
                      <circle cx="5" cy="8" r="1" fill="currentColor" />
                      <circle cx="5" cy="11" r="1" fill="currentColor" />
                      <circle cx="8" cy="5" r="1" fill="currentColor" />
                      <circle cx="8" cy="8" r="1" fill="currentColor" />
                      <circle cx="8" cy="11" r="1" fill="currentColor" />
                      <circle cx="11" cy="5" r="1" fill="currentColor" />
                      <circle cx="11" cy="8" r="1" fill="currentColor" />
                      <circle cx="11" cy="11" r="1" fill="currentColor" />
                    </svg>
                  </button>
                  <div className="flex-1"></div>
                  <button className="p-1.5 hover:bg-gray-200 rounded">
                    <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 16 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8h10M8 3v10" />
                    </svg>
                  </button>
                </div>
                {/* Text Area */}
                <textarea
                  className="w-full px-3 py-3 min-h-[120px] focus:outline-none resize-none"
                  placeholder="Start typing..."
                />
              </div>
            </div>

            {/* Collection Type */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Collection type</h3>
              
              <div className="space-y-4">
                {/* Manual */}
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    id="manual"
                    name="collectionType"
                    checked={collectionType === 'manual'}
                    onChange={() => setCollectionType('manual')}
                    className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <label htmlFor="manual" className="text-sm font-medium text-gray-900 cursor-pointer">
                      Manual
                    </label>
                    <p className="text-sm text-gray-600 mt-1">
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
                    checked={collectionType === 'smart'}
                    onChange={() => setCollectionType('smart')}
                    className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <label htmlFor="smart" className="text-sm font-medium text-gray-900 cursor-pointer">
                      Smart
                    </label>
                    <p className="text-sm text-gray-600 mt-1">
                      Existing and future products that match the conditions you set will automatically be added to this collection. Learn more about{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-700">smart collections</a>.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Products</h3>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search products"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Browse
                </button>
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[160px]">
                  <option>Sort: Best selling</option>
                  <option>Sort: Newest</option>
                  <option>Sort: Price (Low to High)</option>
                  <option>Sort: Price (High to Low)</option>
                </select>
              </div>

              {/* Empty State */}
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Tag className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-900 font-medium mb-1">There are no products in this collection.</p>
                <p className="text-gray-600 text-sm">Search or browse to add products.</p>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Publishing */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-900">Publishing</h3>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-700">Manage</a>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-900 mb-3">Sales channels</p>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={salesChannels.onlineStore}
                      onChange={(e) => setSalesChannels({ ...salesChannels, onlineStore: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Online Store</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={salesChannels.pointOfSale}
                      onChange={(e) => setSalesChannels({ ...salesChannels, pointOfSale: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Point of Sale</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Image</h3>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors mb-2">
                  Add image
                </button>
                <p className="text-sm text-gray-500">or drop an image to upload</p>
              </div>
            </div>

            {/* Theme Template */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Theme template</h3>
              
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Default collection</option>
                <option>Featured collection</option>
                <option>Grid collection</option>
                <option>List collection</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
