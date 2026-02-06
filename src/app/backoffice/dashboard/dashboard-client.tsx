'use client';

import Link from 'next/link';
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
  stats: DashboardStats;
  recentMembers: Member[];
  recentPending: Member[];
  dailyClicks: DailyClick[];
}

export function DashboardClient({ stats, recentMembers, recentPending, dailyClicks }: DashboardClientProps) {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's your waitlist overview
        </p>
      </div>

      {/* Membership Overview */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Membership Overview</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Signups</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">All-time members</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Members</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.accepted}</div>
              <p className="text-xs text-muted-foreground mt-1">{stats.acceptanceRate}% acceptance rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting decision</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Denied</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.denied}</div>
              <p className="text-xs text-muted-foreground mt-1">Rejected applications</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Growth & Marketing */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Growth & Marketing</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Link Visits (14 days)</CardTitle>
                  <CardDescription className="mt-1">
                    <span className={`font-semibold ${stats.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stats.growthRate > 0 ? '+' : ''}{stats.growthRate}%
                    </span>
                    {' '}growth from last week
                  </CardDescription>
                </div>
                <TrendingUp className={`h-4 w-4 ${stats.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  clicks: {
                    label: "Clicks",
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
              <CardTitle className="text-sm font-medium">Trackable Links</CardTitle>
              <Link2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.trackableUrls}</div>
              <p className="text-xs text-muted-foreground mt-1">{stats.totalClicks} total clicks</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Members</CardTitle>
              <CardDescription>Latest accepted members</CardDescription>
            </div>
            <Link href="/backoffice/members">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentMembers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No members yet</p>
            ) : (
              <div className="space-y-3">
                {recentMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div>
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {member.acceptedAt ? new Date(member.acceptedAt).toLocaleDateString() : 'N/A'}
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
              <CardTitle>Pending Applications</CardTitle>
              <CardDescription>Awaiting your review</CardDescription>
            </div>
            <Link href="/backoffice/waitlist">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentPending.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending applications</p>
            ) : (
              <div className="space-y-3">
                {recentPending.map((member) => (
                  <div key={member.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div>
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(member.createdAt).toLocaleDateString()}
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
