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

/**
 * Profile API implementation
 */
export class ProfileApi {
  constructor(private readonly httpClient: HttpClient) {}

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
}