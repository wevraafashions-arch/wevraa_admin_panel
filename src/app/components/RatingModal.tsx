import { useState } from 'react';
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
  review?: string;
  reviewImages?: string[];
  reviewDate?: string;
}

interface RatingModalProps {
  invoice: PaymentRecord;
  onClose: () => void;
  onRatingSubmit: (rating: number, fitRating: number, finishingRating: number, review: string, reviewImages: string[]) => void;
}

export function RatingModal({
  invoice,
  onClose,
  onRatingSubmit,
}: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [fitRating, setFitRating] = useState(0);
  const [hoverFitRating, setHoverFitRating] = useState(0);
  const [finishingRating, setFinishingRating] = useState(0);
  const [hoverFinishingRating, setHoverFinishingRating] = useState(0);
  const [review, setReview] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const handleSubmit = () => {
    if (rating === 0) {
      alert('Please select an overall rating');
      return;
    }
    if (fitRating === 0) {
      alert('Please rate the fit');
      return;
    }
    if (finishingRating === 0) {
      alert('Please rate the finishing');
      return;
    }
    if (review.trim().length < 10) {
      alert('Please write a review (minimum 10 characters)');
      return;
    }
    onRatingSubmit(rating, fitRating, finishingRating, review, images);
    // Reset form
    setRating(0);
    setHoverRating(0);
    setFitRating(0);
    setHoverFitRating(0);
    setFinishingRating(0);
    setHoverFinishingRating(0);
    setReview('');
    setImages([]);
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result as string);
          if (newImages.length === files.length) {
            setImages([...images, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-lg">
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

          {/* Rating Stars */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              How would you rate this service?
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                  {rating === 1 && 'Poor'}
                  {rating === 2 && 'Fair'}
                  {rating === 3 && 'Good'}
                  {rating === 4 && 'Very Good'}
                  {rating === 5 && 'Excellent'}
                </span>
              )}
            </div>
          </div>

          {/* Fit Rating Stars */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              How would you rate the fit?
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFitRating(star)}
                  onMouseEnter={() => setHoverFitRating(star)}
                  onMouseLeave={() => setHoverFitRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${
                      star <= (hoverFitRating || fitRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                </button>
              ))}
              {fitRating > 0 && (
                <span className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                  {fitRating === 1 && 'Poor'}
                  {fitRating === 2 && 'Fair'}
                  {fitRating === 3 && 'Good'}
                  {fitRating === 4 && 'Very Good'}
                  {fitRating === 5 && 'Excellent'}
                </span>
              )}
            </div>
          </div>

          {/* Finishing Rating Stars */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              How would you rate the finishing?
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFinishingRating(star)}
                  onMouseEnter={() => setHoverFinishingRating(star)}
                  onMouseLeave={() => setHoverFinishingRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${
                      star <= (hoverFinishingRating || finishingRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                </button>
              ))}
              {finishingRating > 0 && (
                <span className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                  {finishingRating === 1 && 'Poor'}
                  {finishingRating === 2 && 'Fair'}
                  {finishingRating === 3 && 'Good'}
                  {finishingRating === 4 && 'Very Good'}
                  {finishingRating === 5 && 'Excellent'}
                </span>
              )}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Write your review
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience with the tailoring service, quality, delivery, and overall satisfaction..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Minimum 10 characters ({review.length}/500)
            </p>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Add Photos (Optional)
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
                />
              </label>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                You can upload up to 5 images
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
            disabled={rating === 0 || fitRating === 0 || finishingRating === 0 || review.trim().length < 10}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            Submit Rating
          </button>
        </div>
      </div>
    </div>
  );
}