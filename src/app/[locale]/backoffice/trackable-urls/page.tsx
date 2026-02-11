import prisma from '@/lib/prisma';
import { TrackableUrlsClient } from './trackable-urls-client';

// Force dynamic rendering - this page requires database access
export const dynamic = 'force-dynamic';

export default async function TrackableUrlsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
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

  return <TrackableUrlsClient lng={locale} urls={urlsWithStats} />;
}
