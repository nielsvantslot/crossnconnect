import { WaitlistForm } from '@/components/waitlist-form';
import { getTranslation } from '@/i18n';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = await getTranslation(locale, 'common');

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Hero */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 p-8 md:p-16 lg:p-20 flex flex-col justify-between text-white min-h-[40vh] md:min-h-screen">
        <div className="flex-1 flex flex-col justify-center gap-24">
          <div className="max-w-xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
              {t('home.title')}
            </h1>
          </div>
          <div className="max-w-md">
            <p className="text-lg md:text-xl text-white/95 leading-relaxed">
              {t('home.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 bg-slate-50 dark:bg-slate-900 p-8 md:p-16 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
              {t('home.waitlistTitle')}
            </h2>
          </div>
          <WaitlistForm lng={locale} />
        </div>
      </div>
    </div>
  );
}
