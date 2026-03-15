import type { Metadata, Viewport } from 'next';
import { languages } from '@/i18n/settings';
import '../globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: 'Cross & Connect Waitlist',
    template: '%s | Cross & Connect',
  },
  description:
    'Join the waitlist for Cross & Connect. Be the first to know when we launch.',
  keywords: ['waitlist', 'cross and connect', 'signup'],
  authors: [{ name: 'Cross & Connect' }],
  creator: 'Cross & Connect',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://crossconnect.com',
    siteName: 'Cross & Connect',
    title: 'Cross & Connect Waitlist',
    description:
      'Join the waitlist for Cross & Connect. Be the first to know when we launch.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cross & Connect Waitlist',
    description:
      'Join the waitlist for Cross & Connect. Be the first to know when we launch.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export async function generateStaticParams() {
  return languages.map((lng) => ({ locale: lng }));
}

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return <>{children}</>;
}
