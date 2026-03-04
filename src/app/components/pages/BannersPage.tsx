import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { ConfirmDeleteDialog } from '../ui/ConfirmDeleteDialog';
import { bannersService } from '../../api/services/bannersService';
import { ApiError } from '../../api/client';
import type { Banner } from '../../api/types/banner';

const TARGET_PAGE_OPTIONS = ['Home', 'Category', 'Collection', 'Product', 'Custom'];
const MAX_IMAGE_MB = 5;

export function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    imageFile: null as File | null,
    imagePreview: '', // file preview or existing banner image URL when editing
    title: '',
    description: '',
    linkUrl: '',
    targetPage: 'Home',
    startDate: '',
    endDate: '',
    isActive: true,
  });

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await bannersService.getList();
      setBanners(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load banners');
      setBanners([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const openAdd = () => {
    setEditingBanner(null);
    setForm({
      imageFile: null,
      imagePreview: '',
      title: '',
      description: '',
      linkUrl: '',
      targetPage: 'Home',
      startDate: '',
      endDate: '',
      isActive: true,
    });
    setShowModal(true);
  };

  const openEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setForm({
      imageFile: null,
      imagePreview: banner.imageUrl || '',
      title: banner.title || '',
      description: banner.description || '',
      linkUrl: banner.linkUrl || '',
      targetPage: banner.targetPage || 'Home',
      startDate: banner.startDate?.slice(0, 10) || '',
      endDate: banner.endDate?.slice(0, 10) || '',
      isActive: banner.isActive ?? true,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBanner(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setError(`Image must be under ${MAX_IMAGE_MB} MB`);
      return;
    }
    setForm((f) => ({ ...f, imageFile: file, imagePreview: URL.createObjectURL(file) }));
    e.target.value = '';
  };

  const removeImage = () => {
    setForm((f) => ({
      ...f,
      imageFile: null,
      imagePreview: editingBanner?.imageUrl || '',
    }));
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim() || !form.linkUrl.trim() || !form.startDate || !form.endDate) {
      setError('Title, description, link URL, start date and end date are required');
      return;
    }
    if (!editingBanner && !form.imageFile) {
      setError('Please upload an image');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        linkUrl: form.linkUrl.trim(),
        targetPage: form.targetPage || 'Home',
        startDate: form.startDate,
        endDate: form.endDate,
        isActive: form.isActive,
      };

      if (editingBanner) {
        if (form.imageFile) {
          const fd = new FormData();
          fd.append('image', form.imageFile);
          fd.append('title', payload.title);
          fd.append('description', payload.description);
          fd.append('linkUrl', payload.linkUrl);
          fd.append('targetPage', payload.targetPage);
          fd.append('startDate', payload.startDate);
          fd.append('endDate', payload.endDate);
          fd.append('isActive', String(payload.isActive));
          await bannersService.updateWithImage(editingBanner.id, fd);
        } else {
          await bannersService.update(editingBanner.id, payload);
        }
      } else {
        if (!form.imageFile) {
          setError('Please upload an image');
          setSaving(false);
          return;
        }
        const fd = new FormData();
        fd.append('image', form.imageFile);
        fd.append('title', payload.title);
        fd.append('description', payload.description);
        fd.append('linkUrl', payload.linkUrl);
        fd.append('targetPage', payload.targetPage);
        fd.append('startDate', payload.startDate);
        fd.append('endDate', payload.endDate);
        fd.append('isActive', String(payload.isActive));
        await bannersService.createWithImage(fd);
      }
      await fetchBanners();
      closeModal();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : (editingBanner ? 'Failed to update banner' : 'Failed to create banner'));
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!bannerToDelete) return;
    setActionLoading(true);
    setError(null);
    try {
      await bannersService.delete(bannerToDelete.id);
      await fetchBanners();
      setBannerToDelete(null);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to delete banner');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <ConfirmDeleteDialog
        open={!!bannerToDelete}
        onOpenChange={(open) => !open && setBannerToDelete(null)}
        title="Delete banner"
        description={bannerToDelete ? `Are you sure you want to delete "${bannerToDelete.title}"?` : undefined}
        onConfirm={handleConfirmDelete}
        isLoading={actionLoading}
      />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Banners</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage promotional banners</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add banner
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 dark:text-gray-400">Loading banners…</p>
        </div>
      ) : banners.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center py-16 text-center">
          <ImageIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-900 dark:text-white font-medium mb-1">No banners yet</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Create a banner to show on your storefront.</p>
          <button onClick={openAdd} className="inline-flex items-center gap-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
            <Plus className="w-5 h-5" />
            Add banner
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Target</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Period</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {banners.map((banner) => (
                  <tr key={banner.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-6 py-4">
                      {banner.imageUrl ? (
                        <img src={banner.imageUrl} alt="" className="w-16 h-10 object-cover rounded" />
                      ) : (
                        <div className="w-16 h-10 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 dark:text-white">{banner.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">{banner.description}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{banner.targetPage || 'Home'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {banner.startDate?.slice(0, 10)} – {banner.endDate?.slice(0, 10)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          banner.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {banner.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(banner)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setBannerToDelete(banner)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{editingBanner ? 'Edit banner' : 'Add banner'}</h3>
              <button onClick={closeModal} className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Image {!editingBanner && '*'}
                </label>
                {form.imagePreview ? (
                  <div className="relative inline-block">
                    <img src={form.imagePreview} alt="Banner" className="w-full max-h-40 object-contain rounded-lg border border-gray-200 dark:border-gray-600" />
                    <button type="button" onClick={removeImage} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded hover:bg-red-600">
                      <X className="w-4 h-4" />
                    </button>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Click remove then choose a new file to replace</p>
                  </div>
                ) : (
                  <div
                    onClick={() => document.getElementById('banner-file-input')?.click()}
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Click to upload image</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PNG, JPG up to 5 MB</p>
                    <input
                      id="banner-file-input"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Summer Sale 2025"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Brief description"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Link URL *</label>
                <input
                  type="text"
                  value={form.linkUrl}
                  onChange={(e) => setForm((f) => ({ ...f, linkUrl: e.target.value }))}
                  placeholder="/collections/summer-sale"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target page</label>
                <select
                  value={form.targetPage}
                  onChange={(e) => setForm((f) => ({ ...f, targetPage: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {TARGET_PAGE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start date *</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End date *</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="banner-active"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="banner-active" className="text-sm text-gray-700 dark:text-gray-300">Active</label>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
              <button onClick={closeModal} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.title.trim() || !form.description.trim() || !form.linkUrl.trim() || !form.startDate || !form.endDate || (!editingBanner && !form.imageFile)}
                className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 flex items-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? 'Saving…' : editingBanner ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
