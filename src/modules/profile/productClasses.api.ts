import type { HttpClient } from '../../http/httpClient.js';
import type {
  ProductClassCodesResponse,
  ProductClassSearchResponse,
  ProductClassSearchParams,
  AddProductClassRequest,
  AddProductClassResponse,
  RemoveProductClassResponse,
  ProductClassesCodeCheckResponse
} from './productClasses.types.js';
import { DidoxValidationError } from '../../http/errors.js';

/**
 * Product Classes (ИКПУ) API module
 */
export class ProductClassesApi {
  constructor(private httpClient: HttpClient) {}

  /**
   * Get attached product class codes for current profile
   * @returns Promise<ProductClassCodesResponse>
   * @example
   * ```typescript
   * const result = await didox.profile.getProductClassCodes();
   * console.log('Attached codes:', result.data.length);
   * ```
   */
  async getProductClassCodes(): Promise<ProductClassCodesResponse> {
    const response = await this.httpClient.get<ProductClassCodesResponse>('/v1/profile/productClassCodes');
    return response.data;
  }

  /**
   * Search available product class codes
   * @param params Search parameters
   * @returns Promise<ProductClassSearchResponse>
   * @example
   * ```typescript
   * const result = await didox.profile.searchProductClasses({
   *   search: 'фото',
   *   lang: 'ru',
   *   page: 1
   * });
   * console.log('Found classes:', result.data.length);
   * ```
   */
  async searchProductClasses(params: ProductClassSearchParams = {}): Promise<ProductClassSearchResponse> {
    // Validate language
    if (params.lang && !['ru', 'uz'].includes(params.lang)) {
      throw new DidoxValidationError('Language must be "ru" or "uz"');
    }

    // Validate page number
    if (params.page !== undefined && (params.page < 1 || !Number.isInteger(params.page))) {
      throw new DidoxValidationError('Page must be a positive integer');
    }

    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.search) searchParams.set('search', params.search);
    if (params.lang) searchParams.set('lang', params.lang);

    const url = `/v1/profile/productClassCodes${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    
    const response = await this.httpClient.get<ProductClassSearchResponse>(url);
    return response.data;
  }

  /**
   * Add product class code to current profile
   * @param classCode Class code (digits only)
   * @returns Promise<AddProductClassResponse>
   * @example
   * ```typescript
   * await didox.profile.addProductClass('08418001001013043');
   * console.log('Product class added successfully');
   * ```
   */
  async addProductClass(classCode: string): Promise<AddProductClassResponse> {
    // Validate class code format
    if (!classCode || typeof classCode !== 'string') {
      throw new DidoxValidationError('Class code is required and must be a string');
    }

    if (!/^\d+$/.test(classCode)) {
      throw new DidoxValidationError('Class code must contain only digits');
    }

    const body: AddProductClassRequest = { classCode };

    const response = await this.httpClient.post<AddProductClassResponse>('/v1/profile/productClasses', body);
    return response.data;
  }

  /**
   * Remove product class code from current profile
   * @param classCode Class code to remove
   * @returns Promise<RemoveProductClassResponse>
   * @example
   * ```typescript
   * await didox.profile.removeProductClass('08418001001013043');
   * console.log('Product class removed successfully');
   * ```
   */
  async removeProductClass(classCode: string): Promise<RemoveProductClassResponse> {
    // Validate class code format
    if (!classCode || typeof classCode !== 'string') {
      throw new DidoxValidationError('Class code is required and must be a string');
    }

    if (!/^\d+$/.test(classCode)) {
      throw new DidoxValidationError('Class code must contain only digits');
    }

    const response = await this.httpClient.delete<RemoveProductClassResponse>(`/v1/profile/productClasses/${classCode}`);
    return response.data;
  }

  /**
   * Check product class code packages for specific TIN and code
   * @param taxId TIN of the company
   * @param code ИКПУ code
   * @param lang Language (ru or uz)
   * @returns Promise<ProductClassesCodeCheckResponse[]>
   * @example
   * ```typescript
   * const packages = await didox.profile.checkProductClassCode('123456789', '11703002001000000', 'ru');
   * console.log('Available packages:', packages);
   * ```
   */
  async checkProductClassCode(
    taxId: string,
    code: string,
    lang: 'ru' | 'uz'
  ): Promise<ProductClassesCodeCheckResponse[]> {
    // Validate TIN
    if (!taxId || !/^\d{9}$/.test(taxId)) {
      throw new DidoxValidationError('TIN must be exactly 9 digits');
    }

    // Validate code
    if (!code || typeof code !== 'string') {
      throw new DidoxValidationError('Code is required and must be a string');
    }

    // Validate language
    if (!['ru', 'uz'].includes(lang)) {
      throw new DidoxValidationError('Language must be "ru" or "uz"');
    }

    const response = await this.httpClient.get<ProductClassesCodeCheckResponse[]>(
      `/v1/profile/${taxId}/productClasses/check/${code}/${lang}`
    );
    return response.data;
  }
}