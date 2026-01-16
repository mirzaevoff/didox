import type { HttpClient } from '../../http/httpClient.js';
import type { WarehousesResponse } from './warehouses.types.js';
import { DidoxValidationError } from '../../http/errors.js';

/**
 * Warehouses API module
 */
export class WarehousesApi {
  constructor(private httpClient: HttpClient) {}

  /**
   * Get warehouses by TIN or PINFL
   * @param taxIdOrPinfl TIN (9 digits) or PINFL (14 digits)
   * @returns Promise<WarehousesResponse>
   * @example
   * ```typescript
   * const warehouses = await didox.profile.getWarehouses('123456789');
   * console.log('Warehouses found:', warehouses.length);
   * 
   * warehouses.forEach(wh => {
   *   console.log(`Warehouse #${wh.warehouseNumber}: ${wh.warehouseName}`);
   *   console.log(`Address: ${wh.warehouseAddress}`);
   * });
   * ```
   */
  async getWarehouses(taxIdOrPinfl: string): Promise<WarehousesResponse> {
    // Validate TIN or PINFL
    if (!taxIdOrPinfl || typeof taxIdOrPinfl !== 'string') {
      throw new DidoxValidationError('TIN or PINFL is required and must be a string');
    }

    // Check if it's TIN (9 digits) or PINFL (14 digits)
    if (!/^(\d{9}|\d{14})$/.test(taxIdOrPinfl)) {
      throw new DidoxValidationError('TIN must be exactly 9 digits or PINFL must be exactly 14 digits');
    }

    const response = await this.httpClient.get<WarehousesResponse>(`/v1/profile/warehouses/${taxIdOrPinfl}`);
    return response.data;
  }
}