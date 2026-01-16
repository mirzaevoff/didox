/**
 * Locale type for API requests
 */
export type DidoxLocale = 'ru' | 'uz';

/**
 * Legal entity login request
 */
export interface LegalEntityLoginRequest {
  /**
   * Tax Identification Number (exactly 9 digits)
   */
  taxId: string;

  /**
   * Password (minimum 8 characters)
   */
  password: string;

  /**
   * Locale for the response
   * @default 'ru'
   */
  locale?: DidoxLocale;
}

/**
 * Related company information
 */
export interface RelatedCompany {
  /**
   * Tax Identification Number
   */
  tin: string;

  /**
   * Company name
   */
  name: string;

  /**
   * Array of permission codes
   */
  permissions: number[];
}

/**
 * Legal entity login response
 */
export interface LegalEntityLoginResponse {
  /**
   * Access token (UUID format)
   * Valid for 360 minutes
   */
  token: string;

  /**
   * Related companies that this user can access
   */
  related_companies: RelatedCompany[] | null;
}

/**
 * Company login as individual request
 */
export interface CompanyLoginRequest {
  /**
   * Company Tax Identification Number (exactly 9 digits)
   */
  companyTaxId: string;

  /**
   * User access token from individual login
   */
  userToken: string;

  /**
   * Locale for the response
   * @default 'ru'
   */
  locale?: DidoxLocale;
}

/**
 * User permissions for a company
 */
export interface UserPermissions {
  /**
   * Tax Identification Number
   */
  tin: string;

  /**
   * Array of role codes
   */
  roles: number[];
}

/**
 * Company login response
 */
export interface CompanyLoginResponse {
  /**
   * Access token for the company context
   */
  token: string;

  /**
   * User permissions within this company
   */
  permissions: UserPermissions;
}