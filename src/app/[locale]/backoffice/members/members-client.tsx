'use client';

import { useTranslation } from '@/i18n/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Member {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  acceptedAt: Date | null;
}

interface MembersClientProps {
  lng: string;
  members: Member[];
}

export function MembersClient({ lng, members }: MembersClientProps) {
  const { t } = useTranslation(lng, 'common');
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t('backoffice.members.title')}</h1>
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
              <div className="text-2xl font-bold">
                {
                  members.filter((member) => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return member.acceptedAt && new Date(member.acceptedAt) > weekAgo;
                  }).length
                }
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">{t('backoffice.members.today')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  members.filter((member) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return member.acceptedAt && new Date(member.acceptedAt) >= today;
                  }).length
                }
              </div>
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
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      {t('backoffice.members.table.name')}
                    </th>
                    <th scope="col" className="px-6 py-3">
                      {t('backoffice.members.table.email')}
                    </th>
                    <th scope="col" className="px-6 py-3">
                      {t('backoffice.members.table.joined')}
                    </th>
                    <th scope="col" className="px-6 py-3">
                      {t('backoffice.members.table.signedUp')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {members.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-muted-foreground">
                        {t('backoffice.members.noMembers')}
                      </td>
                    </tr>
                  ) : (
                    members.map((member) => (
                      <tr key={member.id} className="border-b hover:bg-muted/50">
                        <td className="px-6 py-4 font-medium">{member.name}</td>
                        <td className="px-6 py-4">{member.email}</td>
                        <td className="px-6 py-4">
                          {member.acceptedAt ? new Date(member.acceptedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          }) : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {new Date(member.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
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
