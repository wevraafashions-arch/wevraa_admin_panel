import { createContext, useContext, useState, ReactNode } from 'react';

export interface Vendor {
  id: number;
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

interface VendorContextType {
  vendors: Vendor[];
  addVendor: (vendor: Omit<Vendor, 'id'>) => void;
  updateVendor: (id: number, vendor: Partial<Vendor>) => void;
  deleteVendor: (id: number) => void;
  getVendorById: (id: number) => Vendor | undefined;
  getVendorsByCategory: (category: string) => Vendor[];
}

const VendorContext = createContext<VendorContextType | undefined>(undefined);

const mockVendors: Vendor[] = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    companyName: 'Kumar Textiles Pvt Ltd',
    email: 'rajesh@kumartextiles.com',
    phone: '+91 98765 43210',
    address: '123, Textile Market, Gandhi Nagar',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    gstin: 'GST27AABCU9603R1ZV',
    category: 'Fabric Supplier',
    rating: 4.5,
    status: 'Active',
    totalOrders: 245,
    totalAmount: 1250000,
    joinedDate: '2024-03-15'
  },
  {
    id: 2,
    name: 'Priya Sharma',
    companyName: 'Elegant Fabrics',
    email: 'priya@elegantfabrics.com',
    phone: '+91 98765 43211',
    address: '456, Silk Road, Nehru Place',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110019',
    gstin: 'GST07AABCU9603R1ZX',
    category: 'Silk Supplier',
    rating: 4.8,
    status: 'Active',
    totalOrders: 189,
    totalAmount: 980000,
    joinedDate: '2024-05-20'
  },
  {
    id: 3,
    name: 'Amit Patel',
    companyName: 'Patel Embroidery Works',
    email: 'amit@patelembroidery.com',
    phone: '+91 98765 43212',
    address: '789, Craft Colony, Vastrapur',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pincode: '380015',
    gstin: 'GST24AABCU9603R1ZY',
    category: 'Embroidery Work',
    rating: 4.6,
    status: 'Active',
    totalOrders: 312,
    totalAmount: 1560000,
    joinedDate: '2024-01-10'
  },
  {
    id: 4,
    name: 'Sunita Reddy',
    companyName: 'Reddy Buttons & Accessories',
    email: 'sunita@reddyaccessories.com',
    phone: '+91 98765 43213',
    address: '321, Industrial Area, Banjara Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500034',
    gstin: 'GST36AABCU9603R1ZZ',
    category: 'Accessories Supplier',
    rating: 4.3,
    status: 'Active',
    totalOrders: 428,
    totalAmount: 750000,
    joinedDate: '2023-11-05'
  },
  {
    id: 5,
    name: 'Vikram Singh',
    companyName: 'Royal Threads',
    email: 'vikram@royalthreads.com',
    phone: '+91 98765 43214',
    address: '654, Heritage Lane, Civil Lines',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302006',
    gstin: 'GST08AABCU9603R1ZW',
    category: 'Thread Supplier',
    rating: 4.4,
    status: 'Inactive',
    totalOrders: 156,
    totalAmount: 420000,
    joinedDate: '2024-07-12'
  }
];

export function VendorProvider({ children }: { children: ReactNode }) {
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors);

  const addVendor = (vendor: Omit<Vendor, 'id'>) => {
    const newVendor: Vendor = {
      ...vendor,
      id: Math.max(...vendors.map(v => v.id), 0) + 1,
    };
    setVendors([...vendors, newVendor]);
  };

  const updateVendor = (id: number, updatedVendor: Partial<Vendor>) => {
    setVendors(vendors.map(v => v.id === id ? { ...v, ...updatedVendor } : v));
  };

  const deleteVendor = (id: number) => {
    setVendors(vendors.filter(v => v.id !== id));
  };

  const getVendorById = (id: number) => {
    return vendors.find(v => v.id === id);
  };

  const getVendorsByCategory = (category: string) => {
    return vendors.filter(v => v.category === category);
  };

  return (
    <VendorContext.Provider
      value={{
        vendors,
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
