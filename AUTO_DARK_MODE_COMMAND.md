# Automated Dark Mode Application Commands

## Using Find & Replace in VS Code

Open each file in `src/app/components/pages/` and run these find-replace operations in sequence:

### Setup
1. Open VS Code
2. Press `Ctrl+H` (Windows/Linux) or `Cmd+H` (Mac)
3. Enable "Use Regular Expression" (icon with `.*`)
4. Enable "Match Case"

---

## Replacement Sequence

Run these in order for each `.tsx` file in the pages directory:

### 1. Background - White
**Find:** `className="bg-white `  
**Replace:** `className="bg-white dark:bg-gray-800 `

**Find:** `className="bg-white"`  
**Replace:** `className="bg-white dark:bg-gray-800"`

**Find:** ` bg-white `  
**Replace:** ` bg-white dark:bg-gray-800 `

**Find:** ` bg-white"`  
**Replace:** ` bg-white dark:bg-gray-800"`

### 2. Background - Gray 50
**Find:** ` bg-gray-50 `  
**Replace:** ` bg-gray-50 dark:bg-gray-700 `

**Find:** ` bg-gray-50"`  
**Replace:** ` bg-gray-50 dark:bg-gray-700"`

### 3. Text - Gray 900 (Headings)
**Find:** ` text-gray-900 `  
**Replace:** ` text-gray-900 dark:text-white `

**Find:** ` text-gray-900"`  
**Replace:** ` text-gray-900 dark:text-white"`

### 4. Text - Gray 800
**Find:** ` text-gray-800 `  
**Replace:** ` text-gray-800 dark:text-white `

**Find:** ` text-gray-800"`  
**Replace:** ` text-gray-800 dark:text-white"`

### 5. Text - Gray 700
**Find:** ` text-gray-700 `  
**Replace:** ` text-gray-700 dark:text-gray-300 `

**Find:** ` text-gray-700"`  
**Replace:** ` text-gray-700 dark:text-gray-300"`

### 6. Text - Gray 600
**Find:** ` text-gray-600 `  
**Replace:** ` text-gray-600 dark:text-gray-400 `

**Find:** ` text-gray-600"`  
**Replace:** ` text-gray-600 dark:text-gray-400"`

### 7. Border - Gray 200
**Find:** ` border-gray-200 `  
**Replace:** ` border-gray-200 dark:border-gray-700 `

**Find:** ` border-gray-200"`  
**Replace:** ` border-gray-200 dark:border-gray-700"`

### 8. Border - Gray 300
**Find:** ` border-gray-300 `  
**Replace:** ` border-gray-300 dark:border-gray-600 `

**Find:** ` border-gray-300"`  
**Replace:** ` border-gray-300 dark:border-gray-600"`

### 9. Divide - Gray 200
**Find:** ` divide-gray-200 `  
**Replace:** ` divide-gray-200 dark:divide-gray-700 `

**Find:** ` divide-gray-200"`  
**Replace:** ` divide-gray-200 dark:divide-gray-700"`

### 10. Hover - Gray 50
**Find:** ` hover:bg-gray-50 `  
**Replace:** ` hover:bg-gray-50 dark:hover:bg-gray-700 `

**Find:** ` hover:bg-gray-50"`  
**Replace:** ` hover:bg-gray-50 dark:hover:bg-gray-700"`

### 11. Hover - Gray 100
**Find:** ` hover:bg-gray-100 `  
**Replace:** ` hover:bg-gray-100 dark:hover:bg-gray-700 `

**Find:** ` hover:bg-gray-100"`  
**Replace:** ` hover:bg-gray-100 dark:hover:bg-gray-700"`

---

## Special Cases - Colored Backgrounds

For status cards and colored indicators:

### Purple
**Find:** ` bg-purple-50 `  
**Replace:** ` bg-purple-50 dark:bg-purple-900/20 `

**Find:** ` border-purple-100 `  
**Replace:** ` border-purple-100 dark:border-purple-800 `

**Find:** ` text-purple-600 `  
**Replace:** ` text-purple-600 dark:text-purple-400 `

### Blue
**Find:** ` bg-blue-50 `  
**Replace:** ` bg-blue-50 dark:bg-blue-900/20 `

