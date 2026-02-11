import { cn } from '../utils';

describe('cn utility function', () => {
  it('merges class names correctly', () => {
    const result = cn('text-red-500', 'bg-blue-500');
    expect(result).toBe('text-red-500 bg-blue-500');
  });

  it('handles conditional class names', () => {
    const result = cn('base-class', true && 'conditional-class', false && 'hidden-class');
    expect(result).toContain('base-class');
    expect(result).toContain('conditional-class');
    expect(result).not.toContain('hidden-class');
  });

  it('merges Tailwind classes with precedence', () => {
    // twMerge should handle conflicting Tailwind classes
    const result = cn('px-2 py-1', 'px-4');
    expect(result).toContain('px-4');
    expect(result).toContain('py-1');
    expect(result).not.toContain('px-2');
  });

  it('handles empty inputs', () => {
    expect(cn()).toBe('');
    expect(cn('')).toBe('');
  });

  it('handles arrays of class names', () => {
    const result = cn(['text-sm', 'font-bold'], 'text-center');
    expect(result).toContain('text-sm');
    expect(result).toContain('font-bold');
    expect(result).toContain('text-center');
  });

  it('filters out falsy values', () => {
    const result = cn('valid', null, undefined, false, 0, '', 'another-valid');
    expect(result).toContain('valid');
    expect(result).toContain('another-valid');
    expect(result.split(' ').length).toBeLessThanOrEqual(3);
  });

  it('handles object syntax for conditional classes', () => {
    const result = cn({
      'class-1': true,
      'class-2': false,
      'class-3': 1 > 0,
    });
    expect(result).toContain('class-1');
    expect(result).not.toContain('class-2');
    expect(result).toContain('class-3');
  });
});

describe('detectLocaleFromPathname', () => {
  // Import the function
  const { detectLocaleFromPathname } = require('../utils');

  describe('English locale detection', () => {
    it('detects English from /en prefix', () => {
      expect(detectLocaleFromPathname('/en')).toBe('en');
      expect(detectLocaleFromPathname('/en/')).toBe('en');
      expect(detectLocaleFromPathname('/en/dashboard')).toBe('en');
      expect(detectLocaleFromPathname('/en/backoffice/members')).toBe('en');
    });
  });

  describe('Dutch locale detection', () => {
    it('detects Dutch from /nl prefix', () => {
      expect(detectLocaleFromPathname('/nl')).toBe('nl');
      expect(detectLocaleFromPathname('/nl/')).toBe('nl');
      expect(detectLocaleFromPathname('/nl/dashboard')).toBe('nl');
      expect(detectLocaleFromPathname('/nl/backoffice/waitlist')).toBe('nl');
    });
  });

  describe('Default behavior', () => {
    it('defaults to English when pathname has no locale', () => {
      expect(detectLocaleFromPathname('/')).toBe('en');
      expect(detectLocaleFromPathname('')).toBe('en');
      expect(detectLocaleFromPathname('/dashboard')).toBe('en');
      expect(detectLocaleFromPathname('/backoffice/members')).toBe('en');
    });

    it('defaults to English for invalid locales', () => {
      expect(detectLocaleFromPathname('/fr')).toBe('en');
      expect(detectLocaleFromPathname('/de/dashboard')).toBe('en');
      expect(detectLocaleFromPathname('/es/about')).toBe('en');
      expect(detectLocaleFromPathname('/invalid')).toBe('en');
    });
  });

  describe('Edge cases', () => {
    it('handles complex nested paths', () => {
      expect(detectLocaleFromPathname('/en/backoffice/trackable-urls/123')).toBe('en');
      expect(detectLocaleFromPathname('/nl/trk/abc123')).toBe('nl');
    });

    it('handles paths with query strings', () => {
      expect(detectLocaleFromPathname('/en/dashboard?tab=analytics')).toBe('en');
      expect(detectLocaleFromPathname('/nl/members?sort=asc')).toBe('nl');
    });

    it('handles paths with anchors', () => {
      expect(detectLocaleFromPathname('/en#section')).toBe('en');
      expect(detectLocaleFromPathname('/nl/about#contact')).toBe('nl');
    });
  });
});
