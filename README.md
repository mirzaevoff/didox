# Didox SDK for Node.js

[![npm version](https://badge.fury.io/js/didox.svg)](https://badge.fury.io/js/didox)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-green.svg)](https://nodejs.org)

A TypeScript SDK for integrating with **Didox**, an electronic document management (EDO) platform in Uzbekistan that enables legally significant electronic document exchange between companies.

## What is Didox?

Didox is an electronic document management platform in the Republic of Uzbekistan that facilitates legally significant electronic document exchange between companies. The platform ensures legal compliance with Uzbekistan EDO regulations, provides secure electronic document signing, and enables seamless company-to-company workflows.

## Installation

```bash
npm install didox
```

## Quick Start

```typescript
import { DidoxClient } from 'didox';

// Initialize the client
const didox = new DidoxClient({
  partnerToken: 'your-partner-token',
  environment: 'production'
});

// Authenticate
await didox.auth.loginLegalEntity({
  taxId: '123456789',
  password: 'yourPassword',
  locale: 'ru'
});

// List documents
const documents = await didox.documents.list({
  limit: 10,
  page: 1
});

// Create an invoice
const invoice = await didox.documents.createDraft(
  new InvoiceBuilder()
    .setBasicInfo({
      contractNumber: 'INV-001',
      contractDate: '01.01.2026'
    })
    .setSeller({
      tin: '123456789',
      name: 'My Company LLC'
    })
    .setBuyer({
      tin: '987654321',
      name: 'Client Company LLC'
    })
    .addProduct({
      name: 'Consulting Services',
      measureId: 796,
      count: 1,
      price: 1000000
    })
);
```

## Documents Module

### List Documents

Retrieve documents with filtering, sorting, and pagination:

```typescript
const result = await didox.documents.list({
  limit: 20,
  page: 1,
  status: 'SENT',
  docType: '002', // Invoice
  dateFrom: '01.01.2026',
  dateTo: '31.01.2026',
  sortBy: 'created_at',
  sortOrder: 'desc'
});

console.log(`Total: ${result.totalCount}`);
console.log(`Pages: ${result.pageCount}`);

result.data.forEach(doc => {
  console.log(`${doc.docType} #${doc.docNumber} - ${doc.status}`);
});
```

### Get Document Details

Retrieve detailed information about a specific document:

```typescript
const document = await didox.documents.get('document-id-here');

console.log('Document:', document.docNumber);
console.log('Status:', document.status);
console.log('Seller:', document.sellerTin);
console.log('Buyer:', document.buyerTin);
console.log('Total:', document.totalSum);
```

### Get Statistics

Retrieve document statistics for a date range:

```typescript
const stats = await didox.documents.getStatistics({
  dateFrom: '01.01.2026',
  dateTo: '31.01.2026'
});

console.log('Total documents:', stats.totalCount);
console.log('By status:', stats.byStatus);
console.log('By type:', stats.byDocType);
```

### Create Document Draft

Universal method for creating document drafts using builders:

```typescript
const draft = await didox.documents.createDraft(builder);

console.log('Draft created:', draft.documentId);
console.log('Status:', draft.status);
```

## Document Builders

The SDK provides fluent builder APIs for creating type-safe documents. All builders follow a consistent, chainable pattern for intuitive document construction.

### InvoiceBuilder (002)

Create electronic invoices with automatic VAT calculation:

```typescript
import { InvoiceBuilder } from 'didox';

