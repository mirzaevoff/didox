/**
 * Product Classes (ИКПУ) related types for Didox API
 */

export interface ProductClassPackage {
  code: string;
  name: string;
  name_ru: string;
}

export interface ProductClassOrigin {
  id: number;
  name: string;
}

export interface ProductClass {
  classCode: string;
  internationalCode: string | null;
  className: string;
  className_ru: string;
  usePackage: 0 | 1;
  packages: ProductClassPackage[];
  origin: ProductClassOrigin;
}

export interface ProductClassCodesResponse {
  current_page: number;
  data: ProductClass[];
}

export interface ProductClassSearchResponse {
  current_page: number;
  data: ProductClass[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface AddProductClassRequest {
  classCode: string;
}

export interface AddProductClassResponse {
  success: true;
  error: any[];
}

export interface ProductClassSearchParams {
  page?: number;
  search?: string;
  lang?: 'ru' | 'uz';
}

export interface ProductClassesCodeCheckResponse {
  code: string;
  name: string;
}

export type RemoveProductClassResponse = AddProductClassResponse;