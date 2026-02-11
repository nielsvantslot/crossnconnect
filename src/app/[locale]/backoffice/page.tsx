import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getTranslation } from '@/i18n';
import { LoginForm } from './login-form';

export default async function BackofficePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const session = await auth();
  const { locale } = await params;
  const { t } = await getTranslation(locale, 'common');

  if (session) {
    redirect(`/${locale}/backoffice/dashboard`);
  }

  return (
    <LoginForm 
      translations={{
        title: t('backoffice.login.title'),
        description: t('backoffice.login.description'),
        emailLabel: t('backoffice.login.emailLabel'),
        emailPlaceholder: t('backoffice.login.emailPlaceholder'),
        passwordLabel: t('backoffice.login.passwordLabel'),
        passwordPlaceholder: t('backoffice.login.passwordPlaceholder'),
        submitButton: t('backoffice.login.submitButton'),
        signingIn: t('backoffice.login.signingIn'),
        invalidCredentials: t('backoffice.login.invalidCredentials'),
        errorGeneric: t('backoffice.login.errorGeneric'),
      }}
    />
  );
}

