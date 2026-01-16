import { DidoxValidationError } from '../../http/errors.js';

/**
 * Validate mobile phone number
 * Must be in format 998XXXXXXXXX (exactly 12 digits starting with 998)
 */
export function validateMobile(mobile: string): void {
  if (!mobile || typeof mobile !== 'string') {
    throw new DidoxValidationError(
      'mobile is required and must be a string',
      'mobile'
    );
  }

  if (!/^998\d{9}$/.test(mobile)) {
    throw new DidoxValidationError(
      'mobile must be in format 998XXXXXXXXX (12 digits starting with 998)',
      'mobile'
    );
  }
}

/**
 * Validate email address
 * Must be a valid email format
 */
export function validateEmail(email: string): void {
  if (!email || typeof email !== 'string') {
    throw new DidoxValidationError(
      'email is required and must be a string',
      'email'
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new DidoxValidationError(
      'email must be a valid email address',
      'email'
    );
  }
}

/**
 * Validate password (optional)
 * If provided, must be at least 8 characters
 */
export function validatePassword(password?: string): void {
  if (password !== undefined) {
    if (typeof password !== 'string') {
      throw new DidoxValidationError(
        'password must be a string',
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
}

/**
 * Validate notifications setting
 * Must be exactly 0 or 1
 */
export function validateNotifications(notifications: unknown): asserts notifications is 0 | 1 {
  if (notifications !== 0 && notifications !== 1) {
    throw new DidoxValidationError(
      'notifications must be either 0 (disabled) or 1 (enabled)',
      'notifications'
    );
  }
}