const invoice = new InvoiceBuilder()
  .setBasicInfo({
    contractNumber: 'DOG-2026-001',
    contractDate: '15.01.2026'
  })
  .setSeller({
    tin: '123456789',
    name: 'Tech Solutions LLC',
    account: '20208000000000000001',
    bankId: '00014',
    address: 'Tashkent, Chilanzar district',
    director: 'John Smith',
    accountant: 'Jane Doe'
  })
  .setBuyer({
    tin: '987654321',
    name: 'Digital Services LLC',
    account: '20208000000000000002',
    bankId: '00014'
  })
  .addProduct({
    catalogCode: '10523001001000000',
    catalogName: 'Software Development',
    name: 'Custom CRM System',
    measureId: 796, // Service
    count: 1,
    price: 50000000, // 50,000,000 sum
    vatRate: 12,
    deliverySum: 0
  })
  .addProduct({
    catalogCode: '10523001002000000',
    catalogName: 'Technical Support',
    name: 'Annual Support Package',
    measureId: 796,
    count: 12,
    price: 2000000, // 2,000,000 sum per month
    vatRate: 12
  });

const result = await didox.documents.createDraft(invoice);
```

### ActBuilder (005)

Create acts of completed work and services:

```typescript
import { ActBuilder } from 'didox';

const act = new ActBuilder()
  .setBasicInfo({
    contractNumber: 'ACT-2026-001',
    contractDate: '20.01.2026'
  })
  .setExecutor({
    tin: '123456789',
    name: 'Construction LLC'
  })
  .setCustomer({
    tin: '987654321',
    name: 'Real Estate LLC'
  })
  .addService({
    name: 'Office Renovation',
    measureId: 796,
    count: 1,
    price: 100000000,
    vatRate: 0
  });

const result = await didox.documents.createDraft(act);
```

### TTNBuilder (041)

Create transport waybills:

```typescript
import { TTNBuilder } from 'didox';

const ttn = new TTNBuilder()
  .setBasicInfo({
    contractNumber: 'TTN-001',
    contractDate: '17.01.2026'
  })
  .setSeller({
    tin: '123456789',
    name: 'Logistics LLC'
  })
  .setBuyer({
    tin: '987654321',
    name: 'Retail LLC'
  })
  .setTransportInfo({
    driver: 'Driver Name',
    vehicleNumber: '01A123BC'
  })
  .addProduct({
    catalogCode: '06212003001000000',
    name: 'Electronics',
    measureId: 163,
    count: 100,
    price: 500000
  });

const result = await didox.documents.createDraft(ttn);
```

### EmpowermentBuilder (006)

Create power of attorney documents:

```typescript
import { EmpowermentBuilder } from 'didox';

const empowerment = new EmpowermentBuilder()
  .setBasicInfo({
    number: 'POA-001',
    date: '17.01.2026',
    expirationDate: '17.01.2027'
  })
  .setPrincipal({
    tin: '123456789',
    name: 'Company LLC',
    director: 'CEO Name'
  })
  .setAgent({
    pinfl: '12345678901234',
    fullName: 'Agent Full Name'
  })
  .addAuthority({
    code: 'SIGN_DOCUMENTS',
    description: 'Sign financial documents'
  });

const result = await didox.documents.createDraft(empowerment);
```

### ArbitraryBuilder (000)

Create custom documents with flexible structure:

```typescript
import { ArbitraryBuilder } from 'didox';

const arbitrary = new ArbitraryBuilder()
  .setBasicInfo({
    docNumber: 'CUSTOM-001',
    docDate: '17.01.2026',
    docType: '000'
  })
  .setSeller({
    tin: '123456789',
    name: 'Company LLC'
  })
  .setBuyer({
    tin: '987654321',
    name: 'Client LLC'
  })
  .addProduct({
    name: 'Custom Item',
    measureId: 796,
    count: 1,
    price: 1000000
  });

const result = await didox.documents.createDraft(arbitrary);
```

### MultiPartyBuilder (010)

Create multi-party contracts and agreements:

```typescript
import { MultiPartyBuilder } from 'didox';

const contract = new MultiPartyBuilder()
  .setBasicInfo({
    contractNumber: 'MP-2026-001',
    contractDate: '17.01.2026'
  })
  .addParty({
    tin: '111111111',
    name: 'Party One LLC',
    role: 'SELLER'
  })
  .addParty({
    tin: '222222222',
    name: 'Party Two LLC',
    role: 'BUYER'
  })
  .addParty({
    tin: '333333333',
    name: 'Party Three LLC',
    role: 'GUARANTOR'
  })
  .addProduct({
    name: 'Product',
    count: 1,
    price: 5000000
  });

