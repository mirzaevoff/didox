/**
 * Empowerment Builder (Stage 3.2.9)
 * 
 * Builder for creating empowerment documents (doctype 006 - Доверенность).
 * Provides DX-friendly fluent API with transformation to API-compliant payload.
 * 
 * Key features:
 * - Three-party structure: Seller, Buyer, Agent
 * - NO prices, VAT, or sums (pure product list with quantities)
 * - Auto-increment OrdNo for products
 * - Optional contract reference
 * - Agent with passport information
 * 
 * @module empowerment
 */

import { BaseDocumentBuilder } from './base/BaseDocumentBuilder.js';
import { DidoxValidationError } from '../../../http/errors.js';

/**
 * DX-friendly interface for agent passport information
 */
export interface AgentPassportDraft {
  /**
   * Passport number (optional)
   */
  number?: string;
  /**
   * Passport issued by (optional)
   */
  issuedBy?: string;
  /**
   * Passport issue date in YYYY-MM-DD format (optional)
   */
  issueDate?: string;
}

/**
 * DX-friendly interface for agent information
 */
export interface AgentDraft {
  /**
   * Full name (ФИО)
   */
  fio: string;
  /**
   * PINFL (14-digit personal identification number)
   */
  pinfl: string;
  /**
   * Job title (optional)
   */
  jobTitle?: string;
  /**
   * Passport information (optional)
   */
  passport?: AgentPassportDraft;
}

/**
 * DX-friendly interface for seller/buyer company information
 */
export interface CompanyDraft {
  /**
   * TIN (ИНН)
   */
  tin: string;
  /**
   * Company name
   */
  name: string;
  /**
   * Bank account number
   */
  account: string;
  /**
   * Bank ID (MFO)
   */
  bankId: string;
  /**
   * Company address
   */
  address: string;
  /**
   * Director name (optional)
   */
  director?: string;
  /**
   * Accountant name (optional)
   */
  accountant?: string;
  /**
   * Branch code (optional)
   */
  branchCode?: string;
  /**
   * Branch name (optional)
   */
  branchName?: string;
}

/**
 * DX-friendly interface for product in empowerment
 */
export interface EmpowermentProductDraft {
  /**
   * Product name
   */
  name: string;
  /**
   * Catalog code (ИКПУ)
   */
  catalogCode: string;
  /**
   * Catalog name (optional, from ИКПУ classifier)
   */
  catalogName?: string;
  /**
   * Measure unit ID (e.g., "1" for pieces)
   */
  measureId: string;
  /**
   * Quantity
   */
  count: number;
}

/**
 * Complete DX-friendly draft structure for Empowerment
 */
export interface EmpowermentDraft {
  /**
   * Empowerment document information
   */
  empowerment: {
    no: string;
    issueDate: string;
    expireDate: string;
  };
  /**
   * Contract reference (optional)
   */
  contract?: {
    no: string;
    date: string;
  };
  /**
   * Agent information (person receiving empowerment)
   */
  agent: AgentDraft;
  /**
   * Seller company information
   */
  seller: CompanyDraft;
  /**
   * Buyer company information
   */
  buyer: CompanyDraft;
  /**
   * List of products covered by empowerment
   */
  products: EmpowermentProductDraft[];
}

/**
 * API-compliant interface for empowerment payload
 * 
 * This is the exact structure expected by Didox API for doctype 006.
 */
