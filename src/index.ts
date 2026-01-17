/**
 * Didox SDK for Node.js
 * 
 * A TypeScript SDK for integrating with Didox, an electronic document management (EDO) 
 * platform in Uzbekistan. Enables legally significant exchange of electronic documents 
 * between companies.
 * 
 * @packageDocumentation
 */

// Main client
export { DidoxClient } from './client/DidoxClient.js';

// Configuration
export type { DidoxConfig } from './client/DidoxConfig.js';

// Auth module types
export type {
  DidoxLocale,
  LegalEntityLoginRequest,
  LegalEntityLoginResponse,
  CompanyLoginRequest,
  CompanyLoginResponse,
  RelatedCompany,
  UserPermissions
} from './modules/auth/auth.types.js';

// Account module types
export type {
  AccountProfile,
  UpdateProfileRequest,
  UpdateProfileResponse
} from './modules/account/account.types.js';

// Profile module types
export type {
  CompanyProfile,
  ProfileUpdateRequest,
  ProfileUpdateResponse,
  ProfileOperators
} from './modules/profile/profile.types.js';

// Product Classes types
export type {
  ProductClass,
  ProductClassPackage,
  ProductClassOrigin,
  ProductClassCodesResponse,
  ProductClassSearchResponse,
  ProductClassSearchParams,
  AddProductClassRequest,
  AddProductClassResponse,
  RemoveProductClassResponse,
  ProductClassesCodeCheckResponse
} from './modules/profile/productClasses.types.js';

// VAT types
export type {
  VatRegStatusResponse,
  TaxpayerTypeResponse,
  SupportedLanguage,
  VatRegStatus
} from './modules/profile/vat.types.js';

// Warehouses types
export type {
  Warehouse,
  WarehousesResponse
} from './modules/profile/warehouses.types.js';

// Users types
export type {
  UpdateCompanyUsersPermissionsRequest,
  UpdateCompanyUsersPermissionsResponse,
  GNKRoleCode,
  DidoxRoleCode
} from './modules/profile/users.types.js';

// Utilities module types
export type {
  CompanyBranch,
  GetBranchesByTinRequest,
  LegalEntityInfo
} from './modules/utilities/utilities.types.js';

// Documents module types
export type {
  ListDocumentsParams,
  DocumentMetadata,
  DocumentStatistics,
  DocumentPrivileges,
  DocumentResponse,
  DocumentCreatePayload,
  PaginationMeta,
  DocumentFilterParams,
  DateRangeFilter,
  DocumentsListResponse,
  NormalizedDocumentsListResponse,
  DocumentsStatisticsResponse,
  RawDocumentResponse,
  RawDocumentPrivilegesResponse
} from './modules/documents/documents.types.js';

// Documents module enums
export {
  DocumentType,
  DocumentStatus,
  OwnerType
} from './modules/documents/documents.enums.js';

// Error classes
export {
  DidoxError,
  DidoxValidationError,
  DidoxAuthError,
  DidoxApiError,
  DidoxNetworkError
} from './http/errors.js';

// Re-export for convenience
export { AuthApi } from './modules/auth/auth.api.js';
export { AccountApi } from './modules/account/account.api.js';
export { ProfileApi } from './modules/profile/profile.api.js';
export { ProductClassesApi } from './modules/profile/productClasses.api.js';
export { VatApi } from './modules/profile/vat.api.js';
export { WarehousesApi } from './modules/profile/warehouses.api.js';
export { UsersApi } from './modules/profile/users.api.js';
export { UtilitiesApi } from './modules/utilities/utilities.api.js';
export { DocumentsClient, builders, BaseDocumentBuilder } from './modules/documents/index.js';
export type { DocumentBuilderFactory } from './modules/documents/index.js';