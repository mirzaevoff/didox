import type { HttpClient } from '../../http/httpClient.js';
import type {
  ListDocumentsParams,
  DocumentMetadata,
  DocumentStatistics,
  DocumentPrivileges,
  DocumentResponse,
  DocumentCreatePayload,
  DocumentsListResponse,
  NormalizedDocumentsListResponse,
  DocumentsStatisticsResponse,
  RawDocumentResponse,
  RawDocumentPrivilegesResponse
} from './documents.types.js';
import type { DocumentType } from './documents.enums.js';
import {
  validateListDocumentsParams,
  validateDocumentId,
  validateCreateDraftParams
} from './documents.validators.js';
import { normalizeDocumentsList } from '../../utils/normalizer.js';
import { builders } from './builders/index.js';

/**
 * Documents API client for Didox platform
 * 
 * Provides methods for managing electronic documents including invoices,
 * waybills, acts, and other document types supported by the Didox EDO platform.
 */
export class DocumentsClient {
  /**
   * Document builders for fluent document creation
   * 
   * Provides chainable, type-safe builders for all supported document types.
   * Each builder offers IDE-friendly methods for constructing valid document payloads.
   * 
   * @example
   * ```typescript
   * // Create invoice using builder
   * const payload = client.documents.builders.invoice()
   *   .raw({ FacturaType: 0 })
   *   .build();
   * 
   * await client.documents.createDraft('002', payload);
   * 
   * // Create TTN using builder
   * const ttnPayload = client.documents.builders.ttn()
   *   .raw({ transportInfo: { vehicleNumber: '01A123BC' } })
   *   .build();
   * 
   * await client.documents.createDraft('041', ttnPayload);
   * ```
   */
  public readonly builders = builders;

  constructor(private readonly httpClient: HttpClient) {}

  /**
   * Get paginated list of documents
   * 
   * Retrieves a filtered and paginated list of documents based on specified criteria.
   * Supports filtering by status, type, dates, partner, and other parameters.
   * 
   * @param params - Filtering and pagination parameters
   * @returns Promise resolving to paginated document list
   * 
   * @throws {DidoxValidationError} When parameters are invalid
   * @throws {DidoxAuthError} When authentication fails (401 status)
   * @throws {DidoxApiError} When API returns other error responses  
   * @throws {DidoxNetworkError} When network request fails
   * 
   * @example
   * ```typescript
   * try {
   *   const documents = await client.documents.list({
   *     owner: 1, // outgoing documents
   *     page: 1,
   *     limit: 20,
   *     status: [1, 2], // sent or signed
   *     dateFromCreated: '2024-01-01',
   *     dateToCreated: '2024-01-31'
   *   });
   *   
   *   console.log('Found documents:', documents.data.length);
   *   console.log('Total pages:', documents.meta.totalPages);
   * } catch (error) {
   *   if (error instanceof DidoxValidationError) {
   *     console.error('Invalid parameters:', error.message);
   *   }
   * }
   * ```
   */
  async list(params: ListDocumentsParams): Promise<DocumentsListResponse | NormalizedDocumentsListResponse> {
    // Validate parameters
    validateListDocumentsParams(params);
    
    // Build URL with query parameters
    const url = this.buildUrlWithParams('/v2/documents', params);
    
    // Make HTTP request
    const response = await this.httpClient.get<DocumentsListResponse>(url);
    
    // Handle output format
    if (params.output === 'normalized') {
      return normalizeDocumentsList(response.data);
    }
    
    return response.data;
  }