export interface ApiEmpowermentPayload {
  EmpowermentDoc: {
    EmpowermentNo: string;
    EmpowermentDateOfIssue: string;
    EmpowermentDateOfExpire: string;
  };
  ContractDoc: {
    ContractNo: string;
    ContractDate: string;
  };
  Agent: {
    JobTitle: string | null;
    Fio: string;
    Passport: {
      Number: string | null;
      IssuedBy: string | null;
      DateOfIssue: string | null;
    };
    AgentTin: string;
  };
  SellerTin: string;
  Seller: {
    Name: string;
    Address: string;
    BankAccount: string;
    BankId: string;
    Director: string;
    Accountant: string;
    BranchCode: string;
    BranchName: string;
  };
  BuyerTin: string;
  Buyer: {
    Name: string;
    Address: string;
    BankAccount: string;
    BankId: string;
    Director: string;
    Accountant: string;
    BranchCode: string;
    BranchName: string;
  };
  ProductList: {
    Tin: string;
    HasExcise: boolean;
    HasVat: boolean;
    Products: Array<{
      OrdNo: number;
      CatalogCode: string;
      CatalogName: string;
      Name: string;
      MeasureId: string;
      Count: string;
    }>;
  };
}

/**
 * Builder for creating Empowerment documents (doctype 006)
 *
 * The EmpowermentBuilder provides a DX-friendly fluent API for building
 * empowerment (power of attorney) documents. It supports three-party structure
 * (seller, buyer, agent) with product lists, but without any pricing or VAT information.
 *
 * Features:
 * - Fluent API for intuitive document building
 * - Three-party structure: Seller, Buyer, Agent
 * - Product list with auto-incrementing OrdNo
 * - No prices, VAT, or sum calculations
 * - Optional contract reference
 * - Agent passport information support
 * - DX-friendly draft format with API transformation
 * - Raw escape hatch for custom fields
 * - TypeScript type safety with exactOptionalPropertyTypes
 *
 * @extends BaseDocumentBuilder<ApiEmpowermentPayload>
 *
 * @example
 * ```typescript
 * // Basic empowerment
 * const empowerment = builders.empowerment()
 *   .empowerment('EMP-001', '2025-02-07', '2025-02-14')
 *   .agent({
 *     fio: 'MAMATQULOV SANJAR XAMZALI O\'G\'LI',
 *     pinfl: '50106026830029'
 *   })
 *   .seller({
 *     tin: '302936161',
 *     name: '"VENKON GROUP" MCHJ',
 *     account: '20208000400308125001',
 *     bankId: '00974',
 *     address: 'г. Ташкент, ул. Навои, 1'
 *   })
 *   .buyer({
 *     tin: '310529901',
 *     name: '"DIDOX TECH" MCHJ',
 *     account: '20208000905656222001',
 *     bankId: '00401',
 *     address: 'г. Ташкент, ул. Амира Темура, 15'
 *   })
 *   .addProduct({
 *     name: 'Ноутбук',
 *     catalogCode: '08471001001000000',
 *     measureId: '1',
 *     count: 10
 *   })
 *   .build();
 *
 * // With contract and passport details
 * const detailedEmpowerment = builders.empowerment()
 *   .empowerment('EMP-002', '2025-02-10', '2025-03-10')
 *   .contract('CNT-1', '2025-01-01')
 *   .agent({
 *     fio: 'ИВАНОВ ИВАН ИВАНОВИЧ',
 *     pinfl: '12345678901234',
 *     jobTitle: 'Менеджер по продажам',
 *     passport: {
 *       number: 'AC1234567',
 *       issuedBy: 'ОВД Мирзо-Улугбекского района',
 *       issueDate: '2020-05-15'
 *     }
 *   })
 *   .seller({
 *     tin: '123456789',
 *     name: 'ООО "Поставщик"',
 *     account: '20208000400000000001',
 *     bankId: '00401',
 *     address: 'Адрес поставщика',
 *     director: 'Директор Иванов И.И.',
 *     accountant: 'Бухгалтер Петрова П.П.',
 *     branchCode: 'BRANCH01',
 *     branchName: 'Центральный филиал'
 *   })
 *   .buyer({
 *     tin: '987654321',
 *     name: 'ООО "Покупатель"',
 *     account: '20208000400000000002',
 *     bankId: '00974',
 *     address: 'Адрес покупателя'
 *   })
 *   .addProducts([
 *     {
 *       name: 'Компьютер настольный',
 *       catalogCode: '08471001002000000',
 *       catalogName: 'Компьютеры персональные',
 *       measureId: '1',
 *       count: 5
 *     },
 *     {
 *       name: 'Монитор 24"',
 *       catalogCode: '08471002001000000',
 *       measureId: '1',
 *       count: 5
 *     }
 *   ])
 *   .build();
 * ```
 */
