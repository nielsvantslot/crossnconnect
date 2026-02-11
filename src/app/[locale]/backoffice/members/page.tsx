import prisma from '@/lib/prisma';
import { MembersClient } from './members-client';

// Force dynamic rendering - this page requires database access
export const dynamic = 'force-dynamic';

export default async function MembersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  const members = await prisma.member.findMany({
    where: {
      status: 'ACCEPTED',
    },
    orderBy: {
      acceptedAt: 'desc',
    },
  });

  return <MembersClient lng={locale} members={members} />;
}
