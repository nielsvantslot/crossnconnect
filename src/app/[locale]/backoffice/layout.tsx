import { auth } from '@/lib/auth';
import { getTranslation } from '@/i18n';
import { Sidebar } from '@/components/sidebar';

export default async function BackofficeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const session = await auth();
  const { locale } = await params;
  const { t } = await getTranslation(locale, 'common');

  // If not logged in, render children without layout (for login page)
  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar 
        user={session.user!} 
        translations={{
          dashboard: t('backoffice.sidebar.dashboard'),
          membership: t('backoffice.sidebar.membership'),
          waitlist: t('backoffice.sidebar.waitlist'),
          members: t('backoffice.sidebar.members'),
          denied: t('backoffice.sidebar.denied'),
          marketing: t('backoffice.sidebar.marketing'),
          trackableUrls: t('backoffice.sidebar.trackableUrls'),
          signOut: t('backoffice.sidebar.signOut'),
        }}
      />
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        {children}
      </main>
    </div>
  );
}
