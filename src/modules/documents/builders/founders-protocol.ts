/**
 * @fileoverview FoundersProtocolBuilder for doctype 075 — Протокол собрания учредителей
 *
 * Provides a DX-friendly fluent API for building founders' meeting protocol documents.
 * Supports complex multi-participant scenarios with agenda items and comprehensive
 * company information management.
 *
 * @example Basic usage
 * ```typescript
 * const protocol = builders.foundersProtocol()
 *   .document('Протокол №1', '001', 'Ташкент', '2025-02-07')
 *   .company({
 *     tin: '123456789',
 *     name: '"DIDOX TECH" MCHJ',
 *     fizTin: '12345678901234',
 *     fio: 'Иванов Иван Иванович',
 *     address: 'г. Ташкент, ул. Амира Темура, 15'
 *   })
 *   .addParticipant({
 *     tin: '987654321',
 *     name: 'Петров Петр Петрович', 
 *     share: 51,
 *     chairman: true
 *   })
 *   .addParticipant({
 *     tin: '111222333',
 *     name: 'Сидоров Сидор Сидорович',
 *     share: 49,
 *     secretary: true
 *   })
 *   .addPart('О создании общества', 'Принято единогласно создать ООО')
 *   .addPart('Об избрании руководства', 'Избран директор и секретарь')
 *   .build();
 * ```
 *
 * @example With company details
 * ```typescript
 * const detailedProtocol = builders.foundersProtocol()
 *   .document('Протокол собрания учредителей', 'PROT-2025-001', 'Ташкент', '2025-02-07')
 *   .company({
 *     tin: '310529901',
 *     name: '"VENKON GROUP" MCHJ',
 *     fizTin: '12345678901234',
 *     fio: 'Директор Иванов И.И.',
 *     bankId: 'NBU01',
 *     oked: 62010,
 *     account: '20208000400000000001',
 *     address: 'г. Ташкент, ул. Университетская, 4',
 *     workPhone: '+998711234567',
 *     mobile: '+998901234567'
 *   })
 *   .addParticipants([
 *     {
 *       tin: '123456789',
 *       name: 'Учредитель 1',
 *       companyTin: '987654321',
 *       companyName: 'Компания-учредитель',
 *       share: '60%',
 *       citizenship: 'UZ',
 *       chairman: true
 *     },
 *     {
 *       tin: '987654321',
 *       name: 'Учредитель 2', 
 *       share: '40%',
 *       secretary: true
 *     }
 *   ])
 *   .addParts([
 *     { title: 'Вопрос 1', body: 'Принятие устава' },
 *     { title: 'Вопрос 2', body: 'Выбор руководства' },
 *     { title: 'Вопрос 3', body: 'Определение уставного капитала' }
 *   ])
 *   .raw({
 *     meetingType: 'FOUNDATION',
 *     duration: '2_HOURS'
 *   })
 *   .build();
 * ```
 *
 * @since 3.2.7
 */

import { BaseDocumentBuilder } from './base/BaseDocumentBuilder.js';
import { DidoxValidationError } from '../../../http/errors.js';

/**
 * DX-friendly interface for founders protocol document draft
 */
export interface FoundersProtocolDraft {
  /**
   * Document metadata
   */
  document: {
    /** Document name/title */
    name: string;
    /** Document number */
    no: string;
    /** Meeting place */
    place: string;
    /** Document date (YYYY-MM-DD format) */
    date: string;
  };

  /**
   * Company information for the protocol
   */
  company: {
    /** Company TIN */
    tin: string;
    /** Company name */
    name: string;
    /** Physical person TIN (for individual) */
    fizTin: string;
    /** Full name of the representative */
    fio: string;
    /** Bank ID (optional) */
    bankId?: string;
    /** OKED classification code (optional) */
    oked?: number;
    /** Bank account number (optional) */
    account?: string;
    /** Company address */
    address: string;
    /** Work phone (optional) */
    workPhone?: string;
    /** Mobile phone (optional) */
    mobile?: string;
  };

  /**
   * Protocol participants/founders
   */
  participants: ProtocolParticipantDraft[];

  /**
   * Protocol agenda items/parts
   */
  parts: ProtocolPartDraft[];
}

/**
 * DX-friendly interface for protocol participant
 */
export interface ProtocolParticipantDraft {
  /** Participant TIN */
  tin: string;
  /** Participant name */
  name: string;
  /** Company TIN if participant represents a company (optional) */
  companyTin?: string;
  /** Company name if participant represents a company (optional) */
  companyName?: string;
  /** Share percentage or amount */
  share: number | string;
  /** Citizenship (optional) */
  citizenship?: string;
  /** Whether this participant is chairman (optional) */
  chairman?: boolean;
  /** Whether this participant is secretary (optional) */
  secretary?: boolean;
}

/**
 * DX-friendly interface for protocol agenda part
 */
export interface ProtocolPartDraft {
  /** Part title */
  title: string;
  /** Part body/content */
  body: string;
}

/**
 * API-compliant interface for founders protocol payload
 */
