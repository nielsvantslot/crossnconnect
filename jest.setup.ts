// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock clipboard API
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
  writable: true,
  configurable: true,
});

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

// Mock rate limiter to always allow requests in tests
jest.mock('./src/lib/rate-limit', () => ({
  rateLimit: jest.fn(() => true),
  getRateLimitIdentifier: jest.fn(() => 'test-ip'),
}));

// Mock environment variables
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.NEXTAUTH_SECRET = 'test-secret';
process.env.NEXTAUTH_URL = 'http://localhost:3000';

// Mock i18next client
jest.mock('./src/i18n/client', () => ({
  useTranslation: (lng: string, ns: string) => ({
    t: (key: string) => {
      // Return English translations for common keys used in tests
      const translations: Record<string, string> = {
        'waitlist.nameLabel': 'Name',
        'waitlist.namePlaceholder': 'John Doe',
        'waitlist.emailLabel': 'Email',
        'waitlist.emailPlaceholder': 'johnsmith@example.com',
        'waitlist.submitButton': 'Get on the waitlist',
        'waitlist.submitting': 'Joining...',
        'waitlist.successMessage': 'Successfully joined the waitlist!',
        'waitlist.errorMessage': 'Failed to join waitlist. Please try again.',
        'waitlist.errorGeneric': 'Something went wrong',
      };
      return translations[key] || key;
    },
    i18n: {
      language: lng,
      changeLanguage: jest.fn(),
    },
  }),
}));
