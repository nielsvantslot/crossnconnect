import Link from 'next/link';
import prisma from '@/lib/prisma';
import { getTranslation } from '@/i18n';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Clock, CheckCircle, XCircle, TrendingUp, Link2 } from 'lucide-react';
import { DashboardChart } from './dashboard-chart';

// Force dynamic rendering - this page requires database access
export const dynamic = 'force-dynamic';

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = await getTranslation(locale, 'common');
  
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
      (c: { clickedAt: Date }) => c.clickedAt >= dayStart && c.clickedAt <= dayEnd
    ).length;
    
    dailyClicks.push({
      date: dayStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      clicks: count,
    });
  }

  const recentMembers = await prisma.member.findMany({
    where: { 
      status: 'ACCEPTED',
      acceptedAt: { not: null }
    },
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
    acceptanceRate: stats._count.id > 0 
      ? Math.round((acceptedCount / stats._count.id) * 100) 
      : 0,
    trackableUrls: trackableUrlsCount,
    totalClicks,
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t('backoffice.dashboard.title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('backoffice.dashboard.welcome')}
        </p>
      </div>

      {/* Membership Overview */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">{t('backoffice.dashboard.membershipOverview')}</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('backoffice.dashboard.totalSignups')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">{t('backoffice.dashboard.allTimeMembers')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('backoffice.dashboard.activeMembers')}</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.accepted}</div>
              <p className="text-xs text-muted-foreground mt-1">{dashboardStats.acceptanceRate}% {t('backoffice.dashboard.acceptanceRateLabel')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('backoffice.dashboard.pendingReview')}</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.pending}</div>
              <p className="text-xs text-muted-foreground mt-1">{t('backoffice.dashboard.awaitingDecision')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('backoffice.dashboard.denied')}</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.denied}</div>
              <p className="text-xs text-muted-foreground mt-1">{t('backoffice.dashboard.rejectedApplications')}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Growth & Marketing */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">{t('backoffice.dashboard.growthMarketing')}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t('backoffice.dashboard.linkVisits')}</CardTitle>
                  <CardDescription className="mt-1">
                    <span className={`font-semibold ${growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {growthRate > 0 ? '+' : ''}{growthRate}%
                    </span>
                    {' '}{t('backoffice.dashboard.growthFromLastWeek')}
                  </CardDescription>
                </div>
                <TrendingUp className={`h-4 w-4 ${growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </CardHeader>
            <CardContent>
              <DashboardChart 
                data={dailyClicks} 
                clicksLabel={t('backoffice.dashboard.clicks')}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('backoffice.dashboard.trackableLinks')}</CardTitle>
              <Link2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.trackableUrls}</div>
              <p className="text-xs text-muted-foreground mt-1">{dashboardStats.totalClicks} {t('backoffice.dashboard.totalClicksLabel')}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-4">{t('backoffice.dashboard.recentActivity')}</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{t('backoffice.dashboard.recentMembers')}</CardTitle>
              <CardDescription>{t('backoffice.dashboard.latestAcceptedMembers')}</CardDescription>
            </div>
            <Link href={`/${locale}/backoffice/members`}>
              <Button variant="ghost" size="sm">
                {t('backoffice.dashboard.viewAll')} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentMembers.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('backoffice.dashboard.noMembersYet')}</p>
            ) : (
              <div className="space-y-3">
                {recentMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div>
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {member.acceptedAt ? new Date(member.acceptedAt).toLocaleDateString(locale) : 'N/A'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{t('backoffice.dashboard.pendingApplications')}</CardTitle>
              <CardDescription>{t('backoffice.dashboard.awaitingYourReview')}</CardDescription>
            </div>
            <Link href={`/${locale}/backoffice/waitlist`}>
              <Button variant="ghost" size="sm">
                {t('backoffice.dashboard.viewAll')} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentPending.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('backoffice.dashboard.noPendingApplications')}</p>
            ) : (
              <div className="space-y-3">
                {recentPending.map((member) => (
                  <div key={member.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div>
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(member.createdAt).toLocaleDateString(locale)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

