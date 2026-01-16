import { HttpClient } from '../../http/httpClient.js';
import { DidoxAuthError, DidoxApiError } from '../../http/errors.js';
import {
  validateNotifications,
  validateRegionId,
  validateTin,
  validatePinfl,
  validateOfferSigned,
  validateExcise,
  validateVat,
  validateVatRate
} from './profile.validators.js';
import type {
  CompanyProfile,
  ProfileUpdateRequest,
  ProfileUpdateResponse,
  ProfileOperators
} from './profile.types.js';
import { ProductClassesApi } from './productClasses.api.js';
import { VatApi } from './vat.api.js';
import { WarehousesApi } from './warehouses.api.js';
import { UsersApi } from './users.api.js';

/**
 * Profile API implementation
 */
export class ProfileApi {
  public readonly productClasses: ProductClassesApi;
  public readonly vat: VatApi;
  public readonly warehouses: WarehousesApi;
  public readonly users: UsersApi;

  constructor(private readonly httpClient: HttpClient) {
    this.productClasses = new ProductClassesApi(httpClient);
    this.vat = new VatApi(httpClient);
    this.warehouses = new WarehousesApi(httpClient);
    this.users = new UsersApi(httpClient);
  }

  /**
   * Get current company profile
   * 
   * Retrieves detailed profile information for the currently authenticated company.
   * Returns comprehensive company data including financial and contact information.
   * 
   * @returns Promise resolving to company profile information
   * 
   * @throws {DidoxAuthError} When authentication fails (401 status)
   * @throws {DidoxApiError} When API returns other error responses
   * @throws {DidoxNetworkError} When network request fails
   * 
   * @example
   * ```typescript
   * try {
   *   const profile = await didox.profile.getProfile();
   *   
   *   console.log('Company name:', profile.fullName);
   *   console.log('TIN:', profile.tin);
   *   console.log('Balance:', profile.balance);
   *   console.log('Director:', profile.director);
   *   console.log('Messengers:', profile.messengers);
   * } catch (error) {
   *   if (error instanceof DidoxAuthError) {
   *     console.error('Authentication required:', error.message);
   *   }
   * }
   * ```
   */
  public async getProfile(): Promise<CompanyProfile> {
    const endpoint = '/v1/profile';

    try {
      const response = await this.httpClient.get<CompanyProfile>(endpoint);
      return response.data;
    } catch (error) {
      if (error instanceof DidoxApiError && error.statusCode === 401) {
        throw new DidoxAuthError(
          'Unauthorized: Invalid user key',
          error.statusCode
        );
      }
      throw error;
    }
  }

  /**
   * Update current company profile
   * 
   * Updates the profile information for the currently authenticated company.
   * All fields are optional. Only provided fields will be updated.
   * 
   * @param request - Profile update request parameters
   * @returns Promise resolving to updated profile information
   * 
   * @throws {DidoxValidationError} When input validation fails
   * @throws {DidoxApiError} When profile update fails (422 status)
   * @throws {DidoxAuthError} When authentication fails
   * @throws {DidoxNetworkError} When network request fails
   * 
   * @example
   * ```typescript
   * try {
   *   const updatedProfile = await didox.profile.updateProfile({
   *     phone: '998901234567',
   *     email: 'company@example.com',
   *     notifications: 1,
   *     regionId: 26,
   *     directorTin: '123456789'
   *   });
   *   
   *   console.log('Profile updated:', updatedProfile);
   * } catch (error) {
   *   if (error instanceof DidoxValidationError) {
   *     console.error('Validation failed:', error.message, 'Field:', error.field);
   *   } else if (error instanceof DidoxApiError && error.statusCode === 422) {
   *     console.error('Update failed:', error.message);
   *   }
   * }
   * ```
   */
  public async updateProfile(
    request: ProfileUpdateRequest
  ): Promise<ProfileUpdateResponse> {
    // Validate input parameters
    validateNotifications(request.notifications);
    validateRegionId(request.regionId);
    validateTin(request.tin, 'tin');
    validateTin(request.companyTaxId, 'companyTaxId');
    validateTin(request.directorTin, 'directorTin');
    validatePinfl(request.pinfl, 'pinfl');
    validatePinfl(request.directorPinfl, 'directorPinfl');
    validatePinfl(request.itemReleasedPinfl, 'itemReleasedPinfl');
    validateOfferSigned(request.offerSigned);
    validateExcise(request.excise);
    validateVat(request.vat);
    validateVatRate(request.vatRate);

    const endpoint = '/v1/profile/update';

    try {
      const response = await this.httpClient.post<ProfileUpdateResponse>(
        endpoint,
        request
      );

      return response.data;
    } catch (error) {
      if (error instanceof DidoxApiError && error.statusCode === 422) {
        throw new DidoxApiError(
          'User not updated',
          error.statusCode,
          error.response
        );
      }
      throw error;
    }
  }

