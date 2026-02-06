'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Trash2, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TrackableUrl {
  id: string;
  slug: string;
  name: string;
  createdAt: Date;
  totalClicks: number;
  uniqueClicks: number;
  lastClickedAt: Date | null;
}

interface TrackableUrlsClientProps {
  urls: TrackableUrl[];
}

export function TrackableUrlsClient({ urls }: TrackableUrlsClientProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const createUrl = async () => {
    if (!name.trim()) return;

    setCreating(true);
    try {
      const response = await fetch('/api/trackable-urls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        setName('');
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to create trackable URL:', error);
    } finally {
      setCreating(false);
    }
  };

  const deleteUrl = async (id: string) => {
    if (!confirm('Are you sure you want to delete this trackable URL?')) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/trackable-urls/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to delete trackable URL:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const copyUrl = (slug: string) => {
    const url = `${window.location.origin}/trk/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Trackable URLs</h1>
        <p className="text-muted-foreground mt-1">
          Create and manage trackable signup links
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Create New Trackable URL</CardTitle>
          <CardDescription>
            Generate a unique link to track signups from different sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="name">Campaign Name</Label>
              <Input
                id="name"
                placeholder="e.g., Twitter Campaign, Email Newsletter"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && createUrl()}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={createUrl} disabled={creating || !name.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Create Link
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 mb-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Links
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{urls.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Clicks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {urls.reduce((sum, url) => sum + url.totalClicks, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unique Visitors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {urls.reduce((sum, url) => sum + url.uniqueClicks, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Trackable Links</CardTitle>
          <CardDescription>
            All your trackable URLs and their performance
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
                    URL
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Total Clicks
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Unique Clicks
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Last Clicked
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {urls.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-muted-foreground">
                      No trackable URLs yet. Create one above!
                    </td>
                  </tr>
                ) : (
                  urls.map((url) => (
                    <tr key={url.id} className="border-b hover:bg-muted/50">
                      <td className="px-6 py-4 font-medium">{url.name}</td>
                      <td className="px-6 py-4">
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          /trk/{url.slug}
                        </code>
                      </td>
                      <td className="px-6 py-4">{url.totalClicks}</td>
                      <td className="px-6 py-4">{url.uniqueClicks}</td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {url.lastClickedAt
                          ? new Date(url.lastClickedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : 'Never'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyUrl(url.slug)}
                            disabled={copiedSlug === url.slug}
                          >
                            {copiedSlug === url.slug ? (
                              <>
                                <Check className="h-4 w-4 mr-1" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4 mr-1" />
                                Copy
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteUrl(url.id)}
                            disabled={deletingId === url.id}
                          >
                            <Trash2 className="h-4 w-4" />
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
