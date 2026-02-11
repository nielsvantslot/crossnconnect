'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';

interface ResponsiveLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export function ResponsiveLayout({ sidebar, children }: ResponsiveLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes (user clicked a link)
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Handle mobile viewport height with dynamic browser chrome
  useEffect(() => {
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    
    return () => window.removeEventListener('resize', setViewportHeight);
  }, []);

  return (
    <div className="flex overflow-hidden" style={{ height: 'calc(var(--vh, 1vh) * 100)' }}>
      {/* Mobile menu button - stays in fixed position */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-3 left-3 z-50 md:hidden bg-background shadow-lg hover:bg-accent border-2"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - hidden on mobile by default, slides in when menu is open */}
      <div
        className={`
          fixed md:static inset-y-0 left-0 z-40
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {sidebar}
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pt-14 md:pt-0">
        {children}
      </main>
    </div>
  );
}
