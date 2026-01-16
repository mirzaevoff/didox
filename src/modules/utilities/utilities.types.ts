/**
 * Company branch information
 */
export interface CompanyBranch {
  /**
   * Branch ID
   */
  id: number;

  /**
   * NS10 code
   */
  ns10Code: number;

  /**
   * NS10 name (region)
   */
  ns10Name: string;

  /**
   * NS11 code
   */
  ns11Code: number;

  /**
   * NS11 name (district)
   */
  ns11Name: string;

  /**
   * Tax identification number
   */
  tin: string;

  /**
   * Company name
   */
  name: string;

  /**
   * Branch name
   */
  branchName: string;

  /**
   * Branch number
   */
  branchNum: string;

  /**
   * Deletion status
   */
  isDeleted: 0 | 1;

  /**
   * Creation date
   */
  createdDate: string;

  /**
   * Deletion date (if deleted)
   */
  deletedDate: string | null;

  /**
   * Director TIN
   */
  directorTin: string;

  /**
   * Director full name
   */
  directorName: string;

  /**
   * Director PINFL
   */
  directorPinfl: number;

  /**
   * Company PINFL (if applicable)
   */
  pinfl: string | null;

  /**
   * Accountant TIN
   */
  accountantTin: string;

  /**
   * Accountant full name
   */
  accountantName: string;

  /**
   * Accountant PINFL
   */
  accountantPinfl: number;

  /**
   * Bank MFO code
   */
  mfo: string;

  /**
   * Bank account number
   */
  account: string;

  /**
   * Geographic latitude
   */
  latitude: string;

  /**
   * Geographic longitude
   */
  longitude: string;

  /**
   * Branch address
   */
  address: string;

  /**
   * Client IP (if available)
   */
  clientIp?: string | null;

  /**
   * Branch URL (if available)
   */
  url?: string | null;

  /**
   * Language preference (if available)
   */
  lang?: string | null;

  /**
   * Data source (if available)
   */
  source?: string | null;
}

/**
 * Request parameters for getting branches by TIN
 */
export interface GetBranchesByTinRequest {
  /**
   * Company Tax Identification Number (exactly 9 digits)
   */
  tin: string;
}