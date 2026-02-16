/** Address nested in vendor GET response */
export interface VendorAddress {
  id: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  createdAt: string;
  updatedAt: string;
}

/** Vendor from GET /vendors */
export interface ApiVendor {
  id: string;
  contactPersonName: string;
  companyName: string;
  email: string;
  phone: string;
  categoryId: string | null;
  gstin: string;
  status: string;
  joinedDate: string;
  addressId: string;
  createdAt: string;
  updatedAt: string;
  category: { id: string; name: string } | null;
  address: VendorAddress | null;
}

/** Request body for POST /vendors */
export interface CreateVendorRequest {
  contactPersonName: string;
  companyName: string;
  email: string;
  phone: string;
  categoryId?: string | null;
  gstin?: string;
  status: string;
  joinedDate: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

/** Request body for PATCH /vendors/:id (partial) */
export type UpdateVendorRequest = Partial<CreateVendorRequest>;
