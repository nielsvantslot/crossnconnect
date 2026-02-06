import prisma from '@/lib/prisma';
import { DeniedClient } from './denied-client';

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
