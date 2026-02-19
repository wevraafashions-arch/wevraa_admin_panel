import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import { vendorService } from '../app/api/services/vendorService';
import type { ApiVendor, CreateVendorRequest, UpdateVendorRequest } from '../app/api/types/vendor';

/** UI-facing vendor shape (mapped from API) */
export interface Vendor {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstin?: string;
  category: string;
  rating: number;
  status: 'Active' | 'Inactive';
  totalOrders?: number;
  totalAmount?: number;
  joinedDate: string;
}

function mapApiVendorToVendor(api: ApiVendor): Vendor {
  const status =
    api.status?.toUpperCase() === 'ACTIVE' ? 'Active' : 'Inactive';
  return {
    id: api.id,
    name: api.contactPersonName,
    companyName: api.companyName,
    email: api.email,
    phone: api.phone,
    address: api.address?.address ?? '',
    city: api.address?.city ?? '',
    state: api.address?.state ?? '',
    pincode: api.address?.pincode ?? '',
    gstin: api.gstin || undefined,
    category: api.category?.name ?? '',
    rating: 0,
    status,
    totalOrders: 0,
    totalAmount: 0,
    joinedDate: api.joinedDate?.split('T')[0] ?? '',
  };
}

interface VendorContextType {
  vendors: Vendor[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  addVendor: (data: CreateVendorRequest) => Promise<void>;
  updateVendor: (id: string, data: UpdateVendorRequest) => Promise<void>;
  deleteVendor: (id: string) => Promise<void>;
  getVendorById: (id: string) => Vendor | undefined;
  getVendorsByCategory: (category: string) => Vendor[];
}

const VendorContext = createContext<VendorContextType | undefined>(undefined);

export function VendorProvider({ children }: { children: ReactNode }) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await vendorService.getList();
      setVendors(list.map(mapApiVendorToVendor));
    } catch (e) {
      const message =
        e && typeof e === 'object' && 'message' in e
          ? String((e as { message: string }).message)
          : 'Failed to load vendors';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const addVendor = useCallback(
    async (data: CreateVendorRequest) => {
      const created = await vendorService.create(data);
      setVendors((prev) => [mapApiVendorToVendor(created), ...prev]);
    },
    []
  );

  const updateVendor = useCallback(
    async (id: string, data: UpdateVendorRequest) => {
      const updated = await vendorService.update(id, data);
      setVendors((prev) =>
        prev.map((v) => (v.id === id ? mapApiVendorToVendor(updated) : v))
      );
    },
    []
  );

  const deleteVendor = useCallback(async (id: string) => {
    try {
      await vendorService.delete(id);
      setVendors((prev) => prev.filter((v) => v.id !== id));
    } catch (e) {
      const message =
        e && typeof e === 'object' && 'message' in e
          ? String((e as { message: string }).message)
          : 'Failed to delete vendor';
      setError(message);
    }
  }, []);

  const getVendorById = useCallback(
    (id: string) => vendors.find((v) => v.id === id),
    [vendors]
  );

  const getVendorsByCategory = useCallback(
    (category: string) => vendors.filter((v) => v.category === category),
    [vendors]
  );

  return (
    <VendorContext.Provider
      value={{
        vendors,
        loading,
        error,
        refetch,
        addVendor,
        updateVendor,
        deleteVendor,
        getVendorById,
        getVendorsByCategory,
      }}
    >
      {children}
    </VendorContext.Provider>
  );
}

export function useVendors() {
  const context = useContext(VendorContext);
  if (context === undefined) {
    throw new Error('useVendors must be used within a VendorProvider');
  }
  return context;
}
