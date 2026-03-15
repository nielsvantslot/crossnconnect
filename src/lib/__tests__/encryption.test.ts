import { encrypt, decrypt, encryptIBAN, decryptIBAN, maskIBAN, maskEncryptedIBAN, validateIBAN } from '../encryption';

// Mock env module
jest.mock('../env', () => ({
  env: {
    ENCRYPTION_KEY: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef', // 64 hex chars = 32 bytes
  },
}));

describe('Encryption Module', () => {
  describe('encrypt/decrypt', () => {
    it('encrypts and decrypts text correctly', () => {
      const plaintext = 'Hello, World!';
      const encrypted = encrypt(plaintext);
      const decrypted = decrypt(encrypted);
      
      expect(decrypted).toBe(plaintext);
      expect(encrypted).not.toBe(plaintext);
    });

    it('produces different encrypted results for same text (due to random IV)', () => {
      const plaintext = 'Same text';
      const encrypted1 = encrypt(plaintext);
      const encrypted2 = encrypt(plaintext);
      
      expect(encrypted1).not.toBe(encrypted2);
      expect(decrypt(encrypted1)).toBe(plaintext);
      expect(decrypt(encrypted2)).toBe(plaintext);
    });

    it('encrypted result has correct format (iv:authTag:encryptedData)', () => {
      const plaintext = 'Test';
      const encrypted = encrypt(plaintext);
      
      const parts = encrypted.split(':');
      expect(parts).toHaveLength(3);
      expect(parts[0]).toHaveLength(32); // IV: 16 bytes = 32 hex chars
      expect(parts[1]).toHaveLength(32); // Auth tag: 16 bytes = 32 hex chars
      expect(parts[2].length).toBeGreaterThan(0); // Encrypted data
    });

    it('throws error when ENCRYPTION_KEY is missing', () => {
      // Re-mock env without ENCRYPTION_KEY
      jest.resetModules();
      jest.doMock('../env', () => ({
        env: {
          ENCRYPTION_KEY: undefined,
        },
      }));
      
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { encrypt: encryptWithoutKey } = require('../encryption');
      expect(() => encryptWithoutKey('test')).toThrow('ENCRYPTION_KEY is not set');
      
      // Restore mock
      jest.resetModules();
    });

    it('throws error when decrypting invalid format', () => {
      expect(() => decrypt('invalid')).toThrow('Invalid encrypted data format');
      expect(() => decrypt('only:two')).toThrow('Invalid encrypted data format');
    });
  });

  describe('encryptIBAN/decryptIBAN', () => {
    it('encrypts and decrypts IBAN correctly', () => {
      const iban = 'NL91ABNA0417164300';
      const encrypted = encryptIBAN(iban);
      const decrypted = decryptIBAN(encrypted);
      
      expect(decrypted).toBe(iban);
      expect(encrypted).not.toBe(iban);
    });

    it('removes spaces and converts to uppercase before encrypting', () => {
      const iban1 = 'nl91 abna 0417 1643 00';
      const iban2 = 'NL91ABNA0417164300';
      
      const decrypted1 = decryptIBAN(encryptIBAN(iban1));
      const decrypted2 = decryptIBAN(encryptIBAN(iban2));
      
      expect(decrypted1).toBe('NL91ABNA0417164300');
      expect(decrypted2).toBe('NL91ABNA0417164300');
    });
  });

  describe('maskIBAN', () => {
    it('masks IBAN showing only first and last 4 characters', () => {
      const iban = 'NL91ABNA0417164300';
      const masked = maskIBAN(iban);
      
      expect(masked).toContain('NL91');
      expect(masked).toContain('4300');
      expect(masked).toContain('*');
      expect(masked).not.toContain('ABNA');
    });

    it('handles IBANs with spaces', () => {
      const iban = 'NL91 ABNA 0417 1643 00';
      const masked = maskIBAN(iban);
      
      expect(masked).toContain('NL91');
      expect(masked).toContain('4300');
      expect(masked).toContain('*');
    });

    it('returns **** for very short strings', () => {
      const short = 'SHORT';
      const masked = maskIBAN(short);
      
      expect(masked).toBe('****');
    });

    it('formats masked IBAN with spaces for readability', () => {
      const iban = 'NL91ABNA0417164300';
      const masked = maskIBAN(iban);
      
      // Should have spaces between groups
      expect(masked).toMatch(/NL91\s+.*\s+4300/);
    });
  });

  describe('maskEncryptedIBAN', () => {
    it('decrypts and masks encrypted IBAN', () => {
      const iban = 'NL91ABNA0417164300';
      const encrypted = encryptIBAN(iban);
      const masked = maskEncryptedIBAN(encrypted);
      
      expect(masked).toContain('NL91');
      expect(masked).toContain('4300');
      expect(masked).toContain('*');
      expect(masked).not.toContain('ABNA');
    });

    it('returns **** on decryption error', () => {
      const invalidEncrypted = 'invalid:encrypted:data';
      const masked = maskEncryptedIBAN(invalidEncrypted);
      
      expect(masked).toBe('****');
    });
  });

  describe('validateIBAN', () => {
    it('validates correct Dutch IBAN', () => {
      expect(validateIBAN('NL91ABNA0417164300')).toBe(true);
      expect(validateIBAN('NL20INGB0001234567')).toBe(true);
    });

    it('validates IBAN with spaces', () => {
      expect(validateIBAN('NL91 ABNA 0417 1643 00')).toBe(true);
    });

    it('validates IBANs from different countries', () => {
      expect(validateIBAN('BE68539007547034')).toBe(true); // Belgium
      expect(validateIBAN('DE89370400440532013000')).toBe(true); // Germany
      expect(validateIBAN('FR1420041010050500013M02606')).toBe(true); // France
      expect(validateIBAN('GB29NWBK60161331926819')).toBe(true); // UK
    });

    it('rejects invalid formats', () => {
      expect(validateIBAN('INVALID')).toBe(false);
      expect(validateIBAN('123456789')).toBe(false);
      expect(validateIBAN('NLXX1234567890')).toBe(false); // No letters in check digits
      expect(validateIBAN('99ABNA0417164300')).toBe(false); // No digits in country code
    });

    it('rejects IBANs with incorrect length for known countries', () => {
      expect(validateIBAN('NL91ABNA041716')).toBe(false); // Too short for NL (should be 18)
      expect(validateIBAN('BE685390075470')).toBe(false); // Too short for BE (should be 16)
    });

    it('accepts IBANs with reasonable length for unknown countries', () => {
      const unknownCountry = 'XX12ABCD1234567890123'; // 21 chars, unknown country
      expect(validateIBAN(unknownCountry)).toBe(true);
    });

    it('rejects IBANs that are too short or too long', () => {
      expect(validateIBAN('XX12ABCD123')).toBe(false); // Too short (< 15)
      expect(validateIBAN('XX12' + 'A'.repeat(40))).toBe(false); // Too long (> 34)
    });
  });
});
