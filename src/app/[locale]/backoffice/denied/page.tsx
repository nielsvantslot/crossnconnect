import prisma from '@/lib/prisma';
import { DeniedClient } from './denied-client';

// Force dynamic rendering - this page requires database access
export const dynamic = 'force-dynamic';

export default async function DeniedPage() {
  const deniedEntries = await prisma.member.findMany({
    where: {
      status: 'DENIED',
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return <DeniedClient entries={deniedEntries} />;
}
