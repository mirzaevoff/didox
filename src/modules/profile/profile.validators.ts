import { DidoxValidationError } from '../../http/errors.js';

/**
 * Validate notifications setting
 * Must be exactly 0 or 1
 */
export function validateNotifications(notifications?: unknown): asserts notifications is 0 | 1 | undefined {
  if (notifications !== undefined && notifications !== 0 && notifications !== 1) {
    throw new DidoxValidationError(
      'notifications must be either 0 (disabled) or 1 (enabled)',
      'notifications'
    );
  }
}

/**
 * Validate region ID
 * Must be a number
 */
export function validateRegionId(regionId?: unknown): asserts regionId is number | undefined {
  if (regionId !== undefined) {
    if (typeof regionId !== 'number') {
      throw new DidoxValidationError(
        'regionId must be a number',
        'regionId'
      );
    }
  }
}

/**
 * Validate TIN (Tax Identification Number)
 * Must be exactly 9 digits
 */
export function validateTin(tin?: string, fieldName: string = 'tin'): void {
  if (tin !== undefined) {
    if (typeof tin !== 'string' || !/^\d{9}$/.test(tin)) {
      throw new DidoxValidationError(
        `${fieldName} must be exactly 9 digits`,
        fieldName
      );
    }
  }
}

/**
 * Validate PINFL (Personal Identification Number)
 * Must be exactly 14 digits when provided
 */
export function validatePinfl(pinfl?: string | null, fieldName: string = 'pinfl'): void {
  if (pinfl !== undefined && pinfl !== null) {
    if (typeof pinfl !== 'string' || !/^\d{14}$/.test(pinfl)) {
      throw new DidoxValidationError(
        `${fieldName} must be exactly 14 digits`,
        fieldName
      );
    }
  }
}

/**
 * Validate offer signed flag
 * Must be exactly 0 or 1
 */
export function validateOfferSigned(offerSigned?: unknown): asserts offerSigned is 0 | 1 | undefined {
  if (offerSigned !== undefined && offerSigned !== 0 && offerSigned !== 1) {
    throw new DidoxValidationError(
      'offerSigned must be either 0 (not signed) or 1 (signed)',
      'offerSigned'
    );
  }
}

/**
 * Validate excise flag
 * Must be a boolean
 */
export function validateExcise(excise?: unknown): asserts excise is boolean | undefined {
  if (excise !== undefined && typeof excise !== 'boolean') {
    throw new DidoxValidationError(
      'excise must be a boolean',
      'excise'
    );
  }
}

/**
 * Validate VAT value
 * Must be a number
 */
export function validateVat(vat?: unknown): asserts vat is number | undefined {
  if (vat !== undefined && typeof vat !== 'number') {
    throw new DidoxValidationError(
      'vat must be a number',
      'vat'
    );
  }
}

/**
 * Validate VAT rate
 * Must be a number or null
 */
export function validateVatRate(vatRate?: unknown): asserts vatRate is number | null | undefined {
  if (vatRate !== undefined && vatRate !== null && typeof vatRate !== 'number') {
    throw new DidoxValidationError(
      'vatRate must be a number or null',
      'vatRate'
    );
  }
}