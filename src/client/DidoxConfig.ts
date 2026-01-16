/**
 * Didox SDK configuration interface
 */
export interface DidoxConfig {
  /**
   * Partner token provided by Didox for API access
   * Contact Didox representative to obtain this token
   */
  partnerToken: string;

  /**
   * Environment to use for API calls
   * - development: https://stage.goodsign.biz/
   * - production: https://api-partners.didox.uz/
   */
  environment: 'development' | 'production';

  /**
   * Request timeout in milliseconds
   * @default 10000
   */
  timeout?: number;
}

/**
 * Internal configuration with resolved values
 */
export interface ResolvedDidoxConfig {
  partnerToken: string;
  baseUrl: string;
  timeout: number;
}

/**
 * Resolve and validate Didox configuration
 */
export function resolveConfig(config: DidoxConfig): ResolvedDidoxConfig {
  const baseUrl = config.environment === 'production'
    ? 'https://api-partners.didox.uz'
    : 'https://stage.goodsign.biz';

  return {
    partnerToken: config.partnerToken,
    baseUrl,
    timeout: config.timeout ?? 10000
  };
}