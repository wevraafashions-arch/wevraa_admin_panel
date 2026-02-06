# Wevraa - Complete System Architecture

## Project Overview

**Wevraa** is a comprehensive dashboard application designed to manage both e-commerce and tailoring operations for a business. The system integrates standard e-commerce functionalities with specialized tailoring features, providing a unified platform for business operations.

### Core Business Domains
1. **E-Commerce Management** - Products, Orders, Inventory, Categories, Customers
2. **Tailoring Operations** - Custom Orders, Measurements, Design Gallery, Tailor Management
3. **Administrative Functions** - Invoices, Payments, Users, Roles, Locations, Audit Logs
4. **Customer Engagement** - Reviews, Ratings, Notifications, Chat Management

---

## Technology Stack

### Frontend Framework
- **React 18+** - Core UI framework
- **TypeScript** - Type safety and development experience
- **Tailwind CSS v4** - Utility-first styling
- **React Router** - Client-side routing with Data mode pattern

### UI Components & Libraries
- **Lucide React** - Icon library
- **Recharts** - Charts and data visualization
- **React Slick** - Carousel components
- **React Responsive Masonry** - Masonry grid layouts
- **React DND** - Drag and drop functionality
- **Motion/React (formerly Framer Motion)** - Animations

### Development Tools
- **Vite** - Build tool and development server
- **ESLint** - Code linting
- **Path Aliases** - `@` mapped to `/src` directory

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Wevraa Application                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Theme Context Layer                      │  │
│  │         (Dark Mode / Light Mode Support)             │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Routing Layer (React Router)            │  │
│  │              - Main Dashboard Routes                  │  │
│  │              - Nested Module Routes                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  Component Layer                      │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │  │
│  │  │ E-Commerce │  │ Tailoring  │  │   Admin    │     │  │
│  │  │  Modules   │  │  Modules   │  │  Modules   │     │  │
│  │  └────────────┘  └────────────┘  └────────────┘     │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Data Management Layer                    │  │
│  │         (Local State + Mock Data Storage)            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Application Flow

```
User Login
    ↓
Dashboard (Main Landing)
    ↓
┌───────────────┬──────────────────┬─────────────────┐
│  E-Commerce   │   Tailoring      │   Admin         │
├───────────────┼──────────────────┼─────────────────┤
│ - Orders      │ - Tailor Orders  │ - Invoices      │
│ - Products    │ - Tailors        │ - Payments      │
│ - Categories  │ - Customers      │ - Users         │
│ - Inventory   │ - Measurements   │ - Roles         │
│ - Customers   │ - Design Gallery │ - Locations     │
│ - Vendors     │ - Personal       │ - Notifications │
│               │   Gallery        │ - Audit Logs    │
│               │ - Chat Mgmt      │ - Settings      │
│               │ - Tax Settings   │                 │
└───────────────┴──────────────────┴─────────────────┘
```

---

## Module Structure

### 1. E-Commerce Modules

#### Orders Management
- **Purpose**: Manage e-commerce orders
- **Features**:
  - Simple search functionality (no filters)
  - Order status tracking
  - Order details view
  - Payment status
  - Shipping information
  
#### Products Management
- **Purpose**: Product catalog management
- **Features**:
  - Product CRUD operations
  - Product detail modal with related products
  - Image gallery
  - Pricing and inventory
  - Category assignment
  - Variant management

#### Categories Management
- **Purpose**: Product categorization
- **Features**:
  - Hierarchical category structure
  - Category and subcategory management
  - Drag-and-drop reordering
  - Category status (active/inactive)

#### Inventory Management
- **Purpose**: Stock level tracking
- **Features**:
  - Real-time stock monitoring
  - Low stock alerts
  - Stock movement history
  - Warehouse management

#### Customers Management
- **Purpose**: Customer data management
- **Features**:
  - Customer profiles
  - Order history
  - Contact information
  - Customer segmentation

#### Vendor Management
- **Purpose**: Supplier relationship management
- **Features**:
  - Vendor CRUD operations
  - Indian states dropdown
  - Contact details
  - Product associations
  - Performance tracking

---

### 2. Tailoring Modules

