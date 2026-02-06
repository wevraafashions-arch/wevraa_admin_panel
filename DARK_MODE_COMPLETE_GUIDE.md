# Dark Mode Implementation Guide - Wevraa Dashboard

## ✅ Completed Components

### Core System (100% Complete)
- [x] **ThemeContext** (`src/app/context/ThemeContext.tsx`) - Global theme state management
- [x] **App.tsx** - Dark mode wrapper with theme provider
- [x] **Sidebar.tsx** - Full dark mode navigation
- [x] **Header.tsx** - Dark mode search, icons, user profile  
- [x] **Settings Page** - Theme switcher with Light/Dark/Auto modes
- [x] **DashboardPage** - Complete dark mode implementation

## 📋 Pages Requiring Dark Mode Updates

The following 22 pages need dark mode classes applied using the pattern below:

### E-commerce Pages
- [ ] OrdersPage.tsx
- [ ] ProductsPage.tsx
- [ ] CustomersPage.tsx
- [ ] InventoryPage.tsx
- [ ] CategoriesPage.tsx
- [ ] CollectionsPage.tsx
- [ ] CustomerReviewsPage.tsx

### Tailoring Pages
- [ ] TailorOrdersPage.tsx
- [ ] TailorsPage.tsx
- [ ] TailorCustomersPage.tsx
- [ ] TailorCategoriesPage.tsx
- [ ] TailorChatPage.tsx
- [ ] MeasurementsPage.tsx
- [ ] DesignGalleryPage.tsx
- [ ] AddOnsPage.tsx
- [ ] StaffsPage.tsx

### Administrative Pages
- [ ] InvoicesPage.tsx
- [ ] UsersPage.tsx
- [ ] LocationsPage.tsx
- [ ] NotificationsPage.tsx
- [ ] AuditLogsPage.tsx
- [ ] StatusManagementPage.tsx

## 🎨 Dark Mode Class Pattern

Apply these consistent replacements across all pages:

### Backgrounds
```tsx
// Cards & Containers
bg-white → bg-white dark:bg-gray-800
bg-gray-50 → bg-gray-50 dark:bg-gray-700
bg-gray-100 → bg-gray-100 dark:bg-gray-700
```

### Text Colors
```tsx
text-gray-900 → text-gray-900 dark:text-white
text-gray-800 → text-gray-800 dark:text-white
text-gray-700 → text-gray-700 dark:text-gray-300
text-gray-600 → text-gray-600 dark:text-gray-400
text-gray-500 → text-gray-500 dark:text-gray-500 (muted, same in both modes)
```

### Borders & Dividers
```tsx
border-gray-200 → border-gray-200 dark:border-gray-700
border-gray-300 → border-gray-300 dark:border-gray-600
divide-gray-200 → divide-gray-200 dark:divide-gray-700
```

### Interactive States
```tsx
hover:bg-gray-50 → hover:bg-gray-50 dark:hover:bg-gray-700
hover:bg-gray-100 → hover:bg-gray-100 dark:hover:bg-gray-700
hover:text-gray-600 → hover:text-gray-600 dark:hover:text-gray-400
```

### Special Cases - Colored Backgrounds
```tsx
// For status cards that use colors (purple, blue, green, etc.)
bg-purple-50 → bg-purple-50 dark:bg-purple-900/20
bg-blue-50 → bg-blue-50 dark:bg-blue-900/20
bg-green-50 → bg-green-50 dark:bg-green-900/20
bg-yellow-50 → bg-yellow-50 dark:bg-yellow-900/20
bg-red-50 → bg-red-50 dark:bg-red-900/20

border-purple-100 → border-purple-100 dark:border-purple-800
border-blue-100 → border-blue-100 dark:border-blue-800
// (same pattern for other colors)
```

### Icon Colors
```tsx
text-purple-600 → text-purple-600 dark:text-purple-400
text-blue-600 → text-blue-600 dark:text-blue-400
text-green-600 → text-green-600 dark:text-green-400
// (same pattern for other colors)
```

## 📝 Example: Before & After

### Before (Light Mode Only)
```tsx
<div className="bg-white rounded-lg shadow p-6">
  <h2 className="text-2xl font-semibold text-gray-900">Title</h2>
  <p className="text-sm text-gray-600 mt-2">Description text</p>
  <div className="border-t border-gray-200 mt-4 pt-4">
    <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700">
      Click Me
    </button>
  </div>
</div>
```

### After (Dark Mode Support)
```tsx
<div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Title</h2>
  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Description text</p>
  <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
    <button className="px-4 py-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300">
      Click Me
    </button>
  </div>
</div>
```

## 🔍 Find & Replace Commands

Use your code editor's find-and-replace with regex:

### VS Code / Similar Editors

1. **Background - White Cards**
   - Find: `className="([^"]*?)bg-white(\s)`
   - Replace: `className="$1bg-white dark:bg-gray-800$2`

2. **Text - Primary Headings**
   - Find: `(\s)text-gray-900(\s)`
   - Replace: `$1text-gray-900 dark:text-white$2`

3. **Borders**
   - Find: `(\s)border-gray-200(\s)`
   - Replace: `$1border-gray-200 dark:border-gray-700$2`

## 🚀 Quick Implementation Steps

For each page file:

1. Open the page file (e.g., `OrdersPage.tsx`)
2. Use find & replace with the patterns above
3. Pay special attention to:
   - Main container backgrounds
   - Heading text colors
   - Card/section borders
   - Table headers (`thead`) backgrounds
   - Table body (`tbody`) backgrounds and dividers
   - Button hover states
4. Save and test in dark mode

## 🎯 Priority Order

Update in this order for maximum impact:

**High Priority (Most Visible):**
1. OrdersPage
2. ProductsPage
3. CustomersPage
4. TailorOrdersPage
5. InvoicesPage

**Medium Priority:**
6. InventoryPage
7. CategoriesPage
8. TailorsPage
9. UsersPage
10. LocationsPage

**Lower Priority:**
11-22. Remaining pages

## ✨ Testing Dark Mode

After updating pages:
1. Navigate to Settings page
2. Click on "Dark" theme button
3. Navigate through all updated pages
4. Verify:
   - All text is visible (white/light gray)
   - All backgrounds are dark
   - Borders are visible
   - Hover states work properly
   - No white "flash" areas

## 🔧 Helper Utility

A helper file has been created at `/src/app/utils/darkModeClasses.ts` with common patterns you can import and use:

```tsx
import { darkMode } from '@/app/utils/darkModeClasses';

// Then use like:
<div className={darkMode.card}>...</div>
<p className={darkMode.textPrimary}>...</p>
```

## 📊 Progress Tracking

- Total Pages: 24
- Completed: 2 (Dashboard, Settings)
- Remaining: 22
- Estimated Time: ~2-3 minutes per page = ~45-60 minutes total

---

**Note:** The ThemeContext system is already fully functional. Once you apply dark mode classes to a page, it will automatically respond to theme changes with smooth transitions!
