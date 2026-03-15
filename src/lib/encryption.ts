import crypto from 'crypto';
import { env } from './env';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

/**
 * Encrypts sensitive data using AES-256-GCM
 * @param text - Plain text to encrypt
 * @returns Encrypted string in format: iv:authTag:encryptedData (hex)
 */
export function encrypt(text: string): string {
  if (!env.ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY is not set in environment variables');
  }

  // Generate random IV for each encryption
  const iv = crypto.randomBytes(IV_LENGTH);
  
  // Create cipher
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(env.ENCRYPTION_KEY, 'hex'),
    iv
  );

  // Encrypt the text
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Get auth tag
  const authTag = cipher.getAuthTag();

  // Return as iv:authTag:encryptedData
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypts data encrypted with encrypt()
 * @param encryptedData - Encrypted string in format: iv:authTag:encryptedData
 * @returns Decrypted plain text
 */
export function decrypt(encryptedData: string): string {
  if (!env.ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY is not set in environment variables');
  }

  // Split the encrypted data
  const parts = encryptedData.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted data format');
  }

  const [ivHex, authTagHex, encrypted] = parts;

  // Convert from hex
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  // Create decipher
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(env.ENCRYPTION_KEY, 'hex'),
    iv
  );

  // Set auth tag
  decipher.setAuthTag(authTag);

  // Decrypt
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Encrypts an IBAN for secure storage
 * @param iban - Plain IBAN string
 * @returns Encrypted IBAN
 */
export function encryptIBAN(iban: string): string {
  // Remove spaces and convert to uppercase for consistency
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();
  return encrypt(cleanIban);
}

/**
 * Decrypts an IBAN
 * @param encryptedIban - Encrypted IBAN string
 * @returns Decrypted IBAN
 */
export function decryptIBAN(encryptedIban: string): string {
  return decrypt(encryptedIban);
}

/**
 * Masks an IBAN for display purposes
 * Shows only first 4 and last 4 characters
 * @param iban - Plain IBAN string (will be cleaned)
 * @returns Masked IBAN (e.g., "NL89 **** **** **51")
 */
export function maskIBAN(iban: string): string {
  const clean = iban.replace(/\s/g, '').toUpperCase();
  
  if (clean.length < 8) {
    return '****';
  }

  const first4 = clean.substring(0, 4);
  const last4 = clean.substring(clean.length - 4);
  const middleLength = clean.length - 8;
  const stars = '*'.repeat(Math.min(middleLength, 12));

  // Format with spaces for readability
  return `${first4} ${stars.match(/.{1,4}/g)?.join(' ') || stars} ${last4}`;
}

/**
 * Masks an encrypted IBAN by first decrypting it
 * @param encryptedIban - Encrypted IBAN string
 * @returns Masked IBAN
 */
export function maskEncryptedIBAN(encryptedIban: string): string {
  try {
    const decrypted = decryptIBAN(encryptedIban);
    return maskIBAN(decrypted);
  } catch (error) {
    console.error('Failed to decrypt IBAN for masking:', error);
    return '****';
  }
}

/**
 * Validates IBAN format (basic check)
 * More comprehensive validation should be done on the client/API level
 * @param iban - IBAN string to validate
 * @returns true if format is valid
 */
export function validateIBAN(iban: string): boolean {
  const clean = iban.replace(/\s/g, '').toUpperCase();
  
  // Basic format: 2 letters, 2 digits, up to 30 alphanumeric
  const ibanRegex = /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/;
  
  if (!ibanRegex.test(clean)) {
    return false;
  }

  // Length validation per country (basic check)
  const countryLengths: Record<string, number> = {
    NL: 18,
    BE: 16,
    DE: 22,
    FR: 27,
    GB: 22,
    ES: 24,
    IT: 27,
  };

  const countryCode = clean.substring(0, 2);
  const expectedLength = countryLengths[countryCode];

  // If we know the country, validate length
  if (expectedLength && clean.length !== expectedLength) {
    return false;
  }

  // If unknown country, accept if length is reasonable (15-34)
  if (!expectedLength && (clean.length < 15 || clean.length > 34)) {
    return false;
  }

  return true;
}

/**
 * Generates a new encryption key for use in environment variables
 * Run this once and add to .env as ENCRYPTION_KEY
 * @returns 64-character hex string (32 bytes)
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString('hex');
}
