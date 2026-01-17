import { BaseDocumentBuilder, DocumentBuilderFactory } from './base/BaseDocumentBuilder.js';

/**
 * DX-friendly Invoice Draft interface
 * 
 * Developer-friendly structure for building invoices.
 * This gets transformed to Didox API JSON format in build().
 */
export interface InvoiceDraft {
  /** Invoice document information */
  factura: {
    no: string;
    date: string;
  };

  /** Optional contract reference */
  contract?: {
    no: string;
    date: string;
  };

  /** Seller organization details */
  seller: {
    tin: string;
    name: string;
    vatRegCode: string;
    account: string;
    bankId: string;
    address: string;
  };

  /** Buyer organization details */
  buyer: {
    tin: string;
    name: string;
    vatRegCode: string;
    account: string;
    bankId: string;
    address: string;
  };

  /** List of products/services */
  products: InvoiceProductDraft[];

  /** Optional invoice flags */
  flags?: {
    hasVat?: boolean;
    hasExcise?: boolean;
    hasLgota?: boolean;
    hasCommittent?: boolean;
  };
}

/**
 * DX-friendly Product Draft interface
 * 
 * Simple structure for adding products to invoices.
 */
export interface InvoiceProductDraft {
  /** Product name */
  name: string;
  /** Product catalog code */
  catalogCode: string;
  /** Optional catalog name */
  catalogName?: string;
  /** Package code */
  packageCode: string;
  /** Package name */
  packageName: string;
  /** Quantity */
  quantity: number;
  /** Unit price */
  price: number;
  /** VAT rate (optional) */
  vatRate?: number;
  /** Origin code */
  origin: number;
}

/**
 * API Invoice Payload interface
 * 
 * Exact structure expected by Didox API for invoice documents (docType: '002').
 */
export interface ApiInvoicePayload {
  Version: number;
  FacturaType: number;
  FacturaDoc: {
    FacturaNo: string;
    FacturaDate: string;
  };
  ContractDoc?: {
    ContractNo: string;
    ContractDate: string;
  };
  SellerTin: string;
  Seller: {
    Name: string;
    VatRegCode: string;
    Account: string;
    BankId: string;
    Address: string;
  };
  BuyerTin: string;
  Buyer: {
    Name: string;
    VatRegCode: string;
    Account: string;
    BankId: string;
    Address: string;
  };
  ProductList: {
    Tin: string;
    HasVat: boolean;
    HasExcise: boolean;
    HasLgota: boolean;
    HasCommittent: boolean;
    Products: {
      OrdNo: number;
      Name: string;
      CatalogCode: string;
      PackageCode: string;
      PackageName: string;
      Count: number;
      Summa: number;
      DeliverySum: number;
      VatRate: number;
      VatSum: number;
      DeliverySumWithVat: number;
      WithoutVat: boolean;
      Origin: number;
    }[];
  };
}

/**
 * Invoice Document Builder (Production)
 * 
 * DX-friendly builder for creating invoice documents (docType: '002').
 * Provides fluent, chainable API that transforms to exact Didox API JSON format.
 * 
 * @example
 * ```typescript
 * const payload = builders.invoice()
 *   .factura('INV-001', '2025-02-07')
 *   .contract('CNT-1', '2025-01-01')
 *   .seller({ tin: '123456789', name: 'ООО Компания', ... })
 *   .buyer({ tin: '987654321', name: 'ООО Клиент', ... })
 *   .addProduct({ name: 'Товар', quantity: 10, price: 100, ... })
 *   .flags({ hasVat: true })
 *   .build(); // Returns API JSON
 * 
 * // Use with createDraft
 * await client.documents.createDraft('002', payload);
 * ```
 */
