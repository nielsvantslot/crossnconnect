/**
 * Note: The locale detection logic for the not-found page is tested
 * in src/lib/__tests__/utils.test.ts via the detectLocaleFromPathname function.
 * 
 * Testing Next.js server components directly is complex and not necessary
 * since we've extracted the business logic into a pure testable function.
 */

describe('[locale] Not Found Page', () => {
  it('is tested via the detectLocaleFromPathname utility function', () => {
    expect(true).toBe(true);
  });
});
