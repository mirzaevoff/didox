import { DidoxValidationError } from '../../http/errors.js';
import type { ListDocumentsParams } from './documents.types.js';

/**
 * Date format regex (YYYY-MM-DD)
 */
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Validates document ID format
 * @param id Document ID to validate
 * @throws {DidoxValidationError} When ID is invalid
 */
export function validateDocumentId(id: string): void {
  if (!id || typeof id !== 'string') {
    throw new DidoxValidationError('Document ID is required and must be a string');
  }

  if (id.trim().length === 0) {
    throw new DidoxValidationError('Document ID cannot be empty');
  }
}

/**
 * Validates date format (YYYY-MM-DD)
 * @param date Date string to validate
 * @param fieldName Field name for error message
 * @throws {DidoxValidationError} When date format is invalid
 */
export function validateDateFormat(date: string, fieldName: string): void {
  if (!DATE_REGEX.test(date)) {
    throw new DidoxValidationError(
      `${fieldName} must be in YYYY-MM-DD format`
    );
  }

  // Additional date validation
  const parsedDate = new Date(date);
  const [year, month, day] = date.split('-').map(Number);
  
  if (
    parsedDate.getFullYear() !== year ||
    parsedDate.getMonth() + 1 !== month ||
    parsedDate.getDate() !== day
  ) {
    throw new DidoxValidationError(
      `${fieldName} contains an invalid date: ${date}`
    );
  }
}

/**
 * Validates page number
 * @param page Page number to validate
 * @throws {DidoxValidationError} When page is invalid
 */
export function validatePage(page: number): void {
  if (!Number.isInteger(page) || page < 1) {
    throw new DidoxValidationError(
      'Page must be a positive integer starting from 1'
    );
  }
}

/**
 * Validates limit parameter
 * @param limit Limit value to validate
 * @throws {DidoxValidationError} When limit is invalid
 */
export function validateLimit(limit: number): void {
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new DidoxValidationError(
      'Limit must be an integer between 1 and 100'
    );
  }
}

/**
 * Validates owner type
 * @param owner Owner type to validate
 * @throws {DidoxValidationError} When owner type is invalid
 */
export function validateOwnerType(owner: number): void {
  if (owner !== 0 && owner !== 1) {
    throw new DidoxValidationError(
      'Owner must be 0 (incoming) or 1 (outgoing)'
    );
  }
}

/**
 * Validates status parameter
 * @param status Status value or array to validate
 * @throws {DidoxValidationError} When status is invalid
 */
export function validateStatus(status: number | number[]): void {
  const validateSingleStatus = (val: number) => {
    if (!Number.isInteger(val) || val < 0) {
      throw new DidoxValidationError(
        'Status must be a non-negative integer'
      );
    }
  };

  if (Array.isArray(status)) {
    if (status.length === 0) {
      throw new DidoxValidationError(
        'Status array cannot be empty'
      );
    }
    status.forEach(validateSingleStatus);
  } else {
    validateSingleStatus(status);
  }
}

/**
 * Validates output format
 * @param output Output format to validate
 * @throws {DidoxValidationError} When output format is invalid
 */
export function validateOutputFormat(output: string): void {
  if (output !== 'raw' && output !== 'normalized') {
    throw new DidoxValidationError(
      'Output format must be "raw" or "normalized"'
    );
  }
}

/**
 * Validates binary flag (0 or 1)
 * @param value Flag value to validate
 * @param fieldName Field name for error message
 * @throws {DidoxValidationError} When flag is invalid
 */
export function validateBinaryFlag(value: number, fieldName: string): void {
  if (value !== 0 && value !== 1) {
    throw new DidoxValidationError(
      `${fieldName} must be 0 or 1`
    );
  }
}

/**
 * Validates document type code
 * @param doctype Document type code to validate
 * @throws {DidoxValidationError} When document type is invalid
 */
export function validateDocumentType(doctype: string): void {
  if (!doctype || typeof doctype !== 'string') {
    throw new DidoxValidationError(
      'Document type is required and must be a string'
    );
  }

  if (!/^\d{3}$/.test(doctype)) {
    throw new DidoxValidationError(
      'Document type must be a 3-digit code'
    );
  }
}

/**
 * Validates all parameters for listing documents
 * @param params Parameters to validate
 * @throws {DidoxValidationError} When any parameter is invalid
 */
export function validateListDocumentsParams(params: ListDocumentsParams): void {
  // Required parameters
  validateOwnerType(params.owner);
  validatePage(params.page);
  validateLimit(params.limit);

  // Optional parameters
  if (params.status !== undefined) {
    validateStatus(params.status);
  }

  if (params.doctype !== undefined) {
    validateDocumentType(params.doctype);
  }

  if (params.output !== undefined) {
    validateOutputFormat(params.output);
  }

  // Date parameters
  const dateFields = [
    'dateFromCreated',
    'dateToCreated', 
    'dateFromUpdated',
    'dateToUpdated',
    'signDateFrom',
    'signDateTo',
    'docDateFromCreated',
    'docDateToCreated',
    'contractDate'
  ] as const;

  for (const field of dateFields) {
    const value = params[field];
    if (value !== undefined) {
      validateDateFormat(value, field);
    }
  }

  // Binary flags
  const binaryFields = [
    'hasCommittent',
    'hasLgota',
    'hasMarks',
    'oneside'
  ] as const;

  for (const field of binaryFields) {
    const value = params[field];
    if (value !== undefined) {
      validateBinaryFlag(value, field);
    }
  }

  // String parameters validation
  if (params.partner !== undefined && typeof params.partner !== 'string') {
    throw new DidoxValidationError('Partner must be a string');
  }

  if (params.contractName !== undefined && typeof params.contractName !== 'string') {
    throw new DidoxValidationError('Contract name must be a string');
  }
}

/**
 * Validates parameters for createDraft method
 * 
 * Performs minimal validation required for document draft creation.
 * Does not validate document structure or business rules.
 * 
 * @param docType - Document type code
 * @param payload - Document payload
 * @throws {DidoxValidationError} When parameters are invalid
 */
export function validateCreateDraftParams(docType: unknown, payload: unknown): void {
  // Validate docType
  if (!docType || typeof docType !== 'string') {
    throw new DidoxValidationError('Document type is required and must be a string');
  }

  if (docType.trim().length === 0) {
    throw new DidoxValidationError('Document type cannot be empty');
  }

  // Validate payload
  if (!payload) {
    throw new DidoxValidationError('Payload is required');
  }

  if (typeof payload !== 'object') {
    throw new DidoxValidationError('Payload must be an object');
  }

  if (payload === null) {
    throw new DidoxValidationError('Payload cannot be null');
  }
}