'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { Users, Clock, LogOut, User, LayoutDashboard, Link2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
  translations: {
    dashboard: string;
    membership: string;
    waitlist: string;
    members: string;
    denied: string;
    marketing: string;
    trackableUrls: string;
    signOut: string;
  };
}

export function Sidebar({ user, translations: t }: SidebarProps) {
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string;

  const dashboardItem = {
    href: `/${locale}/backoffice/dashboard`,
    label: t.dashboard,
    icon: LayoutDashboard,
    active: pathname === `/${locale}/backoffice/dashboard` || pathname === `/${locale}/backoffice`,
  };

  const membershipItems = [
    {
      href: `/${locale}/backoffice/waitlist`,
      label: t.waitlist,
      icon: Clock,
      active: pathname === `/${locale}/backoffice/waitlist`,
    },
    {
      href: `/${locale}/backoffice/members`,
      label: t.members,
      icon: Users,
      active: pathname === `/${locale}/backoffice/members`,
    },
    {
      href: `/${locale}/backoffice/denied`,
      label: t.denied,
      icon: XCircle,
      active: pathname === `/${locale}/backoffice/denied`,
    },
  ];

  const marketingItems = [
    {
      href: `/${locale}/backoffice/trackable-urls`,
      label: t.trackableUrls,
      icon: Link2,
      active: pathname === `/${locale}/backoffice/trackable-urls`,
    },
  ];

  return (
    <div className="flex h-dvh w-64 flex-col border-r bg-background shadow-lg md:shadow-none">
      <div className="flex h-16 items-center border-b pl-16 pr-4 md:px-6">
        <h2 className="text-lg md:text-xl font-bold">Cross & Connect</h2>
      </div>

      <nav className="flex-1 space-y-4 p-3 md:p-4 overflow-y-auto">
        {/* Dashboard */}
        <div>
          <Link href={dashboardItem.href}>
            <div
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                dashboardItem.active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <LayoutDashboard className="h-5 w-5" />
              {dashboardItem.label}
            </div>
          </Link>
        </div>

        {/* Membership */}
        <div>
          <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t.membership}
          </h3>
          <div className="space-y-1">
            {membershipItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                      item.active
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Marketing */}
        <div>
          <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t.marketing}
          </h3>
          <div className="space-y-1">
            {marketingItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                      item.active
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="border-t p-3 md:p-4">
        <div className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 mb-3">
          <User className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => signOut({ callbackUrl: `/${locale}/backoffice` })}
        >
          <LogOut className="h-4 w-4 mr-2" />
          {t.signOut}
        </Button>
      </div>
    </div>
  );
}
