/**
 * Documents module for Didox SDK
 * 
 * This module provides comprehensive functionality for managing electronic documents
 * in the Didox EDO platform including invoices, waybills, acts, and other document types.
 * 
 * @module Documents
 */

// Main client class
export { DocumentsClient } from './DocumentsClient.js';

// Document builders infrastructure
export { builders, BaseDocumentBuilder } from './builders/index.js';
export type { DocumentBuilderFactory } from './builders/index.js';

// Type definitions
export type {
  ListDocumentsParams,
  DocumentMetadata,
  DocumentStatistics,
  DocumentPrivileges,
  DocumentResponse,
  DocumentCreatePayload,
  PaginationMeta,
  DocumentFilterParams,
  DateRangeFilter,
  DocumentsListResponse,
  NormalizedDocumentsListResponse,
  DocumentsStatisticsResponse,
  RawDocumentResponse,
  RawDocumentPrivilegesResponse
} from './documents.types.js';

// Enum definitions
export {
  DocumentType,
  DocumentStatus,
  OwnerType
} from './documents.enums.js';

// Validation functions
export {
  validateListDocumentsParams,
  validateDocumentId,
  validateDateFormat,
  validateBinaryFlag,
  validateCreateDraftParams
} from './documents.validators.js';