import { BaseDocumentBuilder, DocumentBuilderFactory } from './base/BaseDocumentBuilder.js';

/**
 * Pharmacy Invoice Document Builder (Stub)
 * 
 * Builder for creating pharmacy invoice documents.
 * This is a placeholder implementation that will be expanded in future stages.
 */
class InvoicePharmBuilder extends BaseDocumentBuilder<any> {
  // TODO: Add pharmacy-specific invoice methods
}

/**
 * Creates a new pharmacy invoice document builder
 * 
 * @param initial - Optional initial pharmacy invoice data
 * @returns Pharmacy invoice builder instance
 */
export const invoicePharm: DocumentBuilderFactory<any> = (initial?) => 
  new InvoicePharmBuilder(initial);