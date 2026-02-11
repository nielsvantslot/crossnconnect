'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface WaitlistFormProps {
  translations: {
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    joinButton: string;
    successMessage: string;
    errorMessage: string;
    errorGeneric: string;
  };
}

export function WaitlistForm({ translations: t }: WaitlistFormProps) {
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
        setMessage({ type: 'success', text: t.successMessage });
        setEmail('');
        setName('');
      } else {
        setMessage({ type: 'error', text: data.error || t.errorGeneric });
      }
    } catch {
      setMessage({ type: 'error', text: t.errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-normal text-slate-600 dark:text-slate-400">
            {t.nameLabel}
          </Label>
          <Input
            id="name"
            type="text"
            placeholder={t.namePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-normal text-slate-600 dark:text-slate-400">
            {t.emailLabel}
          </Label>
          <Input
            id="email"
            type="email"
            placeholder={t.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
          />
        </div>
        <Button 
          type="submit" 
          className="w-full bg-white text-purple-700 hover:bg-slate-100 font-semibold"
          disabled={isLoading}
        >
          {isLoading ? '...' : t.joinButton}
        </Button>
        {message && (
          <div
            className={`p-3 rounded-md text-sm ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
            }`}
          >
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
}
