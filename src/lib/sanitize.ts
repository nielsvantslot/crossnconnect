// Input sanitization utilities

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 500); // Limit length
}

/**
 * Sanitize email input
 */
export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim().slice(0, 255);
}
