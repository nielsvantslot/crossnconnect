'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslation } from '@/i18n/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Clock, CheckCircle, XCircle, TrendingUp, Link2 } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';

interface DashboardStats {
  total: number;
  pending: number;
  accepted: number;
  denied: number;
  recent: number;
  previousWeek: number;
  growthRate: number;
  acceptanceRate: number;
  trackableUrls: number;
  totalClicks: number;
}

interface Member {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  acceptedAt: Date | null;
}

interface DailyClick {
  date: string;
  clicks: number;
}

interface DashboardClientProps {
  lng: string;
  stats: DashboardStats;
  recentMembers: Member[];
  recentPending: Member[];
  dailyClicks: DailyClick[];
}

export function DashboardClient({ lng, stats, recentMembers, recentPending, dailyClicks }: DashboardClientProps) {
  const { t } = useTranslation(lng, 'common');
  const params = useParams();
  const locale = params.locale as string;
  
  return (
    <div className="container mx-auto p-6 max-w-7xl" suppressHydrationWarning>
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
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">{t('backoffice.dashboard.allTimeMembers')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('backoffice.dashboard.activeMembers')}</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.accepted}</div>
              <p className="text-xs text-muted-foreground mt-1">{stats.acceptanceRate}% {t('backoffice.dashboard.acceptanceRateLabel')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('backoffice.dashboard.pendingReview')}</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground mt-1">{t('backoffice.dashboard.awaitingDecision')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('backoffice.dashboard.denied')}</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.denied}</div>
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
                    <span className={`font-semibold ${stats.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stats.growthRate > 0 ? '+' : ''}{stats.growthRate}%
                    </span>
                    {' '}{t('backoffice.dashboard.growthFromLastWeek')}
                  </CardDescription>
                </div>
                <TrendingUp className={`h-4 w-4 ${stats.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  clicks: {
                    label: t('backoffice.dashboard.clicks'),
                    color: "hsl(var(--primary))",
                  },
                }}
                className="h-[200px] w-full"
              >
                <AreaChart data={dailyClicks}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    allowDecimals={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="clicks" 
                    stroke="var(--color-clicks)" 
                    fill="var(--color-clicks)"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('backoffice.dashboard.trackableLinks')}</CardTitle>
              <Link2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.trackableUrls}</div>
              <p className="text-xs text-muted-foreground mt-1">{stats.totalClicks} {t('backoffice.dashboard.totalClicksLabel')}</p>
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
