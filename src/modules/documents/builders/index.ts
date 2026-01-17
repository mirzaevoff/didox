/**
 * Document Builders Infrastructure
 * 
 * Provides fluent, chainable builders for all Didox document types.
 * Each builder offers a type-safe, IDE-friendly way to construct document payloads.
 */

// Import all builder factories
import { invoice } from './invoice.js';
import { invoicePharm } from './invoicePharm.js';
import { hybridInvoice } from './hybridInvoice.js';
import { ttn } from './ttn.js';
import { act } from './act.js';
import { contract } from './contract.js';
import { empowerment } from './empowerment.js';
import { arbitrary } from './arbitrary.js';
import { verificationAct } from './verificationAct.js';
import { acceptanceTransfer } from './acceptanceTransfer.js';
import { foundersProtocol } from './founders-protocol.js';
import { letterNK } from './letter-nk.js';
import { multiParty } from './multi-party.js';

// Export base classes and types for extensibility
export { BaseDocumentBuilder } from './base/BaseDocumentBuilder.js';
export type { DocumentBuilderFactory } from './base/BaseDocumentBuilder.js';

// Export builder-specific types
export type {
  InvoiceDraft,
  InvoiceProductDraft,
  ApiInvoicePayload
} from './invoice.js';

export type {
  ActDraft,
  ActProductDraft,
  ApiActPayload
} from './act.js';

export type {
  TtnDraft,
  ProductGroupDraft,
  TtnProductDraft,
  ApiTtnPayload,
  Party
} from './ttn.js';

export type {
  ArbitraryDocumentDraft,
  ApiArbitraryDocumentPayload
} from './arbitrary.js';

export type {
  MultiPartyDocumentDraft,
  ApiMultiPartyDocumentPayload
} from './multi-party.js';

export type {
  FoundersProtocolDraft,
  ProtocolParticipantDraft,
  ProtocolPartDraft,
  ApiFoundersProtocolPayload
} from './founders-protocol.js';

export type {
  LetterNKDraft,
  LetterSenderDraft,
  LetterRecipientDraft,
  LetterAttachmentDraft,
  LetterHeadDraft,
  ApiLetterNKPayload
} from './letter-nk.js';

export type {
  EmpowermentDraft,
  AgentDraft,
  AgentPassportDraft,
  CompanyDraft,
  EmpowermentProductDraft,
  ApiEmpowermentPayload
} from './empowerment.js';

/**
 * Document Builders Collection
 * 
 * Centralized access to all document builders. Each builder provides a fluent API
 * for constructing documents with proper typing and IDE support.
 * 
 * @example
 * ```typescript
 * // Create an invoice document
 * const invoicePayload = builders.invoice()
 *   .raw({ FacturaType: 0 })
 *   .build();
 * 
 * await client.documents.createDraft('002', invoicePayload);
 * 
 * // Create a transport waybill
 * const ttnPayload = builders.ttn()
 *   .raw({ transportInfo: { vehicleNumber: '01A123BC' } })
 *   .build();
 * 
 * await client.documents.createDraft('041', ttnPayload);
 * ```
 */
export const builders = {
  /**
   * Invoice document builder (docType: '002')
   * For creating standard invoices
   */
  invoice,

  /**
   * Pharmacy invoice document builder
   * For creating pharmacy-specific invoices
   */
  invoicePharm,

  /**
   * Hybrid invoice document builder
   * For creating hybrid invoices
   */
  hybridInvoice,

  /**
   * Transport waybill (TTN) document builder (docType: '041')
   * For creating transport waybills
   */
  ttn,

  /**
   * Act document builder (docType: '075')
   * For creating act of work completed documents
   */
  act,

  /**
   * Contract document builder
   * For creating contract documents
   */
  contract,

  /**
   * Empowerment document builder (doctype: '006')
   * For creating empowerment (power of attorney) documents.
   * Three-party structure: Seller, Buyer, Agent. No prices or VAT.
   */
  empowerment,

  /**
   * Arbitrary document builder (doctype: '000')
   * For creating arbitrary PDF documents for internal EDO use.
   * These documents don't sync with roaming or other operators.
   */
  arbitrary,

  /**
   * Verification act document builder
   * For creating verification act documents
   */
  verificationAct,

  /**
   * Acceptance transfer document builder
   * For creating acceptance transfer documents
   */
  acceptanceTransfer,

  /**
   * Founders protocol document builder (doctype: '075')
   * For creating founders' meeting protocol documents
   */
  foundersProtocol,

  /**
   * Letter NK document builder (doctype: '013')
   * For creating letters to tax committee (Письмо НК)
   */
  letterNK,

  /**
   * Multi-party arbitrary document builder (doctype: '010')
   * For creating multi-party arbitrary PDF documents with 1 owner + N clients.
   * These documents are for internal EDO use and don't sync with roaming.
   */
  multiParty
} as const;