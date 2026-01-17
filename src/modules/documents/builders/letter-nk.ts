/**
 * Letter NK Builder (Stage 3.2.8)
 * 
 * Builder for creating letters to tax committee (doctype 013 - Письмо НК).
 * Provides DX-friendly fluent API with transformation to API-compliant payload.
 * 
 * @module letter-nk
 */

import { BaseDocumentBuilder } from './base/BaseDocumentBuilder.js';
import { DidoxValidationError } from '../../../http/errors.js';

/**
 * DX-friendly interface for letter head information (optional)
 */
export interface LetterHeadDraft {
  /**
   * Branch code (optional)
   */
  branchCode?: string;
  /**
   * Branch name (optional)
   */
  branchName?: string;
  /**
   * Email address (optional)
   */
  email?: string;
  /**
   * Website URL (optional, null in API if not provided)
   */
  website?: string;
  /**
   * Logo as base64-encoded string (optional)
   */
  logoBase64?: string;
  /**
   * Phone numbers array (optional)
   */
  phones?: string[];
}

/**
 * DX-friendly interface for sender information
 */
export interface LetterSenderDraft {
  /**
   * Company or person name
   */
  name: string;
  /**
   * TIN (БИН/ИИН)
   */
  tin: string;
  /**
   * Optional head information (branch, email, website, logo, phones)
   */
  head?: LetterHeadDraft;
}

/**
 * DX-friendly interface for recipient information
 */
export interface LetterRecipientDraft {
  /**
   * Company or person name
   */
  name: string;
  /**
   * TIN (БИН/ИИН)
   */
  tin: string;
  /**
   * Optional head information (branch, email, website, logo, phones)
   */
  head?: LetterHeadDraft;
}

/**
 * DX-friendly interface for attachment
 */
export interface LetterAttachmentDraft {
  /**
   * Filename with extension
   */
  filename: string;
  /**
   * MIME type (e.g., "application/pdf")
   */
  mimeType: string;
  /**
   * File size in bytes
   */
  size: number;
  /**
   * Base64-encoded file content
   */
  base64: string;
  /**
   * Optional description of the attachment
   */
  description?: string;
}

/**
 * Complete DX-friendly draft structure for Letter NK
 */
export interface LetterNKDraft {
  /**
   * Letter information (number and date)
   */
  letter: {
    number: string;
    date: string;
  };
  /**
   * Sender information
   */
  sender: LetterSenderDraft;
  /**
   * Recipient information
   */
  recipient: LetterRecipientDraft;
  /**
   * HTML content of the letter
   */
  html: string;
  /**
   * Letter attachments (optional)
   */
  attachments?: LetterAttachmentDraft[];
}

/**
 * API-compliant interface for letter NK payload
 * 
 * This is the exact structure expected by Didox API for doctype 013.
 * Field transformations:
 * - letter → Letter {Number, Date}
 * - sender/recipient → Sender/Recipient {Name, Tin, Head}
 * - head optional fields → empty strings or null (Website)
 * - html → Html
 * - attachments → Attachments with ContentBase64
 */
export interface ApiLetterNKPayload {
  Letter: {
    Number: string;
    Date: string;
  };
  Sender: {
    Name: string;
    Tin: string;
    Head: {
      BranchCode: string;
      BranchName: string;
      Email: string;
      Website: string | null;
      LogoBase64: string;
      Phones: string[];
    };
  };
  Recipient: {
    Name: string;
    Tin: string;
    Head: {
      BranchCode: string;
      BranchName: string;
      Email: string;
      Website: string | null;
      LogoBase64: string;
      Phones: string[];
    };
  };
  Html: string;
  Attachments: Array<{
    Filename: string;
    MimeType: string;
    Size: number;
    ContentBase64: string;
    Description: string;
  }>;
}

/**
 * Builder for creating Letter NK documents (doctype 013)
 *
 * The LetterNKBuilder provides a DX-friendly fluent API for building
 * letters to tax committee documents. It supports comprehensive sender/recipient
 * information, HTML content, and file attachments.
 *
 * Features:
 * - Fluent API for intuitive document building
 * - Comprehensive sender and recipient information with optional head fields
 * - HTML content support without sanitization
 * - File attachment management with base64 encoding
 * - DX-friendly draft format with API transformation
 * - Raw escape hatch for custom fields
 * - TypeScript type safety with exactOptionalPropertyTypes
 *
 * @extends BaseDocumentBuilder<ApiLetterNKPayload>
 *
 * @example
 * ```typescript
 * // Basic letter
 * const letter = builders.letterNK()
 *   .letter({
 *     number: 'ИСХ-145/2024',
 *     date: '2024-12-15'
 *   })
 *   .sender({
 *     name: 'ТОО "ТехноСнаб Казахстан"',
 *     tin: '123456789012'
 *   })
 *   .recipient({
 *     name: 'Департамент Налогового Комитета МФ РК по г. Алматы',
 *     tin: '999888777666'
 *   })
 *   .html('<p>Уважаемые господа, прошу разъяснить вопрос...</p>')
 *   .build();
 *
 * // Detailed sender with head information
 * const detailedLetter = builders.letterNK()
 *   .letter({ number: 'ИСХ-146/2024', date: '2024-12-16' })
 *   .sender({
 *     name: 'ТОО "Производство+"',
 *     tin: '111222333444',
 *     head: {
 *       branchCode: 'ALM01',
 *       branchName: 'Алматинский филиал',
 *       email: 'info@production.kz',
 *       website: 'https://production.kz',
 *       logoBase64: 'iVBORw0KGgoAAAANSUhEUgAAAAUA...',
 *       phones: ['+7 727 123 45 67', '+7 701 234 56 78']
 *     }
 *   })
 *   .recipient({
 *     name: 'НК РК',
 *     tin: '999888777666'
 *   })
 *   .html('<p>Detailed content</p>')
 *   .addAttachment({
 *     filename: 'balance.pdf',
 *     mimeType: 'application/pdf',
 *     size: 102400,
 *     base64: 'JVBERi0xLjQK...',
 *     description: 'Бухгалтерский баланс за 2024 год'
 *   })
 *   .build();
 * ```
 */
