import {
  Plus,
  Search,
  Grid3x3,
  ArrowLeft,
  Package,
  Trash2,
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { AddCollectionModal } from '../AddCollectionModal';
import { ConfirmDeleteDialog } from '../ui/ConfirmDeleteDialog';
import { collectionsService } from '../../api/services/collectionsService';
import { ApiError } from '../../api/client';
import type { Collection } from '../../api/types/collection';

export function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewingCollection, setViewingCollection] = useState<Collection | null>(null);
  const [collectionToDelete, setCollectionToDelete] = useState<Collection | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchCollections = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await collectionsService.getList();
      setCollections(Array.isArray(list) ? list : []);
    } catch (e) {
      const message =
        e instanceof ApiError ? e.message : 'Failed to load collections';
      setError(message);
      setCollections([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const handleDeleteClick = (e: React.MouseEvent, collection: Collection) => {
    e.stopPropagation();
    setCollectionToDelete(collection);
  };

  const handleConfirmDelete = async () => {
    if (!collectionToDelete) return;
    setActionLoading(true);
    setError(null);
    try {
      await collectionsService.delete(collectionToDelete.id);
      if (viewingCollection?.id === collectionToDelete.id) {
        setViewingCollection(null);
      }
      await fetchCollections();
      setCollectionToDelete(null);
    } catch (e) {
      const message =
        e instanceof ApiError ? e.message : 'Failed to delete collection';
      setError(message);
    } finally {
      setActionLoading(false);
    }
  };

  // Collection detail view
  if (viewingCollection) {
    const products = viewingCollection.products ?? [];

    return (
      <div className="space-y-6">
        <ConfirmDeleteDialog
          open={!!collectionToDelete}
          onOpenChange={(open) => !open && setCollectionToDelete(null)}
          title="Delete collection"
          description={
            collectionToDelete
              ? `Are you sure you want to delete "${collectionToDelete.title}"? This action cannot be undone.`
              : undefined
          }
          onConfirm={handleConfirmDelete}
          isLoading={actionLoading}
        />

        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => setViewingCollection(null)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Collections
          </button>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 dark:text-white font-medium">
            {viewingCollection.title}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {viewingCollection.image ? (
              <img
                src={viewingCollection.image}
                alt={viewingCollection.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <Grid3x3 className="w-6 h-6 text-gray-400" />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {viewingCollection.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {products.length} product{products.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {viewingCollection.description && (
          <p className="text-gray-600 dark:text-gray-400">
            {viewingCollection.description}
          </p>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-900 dark:text-white font-medium mb-1">
                No products in this collection
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Products linked to this collection will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Product ID
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/30"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {product.id}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Collections list view
  return (
    <div className="space-y-6">
      <ConfirmDeleteDialog
        open={!!collectionToDelete}
        onOpenChange={(open) => !open && setCollectionToDelete(null)}
        title="Delete collection"
        description={
          collectionToDelete
            ? `Are you sure you want to delete "${collectionToDelete.title}"? This action cannot be undone.`
            : undefined
        }
        onConfirm={handleConfirmDelete}
        isLoading={actionLoading}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Grid3x3 className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Collections
          </h2>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add collection
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="animate-pulse divide-y divide-gray-200 dark:divide-gray-700">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Products
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {collections.map((collection) => (
                  <tr
                    key={collection.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer"
                    onClick={() => setViewingCollection(collection)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {collection.image ? (
                          <img
                            src={collection.image}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                            <Grid3x3 className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {collection.title}
                          </span>
                          {collection.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                              {collection.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {collection.products?.length ?? 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${collection.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}
                      >
                        {collection.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {collection.type ?? '—'}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-right"
                      onClick={(e) => handleDeleteClick(e, collection)}
                    >
                      <button
                        disabled={actionLoading}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete collection"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {collections.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Grid3x3 className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-900 dark:text-white font-medium mb-1">
                No collections yet
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Create a collection to group products.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add collection
              </button>
            </div>
          )}
        </div>
      )}

      <AddCollectionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCreated={fetchCollections}
      />
    </div>
  );
}
