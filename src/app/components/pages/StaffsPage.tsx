import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Briefcase, Settings } from 'lucide-react';
import { ConfirmDeleteDialog } from '../ui/ConfirmDeleteDialog';

interface FieldConfig {
  id: string;
  name: string;
  type: 'text' | 'number' | 'email' | 'phone';
  required: boolean;
}

interface StaffCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  status: 'active' | 'inactive';
  createdAt: string;
  fields: FieldConfig[];
}

export function StaffsPage() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDeleteCategoryId, setPendingDeleteCategoryId] = useState<string | null>(null);
  const [categories, setCategories] = useState<StaffCategory[]>([
    {
      id: '1',
      name: 'Hand Embroidery',
      description: 'Skilled workers specializing in hand embroidery work',
      color: '#8B5CF6',
      status: 'active',
      createdAt: '2024-01-15',
      fields: [
        { id: '1', name: 'Name', type: 'text', required: true },
        { id: '2', name: 'Phone', type: 'phone', required: true },
      ],
    },
    {
      id: '2',
      name: 'Machine Embroidery',
      description: 'Workers trained in machine embroidery operations',
      color: '#3B82F6',
      status: 'active',
      createdAt: '2024-01-15',
      fields: [
        { id: '1', name: 'Name', type: 'text', required: true },
        { id: '2', name: 'Phone', type: 'phone', required: true },
      ],
    },
    {
      id: '3',
      name: 'Cutting',
      description: 'Expert fabric cutting specialists',
      color: '#EC4899',
      status: 'active',
      createdAt: '2024-01-16',
      fields: [
        { id: '1', name: 'Name', type: 'text', required: true },
        { id: '2', name: 'Phone', type: 'phone', required: true },
      ],
    },
    {
      id: '4',
      name: 'Stitching',
      description: 'Professional stitching and sewing workers',
      color: '#10B981',
      status: 'active',
      createdAt: '2024-01-16',
      fields: [
        { id: '1', name: 'Name', type: 'text', required: true },
        { id: '2', name: 'Phone', type: 'phone', required: true },
      ],
    },
    {
      id: '5',
      name: 'Finishing',
      description: 'Quality finishing and final touches specialists',
      color: '#F59E0B',
      status: 'active',
      createdAt: '2024-01-17',
      fields: [
        { id: '1', name: 'Name', type: 'text', required: true },
        { id: '2', name: 'Phone', type: 'phone', required: true },
      ],
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<StaffCategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    status: 'active' as 'active' | 'inactive',
    fields: [
      { id: '1', name: 'Name', type: 'text', required: true },
      { id: '2', name: 'Phone', type: 'phone', required: true },
    ],
  });

  const colorOptions = [
    { value: '#3B82F6', label: 'Blue' },
    { value: '#8B5CF6', label: 'Purple' },
    { value: '#EC4899', label: 'Pink' },
    { value: '#10B981', label: 'Green' },
    { value: '#F59E0B', label: 'Amber' },
    { value: '#EF4444', label: 'Red' },
    { value: '#6366F1', label: 'Indigo' },
    { value: '#14B8A6', label: 'Teal' },
  ];

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      color: '#3B82F6',
      status: 'active',
      fields: [
        { id: '1', name: 'Name', type: 'text', required: true },
        { id: '2', name: 'Phone', type: 'phone', required: true },
      ],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (category: StaffCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color,
      status: category.status,
      fields: category.fields,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCategory) {
      // Update existing category
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...formData }
          : cat
      ));
    } else {
      // Add new category
      const newCategory: StaffCategory = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setCategories([...categories, newCategory]);
    }
    
    setIsModalOpen(false);
  };

  const openDeleteDialog = (id: string) => {
    setPendingDeleteCategoryId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (pendingDeleteCategoryId) {
      setCategories(categories.filter(cat => cat.id !== pendingDeleteCategoryId));
      setDeleteDialogOpen(false);
      setPendingDeleteCategoryId(null);
    }
  };

  const activeCount = categories.filter(c => c.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Staff Categories</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage different staff specialization categories
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Categories</p>
              <p className="text-2xl font-semibold text-gray-900">{categories.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-semibold text-gray-900">{activeCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Inactive</p>
              <p className="text-2xl font-semibold text-gray-900">{categories.length - activeCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <Briefcase className="w-6 h-6" style={{ color: category.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${
                        category.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {category.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{category.description}</p>
              
              {/* Required Fields */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-700 mb-2">Required Fields:</p>
                <div className="flex flex-wrap gap-1.5">
                  {category.fields.filter(f => f.required).map((field) => (
                    <span
                      key={field.id}
                      className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-200"
                    >
                      {field.name}
                    </span>
                  ))}
                </div>
                {category.fields.filter(f => !f.required).length > 0 && (
                  <>
                    <p className="text-xs font-medium text-gray-700 mt-3 mb-2">Optional Fields:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {category.fields.filter(f => !f.required).map((field) => (
                        <span
                          key={field.id}
                          className="px-2 py-1 text-xs rounded-full bg-gray-50 text-gray-600 border border-gray-200"
                        >
                          {field.name}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  Created: {new Date(category.createdAt).toLocaleDateString('en-IN')}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(category)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openDeleteDialog(category.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No staff categories yet</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first staff category</p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Category
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Hand Embroidery"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this staff category"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Theme
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: color.value })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.color === color.value
                          ? 'border-gray-900 scale-105'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={{ backgroundColor: `${color.value}20` }}
                    >
                      <div
                        className="w-full h-6 rounded"
                        style={{ backgroundColor: color.value }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Field Configuration */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Required Fields Configuration
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const newField: FieldConfig = {
                        id: Date.now().toString(),
                        name: '',
                        type: 'text',
                        required: true,
                      };
                      setFormData({ ...formData, fields: [...formData.fields, newField] });
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Field
                  </button>
                </div>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {formData.fields.map((field, index) => (
                    <div key={field.id} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={field.name}
                          onChange={(e) => {
                            const newFields = [...formData.fields];
                            newFields[index].name = e.target.value;
                            setFormData({ ...formData, fields: newFields });
                          }}
                          placeholder="Field name"
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                        <div className="flex gap-2">
                          <select
                            value={field.type}
                            onChange={(e) => {
                              const newFields = [...formData.fields];
                              newFields[index].type = e.target.value as 'text' | 'number' | 'email' | 'phone';
                              setFormData({ ...formData, fields: newFields });
                            }}
                            className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="text">Text</option>
                            <option value="number">Number</option>
                            <option value="email">Email</option>
                            <option value="phone">Phone</option>
                          </select>
                          <label className="flex items-center gap-1.5 px-2 py-1.5 bg-white border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) => {
                                const newFields = [...formData.fields];
                                newFields[index].required = e.target.checked;
                                setFormData({ ...formData, fields: newFields });
                              }}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-xs text-gray-700">Required</span>
                          </label>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newFields = formData.fields.filter((_, i) => i !== index);
                          setFormData({ ...formData, fields: newFields });
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                {formData.fields.length === 0 && (
                  <div className="text-center py-8 text-sm text-gray-500">
                    No fields configured. Click "Add Field" to add fields.
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingCategory ? 'Update' : 'Add'} Category
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
          if (!open) setPendingDeleteCategoryId(null);
        }}
        title="Delete staff category"
        description="Are you sure you want to delete this staff category? This action cannot be undone."
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}