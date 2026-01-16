import { HttpClient } from '../../http/httpClient.js';
import { DidoxAuthError, DidoxApiError } from '../../http/errors.js';
import { validateUtilitiesTin } from './utilities.validators.js';
import type { CompanyBranch, GetBranchesByTinRequest } from './utilities.types.js';

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
}