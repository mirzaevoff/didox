import { BaseDocumentBuilder, DocumentBuilderFactory } from './base/BaseDocumentBuilder.js';
import { DidoxValidationError } from '../../../http/errors.js';

/**
 * DX-friendly ArbitraryDocument Draft interface
 * 
 * Developer-friendly structure for building arbitrary documents.
 * This gets transformed to Didox API JSON format in build().
 */
export interface ArbitraryDocumentDraft {
  /** Document information */
  document: {
    /** Document number */
    no: string;
    /** Document date (YYYY-MM-DD format) */
    date: string;
    /** Optional document name/title */
    name?: string;
  };

  /** Subtype of arbitrary document */
  subtype: number;

  /** Optional contract reference */
  contract?: {
    /** Contract number */
    no: string;
    /** Contract date (YYYY-MM-DD format) */
    date: string;
  };

  /** Seller (document issuer) organization details */
  seller: {
    /** Tax Identification Number (exactly 9 digits) */
    tin: string;
    /** Company name */
    name: string;
    /** Company address */
    address: string;
    /** Optional branch code */
    branchCode?: string;
    /** Optional branch name */
    branchName?: string;
  };

  /** Buyer (document recipient) organization details */
  buyer: {
    /** Tax Identification Number (exactly 9 digits) */
    tin: string;
    /** Company name */
    name: string;
    /** Company address */
    address: string;
    /** Optional branch code */
    branchCode?: string;
    /** Optional branch name */
    branchName?: string;
  };

  /** PDF document in base64 format */
  pdfBase64: string;
}

/**
 * API payload for Arbitrary Document (doctype 000)
 * 
 * This interface represents the exact JSON structure required by the Didox API
 * for arbitrary documents. The builder's build() method transforms the DX-friendly
 * ArbitraryDocumentDraft into this format.
 */
export interface ApiArbitraryDocumentPayload {
  /** Document data structure */
  data: {
    /** Document information */
    Document: {
      /** Document number */
      DocumentNo: string;
      /** Document date in YYYY-MM-DD format */
      DocumentDate: string;
      /** Document name/title */
      DocumentName?: string;
    };

    /** Document subtype */
    Subtype: number;

    /** Optional contract information */
    ContractDoc?: {
      /** Contract number */
      ContractNo: string;
      /** Contract date in YYYY-MM-DD format */
      ContractDate: string;
    };

    /** Seller TIN */
    SellerTin: string;

    /** Seller information */
    Seller: {
      /** Company name */
      Name: string;
      /** Branch code (empty string if not provided) */
      BranchCode: string;
      /** Branch name (empty string if not provided) */
      BranchName: string;
      /** Company address */
      Address: string;
    };

    /** Buyer TIN */
    BuyerTin: string;

    /** Buyer information */
    Buyer: {
      /** Company name */
      Name: string;
      /** Branch code (empty string if not provided) */
      BranchCode: string;
      /** Branch name (empty string if not provided) */
      BranchName: string;
      /** Company address */
      Address: string;
    };
  };

  /** PDF document in base64 data URL format */
  document: string;
}

/**
 * DX-friendly builder for Arbitrary Documents (doctype 000)
 * 
 * Provides a fluent API for creating arbitrary PDF documents in Didox.
 * These are arbitrary PDF documents (≤ 10 MB) for internal EDO use
 * that don't sync with roaming or other operators.
 * 
 * @example
 * ```typescript
 * const doc = builders.arbitrary()
 *   .document('DOC-001', '2025-02-07', 'Коммерческое письмо')
 *   .subtype(6) // "Другое"
 *   .contract('CNT-1', '2025-01-01') // optional
 *   .seller({
 *     tin: '310529901',
 *     name: '"DIDOX TECH" MCHJ',
 *     address: 'г. Ташкент, ...'
 *   })
 *   .buyer({
 *     tin: '302936161',
 *     name: '"VENKON GROUP" MCHJ',
 *     address: 'г. Ташкент, ...'
 *   })
 *   .pdf(base64PdfString)
 *   .build();
 * ```
 */
