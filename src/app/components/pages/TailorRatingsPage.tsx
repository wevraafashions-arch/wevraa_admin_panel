import { useState } from 'react';
import { Star, Settings, Save, RotateCcw, MessageSquare, Image as ImageIcon } from 'lucide-react';
import { useReviewSettings } from '@/contexts/ReviewSettingsContext';
import { ReviewSettings } from '@/contexts/ReviewSettingsContext';

export function TailorRatingsPage() {
  const { settings, updateSettings } = useReviewSettings();
  const [localSettings, setLocalSettings] = useState<ReviewSettings>(settings);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<'rating-fields' | 'review-text' | 'photos' | 'general'>('rating-fields');

  const handleRatingFieldChange = (
    fieldName: keyof ReviewSettings['ratingFields'],
    property: 'enabled' | 'required' | 'label',
    value: boolean | string
  ) => {
    setLocalSettings((prev) => ({
      ...prev,
      ratingFields: {
        ...prev.ratingFields,
        [fieldName]: {
          ...prev.ratingFields[fieldName],
          [property]: value,
        },
      },
    }));
    setHasChanges(true);
  };

  const handleReviewTextChange = (
    property: keyof ReviewSettings['reviewText'],
    value: boolean | number | string
  ) => {
    setLocalSettings((prev) => ({
      ...prev,
      reviewText: {
        ...prev.reviewText,
        [property]: value,
      },
    }));
    setHasChanges(true);
  };

  const handlePhotosChange = (
    property: keyof ReviewSettings['photos'],
    value: boolean | number
  ) => {
    setLocalSettings((prev) => ({
      ...prev,
      photos: {
        ...prev.photos,
        [property]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleGeneralSettingChange = (
    setting: 'autoPublish' | 'allowAnonymous' | 'moderationEnabled',
    value: boolean
  ) => {
    setLocalSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updateSettings(localSettings);
    setHasChanges(false);
    alert('Review settings saved successfully!');
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset to default settings?')) {
      const defaultSettings: ReviewSettings = {
        ratingFields: {
          overallRating: {
            enabled: true,
            required: true,
            label: 'How would you rate this service?',
          },
          fitRating: {
            enabled: true,
            required: true,
            label: 'How would you rate the fit?',
          },
          finishingRating: {
            enabled: true,
            required: true,
            label: 'How would you rate the finishing?',
          },
          fabricQualityRating: {
            enabled: false,
            required: false,
            label: 'How would you rate the fabric quality?',
          },
          timelinessRating: {
            enabled: false,
            required: false,
            label: 'How would you rate the delivery timeliness?',
          },
          customerServiceRating: {
            enabled: false,
            required: false,
            label: 'How would you rate the customer service?',
          },
        },
        reviewText: {
          enabled: true,
          required: true,
          minLength: 10,
          maxLength: 500,
          placeholder: 'Share your experience with the tailoring service, quality, delivery, and overall satisfaction...',
        },
        photos: {
          enabled: true,
          required: false,
          maxPhotos: 5,
        },
        autoPublish: false,
        moderationEnabled: true,
        allowAnonymous: false,
      };
      setLocalSettings(defaultSettings);
      setHasChanges(true);
    }
  };

  const getRatingFieldDisplayName = (fieldName: string) => {
    const names: Record<string, string> = {
      overallRating: 'Overall Service Rating',
      fitRating: 'Fit Rating',
      finishingRating: 'Finishing Rating',
      fabricQualityRating: 'Fabric Quality Rating',
      timelinessRating: 'Timeliness Rating',
      customerServiceRating: 'Customer Service Rating',
    };
    return names[fieldName] || fieldName;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Tailor Ratings & Reviews Configuration</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Configure which ratings and fields are required for customer reviews
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Default
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Warning Banner */}
      {hasChanges && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Settings className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Unsaved Changes
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                You have unsaved changes. Click "Save Changes" to apply them.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('rating-fields')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'rating-fields'
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Rating Fields
            </div>
          </button>
          <button
            onClick={() => setActiveTab('review-text')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'review-text'
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Review Text
            </div>
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'photos'
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Photos
            </div>
          </button>
          <button
            onClick={() => setActiveTab('general')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'general'
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              General Settings
            </div>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Rating Fields Tab */}
        {activeTab === 'rating-fields' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Rating Fields Configuration
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Choose which rating questions to show to customers when they review their orders
              </p>
            </div>

            <div className="p-6 space-y-6">
              {Object.entries(localSettings.ratingFields).map(([fieldName, field]) => (
                <div
                  key={fieldName}
                  className={`border rounded-lg p-5 transition-all ${
                    field.enabled
                      ? 'border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-900/10'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={field.enabled}
                            onChange={(e) =>
                              handleRatingFieldChange(
                                fieldName as keyof ReviewSettings['ratingFields'],
                                'enabled',
                                e.target.checked
                              )
                            }
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-base font-semibold text-gray-900 dark:text-white">
                            {getRatingFieldDisplayName(fieldName)}
                          </span>
                        </label>
                        {field.enabled && field.required && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                            Required
                          </span>
                        )}
                        {field.enabled && !field.required && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                            Optional
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) =>
                          handleRatingFieldChange(
                            fieldName as keyof ReviewSettings['ratingFields'],
                            'label',
                            e.target.value
                          )
                        }
                        disabled={!field.enabled}
                        placeholder="Enter question label..."
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={field.required}
                        disabled={!field.enabled}
                        onChange={(e) =>
                          handleRatingFieldChange(
                            fieldName as keyof ReviewSettings['ratingFields'],
                            'required',
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Make this rating required for customers
                      </span>
                    </label>

                    {field.enabled && (
                      <div className="flex items-center gap-1 text-yellow-500">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-5 h-5 fill-yellow-400" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Review Text Tab */}
        {activeTab === 'review-text' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                Review Text Configuration
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Configure review text requirements and validation rules
              </p>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.reviewText.enabled}
                    onChange={(e) => handleReviewTextChange('enabled', e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Enable Review Text Field
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.reviewText.required}
                    disabled={!localSettings.reviewText.enabled}
                    onChange={(e) => handleReviewTextChange('required', e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Make Required
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Minimum Length (characters)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={localSettings.reviewText.minLength}
                    onChange={(e) => handleReviewTextChange('minLength', parseInt(e.target.value) || 0)}
                    disabled={!localSettings.reviewText.enabled}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Minimum characters required for review text
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Maximum Length (characters)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="5000"
                    value={localSettings.reviewText.maxLength}
                    onChange={(e) => handleReviewTextChange('maxLength', parseInt(e.target.value) || 500)}
                    disabled={!localSettings.reviewText.enabled}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Maximum characters allowed for review text
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Placeholder Text
                </label>
                <textarea
                  value={localSettings.reviewText.placeholder}
                  onChange={(e) => handleReviewTextChange('placeholder', e.target.value)}
                  disabled={!localSettings.reviewText.enabled}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                  placeholder="Enter placeholder text..."
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  This text will appear as a placeholder in the review text area
                </p>
              </div>

              {/* Preview */}
              {localSettings.reviewText.enabled && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Preview</h3>
                  <textarea
                    placeholder={localSettings.reviewText.placeholder}
                    rows={4}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {localSettings.reviewText.required && 'Required - '}
                    {localSettings.reviewText.minLength} - {localSettings.reviewText.maxLength} characters
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Photos Tab */}
        {activeTab === 'photos' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-purple-500" />
                Photo Upload Configuration
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Configure photo upload options for customer reviews
              </p>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.photos.enabled}
                    onChange={(e) => handlePhotosChange('enabled', e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Enable Photo Uploads
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.photos.required}
                    disabled={!localSettings.photos.enabled}
                    onChange={(e) => handlePhotosChange('required', e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Make Required
                  </span>
                </label>
              </div>

              <div className="max-w-md">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maximum Number of Photos
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={localSettings.photos.maxPhotos}
                  onChange={(e) => handlePhotosChange('maxPhotos', parseInt(e.target.value) || 1)}
                  disabled={!localSettings.photos.enabled}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Customers can upload up to this many photos with their review (1-10)
                </p>
              </div>

              {/* Preview */}
              {localSettings.photos.enabled && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Preview</h3>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center bg-gray-50 dark:bg-gray-900">
                    <ImageIcon className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {localSettings.photos.required ? 'Required: ' : 'Optional: '}
                      Upload up to {localSettings.photos.maxPhotos} {localSettings.photos.maxPhotos === 1 ? 'photo' : 'photos'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* General Settings Tab */}
        {activeTab === 'general' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-green-500" />
                General Review Settings
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Configure general review behavior and moderation options
              </p>
            </div>

            <div className="p-6 space-y-5">
              <label className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={localSettings.autoPublish}
                  onChange={(e) => handleGeneralSettingChange('autoPublish', e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                />
                <div className="flex-1">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white block mb-1">
                    Auto-publish reviews
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Automatically publish customer reviews without requiring admin approval. Reviews will be visible immediately after submission.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={localSettings.moderationEnabled}
                  onChange={(e) => handleGeneralSettingChange('moderationEnabled', e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                />
                <div className="flex-1">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white block mb-1">
                    Enable moderation
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Require admin approval before reviews are published. This gives you control over which reviews appear publicly.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={localSettings.allowAnonymous}
                  onChange={(e) => handleGeneralSettingChange('allowAnonymous', e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                />
                <div className="flex-1">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white block mb-1">
                    Allow anonymous reviews
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Allow customers to submit reviews without showing their name publicly. Customer information will still be stored for admin reference.
                  </span>
                </div>
              </label>

              {/* Settings Summary */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">Current Configuration Summary</h3>
                <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-300">
                  <li>• Reviews will be {localSettings.autoPublish ? 'auto-published' : 'held for moderation'}</li>
                  <li>• Admin moderation is {localSettings.moderationEnabled ? 'enabled' : 'disabled'}</li>
                  <li>• Anonymous reviews are {localSettings.allowAnonymous ? 'allowed' : 'not allowed'}</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Live Preview Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Customer View Preview
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            This is what customers will see when they submit a review
          </p>
        </div>

        <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900">
          {/* Enabled Rating Fields */}
          {Object.entries(localSettings.ratingFields)
            .filter(([_, field]) => field.enabled)
            .map(([fieldName, field]) => (
              <div key={fieldName}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-8 h-8 text-gray-300 dark:text-gray-600"
                    />
                  ))}
                </div>
              </div>
            ))}

          {/* Review Text */}
          {localSettings.reviewText.enabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Write your review
                {localSettings.reviewText.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <textarea
                placeholder={localSettings.reviewText.placeholder}
                rows={4}
                disabled
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {localSettings.reviewText.minLength} - {localSettings.reviewText.maxLength} characters
              </p>
            </div>
          )}

          {/* Photo Upload */}
          {localSettings.photos.enabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Add Photos
                {localSettings.photos.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center bg-white dark:bg-gray-800">
                <ImageIcon className="w-8 h-8 mx-auto text-gray-400 dark:text-gray-600 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Upload up to {localSettings.photos.maxPhotos} {localSettings.photos.maxPhotos === 1 ? 'photo' : 'photos'}
                </p>
              </div>
            </div>
          )}

          {/* No fields enabled warning */}
          {!Object.values(localSettings.ratingFields).some(f => f.enabled) &&
           !localSettings.reviewText.enabled &&
           !localSettings.photos.enabled && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No review fields are currently enabled. Enable at least one field above.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
