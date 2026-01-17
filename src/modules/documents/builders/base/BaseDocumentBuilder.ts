/**
 * Base Document Builder Infrastructure
 * 
 * Provides the foundational architecture for all document builders in the Didox SDK.
 * This class serves as the universal base that all specific document builders extend from.
 */

/**
 * Abstract base class for all document builders
 * 
 * Provides common functionality for building document payloads in a fluent,
 * chainable API pattern. All document builders inherit from this class to ensure
 * consistent behavior and IDE support across the SDK.
 * 
 * @template TPayload - The final document payload type that this builder produces
 * 
 * @example
 * ```typescript
 * // Example usage pattern (actual builders will extend this)
 * const payload = builder
 *   .someMethod(value)
 *   .anotherMethod(data)
 *   .raw({ customField: 'value' })  // Escape hatch for advanced cases
 *   .build();  // Returns TPayload
 * ```
 */
export abstract class BaseDocumentBuilder<TPayload> {
  /**
   * Internal payload state
   * 
   * Contains the document data being built. Subclasses should manipulate
   * this object through their specific methods to construct valid documents.
   * 
   * @protected
   */
  protected payload: Partial<TPayload>;

  /**
   * Initialize builder with optional initial data
   * 
   * @param initial - Optional initial payload data to seed the builder
   * 
   * @example
   * ```typescript
   * // Start with empty payload
   * const builder = new ConcreteBuilder();
   * 
   * // Start with some initial data
   * const builder = new ConcreteBuilder({
   *   existingField: 'value',
   *   anotherField: 123
   * });
   * ```
   */
  constructor(initial?: Partial<TPayload>) {
    this.payload = initial ? { ...initial } : {};
  }

  /**
   * Raw data merge (escape hatch)
   * 
   * Allows merging arbitrary JSON data directly into the payload.
   * This is useful for edge cases, advanced scenarios, or when working
   * with undocumented API fields that aren't covered by typed methods.
   * 
   * @param data - Raw data to merge into the current payload
   * @returns This builder instance for method chaining
   * 
   * @example
   * ```typescript
   * // Merge raw data for advanced use cases
   * const payload = builder
   *   .standardMethod(value)
   *   .raw({
   *     customField: 'special value',
   *     undocumentedFlag: true,
   *     nestedObject: {
   *       property: 'data'
   *     }
   *   })
   *   .build();
   * 
   * // Override specific fields if needed
   * const payload = builder
   *   .setAmount(1000)
   *   .raw({ amount: 2000 })  // Override the amount
   *   .build();
   * ```
   */
  raw(data: Partial<TPayload>): this {
    // Deep merge the raw data into current payload
    Object.assign(this.payload, data);
    return this;
  }

  /**
   * Build final document payload
   * 
   * Returns the constructed document payload. This method should be called
   * after all desired builder methods have been chained to get the final
   * document structure ready for API submission.
   * 
   * @returns The complete document payload of type TPayload
   * 
   * @example
   * ```typescript
   * // Build the final payload
   * const documentPayload = builder
   *   .setCompany(companyInfo)
   *   .addItem(item1)
   *   .addItem(item2)
   *   .build();
   * 
   * // Use with createDraft
   * await client.documents.createDraft('002', documentPayload);
   * ```
   */
  build(): TPayload {
    // Return a copy to prevent external modification of internal state
    return { ...this.payload } as TPayload;
  }
}

/**
 * Document Builder Factory Type
 * 
 * Defines the standard interface for all document builder factories.
 * Each builder factory should conform to this signature to ensure
 * consistency across the SDK.
 * 
 * @template T - The payload type that the builder produces
 * 
 * @example
 * ```typescript
 * // Example factory implementation
 * const invoiceBuilder: DocumentBuilderFactory<InvoicePayload> = 
 *   (initial?) => new InvoiceBuilder(initial);
 * 
 * // Usage
 * const builder = invoiceBuilder({ existingData: 'value' });
 * const payload = builder.someMethod().build();
 * ```
 */
export type DocumentBuilderFactory<T> = (initial?: Partial<T>) => BaseDocumentBuilder<T>;