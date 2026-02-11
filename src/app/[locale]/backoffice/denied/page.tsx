import prisma from '@/lib/prisma';
import { getTranslation } from '@/i18n';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RevertButton } from './revert-button';

// Force dynamic rendering - this page requires database access
export const dynamic = 'force-dynamic';

export default async function DeniedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = await getTranslation(locale, 'common');

  const deniedEntries = await prisma.member.findMany({
    where: {
      status: 'DENIED',
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t('backoffice.denied.title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('backoffice.denied.description')}
        </p>
      </div>

      <div className="grid gap-6 mb-6 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">{t('backoffice.denied.totalDenied')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deniedEntries.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('backoffice.denied.entriesTitle')}</CardTitle>
          <CardDescription>
            {t('backoffice.denied.entriesDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    {t('backoffice.denied.name')}
                  </th>
                  <th scope="col" className="px-6 py-3">
                    {t('backoffice.denied.email')}
                  </th>
                  <th scope="col" className="px-6 py-3">
                    {t('backoffice.denied.signedUp')}
                  </th>
                  <th scope="col" className="px-6 py-3">
                    {t('backoffice.denied.deniedOn')}
                  </th>
                  <th scope="col" className="px-6 py-3">
                    {t('backoffice.denied.actions')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {deniedEntries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-muted-foreground">
                      {t('backoffice.denied.noDeniedEntries')}
                    </td>
                  </tr>
                ) : (
                  deniedEntries.map((entry) => (
                    <tr key={entry.id} className="border-b hover:bg-muted/50">
                      <td className="px-6 py-4 font-medium">{entry.name}</td>
                      <td className="px-6 py-4">{entry.email}</td>
                      <td className="px-6 py-4">
                        {new Date(entry.createdAt).toLocaleDateString(locale, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(entry.updatedAt).toLocaleDateString(locale, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <RevertButton
                          entryId={entry.id}
                          label={t('backoffice.denied.revertToPending')}
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
