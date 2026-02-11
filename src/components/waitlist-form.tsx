'use client';

import { useState } from 'react';
import { useTranslation } from '@/i18n/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function WaitlistForm({ lng }: { lng: string }) {
  const { t } = useTranslation(lng, 'common');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: t('waitlist.successMessage') });
        setEmail('');
        setName('');
      } else {
        setMessage({ type: 'error', text: data.error || t('waitlist.errorGeneric') });
      }
    } catch {
      setMessage({ type: 'error', text: t('waitlist.errorMessage') });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-normal text-slate-600 dark:text-slate-400">
            {t('waitlist.nameLabel')}
          </Label>
          <Input
            id="name"
            type="text"
            placeholder={t('waitlist.namePlaceholder')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
            className="h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-md text-base"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-normal text-slate-600 dark:text-slate-400">
            {t('waitlist.emailLabel')}
          </Label>
          <Input
            id="email"
            type="email"
            placeholder={t('waitlist.emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-md text-base"
          />
        </div>

        {message && (
          <div
            className={`p-4 rounded-md text-sm ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/50 dark:text-green-400 dark:border-green-900'
                : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900'
            }`}
          >
            {message.text}
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full h-12 text-white text-base font-semibold rounded-md shadow-none" 
          disabled={isLoading}
        >
          {isLoading ? t('waitlist.submitting') : t('waitlist.submitButton')}
        </Button>
      </form>
    </div>
  );
}