#### Tailor Orders Management
- **Purpose**: Custom tailoring order processing
- **Features**:
  - Simple search functionality (no filters)
  - Order workflow management
  - Customer measurements
  - Delivery tracking
  - Status updates

#### Tailors Management
- **Purpose**: Tailor profile and assignment
- **Features**:
  - Tailor CRUD operations
  - Complete address fields (Address Line 1, Address Line 2, Pincode)
  - GST functionality:
    - Enable/disable GST per tailor
    - GST number
    - GST percentage selection
    - HSN code assignment
  - Skills and specializations
  - Performance metrics
  - Workload distribution

#### Tailor Customers Management
- **Purpose**: Tailoring customer profiles
- **Features**:
  - Customer information
  - Measurement records
  - Order history
  - Preferences and notes

#### Measurements Management
- **Purpose**: Customer measurement tracking
- **Features**:
  - Detailed measurement forms
  - Measurement history
  - Standard size templates
  - Custom measurement fields

#### Design Gallery
- **Purpose**: Design inspiration and catalog
- **Features**:
  - Comprehensive category/subcategory filtering
  - Design image gallery
  - Search and filter
  - Design details
  - Customer favorites

#### Tailor Personal Gallery
- **Purpose**: Individual tailor portfolios
- **Features**:
  - Personal work showcase
  - Before/after galleries
  - Tailor-specific designs
  - Portfolio management

#### Tailor Chat Management
- **Purpose**: Communication and quotations
- **Features**:
  - Real-time chat interface
  - Quotation system:
    - Create and send quotes
    - Quote acceptance/rejection
    - Quote history
  - Customer interactions
  - Order discussions

#### Tax Settings
- **Purpose**: GST and tax configuration
- **Features**:
  - **GST Rates Tab**:
    - Manage rates (5%, 12%, 18%, 28%)
    - Set default rate
    - Add/Edit/Delete rates
  - **HSN Codes Tab**:
    - HSN code management
    - Code descriptions
    - Associated GST rates
    - CRUD operations

---

### 3. Administrative Modules

#### Invoices & Payments
- **Purpose**: Financial transaction management
- **Features**:
  - Payment records tab
  - Pending payments tab
  - **GST Integration**:
    - Display GST details when tailor has GST enabled
    - Show base amount, GST amount, total
    - Display GST number and HSN code
    - No GST details shown for non-GST tailors
  - Invoice generation
  - Payment tracking
  - Payment methods (Cash, UPI, Card, Net Banking)
  - Transaction IDs
  - Comprehensive rating system:
    - Overall rating (1-5 stars)
    - Fit rating (1-5 stars)
    - Finishing rating (1-5 stars)
    - Written reviews
    - Review images (up to 5)
    - Review date tracking

#### User Management
- **Purpose**: System user administration
- **Features**:
  - User CRUD operations
  - User roles assignment
  - Access control
  - Activity monitoring

#### Role Management
- **Purpose**: Permission and access control
- **Features**:
  - Role creation and editing
  - Permission assignment
  - Role hierarchy
  - Access level definition

#### Location Management
- **Purpose**: Business location tracking
- **Features**:
  - Store/warehouse locations
  - Address management
  - Service areas
  - Location-based inventory

#### Notifications
- **Purpose**: System-wide notifications
- **Features**:
  - Notification creation
  - User targeting
  - Notification types
  - Read/unread status
  - Notification history

#### Audit Logs
- **Purpose**: System activity tracking
- **Features**:
  - User action logging
  - Change tracking
  - Security monitoring
  - Compliance reporting

#### Settings
- **Purpose**: Application configuration
- **Features**:
  - **Review Settings**:
    - Consolidated review management
    - Auto-approval settings
    - Moderation rules
    - Display preferences
  - System preferences
  - Business information
  - Integration settings
  - Theme configuration

---

## Data Models

### Core Entities

#### 1. Product
```typescript
interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  mrp?: number;
  stock: number;
  image: string;
  images?: string[];
  description?: string;
  specifications?: Record<string, string>;
  status: 'Active' | 'Inactive';
  sku?: string;
  createdAt: string;
  updatedAt: string;
}
```

