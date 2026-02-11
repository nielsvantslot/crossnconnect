import { auth } from '@/lib/auth';
import { getTranslation } from '@/i18n';
import { Sidebar } from '@/components/sidebar';
import { ResponsiveLayout } from '@/components/responsive-layout';

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
    <ResponsiveLayout
      sidebar={
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
      }
    >
      {children}
    </ResponsiveLayout>
  );
}
