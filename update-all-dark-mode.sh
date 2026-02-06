#!/bin/bash

# Comprehensive Dark Mode Update Script
# Applies dark mode classes to all page components

PAGES_DIR="src/app/components/pages"

# List of files to update (excluding already completed ones)
FILES=(
  "OrdersPage.tsx"
  "ProductsPage.tsx"
  "CustomersPage.tsx"
  "InventoryPage.tsx"
  "CategoriesPage.tsx"
  "CollectionsPage.tsx"
  "AddOnsPage.tsx"
  "CustomerReviewsPage.tsx"
  "TailorOrdersPage.tsx"
  "TailorsPage.tsx"
  "TailorCustomersPage.tsx"
  "TailorCategoriesPage.tsx"
  "TailorChatPage.tsx"
  "StatusManagementPage.tsx"
  "StaffsPage.tsx"
  "MeasurementsPage.tsx"
  "DesignGalleryPage.tsx"
  "InvoicesPage.tsx"
  "UsersPage.tsx"
  "LocationsPage.tsx"
  "NotificationsPage.tsx"
  "AuditLogsPage.tsx"
)

echo "Starting dark mode conversion for all pages..."

for file in "${FILES[@]}"; do
  filepath="${PAGES_DIR}/${file}"
  
  if [ ! -f "$filepath" ]; then
    echo "⚠️  File not found: $filepath"
    continue
  fi
  
  echo "Processing: $file"
  
  # Create backup
  cp "$filepath" "${filepath}.bak"
  
  # Apply transformations using sed
  # Note: These are the patterns - actual implementation uses the edit tools
  
  # Backgrounds
  sed -i 's/className="\([^"]*\)bg-white\s/className="\1bg-white dark:bg-gray-800 /g' "$filepath"
  sed -i 's/className="\([^"]*\)bg-white"/className="\1bg-white dark:bg-gray-800"/g' "$filepath"
  sed -i 's/\s\(bg-white\)\s/ \1 dark:bg-gray-800 /g' "$filepath"
  
  sed -i 's/className="\([^"]*\)bg-gray-50\s/className="\1bg-gray-50 dark:bg-gray-700 /g' "$filepath"
  sed -i 's/className="\([^"]*\)bg-gray-50"/className="\1bg-gray-50 dark:bg-gray-700"/g' "$filepath"
  
  # Text colors
  sed -i 's/\stext-gray-900\s/ text-gray-900 dark:text-white /g' "$filepath"
  sed -i 's/\stext-gray-900"/ text-gray-900 dark:text-white"/g' "$filepath"
  
  sed -i 's/\stext-gray-800\s/ text-gray-800 dark:text-white /g' "$filepath"
  sed -i 's/\stext-gray-700\s/ text-gray-700 dark:text-gray-300 /g' "$filepath"
  sed -i 's/\stext-gray-600\s/ text-gray-600 dark:text-gray-400 /g' "$filepath"
  
  # Borders
  sed -i 's/\sborder-gray-200\s/ border-gray-200 dark:border-gray-700 /g' "$filepath"
  sed -i 's/\sborder-gray-200"/ border-gray-200 dark:border-gray-700"/g' "$filepath"
  sed -i 's/\sborder-gray-300\s/ border-gray-300 dark:border-gray-600 /g' "$filepath"
  
  # Dividers
  sed -i 's/\sdivide-gray-200\s/ divide-gray-200 dark:divide-gray-700 /g' "$filepath"
  
  # Hover states
  sed -i 's/\shover:bg-gray-50\s/ hover:bg-gray-50 dark:hover:bg-gray-700 /g' "$filepath"
  sed -i 's/\shover:bg-gray-100\s/ hover:bg-gray-100 dark:hover:bg-gray-700 /g' "$filepath"
  
  echo "✓ Updated: $file"
done

echo ""
echo "Dark mode conversion complete!"
echo "Backup files created with .bak extension"
