import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/disciplines
 * Returns all available disciplines ordered by display order
 */
export async function GET() {
  try {
    const disciplines = await prisma.discipline.findMany({
      where: { archivedAt: null },  // Only active disciplines
      orderBy: { order: 'asc' },
      select: {
        id: true,
        code: true,
        name: true,
        nameEn: true,
        isSystem: true,
      },
    });

    return NextResponse.json(disciplines);
  } catch (error) {
    console.error('Failed to fetch disciplines:', error);
    return NextResponse.json(
      { error: 'Failed to fetch disciplines' },
      { status: 500 }
    );
  }
}
