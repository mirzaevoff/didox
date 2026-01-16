/**
 * Account profile information
 */
export interface AccountProfile {
  /**
   * Mobile phone number in format 998XXXXXXXXX
   */
  mobile: string;

  /**
   * Email address
   */
  email: string;

  /**
   * Notifications enabled flag
   * 1 - notifications enabled
   * 0 - notifications disabled
   */
  notifications: 0 | 1;

  /**
   * Array of messenger identifiers
   */
  messengers: string[];
}

/**
 * Profile update request
 */
export interface UpdateProfileRequest {
  /**
   * Mobile phone number in format 998XXXXXXXXX
   */
  mobile: string;

  /**
   * Email address
   */
  email: string;

  /**
   * New password (optional, minimum 8 characters)
   */
  password?: string;

  /**
   * Notifications setting
   * 1 - enabled, 0 - disabled
   */
  notifications: 0 | 1;
}

/**
 * Profile update response
 */
export interface UpdateProfileResponse {
  /**
   * Updated mobile phone number
   */
  mobile: string;

  /**
   * Updated email address
   */
  email: string;

  /**
   * Updated notifications setting
   */
  notifications: 0 | 1;

  /**
   * Password confirmation (optional, returned if password was updated)
   */
  password?: string;
}