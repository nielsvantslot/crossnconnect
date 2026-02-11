import { getTranslation } from '@/i18n';
import { NotFoundContent } from '@/components/not-found-content';

export default async function NotFound() {
  // Default to English for root-level 404s
  const { t } = await getTranslation('en', 'common');

  return (
    <NotFoundContent 
      locale="en"
      translations={{
        title: t('notFound.title'),
        description: t('notFound.description'),
        backToHome: t('notFound.backToHome'),
      }}
    />
  );
}
