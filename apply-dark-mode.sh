#!/bin/bash

# This script applies dark mode classes to all page components
# Pattern-based replacement for consistent dark mode styling

PAGES_DIR="src/app/components/pages"

# Common dark mode replacements
declare -A replacements=(
  # Backgrounds
  ['className="bg-white ']='className="bg-white dark:bg-gray-800 '
  ['className="bg-white"']='className="bg-white dark:bg-gray-800"'
  ['className="bg-gray-50 ']='className="bg-gray-50 dark:bg-gray-700 '
  ['className="bg-gray-50"']='className="bg-gray-50 dark:bg-gray-700"'
  
  # Text colors
  ['text-gray-900']='text-gray-900 dark:text-white'
  ['text-gray-800']='text-gray-800 dark:text-white'
  ['text-gray-700 ']='text-gray-700 dark:text-gray-300 '
  ['text-gray-600 ']='text-gray-600 dark:text-gray-400 '
  ['text-gray-500 ']='text-gray-500 dark:text-gray-500 '
  
  # Borders
  ['border-gray-200']='border-gray-200 dark:border-gray-700'
  ['border-gray-300']='border-gray-300 dark:border-gray-600'
  
  # Dividers
  ['divide-gray-200']='divide-gray-200 dark:divide-gray-700'
  
  # Hover states
  ['hover:bg-gray-50 ']='hover:bg-gray-50 dark:hover:bg-gray-700 '
  ['hover:bg-gray-100 ']='hover:bg-gray-100 dark:hover:bg-gray-700 '
)

echo "Applying dark mode to page components..."

# Note: This is a reference script showing the pattern
# Actual implementation is done via the edit tools

echo "Dark mode pattern script complete"
