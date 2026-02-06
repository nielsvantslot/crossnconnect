import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Generate a random slug
function generateSlug(length = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// GET /api/trackable-urls - Get all trackable URLs with stats
export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const urls = await prisma.trackableUrl.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        clicks: {
          select: {
            id: true,
            ipAddress: true,
            clickedAt: true,
          },
        },
      },
    });

    // Add stats to each URL
    const urlsWithStats = urls.map((url: any) => ({
      id: url.id,
      slug: url.slug,
      name: url.name,
      createdAt: url.createdAt,
      totalClicks: url.clicks.length,
      uniqueClicks: new Set(url.clicks.map((c: any) => c.ipAddress).filter(Boolean)).size,
      lastClickedAt: url.clicks.length > 0 
        ? url.clicks[url.clicks.length - 1].clickedAt 
        : null,
    }));

    return NextResponse.json(urlsWithStats);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch trackable URLs' },
      { status: 500 }
    );
  }
}

// POST /api/trackable-urls - Create a new trackable URL
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Generate unique slug
    let slug = generateSlug();
    let attempts = 0;
    while (attempts < 10) {
      const existing = await prisma.trackableUrl.findUnique({
        where: { slug },
      });
      if (!existing) break;
      slug = generateSlug();
      attempts++;
    }

    if (attempts === 10) {
      return NextResponse.json(
        { error: 'Failed to generate unique slug' },
        { status: 500 }
      );
    }

    const trackableUrl = await prisma.trackableUrl.create({
      data: {
        slug,
        name: name.trim(),
      },
    });

    return NextResponse.json(trackableUrl, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create trackable URL' },
      { status: 500 }
    );
  }
}
