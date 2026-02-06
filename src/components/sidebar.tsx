'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Clock, X as XIcon, LogOut, User, LayoutDashboard, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  const dashboardItem = {
    href: '/backoffice/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    active: pathname === '/backoffice/dashboard' || pathname === '/backoffice',
  };

  const membershipItems = [
    {
      href: '/backoffice/waitlist',
      label: 'Waitlist',
      icon: Clock,
      active: pathname === '/backoffice/waitlist',
    },
    {
      href: '/backoffice/members',
      label: 'Members',
      icon: Users,
      active: pathname === '/backoffice/members',
    },
    {
      href: '/backoffice/denied',
      label: 'Denied',
      icon: XIcon,
      active: pathname === '/backoffice/denied',
    },
  ];

  const marketingItems = [
    {
      href: '/backoffice/trackable-urls',
      label: 'Trackable URLs',
      icon: Link2,
      active: pathname === '/backoffice/trackable-urls',
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
          onClick={() => signOut({ callbackUrl: '/backoffice' })}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
