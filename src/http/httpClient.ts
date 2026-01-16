import { DidoxApiError, DidoxNetworkError } from './errors.js';

/**
 * HTTP response interface
 */
export interface HttpResponse<T = unknown> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

/**
 * HTTP request options
 */
export interface HttpRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
}

/**
 * HTTP client configuration
 */
export interface HttpClientConfig {
  baseUrl: string;
  timeout: number;
  defaultHeaders: Record<string, string>;
}

/**
 * Internal HTTP client for Didox API
 * Uses native fetch API for minimal dependencies
 */
export class HttpClient {
  private config: HttpClientConfig;
  private accessToken: string | undefined;
  private partnerToken: string | undefined;

  constructor(config: HttpClientConfig) {
    this.config = config;
  }

  /**
   * Set the partner token for Partner-Authorization header
   */
  public setPartnerToken(token: string): void {
    this.partnerToken = token;
  }

  /**
   * Set the access token for authenticated requests
   */
  public setAccessToken(token: string): void {
    this.accessToken = token;
  }

  /**
   * Clear the access token
   */
  public clearAccessToken(): void {
    this.accessToken = undefined;
  }

  /**
   * Make an HTTP request
   */
  public async request<T = unknown>(
    endpoint: string,
    options: HttpRequestOptions = {}
  ): Promise<HttpResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.config.timeout
    } = options;

    const url = `${this.config.baseUrl}${endpoint}`;
    
    const requestHeaders: Record<string, string> = {
      ...this.config.defaultHeaders,
      ...headers
    };

    // Add access token if available
    if (this.accessToken) {
      requestHeaders['user-key'] = this.accessToken;
    }

    // Add partner token if available
    if (this.partnerToken) {
      requestHeaders['Partner-Authorization'] = this.partnerToken;
    }

    // Add Content-Type for requests with body
    if (body && !requestHeaders['Content-Type']) {
      requestHeaders['Content-Type'] = 'application/json';
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const fetchOptions: RequestInit = {
        method,
        headers: requestHeaders,
        signal: controller.signal
      };

      if (body) {
        fetchOptions.body = JSON.stringify(body);
      }

      const response = await fetch(url, fetchOptions);

      clearTimeout(timeoutId);

      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      let responseData: T;
      
      // Try to parse JSON response
      try {
        const text = await response.text();
        responseData = text ? JSON.parse(text) : null;
      } catch {
        throw new DidoxApiError(
          'Invalid JSON response from Didox API',
          response.status
        );
      }

      // Handle error responses
      if (!response.ok) {
        throw new DidoxApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          responseData
        );
      }

      return {
        data: responseData,
        status: response.status,
        headers: responseHeaders
      };

    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof DidoxApiError) {
        throw error;
      }

      // Handle AbortError (timeout)
      if (error instanceof Error && error.name === 'AbortError') {
        throw new DidoxNetworkError(
          `Request timeout after ${timeout}ms`,
          error
        );
      }

      // Handle other network errors
      throw new DidoxNetworkError(
        'Network request failed',
        error as Error
      );
    }
  }

  /**
   * GET request
   */
  public get<T = unknown>(
    endpoint: string,
    options?: Omit<HttpRequestOptions, 'method' | 'body'>
  ): Promise<HttpResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  public post<T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: Omit<HttpRequestOptions, 'method' | 'body'>
  ): Promise<HttpResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  /**
   * PUT request
   */
  public put<T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: Omit<HttpRequestOptions, 'method' | 'body'>
  ): Promise<HttpResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  /**
   * DELETE request
   */
  public delete<T = unknown>(
    endpoint: string,
    options?: Omit<HttpRequestOptions, 'method' | 'body'>
  ): Promise<HttpResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}