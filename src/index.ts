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

// Utilities module types
export type {
  CompanyBranch,
  GetBranchesByTinRequest
} from './modules/utilities/utilities.types.js';

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
export { UtilitiesApi } from './modules/utilities/utilities.api.js';