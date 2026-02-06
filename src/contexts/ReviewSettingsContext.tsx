import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ReviewSettings {
  ratingFields: {
    overallRating: {
      enabled: boolean;
      required: boolean;
      label: string;
    };
    fitRating: {
      enabled: boolean;
      required: boolean;
      label: string;
    };
    finishingRating: {
      enabled: boolean;
      required: boolean;
      label: string;
    };
    fabricQualityRating: {
      enabled: boolean;
      required: boolean;
      label: string;
    };
    timelinessRating: {
      enabled: boolean;
      required: boolean;
      label: string;
    };
    customerServiceRating: {
      enabled: boolean;
      required: boolean;
      label: string;
    };
  };
  reviewText: {
    enabled: boolean;
    required: boolean;
    minLength: number;
    maxLength: number;
    placeholder: string;
  };
  photos: {
    enabled: boolean;
    required: boolean;
    maxPhotos: number;
  };
  autoPublish: boolean;
  allowAnonymous: boolean;
  moderationEnabled: boolean;
}

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

interface ReviewSettingsContextType {
  settings: ReviewSettings;
  updateSettings: (settings: ReviewSettings) => void;
  loadSettings: () => void;
}

const ReviewSettingsContext = createContext<ReviewSettingsContextType | undefined>(undefined);

export function ReviewSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ReviewSettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const stored = localStorage.getItem('reviewSettings');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSettings(parsed);
      } catch (error) {
        console.error('Failed to load review settings:', error);
      }
    }
  };

  const updateSettings = (newSettings: ReviewSettings) => {
    setSettings(newSettings);
    localStorage.setItem('reviewSettings', JSON.stringify(newSettings));
  };

  return (
    <ReviewSettingsContext.Provider value={{ settings, updateSettings, loadSettings }}>
      {children}
    </ReviewSettingsContext.Provider>
  );
}

export function useReviewSettings() {
  const context = useContext(ReviewSettingsContext);
  if (context === undefined) {
    throw new Error('useReviewSettings must be used within a ReviewSettingsProvider');
  }
  return context;
}