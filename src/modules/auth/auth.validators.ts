import { DidoxValidationError } from '../../http/errors.js';
import type { DidoxLocale } from './auth.types.js';

/**
 * Validate Tax Identification Number
 * Must be exactly 9 digits
 */
export function validateTaxId(taxId: string): void {
  if (!taxId || typeof taxId !== 'string') {
    throw new DidoxValidationError(
      'taxId is required and must be a string',
      'taxId'
    );
  }

  if (!/^\d{9}$/.test(taxId)) {
    throw new DidoxValidationError(
      'taxId must be exactly 9 digits',
      'taxId'
    );
  }
}

/**
 * Validate password
 * Must be at least 8 characters
 */
export function validatePassword(password: string): void {
  if (!password || typeof password !== 'string') {
    throw new DidoxValidationError(
      'password is required and must be a string',
      'password'
    );
  }

  if (password.length < 8) {
    throw new DidoxValidationError(
      'password must be at least 8 characters long',
      'password'
    );
  }
}

/**
 * Validate locale
 * Must be 'ru' or 'uz'
 */
export function validateLocale(locale: string): asserts locale is DidoxLocale {
  if (!['ru', 'uz'].includes(locale)) {
    throw new DidoxValidationError(
      'locale must be either "ru" or "uz"',
      'locale'
    );
  }
}

/**
 * Validate user token
 * Must be a non-empty string
 */
export function validateUserToken(userToken: string): void {
  if (!userToken || typeof userToken !== 'string') {
    throw new DidoxValidationError(
      'userToken is required and must be a non-empty string',
      'userToken'
    );
  }
}