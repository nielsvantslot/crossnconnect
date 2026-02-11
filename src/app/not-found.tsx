import { headers } from 'next/headers';
import { getTranslation } from '@/i18n';
import { NotFoundContent } from '@/components/not-found-content';
import { detectLocaleFromPathname } from '@/lib/utils';

export default async function NotFound() {
  // Extract locale from the pathname
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  const locale = detectLocaleFromPathname(pathname);

  const { t } = await getTranslation(locale, 'common');

  return (
    <NotFoundContent 
      locale={locale}
      translations={{
        title: t('notFound.title'),
        description: t('notFound.description'),
        backToHome: t('notFound.backToHome'),
      }}
    />
  );
}
