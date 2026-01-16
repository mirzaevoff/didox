import { HttpClient } from '../http/httpClient.js';
import { DidoxValidationError } from '../http/errors.js';
import { DidoxConfig, ResolvedDidoxConfig, resolveConfig } from './DidoxConfig.js';
import { AuthApi } from '../modules/auth/auth.api.js';

/**
 * Main Didox SDK client
 * 
 * @example
 * ```typescript
 * const didox = new DidoxClient({
 *   partnerToken: 'your-partner-token',
 *   environment: 'development'
 * });
 * 
 * // Login as legal entity
 * const result = await didox.auth.loginLegalEntity({
 *   taxId: '123456789',
 *   password: 'your-password'
 * });
 * ```
 */
export class DidoxClient {
  private readonly config: ResolvedDidoxConfig;
  private readonly httpClient: HttpClient;

  /**
   * Authentication API
   */
  public readonly auth: AuthApi;

  constructor(config: DidoxConfig) {
    // Validate configuration
    this.validateConfig(config);
    
    // Resolve configuration
    this.config = resolveConfig(config);

    // Create HTTP client
    this.httpClient = new HttpClient({
      baseUrl: this.config.baseUrl,
      timeout: this.config.timeout,
      defaultHeaders: {
        'Authorization': `Bearer ${this.config.partnerToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    // Initialize API modules
    this.auth = new AuthApi(this.httpClient);
  }

  /**
   * Get the current configuration
   */
  public getConfig(): Readonly<ResolvedDidoxConfig> {
    return { ...this.config };
  }

  /**
   * Set access token for authenticated requests
   * This is called automatically after successful login
   */
  public setAccessToken(token: string): void {
    this.httpClient.setAccessToken(token);
  }

  /**
   * Clear access token
   */
  public clearAccessToken(): void {
    this.httpClient.clearAccessToken();
  }

  /**
   * Validate the configuration
   */
  private validateConfig(config: DidoxConfig): void {
    if (!config.partnerToken || typeof config.partnerToken !== 'string') {
      throw new DidoxValidationError(
        'partnerToken is required and must be a non-empty string',
        'partnerToken'
      );
    }

    if (!config.environment || !['development', 'production'].includes(config.environment)) {
      throw new DidoxValidationError(
        'environment must be either "development" or "production"',
        'environment'
      );
    }

    if (config.timeout !== undefined) {
      if (typeof config.timeout !== 'number' || config.timeout <= 0) {
        throw new DidoxValidationError(
          'timeout must be a positive number',
          'timeout'
        );
      }
    }
  }
}