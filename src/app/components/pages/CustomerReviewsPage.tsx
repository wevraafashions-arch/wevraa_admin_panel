import { useState } from 'react';
import { Plus, Star, Trash2, Edit2, Search, X, Upload, User } from 'lucide-react';

interface Review {
  id: number;
  customerName: string;
  customerIcon: string;
  customerPhoto?: string;
  rating: number;
  review: string;
  productName: string;
  date: string;
  status: 'Published' | 'Pending' | 'Hidden';
}

const mockReviews: Review[] = [
  {
    id: 1,
    customerName: 'Priya Sharma',
    customerIcon: 'PS',
    rating: 5,
    review: 'Excellent quality fabric and stitching! The saree exceeded my expectations. Delivery was prompt and packaging was beautiful.',
    productName: 'Banarasi Silk Saree',
    date: '2026-01-10',
    status: 'Published'
  },
  {
    id: 2,
    customerName: 'Rahul Verma',
    customerIcon: 'RV',
    rating: 4,
    review: 'Good quality kurta. Fits perfectly. The color is slightly different from the picture but overall satisfied.',
    productName: 'Cotton Kurta Set',
    date: '2026-01-08',
    status: 'Published'
  },
  {
    id: 3,
    customerName: 'Ananya Patel',
    customerIcon: 'AP',
    rating: 5,
    review: 'Amazing work! The tailoring is perfect. The measurements were spot on and the fabric quality is excellent.',
    productName: 'Designer Lehenga',
    date: '2026-01-05',
    status: 'Published'
  },
  {
    id: 4,
    customerName: 'Vikram Singh',
    customerIcon: 'VS',
    rating: 3,
    review: 'Average experience. Product quality is okay but delivery took longer than expected.',
    productName: 'Sherwani Set',
    date: '2026-01-03',
    status: 'Pending'
  },
  {
    id: 5,
    customerName: 'Kavita Reddy',
    customerIcon: 'KR',
    rating: 5,
    review: 'Beautiful embroidery work! Loved the design and the fit is perfect. Will definitely order again.',
    productName: 'Anarkali Suit',
    date: '2025-12-28',
    status: 'Published'
  },
  {
    id: 6,
    customerName: 'Arjun Mehta',
    customerIcon: 'AM',
    rating: 2,
    review: 'Not satisfied with the product. The fabric quality was below expectations and had stitching issues.',
    productName: 'Pathani Suit',
    date: '2025-12-25',
    status: 'Hidden'
  },
  {
    id: 7,
    customerName: 'Sneha Gupta',
    customerIcon: 'SG',
    rating: 5,
    review: 'Absolutely stunning! The craftsmanship is top-notch. Perfect for my wedding function.',
    productName: 'Bridal Lehenga',
    date: '2025-12-20',
    status: 'Published'
  },
  {
    id: 8,
    customerName: 'Rajesh Kumar',
    customerIcon: 'RK',
    rating: 4,
    review: 'Good product at reasonable price. Fast delivery and good customer service.',
    productName: 'Nehru Jacket',
    date: '2025-12-15',
    status: 'Published'
  }
];

export function CustomerReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Published' | 'Pending' | 'Hidden'>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    customerName: '',
    customerPhoto: '',
    rating: 5,
    review: '',
    productName: '',
    status: 'Pending' as const
  });

  const handleAddReview = () => {
    const initials = newReview.customerName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const review: Review = {
      id: reviews.length + 1,
      customerName: newReview.customerName,
      customerIcon: initials,
      customerPhoto: newReview.customerPhoto,
      rating: newReview.rating,
      review: newReview.review,
      productName: newReview.productName,
      date: new Date().toISOString().split('T')[0],
      status: newReview.status
    };

    setReviews([review, ...reviews]);
    setIsAddModalOpen(false);
    setNewReview({
      customerName: '',
      customerPhoto: '',
      rating: 5,
      review: '',
      productName: '',
      status: 'Pending'
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewReview({ ...newReview, customerPhoto: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.review.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'All' || review.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hidden':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getAverageRating = () => {
    const publishedReviews = reviews.filter(r => r.status === 'Published');
    if (publishedReviews.length === 0) return 0;
    const sum = publishedReviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / publishedReviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0];
    reviews.filter(r => r.status === 'Published').forEach(r => {
      distribution[r.rating - 1]++;
    });
    return distribution.reverse();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Customer Reviews</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and respond to customer feedback</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Review
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-500 mb-1">Total Reviews</div>
          <div className="text-2xl font-semibold text-gray-900">{reviews.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-500 mb-1">Average Rating</div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-semibold text-gray-900">{getAverageRating()}</div>
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-500 mb-1">Published</div>
          <div className="text-2xl font-semibold text-green-600">
            {reviews.filter(r => r.status === 'Published').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-500 mb-1">Pending</div>
          <div className="text-2xl font-semibold text-yellow-600">
            {reviews.filter(r => r.status === 'Pending').length}
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating, index) => {
            const distribution = getRatingDistribution();
            const count = distribution[index];
            const percentage = reviews.filter(r => r.status === 'Published').length > 0
              ? (count / reviews.filter(r => r.status === 'Published').length) * 100
              : 0;
            
            return (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm text-gray-600">{rating}</span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by customer name, product, or review..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {(['All', 'Published', 'Pending', 'Hidden'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              {/* Customer Icon */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                {review.customerIcon}
              </div>

              {/* Review Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{review.customerName}</h3>
                    <p className="text-sm text-gray-500">{review.productName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
                      {review.status}
                    </span>
                    <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="mb-2">
                  {renderStars(review.rating)}
                </div>

                {/* Review Text */}
                <p className="text-gray-700 mb-4">{review.review}</p>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  {review.status === 'Pending' && (
                    <button className="px-3 py-1.5 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      Approve
                    </button>
                  )}
                  {review.status === 'Published' && (
                    <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      Hide
                    </button>
                  )}
                  <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-gray-400 mb-2">
            <Star className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No reviews found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Add Review Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Add New Review</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                  {newReview.customerName
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Customer Name"
                    value={newReview.customerName}
                    onChange={(e) => setNewReview({ ...newReview, customerName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-semibold text-lg flex-shrink-0">
                  {newReview.customerPhoto ? (
                    <img
                      src={newReview.customerPhoto}
                      alt="Customer Photo"
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-semibold text-lg flex-shrink-0">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-semibold text-lg flex-shrink-0">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <textarea
                    placeholder="Review Text"
                    value={newReview.review}
                    onChange={(e) => setNewReview({ ...newReview, review: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-semibold text-lg flex-shrink-0">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={newReview.productName}
                    onChange={(e) => setNewReview({ ...newReview, productName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-semibold text-lg flex-shrink-0">
                  <Plus className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <button
                    onClick={handleAddReview}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}