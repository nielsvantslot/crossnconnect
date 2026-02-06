import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';

export default async function JoinPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trackableUrl = await prisma.trackableUrl.findUnique({
    where: { slug },
  });

  if (!trackableUrl) {
    notFound();
  }

  // Get client IP and user agent
  const headersList = await headers();
  const forwarded = headersList.get('x-forwarded-for');
  const realIp = headersList.get('x-real-ip');
  const ipAddress = forwarded?.split(',')[0] || realIp || null;
  const userAgent = headersList.get('user-agent') || null;

  // Track the click
  await prisma.click.create({
    data: {
      trackableUrlId: trackableUrl.id,
      ipAddress,
      userAgent,
    },
  });

  // Redirect to the main signup page
  redirect('/');
}