export interface ApiFoundersProtocolPayload {
  documentdoc: {
    documentname: string;
    documentno: string;
    documentplace: string;
    documentdate: string;
  };
  company: {
    tin: string;
    name: string;
    fiztin: string;
    fio: string;
    bankid: string;
    oked: number;
    account: string;
    address: string;
    workphone: string;
    mobile: string;
  };
  participants: Array<{
    tin: string;
    name: string;
    companyTaxId: string;
    companyname: string;
    share: string;
    citizenship: string;
    ischairman: boolean;
    issecretary: boolean;
  }>;
  parts: Array<{
    ordno: number;
    title: string;
    body: string;
  }>;
}

/**
 * Builder for creating Founders Protocol documents (doctype 075)
 *
 * The FoundersProtocolBuilder provides a DX-friendly fluent API for building
 * founders' meeting protocol documents. It supports complex scenarios with
 * multiple participants, detailed company information, and structured agenda items.
 *
 * Features:
 * - Fluent API for intuitive document building
 * - Multi-participant support with roles (chairman, secretary)
 * - Comprehensive company information handling
 * - Structured agenda items with automatic ordering
 * - DX-friendly draft format with API transformation
 * - Raw escape hatch for custom fields
 * - TypeScript type safety with exactOptionalPropertyTypes
 *
 * @extends BaseDocumentBuilder<ApiFoundersProtocolPayload>
 *
 * @example
 * ```typescript
 * const protocol = builders.foundersProtocol()
 *   .document('Протокол №1', '001', 'Ташкент', '2025-02-07')
 *   .company({
 *     tin: '123456789',
 *     name: '"DIDOX TECH" MCHJ',
 *     fizTin: '12345678901234',
 *     fio: 'Иванов Иван Иванович',
 *     address: 'г. Ташкент, ул. Амира Темура, 15'
 *   })
 *   .addParticipant({
 *     tin: '987654321',
 *     name: 'Петров Петр Петрович',
 *     share: 51,
 *     chairman: true
 *   })
 *   .addPart('Вопрос 1', 'Принято решение')
 *   .build();
 * ```
 */
export class FoundersProtocolBuilder extends BaseDocumentBuilder<ApiFoundersProtocolPayload> {
  private draft: Partial<FoundersProtocolDraft> = {
    participants: [],
    parts: []
  };

  /**
   * Set document metadata for the founders protocol
   *
   * @param name - Document name/title
   * @param no - Document number
   * @param place - Meeting place
   * @param date - Document date in YYYY-MM-DD format
   * @returns The builder instance for method chaining
   *
   * @example
   * ```typescript
   * builder.document('Протокол собрания учредителей', 'PROT-001', 'Ташкент', '2025-02-07')
   * ```
   */
  document(name: string, no: string, place: string, date: string): this {
    this.draft.document = { name, no, place, date };
    return this;
  }

  /**
   * Set company information for the protocol
   *
   * @param companyInfo - Company details
   * @returns The builder instance for method chaining
   *
   * @example
   * ```typescript
   * builder.company({
   *   tin: '310529901',
   *   name: '"DIDOX TECH" MCHJ',
   *   fizTin: '12345678901234',
   *   fio: 'Директор Иванов И.И.',
   *   address: 'г. Ташкент, ул. Амира Темура, 15',
   *   bankId: 'NBU01',
   *   oked: 62010
   * })
   * ```
   */
  company(companyInfo: FoundersProtocolDraft['company']): this {
    this.draft.company = companyInfo;
    return this;
  }

  /**
   * Add a single participant to the protocol
   *
   * @param participant - Participant information
   * @returns The builder instance for method chaining
   *
   * @example
   * ```typescript
   * builder.addParticipant({
   *   tin: '123456789',
   *   name: 'Иванов Иван Иванович',
   *   share: 51,
   *   chairman: true,
   *   citizenship: 'UZ'
   * })
   * ```
   */
  addParticipant(participant: ProtocolParticipantDraft): this {
    if (!this.draft.participants) {
      this.draft.participants = [];
    }
    this.draft.participants.push(participant);
    return this;
  }

  /**
   * Add multiple participants to the protocol at once
   *
   * @param participants - Array of participants to add
   * @returns The builder instance for method chaining
   *
   * @example
   * ```typescript
   * builder.addParticipants([
   *   {
   *     tin: '123456789',
   *     name: 'Учредитель 1',
   *     share: '60%',
   *     chairman: true
   *   },
   *   {
   *     tin: '987654321',
   *     name: 'Учредитель 2',
   *     share: '40%',
   *     secretary: true
   *   }
   * ])
   * ```
   */
  addParticipants(participants: ProtocolParticipantDraft[]): this {
    if (!this.draft.participants) {
      this.draft.participants = [];
    }
    this.draft.participants.push(...participants);
    return this;
  }

  /**
   * Add a single agenda item/part to the protocol
   *
   * @param title - Part title
   * @param body - Part content/body
   * @returns The builder instance for method chaining
   *
   * @example
   * ```typescript
   * builder.addPart('О создании общества', 'Принято единогласно создать ООО с уставным капиталом...')
   * ```
   */
  addPart(title: string, body: string): this {
    if (!this.draft.parts) {
      this.draft.parts = [];
    }
    this.draft.parts.push({ title, body });
    return this;
  }

