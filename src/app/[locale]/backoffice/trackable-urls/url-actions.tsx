'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UrlActionsProps {
  urlId: string;
  slug: string;
  copyLabel: string;
  deleteLabel: string;
  deleteConfirm: string;
}

export function UrlActions({ urlId, slug, copyLabel, deleteLabel, deleteConfirm }: UrlActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  const deleteUrl = async () => {
    if (!confirm(deleteConfirm)) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/trackable-urls/${urlId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to delete:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const copyUrl = () => {
    const url = `${window.location.origin}/trk/${slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={copyUrl}
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 mr-1" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4 mr-1" />
            {copyLabel}
          </>
        )}
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={deleteUrl}
        disabled={isDeleting}
      >
        <Trash2 className="h-4 w-4 mr-1" />
        {deleteLabel}
      </Button>
    </div>
  );
}
