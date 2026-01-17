import { BaseDocumentBuilder, DocumentBuilderFactory } from './base/BaseDocumentBuilder.js';
import { DidoxValidationError } from '../../../http/errors.js';

/**
 * DX-friendly MultiPartyDocument Draft interface
 * 
 * Developer-friendly structure for building multi-party arbitrary documents.
 * This gets transformed to Didox API JSON format in build().
 */
export interface MultiPartyDocumentDraft {
  /** Document information */
  document: {
    /** Document number */
    no: string;
    /** Document date (YYYY-MM-DD format) */
    date: string;
    /** Optional document name/title */
    name?: string;
  };

  /** Optional contract reference */
  contract?: {
    /** Contract number */
    no: string;
    /** Contract date (YYYY-MM-DD format) */
    date: string;
  };

  /** Document owner organization details */
  owner: {
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

  /** Array of client organizations (minimum 1 required) */
  clients: Array<{
    /** Tax Identification Number (exactly 9 digits) */
    tin: string;
    /** Company name */
    name: string;
    /** Company address */
    address: string;
  }>;

  /** PDF document in base64 format */
  pdfBase64: string;
}

/**
 * API payload for Multi-Party Arbitrary Document (doctype 010)
 * 
 * This interface represents the exact JSON structure required by the Didox API
 * for multi-party arbitrary documents. The builder's build() method transforms 
 * the DX-friendly MultiPartyDocumentDraft into this format.
 */
export interface ApiMultiPartyDocumentPayload {
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

    /** Optional contract information */
    ContractDoc?: {
      /** Contract number */
      ContractNo: string;
      /** Contract date in YYYY-MM-DD format */
      ContractDate: string;
    };

    /** Owner organization information */
    Owner: {
      /** Owner TIN */
      Tin: string;
      /** Company name */
      Name: string;
      /** Branch code (empty string if not provided) */
      BranchCode: string;
      /** Branch name (empty string if not provided) */
      BranchName: string;
      /** Company address */
      Address: string;
    };

    /** Array of client organizations */
    Clients: Array<{
      /** Client TIN */
      Tin: string;
      /** Company name */
      Name: string;
      /** Company address */
      Address: string;
    }>;
  };

  /** PDF document in base64 data URL format */
  document: string;
}

/**
 * DX-friendly builder for Multi-Party Arbitrary Documents (doctype 010)
 * 
 * Provides a fluent API for creating multi-party arbitrary PDF documents in Didox.
 * These are internal EDO documents supporting 1 owner + N clients that don't sync
 * with roaming or other operators.
 * 
 * @example
 * ```typescript
 * const doc = builders.multiParty()
 *   .document('MULTI-001', '2025-02-07', 'Многостороннее соглашение')
 *   .contract('CONTRACT-001', '2025-01-15')
 *   .owner({
 *     tin: '310529901',
 *     name: '"DIDOX TECH" MCHJ',
 *     address: 'г. Ташкент, ул. Амира Темура, 15'
 *   })
 *   .addClient({
 *     tin: '302936161',
 *     name: '"VENKON GROUP" MCHJ',
 *     address: 'г. Ташкент, ул. Университетская, 4'
 *   })
 *   .addClient({
 *     tin: '123456789',
 *     name: '"PARTNER CORP" MCHJ',
 *     address: 'г. Самарканд, ул. Регистан, 1'
 *   })
 *   .pdf(base64PdfString)
 *   .build();
 * ```
 */
export class MultiPartyDocumentBuilder extends BaseDocumentBuilder<ApiMultiPartyDocumentPayload> {
  /**
   * Internal DX-friendly payload for development
   * 
   * @private
   */
  private dxPayload: Partial<MultiPartyDocumentDraft> = {};

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
   * builder.document('MULTI-001', '2025-02-07', 'Многостороннее соглашение');
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
   * Set optional contract information
   * 
   * @param no - Contract number
   * @param date - Contract date in YYYY-MM-DD format
   * @returns This builder instance for chaining
   * 
   * @example
   * ```typescript
   * builder.contract('CONTRACT-2025-001', '2025-01-15');
   * ```
   */
  public contract(no: string, date: string): this {
    this.dxPayload.contract = { no, date };
    return this;
  }

  /**
   * Set owner (main party) organization information
   * 
   * @param data - Owner organization data
   * @returns This builder instance for chaining
   * 
   * @example
   * ```typescript
   * builder.owner({
   *   tin: '310529901',
   *   name: '"DIDOX TECH" MCHJ',
   *   address: 'г. Ташкент, ул. Амира Темура, 15',
   *   branchCode: 'HQ', // optional
   *   branchName: 'Головной офис' // optional
   * });
   * ```
   */
  public owner(data: MultiPartyDocumentDraft['owner']): this {
    this.dxPayload.owner = data;
    return this;
  }

