import { languages } from '@/i18n/settings';

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
