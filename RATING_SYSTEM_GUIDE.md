# Tailor Rating System - Complete Guide

## Overview

We've implemented a comprehensive rating system for your Wevraa tailoring business that allows customers to rate their orders/invoices, and these ratings are visible to all users. The system is fully integrated with dark mode and uses Indian context throughout.

## System Components

### 1. Rating Modal Component (`/src/app/components/RatingModal.tsx`)

**Purpose**: Provides an interactive interface for customers to submit ratings for completed orders.

**Features**:
- 5-star rating system with hover effects
- Text review input (minimum 10 characters, maximum 500)
- Optional image uploads (up to 5 images)
- Displays order details (Invoice Number, Customer, Tailor, Order Type, Amount)
- Real-time validation
- Fully responsive with dark mode support

**User Experience**:
1. Customer clicks "Rate" button on a completed invoice
2. Modal opens showing order details
3. Customer selects star rating (1-5)
4. Customer writes review text
5. Optionally uploads photos
6. Clicks "Submit Rating" to save

### 2. Enhanced Invoices Page (`/src/app/components/pages/InvoicesPage.tsx`)

**New Features**:
- Added "Rate" button for each payment record
- Rating data stored in payment records (rating, review, reviewImages, reviewDate)
- Integrated RatingModal component
- State management for ratings

**Data Structure**:
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
  rating?: number;              // New: 1-5 rating
  review?: string;              // New: Review text
  reviewImages?: string[];      // New: Array of image URLs
  reviewDate?: string;          // New: When rating was submitted
}
```

### 3. Tailor Ratings Page (`/src/app/components/pages/TailorRatingsPage.tsx`)

**Purpose**: Central hub for viewing, managing, and analyzing all customer ratings.

**Key Features**:

#### Statistics Dashboard:
- **Total Ratings**: Count of all submitted ratings
- **Average Rating**: Overall average (out of 5.0)
- **Published Count**: Number of approved/published ratings
- **Pending Review Count**: Ratings awaiting approval

#### Rating Distribution Chart:
- Visual bar chart showing breakdown of 5-star to 1-star ratings
- Percentage-based width calculations
- Real-time updates

#### Advanced Filtering:
- **Search**: By invoice number, customer name, tailor name, or order type
- **Status Filter**: All, Published, Pending, Flagged
- **Rating Filter**: All, 5 stars, 4 stars, 3 stars, 2 stars, 1 star

#### Rating Cards Display:
Each rating shows:
- Customer avatar with initials
- Customer name and invoice number
- Tailor name
- Order type and service
- Star rating (visual + numeric)
- Review text
- Amount paid (₹)
- Payment date
- Review submission date
- Status badge (Published/Pending/Flagged)
- "View Details" action button

#### Detailed View Modal:
Opens when clicking "View Details":
- Complete customer information
- Full order details
- Tailor information
- Complete review text
- All uploaded images (if any)
- Payment and review dates
- Action buttons (Close, Publish Review)

## How the Rating Flow Works

### Step 1: Tailor Generates Invoice
1. Tailor completes the order
2. System generates invoice (e.g., TLR-INV-2024-001)
3. Customer makes payment (tracked in Invoices & Payments page)

### Step 2: Customer Rates the Order
1. Customer views invoice in the customer app
2. Clicks "Rate this Order" button
3. RatingModal opens with pre-filled order details
4. Customer:
   - Selects star rating (1-5)
   - Writes detailed review
   - Optionally uploads photos of the work
5. Submits rating

### Step 3: Rating Storage
Rating data is stored with the payment record:
```javascript
{
  id: '1',
  invoiceNumber: 'TLR-INV-2024-001',
  customerName: 'Priya Sharma',
  tailorName: 'Lakshmi Iyer',
  orderType: 'Blouse Stitching',
  amount: 1200,
  rating: 5,
  review: 'Excellent work! Perfect fit and beautiful stitching.',
  reviewImages: ['base64ImageData1', 'base64ImageData2'],
  reviewDate: '2024-01-12',
  status: 'Pending' // or 'Published'
}
```

### Step 4: Admin Review (Optional)
1. Admin views rating in "Tailor Ratings" page
2. Reviews content for appropriateness
3. Can:
   - Publish the rating (makes it publicly visible)
   - Flag for inappropriate content
   - Keep as pending

### Step 5: Public Visibility
Once published:
- Rating appears in "Tailor Ratings" page with "Published" status
- Visible to all users (customers, admins, tailors)
- Contributes to:
  - Overall average rating
  - Rating distribution statistics
  - Tailor's reputation metrics

## User Roles & Permissions

### Customers:
- Can rate their own completed orders
- Can view all published ratings
- Cannot edit ratings after submission (by design)

### Tailors:
- Can view ratings for their work
- Cannot modify or delete ratings
- Can see overall rating statistics

### Admins:
- Full access to all ratings
- Can approve/publish ratings
- Can flag inappropriate content
- Can view detailed analytics

## Indian Context Features

All components use Indian context:

1. **Currency**: All amounts displayed in Indian Rupees (₹)
2. **Names**: All sample data uses authentic Indian names
   - Customers: Priya Sharma, Anita Desai, Deepika Menon, etc.
   - Tailors: Lakshmi Iyer, Rajesh Kumar, Arjun Reddy, etc.
3. **Order Types**: Indian ethnic wear
   - Blouse Stitching, Lehenga Stitching, Salwar Kameez
   - Sherwani, Saree Blouse, Anarkali Suit, etc.
4. **Date Format**: Indian date format (DD MMM YYYY)
   - Example: "10 Jan, 2024"
5. **Phone Numbers**: Indian format (+91 XXXXX XXXXX)
6. **Language**: Professional yet culturally appropriate tone

## Technical Implementation

### State Management:
```javascript
// In InvoicesPage
const [showRatingModal, setShowRatingModal] = useState(false);
const [ratingInvoice, setRatingInvoice] = useState<PaymentRecord | null>(null);
const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([...]);