#### 2. Order
```typescript
interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  orderDate: string;
  deliveryDate?: string;
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  paymentStatus: 'Paid' | 'Pending' | 'Partially Paid';
  items: OrderItem[];
  shippingAddress?: Address;
  notes?: string;
}
```

#### 3. Tailor
```typescript
interface Tailor {
  id: string;
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  pincode: string;
  specialization: string[];
  status: 'Active' | 'Inactive';
  rating?: number;
  completedOrders: number;
  hasGST?: boolean;
  gstNumber?: string;
  gstPercentage?: number;
  hsnCode?: string;
  joiningDate: string;
  avatar?: string;
}
```

#### 4. TailorOrder
```typescript
interface TailorOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  tailorName: string;
  orderType: string;
  orderDate: string;
  deliveryDate: string;
  amount: number;
  status: 'New' | 'In Progress' | 'Ready' | 'Delivered' | 'Cancelled';
  measurements?: Measurements;
  specialInstructions?: string;
  images?: string[];
}
```

#### 5. PaymentRecord
```typescript
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
  hasGST?: boolean;
  gstNumber?: string;
  gstPercentage?: number;
  hsnCode?: string;
  rating?: number;
  fitRating?: number;
  finishingRating?: number;
  review?: string;
  reviewImages?: string[];
  reviewDate?: string;
}
```

#### 6. Category
```typescript
interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
  status: 'Active' | 'Inactive';
  order: number;
}

interface Subcategory {
  id: string;
  name: string;
  status: 'Active' | 'Inactive';
  order: number;
}
```

#### 7. Customer
```typescript
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: Address;
  registrationDate: string;
  totalOrders: number;
  totalSpent: number;
  status: 'Active' | 'Inactive';
}
```

#### 8. Vendor
```typescript
interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  state: string; // Indian state
  city: string;
  address: string;
  gstNumber?: string;
  products: string[];
  status: 'Active' | 'Inactive';
  rating?: number;
}
```

#### 9. Measurements
```typescript
interface Measurements {
  chest?: number;
  waist?: number;
  hip?: number;
  shoulder?: number;
  sleeveLength?: number;
  shirtLength?: number;
  neck?: number;
  inseam?: number;
  // Additional custom measurements
  [key: string]: number | undefined;
}
```

#### 10. GSTRate
```typescript
interface GSTRate {
  id: string;
  rate: number;
  description: string;
  isDefault: boolean;
}
```

#### 11. HSNCode
```typescript
interface HSNCode {
  id: string;
  code: string;
  description: string;
  gstRate: number;
}
```

---

## File Structure

```
wevraa/
├── public/
│   └── assets/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── pages/
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── OrdersPage.tsx
│   │   │   │   ├── ProductsPage.tsx
│   │   │   │   ├── CategoriesPage.tsx
│   │   │   │   ├── InventoryPage.tsx
│   │   │   │   ├── CustomersPage.tsx
│   │   │   │   ├── VendorsPage.tsx
│   │   │   │   ├── TailorOrdersPage.tsx
│   │   │   │   ├── TailorsPage.tsx
│   │   │   │   ├── TailorCustomersPage.tsx
│   │   │   │   ├── MeasurementsPage.tsx
│   │   │   │   ├── DesignGalleryPage.tsx
│   │   │   │   ├── TailorPersonalGalleryPage.tsx
│   │   │   │   ├── TailorChatManagementPage.tsx
│   │   │   │   ├── TaxSettingsPage.tsx
│   │   │   │   ├── InvoicesPage.tsx
│   │   │   │   ├── UsersPage.tsx
│   │   │   │   ├── RolesPage.tsx
│   │   │   │   ├── LocationsPage.tsx
│   │   │   │   ├── NotificationsPage.tsx
│   │   │   │   ├── AuditLogsPage.tsx
│   │   │   │   └── SettingsPage.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   ├── ProductDetailModal.tsx
│   │   │   ├── RatingModal.tsx
│   │   │   └── [other components]
│   │   ├── contexts/
│   │   │   └── ThemeContext.tsx
│   │   ├── routes.ts
│   │   └── App.tsx
│   ├── styles/
│   │   ├── theme.css
│   │   ├── fonts.css
│   │   └── index.css
│   ├── imports/
│   │   └── [imported assets]
│   └── main.tsx
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── ARCHITECTURE.md
```

