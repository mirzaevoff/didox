/**
 * Company users and permissions related types for Didox API
 */

export interface UpdateCompanyUsersPermissionsRequest {
  gnkpermissions: string;
  internalpermissions: string;
  is_director: 0 | 1;
}

export interface UpdateCompanyUsersPermissionsResponse {
  status: 'success';
}

/**
 * GNK (Tax Committee) Role Codes:
 * 11 - Отправка / отмена ЭСФ
 * 12 - Подтверждение / отклонение ЭСФ
 * 21 - Отправка / отмена доверенностей
 * 22 - Подтверждение / отклонение доверенностей
 * 41 - Отправка / отмена актов
 * 42 - Подтверждение / отклонение актов
 * 51 - Отправка / отмена договоров (НК)
 * 52 - Подтверждение / отклонение договоров (НК)
 * 61 - Отправка / отмена актов сверки
 * 62 - Подтверждение / отклонение актов сверки
 * 91 - Отправка / отмена актов приема-передачи
 * 92 - Подтверждение / отклонение актов приема-передачи
 * 101 - Отправка / отмена ТТН (новый)
 * 102 - Подтверждение / отклонение ТТН (новый)
 */
export enum GNKRoleCode {
  SEND_ESF = 11,
  CONFIRM_ESF = 12,
  SEND_POWER_OF_ATTORNEY = 21,
  CONFIRM_POWER_OF_ATTORNEY = 22,
  SEND_ACTS = 41,
  CONFIRM_ACTS = 42,
  SEND_CONTRACTS_NK = 51,
  CONFIRM_CONTRACTS_NK = 52,
  SEND_RECONCILIATION_ACTS = 61,
  CONFIRM_RECONCILIATION_ACTS = 62,
  SEND_TRANSFER_ACTS = 91,
  CONFIRM_TRANSFER_ACTS = 92,
  SEND_TTN_NEW = 101,
  CONFIRM_TTN_NEW = 102
}

/**
 * Didox Internal Role Codes (partial list)
 * 191 - Отправка / отмена заказов
 * 192 - Подтверждение / отклонение заказов
 * 59 - Создание договоров
 * 199 - Создание заказов
 * 58 - Просмотр договоров
 * 198 - Просмотр заказов
 * 89 - Создание произвольных документов
 * 88 - Просмотр произвольных документов
 * 81 - Отправка / отмена произвольных документов
 * 82 - Подтверждение / отклонение произвольных документов
 * ... and more
 */
export enum DidoxRoleCode {
  SEND_ORDERS = 191,
  CONFIRM_ORDERS = 192,
  CREATE_CONTRACTS = 59,
  CREATE_ORDERS = 199,
  VIEW_CONTRACTS = 58,
  VIEW_ORDERS = 198,
  CREATE_ARBITRARY_DOCS = 89,
  VIEW_ARBITRARY_DOCS = 88,
  SEND_ARBITRARY_DOCS = 81,
  CONFIRM_ARBITRARY_DOCS = 82,
  CONFIRM_EPOS_REQUESTS = 2,
  VIEW_EPOS_REQUESTS = 8,
  VIEW_UZBAT_CONTRACTS = 118,
  SEND_UZBAT_CONTRACTS = 111,
  CREATE_UZBAT_CONTRACTS = 119,
  VIEW_ESF = 18,
  VIEW_ACTS = 48,
  CREATE_ACTS = 49,
  VIEW_POWER_OF_ATTORNEY = 28,
  VIEW_TTN = 38,
  VIEW_GROSS_ACTS = 128,
  SEND_MULTILATERAL_ARBITRARY_DOCS = 131,
  CONFIRM_MULTILATERAL_ARBITRARY_DOCS = 132,
  VIEW_MULTILATERAL_ARBITRARY_DOCS = 138,
  CREATE_MULTILATERAL_ARBITRARY_DOCS = 139,
  VIEW_TTN_NEW = 108,
  SEND_MEETING_PROTOCOL = 151,
  CONFIRM_MEETING_PROTOCOL = 152,
  VIEW_MEETING_PROTOCOL = 158,
  CREATE_MEETING_PROTOCOL = 159,
  VIEW_RECONCILIATION_ACTS = 68
}