import prisma from '@/lib/prisma';
import { BackofficeClient } from './waitlist-client';

export default async function WaitlistPage() {
  const waitlistEntries = await prisma.member.findMany({
    where: {
      status: 'PENDING',
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return <BackofficeClient entries={waitlistEntries} />;
}