export class EmpowermentBuilder extends BaseDocumentBuilder<ApiEmpowermentPayload> {
  private draft: Partial<EmpowermentDraft> = {
    products: []
  };

  /**
   * Set empowerment document information (number and dates)
   *
   * @param no - Empowerment number
   * @param issueDate - Issue date in YYYY-MM-DD format
   * @param expireDate - Expiration date in YYYY-MM-DD format
   * @returns The builder instance for method chaining
   *
   * @example
   * ```typescript
   * builder.empowerment('EMP-2025-001', '2025-02-07', '2025-02-14')
   * ```
   */
  empowerment(no: string, issueDate: string, expireDate: string): this {
    this.draft.empowerment = { no, issueDate, expireDate };
    return this;
  }

  /**
   * Set contract reference (optional)
   *
   * @param no - Contract number
   * @param date - Contract date in YYYY-MM-DD format
   * @returns The builder instance for method chaining
   *
   * @example
   * ```typescript
   * builder.contract('CNT-2025-089', '2025-01-15')
   * ```
   */
  contract(no: string, date: string): this {
    this.draft.contract = { no, date };
    return this;
  }

  /**
   * Set agent information (person receiving empowerment)
   *
   * @param agentInfo - Complete agent details
   * @returns The builder instance for method chaining
   *
   * @example
   * ```typescript
   * // Basic agent
   * builder.agent({
   *   fio: 'MAMATQULOV SANJAR XAMZALI O\'G\'LI',
   *   pinfl: '50106026830029'
   * })
   *
   * // Agent with full details
   * builder.agent({
   *   fio: 'ИВАНОВ ИВАН ИВАНОВИЧ',
   *   pinfl: '12345678901234',
   *   jobTitle: 'Менеджер по продажам',
   *   passport: {
   *     number: 'AC1234567',
   *     issuedBy: 'ОВД Мирзо-Улугбекского района',
   *     issueDate: '2020-05-15'
   *   }
   * })
   * ```
   */
  agent(agentInfo: AgentDraft): this {
    this.draft.agent = agentInfo;
    return this;
  }

  /**
   * Set seller company information
   *
   * @param sellerInfo - Complete seller details
   * @returns The builder instance for method chaining
   *
   * @example
   * ```typescript
   * builder.seller({
   *   tin: '302936161',
   *   name: '"VENKON GROUP" MCHJ',
   *   account: '20208000400308125001',
   *   bankId: '00974',
   *   address: 'г. Ташкент, ул. Навои, 1',
   *   director: 'Директор Иванов И.И.',
   *   accountant: 'Гл. бухгалтер Петрова П.П.',
   *   branchCode: 'TSH01',
   *   branchName: 'Ташкентский филиал'
   * })
   * ```
   */
  seller(sellerInfo: CompanyDraft): this {
    this.draft.seller = sellerInfo;
    return this;
  }

  /**
   * Set buyer company information
   *
   * @param buyerInfo - Complete buyer details
   * @returns The builder instance for method chaining
   *
   * @example
   * ```typescript
   * builder.buyer({
   *   tin: '310529901',
   *   name: '"DIDOX TECH" MCHJ',
   *   account: '20208000905656222001',
   *   bankId: '00401',
   *   address: 'г. Ташкент, ул. Амира Темура, 15'
   * })
   * ```
   */
  buyer(buyerInfo: CompanyDraft): this {
    this.draft.buyer = buyerInfo;
    return this;
  }

