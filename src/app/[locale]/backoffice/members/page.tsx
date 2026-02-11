import prisma from '@/lib/prisma';
import { getTranslation } from '@/i18n';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Force dynamic rendering - this  page requires database access
export const dynamic = 'force-dynamic';

export default async function MembersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = await getTranslation(locale, 'common');
  
  const members = await prisma.member.findMany({
    where: {
      status: 'ACCEPTED',
    },
    orderBy: {
      acceptedAt: 'desc',
    },
  });

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const thisWeekCount = members.filter((member) => 
    member.acceptedAt && new Date(member.acceptedAt) > weekAgo
  ).length;

  const todayCount = members.filter((member) => 
    member.acceptedAt && new Date(member.acceptedAt) >= today
  ).length;

  return (
    <div className="container mx-auto px-4 py-2 sm:p-6 max-w-6xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">{t('backoffice.members.title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('backoffice.members.description')}
        </p>
      </div>

      <div className="grid gap-6 mb-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">{t('backoffice.members.totalMembers')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{members.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">{t('backoffice.members.thisWeek')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{thisWeekCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">{t('backoffice.members.today')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('backoffice.members.clubMembers')}</CardTitle>
          <CardDescription>
            {t('backoffice.members.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted">
                <tr>
                  <th scope="col" className="px-3 sm:px-6 py-3">
                    {t('backoffice.members.table.name')}
                  </th>
                  <th scope="col" className="px-3 sm:px-6 py-3">
                    {t('backoffice.members.table.email')}
                  </th>
                  <th scope="col" className="px-3 sm:px-6 py-3 hidden md:table-cell">
                    {t('backoffice.members.table.joinedDate')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {members.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-3 sm:px-6 py-4 text-center text-muted-foreground">
                      {t('backoffice.members.noMembersYet')}
                    </td>
                  </tr>
                ) : (
                  members.map((member) => (
                    <tr key={member.id} className="border-b hover:bg-muted/50">
                      <td className="px-3 sm:px-6 py-4 font-medium">{member.name}</td>
                      <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">{member.email}</td>
                      <td className="px-3 sm:px-6 py-4 hidden md:table-cell text-xs sm:text-sm">
                        {member.acceptedAt
                          ? new Date(member.acceptedAt).toLocaleDateString(locale, {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                          : t('common.notAvailable')}
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
