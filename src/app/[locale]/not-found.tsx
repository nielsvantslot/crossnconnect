import { headers } from 'next/headers';
import { getTranslation } from '@/i18n';
import { NotFoundContent } from '@/components/not-found-content';

export default async function NotFound() {
  // Extract locale from the pathname
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  const locale = pathname.split('/')[1] && ['en', 'nl'].includes(pathname.split('/')[1]) 
    ? pathname.split('/')[1] 
    : 'en';

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
