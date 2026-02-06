import { useState } from 'react';
import { Save, Bell, Lock, Palette, Globe, Mail, Database, Check, X, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

interface Settings {
  businessName: string;
  timezone: string;
  currency: string;
  dateFormat: string;
  language: string;
  accentColor: string;
  compactMode: boolean;
  fromEmail: string;
  supportEmail: string;
  notifications: {
    newOrders: boolean;
    paymentReceived: boolean;
    lowStockAlerts: boolean;
    overdueInvoices: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
  };
}

interface SettingsPageProps {
  onNavigate?: (page: string) => void;
}

export function SettingsPage({ onNavigate }: SettingsPageProps = {}) {
  const { theme, setTheme } = useTheme();
  const [hasChanges, setHasChanges] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [settings, setSettings] = useState<Settings>({
    businessName: 'Wevraa',
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    dateFormat: 'DD/MM/YYYY',
    language: 'English',
    accentColor: '#3B82F6',
    compactMode: false,
    fromEmail: 'noreply@wevraa.in',
    supportEmail: 'support@wevraa.in',
    notifications: {
      newOrders: true,
      paymentReceived: true,
      lowStockAlerts: true,
      overdueInvoices: true,
      emailNotifications: true,
      smsNotifications: false,
    },
  });

  const indianTimezones = [
    { value: 'Asia/Kolkata', label: 'India Standard Time (IST) - GMT+5:30' },
    { value: 'Asia/Mumbai', label: 'Mumbai Time - GMT+5:30' },
    { value: 'Asia/Delhi', label: 'Delhi Time - GMT+5:30' },
    { value: 'Asia/Chennai', label: 'Chennai Time - GMT+5:30' },
    { value: 'Asia/Bangalore', label: 'Bangalore Time - GMT+5:30' },
  ];

  const currencies = [
    { value: 'INR', label: '₹ INR - Indian Rupee', symbol: '₹' },
    { value: 'USD', label: '$ USD - US Dollar', symbol: '$' },
    { value: 'EUR', label: '€ EUR - Euro', symbol: '€' },
    { value: 'GBP', label: '£ GBP - British Pound', symbol: '£' },
    { value: 'AED', label: 'د.إ AED - UAE Dirham', symbol: 'د.إ' },
    { value: 'SAR', label: 'ر.س SAR - Saudi Riyal', symbol: 'ر.س' },
  ];

  const dateFormats = [
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (15/01/2026)' },
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (01/15/2026)' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2026-01-15)' },
    { value: 'DD-MM-YYYY', label: 'DD-MM-YYYY (15-01-2026)' },
  ];

  const languages = [
    { value: 'English', label: 'English' },
    { value: 'Hindi', label: 'हिन्दी (Hindi)' },
    { value: 'Tamil', label: 'தமிழ் (Tamil)' },
    { value: 'Telugu', label: 'తెలుగు (Telugu)' },
    { value: 'Kannada', label: 'ಕನ್ನಡ (Kannada)' },
    { value: 'Malayalam', label: 'മലയാളം (Malayalam)' },
  ];

  const accentColors = [
    { value: '#3B82F6', label: 'Blue', class: 'bg-blue-500' },
    { value: '#8B5CF6', label: 'Purple', class: 'bg-purple-500' },
    { value: '#EC4899', label: 'Pink', class: 'bg-pink-500' },
    { value: '#10B981', label: 'Green', class: 'bg-green-500' },
    { value: '#F59E0B', label: 'Amber', class: 'bg-amber-500' },
    { value: '#EF4444', label: 'Red', class: 'bg-red-500' },
    { value: '#14B8A6', label: 'Teal', class: 'bg-teal-500' },
    { value: '#6366F1', label: 'Indigo', class: 'bg-indigo-500' },
  ];

  const handleSettingChange = (field: keyof Settings, value: any) => {
    setSettings({ ...settings, [field]: value });
    setHasChanges(true);
  };

  const handleNotificationChange = (field: keyof Settings['notifications'], value: boolean) => {
    setSettings({
      ...settings,
      notifications: { ...settings.notifications, [field]: value },
    });
    setHasChanges(true);
  };

  const handleSaveSettings = () => {
    // Save settings logic here
    console.log('Saving settings:', settings);
    setHasChanges(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCancelChanges = () => {
    // Reset to original settings
    setHasChanges(false);
  };

  const handleChangePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      alert('Password must be at least 8 characters long!');
      return;
    }
    // Change password logic here
    console.log('Changing password...');
    setShowPasswordModal(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    alert('Password changed successfully!');
  };

  const handleExportData = () => {
    // Export data logic
    alert('Exporting data... This will download all your business data.');
  };

  const handleBackupSystem = () => {
    // Backup system logic
    alert('Creating system backup... This may take a few minutes.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Settings</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage application preferences and configurations</p>
        </div>
        {showSuccess && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-lg">
            <Check className="w-5 h-5" />
            <span className="text-sm font-medium">Settings saved successfully!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">General Settings</h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Business Name</label>
                <input
                  type="text"
                  value={settings.businessName}
                  onChange={(e) => handleSettingChange('businessName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter business name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time Zone</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => handleSettingChange('timezone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {indianTimezones.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Current time: {new Date().toLocaleString('en-IN', { timeZone: settings.timezone })}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Currency</label>
                <select
                  value={settings.currency}
                  onChange={(e) => handleSettingChange('currency', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {currencies.map((curr) => (
                    <option key={curr.value} value={curr.value}>
                      {curr.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  All prices will be displayed in {currencies.find(c => c.value === settings.currency)?.symbol}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Format</label>
                <select
                  value={settings.dateFormat}
                  onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {dateFormats.map((format) => (
                    <option key={format.value} value={format.value}>
                      {format.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {languages.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Light', 'Dark', 'Auto'] as const).map((themeOption) => (
                    <button
                      key={themeOption}
                      onClick={() => {
                        setTheme(themeOption);
                        setHasChanges(true);
                      }}
                      className={`px-4 py-3 border-2 rounded-lg transition-all ${
                        theme === themeOption
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}
                    >
                      <div className="text-sm font-medium">{themeOption}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Accent Color</label>
                <div className="grid grid-cols-4 gap-3">
                  {accentColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => handleSettingChange('accentColor', color.value)}
                      className={`relative px-4 py-3 border-2 rounded-lg transition-all ${
                        settings.accentColor === color.value
                          ? 'border-gray-900 dark:border-white ring-2 ring-gray-300 dark:ring-gray-600'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      } bg-white dark:bg-gray-700`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full ${color.class}`}></div>
                        <span className="text-xs font-medium text-gray-900 dark:text-white">{color.label}</span>
                      </div>
                      {settings.accentColor === color.value && (
                        <Check className="w-4 h-4 absolute top-1 right-1 text-gray-900 dark:text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Compact Mode</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Reduce spacing and padding for more content</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.compactMode}
                    onChange={(e) => handleSettingChange('compactMode', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notification Preferences</h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">New Orders</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get notified when new orders are placed</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.newOrders}
                    onChange={(e) => handleNotificationChange('newOrders', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Payment Received</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Notifications for successful payments</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.paymentReceived}
                    onChange={(e) => handleNotificationChange('paymentReceived', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Low Stock Alerts</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Alert when inventory is running low</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.lowStockAlerts}
                    onChange={(e) => handleNotificationChange('lowStockAlerts', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Overdue Invoices</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Reminders for unpaid invoices</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.overdueInvoices}
                    onChange={(e) => handleNotificationChange('overdueInvoices', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Notification Channels</h4>
                
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receive notifications via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.emailNotifications}
                      onChange={(e) => handleNotificationChange('emailNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">SMS Notifications</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receive notifications via SMS</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.smsNotifications}
                      onChange={(e) => handleNotificationChange('smsNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Email Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Email Settings</h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">From Email</label>
                <input
                  type="email"
                  value={settings.fromEmail}
                  onChange={(e) => handleSettingChange('fromEmail', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="noreply@wevraa.in"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Email address used for sending automated emails</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Support Email</label>
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => handleSettingChange('supportEmail', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="support@wevraa.in"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Customer support contact email</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          {/* Security */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security</h3>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full text-left px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <p className="font-medium text-gray-900 dark:text-white">Change Password</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Update your account password</p>
              </button>
              <button className="w-full text-left px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <p className="font-medium text-gray-900 dark:text-white">Two-Factor Auth</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Enable 2FA for extra security</p>
              </button>
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Data Management</h3>
            </div>
            <div className="space-y-3">
              <button
                onClick={handleExportData}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Export Data
              </button>
              <button
                onClick={handleBackupSystem}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                Backup System
              </button>
            </div>
          </div>

          {/* System Info */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-lg shadow p-6 border border-blue-100 dark:border-blue-800">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">System Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Version</span>
                <span className="font-medium text-gray-900 dark:text-white">2.1.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Last Updated</span>
                <span className="font-medium text-gray-900 dark:text-white">Jan 15, 2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Environment</span>
                <span className="font-medium text-gray-900 dark:text-white">Production</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {hasChanges && (
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 -mx-6 -mb-6 flex justify-end gap-3 shadow-lg">
          <button
            onClick={handleCancelChanges}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveSettings}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Change Password</h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 dark:text-white" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Must be at least 8 characters</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePassword}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}