import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/industries
 * Returns all available industries ordered by display order
 */
export async function GET() {
  try {
    const industries = await prisma.industry.findMany({
      where: { archivedAt: null },  // Only active industries
      orderBy: { order: 'asc' },
      select: {
        id: true,
        code: true,
        name: true,
        nameEn: true,
        isSystem: true,
      },
    });

    return NextResponse.json(industries);
  } catch (error) {
    console.error('Failed to fetch industries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch industries' },
      { status: 500 }
    );
  }
}
