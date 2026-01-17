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

## Account / Profile

### Get Current Profile

Retrieve the profile information for the currently authenticated user:

```typescript
try {
  const profile = await didox.account.getProfile();
  
  console.log('Mobile:', profile.mobile);           // 998XXXXXXXXX
  console.log('Email:', profile.email);             // user@example.com
  console.log('Notifications:', profile.notifications); // 0 or 1
  console.log('Messengers:', profile.messengers);   // ['telegram', 'viber']
} catch (error) {
  if (error instanceof DidoxAuthError) {
    console.error('Authentication required:', error.message);
  }
}
```

### Update Profile

Update the current user's profile information:

```typescript
try {
  const updatedProfile = await didox.account.updateProfile({
    mobile: '998901234567',        // format: 998XXXXXXXXX
    email: 'newemail@example.com', // valid email
    password: 'newPassword123',    // optional, min 8 chars
    notifications: 1               // 1 = enabled, 0 = disabled
  });
  
  console.log('Profile updated successfully');
  console.log('New mobile:', updatedProfile.mobile);
  console.log('New email:', updatedProfile.email);
  console.log('Notifications:', updatedProfile.notifications);
} catch (error) {
  if (error instanceof DidoxValidationError) {
    console.error('Validation error:', error.message);
    console.error('Field:', error.field);
  }
}
```

## Profile

The Profile module provides access to detailed company profile information and management capabilities.

### Get Current Profile

Retrieve comprehensive company profile data:

```typescript
try {
  const profile = await didox.profile.getProfile();
  
  console.log('Company:', profile.fullName);        // Full company name
  console.log('TIN:', profile.tin);                 // Tax ID
  console.log('Balance:', profile.balance);         // Account balance
  console.log('Director:', profile.director);       // Director name
  console.log('Address:', profile.address);         // Company address
  console.log('VAT Status:', profile.VATRegStatus); // VAT registration status
  console.log('Messengers:', profile.messengers);   // Connected messengers
} catch (error) {
  if (error instanceof DidoxAuthError) {
    console.error('Authentication required:', error.message);
  }
}
```

### Update Profile

Update company profile information with validation:

```typescript
try {
  const updatedProfile = await didox.profile.updateProfile({
    phone: '998901234567',
    email: 'company@example.com',
    notifications: 1,              // Enable notifications
    regionId: 26,                  // Tashkent region
    directorTin: '123456789',      // Director's TIN (9 digits)
    address: 'New company address',
    vatRate: 15                    // VAT rate percentage
  });
  
  console.log('Profile updated successfully');
  console.log('Updated company:', updatedProfile.name);
} catch (error) {
  if (error instanceof DidoxValidationError) {
    console.error('Validation error:', error.message);
    console.error('Field:', error.field);
  }
}
```

### Get Profile Operators

Retrieve operators associated with the company:

```typescript
try {
  const operators = await didox.profile.getOperators();
  
  Object.entries(operators).forEach(([id, name]) => {
    console.log(`Operator ${id}: ${name}`);
  });
  
  // Example output:
  // Operator 202530465: soliqservis.uz
  // Operator 302563857: Faktura.uz
  // Operator 302936161: Didox.uz
} catch (error) {
  console.error('Failed to get operators:', error.message);
}
```

## Utilities

The Utilities module provides helper functions for working with company data and branches.

### Get Branches by TIN

Retrieve branch information for a specific company:

```typescript
try {
  const branches = await didox.utilities.getBranchesByTin({
    tin: '123456789'  // Company TIN (9 digits)
  });
  
  branches.forEach(branch => {
    console.log(`Branch: ${branch.branchName}`);
    console.log(`Location: ${branch.address}`);
    console.log(`Director: ${branch.directorName}`);
    console.log(`Status: ${branch.isDeleted ? 'Deleted' : 'Active'}`);
    console.log(`Coordinates: ${branch.latitude}, ${branch.longitude}`);
    console.log('---');
  });
} catch (error) {
  if (error instanceof DidoxValidationError) {
    console.error('Invalid TIN format:', error.message);
  }
}
```

### Get Legal Entity Information by TIN

Retrieve detailed legal entity (company) information:

```typescript
try {
  const entityInfo = await didox.utilities.getLegalEntityInfoByTin('306915557');
  
  console.log('Organization:', entityInfo.name);
  console.log('Short name:', entityInfo.shortName);
  console.log('Director:', entityInfo.director);
  console.log('Legal form:', entityInfo.na1Name);
  console.log('Address:', entityInfo.address);
  console.log('OKED code:', entityInfo.oked);
  console.log('VAT status:', entityInfo.VATRegStatus);
  console.log('Bank account:', entityInfo.account);
  console.log('Bank MFO:', entityInfo.mfo);
  
  // Check organization flags
  console.log('Budget org:', entityInfo.isBudget ? 'Yes' : 'No');
  console.log('Self employment:', entityInfo.selfEmployment ? 'Yes' : 'No');
  console.log('Private notary:', entityInfo.privateNotary ? 'Yes' : 'No');
} catch (error) {
  if (error instanceof DidoxValidationError) {
    console.error('Invalid TIN format:', error.message);
  } else if (error instanceof DidoxAuthError) {
    console.error('Authentication required:', error.message);
  }
}
```

