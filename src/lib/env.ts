// Environment variable validation
function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  DATABASE_URL: getEnvVar('DATABASE_URL'),
  NEXTAUTH_SECRET: getEnvVar('AUTH_SECRET'),
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;
