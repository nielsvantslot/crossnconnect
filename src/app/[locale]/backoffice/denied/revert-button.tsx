'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RevertButtonProps {
  entryId: string;
  label: string;
}

export function RevertButton({ entryId, label }: RevertButtonProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const revertToPending = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/waitlist/${entryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'PENDING' }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to revert entry:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={revertToPending}
      disabled={isUpdating}
    >
      <RotateCcw className="h-4 w-4 mr-1" />
      {label}
    </Button>
  );
}
