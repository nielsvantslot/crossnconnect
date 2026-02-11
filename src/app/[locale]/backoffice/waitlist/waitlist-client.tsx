'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X } from 'lucide-react';
import { useTranslation } from '@/i18n/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Member {
  id: string;
  email: string;
  name: string;
  status: 'PENDING' | 'ACCEPTED' | 'DENIED';
  createdAt: Date;
}

interface BackofficeClientProps {
  lng: string;
  entries: Member[];
}

export function BackofficeClient({ lng, entries }: BackofficeClientProps) {
  const { t } = useTranslation(lng, 'common');
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const updateStatus = async (id: string, status: 'PENDING' | 'ACCEPTED' | 'DENIED') => {
    setUpdatingId(id);
    try {
      const response = await fetch(`/api/waitlist/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl" suppressHydrationWarning>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t('backoffice.waitlist.title')}</h1>
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
            <div className="text-2xl font-bold">{entries.length}</div>
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
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    {t('backoffice.waitlist.table.name')}
                  </th>
                  <th scope="col" className="px-6 py-3">
                    {t('backoffice.waitlist.table.email')}
                  </th>
                  <th scope="col" className="px-6 py-3">
                    {t('backoffice.waitlist.table.signedUp')}
                  </th>
                  <th scope="col" className="px-6 py-3">
                    {t('backoffice.waitlist.table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-muted-foreground">
                      {t('backoffice.waitlist.noPendingEntries')}
                    </td>
                  </tr>
                ) : (
                  entries.map((entry) => (
                    <tr key={entry.id} className="border-b hover:bg-muted/50">
                      <td className="px-6 py-4 font-medium">{entry.name}</td>
                      <td className="px-6 py-4">{entry.email}</td>
                      <td className="px-6 py-4">
                        {new Date(entry.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => updateStatus(entry.id, 'ACCEPTED')}
                            disabled={updatingId === entry.id}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            {t('backoffice.waitlist.accept')}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateStatus(entry.id, 'DENIED')}
                            disabled={updatingId === entry.id}
                          >
                            <X className="h-4 w-4 mr-1" />
                            {t('backoffice.waitlist.deny')}
                          </Button>
                        </div>
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