  /**
   * Add a single product to the empowerment
   *
   * Products are assigned auto-incrementing OrdNo starting from 1.
   * Count is converted to string in the final API payload.
   *
   * @param product - Product details
   * @returns The builder instance for method chaining
   *
   * @example
   * ```typescript
   * builder.addProduct({
   *   name: 'Ноутбук Dell Latitude',
   *   catalogCode: '08471001001000000',
   *   catalogName: 'Компьютеры портативные',
   *   measureId: '1',
   *   count: 10
   * })
   * ```
   */
  addProduct(product: EmpowermentProductDraft): this {
    if (!this.draft.products) {
      this.draft.products = [];
    }
    this.draft.products.push(product);
    return this;
  }

  /**
   * Add multiple products to the empowerment
   *
   * Products are assigned auto-incrementing OrdNo in the order they are added.
   *
   * @param products - Array of product details
   * @returns The builder instance for method chaining
   *
   * @example
   * ```typescript
   * builder.addProducts([
   *   {
   *     name: 'Компьютер настольный',
   *     catalogCode: '08471001002000000',
   *     catalogName: 'Компьютеры персональные',
   *     measureId: '1',
   *     count: 5
   *   },
   *   {
   *     name: 'Монитор 24"',
   *     catalogCode: '08471002001000000',
   *     measureId: '1',
   *     count: 5
   *   }
   * ])
   * ```
   */
  addProducts(products: EmpowermentProductDraft[]): this {
    if (!this.draft.products) {
      this.draft.products = [];
    }
    this.draft.products.push(...products);
    return this;
  }

  /**
   * Raw data merge (escape hatch)
   *
   * Allows merging arbitrary JSON data directly into the API payload.
   * Useful for edge cases, advanced scenarios, or undocumented API fields.
   * The data is deep-merged with the generated payload.
   *
   * @param data - Raw data to merge into the payload
   * @returns The builder instance for method chaining
   *
   * @example
   * ```typescript
   * builder.raw({
   *   CustomField: 'Custom Value',
   *   EmpowermentDoc: {
   *     AdditionalInfo: 'Some additional information'
   *   }
   * })
   * ```
   */
  raw(data: Partial<ApiEmpowermentPayload & Record<string, any>>): this {
    return super.raw(data);
  }

