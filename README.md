# Didox SDK for Node.js

[![npm version](https://badge.fury.io/js/didox.svg)](https://badge.fury.io/js/didox)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-green.svg)](https://nodejs.org)

A TypeScript SDK for integrating with **Didox**, an electronic document management (EDO) platform in Uzbekistan that enables legally significant exchange of electronic documents between companies.

## What is Didox?

Didox is an electronic document management platform in the Republic of Uzbekistan that facilitates legally significant electronic document exchange between companies. It provides:

- Secure electronic document signing
- Legal compliance with Uzbekistan EDO regulations
- Company-to-company document workflows
- Digital signature verification

## Installation

```bash
npm install didox
```

```bash
yarn add didox
```

```bash
pnpm add didox
```

## Quick Start

### 1. Initialize the Client

```typescript
import { DidoxClient } from 'didox';

const didox = new DidoxClient({
  partnerToken: 'your-partner-token',
  environment: 'development', // or 'production'
  timeout: 10000 // optional, defaults to 10 seconds
});
```

### 2. Legal Entity Authentication

```typescript
try {
  const result = await didox.auth.loginLegalEntity({
    taxId: '123456789',     // exactly 9 digits
    password: 'yourPassword', // minimum 8 characters
    locale: 'ru'            // 'ru' or 'uz', defaults to 'ru'
  });
  
  console.log('Access token:', result.token);
  console.log('Related companies:', result.related_companies);
  
  // Token is automatically stored in the client for subsequent requests
} catch (error) {
  console.error('Login failed:', error.message);
}
```

### 3. Individual to Company Login

```typescript
try {
  const result = await didox.auth.loginCompanyAsIndividual({
    companyTaxId: '987654321',
    userToken: 'individual-user-token', // from previous login
    locale: 'uz'
  });
  
  console.log('Company access token:', result.token);
  console.log('User permissions:', result.permissions);
} catch (error) {
  console.error('Company login failed:', error.message);
}
```

## Configuration

### Partner Token

The Partner Token is required to authorize API requests. To obtain a Partner Token:

1. Contact a Didox representative
2. Provide your company information and use case
3. Receive your unique Partner Token for API access

### Environment URLs

- **Development**: `https://stage.goodsign.biz/`
- **Production**: `https://api-partners.didox.uz/`

### Client Options

```typescript
interface DidoxConfig {
  partnerToken: string;                    // Required: Your Partner Token
  environment: 'development' | 'production'; // Required: Environment
  timeout?: number;                        // Optional: Request timeout in ms (default: 10000)
}
```

## Authentication

### Legal Entity Login

Authenticate a legal entity using Tax ID and password:

```typescript
const result = await didox.auth.loginLegalEntity({
  taxId: '123456789',      // exactly 9 digits
  password: 'securePass123', // minimum 8 characters  
  locale: 'ru'             // optional: 'ru' | 'uz'
});

// Access token (UUID, valid for 360 minutes)
console.log(result.token);

// Related companies (if any)
if (result.related_companies) {
  result.related_companies.forEach(company => {
    console.log(`${company.name} (${company.tin})`);
    console.log('Permissions:', company.permissions);
  });
}
```

### Individual to Company Login

Switch context to a specific company using an individual's token:

```typescript
const result = await didox.auth.loginCompanyAsIndividual({
  companyTaxId: '987654321',
  userToken: 'user-access-token', 
  locale: 'uz'
});

console.log('Company token:', result.token);
console.log('User roles in company:', result.permissions.roles);
```

## Error Handling

The SDK provides specific error classes for different failure scenarios:

```typescript
import {
  DidoxValidationError,
  DidoxAuthError, 
  DidoxApiError,
  DidoxNetworkError
} from 'didox';

try {
  const result = await didox.auth.loginLegalEntity({
    taxId: '123456789',
    password: 'mypassword'
  });
} catch (error) {
  if (error instanceof DidoxValidationError) {
    // Input validation failed
    console.error('Validation error:', error.message);
    console.error('Field:', error.field);
    
  } else if (error instanceof DidoxAuthError) {
    // Authentication failed (wrong credentials, etc.)
    console.error('Auth error:', error.message);
    console.error('Status code:', error.statusCode);
    
  } else if (error instanceof DidoxApiError) {
    // API returned an error response
    console.error('API error:', error.message);
    console.error('Status:', error.statusCode);
    console.error('Response:', error.response);
    
  } else if (error instanceof DidoxNetworkError) {
    // Network/connectivity issues
    console.error('Network error:', error.message);
    console.error('Cause:', error.cause);
  }
}
```

### Error Types

| Error Class | When It Occurs | Properties |
|-------------|----------------|------------|
| `DidoxValidationError` | Invalid input parameters | `field`, `message` |
| `DidoxAuthError` | Authentication failures (422) | `statusCode`, `message` |
| `DidoxApiError` | API errors (4xx, 5xx) | `statusCode`, `response`, `message` |
| `DidoxNetworkError` | Network/timeout issues | `cause`, `message` |

## TypeScript Support

The SDK is built with TypeScript and provides full type definitions:

```typescript
import type {
  DidoxConfig,
  LegalEntityLoginRequest,
  LegalEntityLoginResponse,
  CompanyLoginRequest,
  CompanyLoginResponse,
  RelatedCompany,
  UserPermissions,
  DidoxLocale
} from 'didox';

// Fully typed request
const request: LegalEntityLoginRequest = {
  taxId: '123456789',
  password: 'securePassword',
  locale: 'ru'
};

// Fully typed response
const response: LegalEntityLoginResponse = await didox.auth.loginLegalEntity(request);
```

## Requirements

- **Node.js**: ≥ 18.0.0
- **TypeScript**: ≥ 5.0 (for development)

## Versioning

This package follows [Semantic Versioning](https://semver.org/):

- **1.x.0**: New features, backward compatible
- **1.x.y**: Bug fixes and patches
- **No breaking changes** in 1.x releases

## License

MIT

## Support

For API documentation and support:
- [Official Didox API Documentation](https://api-docs.didox.uz/ru/home)
- [GitHub Issues](https://github.com/mirzaevoff/didox/issues)

---

**Note**: This is an unofficial SDK. For official support, contact Didox directly.