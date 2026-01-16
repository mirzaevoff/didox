/**
 * VAT and taxpayer related types for Didox API
 */

export interface VatRegStatusResponse {
  status: 'success';
  vatRegCode: string;
  vatRegStatus: number;
}

export interface TaxpayerTypeResponse {
  code: number;
  name: string;
}

/**
 * VAT Registration Status Codes:
 * 10 - Плательщик НДС
 * 20 - Плательщик НДС+ (сертификат активный)
 * 21 - Плательщик НДС+ (сертификат неактивный)
 * 22 - Плательщик НДС+ (сертификат временно неактивный)
 * 30 - Плательщик налога с оборота
 * 40 - Некоммерческое юридическое лицо
 * 50 - Индивидуальный предприниматель
 * 60 - Физическое лицо
 */
export enum VatRegStatus {
  VAT_PAYER = 10,
  VAT_PLUS_ACTIVE = 20,
  VAT_PLUS_INACTIVE = 21,
  VAT_PLUS_TEMP_INACTIVE = 22,
  TURNOVER_TAX = 30,
  NON_COMMERCIAL = 40,
  INDIVIDUAL_ENTREPRENEUR = 50,
  PHYSICAL_PERSON = 60
}

export type SupportedLanguage = 'ru' | 'uz';