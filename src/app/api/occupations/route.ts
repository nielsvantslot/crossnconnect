import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/occupations
 * Returns all available occupations ordered by display order
 */
export async function GET() {
  try {
    const occupations = await prisma.occupation.findMany({
      orderBy: { order: 'asc' },
      select: {
        id: true,
        name: true,
        nameEn: true,
        requiresWorkDetails: true,
      },
    });

    return NextResponse.json(occupations);
  } catch (error) {
    console.error('Failed to fetch occupations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch occupations' },
      { status: 500 }
    );
  }
}
