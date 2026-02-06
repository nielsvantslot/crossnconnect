import prisma from '@/lib/prisma';
import { MembersClient } from './members-client';

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