export class ArbitraryDocumentBuilder extends BaseDocumentBuilder<ApiArbitraryDocumentPayload> {
  /**
   * Internal DX-friendly payload for development
   * 
   * @private
   */
  private dxPayload: Partial<ArbitraryDocumentDraft> = {};

  /**
   * Set document information
   * 
   * @param no - Document number (required)
   * @param date - Document date in YYYY-MM-DD format (required)
   * @param name - Optional document name/title
   * @returns This builder instance for chaining
   * 
   * @example
   * ```typescript
   * builder.document('DOC-001', '2025-02-07', 'Коммерческое письмо');
   * ```
   */
  public document(no: string, date: string, name?: string): this {
    this.dxPayload.document = { 
      no, 
      date, 
      ...(name !== undefined && { name })
    };
    return this;
  }

  /**
   * Set document subtype
   * 
   * @param value - Document subtype number
   * @returns This builder instance for chaining
   * 
   * @example
   * ```typescript
   * builder.subtype(6); // "Другое"
   * ```
   */
  public subtype(value: number): this {
    this.dxPayload.subtype = value;
    return this;
  }

  /**
   * Set optional contract information
   * 
   * @param no - Contract number
   * @param date - Contract date in YYYY-MM-DD format
   * @returns This builder instance for chaining
   * 
   * @example
   * ```typescript
   * builder.contract('CNT-001', '2025-01-01');
   * ```
   */
  public contract(no: string, date: string): this {
    this.dxPayload.contract = { no, date };
    return this;
  }

  /**
   * Set seller (document issuer) organization information
   * 
   * @param data - Seller organization data
   * @returns This builder instance for chaining
   * 
   * @example
   * ```typescript
   * builder.seller({
   *   tin: '310529901',
   *   name: '"DIDOX TECH" MCHJ',
   *   address: 'г. Ташкент, ул. Амира Темура, 15',
   *   branchCode: 'MAIN', // optional
   *   branchName: 'Головной офис' // optional
   * });
   * ```
   */
  public seller(data: ArbitraryDocumentDraft['seller']): this {
    this.dxPayload.seller = data;
    return this;
  }

  /**
   * Set buyer (document recipient) organization information
   * 
   * @param data - Buyer organization data
   * @returns This builder instance for chaining
   * 
   * @example
   * ```typescript
   * builder.buyer({
   *   tin: '302936161',
   *   name: '"VENKON GROUP" MCHJ',
   *   address: 'г. Ташкент, Мирзо-Улугбекский район, ул. Университетская, 4'
   * });
   * ```
   */
  public buyer(data: ArbitraryDocumentDraft['buyer']): this {
    this.dxPayload.buyer = data;
    return this;
  }

  /**
   * Set PDF document content
   * 
   * @param base64 - PDF document encoded as base64 string
   * @returns This builder instance for chaining
   * 
   * @example
   * ```typescript
   * const pdfBuffer = fs.readFileSync('document.pdf');
   * const base64String = pdfBuffer.toString('base64');
   * builder.pdf(base64String);
   * ```
   */
  public pdf(base64: string): this {
    this.dxPayload.pdfBase64 = base64;
    return this;
  }