  /**
   * Get document statistics
   * 
   * Retrieves statistical information about documents matching the specified criteria.
   * Returns counts by status, type, and other aggregations.
   * 
   * @param params - Filtering parameters (same as list method)
   * @returns Promise resolving to document statistics
   * 
   * @throws {DidoxValidationError} When parameters are invalid
   * @throws {DidoxAuthError} When authentication fails (401 status)
   * @throws {DidoxApiError} When API returns other error responses
   * @throws {DidoxNetworkError} When network request fails
   * 
   * @example
   * ```typescript
   * try {
   *   const stats = await client.documents.statistics({
   *     owner: 1,
   *     page: 1,
   *     limit: 1, // Minimal page for stats
   *     dateFromCreated: '2024-01-01'
   *   });
   *   
   *   console.log('Total documents:', stats.total);
   *   console.log('By status:', stats.byStatus);
   *   console.log('By type:', stats.byType);
   * } catch (error) {
   *   console.error('Failed to get statistics:', error.message);
   * }
   * ```
   */
  async statistics(params: ListDocumentsParams): Promise<DocumentsStatisticsResponse> {
    // Validate parameters
    validateListDocumentsParams(params);
    
    // Build URL with query parameters (excluding output parameter)
    const { output, ...filteredParams } = params;
    const url = this.buildUrlWithParams('/v2/documents/statistics/all', filteredParams);
    
    // Make HTTP request
    const response = await this.httpClient.get<DocumentsStatisticsResponse>(url);
    
    return response.data;
  }

  /**
   * Get document by ID
   * 
   * Retrieves detailed information about a specific document by its unique identifier.
   * Returns raw Didox API response without any normalization or transformation.
   * 
   * @param id - Document unique identifier
   * @returns Promise resolving to raw document response from Didox API
   * 
   * @throws {DidoxValidationError} When document ID is invalid
   * @throws {DidoxAuthError} When authentication fails (401 status)
   * @throws {DidoxApiError} When API returns other error responses (e.g., 404 if document not found)
   * @throws {DidoxNetworkError} When network request fails
   * 
   * @example
   * ```typescript
   * try {
   *   const document = await client.documents.getById('11F092E3428D10C68F7B1E0008000075');
   *   
   *   // Raw Didox API response structure
   *   console.log('Document data:', document);
   *   // Note: Structure depends on document type and Didox API version
   * } catch (error) {
   *   if (error instanceof DidoxApiError && error.statusCode === 404) {
   *     console.error('Document not found');
   *   }
   * }
   * ```
   */
  async getById(id: string): Promise<RawDocumentResponse> {
    // Validate document ID
    validateDocumentId(id);
    
    // Make HTTP request to get document by ID
    const response = await this.httpClient.get<RawDocumentResponse>(`/v1/documents/${id}`);
    
    // Return raw response data without any transformation
    return response.data;
  }

  /**
   * Get document privileges
   * 
   * Retrieves user privileges for a specific document, indicating what actions
   * the current user can perform. Returns raw Didox API response without normalization.
   * 
   * @param id - Document unique identifier
   * @returns Promise resolving to raw document privileges response from Didox API
   * 
   * @throws {DidoxValidationError} When document ID is invalid
   * @throws {DidoxAuthError} When authentication fails (401 status)
   * @throws {DidoxApiError} When API returns other error responses
   * @throws {DidoxNetworkError} When network request fails
   * 
   * @example
   * ```typescript
   * try {
   *   const privileges = await client.documents.getPrivileges('11F092E3428D10C68F7B1E0008000075');
   *   
   *   // Raw Didox API response - structure may vary
   *   console.log('Privileges data:', privileges);
   *   
   *   // Example of potential structure (actual may differ):
   *   // {
   *   //   canView: true,
   *   //   canEdit: false,
   *   //   canSign: true,
   *   //   canCancel: false,
   *   //   canDelete: false,
   *   //   canDownload: true
   *   // }
   * } catch (error) {
   *   console.error('Failed to get privileges:', error.message);
   * }
   * ```
   */
  async getPrivileges(id: string): Promise<RawDocumentPrivilegesResponse> {
    // Validate document ID
    validateDocumentId(id);
    
    // Make HTTP request to get document privileges
    const response = await this.httpClient.get<RawDocumentPrivilegesResponse>(`/v1/documents/${id}/privileges`);
    
    // Return raw response data without any transformation
    return response.data;
  }

