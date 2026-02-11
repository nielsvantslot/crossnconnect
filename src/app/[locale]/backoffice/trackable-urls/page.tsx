import prisma from '@/lib/prisma';
import { getTranslation } from '@/i18n';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateUrlForm } from './create-url-form';
import { UrlActions } from './url-actions';

// Force dynamic rendering - this page requires database access
export const dynamic = 'force-dynamic';

export default async function TrackableUrlsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = await getTranslation(locale, 'common');

  const urls = await prisma.trackableUrl.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      clicks: {
        select: {
          id: true,
          ipAddress: true,
          clickedAt: true,
        },
      },
    },
  });

  // Add stats to each URL
  const urlsWithStats = urls.map((url) => ({
    id: url.id,
    slug: url.slug,
    name: url.name,
    createdAt: url.createdAt,
    totalClicks: url.clicks.length,
    uniqueClicks: new Set(url.clicks.map((c) => c.ipAddress).filter(Boolean)).size,
    lastClickedAt: url.clicks.length > 0 
      ? url.clicks.sort((a, b) => b.clickedAt.getTime() - a.clickedAt.getTime())[0].clickedAt
      : null,
  }));

  return (
    <div className="container mx-auto px-4 py-2 sm:p-6 max-w-6xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">{t('backoffice.trackableUrls.title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('backoffice.trackableUrls.description')}
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t('backoffice.trackableUrls.createNew')}</CardTitle>
          <CardDescription>
            {t('backoffice.trackableUrls.generateDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateUrlForm
            nameLabel={t('backoffice.trackableUrls.nameLabel')}
            namePlaceholder={t('backoffice.trackableUrls.namePlaceholder')}
            createButtonLabel={t('backoffice.trackableUrls.create')}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('backoffice.trackableUrls.existingUrls')}</CardTitle>
          <CardDescription>
            {t('backoffice.trackableUrls.manageDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted">
                <tr>
                  <th scope="col" className="px-3 sm:px-6 py-3">
                    {t('backoffice.trackableUrls.table.name')}
                  </th>
                  <th scope="col" className="px-3 sm:px-6 py-3">
                    {t('backoffice.trackableUrls.table.slug')}
                  </th>
                  <th scope="col" className="px-3 sm:px-6 py-3 hidden sm:table-cell">
                    {t('backoffice.trackableUrls.table.totalClicks')}
                  </th>
                  <th scope="col" className="px-3 sm:px-6 py-3 hidden lg:table-cell">
                    {t('backoffice.trackableUrls.table.uniqueClicks')}
                  </th>
                  <th scope="col" className="px-3 sm:px-6 py-3 hidden md:table-cell">
                    {t('backoffice.trackableUrls.table.lastClicked')}
                  </th>
                  <th scope="col" className="px-3 sm:px-6 py-3">
                    {t('backoffice.trackableUrls.table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {urlsWithStats.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-3 sm:px-6 py-4 text-center text-muted-foreground">
                      {t('backoffice.trackableUrls.noUrlsYet')}
                    </td>
           </tr>
                ) : (
                  urlsWithStats.map((url) => (
                    <tr key={url.id} className="border-b hover:bg-muted/50">
                      <td className="px-3 sm:px-6 py-4 font-medium">{url.name}</td>
                      <td className="px-3 sm:px-6 py-4 text-xs font-mono text-muted-foreground">
                        /trk/{url.slug}
                      </td>
                      <td className="px-3 sm:px-6 py-4 hidden sm:table-cell">{url.totalClicks}</td>
                      <td className="px-3 sm:px-6 py-4 hidden lg:table-cell">{url.uniqueClicks}</td>
                      <td className="px-3 sm:px-6 py-4 hidden md:table-cell text-xs sm:text-sm">
                        {url.lastClickedAt
                          ? new Date(url.lastClickedAt).toLocaleDateString(locale, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : t('backoffice.trackableUrls.never')}
                      </td>
                      <td className="px-3 sm:px-6 py-4">
                        <UrlActions
                          urlId={url.id}
                          slug={url.slug}
                          copyLabel={t('backoffice.trackableUrls.copy')}
                          deleteLabel={t('backoffice.trackableUrls.delete')}
                          deleteConfirm={t('backoffice.trackableUrls.confirmDelete')}
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