---

## Key Features & Implementations

### 1. Theme System
- **Dark Mode Support**: Complete dark mode implementation via ThemeContext
- **Toggle Component**: ThemeToggle in header for easy switching
- **Persistent State**: Theme preference saved across sessions
- **CSS Variables**: Theme-based CSS custom properties

### 2. Navigation & Routing
- **React Router Data Mode**: Modern routing pattern
- **Nested Routes**: Hierarchical route structure
- **Dynamic Navigation**: Sidebar with collapsible sections
- **Breadcrumbs**: Context-aware navigation breadcrumbs

### 3. Search & Filter Systems
- **Simple Search**: Orders and Tailor Orders use search-only (no filters)
- **Advanced Filtering**: Design Gallery with category/subcategory filters
- **Real-time Search**: Instant search results across modules

### 4. Drag & Drop
- **Category Reordering**: Drag-and-drop for categories and subcategories
- **Visual Feedback**: Clear drag states and drop zones
- **Persistence**: Order changes saved to state

### 5. Rating & Review System
- **Multi-dimensional Ratings**:
  - Overall rating (1-5 stars)
  - Fit rating (1-5 stars)
  - Finishing rating (1-5 stars)
- **Written Reviews**: Text feedback
- **Image Upload**: Up to 5 review images
- **Review Management**: Consolidated settings in Settings page

### 6. GST Tax System
- **Tailor-level GST**: Optional GST enablement per tailor
- **GST Configuration**:
  - GST number
  - GST percentage (5%, 12%, 18%, 28%)
  - HSN codes
- **Tax Settings Page**:
  - Manage GST rates
  - Manage HSN codes
  - Set default rates
- **Invoice Integration**:
  - Show GST breakdown when applicable
  - Display base amount, GST, and total
  - Hide GST details for non-GST tailors

### 7. Chat & Quotation System
- **Real-time Chat**: Tailor-customer communication
- **Quotation Workflow**:
  - Create quotations
  - Send to customers
  - Accept/reject flow
  - Quotation history
- **Message Threading**: Organized conversation threads

### 8. Product Management
- **Product Detail Modal**: Comprehensive product view
- **Related Products**: Smart product recommendations
- **Image Gallery**: Multiple product images
- **Variant Support**: Size, color, and custom variants

### 9. Vendor Management
- **Indian States Dropdown**: All 28 states + 8 UTs
- **CRUD Operations**: Full vendor lifecycle management
- **GST Integration**: Vendor GST tracking
- **Performance Metrics**: Vendor rating and analytics

---

## Routing Structure

```typescript
// routes.ts structure
createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Dashboard },
      
      // E-Commerce Routes
      { path: "orders", Component: OrdersPage },
      { path: "products", Component: ProductsPage },
      { path: "categories", Component: CategoriesPage },
      { path: "inventory", Component: InventoryPage },
      { path: "customers", Component: CustomersPage },
      { path: "vendors", Component: VendorsPage },
      
      // Tailoring Routes
      { path: "tailor-orders", Component: TailorOrdersPage },
      { path: "tailors", Component: TailorsPage },
      { path: "tailor-customers", Component: TailorCustomersPage },
      { path: "measurements", Component: MeasurementsPage },
      { path: "design-gallery", Component: DesignGalleryPage },
      { path: "tailor-gallery", Component: TailorPersonalGalleryPage },
      { path: "tailor-chat", Component: TailorChatManagementPage },
      { path: "tax-settings", Component: TaxSettingsPage },
      
      // Admin Routes
      { path: "invoices", Component: InvoicesPage },
      { path: "users", Component: UsersPage },
      { path: "roles", Component: RolesPage },
      { path: "locations", Component: LocationsPage },
      { path: "notifications", Component: NotificationsPage },
      { path: "audit-logs", Component: AuditLogsPage },
      { path: "settings", Component: SettingsPage },
      
      // 404
      { path: "*", Component: NotFound },
    ],
  },
]);
```

---

## State Management

