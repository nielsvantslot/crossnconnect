import prisma from '@/lib/prisma';
import { DashboardClient } from './dashboard-client';

// Force dynamic rendering - this page requires database access
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const [stats, trackableUrlsCount, totalClicks] = await Promise.all([
    prisma.member.aggregate({ _count: { id: true } }),
    prisma.trackableUrl.count(),
    prisma.click.count(),
  ]);

  const [pendingCount, acceptedCount, deniedCount, recentClicksCount, previousWeekClicksCount] = await Promise.all([
    prisma.member.count({ where: { status: 'PENDING' } }),
    prisma.member.count({ where: { status: 'ACCEPTED' } }),
    prisma.member.count({ where: { status: 'DENIED' } }),
    prisma.click.count({
      where: { clickedAt: { gte: sevenDaysAgo } },
    }),
    prisma.click.count({
      where: { clickedAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } },
    }),
  ]);

  // Fetch daily clicks for the last 14 days
  const allClicks = await prisma.click.findMany({
    where: { clickedAt: { gte: fourteenDaysAgo } },
    select: { clickedAt: true },
    orderBy: { clickedAt: 'asc' },
  });

  // Group clicks by day
  const dailyClicks = [];
  for (let i = 13; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dayStart = new Date(date.setHours(0, 0, 0, 0));
    const dayEnd = new Date(date.setHours(23, 59, 59, 999));
    
    const count = allClicks.filter(
      (c) => c.clickedAt >= dayStart && c.clickedAt <= dayEnd
    ).length;
    
    dailyClicks.push({
      date: dayStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      clicks: count,
    });
  }

  const recentMembers = await prisma.member.findMany({
    where: { status: 'ACCEPTED' },
    orderBy: { acceptedAt: 'desc' },
    take: 5,
  });

  const recentPending = await prisma.member.findMany({
    where: { status: 'PENDING' },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  const growthRate = previousWeekClicksCount > 0
    ? Math.round(((recentClicksCount - previousWeekClicksCount) / previousWeekClicksCount) * 100)
    : recentClicksCount > 0 ? 100 : 0;

  const dashboardStats = {
    total: stats._count.id,
    pending: pendingCount,
    accepted: acceptedCount,
    denied: deniedCount,
    recent: recentClicksCount,
    previousWeek: previousWeekClicksCount,
    growthRate,
    acceptanceRate: stats._count.id > 0 
      ? Math.round((acceptedCount / stats._count.id) * 100) 
      : 0,
    trackableUrls: trackableUrlsCount,
    totalClicks,
  };

  return (
    <DashboardClient 
      stats={dashboardStats} 
      recentMembers={recentMembers} 
      recentPending={recentPending}
      dailyClicks={dailyClicks}
    />
  );
}
