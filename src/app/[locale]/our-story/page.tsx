import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { getTranslation } from '@/i18n';

export default async function OurStoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = await getTranslation(locale, 'common');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navigation Bar */}
      <Navigation locale={locale} translations={{
        ourStory: t('nav.ourStory'),
      }} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 text-center bg-gradient-to-br from-brand-dark-green via-brand-green to-brand-light-green">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white">
            {t('ourStory.heroTitle')}
          </h1>
        </div>
      </section>

      {/* Intro Section */}
      <section className="max-w-3xl mx-auto px-6 py-16 space-y-6">
        <p className="text-lg text-slate-700 leading-relaxed">
          {t('ourStory.intro1')}
        </p>
        <p className="text-lg text-slate-700 leading-relaxed">
          {t('ourStory.intro2')}
        </p>
        <p className="text-lg font-semibold text-brand-dark-green">
          {t('ourStory.intro3')}
        </p>
      </section>

      {/* Divider */}
      <div className="max-w-3xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
      </div>

      {/* Sport Section */}
      <section className="max-w-3xl mx-auto px-6 py-16 space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-dark-green">
          {t('ourStory.sportTitle')}
        </h2>
        <p className="text-lg text-slate-700 leading-relaxed">
          {t('ourStory.sportText1')}
        </p>
        <p className="text-lg text-slate-500 leading-relaxed italic">
          {t('ourStory.sportText2')}
        </p>
      </section>

      {/* Divider */}
      <div className="max-w-3xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
      </div>

      {/* Netwerken Section */}
      <section className="max-w-3xl mx-auto px-6 py-16 space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-dark-green">
          {t('ourStory.networkTitle')}
        </h2>
        <p className="text-lg text-slate-700 leading-relaxed">
          {t('ourStory.networkText1')}
        </p>
        <p className="text-lg text-slate-700 leading-relaxed">
          {t('ourStory.networkText2')}
        </p>
        <p className="text-lg text-slate-500 leading-relaxed italic">
          {t('ourStory.networkText3')}
        </p>
        <div className="pt-2">
          <p className="text-lg font-semibold text-slate-900 mb-3">
            {t('ourStory.networkListTitle')}
          </p>
          <ul className="space-y-2 text-slate-700">
            <li className="flex items-start gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-green shrink-0" />
              {t('ourStory.networkListItem1')}
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-green shrink-0" />
              {t('ourStory.networkListItem2')}
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-green shrink-0" />
              {t('ourStory.networkListItem3')}
            </li>
          </ul>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-3xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
      </div>

      {/* Pleasure Section */}
      <section className="max-w-3xl mx-auto px-6 py-16 space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-dark-green">
          {t('ourStory.pleasureTitle')}
        </h2>
        <p className="text-lg text-slate-700 leading-relaxed">
          {t('ourStory.pleasureText1')}
        </p>
        <p className="text-lg text-slate-700 leading-relaxed">
          {t('ourStory.pleasureText2')}
        </p>
        <p className="text-lg text-slate-500 leading-relaxed italic">
          {t('ourStory.pleasureText3')}
        </p>
        <p className="text-lg font-semibold text-slate-900">
          {t('ourStory.pleasureText4')}
        </p>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            {t('ourStory.ctaTitle')}
          </h2>
          <p className="text-xl font-semibold text-brand-dark-green">
            {t('ourStory.ctaSubtitle')}
          </p>
          <p className="text-lg text-slate-600 leading-relaxed">
            {t('ourStory.ctaText')}
          </p>
          <div className="pt-4">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center px-8 py-3 text-base font-semibold text-white bg-gradient-to-r from-brand-dark-green to-brand-green rounded-full hover:opacity-90 transition-opacity duration-150 shadow-lg shadow-brand-green/20"
            >
              {t('ourStory.ctaButton')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
