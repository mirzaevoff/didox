import { HttpClient } from '../../http/httpClient.js';
import { DidoxAuthError, DidoxApiError } from '../../http/errors.js';
import {
  validateMobile,
  validateEmail,
  validatePassword,
  validateNotifications
} from './account.validators.js';
import type {
  AccountProfile,
  UpdateProfileRequest,
  UpdateProfileResponse
} from './account.types.js';

/**
 * Account API implementation
 */
export class AccountApi {
  constructor(private readonly httpClient: HttpClient) {}

  /**
   * Get current account profile
   * 
   * Retrieves the profile information for the currently authenticated user.
   * Requires valid access token obtained via Auth module.
   * 
   * @returns Promise resolving to account profile information
   * 
   * @throws {DidoxAuthError} When authentication fails (401/403 status)
   * @throws {DidoxApiError} When API returns other error responses
   * @throws {DidoxNetworkError} When network request fails
   * 
   * @example
   * ```typescript
   * try {
   *   const profile = await didox.account.getProfile();
   *   
   *   console.log('Mobile:', profile.mobile);
   *   console.log('Email:', profile.email);
   *   console.log('Notifications:', profile.notifications ? 'Enabled' : 'Disabled');
   *   console.log('Messengers:', profile.messengers);
   * } catch (error) {
   *   if (error instanceof DidoxAuthError) {
   *     console.error('Authentication required:', error.message);
   *   }
   * }
   * ```
   */
  public async getProfile(): Promise<AccountProfile> {
    const endpoint = '/v1/account';

    try {
      const response = await this.httpClient.get<AccountProfile>(endpoint);
      return response.data;
    } catch (error) {
      if (error instanceof DidoxApiError && (error.statusCode === 401 || error.statusCode === 403)) {
        throw new DidoxAuthError(
          'Authentication failed: ' + error.message,
          error.statusCode
        );
      }
      throw error;
    }
  }

  /**
   * Update current account profile
   * 
   * Updates the profile information for the currently authenticated user.
   * All fields are required except password. Password is optional but if provided
   * must meet minimum requirements.
   * 
   * @param request - Profile update request parameters
   * @returns Promise resolving to updated profile information
   * 
   * @throws {DidoxValidationError} When input validation fails
   * @throws {DidoxAuthError} When authentication fails (401/403 status)
   * @throws {DidoxApiError} When API returns other error responses
   * @throws {DidoxNetworkError} When network request fails
   * 
   * @example
   * ```typescript
   * try {
   *   const updatedProfile = await didox.account.updateProfile({
   *     mobile: '998901234567',
   *     email: 'user@example.com',
   *     password: 'newSecurePassword123', // optional
   *     notifications: 1 // enable notifications
   *   });
   *   
   *   console.log('Profile updated:', updatedProfile);
   * } catch (error) {
   *   if (error instanceof DidoxValidationError) {
   *     console.error('Validation failed:', error.message, 'Field:', error.field);
   *   }
   * }
   * ```
   */
  public async updateProfile(
    request: UpdateProfileRequest
  ): Promise<UpdateProfileResponse> {
    // Validate input parameters
    validateMobile(request.mobile);
    validateEmail(request.email);
    validatePassword(request.password);
    validateNotifications(request.notifications);

    const endpoint = '/v1/profile/update';
    const body = {
      mobile: request.mobile,
      email: request.email,
      notifications: request.notifications,
      ...(request.password && { password: request.password })
    };

    try {
      const response = await this.httpClient.post<UpdateProfileResponse>(
        endpoint,
        body
      );

      return response.data;
    } catch (error) {
      if (error instanceof DidoxApiError && (error.statusCode === 401 || error.statusCode === 403)) {
        throw new DidoxAuthError(
          'Authentication failed: ' + error.message,
          error.statusCode
        );
      }
      throw error;
    }
  }
}