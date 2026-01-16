import { HttpClient } from '../../http/httpClient.js';
import { DidoxAuthError, DidoxApiError } from '../../http/errors.js';
import {
  validateTaxId,
  validatePassword,
  validateLocale,
  validateUserToken
} from './auth.validators.js';
import type {
  LegalEntityLoginRequest,
  LegalEntityLoginResponse,
  CompanyLoginRequest,
  CompanyLoginResponse
} from './auth.types.js';

/**
 * Authentication API implementation
 */
export class AuthApi {
  constructor(private readonly httpClient: HttpClient) {}

  /**
   * Login as a legal entity
   * 
   * Authenticates a legal entity using Tax ID and password.
   * Returns an access token valid for 360 minutes.
   * 
   * @param request - Login request parameters
   * @returns Promise resolving to login response with token and related companies
   * 
   * @throws {DidoxValidationError} When input validation fails
   * @throws {DidoxAuthError} When authentication fails (422 status)
   * @throws {DidoxApiError} When API returns other error responses
   * @throws {DidoxNetworkError} When network request fails
   * 
   * @example
   * ```typescript
   * try {
   *   const result = await didox.auth.loginLegalEntity({
   *     taxId: '123456789',
   *     password: 'securePassword123',
   *     locale: 'ru'
   *   });
   *   
   *   console.log('Access token:', result.token);
   *   console.log('Related companies:', result.related_companies);
   * } catch (error) {
   *   if (error instanceof DidoxAuthError) {
   *     console.error('Authentication failed:', error.message);
   *   }
   * }
   * ```
   */
  public async loginLegalEntity(
    request: LegalEntityLoginRequest
  ): Promise<LegalEntityLoginResponse> {
    // Validate input parameters
    validateTaxId(request.taxId);
    validatePassword(request.password);
    
    const locale = request.locale ?? 'ru';
    validateLocale(locale);

    const endpoint = `/v1/auth/${request.taxId}/password/${locale}`;
    const body = {
      password: request.password
    };

    try {
      const response = await this.httpClient.post<LegalEntityLoginResponse>(
        endpoint,
        body
      );

      return response.data;
    } catch (error) {
      if (error instanceof DidoxApiError && error.statusCode === 422) {
        throw new DidoxAuthError(
          'Authentication failed: ' + error.message,
          error.statusCode
        );
      }
      throw error;
    }
  }

  /**
   * Login to a company as an individual
   * 
   * Allows an individual user to access a company's context using their personal token.
   * The user must have permissions to access the specified company.
   * 
   * @param request - Company login request parameters
   * @returns Promise resolving to company login response with token and permissions
   * 
   * @throws {DidoxValidationError} When input validation fails
   * @throws {DidoxAuthError} When authentication fails (422 status)
   * @throws {DidoxApiError} When API returns other error responses
   * @throws {DidoxNetworkError} When network request fails
   * 
   * @example
   * ```typescript
   * try {
   *   const result = await didox.auth.loginCompanyAsIndividual({
   *     companyTaxId: '987654321',
   *     userToken: 'user-access-token-uuid',
   *     locale: 'uz'
   *   });
   *   
   *   console.log('Company access token:', result.token);
   *   console.log('User permissions:', result.permissions);
   * } catch (error) {
   *   if (error instanceof DidoxAuthError) {
   *     console.error('Company access denied:', error.message);
   *   }
   * }
   * ```
   */
  public async loginCompanyAsIndividual(
    request: CompanyLoginRequest
  ): Promise<CompanyLoginResponse> {
    // Validate input parameters
    validateTaxId(request.companyTaxId);
    validateUserToken(request.userToken);
    
    const locale = request.locale ?? 'ru';
    validateLocale(locale);

    const endpoint = `/v1/auth/company/${request.companyTaxId}/login/${locale}`;
    const headers = {
      'user-key': request.userToken
    };

    try {
      const response = await this.httpClient.post<CompanyLoginResponse>(
        endpoint,
        undefined, // No body for this request
        { headers }
      );

      return response.data;
    } catch (error) {
      if (error instanceof DidoxApiError && error.statusCode === 422) {
        throw new DidoxAuthError(
          'Company login failed: ' + error.message,
          error.statusCode
        );
      }
      throw error;
    }
  }
}