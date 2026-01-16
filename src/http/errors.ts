/**
 * Base class for all Didox SDK errors
 */
export abstract class DidoxError extends Error {
  public readonly name: string;
  public readonly timestamp: Date;

  constructor(message: string, name: string) {
    super(message);
    this.name = name;
    this.timestamp = new Date();
    
    // Maintain proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Validation error thrown when input parameters are invalid
 */
export class DidoxValidationError extends DidoxError {
  public readonly field: string | undefined;

  constructor(message: string, field?: string) {
    super(message, 'DidoxValidationError');
    this.field = field;
  }
}

/**
 * Authentication error thrown when auth operations fail
 */
export class DidoxAuthError extends DidoxError {
  public readonly statusCode: number | undefined;

  constructor(message: string, statusCode?: number) {
    super(message, 'DidoxAuthError');
    this.statusCode = statusCode;
  }
}

/**
 * API error thrown when Didox API returns an error response
 */
export class DidoxApiError extends DidoxError {
  public readonly statusCode: number;
  public readonly response?: unknown;

  constructor(message: string, statusCode: number, response?: unknown) {
    super(message, 'DidoxApiError');
    this.statusCode = statusCode;
    this.response = response;
  }
}

/**
 * Network error thrown when HTTP requests fail (timeout, connection issues, etc.)
 */
export class DidoxNetworkError extends DidoxError {
  public readonly cause: Error | undefined;

  constructor(message: string, cause?: Error) {
    super(message, 'DidoxNetworkError');
    this.cause = cause;
  }
}