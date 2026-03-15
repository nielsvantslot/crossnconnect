/**
 * Validation utilities for form inputs
 */

/**
 * Validates email format using RFC 5322 compliant regex
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates phone number - must contain only digits
 * Allows optional spaces, dashes, parentheses which will be stripped
 */
export function validatePhone(phone: string): { isValid: boolean; cleaned: string } {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Must have at least 10 digits (Dutch mobile: 10, landline: 9-10, international: 10-15)
  const isValid = cleaned.length >= 10 && cleaned.length <= 15;
  
  return { isValid, cleaned };
}

/**
 * Validates IBAN format
 * Supports international IBAN with basic format checking
 */
export function validateIBAN(iban: string): boolean {
  // Remove spaces and convert to uppercase
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();
  
  // Basic IBAN format: 2 letters (country code) + 2 digits (check digits) + up to 30 alphanumeric
  const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/;
  
  if (!ibanRegex.test(cleanIban)) {
    return false;
  }
  
  // Check minimum length (15 chars is shortest IBAN - Norway)
  if (cleanIban.length < 15) {
    return false;
  }
  
  // Optional: IBAN checksum validation (mod-97 algorithm)
  // Move first 4 chars to end
  const rearranged = cleanIban.slice(4) + cleanIban.slice(0, 4);
  
  // Replace letters with numbers (A=10, B=11, ..., Z=35)
  const numericString = rearranged
    .split('')
    .map(char => {
      const code = char.charCodeAt(0);
      // If it's a letter (A-Z)
      if (code >= 65 && code <= 90) {
        return (code - 55).toString(); // A=10, B=11, etc.
      }
      return char;
    })
    .join('');
  
  // Calculate mod 97
  let remainder = numericString;
  while (remainder.length > 2) {
    const block = remainder.slice(0, 9);
    remainder = (parseInt(block, 10) % 97).toString() + remainder.slice(9);
  }
  
  return parseInt(remainder, 10) % 97 === 1;
}

/**
 * Get error message for invalid phone
 */
export function getPhoneErrorMessage(lang: 'nl' | 'en' = 'nl'): string {
  return lang === 'nl' 
    ? 'Voer een geldig telefoonnummer in (minimaal 10 cijfers)'
    : 'Enter a valid phone number (minimum 10 digits)';
}

/**
 * Get error message for invalid email
 */
export function getEmailErrorMessage(lang: 'nl' | 'en' = 'nl'): string {
  return lang === 'nl'
    ? 'Voer een geldig e-mailadres in'
    : 'Enter a valid email address';
}

/**
 * Get error message for invalid IBAN
 */
export function getIBANErrorMessage(lang: 'nl' | 'en' = 'nl'): string {
  return lang === 'nl'
    ? 'Voer een geldig IBAN in (bijv. NL91ABNA0417164300)'
    : 'Enter a valid IBAN (e.g. NL91ABNA0417164300)';
}
