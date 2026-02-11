'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CreateUrlFormProps {
  nameLabel: string;
  namePlaceholder: string;
  createButtonLabel: string;
}

export function CreateUrlForm({ nameLabel, namePlaceholder, createButtonLabel }: CreateUrlFormProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);

  const createUrl = async () => {
    if (!name.trim()) return;

    setCreating(true);
    try {
      const response = await fetch('/api/trackable-urls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        setName('');
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to create trackable URL:', error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <Label htmlFor="url-name">{nameLabel}</Label>
        <Input
          id="url-name"
          placeholder={namePlaceholder}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && createUrl()}
        />
      </div>
      <div className="pt-8">
        <Button onClick={createUrl} disabled={!name.trim() || creating}>
          <Plus className="h-4 w-4 mr-2" />
          {createButtonLabel}
        </Button>
      </div>
    </div>
  );
}
