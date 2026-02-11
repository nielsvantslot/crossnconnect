'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Member {
  id: string;
  email: string;
  name: string;
  status: 'PENDING' | 'ACCEPTED' | 'DENIED';
  createdAt: Date;
  updatedAt: Date;
}

interface DeniedClientProps {
  entries: Member[];
}

export function DeniedClient({ entries }: DeniedClientProps) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const revertToPending = async (id: string) => {
    setUpdatingId(id);
    try {
      const response = await fetch(`/api/waitlist/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'PENDING' }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to revert entry:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Denied Applications</h1>
        <p className="text-muted-foreground mt-1">
          Review denied applications - can be reverted to pending
        </p>
      </div>

        <div className="grid gap-6 mb-6 md:grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Denied</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{entries.length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Denied Entries</CardTitle>
            <CardDescription>
              Applications that were denied - can be reverted to pending
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Signed Up
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Denied On
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {entries.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-muted-foreground">
                        No denied entries
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
                          })}
                        </td>
                        <td className="px-6 py-4">
                          {new Date(entry.updatedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => revertToPending(entry.id)}
                            disabled={updatingId === entry.id}
                          >
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Revert to Pending
                          </Button>
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
