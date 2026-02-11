import prisma from '@/lib/prisma';
import { MembersClient } from './members-client';

// Force dynamic rendering - this page requires database access
export const dynamic = 'force-dynamic';

export default async function MembersPage() {
  const members = await prisma.member.findMany({
    where: {
      status: 'ACCEPTED',
    },
    orderBy: {
      acceptedAt: 'desc',
    },
  });

  return <MembersClient members={members} />;
}
