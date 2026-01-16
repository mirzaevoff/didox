/**
 * Company profile information
 * Contains only fields marked as "Отобразить" in the API specification
 */
export interface CompanyProfile {
  /**
   * VAT rate
   */
  vatRate: number | null;

  /**
   * Full company name
   */
  fullName: string;

  /**
   * Short company name
   */
  shortName: string;

  /**
   * Item released person FIO
   */
  itemReleasedFio: string;

  /**
   * VAT value
   */
  vat: number;

  /**
   * Excise flag
   */
  excise: boolean;

  /**
   * Bank account
   */
  account: string;

  /**
   * Bank code
   */
  bankCode: string;

  /**
   * OKED code
   */
  oked: string;

  /**
   * Company address
   */
  address: string;

  /**
   * Region ID
   */
  regionId: number;

  /**
   * District ID
   */
  districtId: string;

  /**
   * Phone number
   */
  phone: string;

  /**
   * Email address
   */
  email: string;

  /**
   * Accountant name
   */
  accountant: string;

  /**
   * Director name
   */
  director: string;

  /**
   * Director TIN
   */
  directorTin: string;

  /**
   * Director PINFL
   */
  directorPinfl: string;

  /**
   * Notifications setting
   */
  notifications: 0 | 1;

  /**
   * Premium account flag
   */
  isPremium: 0 | 1;

  /**
   * Additional accounts
   */
  additionalAccounts: any[];

  /**
   * Personal identification number (PINFL)
   */
  pinfl: string | null;

  /**
   * Company type
   */
  type: string | null;

  /**
   * Account balance
   */
  balance: string;

  /**
   * Tax identification number (TIN)
   */
  tin: string;

  /**
   * Company name
   */
  name: string;

  /**
   * VAT registration status
   */
  VATRegStatus: number;

  /**
   * VAT code
   */
  vatCode: string;

  /**
   * Offer signed flag
   */
  offerSigned: 0 | 1;

  /**
   * Configured messengers
   */
  messengers: {
    telegram?: string;
    [key: string]: string | undefined;
  };
}

/**
 * Profile update request
 */
export interface ProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  mobile?: string;
  notifications?: 0 | 1;
  mfo?: string;
  account?: string;
  oked?: string;
  director?: string;
  accountant?: string;
  districtId?: string;
  regionId?: number;
  vatRegCode?: string;
  vatRate?: number | null;
  itemReleasedFio?: string;
  itemReleasedPinfl?: string | null;
  vat?: number;
  excise?: boolean;
  address?: string;
  directorTin?: string;
  offerDocumentId?: string;
  offerSigned?: 0 | 1;
  additionalAccounts?: any[];
  pinfl?: string | null;
  directorPinfl?: string;
  companyTaxId?: string;
  companyName?: string;
  name?: string;
  bankId?: string;
  tin?: string;
  regCode?: string;
  vatCode?: string;
  bankAccount?: string;
  bankCode?: string;
  additionalMfos?: any[];
}

/**
 * Profile update response
 */
export interface ProfileUpdateResponse {
  id: number;
  taxId: string;
  company: string;
  firstName: string;
  lastName: string;
  phone: string;
  mobile: string;
  email: string;
  admin: string;
  updated: string;
  created: string;
  notifications: 0 | 1;
  mfo: string;
  account: string;
  oked: string;
  director: string;
  accountant: string;
  districtId: string;
  regionId: number;
  vatRegCode: string;
  status: number;
  isPremium: 0 | 1;
  vatRate: number | null;
  itemReleasedFio: string;
  itemReleasedPinfl: string | null;
  vat: number;
  excise: boolean;
  address: string;
  fullName: string;
  shortName: string;
  uzcardSignDate: string | null;
  directorTin: string;
  offerDocumentId: string;
  offerSigned: 0 | 1;
  additionalAccounts: any[];
  pinfl: string | null;
  directorPinfl: string;
  partner: string | null;
  origin: string | null;
  categorySeller: string | null;
  realizationPurpose: string | null;
  incomingDraftsVisibility: string | null;
  autofillDocThruContractId: boolean;
  type: string | null;
  useCodesFromDb: boolean;
  user_id: number;
  companyTaxId: string;
  companyName: string;
  name: string;
  bankId: string;
  tin: string;
  shortname: string;
  fullname: string;
  regCode: string;
  vatCode: string;
  bankAccount: string;
  bankCode: string;
  additionalMfos: any[];
}

/**
 * Profile operators response
 */
export type ProfileOperators = Record<string, string>;