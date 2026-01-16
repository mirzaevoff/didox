import { DidoxValidationError } from '../../http/errors.js';

/**
 * Validate Tax Identification Number for utilities operations
 * Must be exactly 9 digits
 */
export function validateUtilitiesTin(tin: string): void {
  if (!tin || typeof tin !== 'string') {
    throw new DidoxValidationError(
      'tin is required and must be a string',
      'tin'
    );
  }

  if (!/^\d{9}$/.test(tin)) {
    throw new DidoxValidationError(
      'tin must be exactly 9 digits',
      'tin'
    );
  }
}