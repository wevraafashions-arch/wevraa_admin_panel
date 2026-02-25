import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { designsService } from '../api/services/designsService';
import type { Design } from '../api/types/design';
import { ApiError } from '../api/client';

interface DesignGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selectedImages: string[]) => void;
  maxSelection?: number;
}

export function DesignGalleryModal({ isOpen, onClose, onSelect, maxSelection }: DesignGalleryModalProps) {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError(null);
      setSelectedImages([]);
      designsService
        .getList()
        .then(setDesigns)
        .catch((e) => setError(e instanceof ApiError ? e.message : 'Failed to load designs'))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleImageSelection = (imageUrl: string) => {
    if (selectedImages.includes(imageUrl)) {
      setSelectedImages(selectedImages.filter((url) => url !== imageUrl));
    } else {
      if (maxSelection && selectedImages.length >= maxSelection) {
        alert(`You can only select up to ${maxSelection} images`);
        return;
      }
      setSelectedImages([...selectedImages, imageUrl]);
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
      <div className="bg-white dark:bg-gray-800 w-full max-w-5xl rounded-lg shadow-xl max-h-[90vh] flex flex-col">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Design Gallery</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Select images from the gallery
              {maxSelection != null && ` (max ${maxSelection})`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm font-semibold rounded-full">
              {selectedImages.length} selected
            </span>
            <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}
          {loading ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading designs…</p>
          ) : designs.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No designs in the gallery yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {designs.map((design) => {
                const isSelected = selectedImages.includes(design.imageUrl);
                return (
                  <div
                    key={design.id}
                    onClick={() => toggleImageSelection(design.imageUrl)}
                    className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <img
                      src={design.imageUrl}
                      alt={design.designName}
                      className="w-full h-32 object-cover"
                    />
                    <p className="p-2 text-xs text-gray-600 dark:text-gray-400 truncate" title={design.designName}>
                      {design.designName}
                    </p>
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
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {selectedImages.length} image{selectedImages.length !== 1 ? 's' : ''} selected
            {maxSelection != null && ` of ${maxSelection} maximum`}
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedImages.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed dark:disabled:bg-gray-600"
            >
              Confirm Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
