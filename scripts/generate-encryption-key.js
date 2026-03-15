#!/usr/bin/env node

/**
 * Encryption Key Generator
 * 
 * Generates a secure 256-bit encryption key for IBAN encryption.
 * Run this script once and add the output to your .env file as ENCRYPTION_KEY
 * 
 * Usage:
 *   node scripts/generate-encryption-key.js
 *   or
 *   npm run generate:key
 */

const crypto = require('crypto');

function generateEncryptionKey() {
  return crypto.randomBytes(32).toString('hex');
}

console.log('\n🔐 Cross & Connect - Encryption Key Generator\n');
console.log('Generating secure 256-bit encryption key for IBAN storage...\n');

const key = generateEncryptionKey();

console.log('✅ Key generated successfully!\n');
console.log('Add this line to your .env file:\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`ENCRYPTION_KEY="${key}"`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('⚠️  IMPORTANT SECURITY NOTES:');
console.log('   • Keep this key SECRET - never commit to Git');
console.log('   • Add ENCRYPTION_KEY to .env (already in .gitignore)');
console.log('   • Use the SAME key across all environments for the same database');
console.log('   • If you lose this key, encrypted IBANs cannot be recovered');
console.log('   • Changing this key will break all existing encrypted data\n');