// Handlers
const handleRatePayment = (record: PaymentRecord) => {
  setRatingInvoice(record);
  setShowRatingModal(true);
};

const handleRatingSubmit = (rating, review, reviewImages) => {
  setPaymentRecords(prevRecords =>
    prevRecords.map(record =>
      record.id === ratingInvoice.id
        ? { ...record, rating, review, reviewImages, reviewDate: new Date().toISOString() }
        : record
    )
  );
  setShowRatingModal(false);
};
```

### Dark Mode Support:
All components include dark mode classes:
```jsx
className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
```

### Responsive Design:
- Mobile-first approach
- Flexible layouts with Tailwind CSS
- Touch-friendly buttons and controls
- Collapsible sections for small screens

## Navigation

**Access Points**:
1. **Sidebar Menu**: Tailoring → Tailor Ratings
2. **Invoices Page**: "Rate" button on each payment record
3. **Direct Navigation**: ID `tailor-ratings` in app routing

## Sample Data

The system includes 9 sample ratings with:
- Variety of star ratings (2-5 stars)
- Diverse order types
- Different tailors
- Range of review lengths
- Various statuses (Published, Pending, Flagged)
- Realistic Indian customer experiences

## Benefits

### For Customers:
- Voice their satisfaction/dissatisfaction
- Help other customers make informed decisions
- Build trust in quality tailors
- Share detailed experiences with photos

### For Tailors:
- Build reputation through positive reviews
- Identify areas for improvement
- Showcase quality work
- Attract new customers

### For Business (Wevraa):
- Quality control mechanism
- Customer feedback loop
- Marketing content (positive reviews)
- Performance metrics for tailors
- Competitive advantage

## Future Enhancements (Recommended)

1. **Reply System**: Allow tailors to respond to reviews
2. **Rating Analytics**: Per-tailor performance dashboards
3. **Verified Purchase Badge**: Mark ratings from confirmed orders
4. **Helpful Votes**: Let users mark reviews as helpful
5. **Photo Gallery**: Showcase highly-rated work in Design Gallery
6. **Tailor Profiles**: Show average rating on tailor profile pages
7. **Email Notifications**: Alert tailors of new ratings
8. **Report Feature**: Allow users to report inappropriate reviews
9. **Export Ratings**: Download ratings data as CSV/PDF
10. **Rating Reminders**: Automated prompts for customers to rate orders

## Database Integration (When Ready)

Current implementation uses frontend state management. When connecting to a backend:

### Recommended Database Schema:

```sql
CREATE TABLE tailor_ratings (
  id VARCHAR(50) PRIMARY KEY,
  invoice_id VARCHAR(50) REFERENCES invoices(id),
  customer_id VARCHAR(50) REFERENCES customers(id),
  tailor_id VARCHAR(50) REFERENCES tailors(id),
  order_id VARCHAR(50) REFERENCES orders(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  review_images JSONB,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP,
  CONSTRAINT unique_invoice_rating UNIQUE (invoice_id)
);

CREATE INDEX idx_ratings_tailor ON tailor_ratings(tailor_id);
CREATE INDEX idx_ratings_status ON tailor_ratings(status);
CREATE INDEX idx_ratings_rating ON tailor_ratings(rating);
```

### API Endpoints:

```
POST   /api/ratings              - Submit new rating
GET    /api/ratings              - Get all ratings (with filters)
GET    /api/ratings/:id          - Get specific rating
PUT    /api/ratings/:id          - Update rating (admin only)
DELETE /api/ratings/:id          - Delete rating (admin only)
PATCH  /api/ratings/:id/publish  - Publish rating (admin only)
GET    /api/ratings/stats        - Get rating statistics
GET    /api/tailors/:id/ratings  - Get ratings for specific tailor
```

## Support & Maintenance

### Testing Checklist:
- [ ] Submit rating with all fields
- [ ] Submit rating without images
- [ ] Validate minimum review length
- [ ] Test star rating interactions
- [ ] Verify dark mode appearance
- [ ] Test on mobile devices
- [ ] Check filtering functionality
- [ ] Verify search functionality
- [ ] Test status changes
- [ ] Validate responsive layout

### Known Limitations:
1. Ratings stored in browser state (not persisted)
2. No server-side validation yet
3. Images stored as base64 (consider cloud storage)
4. No pagination (add when data grows)
5. No rating edit functionality

## Conclusion

This rating system provides a complete solution for managing customer feedback in your Wevraa tailoring business. It's designed with Indian context, full dark mode support, and professional UI/UX. The system is ready for immediate use and can easily be extended with database integration when needed.

For questions or support, refer to the component files:
- `/src/app/components/RatingModal.tsx`
- `/src/app/components/pages/InvoicesPage.tsx`
- `/src/app/components/pages/TailorRatingsPage.tsx`