  /**
   * Get profile operators
   * 
   * Retrieves the list of operators associated with the current profile.
   * Returns a mapping of operator IDs to their corresponding platform names.
   * 
   * @returns Promise resolving to operators mapping
   * 
   * @throws {DidoxAuthError} When authentication fails
   * @throws {DidoxApiError} When API returns error responses
   * @throws {DidoxNetworkError} When network request fails
   * 
   * @example
   * ```typescript
   * try {
   *   const operators = await didox.profile.getOperators();
   *   
   *   Object.entries(operators).forEach(([id, name]) => {
   *     console.log(`Operator ${id}: ${name}`);
   *   });
   *   
   *   // Example output:
   *   // Operator 202530465: soliqservis.uz
   *   // Operator 302563857: Faktura.uz
   *   // Operator 302936161: Didox.uz
   * } catch (error) {
   *   console.error('Failed to get operators:', error.message);
   * }
   * ```
   */
  public async getOperators(): Promise<ProfileOperators> {
    const endpoint = '/v1/profile/operators';

    try {
      const response = await this.httpClient.get<ProfileOperators>(endpoint);
      return response.data;
    } catch (error) {
      if (error instanceof DidoxApiError && error.statusCode === 401) {
        throw new DidoxAuthError(
          'Unauthorized: Invalid user key',
          error.statusCode
        );
      }
      throw error;
    }
  }

  // Product Classes convenience methods
  /**
   * Get attached product class codes for current profile
   * @returns Promise<ProductClassCodesResponse>
   */
  async getProductClassCodes() {
    return this.productClasses.getProductClassCodes();
  }

  /**
   * Search available product class codes
   * @param params Search parameters
   */
  async searchProductClasses(params: Parameters<ProductClassesApi['searchProductClasses']>[0] = {}) {
    return this.productClasses.searchProductClasses(params);
  }

  /**
   * Add product class code to current profile
   * @param classCode Class code (digits only)
   */
  async addProductClass(classCode: string) {
    return this.productClasses.addProductClass(classCode);
  }

  /**
   * Remove product class code from current profile
   * @param classCode Class code to remove
   */
  async removeProductClass(classCode: string) {
    return this.productClasses.removeProductClass(classCode);
  }

  // VAT convenience methods
  /**
   * Get VAT registration status by TIN or PINFL
   * @param taxIdOrPinfl TIN (9 digits) or PINFL (14 digits)
   * @param documentDate Optional date in YYYY-MM-DD format
   */
  async getVatRegStatus(taxIdOrPinfl: string, documentDate?: string) {
    return this.vat.getVatRegStatus(taxIdOrPinfl, documentDate);
  }

  /**
   * Get taxpayer type by TIN
   * @param tin TIN (9 digits)
   * @param lang Language (ru or uz)
   * @param date Optional date in DD.MM.YYYY format
   */
  async getTaxpayerType(tin: string, lang: 'ru' | 'uz', date?: string) {
    return this.vat.getTaxpayerType(tin, lang, date);
  }

  // Warehouses convenience methods
  /**
   * Get warehouses by TIN or PINFL
   * @param taxIdOrPinfl TIN (9 digits) or PINFL (14 digits)
   */
  async getWarehouses(taxIdOrPinfl: string) {
    return this.warehouses.getWarehouses(taxIdOrPinfl);
  }

  // Users convenience methods
  /**
   * Update company users permissions
   * @param permissions Permissions data with signed tokens
   */
  async updateCompanyUsersPermissions(
    permissions: Parameters<UsersApi['updateCompanyUsersPermissions']>[0]
  ) {
    return this.users.updateCompanyUsersPermissions(permissions);
  }
}