const result = await didox.documents.createDraft(contract);
```

### FoundersProtocolBuilder (075)

Create founders' meeting protocols:

```typescript
import { FoundersProtocolBuilder } from 'didox';

const protocol = new FoundersProtocolBuilder()
  .setBasicInfo({
    protocolNumber: 'PROT-001',
    protocolDate: '17.01.2026',
    meetingDate: '15.01.2026'
  })
  .setCompany({
    tin: '123456789',
    name: 'Startup LLC'
  })
  .addFounder({
    tin: '111111111',
    name: 'Founder One',
    sharePercent: 60
  })
  .addFounder({
    tin: '222222222',
    name: 'Founder Two',
    sharePercent: 40
  })
  .addDecision({
    topic: 'Capital Increase',
    decision: 'Approved',
    votesFor: 100,
    votesAgainst: 0
  });

const result = await didox.documents.createDraft(protocol);
```

### LetterNKBuilder (013)

Create letters to tax authorities:

```typescript
import { LetterNKBuilder } from 'didox';

const letter = new LetterNKBuilder()
  .setBasicInfo({
    letterNumber: 'NK-001',
    letterDate: '17.01.2026'
  })
  .setSender({
    tin: '123456789',
    name: 'Company LLC',
    director: 'Director Name'
  })
  .setRecipient({
    taxAuthorityCode: '0001',
    taxAuthorityName: 'Tashkent City Tax Department'
  })
  .setContent({
    subject: 'Tax Declaration Clarification',
    body: 'We request clarification on...',
    attachments: ['declaration.pdf']
  });

const result = await didox.documents.createDraft(letter);
```

## DX Philosophy

The Didox SDK is designed with developer experience as a top priority:

- **Fluent API** - Chainable methods for intuitive document creation
- **Type Safety** - Full TypeScript support with comprehensive type definitions
- **Smart Validation** - Built-in validation catches errors before API calls
- **Consistent Patterns** - All builders follow the same intuitive structure
- **Zero Breaking Changes** - Backward compatibility guaranteed in 1.x releases
- **Clear Errors** - Descriptive error messages with field-level details
- **Auto-completion** - IDE hints guide you through document creation

## Authentication

### Legal Entity Login

```typescript
const result = await didox.auth.loginLegalEntity({
  taxId: '123456789',
  password: 'yourPassword',
  locale: 'ru'
});

console.log('Token:', result.token);
```

### Company Login

```typescript
const result = await didox.auth.loginCompanyAsIndividual({
  companyTaxId: '987654321',
  userToken: 'user-token',
  locale: 'uz'
});
```

## Error Handling

```typescript
import {
  DidoxValidationError,
  DidoxAuthError,
  DidoxApiError,
  DidoxNetworkError
} from 'didox';

try {
  await didox.documents.createDraft(builder);
} catch (error) {
  if (error instanceof DidoxValidationError) {
    console.error('Validation failed:', error.field, error.message);
  } else if (error instanceof DidoxAuthError) {
    console.error('Authentication required');
  } else if (error instanceof DidoxApiError) {
    console.error('API error:', error.statusCode, error.message);
  }
}
```

## Requirements

- **Node.js**: ≥ 18.0.0
- **TypeScript**: ≥ 5.0 (for development)

## Versioning

This package follows [Semantic Versioning](https://semver.org/):

- **Major (1.0.0)**: Breaking changes
- **Minor (1.x.0)**: New features, backward compatible
- **Patch (1.x.y)**: Bug fixes and patches

No breaking changes in 1.x releases.

## License

MIT

---

**Note**: This is an unofficial SDK. For official support, contact Didox directly.