class InvoiceBuilder extends BaseDocumentBuilder<InvoiceDraft> {
  /**
   * Set invoice document information
   * 
   * @param no - Invoice number
   * @param date - Invoice date (YYYY-MM-DD format)
   * @returns Builder instance for chaining
   * 
   * @example
   * ```typescript
   * builder.factura('INV-2025-001', '2025-02-07')
   * ```
   */
  factura(no: string, date: string): this {
    if (!this.payload.factura) {
      this.payload.factura = { no: '', date: '' };
    }
    this.payload.factura.no = no;
    this.payload.factura.date = date;
    return this;
  }

  /**
   * Set contract reference (optional)
   * 
   * @param no - Contract number
   * @param date - Contract date (YYYY-MM-DD format)
   * @returns Builder instance for chaining
   * 
   * @example
   * ```typescript
   * builder.contract('CNT-2025-001', '2025-01-15')
   * ```
   */
  contract(no: string, date: string): this {
    this.payload.contract = { no, date };
    return this;
  }

  /**
   * Set seller organization details
   * 
   * @param data - Seller organization information
   * @returns Builder instance for chaining
   * 
   * @example
   * ```typescript
   * builder.seller({
   *   tin: '123456789',
   *   name: 'ООО «Продавец»',
   *   vatRegCode: 'VAT123',
   *   account: '20208000000000001',
   *   bankId: '00014',
   *   address: 'г.Ташкент, ул.Примерная, д.1'
   * })
   * ```
   */
  seller(data: InvoiceDraft['seller']): this {
    this.payload.seller = data;
    return this;
  }

  /**
   * Set buyer organization details
   * 
   * @param data - Buyer organization information
   * @returns Builder instance for chaining
   * 
   * @example
   * ```typescript
   * builder.buyer({
   *   tin: '987654321',
   *   name: 'ООО «Покупатель»',
   *   vatRegCode: 'VAT456',
   *   account: '20208000000000002',
   *   bankId: '00014',
   *   address: 'г.Ташкент, ул.Другая, д.2'
   * })
   * ```
   */
  buyer(data: InvoiceDraft['buyer']): this {
    this.payload.buyer = data;
    return this;
  }

  /**
   * Add a single product to the invoice
   * 
   * @param product - Product information
   * @returns Builder instance for chaining
   * 
   * @example
   * ```typescript
   * builder.addProduct({
   *   name: 'Товар №1',
   *   catalogCode: 'PROD001',
   *   packageCode: 'PCK001',
   *   packageName: 'штука',
   *   quantity: 10,
   *   price: 15000,
   *   vatRate: 12,
   *   origin: 1
   * })
   * ```
   */
  addProduct(product: InvoiceProductDraft): this {
    if (!this.payload.products) {
      this.payload.products = [];
    }
    this.payload.products.push(product);
    return this;
  }

  /**
   * Add multiple products to the invoice
   * 
   * @param products - Array of products
   * @returns Builder instance for chaining
   * 
   * @example
   * ```typescript
   * builder.addProducts([
   *   { name: 'Товар №1', quantity: 5, price: 10000, ... },
   *   { name: 'Товар №2', quantity: 3, price: 20000, ... }
   * ])
   * ```
   */
  addProducts(products: InvoiceProductDraft[]): this {
    if (!this.payload.products) {
      this.payload.products = [];
    }
    this.payload.products.push(...products);
    return this;
  }

  /**
   * Set invoice flags (optional)
   * 
   * @param flags - Invoice processing flags
   * @returns Builder instance for chaining
   * 
   * @example
   * ```typescript
   * builder.flags({
   *   hasVat: true,
   *   hasExcise: false,
   *   hasLgota: false,
   *   hasCommittent: false
   * })
   * ```
   */
  flags(flags: NonNullable<InvoiceDraft['flags']>): this {
    this.payload.flags = flags;
    return this;
  }

