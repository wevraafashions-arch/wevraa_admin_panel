/**
 * Common dark mode class patterns for consistent styling across the application
 */

export const darkMode = {
  // Backgrounds
  bgWhite: 'bg-white dark:bg-gray-800',
  bgGray50: 'bg-gray-50 dark:bg-gray-900',
  bgGray100: 'bg-gray-100 dark:bg-gray-700',
  
  // Text colors
  textPrimary: 'text-gray-900 dark:text-white',
  textSecondary: 'text-gray-600 dark:text-gray-400',
  textMuted: 'text-gray-500 dark:text-gray-500',
  
  // Borders
  border: 'border-gray-200 dark:border-gray-700',
  borderLight: 'border-gray-300 dark:border-gray-600',
  
  // Cards
  card: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
  cardHover: 'hover:bg-gray-50 dark:hover:bg-gray-700',
  
  // Inputs
  input: 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white',
  inputPlaceholder: 'placeholder-gray-500 dark:placeholder-gray-400',
  
  // Buttons
  buttonSecondary: 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600',
  
  // Tables
  tableHeader: 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
  tableRow: 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700',
  tableCell: 'text-gray-900 dark:text-white',
  
  // Badges/Status
  badge: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300',
  
  // Icons
  icon: 'text-gray-700 dark:text-gray-300',
  iconMuted: 'text-gray-400 dark:text-gray-500',
} as const;
