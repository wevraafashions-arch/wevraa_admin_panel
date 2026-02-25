export interface HSNCodeItem {
  code: string;
  description: string;
}

export interface HSNCode extends HSNCodeItem {
  id: number | string;
}

export interface GSTRate {
  id: number | string;
  name: string;
  percentage: number;
  isDefault: boolean;
  hsnCodes: HSNCode[];
  _count?: { hsnCodes: number };
}

export interface CreateGSTRateRequest {
  name: string;
  percentage: number;
  isDefault?: boolean;
  hsnCodes?: HSNCodeItem[];
}

export type UpdateGSTRateRequest = Partial<CreateGSTRateRequest>;