  /**
   * Create document draft
   * 
   * Creates a draft document in Didox system using the specified document type and payload.
   * This is a universal method that accepts any document structure without validation.
   * 
   * @param docType - Didox document type code (e.g. '002', '041', '075')
   * @param payload - Raw document JSON body according to Didox API specification
   * @param options - Additional options for request handling
   * @param options.output - Response mode: 'wrapped' (default) handles errors, 'raw' returns as-is
   * @returns Promise resolving to raw Didox API response
   * 
   * @throws {DidoxValidationError} When docType or payload is invalid
   * @throws {DidoxApiError} When API returns error responses (unless output = 'raw')
   * @throws {DidoxAuthError} When authentication fails (unless output = 'raw')
   * @throws {DidoxNetworkError} When network request fails (unless output = 'raw')
   * 
   * @example
   * ```typescript
   * // Create invoice draft
   * const invoice = await client.documents.createDraft('002', {
   *   // Invoice payload structure according to Didox API
   *   sellerInfo: { tin: '123456789', name: 'Company LLC' },
   *   buyerInfo: { tin: '987654321', name: 'Client Corp' },
   *   items: [{ name: 'Product', price: 1000, quantity: 1 }]
   * });
   * 
   * // Create transport waybill with raw output
   * const ttn = await client.documents.createDraft('041', ttnPayload, {
   *   output: 'raw'
   * });
   * 
   * // Create act of work completed
   * const act = await client.documents.createDraft('075', actPayload);
   * ```
   */
  async createDraft(
    docType: string,
    payload: unknown,
    options?: { output?: 'wrapped' | 'raw' }
  ): Promise<any> {
    // Validate parameters
    validateCreateDraftParams(docType, payload);
    
    const endpoint = `/v1/documents/${docType}/create`;
    
    try {
      // Make HTTP POST request
      const response = await this.httpClient.post<any>(endpoint, payload);
      
      // Return raw response data
      return response.data;
      
    } catch (error) {
      // Handle output mode
      if (options?.output === 'raw') {
        // In raw mode, rethrow the original error without wrapping
        throw error;
      }
      
      // In wrapped mode (default), errors are handled by HttpClient error classes
      throw error;
    }
  }

  /**
   * Build URL with query parameters for API requests
   * 
   * Transforms the ListDocumentsParams into a URL with query parameters.
   * Handles arrays by converting them to comma-separated strings.
   * Only includes parameters that have defined values.
   * 
   * @private
   * @param endpoint - Base endpoint URL
   * @param params - Document filtering parameters
   * @returns Complete URL with query parameters
   */
  private buildUrlWithParams(endpoint: string, params: Partial<ListDocumentsParams>): string {
    const queryParams = new URLSearchParams();

    // Map parameter names to API query parameter names
    const paramMapping = {
      owner: 'owner',
      page: 'page',
      limit: 'limit',
      status: 'status',
      dateFromCreated: 'dateFromCreated',
      dateToCreated: 'dateToCreated',
      dateFromModified: 'dateFromUpdated',
      dateToModified: 'dateToUpdated',
      dateFromSent: 'signDateFrom',
      dateToSent: 'signDateTo',
      type: 'doctype',
      partner: 'partner',
      number: 'name',
      docDateFromCreated: 'docDateFromCreated',
      docDateToCreated: 'docDateToCreated',
      contractName: 'contractName',
      contractDate: 'contractDate',
      hasCommittent: 'hasCommittent',
      hasLgota: 'hasLgota',
      hasMarks: 'hasMarks',
      oneside: 'oneside'
    };

    // Process each parameter
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) {
        continue;
      }

      // Skip output parameter as it's handled separately
      if (key === 'output') {
        continue;
      }

      const apiParamName = paramMapping[key as keyof typeof paramMapping] || key;

      if (Array.isArray(value)) {
        // Convert array to comma-separated string
        queryParams.append(apiParamName, value.join(','));
      } else {
        queryParams.append(apiParamName, String(value));
      }
    }

    const queryString = queryParams.toString();
    return queryString ? `${endpoint}?${queryString}` : endpoint;
  }
}