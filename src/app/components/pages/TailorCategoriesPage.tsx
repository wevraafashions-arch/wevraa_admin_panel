import { useState, useRef, useEffect } from 'react';
import { Plus, Edit, Trash2, ArrowLeft, ChevronRight, X, GripVertical } from 'lucide-react';
import { useTailorCategories, Category, SubCategory } from '@/contexts/TailorCategoriesContext';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ConfirmDeleteDialog } from '../ui/ConfirmDeleteDialog';

const ItemTypes = {
  CATEGORY: 'category',
  SUBCATEGORY: 'subcategory',
};

interface DragItem {
  index: number;
  id: string;
  type: string;
}

interface DraggableCategoryRowProps {
  category: Category;
  index: number;
  onSelect: (category: Category) => void;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
  moveCategory: (dragIndex: number, hoverIndex: number) => void;
}

function DraggableCategoryRow({
  category,
  index,
  onSelect,
  onEdit,
  onDelete,
  moveCategory,
}: DraggableCategoryRowProps) {
  const ref = useRef<HTMLTableRowElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.CATEGORY,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset?.y || 0) - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveCategory(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.CATEGORY,
    item: () => {
      return { id: category.id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;
  preview(drop(ref));

  return (
    <tr
      ref={ref}
      data-handler-id={handlerId}
      style={{ opacity }}
      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-move"
    >
      <td className="px-6 py-4">
        <div ref={drag} className="cursor-grab active:cursor-grabbing inline-flex">
          <GripVertical className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        </div>
      </td>
      <td className="px-6 py-4">
        <button
          onClick={() => onSelect(category)}
          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          {category.name}
        </button>
      </td>
      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{category.description}</td>
      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{category.orders}</td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            category.status === 'Active'
              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400'
          }`}
        >
          {category.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(category)}
            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(category.id)}
            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onSelect(category)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="View Subcategories"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

interface DraggableSubCategoryRowProps {
  subcategory: SubCategory;
  index: number;
  onEdit: (subcategory: SubCategory) => void;
  onDelete: (subcategoryId: string) => void;
  moveSubCategory: (dragIndex: number, hoverIndex: number) => void;
}

function DraggableSubCategoryRow({
  subcategory,
  index,
  onEdit,
  onDelete,
  moveSubCategory,
}: DraggableSubCategoryRowProps) {
  const ref = useRef<HTMLTableRowElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.SUBCATEGORY,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset?.y || 0) - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveSubCategory(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.SUBCATEGORY,
    item: () => {
      return { id: subcategory.id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;
  preview(drop(ref));

  return (
    <tr
      ref={ref}
      data-handler-id={handlerId}
      style={{ opacity }}
      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-move"
    >
      <td className="px-6 py-4">
        <div ref={drag} className="cursor-grab active:cursor-grabbing inline-flex">
          <GripVertical className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        </div>
      </td>
      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{subcategory.name}</td>
      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{subcategory.description}</td>
      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{subcategory.orders}</td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            subcategory.status === 'Active'
              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400'
          }`}
        >
          {subcategory.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(subcategory)}
            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(subcategory.id)}
            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export function TailorCategoriesPage() {
  const {
    categories,
    subCategoriesData,
    loading,
    error,
    loadSubCategories,
    reorderCategories,
    reorderSubCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    createSubCategory,
    updateSubCategory,
    deleteSubCategory,
  } = useTailorCategories();

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [isAddSubCategoryModalOpen, setIsAddSubCategoryModalOpen] = useState(false);
  const [isEditSubCategoryModalOpen, setIsEditSubCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    status: 'Active',
  });

  const [subCategoryForm, setSubCategoryForm] = useState({
    name: '',
    description: '',
    status: 'Active' as 'Active' | 'Inactive',
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<
    { type: 'category'; id: string } | { type: 'subcategory'; id: string; categoryId: string } | null
  >(null);

  useEffect(() => {
    if (selectedCategory) loadSubCategories(selectedCategory.id);
  }, [selectedCategory, loadSubCategories]);

  // Drag and drop handlers
  const moveCategoryHandler = (dragIndex: number, hoverIndex: number) => {
    reorderCategories(dragIndex, hoverIndex);
  };

  const moveSubCategoryHandler = (dragIndex: number, hoverIndex: number) => {
    if (selectedCategory) {
      reorderSubCategories(selectedCategory.id, dragIndex, hoverIndex);
    }
  };

  // Category CRUD operations
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createCategory({
        name: categoryForm.name,
        description: categoryForm.description,
        status: categoryForm.status,
        sortOrder: categories.length,
      });
      setIsAddCategoryModalOpen(false);
      setCategoryForm({ name: '', description: '', status: 'Active' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    setSubmitting(true);
    try {
      await updateCategory(editingCategory.id, {
        name: categoryForm.name,
        description: categoryForm.description,
        status: categoryForm.status,
      });
      setIsEditCategoryModalOpen(false);
      setEditingCategory(null);
      setCategoryForm({ name: '', description: '', status: 'Active' });
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteCategoryDialog = (categoryId: string) => {
    setPendingDelete({ type: 'category', id: categoryId });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    setSubmitting(true);
    try {
      if (pendingDelete.type === 'category') {
        await deleteCategory(pendingDelete.id);
      } else {
        await deleteSubCategory(pendingDelete.id, pendingDelete.categoryId);
      }
      setDeleteDialogOpen(false);
      setPendingDelete(null);
    } finally {
      setSubmitting(false);
    }
  };

  const openEditCategoryModal = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description,
      status: category.status,
    });
    setIsEditCategoryModalOpen(true);
  };

  // Sub-category CRUD operations
  const handleAddSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;
    setSubmitting(true);
    try {
      await createSubCategory(selectedCategory.id, {
        name: subCategoryForm.name,
        description: subCategoryForm.description,
        status: subCategoryForm.status,
      });
      setIsAddSubCategoryModalOpen(false);
      setSubCategoryForm({ name: '', description: '', status: 'Active' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubCategory) return;
    setSubmitting(true);
    try {
      await updateSubCategory(editingSubCategory.id, {
        name: subCategoryForm.name,
        description: subCategoryForm.description,
        status: subCategoryForm.status,
      });
      setIsEditSubCategoryModalOpen(false);
      setEditingSubCategory(null);
      setSubCategoryForm({ name: '', description: '', status: 'Active' });
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteSubCategoryDialog = (subcategoryId: string) => {
    if (!selectedCategory) return;
    setPendingDelete({ type: 'subcategory', id: subcategoryId, categoryId: selectedCategory.id });
    setDeleteDialogOpen(true);
  };

  const openEditSubCategoryModal = (subcategory: SubCategory) => {
    setEditingSubCategory(subcategory);
    setSubCategoryForm({
      name: subcategory.name,
      description: subcategory.description,
      status: subcategory.status,
    });
    setIsEditSubCategoryModalOpen(true);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-red-800 dark:text-red-200">
            {error}
          </div>
        )}
        {loading && !categories.length ? (
          <div className="flex items-center justify-center py-12 text-gray-500 dark:text-gray-400">
            Loading categories...
          </div>
        ) : !selectedCategory ? (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Tailor Categories</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Manage categories and sub-categories for tailoring services. Drag to reorder.
                </p>
              </div>
              <button
                onClick={() => setIsAddCategoryModalOpen(true)}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                Add Category
              </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Category Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {categories.map((category, index) => (
                    <DraggableCategoryRow
                      key={category.id}
                      category={category}
                      index={index}
                      onSelect={setSelectedCategory}
                      onEdit={openEditCategoryModal}
                      onDelete={openDeleteCategoryDialog}
                      moveCategory={moveCategoryHandler}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {selectedCategory.name} - Sub-categories
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Manage sub-categories for {selectedCategory.name}. Drag to reorder.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddSubCategoryModalOpen(true)}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                Add Sub-category
              </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Sub-category Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {(subCategoriesData[selectedCategory.id] || []).map((subcategory, index) => (
                  <DraggableSubCategoryRow
                    key={subcategory.id}
                    subcategory={subcategory}
                    index={index}
                    onEdit={openEditSubCategoryModal}
                    onDelete={openDeleteSubCategoryDialog}
                    moveSubCategory={moveSubCategoryHandler}
                  />
                ))}
              </tbody>
            </table>
            </div>
          </>
        )}

        {/* Add Category Modal */}
        {isAddCategoryModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Category</h2>
                <button
                  onClick={() => setIsAddCategoryModalOpen(false)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddCategory} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g., Saree Blouse"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Describe this category..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                  <select
                    value={categoryForm.status}
                    onChange={(e) => setCategoryForm({ ...categoryForm, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddCategoryModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Adding...' : 'Add Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Category Modal */}
        {isEditCategoryModalOpen && editingCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Category</h2>
                <button
                  onClick={() => {
                    setIsEditCategoryModalOpen(false);
                    setEditingCategory(null);
                  }}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleEditCategory} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                  <select
                    value={categoryForm.status}
                    onChange={(e) => setCategoryForm({ ...categoryForm, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditCategoryModalOpen(false);
                      setEditingCategory(null);
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Sub-category Modal */}
        {isAddSubCategoryModalOpen && selectedCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Add Sub-category to {selectedCategory.name}
                </h2>
                <button
                  onClick={() => setIsAddSubCategoryModalOpen(false)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddSubCategory} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sub-category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={subCategoryForm.name}
                    onChange={(e) => setSubCategoryForm({ ...subCategoryForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g., Silk Blouse"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={subCategoryForm.description}
                    onChange={(e) => setSubCategoryForm({ ...subCategoryForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Describe this sub-category..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                  <select
                    value={subCategoryForm.status}
                    onChange={(e) => setSubCategoryForm({ ...subCategoryForm, status: e.target.value as 'Active' | 'Inactive' })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddSubCategoryModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Adding...' : 'Add Sub-category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Sub-category Modal */}
        {isEditSubCategoryModalOpen && editingSubCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Sub-category</h2>
                <button
                  onClick={() => {
                    setIsEditSubCategoryModalOpen(false);
                    setEditingSubCategory(null);
                  }}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleEditSubCategory} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sub-category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={subCategoryForm.name}
                    onChange={(e) => setSubCategoryForm({ ...subCategoryForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={subCategoryForm.description}
                    onChange={(e) => setSubCategoryForm({ ...subCategoryForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                  <select
                    value={subCategoryForm.status}
                    onChange={(e) => setSubCategoryForm({ ...subCategoryForm, status: e.target.value as 'Active' | 'Inactive' })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditSubCategoryModalOpen(false);
                      setEditingSubCategory(null);
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : 'Save Changes'}
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
            if (!open) setPendingDelete(null);
          }}
          title={pendingDelete?.type === 'category' ? 'Delete category' : 'Delete sub-category'}
          description={
            pendingDelete?.type === 'category'
              ? 'Are you sure you want to delete this category? All sub-categories will also be deleted. This action cannot be undone.'
              : 'Are you sure you want to delete this sub-category? This action cannot be undone.'
          }
          onConfirm={handleConfirmDelete}
          isLoading={submitting}
        />
      </div>
    </DndProvider>
  );
}