**Find:** ` border-blue-100 `  
**Replace:** ` border-blue-100 dark:border-blue-800 `

**Find:** ` text-blue-600 `  
**Replace:** ` text-blue-600 dark:text-blue-400 `

### Green
**Find:** ` bg-green-50 `  
**Replace:** ` bg-green-50 dark:bg-green-900/20 `

**Find:** ` border-green-100 `  
**Replace:** ` border-green-100 dark:border-green-800 `

**Find:** ` text-green-600 `  
**Replace:** ` text-green-600 dark:text-green-400 `

### Yellow
**Find:** ` bg-yellow-50 `  
**Replace:** ` bg-yellow-50 dark:bg-yellow-900/20 `

**Find:** ` border-yellow-100 `  
**Replace:** ` border-yellow-100 dark:border-yellow-800 `

**Find:** ` text-yellow-600 `  
**Replace:** ` text-yellow-600 dark:text-yellow-400 `

### Red
**Find:** ` bg-red-50 `  
**Replace:** ` bg-red-50 dark:bg-red-900/20 `

**Find:** ` border-red-100 `  
**Replace:** ` border-red-100 dark:border-red-800 `

**Find:** ` text-red-600 `  
**Replace:** ` text-red-600 dark:text-red-400 `

### Orange
**Find:** ` bg-orange-50 `  
**Replace:** ` bg-orange-50 dark:bg-orange-900/20 `

**Find:** ` border-orange-100 `  
**Replace:** ` border-orange-100 dark:border-orange-800 `

**Find:** ` text-orange-600 `  
**Replace:** ` text-orange-600 dark:text-orange-400 `

---

## Files to Update (in order)

Run the above replacements on each of these files:

### Batch 1 - E-commerce (High Priority)
1. src/app/components/pages/OrdersPage.tsx
2. src/app/components/pages/ProductsPage.tsx
3. src/app/components/pages/CustomersPage.tsx
4. src/app/components/pages/InventoryPage.tsx
5. src/app/components/pages/CategoriesPage.tsx
6. src/app/components/pages/CollectionsPage.tsx
7. src/app/components/pages/CustomerReviewsPage.tsx

### Batch 2 - Tailoring
8. src/app/components/pages/TailorOrdersPage.tsx
9. src/app/components/pages/TailorsPage.tsx
10. src/app/components/pages/TailorCustomersPage.tsx
11. src/app/components/pages/TailorCategoriesPage.tsx
12. src/app/components/pages/TailorChatPage.tsx
13. src/app/components/pages/MeasurementsPage.tsx
14. src/app/components/pages/DesignGalleryPage.tsx
15. src/app/components/pages/AddOnsPage.tsx
16. src/app/components/pages/StaffsPage.tsx

### Batch 3 - Administrative
17. src/app/components/pages/InvoicesPage.tsx
18. src/app/components/pages/UsersPage.tsx
19. src/app/components/pages/LocationsPage.tsx
20. src/app/components/pages/NotificationsPage.tsx
21. src/app/components/pages/AuditLogsPage.tsx
22. src/app/components/pages/StatusManagementPage.tsx

---

## Verification Checklist

After updating each file:
- [ ] File saves without errors
- [ ] No TypeScript/React errors appear
- [ ] Preview the page in dark mode (Settings → Dark theme)
- [ ] Check that all text is visible
- [ ] Check that all cards have dark backgrounds
- [ ] Check that borders are visible
- [ ] Check hover states work

---

## Bulk Operation (Advanced)

If you want to do all files at once, you can use VS Code's "Replace in Files":

1. Press `Ctrl+Shift+H` (Windows/Linux) or `Cmd+Shift+H` (Mac)
2. In "files to include": `src/app/components/pages/*.tsx`
3. In "files to exclude": `**/DashboardPage.tsx, **/SettingsPage.tsx`
4. Run each find-replace operation above
5. Review changes before saving

**⚠️ Warning:** Make sure to commit your code first or have backups before bulk operations!

---

## Estimated Time

- Per file (manual): ~2-3 minutes
- Total (all 22 files): ~45-60 minutes
- Bulk operation: ~15-20 minutes (with verification)

## Done!

Once complete, your entire Wevraa dashboard will have full dark mode support! 🌙✨
