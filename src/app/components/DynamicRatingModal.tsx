import { useState, useEffect } from 'react';
import { Star, X, Upload } from 'lucide-react';
import { useReviewSettings } from '@/contexts/ReviewSettingsContext';

interface PaymentRecord {
  id: string;
  invoiceNumber: string;
  customerName: string;
  tailorName: string;
  orderType: string;
  amount: number;
  paidAmount: number;
  paymentDate: string;
  paymentMethod: 'Cash' | 'UPI' | 'Card' | 'Net Banking';
  transactionId?: string;
  rating?: number;
  fitRating?: number;
  finishingRating?: number;
  fabricQualityRating?: number;
  timelinessRating?: number;
  customerServiceRating?: number;
  review?: string;
  reviewImages?: string[];
  reviewDate?: string;
}

interface DynamicRatingModalProps {
  invoice: PaymentRecord;
  onClose: () => void;
  onRatingSubmit: (ratings: Record<string, number>, review: string, reviewImages: string[]) => void;
}

export function DynamicRatingModal({
  invoice,
  onClose,
  onRatingSubmit,
}: DynamicRatingModalProps) {
  const { settings } = useReviewSettings();
  
  // Dynamic ratings state
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [hoverRatings, setHoverRatings] = useState<Record<string, number>>({});
  const [review, setReview] = useState('');
  const [images, setImages] = useState<string[]>([]);

  // Initialize ratings for enabled fields
  useEffect(() => {
    const initialRatings: Record<string, number> = {};
    Object.entries(settings.ratingFields).forEach(([fieldName, field]) => {
      if (field.enabled) {
        initialRatings[fieldName] = 0;
      }
    });
    setRatings(initialRatings);
  }, [settings]);

  const handleSubmit = () => {
    // Validate required rating fields
    for (const [fieldName, field] of Object.entries(settings.ratingFields)) {
      if (field.enabled && field.required && (ratings[fieldName] === 0 || !ratings[fieldName])) {
        alert(`Please provide a rating for: ${field.label}`);
        return;
      }
    }

    // Validate review text
    if (settings.reviewText.enabled && settings.reviewText.required) {
      if (review.trim().length < settings.reviewText.minLength) {
        alert(`Review must be at least ${settings.reviewText.minLength} characters long`);
        return;
      }
      if (review.trim().length > settings.reviewText.maxLength) {
        alert(`Review must be less than ${settings.reviewText.maxLength} characters`);
        return;
      }
    }

    // Validate photos
    if (settings.photos.enabled && settings.photos.required && images.length === 0) {
      alert('Please upload at least one photo');
      return;
    }

    onRatingSubmit(ratings, review, images);
    
    // Reset form
    const resetRatings: Record<string, number> = {};
    Object.keys(ratings).forEach(key => {
      resetRatings[key] = 0;
    });
    setRatings(resetRatings);
    setHoverRatings({});
    setReview('');
    setImages([]);
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      if (images.length + files.length > settings.photos.maxPhotos) {
        alert(`You can only upload up to ${settings.photos.maxPhotos} images`);
        return;
      }

      const newImages: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result as string);
          if (newImages.length === files.length) {
            setImages([...images, ...newImages].slice(0, settings.photos.maxPhotos));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const renderStarRating = (fieldName: string, label: string, required: boolean) => {
    const currentRating = ratings[fieldName] || 0;
    const currentHover = hoverRatings[fieldName] || 0;

    return (
      <div key={fieldName}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRatings({ ...ratings, [fieldName]: star })}
              onMouseEnter={() => setHoverRatings({ ...hoverRatings, [fieldName]: star })}
              onMouseLeave={() => setHoverRatings({ ...hoverRatings, [fieldName]: 0 })}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                className={`w-10 h-10 transition-colors ${
                  star <= (currentHover || currentRating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            </button>
          ))}
          {currentRating > 0 && (
            <span className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
              {currentRating === 1 && 'Poor'}
              {currentRating === 2 && 'Fair'}
              {currentRating === 3 && 'Good'}
              {currentRating === 4 && 'Very Good'}
              {currentRating === 5 && 'Excellent'}
            </span>
          )}
        </div>
      </div>
    );
  };

  const isFormValid = () => {
    // Check required ratings
    for (const [fieldName, field] of Object.entries(settings.ratingFields)) {
      if (field.enabled && field.required && (ratings[fieldName] === 0 || !ratings[fieldName])) {
        return false;
      }
    }

    // Check required review text
    if (settings.reviewText.enabled && settings.reviewText.required) {
      if (review.trim().length < settings.reviewText.minLength) {
        return false;
      }
    }

    // Check required photos
    if (settings.photos.enabled && settings.photos.required && images.length === 0) {
      return false;
    }

    return true;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-lg z-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Rate Your Order</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Details */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Invoice Number:</span>
              <span className="font-medium text-gray-900 dark:text-white">{invoice.invoiceNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Customer:</span>
              <span className="font-medium text-gray-900 dark:text-white">{invoice.customerName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Tailor:</span>
              <span className="font-medium text-gray-900 dark:text-white">{invoice.tailorName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Order Type:</span>
              <span className="font-medium text-gray-900 dark:text-white">{invoice.orderType}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Amount:</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                ₹{invoice.amount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Dynamic Rating Fields */}
          {Object.entries(settings.ratingFields)
            .filter(([_, field]) => field.enabled)
            .map(([fieldName, field]) => renderStarRating(fieldName, field.label, field.required))}

          {/* Review Text */}
          {settings.reviewText.enabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Write your review
                {settings.reviewText.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder={settings.reviewText.placeholder}
                rows={5}
                maxLength={settings.reviewText.maxLength}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {settings.reviewText.required && `Minimum ${settings.reviewText.minLength} characters - `}
                ({review.length}/{settings.reviewText.maxLength})
              </p>
            </div>
          )}

          {/* Image Upload */}
          {settings.photos.enabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Add Photos
                {settings.photos.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Upload className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Upload Images</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={images.length >= settings.photos.maxPhotos}
                  />
                </label>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {images.length} / {settings.photos.maxPhotos} images
                </span>
              </div>

              {/* Image Previews */}
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-3 rounded-b-lg bg-gray-50 dark:bg-gray-900">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            Submit Rating
          </button>
        </div>
      </div>
    </div>
  );
}
