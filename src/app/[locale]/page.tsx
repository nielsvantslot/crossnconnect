import { WaitlistForm } from '@/components/waitlist-form-client';
import { Navigation } from '@/components/navigation';
import { getTranslation } from '@/i18n';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = await getTranslation(locale, 'common');

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <Navigation locale={locale} />
      
      {/* Main Content - Split Screen (floats beneath nav) */}
      <div className="flex-1 flex flex-col md:flex-row">
      {/* Left Side - Hero */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-brand-dark-green via-brand-green to-brand-light-green p-8 md:p-16 lg:p-20 flex flex-col justify-between text-white min-h-[40vh] md:min-h-screen">
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
      <div className="w-full md:w-1/2 bg-slate-50 dark:bg-slate-900 p-8 md:p-16 flex items-center justify-center overflow-y-auto">
        <div className="w-full max-w-2xl py-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
              {t('home.waitlistTitle')}
            </h2>
</div>
          <WaitlistForm 
            translations={{
              // Form steps
              step1Title: t('waitlist.step1Title'),
              step2Title: t('waitlist.step2Title'),
              step3Title: t('waitlist.step3Title'),
              step4Title: t('waitlist.step4Title'),
              step5Title: t('waitlist.step5Title'),
              
              // Personal Information
              firstNameLabel: t('waitlist.firstNameLabel'),
              lastNameLabel: t('waitlist.lastNameLabel'),
              dateOfBirthLabel: t('waitlist.dateOfBirthLabel'),
              cityLabel: t('waitlist.cityLabel'),
              phoneLabel: t('waitlist.phoneLabel'),
              phoneHelp: t('waitlist.phoneHelp'),
              emailLabel: t('waitlist.emailLabel'),
              emailPlaceholder: t('waitlist.emailPlaceholder'),
              
              // Payment Information
              accountHolderLabel: t('waitlist.accountHolderLabel'),
              ibanLabel: t('waitlist.ibanLabel'),
              ibanHelp: t('waitlist.ibanHelp'),
              paymentInfoText: t('waitlist.paymentInfoText'),
              
              // Profile & Work
              occupationLabel: t('waitlist.occupationLabel'),
              occupationPlaceholder: t('waitlist.occupationPlaceholder'),
              occupationOther: t('waitlist.occupationOther'),
              occupationOtherLabel: t('waitlist.occupationOtherLabel'),
              occupationCustomPlaceholder: t('waitlist.occupationCustomPlaceholder'),
              industryLabel: t('waitlist.industryLabel'),
              industryPlaceholder: t('waitlist.industryPlaceholder'),
              companyNameLabel: t('waitlist.companyNameLabel'),
              companyRoleLabel: t('waitlist.companyRoleLabel'),
              
              // Horse Sport
              hasHorseExperienceLabel: t('waitlist.hasHorseExperienceLabel'),
              hasHorseExperienceYes: t('waitlist.hasHorseExperienceYes'),
              hasHorseExperienceNo: t('waitlist.hasHorseExperienceNo'),
              horseExperienceLevelLabel: t('waitlist.horseExperienceLevelLabel'),
              horseLevelActive: t('waitlist.horseLevelActive'),
              horseLevelFan: t('waitlist.horseLevelFan'),
              wantsToDiscoverLabel: t('waitlist.wantsToDiscoverLabel'),
              wantsToDiscoverYes: t('waitlist.wantsToDiscoverYes'),
              wantsToDiscoverNo: t('waitlist.wantsToDiscoverNo'),
              disciplinesLabel: t('waitlist.disciplinesLabel'),
              disciplinesOtherLabel: t('waitlist.disciplinesOtherLabel'),
              disciplineAnders: t('waitlist.disciplineAnders'),
              disciplineCustomPlaceholder: t('waitlist.disciplineCustomPlaceholder'),
              
              // Community & Privacy
              communityGoalsLabel: t('waitlist.communityGoalsLabel'),
              funQuestionLabel: t('waitlist.funQuestionLabel'),
              funAnswerPlaceholder: t('waitlist.funAnswerPlaceholder'),
              consentText: t('waitlist.consentText'),
              
              // Navigation & Actions
              backButton: t('waitlist.backButton'),
              nextButton: t('waitlist.nextButton'),
              submitButton: t('waitlist.submitButton'),
              submitting: t('waitlist.submitting'),
              
              // Messages
              successMessage: t('waitlist.successMessage'),
              errorMessage: t('waitlist.errorMessage'),
              errorGeneric: t('waitlist.errorGeneric'),
            }}
            locale={locale}
          />
        </div>
      </div>
      </div>
    </div>
  );
}
