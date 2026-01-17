import type { DocumentType, DocumentStatus, OwnerType, DocumentOutputFormat } from './documents.enums.js';

/**
 * Parameters for listing documents
 */
export interface ListDocumentsParams {
  /**
   * Document owner type (0 = incoming, 1 = outgoing)
   */
  owner: 0 | 1;

  /**
   * Page number (starts from 1)
   * @minimum 1
   */
  page: number;

  /**
   * Number of items per page
   * @minimum 1
   * @maximum 100
   */
  limit: number;

  /**
   * Filter by document status
   * Can be a single status or array of statuses
   */
  status?: number | number[];

  /**
   * Filter by document type code
   */
  doctype?: string;

  /**
   * Filter by partner (counterparty)
   */
  partner?: string;

  /**
   * Filter by creation date from (YYYY-MM-DD format)
   */
  dateFromCreated?: string;

  /**
   * Filter by creation date to (YYYY-MM-DD format)
   */
  dateToCreated?: string;

  /**
   * Filter by update date from (YYYY-MM-DD format)
   */
  dateFromUpdated?: string;

  /**
   * Filter by update date to (YYYY-MM-DD format)
   */
  dateToUpdated?: string;

  /**
   * Filter by signature date from (YYYY-MM-DD format)
   */
  signDateFrom?: string;

  /**
   * Filter by signature date to (YYYY-MM-DD format)
   */
  signDateTo?: string;

  /**
   * Filter by document date from (YYYY-MM-DD format)
   */
  docDateFromCreated?: string;

  /**
   * Filter by document date to (YYYY-MM-DD format)
   */
  docDateToCreated?: string;

  /**
   * Filter by contract name
   */
  contractName?: string;

  /**
   * Filter by contract date (YYYY-MM-DD format)
   */
  contractDate?: string;

  /**
   * Filter documents with committent (0 = no, 1 = yes)
   */
  hasCommittent?: 0 | 1;

  /**
   * Filter documents with benefits (0 = no, 1 = yes)
   */
  hasLgota?: 0 | 1;

  /**
   * Filter documents with marks (0 = no, 1 = yes)
   */
  hasMarks?: 0 | 1;

  /**
   * Filter one-sided documents (0 = no, 1 = yes)
   */
  oneside?: 0 | 1;

  /**
   * Output format for response
   * @default 'raw'
   */
  output?: 'raw' | 'normalized';
}

/**
 * Document metadata interface
 */
export interface DocumentMetadata {
  /**
   * Document unique identifier
   */
  id: string;

  /**
   * Document type code
   */
  type: DocumentType;

  /**
   * Document status
   */
  status: DocumentStatus;

  /**
   * Owner type (incoming/outgoing)
   */
  owner: OwnerType;

  /**
   * Document number
   */
  number?: string;

  /**
   * Document date
   */
  date?: string;

  /**
   * Creation timestamp
   */
  createdAt: string;

  /**
   * Last update timestamp
   */
  updatedAt: string;

  /**
   * Partner information
   */
  partner?: {
    tin: string;
    name: string;
  };
}

/**
 * Document statistics response
 */
export interface DocumentStatistics {
  /**
   * Total documents count
   */
  total: number;

  /**
   * Count by status
   */
  byStatus: Record<number, number>;

  /**
   * Count by document type
   */
  byType: Record<string, number>;

  /**
   * Count by owner type
   */
  byOwner: Record<number, number>;
}

/**
 * Document privileges response
 */
export interface DocumentPrivileges {
  /**
   * Can view document
   */
  canView: boolean;

  /**
   * Can edit document
   */
  canEdit: boolean;

  /**
   * Can sign document
   */
  canSign: boolean;

  /**
   * Can cancel document
   */
  canCancel: boolean;

  /**
   * Can delete document
   */
  canDelete: boolean;

  /**
   * Can download document
   */
  canDownload: boolean;
}

/**
 * Document creation payload
 */
export interface DocumentCreatePayload {
  /**
   * Document type
   */
  type: DocumentType;

  /**
   * Document specific data
   */
  data: unknown;
}

/**
 * Document API response wrapper
 */
export interface DocumentResponse<T = unknown> {
  /**
   * Operation success flag
   */
  success: boolean;

  /**
   * Response data
   */
  data: T;

  /**
   * Error message (if any)
   */
  error?: string;

  /**
   * Additional metadata
   */
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

/**
 * Raw documents list response from API
 */
export interface DocumentsListResponse {
  /**
   * Array of documents
   */
  data: DocumentMetadata[];

  /**
   * Pagination metadata
   */
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

/**
 * Normalized documents list response
 */
export interface NormalizedDocumentsListResponse {
  /**
   * Array of normalized documents
   */
  data: DocumentMetadata[];

  /**
   * Standardized pagination metadata
   */
  meta: PaginationMeta;
}

/**
 * Documents statistics response from API
 */
export interface DocumentsStatisticsResponse {
  /**
   * Total documents count
   */
  total: number;

  /**
   * Count by status
   */
  byStatus: Record<number, number>;

  /**
   * Count by document type
   */
  byType: Record<string, number>;

  /**
   * Count by owner type
   */
  byOwner: Record<number, number>;
}

/**
 * Raw document response from Didox API
 * Used for getById method - returns document as-is without normalization
 */
export type RawDocumentResponse = any;

/**
 * Raw document privileges response from Didox API
 * Used for getPrivileges method - returns privileges array as-is without normalization
 */
export type RawDocumentPrivilegesResponse = any;

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  /**
   * Current page number
   */
  currentPage: number;

  /**
   * Total number of pages
   */
  totalPages: number;

  /**
   * Total number of items
   */
  totalItems: number;

  /**
   * Number of items per page
   */
  itemsPerPage: number;

  /**
   * Whether there is a next page
   */
  hasNext: boolean;

  /**
   * Whether there is a previous page
   */
  hasPrevious: boolean;
}

/**
 * Date range filter for document queries
 */
export interface DateRangeFilter {
  /**
   * Start date (ISO format: YYYY-MM-DD)
   */
  from?: string;

  /**
   * End date (ISO format: YYYY-MM-DD)
   */
  to?: string;
}

/**
 * Document filtering parameters subset
 */
export interface DocumentFilterParams {
  /**
   * Filter by creation date from
   */
  dateFromCreated?: string;

  /**
   * Filter by creation date to
   */
  dateToCreated?: string;

  /**
   * Filter by modification date from
   */
  dateFromModified?: string;

  /**
   * Filter by modification date to
   */
  dateToModified?: string;

  /**
   * Filter by document status
   */
  status?: number | number[];

  /**
   * Filter by document type
   */
  type?: number | number[];

  /**
   * Filter by partner identifier
   */
  partner?: string;

  /**
   * Search query string
   */
  search?: string;

  /**
   * Owner type filter
   */
  owner?: OwnerType;
}