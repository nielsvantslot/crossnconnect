import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';
import { hashIPAddress } from '@/lib/ip-hash';

export default async function JoinPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
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
  const ipAddress = forwarded?.split(',')[0].trim() || realIp || '0.0.0.0';
  const userAgent = headersList.get('user-agent') || null;

  // Hash IP for privacy (GDPR compliant)
  const ipAddressHash = hashIPAddress(ipAddress);

  // Track the click
  await prisma.click.create({
    data: {
      trackableUrlId: trackableUrl.id,
      ipAddressHash,  // Store hash instead of plain IP
      userAgent,
    },
  });

  // Redirect to the main signup page
  redirect('/');
}
