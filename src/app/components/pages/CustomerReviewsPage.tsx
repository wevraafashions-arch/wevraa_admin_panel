import { useState, useEffect, useCallback } from 'react';
import { Plus, Star, Trash2, Edit2, Search, X, Upload, User } from 'lucide-react';
import { ConfirmDeleteDialog } from '../ui/ConfirmDeleteDialog';
import { reviewsService } from '@/app/api/services/reviewsService';
import { customerService } from '@/app/api/services/customerService';
import { productsService } from '@/app/api/services/productsService';
import type { ApiReview, ReviewStats } from '@/app/api/types/review';
import type { ApiCustomer } from '@/app/api/types/customer';
import type { Product } from '@/app/api/types/product';

type ReviewStatus = 'Published' | 'Pending' | 'Hidden';
const API_STATUS_TO_UI: Record<string, ReviewStatus> = {
  PUBLISHED: 'Published',
  PENDING: 'Pending',
  HIDDEN: 'Hidden',
};
const UI_STATUS_TO_API = { Published: 'PUBLISHED', Pending: 'PENDING', Hidden: 'HIDDEN' } as const;

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export function CustomerReviewsPage() {
  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | ReviewStatus>('All');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [customers, setCustomers] = useState<ApiCustomer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [newReview, setNewReview] = useState({
    customerId: '',
    productId: '',
    rating: 5,
    reviewText: '',
    status: 'PENDING' as const,
    customerImageFile: null as File | null,
  });
  const [editingReview, setEditingReview] = useState<ApiReview | null>(null);
  const [editForm, setEditForm] = useState({ rating: 5, reviewText: '', status: 'PUBLISHED' as const });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    try {
      const data = await reviewsService.getStats();
      setStats(data);
    } catch {
      setStats(null);
    }
  }, []);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const statusParam = filterStatus === 'All' ? undefined : (UI_STATUS_TO_API[filterStatus] as 'PUBLISHED' | 'PENDING' | 'HIDDEN');
      const { items, total: t } = await reviewsService.getList({
        status: statusParam,
        search: searchQuery || undefined,
        page,
        limit,
      });
      setReviews(items);
      setTotal(t ?? items.length);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load reviews');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, searchQuery, page, limit]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  useEffect(() => {
    if (isAddModalOpen) {
      customerService.getList().then(setCustomers).catch(() => setCustomers([]));
      productsService.getList().then(setProducts).catch(() => setProducts([]));
    }
  }, [isAddModalOpen]);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.customerId || !newReview.productId || !newReview.reviewText.trim()) return;
    setSubmitting(true);
    try {
      if (newReview.customerImageFile) {
        await reviewsService.createWithImage({
          customerImage: newReview.customerImageFile,
          customerId: newReview.customerId,
          productId: newReview.productId,
          rating: newReview.rating,
          reviewText: newReview.reviewText.trim(),
          status: newReview.status,
        });
      } else {
        await reviewsService.create({
          customerId: newReview.customerId,
          productId: newReview.productId,
          rating: newReview.rating,
          reviewText: newReview.reviewText.trim(),
          status: newReview.status,
        });
      }
      await loadStats();
      await loadReviews();
      setIsAddModalOpen(false);
      setNewReview({
        customerId: '',
        productId: '',
        rating: 5,
        reviewText: '',
        status: 'PENDING',
        customerImageFile: null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add review');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setNewReview((prev) => ({ ...prev, customerImageFile: file }));
  };

  const handlePublish = async (id: string) => {
    setSubmitting(true);
    try {
      await reviewsService.publish(id);
      await loadStats();
      await loadReviews();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish');
    } finally {
      setSubmitting(false);
    }
  };

  const handleHide = async (id: string) => {
    setSubmitting(true);
    try {
      await reviewsService.hide(id);
      await loadStats();
      await loadReviews();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to hide');
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (review: ApiReview) => {
    setEditingReview(review);
    setEditForm({
      rating: review.rating,
      reviewText: review.reviewText,
      status: review.status,
    });
  };

  const handleUpdateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;
    setSubmitting(true);
    try {
      await reviewsService.update(editingReview.id, {
        rating: editForm.rating,
        reviewText: editForm.reviewText,
        status: editForm.status,
      });
      await loadStats();
      await loadReviews();
      setEditingReview(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update review');
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteDialog = (id: string) => {
    setPendingDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) return;
    setSubmitting(true);
    try {
      await reviewsService.delete(pendingDeleteId);
      setDeleteDialogOpen(false);
      setPendingDeleteId(null);
      await loadStats();
      await loadReviews();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400';
      case 'Pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400';
      case 'Hidden':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400';
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
        />
      ))}
    </div>
  );

  const dist = stats?.ratingDistribution ?? {};
  const ratingDistribution = [dist[5] ?? 0, dist[4] ?? 0, dist[3] ?? 0, dist[2] ?? 0, dist[1] ?? 0];
  const publishedCount = stats?.published ?? 0;

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-red-800 dark:text-red-200">
          {error}
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Customer Reviews</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and respond to customer feedback</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Plus className="w-5 h-5" />
          Add Review
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Reviews</div>
          <div className="text-2xl font-semibold text-gray-900 dark:text-white">{stats?.totalReviews ?? 0}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Average Rating</div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-semibold text-gray-900 dark:text-white">
              {(stats?.averageRating ?? 0).toFixed(1)}
            </div>
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Published</div>
          <div className="text-2xl font-semibold text-green-600 dark:text-green-400">{stats?.published ?? 0}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Pending</div>
          <div className="text-2xl font-semibold text-yellow-600 dark:text-yellow-400">{stats?.pending ?? 0}</div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Rating Distribution</h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating, index) => {
            const count = ratingDistribution[index];
            const percentage = publishedCount > 0 ? (count / publishedCount) * 100 : 0;
            return (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{rating}</span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by customer name, product, or review..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {loading && !reviews.length ? (
        <div className="flex items-center justify-center py-12 text-gray-500 dark:text-gray-400">
          Loading reviews...
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const statusUi = API_STATUS_TO_UI[review.status] ?? review.status;
            const customerName = review.customerName ?? `Customer ${review.customerId.slice(0, 8)}`;
            const productName = review.productName ?? `Product ${review.productId.slice(0, 8)}`;
            return (
              <div key={review.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-4">
                  {review.customerImageUrl ? (
                    <img
                      src={review.customerImageUrl}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                      {getInitials(customerName)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{customerName}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{productName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(statusUi)}`}>
                          {statusUi}
                        </span>
                        {review.createdAt && (
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mb-2">{renderStars(review.rating)}</div>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{review.reviewText}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => openEdit(review)}
                        disabled={submitting}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      {review.status === 'PENDING' && (
                        <button
                          onClick={() => handlePublish(review.id)}
                          disabled={submitting}
                          className="px-3 py-1.5 text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors disabled:opacity-50"
                        >
                          Approve
                        </button>
                      )}
                      {review.status === 'PUBLISHED' && (
                        <button
                          onClick={() => handleHide(review.id)}
                          disabled={submitting}
                          className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                        >
                          Hide
                        </button>
                      )}
                      <button
                        onClick={() => openDeleteDialog(review.id)}
                        disabled={submitting}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && reviews.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center border border-gray-200 dark:border-gray-700">
          <div className="text-gray-400 mb-2">
            <Star className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No reviews found</h3>
          <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}

      {total > limit && (
        <div className="flex justify-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="py-2 text-gray-600 dark:text-gray-400">
            Page {page} of {Math.ceil(total / limit) || 1}
          </span>
          <button
            type="button"
            disabled={page >= Math.ceil(total / limit)}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Add Review Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Review</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer *</label>
                <select
                  required
                  value={newReview.customerId}
                  onChange={(e) => setNewReview({ ...newReview, customerId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name ?? c.email ?? c.id}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product *</label>
                <select
                  required
                  value={newReview.productId}
                  onChange={(e) => setNewReview({ ...newReview, productId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title ?? p.id}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rating (1–5) *</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  required
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value, 10) || 5 })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Review text *</label>
                <textarea
                  required
                  placeholder="Excellent quality fabric and stitching!"
                  value={newReview.reviewText}
                  onChange={(e) => setNewReview({ ...newReview, reviewText: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select
                  value={newReview.status}
                  onChange={(e) => setNewReview({ ...newReview, status: e.target.value as 'PENDING' | 'PUBLISHED' | 'HIDDEN' })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="HIDDEN">Hidden</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : 'Add Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Review Modal */}
      {editingReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Review</h2>
              <button
                onClick={() => setEditingReview(null)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rating (1–5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={editForm.rating}
                  onChange={(e) => setEditForm({ ...editForm, rating: parseInt(e.target.value, 10) || 5 })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Review text</label>
                <textarea
                  value={editForm.reviewText}
                  onChange={(e) => setEditForm({ ...editForm, reviewText: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value as 'PUBLISHED' | 'PENDING' | 'HIDDEN' })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="HIDDEN">Hidden</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingReview(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setPendingDeleteId(null);
        }}
        title="Delete review"
        description="Are you sure you want to delete this review? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        isLoading={submitting}
      />
    </div>
  );
}