  /**
   * Add a single client organization
   * 
   * @param data - Client organization data
   * @returns This builder instance for chaining
   * 
   * @example
   * ```typescript
   * builder
   *   .addClient({
   *     tin: '302936161',
   *     name: '"VENKON GROUP" MCHJ',
   *     address: 'г. Ташкент, ул. Университетская, 4'
   *   })
   *   .addClient({
   *     tin: '123456789',
   *     name: '"PARTNER CORP" MCHJ',
   *     address: 'г. Самарканд, ул. Регистан, 1'
   *   });
   * ```
   */
  public addClient(data: MultiPartyDocumentDraft['clients'][0]): this {
    if (!this.dxPayload.clients) {
      this.dxPayload.clients = [];
    }
    this.dxPayload.clients.push(data);
    return this;
  }

  /**
   * Add multiple client organizations at once
   * 
   * @param clients - Array of client organization data
   * @returns This builder instance for chaining
   * 
   * @example
   * ```typescript
   * builder.addClients([
   *   {
   *     tin: '302936161',
   *     name: '"VENKON GROUP" MCHJ',
   *     address: 'г. Ташкент, ул. Университетская, 4'
   *   },
   *   {
   *     tin: '123456789',
   *     name: '"PARTNER CORP" MCHJ',
   *     address: 'г. Самарканд, ул. Регистан, 1'
   *   }
   * ]);
   * ```
   */
  public addClients(clients: MultiPartyDocumentDraft['clients']): this {
    if (!this.dxPayload.clients) {
      this.dxPayload.clients = [];
    }
    this.dxPayload.clients.push(...clients);
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
   * const pdfBuffer = fs.readFileSync('multi-party-agreement.pdf');
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
   * required by the Didox API for multi-party arbitrary documents (doctype 010).
   * 
   * @returns Complete API payload ready for createDraft()
   * @throws {DidoxValidationError} When required fields are missing or invalid
   * 
   * @example
   * ```typescript
   * const doc = builder
   *   .document('MULTI-001', '2025-02-07')
   *   .owner({ tin: '310529901', name: 'Owner Company', address: 'Address' })
   *   .addClient({ tin: '302936161', name: 'Client Company', address: 'Address' })
   *   .pdf(base64String)
   *   .build();
   * 
   * // Use with createDraft API
   * const result = await didox.documents.createDraft('010', doc);
   * ```
   */
  public build(): ApiMultiPartyDocumentPayload {
    // Validate required fields
    this.validateRequiredFields();

    const payload: ApiMultiPartyDocumentPayload = {
      data: {
        Document: {
          DocumentNo: this.dxPayload.document!.no,
          DocumentDate: this.dxPayload.document!.date,
        },
        Owner: {
          Tin: this.dxPayload.owner!.tin,
          Name: this.dxPayload.owner!.name,
          BranchCode: this.dxPayload.owner!.branchCode || '',
          BranchName: this.dxPayload.owner!.branchName || '',
          Address: this.dxPayload.owner!.address,
        },
        Clients: this.dxPayload.clients!.map(client => ({
          Tin: client.tin,
          Name: client.name,
          Address: client.address,
        })),
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

    if (!this.dxPayload.owner?.tin) {
      throw new DidoxValidationError('Owner TIN is required', 'owner.tin');
    }

    if (!this.dxPayload.owner?.name) {
      throw new DidoxValidationError('Owner name is required', 'owner.name');
    }

    if (!this.dxPayload.owner?.address) {
      throw new DidoxValidationError('Owner address is required', 'owner.address');
    }

    if (!this.dxPayload.clients || this.dxPayload.clients.length === 0) {
      throw new DidoxValidationError('At least one client is required', 'clients');
    }

    // Validate each client
    this.dxPayload.clients.forEach((client, index) => {
      if (!client.tin) {
        throw new DidoxValidationError(`Client ${index + 1} TIN is required`, `clients[${index}].tin`);
      }
      if (!client.name) {
        throw new DidoxValidationError(`Client ${index + 1} name is required`, `clients[${index}].name`);
      }
      if (!client.address) {
        throw new DidoxValidationError(`Client ${index + 1} address is required`, `clients[${index}].address`);
      }
    });

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
  private mergeRawData(payload: ApiMultiPartyDocumentPayload): ApiMultiPartyDocumentPayload {
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
 * Creates a new multi-party arbitrary document builder
 * 
 * @param initial - Optional initial multi-party document data
 * @returns Multi-party document builder instance
 * 
 * @example
 * ```typescript
 * // Start with empty builder
 * const doc = builders.multiParty()
 *   .document('MULTI-001', '2025-02-07')
 *   .owner({ tin: '123456789', name: 'Owner', address: 'Address' })
 *   .addClient({ tin: '987654321', name: 'Client', address: 'Address' })
 *   .pdf(base64String)
 *   .build();
 * 
 * // Start with initial data
 * const doc = builders.multiParty({
 *   data: {
 *     Document: {
 *       DocumentNo: 'EXISTING-DOC',
 *       DocumentDate: '2025-02-07'
 *     },
 *     Owner: {
 *       Tin: '123456789',
 *       Name: 'Existing Owner',
 *       BranchCode: '',
 *       BranchName: '',
 *       Address: 'Existing Address'
 *     },
 *     Clients: []
 *   }
 * })
 *   .addClient({ tin: '987654321', name: 'Client', address: 'Address' })
 *   .build();
 * ```
 */
export const multiParty: DocumentBuilderFactory<ApiMultiPartyDocumentPayload> = (initial?) => 
  new MultiPartyDocumentBuilder(initial);