  /**
   * Add multiple agenda items/parts to the protocol at once
   *
   * @param parts - Array of parts to add
   * @returns The builder instance for method chaining
   *
   * @example
   * ```typescript
   * builder.addParts([
   *   { title: 'Вопрос 1', body: 'Принятие устава' },
   *   { title: 'Вопрос 2', body: 'Выбор руководства' },
   *   { title: 'Вопрос 3', body: 'Определение капитала' }
   * ])
   * ```
   */
  addParts(parts: ProtocolPartDraft[]): this {
    if (!this.draft.parts) {
      this.draft.parts = [];
    }
    this.draft.parts.push(...parts);
    return this;
  }

  /**
   * Override with raw API payload data (escape hatch)
   *
   * Allows direct modification of the final API payload for advanced scenarios
   * or custom fields not covered by the standard API. The data is deep-merged
   * with the generated payload, allowing fine-grained control.
   *
   * @param data - Raw data to merge into the payload
   * @returns The builder instance for method chaining
   *
   * @example
   * ```typescript
   * builder.raw({
   *   meetingType: 'FOUNDATION',
   *   duration: '2_HOURS',
   *   customField: 'custom value',
   *   company: {
   *     oked: 62020  // Override specific company field
   *   }
   * })
   * ```
   */
  raw(data: Partial<ApiFoundersProtocolPayload & Record<string, any>>): this {
    return super.raw(data);
  }

  /**
   * Build the final API-compliant payload
   *
   * Transforms the DX-friendly draft into the API format expected by Didox.
   * Performs validation and applies field transformations:
   *
   * - chairman → ischairman
   * - secretary → issecretary
   * - share → string conversion
   * - ordno → auto-increment from 1
   * - Optional fields → empty strings if missing
   * - oked → number type
   * - Removes undefined values
   *
   * @returns Complete API payload ready for Didox submission
   * @throws {DidoxValidationError} When required fields are missing
   *
   * @example
   * ```typescript
   * const payload = builder
   *   .document('Протокол №1', '001', 'Ташкент', '2025-02-07')
   *   .company({ ... })
   *   .addParticipant({ ... })
   *   .addPart('Вопрос 1', 'Содержание')
   *   .build();
   *
   * // Returns API-compliant structure ready for createDraft()
   * ```
   */
  build(): ApiFoundersProtocolPayload & Record<string, any> {
    // Validation
    if (!this.draft.document) {
      throw new DidoxValidationError('Document information is required');
    }

    if (!this.draft.company) {
      throw new DidoxValidationError('Company information is required');
    }

    if (!this.draft.participants || this.draft.participants.length === 0) {
      throw new DidoxValidationError('At least one participant is required');
    }

    if (!this.draft.parts || this.draft.parts.length === 0) {
      throw new DidoxValidationError('At least one agenda part is required');
    }

    // Build API payload and assign to parent's payload
    const apiPayload: ApiFoundersProtocolPayload = {
      documentdoc: {
        documentname: this.draft.document.name,
        documentno: this.draft.document.no,
        documentplace: this.draft.document.place,
        documentdate: this.draft.document.date
      },
      company: {
        tin: this.draft.company.tin,
        name: this.draft.company.name,
        fiztin: this.draft.company.fizTin,
        fio: this.draft.company.fio,
        bankid: this.draft.company.bankId || '',
        oked: this.draft.company.oked || 0,
        account: this.draft.company.account || '',
        address: this.draft.company.address,
        workphone: this.draft.company.workPhone || '',
        mobile: this.draft.company.mobile || ''
      },
      participants: this.draft.participants.map(participant => ({
        tin: participant.tin,
        name: participant.name,
        companyTaxId: participant.companyTin || '',
        companyname: participant.companyName || '',
        share: String(participant.share),
        citizenship: participant.citizenship || '',
        ischairman: participant.chairman || false,
        issecretary: participant.secretary || false
      })),
      parts: this.draft.parts.map((part, index) => ({
        ordno: index + 1,
        title: part.title,
        body: part.body
      }))
    };

    // Assign to parent payload for raw() support
    Object.assign(this.payload, apiPayload);
    
    // Return with raw data applied
    return super.build() as ApiFoundersProtocolPayload & Record<string, any>;
  }
}

/**
 * Factory function for creating a new FoundersProtocolBuilder instance
 *
 * @returns A new FoundersProtocolBuilder instance ready for method chaining
 *
 * @example
 * ```typescript
 * const protocol = foundersProtocol()
 *   .document('Протокол №1', '001', 'Ташкент', '2025-02-07')
 *   .company({ ... })
 *   .addParticipant({ ... })
 *   .addPart('Вопрос', 'Содержание')
 *   .build();
 * ```
 */
export function foundersProtocol(): FoundersProtocolBuilder {
  return new FoundersProtocolBuilder();
}