  /**
   * Build the final API-compliant payload
   *
   * Transforms the DX-friendly draft into the API format expected by Didox.
   * Performs validation and applies field transformations:
   *
   * - empowerment → EmpowermentDoc {EmpowermentNo, EmpowermentDateOfIssue, EmpowermentDateOfExpire}
   * - contract → ContractDoc {ContractNo, ContractDate} (empty strings if not provided)
   * - agent → Agent with JobTitle (null default), Passport fields (null defaults)
   * - seller/buyer → Seller/Buyer with BranchCode/BranchName defaults ("")
   * - products → ProductList with auto-increment OrdNo, count as string
   * - HasExcise: false, HasVat: false (always)
   *
   * @returns Complete API payload ready for Didox submission
   * @throws {DidoxValidationError} When required fields are missing or products list is empty
   *
   * @example
   * ```typescript
   * const payload = builder
   *   .empowerment('EMP-001', '2025-02-07', '2025-02-14')
   *   .agent({ fio: 'Agent Name', pinfl: '12345678901234' })
   *   .seller({ tin: '123456789', name: 'Seller', account: '...', bankId: '...', address: '...' })
   *   .buyer({ tin: '987654321', name: 'Buyer', account: '...', bankId: '...', address: '...' })
   *   .addProduct({ name: 'Product', catalogCode: '...', measureId: '1', count: 10 })
   *   .build();
   *
   * await client.documents.createDraft('006', payload);
   * ```
   */
  build(): ApiEmpowermentPayload & Record<string, any> {
    // Validation
    if (!this.draft.empowerment) {
      throw new DidoxValidationError('Empowerment information is required');
    }

    if (!this.draft.agent) {
      throw new DidoxValidationError('Agent information is required');
    }

    if (!this.draft.seller) {
      throw new DidoxValidationError('Seller information is required');
    }

    if (!this.draft.buyer) {
      throw new DidoxValidationError('Buyer information is required');
    }

    if (!this.draft.products || this.draft.products.length === 0) {
      throw new DidoxValidationError('At least one product is required');
    }

    // Transform contract (empty strings if not provided)
    const contractDoc = this.draft.contract
      ? {
          ContractNo: this.draft.contract.no,
          ContractDate: this.draft.contract.date
        }
      : {
          ContractNo: '',
          ContractDate: ''
        };

    // Transform agent passport (null defaults)
    const agentPassport = {
      Number: this.draft.agent.passport?.number || null,
      IssuedBy: this.draft.agent.passport?.issuedBy || null,
      DateOfIssue: this.draft.agent.passport?.issueDate || null
    };

    // Transform seller
    const seller = {
      Name: this.draft.seller.name,
      Address: this.draft.seller.address,
      BankAccount: this.draft.seller.account,
      BankId: this.draft.seller.bankId,
      Director: this.draft.seller.director || '',
      Accountant: this.draft.seller.accountant || '',
      BranchCode: this.draft.seller.branchCode || '',
      BranchName: this.draft.seller.branchName || ''
    };

    // Transform buyer
    const buyer = {
      Name: this.draft.buyer.name,
      Address: this.draft.buyer.address,
      BankAccount: this.draft.buyer.account,
      BankId: this.draft.buyer.bankId,
      Director: this.draft.buyer.director || '',
      Accountant: this.draft.buyer.accountant || '',
      BranchCode: this.draft.buyer.branchCode || '',
      BranchName: this.draft.buyer.branchName || ''
    };

    // Transform products with auto-increment OrdNo
    const products = this.draft.products.map((product, index) => ({
      OrdNo: index + 1,
      CatalogCode: product.catalogCode,
      CatalogName: product.catalogName || '',
      Name: product.name,
      MeasureId: product.measureId,
      Count: String(product.count) // Convert to string
    }));

    // Build API payload
    const apiPayload: ApiEmpowermentPayload = {
      EmpowermentDoc: {
        EmpowermentNo: this.draft.empowerment.no,
        EmpowermentDateOfIssue: this.draft.empowerment.issueDate,
        EmpowermentDateOfExpire: this.draft.empowerment.expireDate
      },
      ContractDoc: contractDoc,
      Agent: {
        JobTitle: this.draft.agent.jobTitle || null,
        Fio: this.draft.agent.fio,
        Passport: agentPassport,
        AgentTin: this.draft.agent.pinfl
      },
      SellerTin: this.draft.seller.tin,
      Seller: seller,
      BuyerTin: this.draft.buyer.tin,
      Buyer: buyer,
      ProductList: {
        Tin: this.draft.seller.tin, // ProductList.Tin = SellerTin
        HasExcise: false,
        HasVat: false,
        Products: products
      }
    };

    // Deep merge: first apply apiPayload, then merge with any raw() data
    const basePayload = super.build(); // Get any raw() data applied earlier
    return this.deepMerge(apiPayload, basePayload) as ApiEmpowermentPayload & Record<string, any>;
  }

  /**
   * Deep merge helper for combining API payload with raw data
   * 
   * @private
   */
  private deepMerge(target: any, source: any): any {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] instanceof Object && key in target && target[key] instanceof Object) {
        result[key] = this.deepMerge(target[key], source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }
}

/**
 * Factory function for creating a new EmpowermentBuilder instance
 *
 * @returns A new EmpowermentBuilder instance ready for method chaining
 *
 * @example
 * ```typescript
 * const empowerment = empowerment()
 *   .empowerment('EMP-001', '2025-02-07', '2025-02-14')
 *   .agent({ fio: 'Agent Name', pinfl: '12345678901234' })
 *   .seller({ tin: '123456789', name: 'Seller', ... })
 *   .buyer({ tin: '987654321', name: 'Buyer', ... })
 *   .addProduct({ name: 'Product', catalogCode: '...', measureId: '1', count: 10 })
 *   .build();
 * ```
 */
export function empowerment(): EmpowermentBuilder {
  return new EmpowermentBuilder();
}
