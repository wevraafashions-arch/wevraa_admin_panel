import { useState } from 'react';
import { X, Check } from 'lucide-react';

interface DesignGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selectedImages: string[]) => void;
  maxSelection?: number;
}

export function DesignGalleryModal({ isOpen, onClose, onSelect, maxSelection }: DesignGalleryModalProps) {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  // Sample gallery images
  const galleryImages = [
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
    'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400',
    'https://images.unsplash.com/photo-1610652490818-a7e4c4d0e3f0?w=400',
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
    'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400',
    'https://images.unsplash.com/photo-1622124358717-e0b1a3cf5c61?w=400',
    'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=400',
    'https://images.unsplash.com/photo-1558769132-cb1aea1c8347?w=400',
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400',
    'https://images.unsplash.com/photo-1583391733981-e99d4b4e2b40?w=400',
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
    'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=400',
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
    'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400',
    'https://images.unsplash.com/photo-1610652490818-a7e4c4d0e3f0?w=400',
    'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400',
  ];

  if (!isOpen) return null;

  const toggleImageSelection = (image: string) => {
    if (selectedImages.includes(image)) {
      setSelectedImages(selectedImages.filter(img => img !== image));
    } else {
      if (maxSelection && selectedImages.length >= maxSelection) {
        alert(`You can only select up to ${maxSelection} images`);
        return;
      }
      setSelectedImages([...selectedImages, image]);
    }
  };

  const handleConfirm = () => {
    onSelect(selectedImages);
    setSelectedImages([]);
    onClose();
  };

  const handleCancel = () => {
    setSelectedImages([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl rounded-lg shadow-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Design Gallery</h2>
            <p className="text-sm text-gray-500 mt-1">
              Select images from the gallery
              {maxSelection && ` (max ${maxSelection})`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
              {selectedImages.length} selected
            </span>
            <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {galleryImages.map((image, index) => {
              const isSelected = selectedImages.includes(image);
              return (
                <div
                  key={index}
                  onClick={() => toggleImageSelection(image)}
                  className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-32 object-cover"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {selectedImages.length} image{selectedImages.length !== 1 ? 's' : ''} selected
            {maxSelection && ` of ${maxSelection} maximum`}
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedImages.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Confirm Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
