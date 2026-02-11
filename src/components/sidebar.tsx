'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { useTranslation } from '@/i18n/client';
import { Users, Clock, LogOut, User, LayoutDashboard, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string;
  const { t } = useTranslation(locale, 'common');

  const dashboardItem = {
    href: `/${locale}/backoffice/dashboard`,
    label: t('backoffice.sidebar.dashboard'),
    icon: LayoutDashboard,
    active: pathname === `/${locale}/backoffice/dashboard` || pathname === `/${locale}/backoffice`,
  };

  const membershipItems = [
    {
      href: `/${locale}/backoffice/waitlist`,
      label: t('backoffice.sidebar.waitlist'),
      icon: Clock,
      active: pathname === `/${locale}/backoffice/waitlist`,
    },
    {
      href: `/${locale}/backoffice/members`,
      label: t('backoffice.sidebar.members'),
      icon: Users,
      active: pathname === `/${locale}/backoffice/members`,
    },
  ];

  const marketingItems = [
    {
      href: `/${locale}/backoffice/trackable-urls`,
      label: t('backoffice.sidebar.trackableUrls'),
      icon: Link2,
      active: pathname === `/${locale}/backoffice/trackable-urls`,
    },
  ];

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <h2 className="text-xl font-bold">Cross & Connect</h2>
      </div>

      <nav className="flex-1 space-y-4 p-4">
        {/* Dashboard */}
        <div>
          <Link href={dashboardItem.href}>
            <div
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
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
            Membership
          </h3>
          <div className="space-y-1">
            {membershipItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
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
            Marketing
          </h3>
          <div className="space-y-1">
            {marketingItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
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

      <div className="border-t p-4">
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
          {t('backoffice.sidebar.signOut')}
        </Button>
      </div>
    </div>
  );
}
