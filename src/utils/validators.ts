import { DidoxValidationError } from '../http/errors.js';

/**
 * Generic validation utility functions
 */

/**
 * Validate that a value is a non-empty string
 */
export function validateRequiredString(
  value: unknown, 
  fieldName: string
): asserts value is string {
  if (!value || typeof value !== 'string') {
    throw new DidoxValidationError(
      `${fieldName} is required and must be a non-empty string`,
      fieldName
    );
  }
}

/**
 * Validate that a value is a positive number
 */
export function validatePositiveNumber(
  value: unknown,
  fieldName: string
): asserts value is number {
  if (typeof value !== 'number' || value <= 0) {
    throw new DidoxValidationError(
      `${fieldName} must be a positive number`,
      fieldName
    );
  }
}