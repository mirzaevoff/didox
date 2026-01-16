# Changelog

All notable changes to the Didox SDK will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3] - 2026-01-16

### Added
- **Product Classes (ИКПУ) Management**
  - `getProductClassCodes()` - Get attached product class codes for current profile
  - `searchProductClasses()` - Search available product classes with pagination
  - `addProductClass()` - Add product class code to profile
  - `removeProductClass()` - Remove product class code from profile
  - `checkProductClassCode()` - Check product class code packages by TIN
- **VAT & Taxpayer Information**
  - `getVatRegStatus()` - Get VAT registration status by TIN or PINFL
  - `getTaxpayerType()` - Get taxpayer type information
  - Support for historical data queries with date parameters
- **Warehouses Management**
  - `getWarehouses()` - Get warehouses by TIN or PINFL
- **Company Users & Permissions**
  - `updateCompanyUsersPermissions()` - Update company users permissions with signed tokens
  - Support for GNK (tax committee) and Didox internal roles
- **Enhanced Profile Module**
  - Modular architecture with sub-APIs for better organization
  - Convenience methods for direct access to extended features
- **Comprehensive Type Definitions**
  - Full TypeScript support for all new APIs
  - Enums for VAT status codes and role codes
  - Detailed interface definitions for all request/response objects

### Technical Improvements
- Extended validation for TIN/PINFL formats
- Enhanced error handling for new endpoint types
- Maintained backward compatibility with existing APIs

## [1.0.2] - 2026-01-16

### Added

- **Profile module** - Complete company profile management API
- **Get current profile** - Retrieve detailed company information (`didox.profile.getProfile()`)
- **Update profile** - Update company profile with comprehensive validation (`didox.profile.updateProfile()`)
- **Profile operators** - Get operators associated with the profile (`didox.profile.getOperators()`)
- **Utilities module** - Helper functions for company data operations
- **Get branches by TIN** - Retrieve company branches by Tax ID (`didox.utilities.getBranchesByTin()`)

### Technical Features

- **Enhanced validation** - Support for TIN (9 digits), PINFL (14 digits), VAT rates, regions
- **Comprehensive typing** - Full TypeScript support for all profile fields
- **Operator management** - Access to integrated platform operators (Didox, Faktura, etc.)
- **Branch queries** - Geographic and organizational branch information
- **Field filtering** - Only expose documented API fields in public types

### Validation Rules

- **TIN validation** - Exactly 9 digits for company/director identification
- **PINFL validation** - Exactly 14 digits for personal identification
- **Notifications** - Only 0 (disabled) or 1 (enabled)
- **Region ID** - Numeric regional identifiers
- **VAT settings** - Number validation for VAT rates and excise flags

### API Methods

- `didox.profile.getProfile()` - Get comprehensive company profile
- `didox.profile.updateProfile()` - Update company information
- `didox.profile.getOperators()` - List profile operators
- `didox.utilities.getBranchesByTin()` - Query branches by company TIN

## [1.0.1] - 2026-01-16

### Added

- **Account module** - Complete account/profile management API
- **Get current profile** - Retrieve authenticated user profile information (`didox.account.getProfile()`)
- **Update profile** - Update user profile with validation (`didox.account.updateProfile()`)
- **Input validation for profile update** - Strict validation for mobile, email, password, notifications
- **Enhanced authorization headers** - Automatic Partner-Authorization header management
- **TypeScript support for Account** - Full type definitions for profile operations

### Technical Features

- **Mobile validation** - Format 998XXXXXXXXX (12 digits)
- **Email validation** - Standard email format validation
- **Password validation** - Optional field, minimum 8 characters when provided
- **Notifications validation** - Accepts only 0 (disabled) or 1 (enabled)
- **Dual authentication** - Supports both user-key and Partner-Authorization headers

### API Methods

- `didox.account.getProfile()` - Get current user profile
- `didox.account.updateProfile()` - Update user profile information

## [1.0.0] - 2026-01-16

### Added

- **DidoxClient initialization** - Main SDK client with configuration management
- **Auth module** - Complete authentication API implementation
- **Legal entity login** - Authenticate legal entities with Tax ID and password
- **Individual to company login** - Switch context to company using individual token
- **Input validation** - Strict validation for all API parameters before requests
- **Typed errors** - Custom error classes for different failure scenarios:
  - `DidoxValidationError` - Input validation failures
  - `DidoxAuthError` - Authentication failures (422 status)
  - `DidoxApiError` - API error responses (4xx, 5xx)
  - `DidoxNetworkError` - Network and timeout errors
- **TypeScript support** - Full TypeScript definitions with strict typing
- **Environment configuration** - Support for development and production environments
- **Partner token authentication** - Secure API authorization using partner tokens
- **Token management** - Automatic token handling for authenticated requests
- **JSDoc documentation** - Complete IDE hints for all public methods
- **ESM + CJS builds** - Universal module support for modern and legacy Node.js

### Technical Features

- **Node.js ≥ 18 support** - Modern Node.js runtime requirement
- **Zero external dependencies** - Uses native fetch API for HTTP requests
- **Modular architecture** - Clean separation of concerns across modules
- **Production-ready code** - Enterprise-grade error handling and validation

### API Methods

- `didox.auth.loginLegalEntity()` - Legal entity authentication
- `didox.auth.loginCompanyAsIndividual()` - Company context switching