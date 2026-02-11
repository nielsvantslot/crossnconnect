'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/i18n/client';
import { Button } from '@/components/ui/button';

export function NotFoundContent() {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] && ['en', 'nl'].includes(pathname.split('/')[1]) 
    ? pathname.split('/')[1] 
    : 'en';
  const { t, i18n } = useTranslation(locale, 'common');

  useEffect(() => {
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale, i18n]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="text-center px-8">
        <h1 className="text-9xl font-bold mb-4 text-slate-900 dark:text-white">404</h1>
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-white">
          {t('notFound.title')}
        </h2>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
          {t('notFound.description')}
        </p>
        <Link href={`/${locale}`}>
          <Button size="lg" className="font-semibold">
            {t('notFound.backToHome')}
          </Button>
        </Link>
      </div>
    </div>
  );
}
