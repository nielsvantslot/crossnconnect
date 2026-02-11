import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface NotFoundContentProps {
  locale: string;
  translations: {
    title: string;
    description: string;
    backToHome: string;
  };
}

export function NotFoundContent({ locale, translations: t }: NotFoundContentProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="text-center px-8">
        <h1 className="text-9xl font-bold mb-4 text-slate-900 dark:text-white">404</h1>
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-white">
          {t.title}
        </h2>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
          {t.description}
        </p>
        <Link href={`/${locale}`}>
          <Button size="lg" className="font-semibold">
            {t.backToHome}
          </Button>
        </Link>
      </div>
    </div>
  );
}