export class LetterNKBuilder extends BaseDocumentBuilder<ApiLetterNKPayload> {
  private draft: Partial<LetterNKDraft> = {};

  /**
   * Set letter information (number and date)
   *
   * @param letterInfo - Letter metadata
   * @returns The builder instance for method chaining
   *
   * @example
   * ```typescript
   * builder.letter({
   *   number: 'ИСХ-145/2024',
   *   date: '2024-12-15'
   * })
   * ```
   */
  letter(letterInfo: { number: string; date: string }): this {
    this.draft.letter = letterInfo;
    return this;
  }

  /**
   * Set sender information
   *
   * @param senderInfo - Complete sender details
   * @returns The builder instance for method chaining
   *
   * @example
   * ```typescript
   * builder.sender({
   *   name: 'ТОО "ТехноСнаб Казахстан"',
   *   tin: '123456789012',
   *   head: {
   *     branchCode: 'ALM01',
   *     branchName: 'Головной офис',
   *     email: 'office@technosnab.kz',
   *     website: 'https://technosnab.kz',
   *     logoBase64: 'iVBORw0KGgoAAAANSUhEUgAAAAUA...',
   *     phones: ['+7 727 350 12 34', '+7 701 234 56 78']
   *   }
   * })
   * ```
   */
  sender(senderInfo: LetterSenderDraft): this {
    this.draft.sender = senderInfo;
    return this;
  }

  /**
   * Set recipient information
   *
   * @param recipientInfo - Complete recipient details
   * @returns The builder instance for method chaining
   *
   * @example
   * ```typescript
   * builder.recipient({
   *   name: 'Департамент Налогового Комитета МФ РК по г. Алматы',
   *   tin: '999888777666',
   *   head: {
   *     email: 'almaty@kgd.gov.kz',
   *     website: 'https://kgd.gov.kz',
   *     phones: ['+7 7172 58 09 09']
   *   }
   * })
   * ```
   */
  recipient(recipientInfo: LetterRecipientDraft): this {
    this.draft.recipient = recipientInfo;
    return this;
  }

  /**
   * Set HTML content of the letter
   *
   * NO sanitization or validation is performed on the HTML content.
   * The content is passed as-is to the API.
   *
   * @param htmlContent - HTML content of the letter
   * @returns The builder instance for method chaining
   *
   * @example
   * ```typescript
   * builder.html(`
   *   <div>
   *     <h2>Запрос разъяснения по применению НДС</h2>
   *     <p>Уважаемые господа,</p>
   *     <p>Просим дать письменное разъяснение...</p>
   *   </div>
   * `)
   * ```
   */
  html(htmlContent: string): this {
    this.draft.html = htmlContent;
    return this;
  }

  /**
   * Add a single attachment to the letter
   *
   * @param attachment - Attachment details
   * @returns The builder instance for method chaining
   *
   * @example
   * ```typescript
   * builder.addAttachment({
   *   filename: 'balance.pdf',
   *   mimeType: 'application/pdf',
   *   size: 102400,
   *   base64: 'JVBERi0xLjQK...',
   *   description: 'Бухгалтерский баланс за 2024 год'
   * })
   * ```
   */
  addAttachment(attachment: LetterAttachmentDraft): this {
    if (!this.draft.attachments) {
      this.draft.attachments = [];
    }
    this.draft.attachments.push(attachment);
    return this;
  }

  /**
   * Add multiple attachments to the letter
   *
   * @param attachments - Array of attachment details
   * @returns The builder instance for method chaining
   *
   * @example
   * ```typescript
   * builder.addAttachments([
   *   {
   *     filename: 'contract.pdf',
   *     mimeType: 'application/pdf',
   *     size: 245760,
   *     base64: 'JVBERi0xLjQK...',
   *     description: 'Контракт № 2024-089'
   *   },
   *   {
   *     filename: 'specification.pdf',
   *     mimeType: 'application/pdf',
   *     size: 102400,
   *     base64: 'JVBERi0xLjQK...',
   *     description: 'Спецификация к контракту'
   *   }
   * ])
   * ```
   */
  addAttachments(attachments: LetterAttachmentDraft[]): this {
    if (!this.draft.attachments) {
      this.draft.attachments = [];
    }
    this.draft.attachments.push(...attachments);
    return this;
  }

