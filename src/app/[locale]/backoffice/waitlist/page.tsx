import prisma from '@/lib/prisma';
import { getTranslation } from '@/i18n';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ActionButtons } from './action-buttons';

// Force dynamic rendering - this page requires database access
export const dynamic = 'force-dynamic';

export default async function WaitlistPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = await getTranslation(locale, 'common');
  
  const waitlistEntries = await prisma.member.findMany({
    where: {
      status: 'PENDING',
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="container mx-auto px-4 py-2 sm:p-6 max-w-6xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">{t('backoffice.waitlist.title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('backoffice.waitlist.description')}
        </p>
      </div>

      <div className="grid gap-6 mb-6 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">{t('backoffice.waitlist.pendingReview')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{waitlistEntries.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('backoffice.waitlist.pendingApplications')}</CardTitle>
          <CardDescription>
            {t('backoffice.waitlist.reviewAndTakeAction')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted">
                <tr>
                  <th scope="col" className="px-3 sm:px-6 py-3">
                    {t('backoffice.waitlist.table.name')}
                  </th>
                  <th scope="col" className="px-3 sm:px-6 py-3">
                    {t('backoffice.waitlist.table.email')}
                  </th>
                  <th scope="col" className="px-3 sm:px-6 py-3 hidden md:table-cell">
                    {t('backoffice.waitlist.table.signedUp')}
                  </th>
                  <th scope="col" className="px-3 sm:px-6 py-3">
                    {t('backoffice.waitlist.table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {waitlistEntries.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 sm:px-6 py-4 text-center text-muted-foreground">
                      {t('backoffice.waitlist.noPendingEntries')}
                    </td>
                  </tr>
                ) : (
                  waitlistEntries.map((entry) => (
                    <tr key={entry.id} className="border-b hover:bg-muted/50">
                      <td className="px-3 sm:px-6 py-4 font-medium">{entry.name}</td>
                      <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">{entry.email}</td>
                      <td className="px-3 sm:px-6 py-4 hidden md:table-cell text-xs sm:text-sm">
                        {new Date(entry.createdAt).toLocaleDateString(locale, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-3 sm:px-6 py-4">
                        <ActionButtons 
                          entryId={entry.id}
                          acceptLabel={t('backoffice.waitlist.accept')}
                          denyLabel={t('backoffice.waitlist.deny')}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
