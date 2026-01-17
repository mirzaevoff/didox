import { BaseDocumentBuilder, DocumentBuilderFactory } from './base/BaseDocumentBuilder.js';

/**
 * DX-friendly Act Draft interface
 * 
 * Developer-friendly structure for building act documents.
 * This gets transformed to Didox API JSON format in build().
 */
export interface ActDraft {
  /** Act document information */
  act: {
    no: string;
    date: string;
    text?: string;
  };

  /** Optional contract reference */
  contract?: {
    no: string;
    date: string;
  };

  /** Seller (performer) organization details */
  seller: {
    tin: string;
    name: string;
    branchCode?: string;
    branchName?: string;
  };

  /** Buyer (customer) organization details */
  buyer: {
    tin: string;
    name: string;
    branchCode?: string;
    branchName?: string;
  };

  /** List of products/services/works */
  products: ActProductDraft[];

  /** Optional act flags */
  flags?: {
    hasVat?: boolean;
    hasExcise?: boolean;
  };
}

/**
 * DX-friendly Product Draft interface
 * 
 * Simple structure for adding products/services to acts.
 */
export interface ActProductDraft {
  /** Product/service name */
  name: string;
  /** Product catalog code */
  catalogCode: string;
  /** Product catalog name */
  catalogName: string;
  /** Package code */
  packageCode: string;
  /** Package name */
  packageName: string;
  /** Count/quantity */
  count: number;
  /** Unit price */
  price: number;
  /** VAT rate (optional) */
  vatRate?: number;
  /** Without VAT flag (optional) */
  withoutVat?: boolean;
  /** Benefit name (optional) */
  lgotaName?: string;
  /** Benefit type (optional) */
  lgotaType?: 1 | 2;
}

/**
 * API Act Payload interface
 * 
 * Exact structure expected by Didox API for act documents (docType: '005').
 */
export interface ApiActPayload {
  ActDoc: {
    ActNo: string;
    ActDate: string;
    ActText?: string;
  };
  ContractDoc?: {
    ContractNo: string;
    ContractDate: string;
  };
  SellerTin: string;
  ProductList: {
    Tin: string;
    HasExcise: boolean;
    HasVat: boolean;
    Products: {
      OrdNo: number;
      CatalogCode: string;
      CatalogName: string;
      Name: string;
      MeasureId: null;
      PackageCode: string;
      PackageName: string;
      Count: string;
      Summa: string;
      TotalSumWithoutVat: string;
      VatRate: string;
      VatSum: string;
      TotalSum: string;
      WithoutVat: boolean;
      LgotaName: string | null;
      LgotaType: number | null;
    }[];
  };
  SellerName: string;
  SellerBranchCode: string;
  SellerBranchName: string;
  BuyerTin: string;
  BuyerName: string;
  BuyerBranchCode: string;
  BuyerBranchName: string;
}

/**
 * Act Document Builder (Production)
 * 
 * DX-friendly builder for creating act documents (docType: '005').
 * Provides fluent, chainable API that transforms to exact Didox API JSON format.
 * 
 * @example
 * ```typescript
 * const payload = builders.act()
 *   .act('ACT-001', '2025-02-07', 'Акт выполненных работ')
 *   .contract('CNT-1', '2025-01-01')
 *   .seller({ tin: '123456789', name: 'ООО Исполнитель' })
 *   .buyer({ tin: '987654321', name: 'ООО Заказчик' })
 *   .addProduct({ name: 'Услуга', catalogCode: 'SRV001', count: 1, price: 100000, ... })
 *   .flags({ hasVat: true })
 *   .build();
 * 
 * // Use with createDraft
 * await client.documents.createDraft('005', payload);
 * ```
 */
