import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-config';

const locales = ['en', 'nl'];
const defaultLocale = 'en';

function getLocale(request: NextRequest): string {
  // Check if there's a locale in the pathname
  const pathname = request.nextUrl.pathname;
  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameLocale) return pathnameLocale;

  // Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(',')[0]
      .split('-')[0]
      .toLowerCase();
    if (locales.includes(preferredLocale)) {
      return preferredLocale;
    }
  }

  return defaultLocale;
}

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if the pathname is missing a locale
  const pathnameIsMissingLocale = locales.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    );
  }

  // Extract locale from pathname
  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Apply auth middleware to backoffice routes (except login page)
  if (
    pathname.includes('/backoffice') &&
    !pathname.endsWith('/backoffice') &&
    pathnameLocale
  ) {
    const session = await auth();

    if (!session) {
      const loginUrl = new URL(`/${pathnameLocale}/backoffice`, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Add pathname to headers for 404 pages to detect locale
  const response = NextResponse.next();
  response.headers.set('x-pathname', pathname);
  return response;
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};

