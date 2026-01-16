import type { HttpClient } from '../../http/httpClient.js';
import type {
  VatRegStatusResponse,
  TaxpayerTypeResponse,
  SupportedLanguage
} from './vat.types.js';
import { DidoxValidationError } from '../../http/errors.js';

/**
 * VAT and taxpayer information API module
 */
export class VatApi {
  constructor(private httpClient: HttpClient) {}

  /**
   * Get VAT registration status by TIN or PINFL
   * @param taxIdOrPinfl TIN (9 digits) or PINFL (14 digits)
   * @param documentDate Optional date in YYYY-MM-DD format
   * @returns Promise<VatRegStatusResponse>
   * @example
   * ```typescript
   * const status = await didox.profile.getVatRegStatus('123456789');
   * console.log('VAT status:', status.vatRegStatus);
   * 
   * // With specific date
   * const statusOnDate = await didox.profile.getVatRegStatus('123456789', '2021-12-22');
   * ```
   */
  async getVatRegStatus(
    taxIdOrPinfl: string,
    documentDate?: string
  ): Promise<VatRegStatusResponse> {
    // Validate TIN or PINFL
    if (!taxIdOrPinfl || typeof taxIdOrPinfl !== 'string') {
      throw new DidoxValidationError('TIN or PINFL is required and must be a string');
    }

    // Check if it's TIN (9 digits) or PINFL (14 digits)
    if (!/^(\d{9}|\d{14})$/.test(taxIdOrPinfl)) {
      throw new DidoxValidationError('TIN must be exactly 9 digits or PINFL must be exactly 14 digits');
    }

    // Validate document date format if provided
    if (documentDate && !/^\d{4}-\d{2}-\d{2}$/.test(documentDate)) {
      throw new DidoxValidationError('Document date must be in YYYY-MM-DD format');
    }

    let url = `/v1/profile/vatRegStatus/${taxIdOrPinfl}`;
    
    if (documentDate) {
      url += `?document_date=${documentDate}`;
    }

    const response = await this.httpClient.get<VatRegStatusResponse>(url);
    return response.data;
  }

  /**
   * Get taxpayer type by TIN
   * @param tin TIN (9 digits)
   * @param lang Language (ru or uz)
   * @param date Optional date in DD.MM.YYYY format
   * @returns Promise<TaxpayerTypeResponse>
   * @example
   * ```typescript
   * const type = await didox.profile.getTaxpayerType('123456789', 'ru');
   * console.log('Taxpayer type:', type.name);
   * 
   * // With specific date
   * const typeOnDate = await didox.profile.getTaxpayerType('123456789', 'ru', '17.01.2022');
   * ```
   */
  async getTaxpayerType(
    tin: string,
    lang: SupportedLanguage,
    date?: string
  ): Promise<TaxpayerTypeResponse> {
    // Validate TIN
    if (!tin || !/^\d{9}$/.test(tin)) {
      throw new DidoxValidationError('TIN must be exactly 9 digits');
    }

    // Validate language
    if (!['ru', 'uz'].includes(lang)) {
      throw new DidoxValidationError('Language must be "ru" or "uz"');
    }

    // Validate date format if provided
    if (date && !/^\d{2}\.\d{2}\.\d{4}$/.test(date)) {
      throw new DidoxValidationError('Date must be in DD.MM.YYYY format');
    }

    let url = `/v1/profile/taxpayerType/${tin}/${lang}`;
    
    if (date) {
      url += `?date=${encodeURIComponent(date)}`;
    }

    const response = await this.httpClient.get<TaxpayerTypeResponse>(url);
    return response.data;
  }
}