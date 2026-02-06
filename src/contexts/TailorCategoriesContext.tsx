import { createContext, useContext, useState, ReactNode } from 'react';

export interface SubCategory {
  id: number;
  name: string;
  description: string;
  orders: number;
  status: 'Active' | 'Inactive';
  position: number;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  orders: number;
  status: string;
  position: number;
}

interface TailorCategoriesContextType {
  categories: Category[];
  subCategoriesData: { [key: number]: SubCategory[] };
  setCategories: (categories: Category[]) => void;
  setSubCategoriesData: (data: { [key: number]: SubCategory[] }) => void;
  getActiveCategories: () => Category[];
  getActiveCategoriesWithSubs: () => { category: Category; subcategories: SubCategory[] }[];
  reorderCategories: (startIndex: number, endIndex: number) => void;
  reorderSubCategories: (categoryId: number, startIndex: number, endIndex: number) => void;
}

const TailorCategoriesContext = createContext<TailorCategoriesContextType | undefined>(undefined);

const defaultCategories: Category[] = [
  { id: 1, name: 'Blouse', description: 'Blouse stitching and alterations', orders: 145, status: 'Active', position: 0 },
  { id: 2, name: 'Topwear', description: 'Kurtas, shirts, tops, and upper garments', orders: 234, status: 'Active', position: 1 },
  { id: 3, name: 'Bottomwear', description: 'Pants, salwars, skirts, and lower garments', orders: 189, status: 'Active', position: 2 },
  { id: 4, name: 'Others', description: 'Miscellaneous tailoring services', orders: 67, status: 'Active', position: 3 },
];

const defaultSubCategoriesData: { [key: number]: SubCategory[] } = {
  1: [ // Blouse
    { id: 1, name: 'Hand Embroidery', description: 'Blouse with hand embroidery work', orders: 45, status: 'Active', position: 0 },
    { id: 2, name: 'Machine Embroidery', description: 'Blouse with machine embroidery', orders: 38, status: 'Active', position: 1 },
    { id: 3, name: 'Princes Cut Blouse', description: 'Princes cut style blouse design', orders: 32, status: 'Active', position: 2 },
    { id: 4, name: 'Katori Blouse', description: 'Katori style blouse stitching', orders: 28, status: 'Active', position: 3 },
    { id: 5, name: 'Lining Blouse', description: 'Blouse with lining work', orders: 24, status: 'Active', position: 4 },
    { id: 6, name: 'Lehenga Blouse', description: 'Blouse for lehenga outfit', orders: 20, status: 'Active', position: 5 },
    { id: 7, name: 'Plain Blouse', description: 'Simple plain blouse stitching', orders: 18, status: 'Active', position: 6 },
  ],
  2: [ // Topwear
    { id: 1, name: 'Gown', description: 'Gown stitching and designing', orders: 56, status: 'Active', position: 0 },
    { id: 2, name: 'Kurta', description: 'Kurta stitching service', orders: 48, status: 'Active', position: 1 },
    { id: 3, name: 'Salwar', description: 'Salwar stitching service', orders: 42, status: 'Active', position: 2 },
    { id: 4, name: 'Ghagra', description: 'Ghagra stitching and designing', orders: 35, status: 'Active', position: 3 },
    { id: 5, name: 'Lehenga Blouse', description: 'Lehenga blouse stitching', orders: 28, status: 'Active', position: 4 },
    { id: 6, name: 'Churidar', description: 'Churidar stitching service', orders: 25, status: 'Active', position: 5 },
  ],
  3: [ // Bottomwear
    { id: 1, name: 'Chudi Bottom', description: 'Chudi bottom stitching', orders: 52, status: 'Active', position: 0 },
    { id: 2, name: 'Salwar Bottom', description: 'Salwar bottom stitching', orders: 48, status: 'Active', position: 1 },
    { id: 3, name: 'Patiala', description: 'Patiala pants stitching', orders: 42, status: 'Active', position: 2 },
    { id: 4, name: 'Palazzo', description: 'Palazzo pants stitching', orders: 38, status: 'Active', position: 3 },
    { id: 5, name: 'Straight Pant', description: 'Straight pant stitching', orders: 32, status: 'Active', position: 4 },
    { id: 6, name: 'Lehenga Bottom', description: 'Lehenga bottom stitching', orders: 27, status: 'Active', position: 5 },
  ],
  4: [ // Others
    { id: 1, name: 'Saree Krosha', description: 'Saree krosha work and finishing', orders: 45, status: 'Active', position: 0 },
    { id: 2, name: 'Saree Zig-Zag & Falls', description: 'Saree zig-zag stitching and falls work', orders: 22, status: 'Active', position: 1 },
  ],
};

export function TailorCategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [subCategoriesData, setSubCategoriesData] = useState<{ [key: number]: SubCategory[] }>(defaultSubCategoriesData);

  const getActiveCategories = () => {
    return categories.filter(cat => cat.status === 'Active');
  };

  const getActiveCategoriesWithSubs = () => {
    return getActiveCategories().map(category => ({
      category,
      subcategories: (subCategoriesData[category.id] || []).filter(sub => sub.status === 'Active'),
    }));
  };

  const reorderCategories = (startIndex: number, endIndex: number) => {
    const newCategories = [...categories];
    const [removed] = newCategories.splice(startIndex, 1);
    newCategories.splice(endIndex, 0, removed);
    newCategories.forEach((cat, index) => cat.position = index);
    setCategories(newCategories);
  };

  const reorderSubCategories = (categoryId: number, startIndex: number, endIndex: number) => {
    const newSubCategoriesData = { ...subCategoriesData };
    const subCategories = newSubCategoriesData[categoryId];
    if (subCategories) {
      const [removed] = subCategories.splice(startIndex, 1);
      subCategories.splice(endIndex, 0, removed);
      subCategories.forEach((sub, index) => sub.position = index);
      setSubCategoriesData(newSubCategoriesData);
    }
  };

  return (
    <TailorCategoriesContext.Provider
      value={{
        categories,
        subCategoriesData,
        setCategories,
        setSubCategoriesData,
        getActiveCategories,
        getActiveCategoriesWithSubs,
        reorderCategories,
        reorderSubCategories,
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