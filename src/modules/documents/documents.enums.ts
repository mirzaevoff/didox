/**
 * Document types enum for Didox platform
 */
export enum DocumentType {
  /** Electronic invoice (ЭСФ) */
  FACTURA = '002',
  
  /** Pharmaceutical invoice (ЭСФ для фармацевтики) */
  FACTURA_PHARM = '008',
  
  /** Hybrid invoice (Гибридная ЭСФ) */
  HYBRID_FACTURA = '023',
  
  /** Waybill (ТТН) */
  WAYBILL = '041',
  
  /** Act (Акт) */
  ACT = '005',
  
  /** Power of attorney (Доверенность) */
  EMPOWERMENT = '006',
  
  /** Contract NK (Договор НК) */
  CONTRACT_NK = '007',
  
  /** Free form document (Произвольный документ) */
  FREE_FORM = '000',
  
  /** Verification act (Акт сверки) */
  VERIFICATION_ACT = '052',
  
  /** Acceptance transfer act (Акт приема-передачи) */
  ACCEPTANCE_TRANSFER = '054',
  
  /** Multi-party free form (Многосторонний произвольный) */
  MULTI_FREE_FORM = '010',
  
  /** Founders protocol (Протокол учредителей) */
  FOUNDERS_PROTOCOL = '075',
  
  /** Tax letter (Налоговое письмо) */
  TAX_LETTER = '013'
}

/**
 * Document status enum
 */
export enum DocumentStatus {
  /** Draft state */
  DRAFT = 0,
  
  /** Sent for signing */
  SENT = 1,
  
  /** Signed by all parties */
  SIGNED = 2,
  
  /** Rejected by counterparty */
  REJECTED = 3,
  
  /** Cancelled by sender */
  CANCELLED = 4,
  
  /** Error state */
  ERROR = 5,
  
  /** Partially signed */
  PARTIALLY_SIGNED = 6,
  
  /** Waiting for signature */
  WAITING_SIGNATURE = 7,
  
  /** Processing */
  PROCESSING = 8,
  
  /** Expired */
  EXPIRED = 9
}

/**
 * Document owner type enum
 */
export enum OwnerType {
  /** Incoming document */
  INCOMING = 0,
  
  /** Outgoing document */
  OUTGOING = 1
}

/**
 * Document output format enum
 */
export enum DocumentOutputFormat {
  /** Raw API response */
  RAW = 'raw',
  
  /** Normalized response */
  NORMALIZED = 'normalized'
}