  /**
   * Build the final API payload
   * 
   * Transforms the DX-friendly draft into the exact JSON structure
   * required by the Didox API for arbitrary documents (doctype 000).
   * 
   * @returns Complete API payload ready for createDraft()
   * @throws {DidoxValidationError} When required fields are missing
   * 
   * @example
   * ```typescript
   * const doc = builder
   *   .document('DOC-001', '2025-02-07')
   *   .subtype(6)
   *   .seller({ tin: '310529901', name: 'Company', address: 'Address' })
   *   .buyer({ tin: '302936161', name: 'Buyer', address: 'Address' })
   *   .pdf(base64String)
   *   .build();
   * 
   * // Use with createDraft API
   * const result = await didox.documents.createDraft('000', doc);
   * ```
   */
  public build(): ApiArbitraryDocumentPayload {
    // Validate required fields
    this.validateRequiredFields();

    const payload: ApiArbitraryDocumentPayload = {
      data: {
        Document: {
          DocumentNo: this.dxPayload.document!.no,
          DocumentDate: this.dxPayload.document!.date,
        },
        Subtype: this.dxPayload.subtype!,
        SellerTin: this.dxPayload.seller!.tin,
        Seller: {
          Name: this.dxPayload.seller!.name,
          BranchCode: this.dxPayload.seller!.branchCode || '',
          BranchName: this.dxPayload.seller!.branchName || '',
          Address: this.dxPayload.seller!.address,
        },
        BuyerTin: this.dxPayload.buyer!.tin,
        Buyer: {
          Name: this.dxPayload.buyer!.name,
          BranchCode: this.dxPayload.buyer!.branchCode || '',
          BranchName: this.dxPayload.buyer!.branchName || '',
          Address: this.dxPayload.buyer!.address,
        },
      },
      document: `data:application/pdf;base64,${this.dxPayload.pdfBase64}`,
    };

    // Add optional document name
    if (this.dxPayload.document!.name) {
      payload.data.Document.DocumentName = this.dxPayload.document!.name;
    }

    // Add optional contract information
    if (this.dxPayload.contract) {
      payload.data.ContractDoc = {
        ContractNo: this.dxPayload.contract.no,
        ContractDate: this.dxPayload.contract.date,
      };
    }

    // Merge any raw data (escape hatch)
    return this.mergeRawData(payload);
  }

  /**
   * Validate required fields
   * 
   * @private
   * @throws {DidoxValidationError} When validation fails
   */
  private validateRequiredFields(): void {
    if (!this.dxPayload.document?.no) {
      throw new DidoxValidationError('Document number is required', 'document.no');
    }

    if (!this.dxPayload.document?.date) {
      throw new DidoxValidationError('Document date is required', 'document.date');
    }

    if (this.dxPayload.subtype === undefined) {
      throw new DidoxValidationError('Subtype is required', 'subtype');
    }

    if (!this.dxPayload.seller?.tin) {
      throw new DidoxValidationError('Seller TIN is required', 'seller.tin');
    }

    if (!this.dxPayload.buyer?.tin) {
      throw new DidoxValidationError('Buyer TIN is required', 'buyer.tin');
    }

    if (!this.dxPayload.pdfBase64) {
      throw new DidoxValidationError('PDF base64 data is required', 'pdfBase64');
    }
  }

  /**
   * Merge raw data with the built payload (escape hatch)
   * 
   * @private
   * @param payload - The built payload
   * @returns Payload with raw data merged
   */
  private mergeRawData(payload: ApiArbitraryDocumentPayload): ApiArbitraryDocumentPayload {
    if (Object.keys(this.payload).length > 0) {
      // Deep merge raw data into payload
      return {
        ...payload,
        ...this.payload,
        data: {
          ...payload.data,
          ...(this.payload as any).data,
        },
      };
    }
    return payload;
  }
}

/**
 * Creates a new arbitrary document builder
 * 
 * @param initial - Optional initial arbitrary document data
 * @returns Arbitrary document builder instance
 * 
 * @example
 * ```typescript
 * // Start with empty builder
 * const doc = builders.arbitrary()
 *   .document('DOC-001', '2025-02-07')
 *   .subtype(6)
 *   .seller({ tin: '123456789', name: 'Company', address: 'Address' })
 *   .buyer({ tin: '987654321', name: 'Buyer', address: 'Address' })
 *   .pdf(base64String)
 *   .build();
 * 
 * // Start with initial data
 * const doc = builders.arbitrary({
 *   data: {
 *     Document: {
 *       DocumentNo: 'EXISTING-DOC',
 *       DocumentDate: '2025-02-07'
 *     },
 *     Subtype: 1
 *   }
 * })
 *   .seller({ tin: '123456789', name: 'Company', address: 'Address' })
 *   .build();
 * ```
 */
export const arbitrary: DocumentBuilderFactory<ApiArbitraryDocumentPayload> = (initial?) => 
  new ArbitraryDocumentBuilder(initial);