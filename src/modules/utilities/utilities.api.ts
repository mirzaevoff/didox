import { HttpClient } from '../../http/httpClient.js';
import { DidoxAuthError, DidoxApiError, DidoxValidationError } from '../../http/errors.js';
import { validateUtilitiesTin } from './utilities.validators.js';
import type { CompanyBranch, GetBranchesByTinRequest, LegalEntityInfo } from './utilities.types.js';

/**
 * Utilities API implementation
 */
export class UtilitiesApi {
  constructor(private readonly httpClient: HttpClient) {}

  /**
   * Get branches by TIN
   * 
   * Retrieves a list of company branches associated with the specified Tax Identification Number.
   * Returns detailed information about each branch including location, management, and banking details.
   * 
   * @param request - Request containing the TIN to search for
   * @returns Promise resolving to array of company branches
   * 
   * @throws {DidoxValidationError} When TIN validation fails
   * @throws {DidoxAuthError} When authentication fails
   * @throws {DidoxApiError} When API returns error responses
   * @throws {DidoxNetworkError} When network request fails
   * 
   * @example
   * ```typescript
   * try {
   *   const branches = await didox.utilities.getBranchesByTin({
   *     tin: '123456789'
   *   });
   *   
   *   branches.forEach(branch => {
   *     console.log(`Branch: ${branch.branchName}`);
   *     console.log(`Location: ${branch.address}`);
   *     console.log(`Director: ${branch.directorName}`);
   *     console.log(`Status: ${branch.isDeleted ? 'Deleted' : 'Active'}`);
   *   });
   * } catch (error) {
   *   if (error instanceof DidoxValidationError) {
   *     console.error('Invalid TIN:', error.message);
   *   }
   * }
   * ```
   */
  public async getBranchesByTin(
    request: GetBranchesByTinRequest
  ): Promise<CompanyBranch[]> {
    // Validate input parameters
    validateUtilitiesTin(request.tin);

    const endpoint = `/v1/profile/branches?tin=${encodeURIComponent(request.tin)}`;

    try {
      const response = await this.httpClient.get<CompanyBranch[]>(endpoint);
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
   * Get legal entity information by TIN
   * 
   * Retrieves detailed legal entity (company) information by Tax Identification Number.
   * Returns comprehensive company data including legal form, director info, banking details,
   * address, and various organizational flags.
   * 
   * @param taxId - Tax Identification Number (exactly 9 digits)
   * @returns Promise resolving to legal entity information
   * 
   * @throws {DidoxValidationError} When TIN validation fails
   * @throws {DidoxAuthError} When authentication fails (401 status)
   * @throws {DidoxApiError} When API returns other error responses
   * @throws {DidoxNetworkError} When network request fails
   * 
   * @example
   * ```typescript
   * try {
   *   const entityInfo = await didox.utilities.getLegalEntityInfoByTin('306915557');
   *   
   *   console.log('Organization:', entityInfo.name);
   *   console.log('Short name:', entityInfo.shortName);
   *   console.log('Director:', entityInfo.director);
   *   console.log('Legal form:', entityInfo.na1Name);
   *   console.log('Address:', entityInfo.address);
   *   console.log('VAT status:', entityInfo.VATRegStatus);
   *   console.log('OKED:', entityInfo.oked);
   * } catch (error) {
   *   if (error instanceof DidoxValidationError) {
   *     console.error('Invalid TIN format:', error.message);
   *   } else if (error instanceof DidoxAuthError) {
   *     console.error('Authentication required:', error.message);
   *   }
   * }
   * ```
   */
  public async getLegalEntityInfoByTin(taxId: string): Promise<LegalEntityInfo> {
    // Validate TIN format
    validateUtilitiesTin(taxId);

    const endpoint = `/v1/utils/info/${taxId}`;

    try {
      const response = await this.httpClient.get<LegalEntityInfo>(endpoint);
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