### Current Approach
- **Local Component State**: `useState` for component-level data
- **Context API**: ThemeContext for global theme state
- **Props Drilling**: Parent-child data flow
- **Mock Data**: Hardcoded sample data for demonstration

### Data Flow Pattern
```
Component State (useState)
       ↓
Component Logic
       ↓
UI Rendering
       ↓
User Interaction
       ↓
State Update
       ↓
Re-render
```

---

## Design Patterns

### 1. Component Composition
- **Presentational Components**: Pure UI components
- **Container Components**: Logic and state management
- **Modal Components**: Reusable dialog patterns

### 2. Data Management
- **Mock Data Arrays**: Simulated database records
- **CRUD Operations**: Full create, read, update, delete patterns
- **Optimistic Updates**: Immediate UI feedback

### 3. UI Patterns
- **Responsive Tables**: Mobile-friendly data grids
- **Card Layouts**: Visual data presentation
- **Tab Interfaces**: Organized content sections
- **Modal Dialogs**: Contextual actions and details

### 4. Indian Localization
- **Currency**: All amounts in ₹ (Indian Rupees)
- **Names**: Indian names throughout
- **States**: Indian states and territories
- **Date Format**: DD/MM/YYYY or Indian locale
- **Phone Numbers**: +91 format

---

## Integration Points

### Current Integrations
1. **Tailwind CSS v4**: Styling framework
2. **Lucide React**: Icon library
3. **React Router**: Navigation
4. **Motion/React**: Animations
5. **Recharts**: Data visualization

### Potential Future Integrations
1. **Backend API**: RESTful or GraphQL API
2. **Database**: PostgreSQL, MongoDB, or Firebase
3. **Authentication**: JWT, OAuth, or Firebase Auth
4. **Payment Gateway**: Razorpay, Stripe
5. **File Storage**: AWS S3, Cloudinary
6. **Real-time**: WebSockets for chat
7. **Email Service**: SendGrid, AWS SES
8. **SMS Gateway**: Twilio, AWS SNS
9. **Analytics**: Google Analytics, Mixpanel
10. **Error Tracking**: Sentry, LogRocket

---

## Security Considerations

### Current Implementation
- Client-side only (no backend)
- Mock authentication flow
- No sensitive data storage
- No API key exposure

### Production Requirements
1. **Authentication & Authorization**
   - JWT-based authentication
   - Role-based access control (RBAC)
   - Session management
   - Password encryption

2. **Data Security**
   - HTTPS enforcement
   - Input validation
   - XSS protection
   - CSRF tokens
   - SQL injection prevention

3. **Privacy Compliance**
   - GDPR compliance
   - Data encryption
   - Privacy policy
   - User consent management

4. **Audit & Monitoring**
   - Activity logging
   - Security event tracking
   - Anomaly detection
   - Regular security audits

---

## Performance Optimization

### Current Optimizations
1. **Code Splitting**: Route-based lazy loading potential
2. **Image Optimization**: Optimized asset delivery
3. **CSS Optimization**: Tailwind CSS purging
4. **Bundle Optimization**: Vite build optimizations

### Recommended Optimizations
1. **Lazy Loading**: React.lazy() for heavy components
2. **Memoization**: useMemo and useCallback
3. **Virtual Scrolling**: For long lists
4. **Image Lazy Loading**: Intersection Observer
5. **API Caching**: React Query or SWR
6. **State Management**: Redux or Zustand for complex state
7. **Service Workers**: Offline support
8. **CDN**: Asset delivery via CDN

---

## Responsive Design

### Breakpoints
```css
/* Tailwind CSS default breakpoints */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X Extra large devices */
```

### Mobile-First Approach
- Base styles for mobile
- Progressive enhancement for larger screens
- Touch-friendly interfaces
- Responsive tables and grids
- Collapsible navigation on mobile

---

## Testing Strategy

### Recommended Testing Layers

1. **Unit Tests**
   - Component logic
   - Utility functions
   - Data transformations
   - Tool: Jest, Vitest

2. **Integration Tests**
   - Component interactions
   - Route navigation
   - Form submissions
   - Tool: React Testing Library

3. **E2E Tests**
   - User workflows
   - Critical paths
   - Cross-browser testing
   - Tool: Cypress, Playwright