class ActBuilder extends BaseDocumentBuilder<ActDraft> {
  /**
   * Set act document information
   * 
   * @param no - Act number
   * @param date - Act date (YYYY-MM-DD format)
   * @param text - Optional act text description
   * @returns Builder instance for chaining
   * 
   * @example
   * ```typescript
   * builder.act('ACT-2025-001', '2025-02-07', 'Акт выполненных работ по договору')
   * ```
   */
  act(no: string, date: string, text?: string): this {
    if (!this.payload.act) {
      this.payload.act = { no: '', date: '' };
    }
    this.payload.act.no = no;
    this.payload.act.date = date;
    if (text !== undefined) {
      this.payload.act.text = text;
    }
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
   * Set seller (performer) organization details
   * 
   * @param data - Seller organization information
   * @returns Builder instance for chaining
   * 
   * @example
   * ```typescript
   * builder.seller({
   *   tin: '123456789',
   *   name: 'ООО «Исполнитель работ»',
   *   branchCode: 'BR001',
   *   branchName: 'Главный офис'
   * })
   * ```
   */
  seller(data: ActDraft['seller']): this {
    this.payload.seller = data;
    return this;
  }

  /**
   * Set buyer (customer) organization details
   * 
   * @param data - Buyer organization information
   * @returns Builder instance for chaining
   * 
   * @example
   * ```typescript
   * builder.buyer({
   *   tin: '987654321',
   *   name: 'ООО «Заказчик услуг»',
   *   branchCode: 'BR002',
   *   branchName: 'Филиал'
   * })
   * ```
   */
  buyer(data: ActDraft['buyer']): this {
    this.payload.buyer = data;
    return this;
  }

  /**
   * Add a single product/service to the act
   * 
   * @param product - Product/service information
   * @returns Builder instance for chaining
   * 
   * @example
   * ```typescript
   * builder.addProduct({
   *   name: 'Консультационные услуги',
   *   catalogCode: '08471001001000000',
   *   catalogName: 'Консультация',
   *   packageCode: '1501886',
   *   packageName: 'шт.',
   *   count: 10,
   *   price: 50000,
   *   vatRate: 12
   * })
   * ```
   */
  addProduct(product: ActProductDraft): this {
    if (!this.payload.products) {
      this.payload.products = [];
    }
    this.payload.products.push(product);
    return this;
  }

  /**
   * Add multiple products/services to the act
   * 
   * @param products - Array of products/services
   * @returns Builder instance for chaining
   * 
   * @example
   * ```typescript
   * builder.addProducts([
   *   { name: 'Услуга №1', count: 5, price: 10000, ... },
   *   { name: 'Услуга №2', count: 3, price: 20000, ... }
   * ])
   * ```
   */
  addProducts(products: ActProductDraft[]): this {
    if (!this.payload.products) {
      this.payload.products = [];
    }
    this.payload.products.push(...products);
    return this;
  }

  /**
   * Set act flags (optional)
   * 
   * @param flags - Act processing flags
   * @returns Builder instance for chaining
   * 
   * @example
   * ```typescript
   * builder.flags({
   *   hasVat: true,
   *   hasExcise: false
   * })
   * ```
   */
  flags(flags: NonNullable<ActDraft['flags']>): this {
    this.payload.flags = flags;
    return this;
  }

  /**
   * Build and transform to API payload
   * 
   * Overrides BaseDocumentBuilder.build() to return API format instead of DX format.
   * Validates required fields and transforms DX structure to Didox API JSON format.
   * 
   * @returns API-compatible act payload ready for createDraft()
   * @throws Error if required fields are missing
   * 
   * @example
   * ```typescript
   * const apiPayload = builder.build();
   * await client.documents.createDraft('005', apiPayload);
   * ```
   */
  build(): any {
    // Validate required fields
    if (!this.payload.act) {
      throw new Error('Act document information is required');
    }
    if (!this.payload.seller) {
      throw new Error('Seller information is required');
    }
    if (!this.payload.buyer) {
      throw new Error('Buyer information is required');
    }
    if (!this.payload.products || this.payload.products.length === 0) {
      throw new Error('At least one product/service is required');
    }

    const flags = this.payload.flags || {};

    // Transform DX structure to API structure
    const apiPayload: ApiActPayload = {
      ActDoc: {
        ActNo: this.payload.act.no,
        ActDate: this.payload.act.date,
        ...(this.payload.act.text && { ActText: this.payload.act.text }),
      },
      SellerTin: this.payload.seller.tin,
      ProductList: {
        Tin: this.payload.seller.tin,
        HasVat: flags.hasVat ?? false,
        HasExcise: flags.hasExcise ?? false,
        Products: this.payload.products.map((product, index) => {
          const totalSumWithoutVat = product.count * product.price;
          const vatRate = product.vatRate ?? 0;
          const vatSum = flags.hasVat && vatRate > 0 ? (totalSumWithoutVat * vatRate) / 100 : 0;
          const totalSum = totalSumWithoutVat + vatSum;

          return {
            OrdNo: index + 1,
            CatalogCode: product.catalogCode,
            CatalogName: product.catalogName,
            Name: product.name,
            MeasureId: null,
            PackageCode: product.packageCode,
            PackageName: product.packageName,
            Count: product.count.toString(),
            Summa: totalSum.toString(),
            TotalSumWithoutVat: totalSumWithoutVat.toFixed(2),
            VatRate: vatRate.toString(),
            VatSum: vatSum.toFixed(2),
            TotalSum: totalSum.toFixed(2),
            WithoutVat: product.withoutVat ?? !flags.hasVat,
            LgotaName: product.lgotaName ?? null,
            LgotaType: product.lgotaType ?? null,
          };
        }),
      },
      SellerName: this.payload.seller.name,
      SellerBranchCode: this.payload.seller.branchCode ?? '',
      SellerBranchName: this.payload.seller.branchName ?? '',
      BuyerTin: this.payload.buyer.tin,
      BuyerName: this.payload.buyer.name,
      BuyerBranchCode: this.payload.buyer.branchCode ?? '',
      BuyerBranchName: this.payload.buyer.branchName ?? '',
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
   * @returns DX-friendly act draft
   */
  getDraft(): ActDraft {
    return this.payload as ActDraft;
  }
}

/**
 * Creates a new act document builder
 * 
 * @returns Act builder instance ready for chaining
 * 
 * @example
 * ```typescript
 * const act = builders.act()
 *   .act('ACT-001', '2025-02-07', 'Акт выполненных работ')
 *   .seller({ tin: '123456789', name: 'ООО Исполнитель' })
 *   .buyer({ tin: '987654321', name: 'ООО Заказчик' })
 *   .addProduct({ name: 'Услуга', count: 1, price: 100000, ... })
 *   .build();
 * 
 * await client.documents.createDraft('005', act);
 * ```
 */
export const act: DocumentBuilderFactory<ActDraft> = () => new ActBuilder();

// Export types separately to avoid conflicts
export type { ActDraft as ActDraftType };
export type { ActProductDraft as ActProductDraftType };
export type { ApiActPayload as ApiActPayloadType };