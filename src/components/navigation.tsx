'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationProps {
  locale: string;
  translations: {
    ourStory: string;
  };
}

interface MenuItem {
  href: string;
  label: string;
}

export function Navigation({ locale, translations: t }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    { href: `/${locale}/our-story`, label: t.ourStory },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed left-1/2 -translate-x-1/2 z-[100] transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        scrolled ? 'top-3' : 'top-5'
      }`}
      style={{
        borderRadius: '100px',
        backgroundColor: scrolled ? 'rgba(12, 11, 18, 0.85)' : 'rgba(12, 11, 18, 0.6)',
        backdropFilter: 'blur(24px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        boxShadow: scrolled
          ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
          : '0 4px 24px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
      }}
    >
      <div className="flex items-center gap-8 pl-6 pr-3 py-2">
        {/* Logo + Brand Name */}
        <Link 
          href={`/${locale}`}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity duration-150"
        >
          <Image src="/logo.png" alt="Cross & Connect" width={200} height={48} className="h-12 w-auto" />
        </Link>

        {/* Nav links - rechts van het logo, in dezelfde pill */}
        {menuItems.length > 0 && (
          <div className="flex site-nav items-center gap-1 ml-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || pathname === `/${locale}${item.href}`;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-1.5 text-[13px] font-medium rounded-full transition-all duration-150 ease-out whitespace-nowrap ${
                    isActive
                      ? 'text-white bg-white/10'
                      : 'text-white/60 hover:text-white/90 hover:bg-white/[0.06]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
