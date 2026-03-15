import crypto from 'crypto';

/**
 * Hashes an IP address using SHA-256 for privacy-compliant storage (GDPR)
 * @param ipAddress - The IP address to hash
 * @returns SHA-256 hash of the IP address
 */
export function hashIPAddress(ipAddress: string): string {
  return crypto
    .createHash('sha256')
    .update(ipAddress)
    .digest('hex');
}

/**
 * Extracts IP address from NextRequest
 * @param request - NextRequest object
 * @returns IP address string or '0.0.0.0' if not found
 */
export function getIPAddress(request: Request): string {
  // Try x-forwarded-for first (for proxies/load balancers)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  // Try x-real-ip
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  // Fallback
  return '0.0.0.0';
}
