# Changelog

All notable changes to the Didox SDK will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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