4. **Visual Regression**
   - UI consistency
   - Theme variations
   - Tool: Chromatic, Percy

---

## Deployment Strategy

### Build Process
```bash
# Development
npm run dev

# Production Build
npm run build

# Preview Production Build
npm run preview
```

### Deployment Options
1. **Vercel**: Zero-config deployment
2. **Netlify**: Continuous deployment
3. **AWS S3 + CloudFront**: Scalable hosting
4. **Azure Static Web Apps**: Enterprise hosting
5. **Google Firebase Hosting**: Quick deployment

### Environment Configuration
```
# .env.local
VITE_API_URL=https://api.wevraa.com
VITE_ENV=production
VITE_ANALYTICS_ID=UA-XXXXXXXX-X
```

---

## Accessibility (a11y)

### Current Considerations
- Semantic HTML
- Keyboard navigation
- ARIA labels where needed
- Color contrast

### Recommended Improvements
1. **WCAG 2.1 AA Compliance**
   - Screen reader support
   - Keyboard accessibility
   - Focus management
   - Alt text for images

2. **Testing Tools**
   - axe DevTools
   - WAVE
   - Lighthouse

3. **Best Practices**
   - Skip navigation links
   - Proper heading hierarchy
   - Form label associations
   - Error messaging

---

## Future Enhancements

### Phase 1: Backend Integration
- RESTful API development
- Database schema implementation
- Authentication system
- Real-time features

### Phase 2: Advanced Features
- AI-powered recommendations
- Automated measurement suggestions
- Inventory forecasting
- Customer analytics dashboard

### Phase 3: Mobile Applications
- React Native mobile app
- Progressive Web App (PWA)
- Push notifications
- Offline mode

### Phase 4: Business Intelligence
- Advanced reporting
- Custom dashboards
- Data export capabilities
- Business analytics

### Phase 5: Third-party Integrations
- Payment gateways
- Shipping providers
- Email marketing
- SMS notifications
- Social media integration

---

## Development Workflow

### Git Workflow
```
main (production)
  ↓
develop (staging)
  ↓
feature/* (feature branches)
bugfix/* (bug fixes)
hotfix/* (urgent fixes)
```

### Code Review Process
1. Create feature branch
2. Implement changes
3. Write tests
4. Create pull request
5. Code review
6. Merge to develop
7. Deploy to staging
8. QA testing
9. Merge to main
10. Deploy to production

---

## API Endpoints (Future)

### E-Commerce APIs
```
GET    /api/orders
POST   /api/orders
GET    /api/orders/:id
PUT    /api/orders/:id
DELETE /api/orders/:id

GET    /api/products
POST   /api/products
GET    /api/products/:id
PUT    /api/products/:id
DELETE /api/products/:id

GET    /api/categories
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id
```

### Tailoring APIs
```
GET    /api/tailor-orders
POST   /api/tailor-orders
GET    /api/tailor-orders/:id
PUT    /api/tailor-orders/:id
DELETE /api/tailor-orders/:id

GET    /api/tailors
POST   /api/tailors
GET    /api/tailors/:id
PUT    /api/tailors/:id
DELETE /api/tailors/:id

GET    /api/measurements
POST   /api/measurements
GET    /api/measurements/:id
PUT    /api/measurements/:id
```

### Admin APIs
```
GET    /api/invoices
POST   /api/invoices
GET    /api/invoices/:id
PUT    /api/invoices/:id

POST   /api/payments
GET    /api/payments/:id

GET    /api/users
POST   /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
```

---

## Database Schema (Proposed)

### PostgreSQL Schema

