import type { HttpClient } from '../../http/httpClient.js';
import type {
  UpdateCompanyUsersPermissionsRequest,
  UpdateCompanyUsersPermissionsResponse
} from './users.types.js';
import { DidoxValidationError } from '../../http/errors.js';

/**
 * Company users and permissions API module
 */
export class UsersApi {
  constructor(private httpClient: HttpClient) {}

  /**
   * Update company users permissions
   * @param permissions Permissions data with signed tokens
   * @returns Promise<UpdateCompanyUsersPermissionsResponse>
   * @example
   * ```typescript
   * await didox.profile.updateCompanyUsersPermissions({
   *   gnkpermissions: 'base64SignedToken1',
   *   internalpermissions: 'base64SignedToken2',
   *   is_director: 1
   * });
   * console.log('Permissions updated successfully');
   * ```
   * 
   * @note This API requires externally signed tokens. The SDK does not generate signatures.
   * You must prepare and sign the role JSONs externally before calling this method.
   */
  async updateCompanyUsersPermissions(
    permissions: UpdateCompanyUsersPermissionsRequest
  ): Promise<UpdateCompanyUsersPermissionsResponse> {
    // Validate required fields
    if (!permissions.gnkpermissions || typeof permissions.gnkpermissions !== 'string') {
      throw new DidoxValidationError('gnkpermissions is required and must be a string');
    }

    if (!permissions.internalpermissions || typeof permissions.internalpermissions !== 'string') {
      throw new DidoxValidationError('internalpermissions is required and must be a string');
    }

    // Validate is_director flag
    if (permissions.is_director !== 0 && permissions.is_director !== 1) {
      throw new DidoxValidationError('is_director must be either 0 or 1');
    }

    const response = await this.httpClient.put<UpdateCompanyUsersPermissionsResponse>(
      '/v1/profile/company/users',
      permissions
    );
    return response.data;
  }
}