  /**
   * Raw data merge (escape hatch)
   *
   * Allows merging arbitrary JSON data directly into the API payload.
   * Useful for edge cases, advanced scenarios, or undocumented API fields.
   * The data is deep-merged with the generated payload.
   *
   * @param data - Raw data to merge into the payload
   * @returns The builder instance for method chaining
   *
   * @example
   * ```typescript
   * builder.raw({
   *   CustomField: 'Custom Value',
   *   Letter: {
   *     Priority: 'urgent',
   *     Category: 'tax-inquiry'
   *   }
   * })
   * ```
   */
  raw(data: Partial<ApiLetterNKPayload & Record<string, any>>): this {
    return super.raw(data);
  }

  /**
   * Build the final API-compliant payload
   *
   * Transforms the DX-friendly draft into the API format expected by Didox.
   * Performs validation and applies field transformations:
   *
   * - letter → Letter {Number, Date}
   * - sender/recipient → Sender/Recipient {Name, Tin, Head}
   * - head optional fields → empty strings (except Website → null)
   * - html → Html
   * - attachments → Attachments with ContentBase64, Description (empty string default)
   *
   * @returns Complete API payload ready for Didox submission
   * @throws {DidoxValidationError} When required fields are missing
   *
   * @example
   * ```typescript
   * const payload = builder
   *   .letter({ number: 'ИСХ-001', date: '2024-12-15' })
   *   .sender({ name: 'Company', tin: '123456789012' })
   *   .recipient({ name: 'НК РК', tin: '999888777666' })
   *   .html('<p>Content</p>')
   *   .build();
   *
   * await client.documents.createDraft('013', payload);
   * ```
   */
  build(): ApiLetterNKPayload & Record<string, any> {
    // Validation
    if (!this.draft.letter) {
      throw new DidoxValidationError('Letter information is required');
    }

    if (!this.draft.sender) {
      throw new DidoxValidationError('Sender information is required');
    }

    if (!this.draft.recipient) {
      throw new DidoxValidationError('Recipient information is required');
    }

    if (!this.draft.html) {
      throw new DidoxValidationError('HTML content is required');
    }

    // Transform sender head
    const senderHead = this.draft.sender.head || {};
    const transformedSenderHead = {
      BranchCode: senderHead.branchCode || '',
      BranchName: senderHead.branchName || '',
      Email: senderHead.email || '',
      Website: senderHead.website !== undefined ? senderHead.website : null,
      LogoBase64: senderHead.logoBase64 || '',
      Phones: senderHead.phones || []
    };

    // Transform recipient head
    const recipientHead = this.draft.recipient.head || {};
    const transformedRecipientHead = {
      BranchCode: recipientHead.branchCode || '',
      BranchName: recipientHead.branchName || '',
      Email: recipientHead.email || '',
      Website: recipientHead.website !== undefined ? recipientHead.website : null,
      LogoBase64: recipientHead.logoBase64 || '',
      Phones: recipientHead.phones || []
    };

    // Build API payload
    const apiPayload: ApiLetterNKPayload = {
      Letter: {
        Number: this.draft.letter.number,
        Date: this.draft.letter.date
      },
      Sender: {
        Name: this.draft.sender.name,
        Tin: this.draft.sender.tin,
        Head: transformedSenderHead
      },
      Recipient: {
        Name: this.draft.recipient.name,
        Tin: this.draft.recipient.tin,
        Head: transformedRecipientHead
      },
      Html: this.draft.html,
      Attachments: (this.draft.attachments || []).map(attachment => ({
        Filename: attachment.filename,
        MimeType: attachment.mimeType,
        Size: attachment.size,
        ContentBase64: attachment.base64,
        Description: attachment.description || ''
      }))
    };

    // Deep merge: first apply apiPayload, then merge with any raw() data
    const basePayload = super.build(); // Get any raw() data applied earlier
    return this.deepMerge(apiPayload, basePayload) as ApiLetterNKPayload & Record<string, any>;
  }

  /**
   * Deep merge helper for combining API payload with raw data
   * 
   * @private
   */
  private deepMerge(target: any, source: any): any {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] instanceof Object && key in target && target[key] instanceof Object) {
        result[key] = this.deepMerge(target[key], source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }
}

/**
 * Factory function for creating a new LetterNKBuilder instance
 *
 * @returns A new LetterNKBuilder instance ready for method chaining
 *
 * @example
 * ```typescript
 * const letter = letterNK()
 *   .letter({ number: 'ИСХ-001', date: '2024-12-15' })
 *   .sender({ name: 'Company', tin: '123456789012' })
 *   .recipient({ name: 'НК РК', tin: '999888777666' })
 *   .html('<p>Content</p>')
 *   .build();
 * ```
 */
export function letterNK(): LetterNKBuilder {
  return new LetterNKBuilder();
}
