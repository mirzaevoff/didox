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

/**
 * Legal entity information by TIN response
 */
export interface LegalEntityInfo {
  /**
   * Region code
   */
  ns10Code: number;

  /**
   * District code  
   */
  ns11Code: number;

  /**
   * Short organization name
   */
  shortName: string;

  /**
   * Tax Identification Number (TIN)
   */
  tin: string;

  /**
   * Full organization name
   */
  name: string;

  /**
   * Legal form code
   */
  na1Code: number;

  /**
   * Legal form name
   */
  na1Name: string;

  /**
   * Organization status code
   */
  statusCode: number;

  /**
   * Organization status name
   */
  statusName: string;

  /**
   * Bank MFO code
   */
  mfo: string;

  /**
   * Bank account number
   */
  account: string;

  /**
   * Legal address
   */
  address: string;

  /**
   * OKED classification code
   */
  oked: string;

  /**
   * Director TIN
   */
  directorTin: string;

  /**
   * Director PINFL
   */
  directorPinfl: string;

  /**
   * Director full name
   */
  director: string;

  /**
   * Accountant name (nullable)
   */
  accountant: string | null;

  /**
   * Budget organization flag
   */
  isBudget: 0 | 1;

  /**
   * ITD flag
   */
  isItd: boolean;

  /**
   * Personal number (nullable)
   */
  personalNum: string | null;

  /**
   * Self employment flag
   */
  selfEmployment: boolean;

  /**
   * Private notary flag
   */
  privateNotary: boolean;

  /**
   * Peasant farm flag
   */
  peasantFarm: boolean;

  /**
   * VAT registration code
   */
  VATRegCode: string;

  /**
   * VAT registration status
   */
  VATRegStatus: number;

  /**
   * Bank account (duplicate)
   */
  bankAccount: string;

  /**
   * Bank code (duplicate MFO)
   */
  bankCode: string;

  /**
   * Short name (duplicate)
   */
  shortname: string;

  /**
   * Full name (duplicate)
   */
  fullname: string;

  /**
   * Full name (another duplicate)
   */
  fullName: string;
}