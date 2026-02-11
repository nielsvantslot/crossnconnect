import prisma from '@/lib/prisma';
import { BackofficeClient } from './waitlist-client';
// Force dynamic rendering - this page requires database access
export const dynamic = 'force-dynamic';

export default async function WaitlistPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  const waitlistEntries = await prisma.member.findMany({
    where: {
      status: 'PENDING',
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return <BackofficeClient lng={locale} entries={waitlistEntries} />;
}
