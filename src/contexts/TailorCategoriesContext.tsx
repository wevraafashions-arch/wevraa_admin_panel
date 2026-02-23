import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { tailorCategoriesService } from '@/app/api/services/tailorCategoriesService';
import type { ApiTailorCategory } from '@/app/api/types/tailorCategory';

const statusFromApi = (s: string): 'Active' | 'Inactive' =>
  s === 'ACTIVE' ? 'Active' : 'Inactive';
const statusToApi = (s: string): 'ACTIVE' | 'INACTIVE' =>
  s === 'Active' ? 'ACTIVE' : 'INACTIVE';

export interface SubCategory {
  id: string;
  name: string;
  description: string;
  orders: number;
  status: 'Active' | 'Inactive';
  position: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  orders: number;
  status: string;
  position: number;
}

function mapApiToCategory(api: ApiTailorCategory): Category {
  return {
    id: api.id,
    name: api.name,
    description: api.description,
    orders: 0,
    status: statusFromApi(api.status),
    position: api.sortOrder,
  };
}

function mapApiToSubCategory(api: ApiTailorCategory): SubCategory {
  return {
    id: api.id,
    name: api.name,
    description: api.description,
    orders: 0,
    status: statusFromApi(api.status),
    position: api.sortOrder,
  };
}

interface TailorCategoriesContextType {
  categories: Category[];
  subCategoriesData: { [parentId: string]: SubCategory[] };
  loading: boolean;
  error: string | null;
  setCategories: (categories: Category[]) => void;
  setSubCategoriesData: (data: { [parentId: string]: SubCategory[] }) => void;
  loadCategories: () => Promise<void>;
  loadSubCategories: (parentId: string) => Promise<void>;
  getActiveCategories: () => Category[];
  getActiveCategoriesWithSubs: () => { category: Category; subcategories: SubCategory[] }[];
  reorderCategories: (startIndex: number, endIndex: number) => Promise<void>;
  reorderSubCategories: (parentId: string, startIndex: number, endIndex: number) => Promise<void>;
  createCategory: (body: { name: string; description: string; status: string; sortOrder?: number }) => Promise<Category>;
  updateCategory: (id: string, body: { name?: string; description?: string; status?: string }) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  createSubCategory: (parentId: string, body: { name: string; description: string; status: string }) => Promise<SubCategory>;
  updateSubCategory: (id: string, body: { name?: string; description?: string; status?: string }) => Promise<void>;
  deleteSubCategory: (id: string, parentId: string) => Promise<void>;
}

const TailorCategoriesContext = createContext<TailorCategoriesContextType | undefined>(undefined);

export function TailorCategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategoriesData, setSubCategoriesData] = useState<{ [parentId: string]: SubCategory[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await tailorCategoriesService.getList();
      setCategories(list.map(mapApiToCategory));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSubCategories = useCallback(async (parentId: string) => {
    try {
      const list = await tailorCategoriesService.getList(parentId);
      setSubCategoriesData(prev => ({
        ...prev,
        [parentId]: list.map(mapApiToSubCategory),
      }));
    } catch {
      setSubCategoriesData(prev => ({ ...prev, [parentId]: [] }));
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const getActiveCategories = useCallback(() => {
    return categories.filter(cat => cat.status === 'Active');
  }, [categories]);

  const getActiveCategoriesWithSubs = useCallback(() => {
    return getActiveCategories().map(category => ({
      category,
      subcategories: (subCategoriesData[category.id] || []).filter(sub => sub.status === 'Active'),
    }));
  }, [categories, subCategoriesData, getActiveCategories]);

  const reorderCategories = useCallback(async (startIndex: number, endIndex: number) => {
    const reordered = [...categories];
    const [removed] = reordered.splice(startIndex, 1);
    reordered.splice(endIndex, 0, removed);
    const items = reordered.map((c, i) => ({ id: c.id, sortOrder: i }));
    setCategories(reordered.map((c, i) => ({ ...c, position: i })));
    try {
      await tailorCategoriesService.reorder({ items });
    } catch {
      await loadCategories();
    }
  }, [categories, loadCategories]);

  const reorderSubCategories = useCallback(async (parentId: string, startIndex: number, endIndex: number) => {
    const subs = subCategoriesData[parentId] || [];
    const reordered = [...subs];
    const [removed] = reordered.splice(startIndex, 1);
    reordered.splice(endIndex, 0, removed);
    const items = reordered.map((s, i) => ({ id: s.id, sortOrder: i }));
    setSubCategoriesData(prev => ({
      ...prev,
      [parentId]: reordered.map((s, i) => ({ ...s, position: i })),
    }));
    try {
      await tailorCategoriesService.reorder({ items });
    } catch {
      await loadSubCategories(parentId);
    }
  }, [subCategoriesData, loadSubCategories]);

  const createCategory = useCallback(async (body: { name: string; description: string; status: string; sortOrder?: number }) => {
    const created = await tailorCategoriesService.create({
      name: body.name,
      description: body.description,
      status: statusToApi(body.status),
      sortOrder: body.sortOrder ?? categories.length,
    });
    await loadCategories();
    return mapApiToCategory(created);
  }, [categories.length, loadCategories]);

  const updateCategory = useCallback(async (id: string, body: { name?: string; description?: string; status?: string }) => {
    await tailorCategoriesService.update(id, {
      ...(body.name != null && { name: body.name }),
      ...(body.description != null && { description: body.description }),
      ...(body.status != null && { status: statusToApi(body.status) }),
    });
    await loadCategories();
  }, [loadCategories]);

  const deleteCategory = useCallback(async (id: string) => {
    await tailorCategoriesService.delete(id);
    await loadCategories();
    setSubCategoriesData(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, [loadCategories]);

  const createSubCategory = useCallback(async (parentId: string, body: { name: string; description: string; status: string }) => {
    const created = await tailorCategoriesService.create({
      name: body.name,
      description: body.description,
      status: statusToApi(body.status),
      parentId,
    });
    await loadSubCategories(parentId);
    return mapApiToSubCategory(created);
  }, [loadSubCategories]);

  const updateSubCategory = useCallback(async (id: string, body: { name?: string; description?: string; status?: string }) => {
    await tailorCategoriesService.update(id, {
      ...(body.name != null && { name: body.name }),
      ...(body.description != null && { description: body.description }),
      ...(body.status != null && { status: statusToApi(body.status) }),
    });
    const parentId = Object.keys(subCategoriesData).find(pid =>
      subCategoriesData[pid].some(s => s.id === id)
    );
    if (parentId) await loadSubCategories(parentId);
  }, [subCategoriesData, loadSubCategories]);

  const deleteSubCategory = useCallback(async (id: string, parentId: string) => {
    await tailorCategoriesService.delete(id);
    await loadSubCategories(parentId);
  }, [loadSubCategories]);

  return (
    <TailorCategoriesContext.Provider
      value={{
        categories,
        subCategoriesData,
        loading,
        error,
        setCategories,
        setSubCategoriesData,
        loadCategories,
        loadSubCategories,
        getActiveCategories,
        getActiveCategoriesWithSubs,
        reorderCategories,
        reorderSubCategories,
        createCategory,
        updateCategory,
        deleteCategory,
        createSubCategory,
        updateSubCategory,
        deleteSubCategory,
      }}
    >
      {children}
    </TailorCategoriesContext.Provider>
  );
}

export function useTailorCategories() {
  const context = useContext(TailorCategoriesContext);
  if (context === undefined) {
    throw new Error('useTailorCategories must be used within a TailorCategoriesProvider');
  }
  return context;
}
