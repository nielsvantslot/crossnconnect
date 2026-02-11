'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  entryId: string;
  acceptLabel: string;
  denyLabel: string;
}

export function ActionButtons({ entryId, acceptLabel, denyLabel }: ActionButtonsProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const updateStatus = async (status: 'ACCEPTED' | 'DENIED') => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/waitlist/${entryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="default"
        onClick={() => updateStatus('ACCEPTED')}
        disabled={isUpdating}
      >
        <Check className="h-4 w-4 mr-1" />
        {acceptLabel}
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => updateStatus('DENIED')}
        disabled={isUpdating}
      >
        <X className="h-4 w-4 mr-1" />
        {denyLabel}
      </Button>
    </div>
  );
}