```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role_id UUID REFERENCES roles(id),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Roles Table
CREATE TABLE roles (
  id UUID PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  permissions JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Products Table
CREATE TABLE products (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category_id UUID REFERENCES categories(id),
  price DECIMAL(10,2) NOT NULL,
  mrp DECIMAL(10,2),
  stock INTEGER DEFAULT 0,
  description TEXT,
  images JSONB,
  specifications JSONB,
  status VARCHAR(50),
  sku VARCHAR(100) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Categories Table
CREATE TABLE categories (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  parent_id UUID REFERENCES categories(id),
  status VARCHAR(50),
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders Table
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  order_number VARCHAR(100) UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id),
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50),
  payment_status VARCHAR(50),
  shipping_address JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tailors Table
CREATE TABLE tailors (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  pincode VARCHAR(10),
  has_gst BOOLEAN DEFAULT FALSE,
  gst_number VARCHAR(50),
  gst_percentage DECIMAL(5,2),
  hsn_code VARCHAR(20),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tailor Orders Table
CREATE TABLE tailor_orders (
  id UUID PRIMARY KEY,
  order_number VARCHAR(100) UNIQUE NOT NULL,
  customer_id UUID REFERENCES tailor_customers(id),
  tailor_id UUID REFERENCES tailors(id),
  order_type VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50),
  measurements JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  delivery_date TIMESTAMP
);

-- Payments Table
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  invoice_number VARCHAR(100) UNIQUE NOT NULL,
  order_id UUID,
  order_type VARCHAR(50),
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50),
  transaction_id VARCHAR(255),
  has_gst BOOLEAN DEFAULT FALSE,
  gst_details JSONB,
  rating INTEGER,
  review TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- GST Rates Table
CREATE TABLE gst_rates (
  id UUID PRIMARY KEY,
  rate DECIMAL(5,2) NOT NULL,
  description VARCHAR(255),
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- HSN Codes Table
CREATE TABLE hsn_codes (
  id UUID PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,
  description VARCHAR(255),
  gst_rate DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Audit Logs Table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100),
  entity_id UUID,
  changes JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Monitoring & Analytics

### Application Monitoring
1. **Performance Metrics**
   - Page load times
   - API response times
   - Error rates
   - User sessions

2. **Business Metrics**
   - Order conversion rates
   - Customer lifetime value
   - Average order value
   - Tailor performance

3. **User Analytics**
   - User flows
   - Feature adoption
   - Drop-off points
   - Session duration

### Tools
- **Google Analytics**: User behavior
- **Mixpanel**: Product analytics
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **New Relic**: APM

---

## Internationalization (i18n)

### Current Setup
- Hardcoded English text
- Indian locale (₹, dates, names)

### Future i18n Support
```typescript
// Using react-i18next
import { useTranslation } from 'react-i18next';

function Component() {
  const { t } = useTranslation();
  return <h1>{t('dashboard.welcome')}</h1>;
}
```

### Supported Languages (Proposed)
- English (en)
- Hindi (hi)
- Tamil (ta)
- Telugu (te)
- Kannada (kn)
- Malayalam (ml)
- Bengali (bn)
- Marathi (mr)

---

## Documentation

### Required Documentation
1. **User Documentation**
   - User guides
   - Feature tutorials
   - FAQ
   - Video tutorials

2. **Developer Documentation**
   - Setup guide
   - API documentation
   - Component library
   - Coding standards

3. **Admin Documentation**
   - System administration
   - Configuration guide
   - Backup procedures
   - Troubleshooting

4. **Business Documentation**
   - Business logic
   - Workflow diagrams
   - Process flows
   - Integration guides

---

## Support & Maintenance

### Support Levels
1. **L1 Support**: Basic user queries
2. **L2 Support**: Technical issues
3. **L3 Support**: Development team escalation

### Maintenance Schedule
- **Daily**: Monitoring, backups
- **Weekly**: Security patches, bug fixes
- **Monthly**: Performance optimization, updates
- **Quarterly**: Feature releases, major updates

---

## Conclusion

The Wevraa application is a comprehensive business management system designed specifically for combined e-commerce and tailoring operations. The architecture supports scalability, maintainability, and future enhancements while maintaining a focus on user experience and Indian market requirements.

### Key Strengths
✅ Modular architecture
✅ Type-safe TypeScript implementation
✅ Responsive design
✅ Dark mode support
✅ Indian localization
✅ Comprehensive feature set
✅ GST tax integration
✅ Rating and review system
✅ Drag-and-drop functionality

### Next Steps
1. Backend API development
2. Database implementation
3. Authentication system
4. Real-time features
5. Mobile application
6. Advanced analytics
7. Third-party integrations

---

**Document Version**: 1.0  
**Last Updated**: January 2026  
**Maintained By**: Wevraa Development Team