  /**
   * Build and transform to API payload
   * 
   * Overrides BaseDocumentBuilder.build() to return API format instead of DX format.
   * Validates required fields and transforms DX structure to Didox API JSON format.
   * 
   * @returns API-compatible invoice payload ready for createDraft()
   * @throws Error if required fields are missing
   * 
   * @example
   * ```typescript
   * const apiPayload = builder.build();
   * await client.documents.createDraft('002', apiPayload);
   * ```
   */
  build(): any {
    // Validate required fields
    if (!this.payload.factura) {
      throw new Error('Invoice factura information is required');
    }
    if (!this.payload.seller) {
      throw new Error('Seller information is required');
    }
    if (!this.payload.buyer) {
      throw new Error('Buyer information is required');
    }
    if (!this.payload.products || this.payload.products.length === 0) {
      throw new Error('At least one product is required');
    }

    const flags = this.payload.flags || {};

    // Transform DX structure to API structure
    const apiPayload: ApiInvoicePayload = {
      Version: 1,
      FacturaType: 0,
      FacturaDoc: {
        FacturaNo: this.payload.factura.no,
        FacturaDate: this.payload.factura.date,
      },
      SellerTin: this.payload.seller.tin,
      Seller: {
        Name: this.payload.seller.name,
        VatRegCode: this.payload.seller.vatRegCode,
        Account: this.payload.seller.account,
        BankId: this.payload.seller.bankId,
        Address: this.payload.seller.address,
      },
      BuyerTin: this.payload.buyer.tin,
      Buyer: {
        Name: this.payload.buyer.name,
        VatRegCode: this.payload.buyer.vatRegCode,
        Account: this.payload.buyer.account,
        BankId: this.payload.buyer.bankId,
        Address: this.payload.buyer.address,
      },
      ProductList: {
        Tin: this.payload.seller.tin,
        HasVat: flags.hasVat ?? false,
        HasExcise: flags.hasExcise ?? false,
        HasLgota: flags.hasLgota ?? false,
        HasCommittent: flags.hasCommittent ?? false,
        Products: this.payload.products.map((product, index) => {
          const deliverySum = product.quantity * product.price;
          const vatRate = product.vatRate ?? 0;
          const vatSum = flags.hasVat && vatRate > 0 ? (deliverySum * vatRate) / 100 : 0;
          const deliverySumWithVat = deliverySum + vatSum;

          return {
            OrdNo: index + 1,
            Name: product.name,
            CatalogCode: product.catalogCode,
            PackageCode: product.packageCode,
            PackageName: product.packageName,
            Count: product.quantity,
            Summa: deliverySumWithVat,
            DeliverySum: deliverySum,
            VatRate: vatRate,
            VatSum: vatSum,
            DeliverySumWithVat: deliverySumWithVat,
            WithoutVat: !flags.hasVat,
            Origin: product.origin,
          };
        }),
      },
    };

    // Add optional contract
    if (this.payload.contract) {
      apiPayload.ContractDoc = {
        ContractNo: this.payload.contract.no,
        ContractDate: this.payload.contract.date,
      };
    }

    return apiPayload;
  }

  /**
   * Get DX-friendly draft payload (for debugging/testing)
   * 
   * @returns DX-friendly invoice draft
   */
  getDraft(): InvoiceDraft {
    return this.payload as InvoiceDraft;
  }
}

/**
 * Creates a new invoice document builder
 * 
 * @returns Invoice builder instance ready for chaining
 * 
 * @example
 * ```typescript
 * const invoice = builders.invoice()
 *   .factura('INV-001', '2025-02-07')
 *   .seller({ tin: '123456789', ... })
 *   .buyer({ tin: '987654321', ... })
 *   .addProduct({ name: 'Product', quantity: 1, price: 1000, ... })
 *   .build();
 * 
 * await client.documents.createDraft('002', invoice);
 * ```
 */
export const invoice: DocumentBuilderFactory<InvoiceDraft> = () => new InvoiceBuilder();

// Export types separately to avoid conflicts
export type { InvoiceDraft as InvoiceDraftType };
export type { InvoiceProductDraft as InvoiceProductDraftType };
export type { ApiInvoicePayload as ApiInvoicePayloadType };