## Product Classes (ИКПУ)

Manage product classification codes for your company profile.

### Get Attached Product Classes

Retrieve product classes currently attached to your profile:

```typescript
try {
  const result = await didox.profile.getProductClassCodes();
  
  console.log('Total attached classes:', result.data.length);
  
  result.data.forEach(productClass => {
    console.log(`Code: ${productClass.classCode}`);
    console.log(`Name: ${productClass.className}`);
    console.log(`Packages: ${productClass.packages.length} available`);
    console.log('---');
  });
} catch (error) {
  console.error('Failed to get product classes:', error.message);
}
```

### Search Available Product Classes

Search for product classes you can attach to your profile:

```typescript
try {
  const result = await didox.profile.searchProductClasses({
    search: 'фото',
    lang: 'ru',
    page: 1
  });
  
  console.log(`Found ${result.total} classes (page ${result.current_page})`);
  
  result.data.forEach(productClass => {
    console.log(`Code: ${productClass.classCode}`);
    console.log(`Name: ${productClass.className_ru}`);
    console.log(`Origin: ${productClass.origin.name}`);
  });
} catch (error) {
  console.error('Failed to search product classes:', error.message);
}
```

### Add/Remove Product Classes

```typescript
try {
  // Add a product class
  await didox.profile.addProductClass('08418001001013043');
  console.log('Product class added successfully');
  
  // Remove a product class
  await didox.profile.removeProductClass('08418001001013043');
  console.log('Product class removed successfully');
} catch (error) {
  console.error('Failed to manage product class:', error.message);
}
```

## VAT & Taxpayer Information

Get VAT registration and taxpayer type information.

### VAT Registration Status

Check VAT registration status by TIN or PINFL:

```typescript
try {
  const vatStatus = await didox.profile.getVatRegStatus('123456789');
  
  console.log(`VAT Registration Code: ${vatStatus.vatRegCode}`);
  console.log(`VAT Status: ${vatStatus.vatRegStatus}`);
  
  // Status codes:
  // 10 - Плательщик НДС
  // 20 - Плательщик НДС+ (сертификат активный)
  // 21 - Плательщик НДС+ (сертификат неактивный)
  // 30 - Плательщик налога с оборота
  // 50 - Индивидуальный предприниматель
  // 60 - Физическое лицо
} catch (error) {
  console.error('Failed to get VAT status:', error.message);
}
```

### Taxpayer Type

Get taxpayer type information:

```typescript
try {
  const taxpayerType = await didox.profile.getTaxpayerType(
    '123456789', // TIN
    'ru',        // Language
    '17.01.2022' // Optional date
  );
  
  console.log(`Code: ${taxpayerType.code}`);
  console.log(`Name: ${taxpayerType.name}`);
} catch (error) {
  console.error('Failed to get taxpayer type:', error.message);
}
```

## Warehouses

Get warehouse information by TIN or PINFL.

```typescript
try {
  const warehouses = await didox.profile.getWarehouses('123456789');
  
  console.log(`Found ${warehouses.length} warehouses`);
  
  warehouses.forEach(warehouse => {
    console.log(`Warehouse #${warehouse.warehouseNumber}`);
    console.log(`Name: ${warehouse.warehouseName}`);
    console.log(`Address: ${warehouse.warehouseAddress}`);
    console.log('---');
  });
} catch (error) {
  console.error('Failed to get warehouses:', error.message);
}
```

## Company Users & Permissions

Manage company user permissions with signed tokens.

```typescript
try {
  await didox.profile.updateCompanyUsersPermissions({
    gnkpermissions: 'base64-signed-gnk-roles-token',
    internalpermissions: 'base64-signed-didox-roles-token',
    is_director: 1
  });
  
  console.log('User permissions updated successfully');
} catch (error) {
  console.error('Failed to update permissions:', error.message);
}
```

**Note**: This API requires externally signed tokens. The SDK does not generate signatures - you must prepare and sign the role JSONs externally before calling this method.

### Role Codes Reference

**GNK (Tax Committee) Roles:**
- 11 - Отправка / отмена ЭСФ
- 12 - Подтверждение / отклонение ЭСФ
- 21 - Отправка / отмена доверенностей
- 22 - Подтверждение / отклонение доверенностей
- And more...

**Didox Internal Roles:**
- 191 - Отправка / отмена заказов
- 192 - Подтверждение / отклонение заказов
- 59 - Создание договоров
- 199 - Создание заказов
- And more...

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
  DidoxLocale,
  AccountProfile,
  UpdateProfileRequest,
  UpdateProfileResponse,
  CompanyProfile,
  ProfileUpdateRequest,
  ProfileUpdateResponse,
  ProfileOperators,
  CompanyBranch,
  GetBranchesByTinRequest
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